<template>
    <div class="fl-container">
        <div class="fl-content">
            <Form :model="form.data" :rules="form.rules">
                <FormItem prop="name" label="推荐组名称">
                    <Row class="form-input">
                        <Col>
                            <Input type="text" v-model="form.data.name" placeholder="输入框提示" size="large" />
                        </Col>
                    </Row>
                </FormItem>
                <FormItem prop="title" label="展示组标题">
                </FormItem>
            </Form>
        </div>
    </div>
</template>

<script>

    const FormComponent = {
        data() {
            return {
                form: {
                    data: {
                        name: ''
                    },
                    rules: {
                        name: [{required: true, message: '推荐组名称不能为空', trigger: 'blur'}],
                        title: [{required: true, message: '请选择推荐组标题'}]
                    },
                    radio: [

                    ]
                }
            }
        }
    };
    export default FormComponent;
</script>