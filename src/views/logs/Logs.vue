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
                <Page :total="total" :current="(condition.page + 1)" :page-size="condition.pageNum" show-elevator show-sizer @on-change="getLogList" @on-page-size-change="getLogList"></Page>
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
                        width: 150,
                        align: 'center'
                    },
                    {
                        title: '操作描述',
                        key: 'operation',
                    },
                    {
                        title: '操作时间',
                        key: 'createTime',
                        width: 250
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
        created() {
            const vm = this;
            vm.$api.post(vm.G.api.logs, vm.condition, function(res){
                if(res['ret']['retCode'].toString() === '0'){
                    vm.$set(vm, 'list', res.data['logRecordBeanList']);
                    vm.$set(vm, 'total', res.pagination.size);
                }else{
                    vm.$error(res['ret']['retMsg']);
                    return false;
                }
            }, function(err){
                vm.$error(err);
                return false;
            });
        },
        methods: {
            getLogList() {

            }
        }
    };
    export default LogsComponent;
</script>
