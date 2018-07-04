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
                <FormItem prop="select" label="业务标签" class="clearfix">
                    <div class="fl-select">
                        <Select placeholder="请选择" value="movie" :style="{width: '100px'}">
                            <Option value="movie">影视</Option>
                            <Option value="app1">少儿</Option>
                            <Option value="app2">大屏购物</Option>
                            <Option value="app3">游戏</Option>
                            <Option value="app4">应用</Option>
                        </Select>
                    </div>
                </FormItem>
                <FormItem prop="textarea" label="推荐组标签" class="fl-textarea flex clearfix">
                    <Input type="textarea" placeholder="默认宽高 600 * 200，根据项目需求自行覆盖定义" />
                </FormItem>
                <FormItem prop="num" label="数字输入框" class="fl-number clearfix">
                    <InputNumber :min="form.validate.min" v-model="form.validate.num"></InputNumber>
                </FormItem>
                <FormItem label=" " class="fl-form-btn">
                    <Button type="primary" size="large">提交</Button>
                    <Button size="large" type="ghost">返回</Button>
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
                        range: [],
                        select: [],
                        num: 0,
                        min: 0
                    },
                    rules: {
                        name: [{required: true, message: '推荐组名称不能为空', trigger: 'blur'}],
                        title: [{required: true, trigger: 'click', message: '请选择是否展示推荐组标题',}],
                        range: [{required: true, message: '至少选择一个适用范围'}],
                        num: [{required: true, message: '至少选择一个适用范围'}]
                    }
                }
            }
        }
    };
    export default FormComponent;
</script>