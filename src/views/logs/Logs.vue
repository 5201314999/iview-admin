<template>
    <div class="fl-container">
        <Row class="fl-content">
            <Row class="fl-table">
                <Table :columns="columns" :data="list" :loading="loading" size="large" stripe></Table>
            </Row>
            <Row class="pagination mb20">
                <span class="pagination-total">
                    共 {{ total }} 条记录 第 {{ condition.pageNum}} / {{ Math.ceil(total / condition.pageSize) }} 页
                </span>
                <Page :total="total" :current="(condition.pageNum)" :page-size="condition.pageSize" show-elevator show-sizer @on-change="setPaginationNum" @on-page-size-change="setPaginationSize"></Page>
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
                    pageNum: 1,
                    pageSize: 10,
                    projectId: this.G.projectId
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
            getLogList() {
                const vm=this;
                vm.$api.post(vm.G.api.logs, vm.condition, function (res) {
                    if (res['ret']['retCode'].toString() === '0') {
                        vm.$set(vm, 'loading', false);
                        vm.$set(vm, 'list', res.data['logRecordBeanList']);
                        vm.$set(vm, 'total', res.data.pagination.count);
                    } else {
                        vm.$error(res['ret']['retMsg']);
                        return false;
                    }
                }, function (err) {
                    vm.$error(err);
                    return false;
                });
            },
            setPaginationNum(num) {
                this.$set(this.condition, 'pageNum', num);
                this.getLogList();
            },
            setPaginationSize(size) {
                this.$set(this.condition, 'pageNum', 1);
                this.$set(this.condition, 'pageSize', size);
                this.getLogList();
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
