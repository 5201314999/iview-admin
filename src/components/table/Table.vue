<template>
	<div class="wi-table-card" style="margin-top:0px">
        <div class="wi-search-panel" v-show="searchTable">
            <div class="wi-search">
                <Input class="wi-search-input"
                       v-model="searchParams.mix"
                       @on-change="search"
                       :placeholder="placeholder"
                       style="max-width:288px;" size="large">
                <Icon type="ios-search" slot="suffix"/>
                </Input>
            </div>
            <Button type="primary" class="s-btn-defalut" @click="handleClickBtn" v-if="addText!==''">{addText}}</Button>
        </div>
        <Row class="wi-table s-table">
            <Table :columns="columns"
                   :data="list"
                   size="large"
                   :loading="tableLoading" stripe
                   @on-sort-change="sortTable">
            </Table>
            <Row class="wi-pagination">
                <span class="pagination-total">
                    共 {{ total }} 条记录 第 {{ pagination.pageNum }} / {{ Math.ceil(total / pagination.pageSize) }} 页
                </span>
                <Page :total="total"
                      :current="pagination.pageNum"
                      :page-size="pagination.pageSize"
                      @on-chang e="setPaginationNum"
                      @on-page-size-change="setPaginationSize"
                      show-elevator show-sizer>
                </Page>
            </Row>
        </Row>
    </div>
</template>
<script>
	const CustomTableComponent = {
	    name: 'CustomTable',
		props: {
	        placeholder: {
                type: String,
                default: ''
            },
            addText: {
                type: String,
                default: ''
            },
            value: {
                type: Array,
                default: () => []
            },
            columns: {
                type: Array,
                default: () => []
            },
            searchTable: {
                type: Boolean,
                default: true,
            },
            searchFields: {
                type: Array,
                default: () => []
            },
			options: {
                type: Object,
            },
            tableLoading: {
                type: Boolean,
                default: false
            }
		},
		data() {
	        let searchParams = {};
            this.options.sortTable && (searchParams.sortFields = this.options.sortFields.map(e => {
                return {
                    field: e,
                    order: 'DESC'
                }
            }));
            /**
             * 多个排序用sortIndex 选定用sortFields[sortIndex]字段排序
             * realKey 案例：分类名称，实际上匹配的是分类id
             */
            searchParams.sortFields && (searchParams.sortIndex = 0);
            this.options['filterTable'] && (searchParams.filterFields = this.options.filterFields.map(e => {
                return {
                    field: e['realKey'],
                    key: e.key,
                    valueList: []
                }
            }));
            // 筛选新方案
            let copyColumns = this.columns;
            this.options['filterTable'] && this.options.filterFields.forEach(e => {
                let index = copyColumns.findIndex(item => {
                    return item.key === e.key
                });
                if (index > -1) {
                    copyColumns[index].filterRemote = (params) => {
                        this.filterRemote(params, e['realKey']);
                    }
                }

            });
            this.searchTable && (searchParams.mix = '');
            return {
                searchParams: searchParams,
                copyColumns: copyColumns,
                pagination: {
                    pageNum: 1,
                    pageSize: 10
                },
                list: [],
                total: 0,
            }
		},
		watch: {
            immediate: true,
            value(newList) {
                // 处理下分页,如果最后一页只有一条，删除最后一条页数减1
                this.pagination.pageNum > 1 && (this.pagination.pageNum - 1) * this.pagination.pageSize >= newList.length && --this.pagination.pageNum;
                this.getData();
            }
        },
		methods: {
	        search() {
                this.$set(this.pagination, 'pageNum', 1);
                this.getData();
            },
			getData() {
                const vm = this;
                let tempArr = [];
                vm.searchParams.pageNum = this.pagination.pageNum;
                vm.searchParams.pageSize = this.pagination.pageSize;
                // 筛选框 & 搜索框
                for (let i = 0; i < this.value.length; i++) {
                    const row = this.value[i];
                    // 筛选框
                    if (vm.searchParams.filterFields) {
                        let j;
                        for (j = 0; j < vm.searchParams.filterFields.length; j++) {
                            const item = vm.searchParams.filterFields[j];
                            // []不进行筛选，算通过
                            if (item.valueList.length > 0) {
                                const obj = item.valueList.find(val => {
                                    return row[item.field] === val
                                });
                                if (typeof obj === 'undefined') {
                                    break;
                                }
                            }
                        }
                        // 筛选框不满足全部进入下一个
                        if (j < vm.searchParams.filterFields.length) {
                            continue;
                        }
                    }
                    // 搜索框
                    if (vm.searchTable && vm.searchParams.mix !== '') {
                        if (this.searchFields) {
                            let j;
                            for (j = 0; j < this.searchFields.length; j++) {
                                const key = this.searchFields[j];
                                if (row[key].toString().indexOf(vm.searchParams.mix) > -1) {
                                    break;
                                }
                            }
                            // 不符合
                            if (j >= this.searchFields.length) {
                                continue;
                            }
                        }
                    }
                    tempArr.push(row);
                }
                // 排序
                if (vm.searchParams.sortFields) {
                    const sortItem = vm.searchParams.sortFields[vm.searchParams.sortIndex];
                    let compare;
                    if (sortItem.order === 'DESC') {
                        compare = function (aObj, bObj) {
                            if (aObj[sortItem.field] > bObj[sortItem.field]) {
                                return -1;
                            }
                            else if (aObj[sortItem.field] === bObj[sortItem.field]) {
                                return 0;
                            }
                            else {
                                return 1;
                            }
                        }
                    } else {
                        compare = function (aObj, bObj) {
                            if (aObj[sortItem.field] > bObj[sortItem.field]) {
                                return 1;
                            }
                            else if (aObj[sortItem.field] === bObj[sortItem.field]) {
                                return 0;
                            }
                            else {
                                return -1;
                            }
                        }
                    }
                    tempArr.sort(compare);
                }
                // 修改total
                this.total = tempArr.length;
                // 截取出其中一页
                const start = (vm.searchParams.pageNum - 1) * vm.searchParams.pageSize;
                const temp = vm.searchParams.pageNum * vm.searchParams.pageSize - 1;
                const end = temp < tempArr.length ? temp + 1 : tempArr.length;
                this.list = tempArr.slice(start, end);
                this.$emit('input', this.value);
            },
			handleClickBtn() {
                this.$emit('on-btn-click');
            },
            setPaginationSize(size) {
                this.$set(this.pagination, 'pageSize', size);
                this.getData();
            },
            setPaginationNum(num) {
                this.$set(this.pagination, 'pageNum', num);
                this.getData();
            },
            sortTable(params) {
                // 不需要排序
                if (!this.options.sortTable) {
                    return;
                }
                const index = this.searchParams.sortFields.findIndex(e => {
                    return e.field === params.key;
                });
                if (index > -1) {
                    this.searchParams.sortIndex = index;
                    this.searchParams.sortFields[index].order = params.order === 'normal' ? 'DESC' : params.order.toUpperCase();
                }
                this.getData();
            },
            filterRemote(params, key) {
                const index = this.searchParams.filterFields.findIndex(e => {
                    return e.field === key;
                });
                if (index > -1) {
                    this.searchParams.filterFields[index].valueList = params;
                    this.getData();
                }
            }
		}
	};
    export default CustomTableComponent;
</script>