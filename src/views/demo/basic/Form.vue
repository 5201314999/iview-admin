<template>
    <Row class="layout-form">
        <Card>
            <Row slot="title" class="wi-card-title">
                <icon type="ios-create-outline" />
                <a href="https://www.iviewui.com/components/form" target="_blank">Form</a>
            </Row>
            <Row class="wi-form">
                <Form :model="form.validate" :rules="form.rules">
                    <!-- text -->
                    <Card>
                        <FormItem prop="input" label="输入框 ( normal )" class="wi-input wi-input-large">
                            <Input type="text" v-model="form.validate.input" placeholder="输入框默认提示信息" size="large" />
                        </FormItem>
                        <FormItem prop="icon" label="输入框 ( icon )" class="wi-input wi-input-large">
                            <Input type="text" v-model="form.validate.input" suffix="ios-search" placeholder="带 icon 图标输入框的默认提示信息" size="large" />
                        </FormItem>
                        <FormItem prop="disabled" label="输入框 ( disabled )" class="wi-input wi-input-large">
                            <Input type="text" v-model="form.validate.input" size="large" disabled />
                        </FormItem>
                        <FormItem prop="complex" label="输入框 ( complex )" class="wi-input wi-input-large">
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
                        <FormItem prop="number" label="数字框 ( normal )" class="wi-input">
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
                        <FormItem prop="radio" label="单选框 ( normal )" class="wi-radio">
                            <RadioGroup v-model="form.validate.radio.normal" size="large">
                                <Radio label="1" disabled><span>是</span></Radio>
                                <Radio label="0"><span>否</span></Radio>
                            </RadioGroup>
                        </FormItem>
                        <FormItem prop="button" label="单选框 ( button )" class="wi-radio">
                            <RadioGroup v-model="form.validate.radio.button" type="button" size="large">
                                <Radio label="北京"></Radio>
                                <Radio label="上海"></Radio>
                                <Radio label="深圳"></Radio>
                                <Radio label="杭州"></Radio>
                            </RadioGroup>
                        </FormItem>
                        <FormItem prop="custom" label="单选框 ( custom )" class="wi-radio wi-radio-custom">
                            <RadioGroup v-model="form.validate.radio.normal" size="large">
                                <Radio label="1"><span>是</span></Radio>
                                <Radio label="0"><span>否</span></Radio>
                            </RadioGroup>
                        </FormItem>
                    </Card>
                    <!-- checkbox -->
                    <Card class="mt20">
                        <FormItem prop="checkbox" label="复选框 ( normal )" class="wi-checkbox">
                            <CheckboxGroup v-model="form.validate.checkbox.normal" size="large">
                                <Checkbox label="desktop"><span>桌面端</span></Checkbox>
                                <Checkbox label="mobile"><span>手机端</span></Checkbox>
                            </CheckboxGroup>
                        </FormItem>
                        <FormItem prop="custom" label="复选框 ( custom )" class="wi-checkbox wi-checkbox-custom">
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
                        <FormItem prop="disabled" label="复选框 ( disabled )" class="wi-checkbox">
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
                        <FormItem prop="select" label="选择器 ( normal )" class="wi-select">
                            <Select v-model="form.validate.select.normal" clearable>
                                <Option value="beijing">北京</Option>
                                <Option value="shanghai">上海</Option>
                                <Option value="guangzhou">广州</Option>
                                <Option value="shenzhen">深圳</Option>
                            </Select>
                        </FormItem>
                        <FormItem prop="disabled" label="选择器 ( disabled )" class="wi-select">
                            <Select v-model="form.validate.select.normal" clearable disabled>
                                <Option value="beijing">北京</Option>
                                <Option value="shanghai">上海</Option>
                                <Option value="guangzhou">广州</Option>
                                <Option value="shenzhen">深圳</Option>
                            </Select>
                        </FormItem>
                        <FormItem prop="multiple" label="选择器 ( multiple )" class="wi-select wi-select-large">
                            <Select v-model="form.validate.select.multiple" clearable multiple>
                                <Option value="beijing">北京</Option>
                                <Option value="shanghai">上海</Option>
                                <Option value="guangzhou">广州</Option>
                                <Option value="shenzhen">深圳</Option>
                            </Select>
                        </FormItem>
                        <FormItem prop="filterable" label="选择器 ( filterable )" class="wi-select">
                            <Select v-model="form.validate.select.filter" clearable multiple filterable>
                                <Option value="北京">北京</Option>
                                <Option value="上海">上海</Option>
                                <Option value="广州">广州</Option>
                                <Option value="深圳">深圳</Option>
                            </Select>
                        </FormItem>
                    </Card>
                    <!-- textarea -->
                    <Card class="mt20">
                        <FormItem prop="textarea" label="文本域 ( normal )" class="wi-textarea">
                            <Input type="textarea" v-model="form.validate.textarea" placeholder="Enter something ......" size="large" />
                        </FormItem>
                    </Card>
                    <!-- slider -->
                    <Card class="mt20">
                        <FormItem prop="slider" label="滑块 ( normal )" class="wi-slider">
                            <Slider v-model="form.validate.slider.normal"></Slider>
                        </FormItem>
                        <FormItem prop="range" label="滑块 ( range )" class="wi-slider">
                            <Slider v-model="form.validate.slider.range" range></Slider>
                        </FormItem>
                        <FormItem prop="disabled" label="滑块 ( disabled )" class="wi-slider">
                            <Slider v-model="form.validate.slider.range" range disabled></Slider>
                        </FormItem>
                        <FormItem prop="format" label="滑块 ( format )" class="wi-slider">
                            <Slider v-model="form.validate.slider.format" :tip-format="format"></Slider>
                        </FormItem>
                    </Card>
                    <!-- switch -->
                    <Card class="mt20">
                        <FormItem prop="switch" label="开关 ( normal )" class="wi-switch">
                            <i-switch v-model="form.validate.switches" size="large" class="mr20"></i-switch>
                            <i-switch v-model="form.validate.switches" class="mr20">
                                <icon type="md-checkmark" slot="open"></icon>
                                <icon type="md-close" slot="close"></icon>
                            </i-switch>
                            <i-switch v-model="form.validate.switches" size="large" class="mr20">
                                <span slot="open">ON</span>
                                <span slot="close">OFF</span>
                            </i-switch>
                            <i-switch v-model="form.validate.switches" size="large" class="mr20" disabled></i-switch>
                            <i-switch v-model="form.validate.switches" size="large" loading></i-switch>
                        </FormItem>
                    </Card>
                </Form>
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
    const FormComponent = {
        data() {
            return {
                form: {
                    validate: {
                        input: null,
                        textarea: '',
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
                        },
                        slider: {
                            normal: 25,
                            range: [20, 50],
                            format: 20
                        },
                        switches: 'close'
                    },
                    rules: {
                        input: [{required: true, message: '文本输入框错误信息示例', trigger: 'blur'}],
                        number: [{required: true, message: '数字输入框错误信息示例', trigger: 'blur'}],
                        radio: [{required: true, message: '单选框错误信息示例', trigger: 'change'}],
                        checkbox: [{required: true, message: '复选框错误信息示例', trigger: 'change'}],
                        select: [{required: true, message: '选择器错误信息示例', trigger: 'change'}],
                    }
                },
                html: '<template>\n' +
                    '    <!-- text -->\n' +
                    '    <FormItem prop="input" label="输入框 ( normal )" class="wi-input">\n' +
                    '        <Input type="text" v-model="form.validate.input" placeholder="输入框默认提示信息" size="large" />\n' +
                    '    </FormItem>\n' +
                    '    <FormItem prop="icon" label="输入框 ( icon )" class="wi-input">\n' +
                    '        <Input type="text" v-model="form.validate.input" suffix="ios-search" placeholder="带 icon 图标输入框的默认提示信息" size="large" />\n' +
                    '    </FormItem>\n' +
                    '    <FormItem prop="disabled" label="输入框 ( disabled )" class="wi-input">\n' +
                    '        <Input type="text" v-model="form.validate.input" size="large" disabled />\n' +
                    '    </FormItem>\n' +
                    '    <FormItem prop="complex" label="输入框 ( complex )" class="wi-input">\n' +
                    '        <Input type="text" v-model="form.validate.input" size="large">\n' +
                    '            <Select v-model="form.validate.select.prepend" slot="prepend">\n' +
                    '                <Option value="http">http://</Option>\n' +
                    '                <Option value="https">https://</Option>\n' +
                    '            </Select>\n' +
                    '            <Select v-model="form.validate.select.append" slot="append">\n' +
                    '                <Option value="com">.com</Option>\n' +
                    '                <Option value="top">.top</Option>\n' +
                    '                <Option value="net">.net</Option>\n' +
                    '                <Option value="vip">.vip</Option>\n' +
                    '            </Select>\n' +
                    '        </Input>\n' +
                    '    </FormItem>\n' +
                    '    \n' +
                    '    <!-- number -->\n' +
                    '    <FormItem prop="number" label="数字框 ( normal )" class="wi-input">\n' +
                    '        <InputNumber :max="200" :min="1" :step="2" v-model="form.validate.number.normal" size="large"></InputNumber>\n' +
                    '    </FormItem>\n' +
                    '    <FormItem prop="formatter" label="数字框 ( formatter )" class="wi-input">\n' +
                    '        <InputNumber :max="10000" v-model="form.validate.number.formatter"\n' +
                    '       :formatter="value => `$ ${value}`.replace(/B(?=(d{3})+(?!d))/g, \',\')"\n' +
                    '       :parser="value => value.replace(/$s?|(,*)/g, \'\')" size="large"></InputNumber>\n' +
                    '    </FormItem>\n' +
                    '    <FormItem prop="disabled" label="数字框 ( disabled )" class="wi-input">\n' +
                    '        <InputNumber :max="100" :min="1" v-model="form.validate.number.disabled" size="large" disabled></InputNumber>\n' +
                    '    </FormItem>\n' +
                    '    \n' +
                    '    <!-- radio -->\n' +
                    '    <FormItem prop="radio" label="单选框 ( normal )" class="wi-radio">\n' +
                    '        <RadioGroup v-model="form.validate.radio.normal" size="large">\n' +
                    '            <Radio label="1" disabled><span>是</span></Radio>\n' +
                    '            <Radio label="0"><span>否</span></Radio>\n' +
                    '        </RadioGroup>\n' +
                    '    </FormItem>\n' +
                    '    <FormItem prop="button" label="单选框 ( button )" class="wi-radio">\n' +
                    '        <RadioGroup v-model="form.validate.radio.button" type="button" size="large">\n' +
                    '            <Radio label="北京"></Radio>\n' +
                    '            <Radio label="上海"></Radio>\n' +
                    '            <Radio label="深圳"></Radio>\n' +
                    '            <Radio label="杭州"></Radio>\n' +
                    '        </RadioGroup>\n' +
                    '    </FormItem>\n' +
                    '    <FormItem prop="custom" label="单选框 ( custom )" class="wi-radio wi-radio-custom">\n' +
                    '        <RadioGroup v-model="form.validate.radio.normal" size="large">\n' +
                    '            <Radio label="1"><span>是</span></Radio>\n' +
                    '            <Radio label="0"><span>否</span></Radio>\n' +
                    '        </RadioGroup>\n' +
                    '    </FormItem>\n' +
                    '    \n' +
                    '    <!-- checkbox -->\n' +
                    '    <FormItem prop="checkbox" label="复选框 ( normal )" class="wi-checkbox">\n' +
                    '        <CheckboxGroup v-model="form.validate.checkbox.normal" size="large">\n' +
                    '            <Checkbox label="desktop"><span>桌面端</span></Checkbox>\n' +
                    '            <Checkbox label="mobile"><span>手机端</span></Checkbox>\n' +
                    '        </CheckboxGroup>\n' +
                    '    </FormItem>\n' +
                    '    <FormItem prop="custom" label="复选框 ( custom )" class="wi-checkbox wi-checkbox-custom">\n' +
                    '        <CheckboxGroup v-model="form.validate.checkbox.custom" size="large">\n' +
                    '            <Checkbox label="desktop">\n' +
                    '                <span>桌面端</span>\n' +
                    '                <icon type="ios-checkmark"></icon>\n' +
                    '                <span class="wi-checkbox-arrow"></span>\n' +
                    '            </Checkbox>\n' +
                    '            <Checkbox label="mobile">\n' +
                    '                <span>手机端</span>\n' +
                    '                <icon type="ios-checkmark"></icon>\n' +
                    '                <span class="wi-checkbox-arrow"></span>\n' +
                    '            </Checkbox>\n' +
                    '        </CheckboxGroup>\n' +
                    '    </FormItem>\n' +
                    '    <FormItem prop="disabled" label="复选框 ( disabled )" class="wi-checkbox">\n' +
                    '        <CheckboxGroup v-model="form.validate.checkbox.disabled" size="large">\n' +
                    '            <Checkbox label="beijing"><span>北京</span></Checkbox>\n' +
                    '            <Checkbox label="shanghai" disabled><span>上海</span></Checkbox>\n' +
                    '            <Checkbox label="shenzhen"><span>深圳</span></Checkbox>\n' +
                    '            <Checkbox label="guangzhou"><span>广州</span></Checkbox>\n' +
                    '        </CheckboxGroup>\n' +
                    '    </FormItem>\n' +
                    '    \n' +
                    '    <!-- select -->\n' +
                    '    <FormItem prop="select" label="选择器 ( normal )" class="wi-select">\n' +
                    '        <Select v-model="form.validate.select.normal" clearable>\n' +
                    '            <Option value="beijing">北京</Option>\n' +
                    '            <Option value="shanghai">上海</Option>\n' +
                    '            <Option value="guangzhou">广州</Option>\n' +
                    '            <Option value="shenzhen">深圳</Option>\n' +
                    '        </Select>\n' +
                    '    </FormItem>\n' +
                    '    <FormItem prop="disabled" label="选择器 ( disabled )" class="wi-select">\n' +
                    '        <Select v-model="form.validate.select.normal" clearable disabled>\n' +
                    '            <Option value="beijing">北京</Option>\n' +
                    '            <Option value="shanghai">上海</Option>\n' +
                    '            <Option value="guangzhou">广州</Option>\n' +
                    '            <Option value="shenzhen">深圳</Option>\n' +
                    '        </Select>\n' +
                    '    </FormItem>\n' +
                    '    <FormItem prop="multiple" label="选择器 ( multiple )" class="wi-select">\n' +
                    '        <Select v-model="form.validate.select.multiple" clearable multiple>\n' +
                    '            <Option value="beijing">北京</Option>\n' +
                    '            <Option value="shanghai">上海</Option>\n' +
                    '            <Option value="guangzhou">广州</Option>\n' +
                    '            <Option value="shenzhen">深圳</Option>\n' +
                    '        </Select>\n' +
                    '    </FormItem>\n' +
                    '    <FormItem prop="filterable" label="选择器 ( filterable )" class="wi-select">\n' +
                    '        <Select v-model="form.validate.select.filter" clearable multiple filterable>\n' +
                    '            <Option value="北京">北京</Option>\n' +
                    '            <Option value="上海">上海</Option>\n' +
                    '            <Option value="广州">广州</Option>\n' +
                    '            <Option value="深圳">深圳</Option>\n' +
                    '        </Select>\n' +
                    '    </FormItem>\n' +
                    '    \n' +
                    '    <!-- textarea -->\n' +
                    '    <FormItem prop="textarea" label="文本域 ( normal )" class="wi-textarea">\n' +
                    '        <Input type="textarea" v-model="form.validate.textarea" placeholder="Enter something ......" size="large" />\n' +
                    '    </FormItem>\n' +
                    '    \n' +
                    '    <!-- slider -->\n' +
                    '    <FormItem prop="slider" label="滑块 ( normal )" class="wi-slider">\n' +
                    '        <Slider v-model="form.validate.slider.normal"></Slider>\n' +
                    '    </FormItem>\n' +
                    '    <FormItem prop="range" label="滑块 ( range )" class="wi-slider">\n' +
                    '        <Slider v-model="form.validate.slider.range" range></Slider>\n' +
                    '    </FormItem>\n' +
                    '    <FormItem prop="disabled" label="滑块 ( disabled )" class="wi-slider">\n' +
                    '        <Slider v-model="form.validate.slider.range" range disabled></Slider>\n' +
                    '    </FormItem>\n' +
                    '    <FormItem prop="format" label="滑块 ( format )" class="wi-slider">\n' +
                    '        <Slider v-model="form.validate.slider.format" :tip-format="format"></Slider>\n' +
                    '    </FormItem>\n' +
                    '    \n' +
                    '    <!-- switch -->\n' +
                    '    <FormItem prop="switch" label="开关 ( normal )" class="wi-switch">\n' +
                    '        <i-switch v-model="form.validate.switches" size="large" class="mr20"></i-switch>\n' +
                    '        <i-switch v-model="form.validate.switches" class="mr20">\n' +
                    '            <icon type="md-checkmark" slot="open"></icon>\n' +
                    '            <icon type="md-close" slot="close"></icon>\n' +
                    '        </i-switch>\n' +
                    '        <i-switch v-model="form.validate.switches" size="large" class="mr20">\n' +
                    '            <span slot="open">ON</span>\n' +
                    '            <span slot="close">OFF</span>\n' +
                    '        </i-switch>\n' +
                    '        <i-switch v-model="form.validate.switches" size="large" class="mr20" disabled></i-switch>\n' +
                    '        <i-switch v-model="form.validate.switches" size="large" loading></i-switch>\n' +
                    '    </FormItem>\n' +
                    '</template>\n' +
                    '<script>\n' +
                    '    const FormComponent = {\n' +
                    '        data() {\n' +
                    '            return {\n' +
                    '                form: {\n' +
                    '                    validate: {\n' +
                    '                        input: null,\n' +
                    '                        textarea: \'\',\n' +
                    '                        number: {\n' +
                    '                            normal: 1,\n' +
                    '                            formatter: 1000,\n' +
                    '                            disabled: 10000\n' +
                    '                        },\n' +
                    '                        radio: {\n' +
                    '                            normal: \'0\',\n' +
                    '                            button: \'深圳\'\n' +
                    '                        },\n' +
                    '                        checkbox: {\n' +
                    '                            normal: [],\n' +
                    '                            custom: [],\n' +
                    '                            disabled: []\n' +
                    '                        },\n' +
                    '                        select: {\n' +
                    '                            prepend: \'http\',\n' +
                    '                            append: \'com\',\n' +
                    '                            normal: \'\',\n' +
                    '                            multiple: \'\',\n' +
                    '                            filter: \'\'\n' +
                    '                        },\n' +
                    '                        slider: {\n' +
                    '                            normal: 25,\n' +
                    '                            range: [20, 50],\n' +
                    '                            format: 20\n' +
                    '                        },\n' +
                    '                        switches: \'close\'\n' +
                    '                    },\n' +
                    '                    rules: {\n' +
                    '                        input: [{required: true, message: \'文本输入框错误信息示例\', trigger: \'blur\'}],\n' +
                    '                        number: [{required: true, message: \'数字输入框错误信息示例\', trigger: \'blur\'}],\n' +
                    '                        radio: [{required: true, message: \'单选框错误信息示例\', trigger: \'change\'}],\n' +
                    '                        checkbox: [{required: true, message: \'复选框错误信息示例\', trigger: \'change\'}],\n' +
                    '                        select: [{required: true, message: \'选择器错误信息示例\', trigger: \'change\'}],\n' +
                    '                    }\n' +
                    '                }\n' +
                    '            }\n' +
                    '        },\n' +
                    '        methods: {\n' +
                    '            format(value) {\n' +
                    '                return \'Progress: \' + value + \'%\';\n' +
                    '            }\n' +
                    '        }\n' +
                    '    };\n' +
                    '    export default FormComponent;\n' +
                    '<\/script>'
            };
        },
        methods: {
            format(value) {
                return 'Progress: ' + value + '%';
            }
        }
    };
    export default FormComponent;
</script>
