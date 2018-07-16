<template>
    <div class="fl-container">
        <div class="fl-content">
            <Form :model="form.validate" :rules="form.rules">
                <FormItem prop="name" label="推荐组名称" class="fl-input clearfix">
                    <Row class="form-input">
                        <Col>
                            <Input type="text" v-model="form.validate.name" placeholder="输入框提示" size="large" />
                        </Col>
                    </Row>
                </FormItem>
                <FormItem prop="title" label="展示组标题" class="fl-radio clearfix">
                    <RadioGroup v-model="form.validate.show">
                        <Radio label="1"><span>是</span></Radio>
                        <Radio label="0"><span>否</span></Radio>
                    </RadioGroup>
                </FormItem>
                <FormItem prop="range" label="适用范围" class="fl-checkbox clearfix">
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
                </FormItem>
                <FormItem prop="select" label="业务标签" class="fl-select clearfix">
                    <Select placeholder="请选择" value="movie" :style="{width: '100px'}">
                        <Option value="movie">影视</Option>
                        <Option value="app1">少儿</Option>
                        <Option value="app2">大屏购物</Option>
                        <Option value="app3">游戏</Option>
                        <Option value="app4">应用</Option>
                    </Select>
                </FormItem>
                <FormItem prop="textarea" label="推荐组标签" class="fl-textarea flex clearfix">
                    <Input type="textarea" placeholder="默认宽高 600 * 200，根据项目需求自行覆盖定义" />
                </FormItem>
                <FormItem prop="num" label="数字输入框" class="fl-number clearfix">
                    <InputNumber :min="form.validate.min" v-model="form.validate.num"></InputNumber>
                </FormItem>
                <FormItem prop="date" label="日期选择" class="fl-date">
                    <DatePicker size="large" type="date"></DatePicker>
                </FormItem>
                <FormItem prop="images" label="图片上传" class="fl-upload flex clearfix">
                    <div class="fl-upload-list" v-for="item in uploadList">
                        <template v-if="item.status === 'finished'">
                            <img :src="item.url">
                            <div class="fl-upload-list-cover">
                                <Icon type="ios-eye-outline" @click.native="handleView(item.url)"></Icon>
                                <Icon type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>
                            </div>
                        </template>
                        <template v-else>
                            <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
                        </template>
                    </div>
                    <Upload
                            ref="upload"
                            action="http://10.130.201.73/wildidea/demo/upload/upload.php"
                            :show-upload-list="false"
                            :default-file-list="defaultList"
                            :on-success="handleSuccess"
                            :format="['jpg', 'jpeg', 'gif', 'png']"
                            :max-size="10240"
                            :on-format-error="handleFormatError"
                            :on-exceeded-size="handleMaxSize"
                            :before-upload="handleBeforeUpload"
                            :accept="G.accept.images"
                            multiple
                            type="drag">
                        <div class="fl-upload-btn flex flex-center">
                            <Icon type="ios-cloud-upload-outline"></Icon>
                            <p>上传图片</p>
                        </div>
                    </Upload>
                    <div class="fl-upload-tips">
                        图片上传格式支持PNG, JPG, JPEG, GIF
                    </div>
                    <Modal title="查看大图" v-model="visible" class-name="fl-image-modal">
                        <img :src="imgUrl" v-if="visible" style="width: 100%">
                    </Modal>
                </FormItem>
                <FormItem label=" " class="fl-btn">
                    <Button type="primary" size="large">提交</Button>
                    <Button size="large" type="ghost">返回</Button>
                </FormItem>
            </Form>
        </div>
        <Card class="mt20">
            <Row slot="title">
                <icon type="code" class="mr5"></icon>代码
            </Row>
            <Row v-highlight>
                <pre><code lang="html">{{ html }}</code></pre>
            </Row>
        </Card>
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
                        show: '0',
                        range: ['desktop'],
                        select: [],
                        num: 0,
                        min: 0
                    },
                    rules: {
                        name: [{required: true, message: '推荐组名称不能为空', trigger: 'blur'}],
                        title: [{required: true, trigger: 'click', message: '请选择是否展示组标题'}],
                        range: [{required: true, message: '至少选择一个适用范围'}],
                    }
                },
                imgUrl: '',
                visible: false,
                uploadList: [],
                defaultList: [],
                html: '<div class="fl-container">\n' +
                '    <div class="fl-content">\n' +
                '        <Form :model="form.validate" :rules="form.rules">\n' +
                '            <FormItem prop="name" label="推荐组名称" class="fl-input clearfix">\n' +
                '                <Row class="form-input">\n' +
                '                    <Col>\n' +
                '                        <Input type="text" v-model="form.validate.name" placeholder="输入框提示" size="large" />\n' +
                '                    </Col>\n' +
                '                </Row>\n' +
                '            </FormItem>\n' +
                '            <FormItem prop="title" label="展示组标题" class="fl-radio clearfix">\n' +
                '                <RadioGroup v-model="form.validate.show">\n' +
                '                    <Radio label="1"><span>是</span></Radio>\n' +
                '                    <Radio label="0"><span>否</span></Radio>\n' +
                '                </RadioGroup>\n' +
                '            </FormItem>\n' +
                '            <FormItem prop="range" label="适用范围" class="fl-checkbox clearfix">\n' +
                '                <CheckboxGroup v-model="form.validate.range">\n' +
                '                    <Checkbox label="desktop">\n' +
                '                        <span>桌面端</span>\n' +
                '                        <icon type="ios-checkmark-empty"></icon>\n' +
                '                        <span class="fl-checkbox-arrow"></span>\n' +
                '                    </Checkbox>\n' +
                '                    <Checkbox label="mobile">\n' +
                '                        <span>手机端</span>\n' +
                '                        <icon type="ios-checkmark-empty"></icon>\n' +
                '                        <span class="fl-checkbox-arrow"></span>\n' +
                '                    </Checkbox>\n' +
                '                </CheckboxGroup>\n' +
                '            </FormItem>\n' +
                '            <FormItem prop="select" label="业务标签" class="fl-select clearfix">\n' +
                '                <Select placeholder="请选择" value="movie" :style="{width: \'100px\'}">\n' +
                '                    <Option value="movie">影视</Option>\n' +
                '                    <Option value="app1">少儿</Option>\n' +
                '                    <Option value="app2">大屏购物</Option>\n' +
                '                    <Option value="app3">游戏</Option>\n' +
                '                    <Option value="app4">应用</Option>\n' +
                '                </Select>\n' +
                '            </FormItem>\n' +
                '            <FormItem prop="textarea" label="推荐组标签" class="fl-textarea flex clearfix">\n' +
                '                <Input type="textarea" placeholder="默认宽高 600 * 200，根据项目需求自行覆盖定义" />\n' +
                '            </FormItem>\n' +
                '            <FormItem prop="num" label="数字输入框" class="fl-number clearfix">\n' +
                '                <InputNumber :min="form.validate.min" v-model="form.validate.num"></InputNumber>\n' +
                '            </FormItem>\n' +
                '            <FormItem prop="date" label="日期选择" class="fl-date">\n' +
                '                <DatePicker size="large" type="date"></DatePicker>\n' +
                '            </FormItem>\n' +
                '            <FormItem prop="images" label="图片上传" class="fl-upload flex clearfix">\n' +
                '                <div class="fl-upload-list" v-for="item in uploadList">\n' +
                '                    <template v-if="item.status === \'finished\'">\n' +
                '                        <img :src="item.url">\n' +
                '                        <div class="fl-upload-list-cover">\n' +
                '                            <Icon type="ios-eye-outline" @click.native="handleView(item.url)"></Icon>\n' +
                '                            <Icon type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>\n' +
                '                        </div>\n' +
                '                    </template>\n' +
                '                    <template v-else>\n' +
                '                        <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>\n' +
                '                    </template>\n' +
                '                </div>\n' +
                '                <Upload\n' +
                '                        ref="upload"\n' +
                '                        action="http://10.130.201.73/wildidea/demo/upload/upload.php"\n' +
                '                        :show-upload-list="false"\n' +
                '                        :default-file-list="defaultList"\n' +
                '                        :on-success="handleSuccess"\n' +
                '                        :format="[\'jpg\', \'jpeg\', \'gif\', \'png\']"\n' +
                '                        :max-size="10240"\n' +
                '                        :on-format-error="handleFormatError"\n' +
                '                        :on-exceeded-size="handleMaxSize"\n' +
                '                        :before-upload="handleBeforeUpload"\n' +
                '                        :accept="G.accept.images"\n' +
                '                        multiple\n' +
                '                        type="drag">\n' +
                '                    <div class="fl-upload-btn flex flex-center">\n' +
                '                        <Icon type="ios-cloud-upload-outline"></Icon>\n' +
                '                        <p>上传图片</p>\n' +
                '                    </div>\n' +
                '                </Upload>\n' +
                '                <div class="fl-upload-tips">\n' +
                '                    图片上传格式支持PNG, JPG, JPEG, GIF\n' +
                '                </div>\n' +
                '                <Modal title="查看大图" v-model="visible" class-name="fl-image-modal">\n' +
                '                    <img :src="imgUrl" v-if="visible" style="width: 100%">\n' +
                '                </Modal>\n' +
                '            </FormItem>\n' +
                '            <FormItem label=" " class="fl-btn">\n' +
                '                <Button type="primary" size="large">提交</Button>\n' +
                '                <Button size="large" type="ghost">返回</Button>\n' +
                '            </FormItem>\n' +
                '        </Form>\n' +
                '    </div>\n' +
                '</div>\n' +
                '<script>\n' +
                '    const FormComponent = {\n' +
                '        data() {\n' +
                '            return {\n' +
                '                form: {\n' +
                '                    validate: {\n' +
                '                        name: \'\',\n' +
                '                        title: \'\',\n' +
                '                        show: \'0\',\n' +
                '                        range: [\'desktop\'],\n' +
                '                        select: [],\n' +
                '                        num: 0,\n' +
                '                        min: 0\n' +
                '                    },\n' +
                '                    rules: {\n' +
                '                        name: [{required: true, message: \'推荐组名称不能为空\', trigger: \'blur\'}],\n' +
                '                        title: [{required: true, trigger: \'click\', message: \'请选择是否展示组标题\'}],\n' +
                '                        range: [{required: true, message: \'至少选择一个适用范围\'}],\n' +
                '                    }\n' +
                '                },\n' +
                '                imgUrl: \'\',\n' +
                '                visible: false,\n' +
                '                uploadList: [],\n' +
                '                defaultList: []\n' +
                '            }\n' +
                '        },\n' +
                '        methods: {\n' +
                '            handleSuccess(res, file) {\n' +
                '                file.url = res.url;\n' +
                '                file.name = res.name;\n' +
                '            },\n' +
                '            handleRemove(file) {\n' +
                '                const fileList = this.$refs.upload.fileList;\n' +
                '                this.$refs.upload.fileList.splice(fileList.indexOf(file), 1);\n' +
                '            },\n' +
                '            handleFormatError(file) {\n' +
                '                this.$Notice.warning({\n' +
                '                    title: \'The file format is incorrect\',\n' +
                '                    desc: \'File format of \' + file.name + \' is incorrect, please select jpg or png.\'\n' +
                '                });\n' +
                '            },\n' +
                '            handleMaxSize(file) {\n' +
                '                this.$Notice.warning({\n' +
                '                    title: \'Exceeding file size limit\',\n' +
                '                    desc: \'File  \' + file.name + \' is too large, no more than 2M.\'\n' +
                '                });\n' +
                '            },\n' +
                '            handleBeforeUpload() {\n' +
                '                const check = this.uploadList.length < 1;\n' +
                '                if (!check) {\n' +
                '                    this.$Notice.warning({\n' +
                '                        title: \'Up to five pictures can be uploaded.\'\n' +
                '                    });\n' +
                '                }\n' +
                '                return check;\n' +
                '            },\n' +
                '            handleView(url) {\n' +
                '                let vm = this;\n' +
                '                vm.imgUrl = url;\n' +
                '                vm.visible = true;\n' +
                '            }\n' +
                '        },\n' +
                '        mounted () {\n' +
                '            let vm = this;\n' +
                '            vm.uploadList = this.$refs.upload.fileList;\n' +
                '        }\n' +
                '    };\n' +
                '    export default FormComponent;\n' +
                '<\/script>'
            }
        },
        methods: {
            handleSuccess(res, file) {
                file.url = res.url;
                file.name = res.name;
            },
            handleRemove(file) {
                const fileList = this.$refs.upload.fileList;
                this.$refs.upload.fileList.splice(fileList.indexOf(file), 1);
            },
            handleFormatError(file) {
                this.$Notice.warning({
                    title: 'The file format is incorrect',
                    desc: 'File format of ' + file.name + ' is incorrect, please select jpg or png.'
                });
            },
            handleMaxSize(file) {
                this.$Notice.warning({
                    title: 'Exceeding file size limit',
                    desc: 'File  ' + file.name + ' is too large, no more than 2M.'
                });
            },
            handleBeforeUpload() {
                const check = this.uploadList.length < 1;
                if (!check) {
                    this.$Notice.warning({
                        title: 'Up to five pictures can be uploaded.'
                    });
                }
                return check;
            },
            handleView(url) {
                let vm = this;
                vm.imgUrl = url;
                vm.visible = true;
            }
        },
        mounted () {
            let vm = this;
            vm.uploadList = this.$refs.upload.fileList;
        }
    };
    export default FormComponent;
</script>
