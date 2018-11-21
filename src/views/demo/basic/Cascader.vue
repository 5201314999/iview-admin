<template>
    <Row class="layout-cascader">
        <Card>
            <Row slot="title" class="wi-card-title">
                <icon type="ios-create-outline" />
                <a href="https://www.iviewui.com/components/cascader" target="_blank">Cascader</a>
            </Row>
            <Card>
                <Row slot="title" class="wi-card-title">基础用法</Row>
                <Row class="wi-cascader">
                    <Col span="4">
                        <Cascader :data="normal.data" v-model="normal.value" trigger="hover" size="large"></Cascader>
                    </Col>
                </Row>
                <Row class="mt20">
                    <pre v-highlight><code>{{ code.normal }}</code></pre>
                </Row>
            </Card>
        </Card>
    </Row>
</template>
<script>
    const CascaderComponent = {
        data() {
            return {
                normal: {
                    value: [],
                    data: [{
                        value: 'beijing',
                        label: '北京',
                        children: [{
                            value: 'gugong',
                            label: '故宫'
                        }, {
                            value: 'tiantan',
                            label: '天坛'
                        }, {
                            value: 'wangfujing',
                            label: '王府井'
                        }]
                    }, {
                        value: 'jiangsu',
                        label: '江苏',
                        children: [{
                            value: 'nanjing',
                            label: '南京',
                            children: [{
                                value: 'fuzimiao',
                                label: '夫子庙'
                            }]
                        }, {
                            value: 'suzhou',
                            label: '苏州',
                            children: [{
                                value: 'zhuozhengyuan',
                                label: '拙政园'
                            }, {
                                value: 'shizilin',
                                label: '狮子林'
                            }]
                        }]
                    }]
                },
                code: {
                    normal: '<template>\n' +
                        '    <Row class="wi-cascader">\n' +
                        '        <Col span="4"><Cascader :data="normal.data" v-model="normal.value" size="large"></Cascader></Col>\n' +
                        '    </Row>\n' +
                        '</template>\n' +
                        '<script>\n' +
                        '    const CascaderComponent = {\n' +
                        '        data() {\n' +
                        '            return {\n' +
                        '                normal: {\n' +
                        '                    value: [],\n' +
                        '                    data: [{\n' +
                        '                        value: \'beijing\',\n' +
                        '                        label: \'北京\',\n' +
                        '                        children: [{\n' +
                        '                            value: \'gugong\',\n' +
                        '                            label: \'故宫\'\n' +
                        '                        }, {\n' +
                        '                            value: \'tiantan\',\n' +
                        '                            label: \'天坛\'\n' +
                        '                        }, {\n' +
                        '                            value: \'wangfujing\',\n' +
                        '                            label: \'王府井\'\n' +
                        '                        }]\n' +
                        '                    }, {\n' +
                        '                        value: \'jiangsu\',\n' +
                        '                        label: \'江苏\',\n' +
                        '                        children: [{\n' +
                        '                            value: \'nanjing\',\n' +
                        '                            label: \'南京\',\n' +
                        '                            children: [{\n' +
                        '                                value: \'fuzimiao\',\n' +
                        '                                label: \'夫子庙\'\n' +
                        '                            }]\n' +
                        '                        }, {\n' +
                        '                            value: \'suzhou\',\n' +
                        '                            label: \'苏州\',\n' +
                        '                            children: [{\n' +
                        '                                value: \'zhuozhengyuan\',\n' +
                        '                                label: \'拙政园\'\n' +
                        '                            }, {\n' +
                        '                                value: \'shizilin\',\n' +
                        '                                label: \'狮子林\'\n' +
                        '                            }]\n' +
                        '                        }]\n' +
                        '                    }]\n' +
                        '                }\n' +
                        '            };\n' +
                        '        }\n' +
                        '    };\n' +
                        '    export default CascaderComponent;\n' +
                        '<\/script>'
                }
            };
        }
    };
    export default CascaderComponent;
</script>
