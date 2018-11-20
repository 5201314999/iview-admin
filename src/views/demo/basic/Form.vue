<template>
    <Row class="layout-form">
        <Card>
            <Row slot="title" class="wi-card-title">
                <icon type="ios-create-outline" /> Form
            </Row>
            <Row class="wi-form">
                <Form :model="form.validate" :rules="form.rules">
                    <!-- text -->
                    <Card>
                        <FormItem prop="normal" label="输入框 ( normal )" class="wi-input">
                            <Input type="text" v-model="form.validate.input" placeholder="输入框默认提示信息" size="large" />
                        </FormItem>
                        <FormItem prop="icon" label="输入框 ( icon )" class="wi-input">
                            <Input type="text" v-model="form.validate.input" suffix="ios-search" placeholder="带 icon 图标输入框的默认提示信息" size="large" />
                        </FormItem>
                        <FormItem prop="disabled" label="输入框 ( disabled )" class="wi-input">
                            <Input type="text" v-model="form.validate.input" size="large" disabled />
                        </FormItem>
                        <FormItem prop="complex" label="输入框 ( complex )" class="wi-input">
                            <Input type="text" v-model="form.validate.input" size="large">
                                <Select v-model="form.validate.select.prepend" slot="prepend">
                                    <Option value="http">http://</Option>
                                    <Option value="https">https://</Option>
                                </Select>
                                <Select v-model="form.validate.select.append" slot="append">
                                    <Option value="com">.com</Option>
                                    <Option value="top">.top</Option>
                                    <Option value="net">.net</Option>
                                    <Option value="vip">.vip</Option>
                                </Select>
                            </Input>
                        </FormItem>
                    </Card>
                    <!-- number -->
                    <Card class="mt20">
                        <FormItem prop="normal" label="数字框 ( normal )" class="wi-input">
                            <InputNumber :max="200" :min="1" :step="2" v-model="form.validate.number.normal" size="large"></InputNumber>
                        </FormItem>
                        <FormItem prop="formatter" label="数字框 ( formatter )" class="wi-input">
                            <InputNumber :max="10000" v-model="form.validate.number.formatter" :formatter="value => `$ ${value}`.replace(/B(?=(d{3})+(?!d))/g, ',')" :parser="value => value.replace(/$s?|(,*)/g, '')" size="large"></InputNumber>
                        </FormItem>
                        <FormItem prop="disabled" label="数字框 ( disabled )" class="wi-input">
                            <InputNumber :max="100" :min="1" v-model="form.validate.number.disabled" size="large" disabled></InputNumber>
                        </FormItem>
                    </Card>
                    <!-- radio -->
                    <Card class="mt20">
                        <FormItem prop="normal" label="单选框 ( normal )" class="wi-radio">
                            <RadioGroup v-model="form.validate.radio.normal" size="large">
                                <Radio label="1" disabled><span>是</span></Radio>
                                <Radio label="0"><span>否</span></Radio>
                            </RadioGroup>
                        </FormItem>
                        <FormItem prop="normal" label="单选框 ( button )" class="wi-radio">
                            <RadioGroup v-model="form.validate.radio.button" type="button" size="large">
                                <Radio label="北京"></Radio>
                                <Radio label="上海"></Radio>
                                <Radio label="深圳"></Radio>
                                <Radio label="杭州"></Radio>
                            </RadioGroup>
                        </FormItem>
                        <FormItem prop="normal" label="单选框 ( custom )" class="wi-radio wi-radio-custom">
                            <RadioGroup v-model="form.validate.radio.normal" size="large">
                                <Radio label="1"><span>是</span></Radio>
                                <Radio label="0"><span>否</span></Radio>
                            </RadioGroup>
                        </FormItem>
                    </Card>
                    <!-- checkbox -->
                    <Card class="mt20">
                        <FormItem prop="normal" label="复选框 ( normal )" class="wi-checkbox">
                            <CheckboxGroup v-model="form.validate.checkbox.normal" size="large">
                                <Checkbox label="desktop"><span>桌面端</span></Checkbox>
                                <Checkbox label="mobile"><span>手机端</span></Checkbox>
                            </CheckboxGroup>
                        </FormItem>
                        <FormItem prop="normal" label="复选框 ( custom )" class="wi-checkbox wi-checkbox-custom">
                            <CheckboxGroup v-model="form.validate.checkbox.custom" size="large">
                                <Checkbox label="desktop">
                                    <span>桌面端</span>
                                    <icon type="ios-checkmark"></icon>
                                    <span class="wi-checkbox-arrow"></span>
                                </Checkbox>
                                <Checkbox label="mobile">
                                    <span>手机端</span>
                                    <icon type="ios-checkmark"></icon>
                                    <span class="wi-checkbox-arrow"></span>
                                </Checkbox>
                            </CheckboxGroup>
                        </FormItem>
                        <FormItem prop="normal" label="复选框 ( disabled )" class="wi-checkbox">
                            <CheckboxGroup v-model="form.validate.checkbox.disabled" size="large">
                                <Checkbox label="beijing"><span>北京</span></Checkbox>
                                <Checkbox label="shanghai" disabled><span>上海</span></Checkbox>
                                <Checkbox label="shenzhen"><span>深圳</span></Checkbox>
                                <Checkbox label="guangzhou"><span>广州</span></Checkbox>
                            </CheckboxGroup>
                        </FormItem>
                    </Card>
                    <!-- select -->
                    <Card class="mt20">
                        <FormItem prop="normal" label="选择器 ( normal )" class="wi-select">
                            <Select v-model="form.validate.select.normal" clearable>
                                <Option value="beijing">北京</Option>
                                <Option value="shanghai">上海</Option>
                                <Option value="guangzhou">广州</Option>
                                <Option value="shenzhen">深圳</Option>
                            </Select>
                        </FormItem>
                        <FormItem prop="normal" label="选择器 ( disabled )" class="wi-select">
                            <Select v-model="form.validate.select.normal" clearable disabled>
                                <Option value="beijing">北京</Option>
                                <Option value="shanghai">上海</Option>
                                <Option value="guangzhou">广州</Option>
                                <Option value="shenzhen">深圳</Option>
                            </Select>
                        </FormItem>
                        <FormItem prop="normal" label="选择器 ( multiple )" class="wi-select">
                            <Select v-model="form.validate.select.multiple" clearable multiple>
                                <Option value="beijing">北京</Option>
                                <Option value="shanghai">上海</Option>
                                <Option value="guangzhou">广州</Option>
                                <Option value="shenzhen">深圳</Option>
                            </Select>
                        </FormItem>
                        <FormItem prop="normal" label="选择器 ( filterable )" class="wi-select">
                            <Select v-model="form.validate.select.filter" clearable multiple filterable>
                                <Option value="北京">北京</Option>
                                <Option value="上海">上海</Option>
                                <Option value="广州">广州</Option>
                                <Option value="深圳">深圳</Option>
                            </Select>
                        </FormItem>
                    </Card>
                </Form>
            </Row>
        </Card>
    </Row>
</template>
<script>
    const FormComponent = {
        data() {
            return {
                form: {
                    validate: {
                        input: null,
                        number: {
                            normal: 1,
                            formatter: 1000,
                            disabled: 10000
                        },
                        radio: {
                            normal: '0',
                            button: '深圳'
                        },
                        checkbox: {
                            normal: [],
                            custom: [],
                            disabled: []
                        },
                        select: {
                            prepend: 'http',
                            append: 'com',
                            normal: '',
                            multiple: '',
                            filter: ''
                        }
                    },
                    rules: {}
                }
            };
        }
    };
    export default FormComponent;
</script>
