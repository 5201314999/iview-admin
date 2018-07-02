<template>
    <div class="fl-container">
        <div class="fl-content clearfix">
            <Row class="pagination">
                <span class="pagination-total">
                    共 {{ total }} 条记录 第 {{ pagination.pageNum }} / {{ Math.ceil(total/pagination.pageSize) }} 页
                </span>
                <Page :total="total" :current="pagination.pageNum" :page-size="pagination.pageSize" show-elevator show-sizer @on-change="setPaginationNum" @on-page-size-change="setPaginationSize"></Page>
            </Row>
        </div>
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
                total: 200
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