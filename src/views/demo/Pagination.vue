<template>
    <div class="fl-container">
        <Row class="fl-content clearfix">
            <Row class="pagination mb20">
                    <span class="pagination-total">
                        共 {{ total }} 条记录 第 {{ pagination.pageNum }} / {{ Math.ceil(total/pagination.pageSize) }} 页
                    </span>
                <Page :total="total" :current="pagination.pageNum" :page-size="pagination.pageSize" show-elevator show-sizer @on-change="setPaginationNum" @on-page-size-change="setPaginationSize"></Page>
            </Row>
        </Row>
        <Card class="mt20">
            <Row slot="title">
                <icon type="code" class="mr5"></icon>代码
            </Row>
            <pre v-highlight><code>{{ html }}</code></pre>
        </Card>
    </div>
</template>

<script>
    const PaginationComponent = {
        data() {
            return {
                pagination: {
                    pageNum: 1,
                    pageSize: 20
                },
                total: 200,
                html: '<div class="fl-container">\n' +
                '   <div class="fl-content clearfix">\n' +
                '       <Row class="pagination mb20">\n' +
                '           <span class="pagination-total">\n' +
                '               共 {{ total }} 条记录 第 {{ pagination.pageNum }} / {{ Math.ceil(total/pagination.pageSize) }} 页\n' +
                '           </span>\n' +
                '           <Page :total="total" :current="pagination.pageNum" :page-size="pagination.pageSize" show-elevator\n' +
                '           show-sizer @on-change="setPaginationNum" @on-page-size-change="setPaginationSize"></Page>\n' +
                '       </Row>\n' +
                '   </div>\n' +
                '</div>\n\n' +
                '<script>\n' +
                '    const PaginationComponent = {\n' +
                '        data() {\n' +
                '            return {\n' +
                '                pagination: {\n' +
                '                    pageNum: 1,\n' +
                '                    pageSize: 20\n' +
                '                },\n' +
                '                total: 200\n' +
                '            }\n' +
                '        },\n' +
                '        methods: {\n' +
                '            setPaginationSize(size) {\n' +
                '                this.$set(this.pagination, \'pageSize\', size);\n' +
                '            },\n' +
                '            setPaginationNum(num) {\n' +
                '                this.$set(this.pagination, \'pageNum\', num);\n' +
                '            }\n' +
                '        }\n' +
                '    };\n' +
                '    export default PaginationComponent;\n' +
                '<\/script>'
            }
        },
        methods: {
            setPaginationSize(size) {
                this.$set(this.pagination, 'pageSize', size);
            },
            setPaginationNum(num) {
                this.$set(this.pagination, 'pageNum', num);
            }
        }
    };
    export default PaginationComponent;
</script>
