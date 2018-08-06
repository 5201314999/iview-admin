<template>
    <div class="fl-container">
        <Row class="fl-content">
            <Row class="fl-table">
                <Table :columns="columns" :data="list" :loading="loading" size="large" stripe></Table>
            </Row>
            <Row class="pagination mb20">
                <span class="pagination-total">
                    共 {{ total }} 条记录 第 {{ condition.page + 1 }} / {{ Math.ceil(total / condition.pageNum) }} 页
                </span>
                <Page :total="total" :current="(condition.page + 1)" :page-size="condition.pageNum" show-elevator show-sizer @on-change="getLogList" @on-page-size-change="setPageNumber"></Page>
            </Row>
        </Row>
    </div>
</template>

<script>
    const LogsComponent = {
        data() {
            return {
                columns: [
                    {
                        title: '操作用户',
                        key: 'name',
                        width: 200,
                        align: 'center'
                    },
                    {
                        title: '操作描述',
                        key: 'operation',
                    },
                    {
                        title: '操作时间',
                        key: 'createTime',
                        width: 250,
                        render: (h, params) => {
                            return h('div', {
                                slot: 'content',
                                class: 'date'
                            }, [
                                h('p', this.formatDate(new Date(this.list[params.index]['createTime'])))
                            ]);
                        }
                    }
                ],
                condition: {
                    moduleId: '',
                    page: 0,
                    pageNum: 10,
                    projectId: this.G.projectId,
                    submoduleId: ''
                },
                total: 0,
                list: [],
                loading: true
            };
        },
        methods: {
            /**
             * get logs list.
             * @param page {*} current page.
             */
            getLogList(page) {
                const vm = this;
                if(page !== 'undefined'){
                    vm.$set(vm.condition, 'page', page - 1);
                }
                vm.$api.post(vm.G.api.logs, vm.condition, function(res){
                    if(res['ret']['retCode'].toString() === '0'){
                        vm.$set(vm, 'loading', false);
                        vm.$set(vm, 'list', res.data['logRecordBeanList']);
                        vm.$set(vm, 'total', res.data.pagination.size);
                    }else{
                        vm.$error(res['ret']['retMsg']);
                        return false;
                    }
                }, function(err){
                    vm.$error(err);
                    return false;
                });
            },

            /**
             * set page number.
             * @param number {Number} page number.
             */
            setPageNumber(number) {
                const vm = this;
                vm.$set(vm.condition, 'pageNum', number);
                vm.getLogList();
            },

            /**
             * format date.
             * @param date
             * @returns {string}
             */
            formatDate(date) {
                const y = date.getFullYear();
                let m = date.getMonth() + 1;
                m = m < 10 ? '0' + m : m;
                let d = date.getDate();
                d = d < 10 ? ('0' + d) : d;
                let h = date.getHours(),
                    min = date.getMinutes();
                h = h < 10 ? '0' + h : h;
                min = min < 10 ? '0' + min : min;
                return y + '-' + m + '-' + d + ' ' + h + ':' + min;
            }
        },
        mounted() {
            const vm = this;
            vm.getLogList();
        }
    };
    export default LogsComponent;
</script>
