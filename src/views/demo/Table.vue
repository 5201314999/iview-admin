<template>
    <div class="fl-container">
        <div class="fl-content">
            <Row class="fl-table">
                <Table :columns="columns" :data="list" :loading="loading" size="large" stripe></Table>
            </Row>
        </div>
        <Card class="mt20">
            <Row slot="title">
                <icon type="code" class="mr5"></icon>代码示例
            </Row>
            <Row v-highlight>
                <pre><code lang="html">{{ content }}</code></pre>
            </Row>
        </Card>
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
                headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'},
                content: '<div class="fl-container">\n' +
                '    <div class="fl-content">\n' +
                '        <Row class="fl-table">\n' +
                '            <Table :columns="columns" :data="list" :loading="loading" size="large" stripe></Table>\n' +
                '        </Row>\n' +
                '    </div>\n' +
                '</div>\n\n' +
                '<script>\n' +
                '    const TableComponent = {\n' +
                '        data() {\n' +
                '            return {\n' +
                '                pagination: {\n' +
                '                    pageNum: 1,\n' +
                '                    pageSize: 20\n' +
                '                },\n' +
                '                columns: [\n' +
                '                    {\n' +
                '                        title: \'ID\',\n' +
                '                        key: \'id\',\n' +
                '                        width: 120,\n' +
                '                        align: \'center\'\n' +
                '                    },\n' +
                '                    {title: \'页面标题\', key: \'title\'},\n' +
                '                    {\n' +
                '                        title: \'标签\',\n' +
                '                        key: \'tab\',\n' +
                '                        width: 120,\n' +
                '                        filters: [\n' +
                '                            {label: \'影视\', value: \'影视\'},\n' +
                '                            {label: \'应用\', value: \'应用\'},\n' +
                '                            {label: \'音乐\', value: \'音乐\'}\n' +
                '                        ],\n' +
                '                        filterMethod(value, row) {\n' +
                '                            return row.tab.indexOf(value) > -1;\n' +
                '                        }\n' +
                '                    },\n' +
                '                    {\n' +
                '                        title: \'状态\',\n' +
                '                        key: \'state\',\n' +
                '                        width: 100,\n' +
                '                        filters: [\n' +
                '                            {label: \'上线\', value: \'1\'},\n' +
                '                            {label: \'下线\', value: \'0\'}\n' +
                '                        ],\n' +
                '                        filterMethod(value, row) {\n' +
                '                            return parseInt(row.state) === parseInt(value);\n' +
                '                        },\n' +
                '                        render: (h, params) => {\n' +
                '                            return h(\'span\', {\n' +
                '                                    class: this.list[params.index].state === \'0\'\n' +
                '                                        ? \'red\' : \'green\'\n' +
                '                                }, this.list[params.index].state === \'0\'\n' +
                '                                ? \'下线\'\n' +
                '                                : \'上线\'\n' +
                '                            );\n' +
                '                        }\n' +
                '                    },\n' +
                '                    {\n' +
                '                        title: \'操作时间\',\n' +
                '                        key: \'date\',\n' +
                '                        width: 280,\n' +
                '                        sortable: true,\n' +
                '                        render: (h, params) => {\n' +
                '                            return h(\'div\', {\n' +
                '                                slot: \'content\',\n' +
                '                                class: \'date\'\n' +
                '                            }, [\n' +
                '                                h(\'p\', \'创建：\' + this.formatDate(new Date(this.list[params.index][\'createTime\']))\n' +
                '                                   + \' \' + this.list[params.index][\'creator\']),\n' +
                '                                h(\'p\', \'更新：\' + this.formatDate(new Date(this.list[params.index][\'updateTime\']))\n' +
                '                                   + \' \' + this.list[params.index][\'updater\'])\n' +
                '                            ]);\n' +
                '                        }\n' +
                '                    },\n' +
                '                    {\n' +
                '                        title: \'管理操作\',\n' +
                '                        key: \'action\',\n' +
                '                        width: 150,\n' +
                '                        render: (h, params) => {\n' +
                '                            return h(\'div\', {\n' +
                '                                slot: \'content\',\n' +
                '                                class: \'action\'\n' +
                '                            }, [\n' +
                '                                h(\'span\', {\n' +
                '                                    on: {\n' +
                '                                        click: () => {\n' +
                '                                            let args = {id: params.row.id};\n' +
                '                                            this.$router.push({\n' +
                '                                                name: \'detail\',\n' +
                '                                                params: args\n' +
                '                                            })\n' +
                '                                        }\n' +
                '                                    }\n' +
                '                                }, \'查看\'),\n' +
                '                                h(\'Poptip\', {\n' +
                '                                    props: {\n' +
                '                                        trigger: \'hover\',\n' +
                '                                        placement: \'bottom\'\n' +
                '                                    }\n' +
                '                                }, [\n' +
                '                                    h(\'span\', [\n' +
                '                                        \'更多\',\n' +
                '                                        h(\'icon\', {props: {type: \'ios-arrow-down\'}})\n' +
                '                                    ]),\n' +
                '                                    h(\'div\', {\n' +
                '                                        slot: \'content\'\n' +
                '                                    }, [\n' +
                '                                        h(\'a\', {\n' +
                '                                            class: \'act-item\',\n' +
                '                                            on: {\n' +
                '                                                click: () => {\n' +
                '                                                    let state = \'1\',\n' +
                '                                                        index = params.index,\n' +
                '                                                        id = this.list[index].id,\n' +
                '                                                        title = this.list[index].title,\n' +
                '                                                        isOff = state === \'0\';\n' +
                '                                                    this.setState(id, state, isOff, index, title);\n' +
                '                                                }\n' +
                '                                            }\n' +
                '                                        }, this.list[params.index].state === \'0\'\n' +
                '                                            ? \'上线\' : \'下线\'),\n' +
                '                                        h(\'a\', {\n' +
                '                                            class: \'act-item\'\n' +
                '                                        }, \'修改\'),\n' +
                '                                        h(\'a\', {\n' +
                '                                            class: \'act-item\',\n' +
                '                                            on: {\n' +
                '                                                click: () => {\n' +
                '                                                    let id = this.list[params.index].id,\n' +
                '                                                        title = this.list[params.index].title;\n' +
                '                                                    this.deleteData(id, title);\n' +
                '                                                }\n' +
                '                                            }\n' +
                '                                        }, \'删除\')\n' +
                '                                    ])\n' +
                '                                ])\n' +
                '                            ]);\n' +
                '                        }\n' +
                '                    }\n' +
                '                ],\n' +
                '                list: [],\n' +
                '                loading: true,\n' +
                '                headers: {\'Content-Type\': \'application/x-www-form-urlencoded;charset=utf-8\'}\n' +
                '            }\n' +
                '        },\n' +
                '        mounted() {\n' +
                '            this.getData();\n' +
                '        },\n' +
                '        methods: {\n' +
                '            getData() {\n' +
                '                let that = this;\n' +
                '                this.$api.post(this.G.api.pages.list, {\n' +
                '                    idOrTitle: null,\n' +
                '                    regionCode: null,\n' +
                '                    modelId: null,\n' +
                '                    state: null,\n' +
                '                    sortMark: \'desc\',\n' +
                '                    pagination: that.pagination\n' +
                '                }, function(res){\n' +
                '                    if(res[\'ret\'][\'retCode\'] === \'0\'){\n' +
                '                        let data = res.data,\n' +
                '                            pagination = data.pagination;\n' +
                '                        that.list = res.data.pages;\n' +
                '                        that.total = pagination.count;\n' +
                '                        that.loading = false;\n' +
                '                    }else{\n' +
                '\n' +
                '                    }\n' +
                '                }, function(err){\n' +
                '                    console.log(err);\n' +
                '                });\n' +
                '            },\n' +
                '            deleteData(id, title) {\n' +
                '                let that = this,\n' +
                '                    content = \'确定删除当前所选的页面 <span class="red">[ \' + title + \' ]</span>\',\n' +
                '                    url = this.G.api.pages.delete + \'/\' + id;\n' +
                '                this.$confirm(content, function(){\n' +
                '                    this.$api.delete(url, {}, function(res){\n' +
                '                        if(res[\'ret\'][\'retCode\'].toString() === \'0\'){\n' +
                '                            setTimeout(function(){\n' +
                '                                that.$success(\'删除成功\', null, 280);\n' +
                '                                that.getData();\n' +
                '                            }, 300);\n' +
                '                        }\n' +
                '                    }, function(err){\n' +
                '\n' +
                '                    }, {headers: this.headers});\n' +
                '                });\n' +
                '            },\n' +
                '            setState(id, state, isOff, index, title) {\n' +
                '                if(parseInt(id) > 0){\n' +
                '                    let that = this;\n' +
                '                    let update = function(){\n' +
                '                        let params = {\'page-id\': id, \'state\': state},\n' +
                '                            url = that.parseUrl(that.G.api.pages.state, params);\n' +
                '                        if(isOff){\n' +
                '                            that.$set(that.list[index], \'state\', \'1\');\n' +
                '                        }else{\n' +
                '                            that.$set(that.list[index], \'state\', \'0\');\n' +
                '                        }\n' +
                '                        console.log(url);\n' +
                '                    };\n' +
                '                    if(isOff){\n' +
                '                        update();\n' +
                '                    }else{\n' +
                '                        let content = \'确定下线当前所选页面 <span class="red">[ \' + title + \' ]</span>\';\n' +
                '                        this.$confirm(content, function(){\n' +
                '                            update();\n' +
                '                        }, null);\n' +
                '                    }\n' +
                '                }else{\n' +
                '\n' +
                '                }\n' +
                '            },\n' +
                '            formatDate(date) {\n' +
                '                const y = date.getFullYear();\n' +
                '                let m = date.getMonth() + 1;\n' +
                '                m = m < 10 ? \'0\' + m : m;\n' +
                '                let d = date.getDate();\n' +
                '                d = d < 10 ? (\'0\' + d) : d;\n' +
                '                let h = date.getHours(),\n' +
                '                    min = date.getMinutes();\n' +
                '                h = h < 10 ? \'0\' + h : h;\n' +
                '                min = min < 10 ? \'0\' + min : min;\n' +
                '                return y + \'-\' + m + \'-\' + d + \' \' + h + \':\' + min;\n' +
                '            }\n' +
                '        }\n' +
                '    };\n' +
                '    export default TableComponent;\n' +
                '<\/script>'
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