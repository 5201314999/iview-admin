<template>
    <Row class="layout-pagination">
        <Card>
            <Row slot="title" class="wi-card-title">
                <icon type="ios-color-wand-outline" />
                <a href="https://www.iviewui.com/components/page" target="_blank">Page</a>
            </Row>
            <Row class="wi-pagination center mb20">
                <span class="pagination-total">
                    共 {{ total }} 条记录 第 {{ pagination.pageNum }} / {{ Math.ceil(total / pagination.pageSize) }} 页
                </span>
                <Page :total="total" :current="pagination.pageNum" :page-size="pagination.pageSize" @on-change="setPaginationNum" @on-page-size-change="setPaginationSize" show-elevator show-sizer></Page>
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
    const PaginationComponent = {
        data() {
            return {
                pagination: {
                    pageNum: 1,
                    pageSize: 10
                },
                total: 200,
                html: '<template>\n' +
                    '   <Row class="wi-pagination">\n' +
                    '       <span class="pagination-total">\n' +
                    '           共 {{ total }} 条记录 第 {{ pagination.pageNum }} / {{ Math.ceil(total / pagination.pageSize) }} 页\n' +
                    '       </span>\n' +
                    '       <Page :total="total" :current="pagination.pageNum" :page-size="pagination.pageSize" @on-change="setPaginationNum"\n' +
                    '       @on-page-size-change="setPaginationSize" show-elevator show-sizer></Page>\n' +
                    '   </Row>\n' +
                    '</template>\n' +
                    '<script>\n' +
                    '    const PaginationComponent = {\n' +
                    '        data() {\n' +
                    '            return {\n' +
                    '                pagination: {\n' +
                    '                    pageNum: 1,\n' +
                    '                    pageSize: 10\n' +
                    '                },\n' +
                    '                total: 200\n' +
                    '            };\n' +
                    '        },\n' +
                    '        methods: {\n' +
                    '            setPaginationNum(num) {\n' +
                    '                const vm = this;\n' +
                    '                vm.$set(vm.pagination, \'pageNum\', num);\n' +
                    '            },\n' +
                    '            setPaginationSize(size) {\n' +
                    '                const vm = this;\n' +
                    '                vm.$set(vm.pagination, \'pageSize\', size);\n' +
                    '            }\n' +
                    '        }\n' +
                    '    };\n' +
                    '    export default PaginationComponent;\n' +
                    '<\/script>'
            };
        },
        methods: {
            setPaginationNum(num) {
                const vm = this;
                vm.$set(vm.pagination, 'pageNum', num);
            },
            setPaginationSize(size) {
                const vm = this;
                vm.$set(vm.pagination, 'pageSize', size);
            }
        }
    };
    export default PaginationComponent;
</script>
