<template>
    <div class="fl-container">
        <div class="fl-content">
            <Row class="fl-table">
                <Table :columns="columns" :data="list" :loading="loading" size="large" stripe></Table>
            </Row>
        </div>
    </div>
</template>

<script>

    const TableComponent = {
        data() {
            return {
                pagination: {
                    pageNum: 1,
                    pageSize: 20
                },
                columns: [
                    {
                        title: 'ID',
                        key: 'id',
                        width: 120,
                        align: 'center'
                    },
                    {title: '页面标题', key: 'title'},
                    {
                        title: '标签',
                        key: 'tab',
                        width: 120,
                        filters: [
                            {label: '影视', value: '影视'},
                            {label: '应用', value: '应用'},
                            {label: '音乐', value: '音乐'}
                        ],
                        filterMethod(value, row) {
                            return row.tab.indexOf(value) > -1;
                        }
                    },
                    {
                        title: '状态',
                        key: 'state',
                        width: 100,
                        filters: [
                            {label: '上线', value: '1'},
                            {label: '下线', value: '0'}
                        ],
                        filterMethod(value, row) {
                            return parseInt(row.state) === parseInt(value);
                        },
                        render: (h, params) => {
                            return h('span', {
                                    class: this.list[params.index].state === '0'
                                        ? 'red' : 'green'
                                }, this.list[params.index].state === '0'
                                ? '下线'
                                : '上线'
                            );
                        }
                    },
                    {
                        title: '操作时间',
                        key: 'date',
                        width: 280,
                        sortable: true,
                        render: (h, params) => {
                            return h('div', {
                                slot: 'content',
                                class: 'date'
                            }, [
                                h('p', '创建：' + this.formatDate(new Date(this.list[params.index]['createTime'])) + ' ' + this.list[params.index]['creator']),
                                h('p', '更新：' + this.formatDate(new Date(this.list[params.index]['updateTime'])) + ' ' + this.list[params.index]['updater'])
                            ]);
                        }
                    },
                    {
                        title: '管理操作',
                        key: 'action',
                        width: 150,
                        render: (h, params) => {
                            return h('div', {
                                slot: 'content',
                                class: 'action'
                            }, [
                                h('span', {
                                    on: {
                                        click: () => {
                                            let args = {id: params.row.id};
                                            this.$router.push({
                                                name: 'detail',
                                                params: args
                                            })
                                        }
                                    }
                                }, '查看'),
                                h('Poptip', {
                                    props: {
                                        trigger: 'hover',
                                        placement: 'bottom'
                                    }
                                }, [
                                    h('span', [
                                        '更多',
                                        h('icon', {props: {type: 'ios-arrow-down'}})
                                    ]),
                                    h('div', {
                                        slot: 'content'
                                    }, [
                                        h('a', {
                                            class: 'act-item',
                                            on: {
                                                click: () => {
                                                    let state = '1',
                                                        index = params.index,
                                                        id = this.list[index].id,
                                                        title = this.list[index].title,
                                                        isOff = state === '0';
                                                    this.setState(id, state, isOff, index, title);
                                                }
                                            }
                                        }, this.list[params.index].state === '0'
                                            ? '上线' : '下线'),
                                        h('a', {
                                            class: 'act-item'
                                        }, '修改'),
                                        h('a', {
                                            class: 'act-item',
                                            on: {
                                                click: () => {
                                                    let id = this.list[params.index].id,
                                                        title = this.list[params.index].title;
                                                    this.deleteData(id, title);
                                                }
                                            }
                                        }, '删除')
                                    ])
                                ])
                            ]);
                        }
                    }
                ],
                list: [],
                loading: true,
                headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'}
            }
        },
        mounted() {
            this.getData();
        },
        methods: {
            getData() {
                let that = this;
                this.$api.post(this.G.api.pages.list, {
                    idOrTitle: null,
                    regionCode: null,
                    modelId: null,
                    state: null,
                    sortMark: 'desc',
                    pagination: that.pagination
                }, function(res){
                    if(res['ret']['retCode'] === '0'){
                        let data = res.data,
                            pagination = data.pagination;
                        that.list = res.data.pages;
                        that.total = pagination.count;
                        that.loading = false;
                    }else{

                    }
                }, function(err){
                    console.log(err);
                });
            },
            deleteData(id, title) {
                let that = this,
                    content = '确定删除当前所选的页面 <span class="red">[ ' + title + ' ]</span>',
                    url = this.G.api.pages.delete + '/' + id;
                this.$confirm(content, function(){
                    this.$api.delete(url, {}, function(res){
                        if(res['ret']['retCode'].toString() === '0'){
                            setTimeout(function(){
                                that.$success('删除成功', null, 280);
                                that.getData();
                            }, 300);
                        }
                    }, function(err){

                    }, {headers: this.headers});
                });
            },
            setState(id, state, isOff, index, title) {
                if(parseInt(id) > 0){
                    let that = this;
                    let update = function(){
                        let params = {'page-id': id, 'state': state},
                            url = that.parseUrl(that.G.api.pages.state, params);
                        if(isOff){
                            that.$set(that.list[index], 'state', '1');
                        }else{
                            that.$set(that.list[index], 'state', '0');
                        }
                        console.log(url);
                    };
                    if(isOff){
                        update();
                    }else{
                        let content = '确定下线当前所选页面 <span class="red">[ ' + title + ' ]</span>';
                        this.$confirm(content, function(){
                            update();
                        }, null);
                    }
                }else{

                }
            },
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
        }
    };

    export default TableComponent;

</script>