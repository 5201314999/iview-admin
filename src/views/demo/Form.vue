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
                <Row class="fl-draggable mb20">
                    <Card>
                        <div class="fl-search clearfix">
                            <div class="search-input left">
                                <Input icon="ios-search" size="large" placeholder="搜索组件ID或组件标题" />
                            </div>
                            <div class="search-button left">
                                <div class="fl-select">
                                    <Select placeholder="请选择" value="movie" :style="{width: '60px'}">
                                        <Option value="movie">100</Option>
                                        <Option value="app1">256</Option>
                                        <Option value="app2">366</Option>
                                        <Option value="app3">400</Option>
                                    </Select>
                                </div>
                            </div>
                        </div>
                        <div class="fl-drag-box flex">
                            <div class="fl-drag-prev" @click="handleComponentPrev">
                                <Icon type="arrow-left-b"></Icon>
                            </div>
                            <div class="fl-drag-cont clearfix">
                                <div class="fl-drag-list" id="source">
                                    <div class="fl-drag-item" v-for="(item, index) in component" :key="index" :data-index="index">
                                        <span v-for="(box, k) in item" :style="{width: box.width + 'px', height: box.height + 'px', 'margin-bottom': box.space + 'px'}" :key="k">{{ box.sourceWidth + ' * ' + box.sourceHeight }}</span>
                                    </div>
                                </div>
                            </div>
                            <div class="fl-drag-next" @click="handleComponentNext">
                                <Icon type="arrow-right-b"></Icon>
                            </div>
                        </div>
                    </Card>
                    <Card class="mt20">
                        <div slot="title" class="fl-drag-title flex">
                            <span>第 1 行推荐</span>
                            <Row><Button type="ghost">收起</Button></Row>
                        </div>
                        <Row>
                            <div class="fl-drag-box fl-drag-target-box flex">
                                <div class="fl-drag-prev" @click="handleComponentPrev">
                                    <Icon type="arrow-left-b"></Icon>
                                </div>
                                <div class="fl-drag-cont clearfix">
                                    <div class="fl-drag-list" id="target"></div>
                                </div>
                                <div class="fl-drag-next" @click="handleComponentNext">
                                    <Icon type="arrow-right-b"></Icon>
                                </div>
                            </div>
                        </Row>
                    </Card>
                    <Row class="fl-drag-btn flex flex-center">
                        <Icon type="ios-plus-empty" class="mr10"></Icon>添加推荐行
                    </Row>
                </Row>
                <FormItem label=" " class="fl-btn">
                    <Button type="primary" size="large">提交</Button>
                    <Button size="large" type="ghost">返回</Button>
                </FormItem>
            </Form>
        </div>
    </div>
</template>

<script>

    import Sortable from 'sortablejs';

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
                component: []
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
                this.imgUrl = url;
                this.visible = true;
            },
            getComponentData() {
                let width = 570, height = 368, space = 34,
                    num = [1, 2, 3], ratio = 0.5, list = [];
                for(let i = 0; i < 10; i++){
                    let n = num[Math.round(Math.random() * (num.length - 1))],
                        data = [], h;
                    if(n > 1){
                        for(let k = 0; k < n; k++){
                            let ratioH = (height - space * (n - 1)) / n;
                            h = Math.round((ratioH * ratio) * 10) / 10;
                            let temp = {width: width * ratio, space: space * ratio, height: h, sourceWidth: width, sourceHeight: ratioH};
                            if(k === n - 1) temp['space'] = 0;
                            data.push(temp);
                        }
                    }else{
                        h = Math.round(height * ratio * 10) / 10;
                        let temp = {width: width * ratio, space: 0, height: h, sourceWidth: width, sourceHeight: height};
                        data.push(temp);
                    }
                    list.push(data);
                }
                this.$set(this, 'component', list);
            },
            handleComponentPrev(event) {
                console.log(event);
            },
            handleComponentNext() {

            },
            handleComponentDraggable() {
                document.body.ondrop = function (event) {
                    event.preventDefault();
                    event.stopPropagation();
                };
                let source = document.getElementById('source');
                Sortable.create(source, {
                    group: {
                        name: 'source',
                        pull: 'clone',
                        put: ['none']
                    },
                    animation: 120,
                    ghostClass: 'fl-dragging',
                    sort: false
                });
                let target = document.getElementById('target');
                Sortable.create(target, {
                    group: {
                        name: 'source',
                        pull: 'clone',
                        put: ['source']
                    },
                    animation: 120,
                    ghostClass: 'fl-dragging'
                });
            }
        },
        mounted () {
            this.uploadList = this.$refs.upload.fileList;
            this.getComponentData();
            this.handleComponentDraggable();
        }
    };
    export default FormComponent;
</script>
