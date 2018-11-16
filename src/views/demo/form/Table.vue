<template>
    <Row class="layout-table">
        <Card>
            <Row slot="title" class="wi-card-title">
                <icon type="ios-color-wand-outline" />
                <a href="https://www.iviewui.com/components/table" target="_blank">Table 表格</a>
            </Row>
            <Row class="wi-table">
                <Table :columns="columns" size="large" stripe>

                </Table>
            </Row>
        </Card>
    </Row>
</template>
<script>
    const TableComponent = {
        data() {
            return {
                loading: true,
                pagination: {
                    size: 20,
                    current: 1
                },
                list: [],
                columns: [
                    {
                        title: 'ID',
                        key: 'id',
                        width: 120,
                        align: 'center'
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
                        ]
                    }
                ]
            };
        }
    };
    export default TableComponent;
</script>
