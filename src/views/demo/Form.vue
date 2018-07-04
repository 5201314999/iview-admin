<template>
    <div class="fl-container">
        <div class="fl-content">
            <Form :model="form.validate" :rules="form.rules">
                <FormItem prop="name" label="推荐组名称" class="clearfix">
                    <Row class="form-input">
                        <Col>
                            <Input type="text" v-model="form.validate.name" placeholder="输入框提示" size="large" />
                        </Col>
                    </Row>
                </FormItem>
                <FormItem prop="title" label="展示组标题" class="clearfix">
                    <div class="fl-radio">
                        <RadioGroup v-model="form.validate.show">
                            <Radio label="1"><span>是</span></Radio>
                            <Radio label="0"><span>否</span></Radio>
                        </RadioGroup>
                    </div>
                </FormItem>
                <FormItem prop="range" label="适用范围" class="clearfix">
                    <div class="fl-checkbox">
                        <CheckboxGroup v-model="form.validate.range">
                            <Checkbox label="desktop">
                                <span>桌面端</span>
                                <icon type="ios-checkmark-empty"></icon>
                                <span class="fl-checkbox-arrow"></span>
                            </Checkbox>
                            <Checkbox label="mobile">
                                <span>手机端</span>
                                <icon type="ios-checkmark-empty"></icon>
                                <span class="fl-checkbox-arrow"></span>
                            </Checkbox>
                        </CheckboxGroup>
                    </div>
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
                    validate: {
                        name: '',
                        title: '',
                        show: '1',
                        range: []
                    },
                    rules: {
                        name: [{required: true, message: '推荐组名称不能为空', trigger: 'blur'}],
                        title: [{required: true, trigger: 'click', message: '请选择是否展示推荐组标题',}],
                        range: [{required: true}]
                    }
                }
            }
        }
    };
    export default FormComponent;
</script>