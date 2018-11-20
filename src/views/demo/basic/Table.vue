<template>
    <Row class="layout-table">
        <Card>
            <Row slot="title" class="wi-card-title">
                <icon type="ios-color-wand-outline" />
                <a href="https://www.iviewui.com/components/table" target="_blank">Table</a>
            </Row>
            <Row class="wi-table mb15">
                <Table :columns="columns" :data="list" size="large" :loading="loading" stripe></Table>
                <Row class="wi-pagination">
                    <span class="pagination-total">
                        共 {{ total }} 条记录 第 {{ pagination.pageNum }} / {{ Math.ceil(total / pagination.pageSize) }} 页
                    </span>
                    <Page :total="total" :current="pagination.pageNum" :page-size="pagination.pageSize" @on-change="setPaginationNum" @on-page-size-change="setPaginationSize" show-elevator show-sizer></Page>
                </Row>
            </Row>
        </Card>
        <Card class="mt20">
            <Row slot="title" class="wi-card-title">
                <icon type="ios-code-working" /> 代码
            </Row>
            <pre v-highlight><code>{{ html }}</code></pre>
        </Card>
    </Row>
</template>
<script>
    const TableComponent = {
        data() {
            return {
                loading: true,
                pagination: {
                    pageNum: 1,
                    pageSize: 10
                },
                total: 0,
                icons: [
                    '/F17/01/000/c9025509-0291-41cc-8b0b-0b1e1c3baf0a.jpg',
                    '/F17/03/000/1431088b-88c2-412d-97f7-d799942248f9.jpg',
                    '/F17/03/000/ed0d5768-478e-4970-a56b-9709f172c3ec.jpg',
                    '/F17/03/000/915ebd60-6f08-47bc-81fd-11a749fe03b4.jpg',
                    '/F17/03/000/4ab0ccba-ffad-45a5-b462-37c93a83a14b.jpg',
                    '/F17/03/000/273e9998-71db-4b3b-a530-98ea7882e326.jpg',
                    '/F17/03/000/1845a8e8-7922-418c-890f-759d50c20a62.jpg',
                    '/F17/01/000/d5c54829-b3aa-4bc6-97ee-1dbe7f454f3d.jpg',
                    '/F17/03/000/5efcbc71-5f84-4f98-a406-0c85545d19da.jpg',
                    '/F17/04/100/27d667c5-ff6e-43fa-96c4-c98028c4b796.jpg',
                    '/F17/04/100/dd62986e-7b6b-4579-8f77-16662a0cf240.jpg',
                    '/F17/04/100/d20819b9-bb86-4444-bc08-ef68f5c5a00c.jpeg',
                    '/F17/04/100/8b0652fe-65b2-47d4-a3e6-b03abdbbdd9b.jpeg',
                    '/F17/04/100/df04f85a-4cf1-44e0-a0a6-803176caf0af.jpeg',
                    '/F17/04/100/1fc26b5b-f5ce-4538-a97a-0a898e46d7ae.jpeg'
                ],
                list: [],
                columns: [
                    {
                        title: 'ID',
                        key: 'id',
                        width: 100,
                        align: 'center'
                    },
                    {
                        title: '图标',
                        key: 'icon',
                        align: 'center',
                        width: 120,
                        render: (h, params) => {
                            return h('div', {
                                slot: 'content',
                                class: 'image',
                                directives: [{
                                    name: 'viewer'
                                }]
                            }, [
                                h('img', {attrs: {
                                    src: params.row.icon,
                                    title: params.row.title
                                }})
                            ]);
                        }
                    },
                    {
                        title: '标题',
                        key: 'title'
                    },
                    {
                        title: '标签',
                        key: 'tab',
                        width: 120,
                        filters: [
                            {label: '影视', value: 1},
                            {label: '应用', value: 2},
                            {label: '音乐', value: 3}
                        ],
                        filterMethod(value, row) {
                            return row.tab.indexOf(value) > -1;
                        }
                    },
                    {
                        title: '状态',
                        key: 'state',
                        width: 120,
                        filters: [
                            {label: '上线', value: '1'},
                            {label: '下线', value: '0'}
                        ],
                        filterMethod(value, row) {
                            return parseInt(row.state) === parseInt(value);
                        },
                        render: (h, params) => {
                            return h('span', {
                                class: params.row.state === '0'
                                    ? 'red' : 'green'
                            }, params.row.state === '0'
                                ? '下线' : '上线');
                        }
                    },
                    {
                        title: '时间',
                        key: 'date',
                        width: 280,
                        sortable: true,
                        render: (h, params) => {
                            const vm = this,
                                creator = params.row['creator']
                                    ? params.row['creator'] : '-',
                                ctime = vm.formatDate(new Date(params.row['createTime'])),
                                updater = params.row['updater']
                                    ? params.row['updater'] : '-',
                                utime = vm.formatDate(new Date(params.row['updateTime']));
                            return h('div', {
                                slot: 'content',
                                class: 'date'
                            }, [
                                h('p', '创建：' + ctime + ' ' + creator),
                                h('p', '更新：' + utime + ' ' + updater)
                            ]);
                        }
                    },
                    {
                        title: '操作',
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
                                            const vm = this,
                                                args = {id: params.row.id};
                                            vm.$router.push({
                                                name: 'detail',
                                                params: args
                                            });
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
                                            class: 'action-item',
                                            on: {
                                                click: () => {
                                                    const vm = this,
                                                        state = '1',
                                                        i = params.index,
                                                        id = vm.list[i].id,
                                                        title = vm.list[i].title;
                                                    let off = state === '0';
                                                    vm.setState(id, state, off, i, title);
                                                }
                                            }
                                        }, this.list[params.index].state === '0'
                                            ? '上线' : '下线'),
                                        h('a', {
                                            class: 'action-item'
                                        }, '修改'),
                                        h('a', {
                                            class: 'action-item',
                                            on: {
                                                click: () => {
                                                    const vm = this,
                                                        id = params.row.id,
                                                        title = params.row.title;
                                                    vm.deleteData(id, title);
                                                }
                                            }
                                        }, '删除')
                                    ])
                                ])
                            ]);
                        }
                    }
                ],
                html: '<template>\n' +
                    '    <Row class="wi-table mb15">\n' +
                    '        <Table :columns="columns" :data="list" size="large" :loading="loading" stripe></Table>\n' +
                    '        <Row class="wi-pagination">\n' +
                    '           <span class="pagination-total">\n' +
                    '               共 {{ total }} 条记录 第 {{ pagination.pageNum }} / {{ Math.ceil(total / pagination.pageSize) }} 页\n' +
                    '           </span>\n' +
                    '           <Page :total="total" :current="pagination.pageNum" :page-size="pagination.pageSize" @on-change="setPaginationNum"\n' +
                    '           @on-page-size-change="setPaginationSize" show-elevator show-sizer></Page>\n' +
                    '        </Row>\n' +
                    '    </Row>\n' +
                    '</template>\n' +
                    '<script>\n' +
                    '    const TableComponent = {\n' +
                    '        data() {\n' +
                    '            return {\n' +
                    '                loading: true,\n' +
                    '                pagination: {\n' +
                    '                    pageNum: 1,\n' +
                    '                    pageSize: 10\n' +
                    '                },\n' +
                    '                total: 0,\n' +
                    '                icons: [\n' +
                    '                    \'/F17/01/000/c9025509-0291-41cc-8b0b-0b1e1c3baf0a.jpg\',\n' +
                    '                    \'/F17/03/000/1431088b-88c2-412d-97f7-d799942248f9.jpg\',\n' +
                    '                    \'/F17/03/000/ed0d5768-478e-4970-a56b-9709f172c3ec.jpg\',\n' +
                    '                    \'/F17/03/000/915ebd60-6f08-47bc-81fd-11a749fe03b4.jpg\',\n' +
                    '                    \'/F17/03/000/4ab0ccba-ffad-45a5-b462-37c93a83a14b.jpg\',\n' +
                    '                    \'/F17/03/000/273e9998-71db-4b3b-a530-98ea7882e326.jpg\',\n' +
                    '                    \'/F17/03/000/1845a8e8-7922-418c-890f-759d50c20a62.jpg\',\n' +
                    '                    \'/F17/01/000/d5c54829-b3aa-4bc6-97ee-1dbe7f454f3d.jpg\',\n' +
                    '                    \'/F17/03/000/5efcbc71-5f84-4f98-a406-0c85545d19da.jpg\',\n' +
                    '                    \'/F17/04/100/27d667c5-ff6e-43fa-96c4-c98028c4b796.jpg\',\n' +
                    '                    \'/F17/04/100/dd62986e-7b6b-4579-8f77-16662a0cf240.jpg\',\n' +
                    '                    \'/F17/04/100/d20819b9-bb86-4444-bc08-ef68f5c5a00c.jpeg\',\n' +
                    '                    \'/F17/04/100/8b0652fe-65b2-47d4-a3e6-b03abdbbdd9b.jpeg\',\n' +
                    '                    \'/F17/04/100/df04f85a-4cf1-44e0-a0a6-803176caf0af.jpeg\',\n' +
                    '                    \'/F17/04/100/1fc26b5b-f5ce-4538-a97a-0a898e46d7ae.jpeg\'\n' +
                    '                ],\n' +
                    '                list: [],\n' +
                    '                columns: [\n' +
                    '                    {\n' +
                    '                        title: \'ID\',\n' +
                    '                        key: \'id\',\n' +
                    '                        width: 100,\n' +
                    '                        align: \'center\'\n' +
                    '                    },\n' +
                    '                    {\n' +
                    '                        title: \'图标\',\n' +
                    '                        key: \'icon\',\n' +
                    '                        align: \'center\',\n' +
                    '                        width: 120,\n' +
                    '                        render: (h, params) => {\n' +
                    '                            return h(\'div\', {\n' +
                    '                                slot: \'content\',\n' +
                    '                                class: \'image\',\n' +
                    '                                directives: [{\n' +
                    '                                    name: \'viewer\'\n' +
                    '                                }]\n' +
                    '                            }, [\n' +
                    '                                h(\'img\', {attrs: {\n' +
                    '                                    src: params.row.icon,\n' +
                    '                                    title: params.row.title\n' +
                    '                                }})\n' +
                    '                            ]);\n' +
                    '                        }\n' +
                    '                    },\n' +
                    '                    {\n' +
                    '                        title: \'标题\',\n' +
                    '                        key: \'title\'\n' +
                    '                    },\n' +
                    '                    {\n' +
                    '                        title: \'标签\',\n' +
                    '                        key: \'tab\',\n' +
                    '                        width: 120,\n' +
                    '                        filters: [\n' +
                    '                            {label: \'影视\', value: 1},\n' +
                    '                            {label: \'应用\', value: 2},\n' +
                    '                            {label: \'音乐\', value: 3}\n' +
                    '                        ]\n' +
                    '                    },\n' +
                    '                    {\n' +
                    '                        title: \'状态\',\n' +
                    '                        key: \'state\',\n' +
                    '                        width: 120,\n' +
                    '                        filters: [\n' +
                    '                            {label: \'上线\', value: \'1\'},\n' +
                    '                            {label: \'下线\', value: \'0\'}\n' +
                    '                        ],\n' +
                    '                        filterMethod(value, row) {\n' +
                    '                            return parseInt(row.state) === parseInt(value);\n' +
                    '                        },\n' +
                    '                        render: (h, params) => {\n' +
                    '                            return h(\'span\', {\n' +
                    '                                class: params.row.state === \'0\'\n' +
                    '                                    ? \'red\' : \'green\'\n' +
                    '                            }, params.row.state === \'0\'\n' +
                    '                                ? \'下线\' : \'上线\');\n' +
                    '                        }\n' +
                    '                    },\n' +
                    '                    {\n' +
                    '                        title: \'时间\',\n' +
                    '                        key: \'date\',\n' +
                    '                        width: 280,\n' +
                    '                        sortable: true,\n' +
                    '                        render: (h, params) => {\n' +
                    '                            const vm = this,\n' +
                    '                                creator = params.row[\'creator\']\n' +
                    '                                    ? params.row[\'creator\'] : \'-\',\n' +
                    '                                ctime = vm.formatDate(new Date(params.row[\'createTime\'])),\n' +
                    '                                updater = params.row[\'updater\']\n' +
                    '                                    ? params.row[\'updater\'] : \'-\',\n' +
                    '                                utime = vm.formatDate(new Date(params.row[\'updateTime\']));\n' +
                    '                            return h(\'div\', {\n' +
                    '                                slot: \'content\',\n' +
                    '                                class: \'date\'\n' +
                    '                            }, [\n' +
                    '                                h(\'p\', \'创建：\' + ctime + \' \' + creator),\n' +
                    '                                h(\'p\', \'更新：\' + utime + \' \' + updater)\n' +
                    '                            ]);\n' +
                    '                        }\n' +
                    '                    },\n' +
                    '                    {\n' +
                    '                        title: \'操作\',\n' +
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
                    '                                            const vm = this,\n' +
                    '                                                args = {id: params.row.id};\n' +
                    '                                            vm.$router.push({\n' +
                    '                                                name: \'detail\',\n' +
                    '                                                params: args\n' +
                    '                                            });\n' +
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
                    '                                            class: \'action-item\',\n' +
                    '                                            on: {\n' +
                    '                                                click: () => {\n' +
                    '                                                    const vm = this,\n' +
                    '                                                        state = \'1\',\n' +
                    '                                                        i = params.index,\n' +
                    '                                                        id = vm.list[i].id,\n' +
                    '                                                        title = vm.list[i].title;\n' +
                    '                                                    let off = state === \'0\';\n' +
                    '                                                    vm.setState(id, state, off, i, title);\n' +
                    '                                                }\n' +
                    '                                            }\n' +
                    '                                        }, this.list[params.index].state === \'0\'\n' +
                    '                                            ? \'上线\' : \'下线\'),\n' +
                    '                                        h(\'a\', {\n' +
                    '                                            class: \'action-item\'\n' +
                    '                                        }, \'修改\'),\n' +
                    '                                        h(\'a\', {\n' +
                    '                                            class: \'action-item\',\n' +
                    '                                            on: {\n' +
                    '                                                click: () => {\n' +
                    '                                                    const vm = this,\n' +
                    '                                                        id = params.row.id,\n' +
                    '                                                        title = params.row.title;\n' +
                    '                                                    vm.deleteData(id, title);\n' +
                    '                                                }\n' +
                    '                                            }\n' +
                    '                                        }, \'删除\')\n' +
                    '                                    ])\n' +
                    '                                ])\n' +
                    '                            ]);\n' +
                    '                        }\n' +
                    '                    }\n' +
                    '                ]\n' +
                    '            };\n' +
                    '        },\n' +
                    '        methods: {\n' +
                    '            getList() {\n' +
                    '                const vm = this,\n' +
                    '                    length = vm.icons.length,\n' +
                    '                    list = [];\n' +
                    '                vm.$set(vm, \'total\', length);\n' +
                    '                for(let i = 0; i < length; i++){\n' +
                    '                    if(i < vm.pagination.pageNum * vm.pagination.pageSize){\n' +
                    '                        if(i >= (vm.pagination.pageNum - 1) * vm.pagination.pageSize){\n' +
                    '                            list.push({\n' +
                    '                                id: i + 1,\n' +
                    '                                icon: vm.G.files.server.download + vm.icons[i],\n' +
                    '                                title: \'精选推荐\',\n' +
                    '                                tab: \'影视\',\n' +
                    '                                creator: \'李荣通\',\n' +
                    '                                createTime: 1542608271000 + (i * 1000),\n' +
                    '                                updater: \'李荣通\',\n' +
                    '                                updateTime: 1542608271000 + (i * 1000)\n' +
                    '                            });\n' +
                    '                        }\n' +
                    '                    }\n' +
                    '                }\n' +
                    '                vm.$set(vm, \'list\', list);\n' +
                    '                vm.$set(vm, \'loading\', false);\n' +
                    '            },\n' +
                    '            setPaginationNum(num) {\n' +
                    '                const vm = this;\n' +
                    '                vm.$set(vm.pagination, \'pageNum\', num);\n' +
                    '                vm.getList();\n' +
                    '            },\n' +
                    '            setPaginationSize(size) {\n' +
                    '                const vm = this;\n' +
                    '                vm.$set(vm.pagination, \'pageSize\', size);\n' +
                    '                vm.getList();\n' +
                    '            }\n' +
                    '        },\n' +
                    '        mounted() {\n' +
                    '            const vm = this;\n' +
                    '            vm.getList();\n' +
                    '        }\n' +
                    '    };\n' +
                    '    export default TableComponent;\n' +
                    '<\/script>'
            };
        },
        methods: {
            getList() {
                const vm = this,
                    length = vm.icons.length,
                    list = [];
                vm.$set(vm, 'total', length);
                for(let i = 0; i < length; i++){
                    if(i < vm.pagination.pageNum * vm.pagination.pageSize){
                        if(i >= (vm.pagination.pageNum - 1) * vm.pagination.pageSize){
                            list.push({
                                id: i + 1,
                                icon: vm.G.files.server.download + vm.icons[i],
                                title: '精选推荐',
                                tab: '影视',
                                creator: '李荣通',
                                createTime: 1542608271000 + (i * 1000),
                                updater: '李荣通',
                                updateTime: 1542608271000 + (i * 1000)
                            });
                        }
                    }
                }
                vm.$set(vm, 'list', list);
                vm.$set(vm, 'loading', false);
            },
            setPaginationNum(num) {
                const vm = this;
                vm.$set(vm.pagination, 'pageNum', num);
                vm.getList();
            },
            setPaginationSize(size) {
                const vm = this;
                vm.$set(vm.pagination, 'pageSize', size);
                vm.getList();
            }
        },
        mounted() {
            const vm = this;
            vm.getList();
        }
    };
    export default TableComponent;
</script>
