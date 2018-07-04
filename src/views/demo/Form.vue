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
                <FormItem prop="images" label="图片上传" class="fl-upload flex clearfix">
                    <div class="fl-upload-list" v-for="item in uploadList">
                        <template v-if="item.status === 'finished'">
                            <img :src="item.url">
                            <div class="fl-upload-list-cover">
                                <Icon type="ios-eye-outline" @click.native="handleView(item.name)"></Icon>
                                <Icon type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>
                            </div>
                        </template>
                        <template v-else>
                            <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
                        </template>
                    </div>
                    <Upload
                            ref="upload"
                            action="//jsonplaceholder.typicode.com/posts/"
                            :show-upload-list="false"
                            :default-file-list="defaultList"
                            :on-success="handleSuccess"
                            :format="['jpg', 'jpeg', 'gif', 'png']"
                            :max-size="2048"
                            :on-format-error="handleFormatError"
                            :on-exceeded-size="handleMaxSize"
                            :before-upload="handleBeforeUpload"
                            :accept="G.accept.images"
                            :multiple="multiple"
                            type="drag">
                        <div class="fl-upload-btn flex flex-center" v-if="showUploadBtn">
                            <Icon type="ios-cloud-upload-outline"></Icon>
                            <p>上传图片</p>
                        </div>
                    </Upload>
                    <Modal title="查看大图" v-model="visible" class-name="fl-image-modal" :width="800">
                        <img :src="'https://o5wwk8baw.qnssl.com/' + imgName + '/large'" v-if="visible" style="width: 100%">
                    </Modal>
                </FormItem>
                <FormItem label=" " class="fl-btn">
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
                        range: [{required: true, message: '至少选择一个适用范围'}]
                    }
                },
                imgName: '',
                visible: false,
                multiple: true,
                showUploadBtn: true,
                uploadList: [],
                defaultList: []
            }
        },
        methods: {
            handleSuccess(res, file) {
                file.url = 'https://o5wwk8baw.qnssl.com/7eb99afb9d5f317c912f08b5212fd69a/avatar';
                file.name = '7eb99afb9d5f317c912f08b5212fd69a';
                if(!this.multiple) this.handleUploadBtn();
            },
            handleRemove(file) {
                const fileList = this.$refs.upload.fileList;
                this.$refs.upload.fileList.splice(fileList.indexOf(file), 1);
                if(!this.multiple) this.handleUploadBtn();
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
                const check = this.uploadList.length < 5;
                if (!check) {
                    this.$Notice.warning({
                        title: 'Up to five pictures can be uploaded.'
                    });
                }
                return check;
            },
            handleView(name) {
                this.imgName = name;
                this.visible = true;
            },
            handleUploadBtn() {
                let can = true;
                if(!this.multiple){
                    if(this.$refs.upload.fileList.length > 0){
                        can = false;
                    }
                }
                this.$set(this, 'showUploadBtn', can);
            }
        },
        mounted () {
            this.uploadList = this.$refs.upload.fileList;
            this.handleUploadBtn();
        }
    };
    export default FormComponent;
</script>