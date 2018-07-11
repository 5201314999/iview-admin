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
                    <Card id="source-list">
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
                        <div class="fl-drag-box flex" data-name="source">
                            <div class="fl-drag-prev disabled" @click="handleComponentPrev">
                                <Icon type="arrow-left-b"></Icon>
                            </div>
                            <div class="fl-drag-cont clearfix">
                                <div class="fl-drag-list" id="source">
                                    <div class="fl-drag-item" v-for="(item, index) in component" :key="index" :data-index="index" :style="{'margin-right': index === component.length - 1 ? '0' : margin + 'px'}">
                                        <span v-for="(box, k) in item" :style="{width: box.width + 'px', height: box.height + 'px', 'margin-bottom': box.space + 'px'}" :key="k">{{ box.sourceWidth + ' * ' + box.sourceHeight }}</span>
                                    </div>
                                </div>
                            </div>
                            <div class="fl-drag-next" @click="handleComponentNext">
                                <Icon type="arrow-right-b"></Icon>
                            </div>
                        </div>
                    </Card>
                    <div :is="element.component" v-for="element in drag.elements" v-bind="element.props"></div>
                    <Card class="fl-drag-container mt20" id="target-list">
                        <div slot="title" class="fl-drag-title flex">
                            <span>第 1 行推荐</span>
                            <Row>
                                <Button type="ghost" @click="handleComponentDisplay">
                                    {{ drag.display['target-list'] ? '收起' : '展开' }}
                                </Button>
                            </Row>
                        </div>
                        <Row>
                            <div class="fl-drag-box fl-drag-target-box flex" data-name="target">
                                <div class="fl-drag-prev disabled" @click="handleComponentPrev">
                                    <Icon type="arrow-left-b"></Icon>
                                </div>
                                <div class="fl-drag-cont clearfix">
                                    <div class="fl-drag-list" id="target"></div>
                                </div>
                                <div class="fl-drag-next disabled" @click="handleComponentNext">
                                    <Icon type="arrow-right-b"></Icon>
                                </div>
                            </div>
                        </Row>
                    </Card>
                    <div class="fl-drag-btn flex flex-center" @click="createComponentRow">
                        <Icon type="ios-plus-empty" class="mr10"></Icon>添加推荐行
                    </div>
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

    import Vue from 'vue';
    import Sortable from 'sortablejs';

    let bus = new Vue();

    Vue.component('recommend-row', {
        template: `<Card class="fl-drag-container mt20" :id="'target-list-' + row">
    <div slot="title" class="fl-drag-title flex">
        <span>第 {{ row + 1 }} 行推荐</span>
        <Row>
            <Button type="ghost" @click="handleComponentDisplay">
                {{ display['target-list-' + row] ? '收起' : '展开' }}
            </Button>
        </Row>
    </div>
    <Row>
        <div class="fl-drag-box fl-drag-target-box flex" :data-name="'target-' + row">
            <div class="fl-drag-prev disabled" @click="handleComponentPrev">
                <Icon type="arrow-left-b"></Icon>
            </div>
            <div class="fl-drag-cont clearfix">
                <div class="fl-drag-list" :id="'target-' + row"></div>
            </div>
            <div class="fl-drag-next disabled" @click="handleComponentNext">
                <Icon type="arrow-right-b"></Icon>
            </div>
        </div>
    </Row>
</Card>`,
        data() {
            return {
                display: {}
            }
        },
        props: {
            row: {type: Number}
        },
        methods: {
            handleComponentPrev(event) {
                bus.$emit('prev-action', event);
            },
            handleComponentNext(event) {
                bus.$emit('next-action', event);
            },
            initComponentTargetDraggable(id) {
                bus.$emit('init-target-draggable', id);
            },
            handleComponentDisplay(event) {
                bus.$emit('init-target-display', event);
            }
        },
        mounted() {
            let vm = this;
            vm.initComponentTargetDraggable('target-' + this.row);
            bus.$on('send-display-data', function(display){
                vm.$set(vm, 'display', display);
            });
        }
    });

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
                component: [],
                ratio: 0.5,
                margin: 17,
                drag: {
                    container: 'fl-drag-container',
                    body: 'ivu-card-body',
                    disabled: 'disabled',
                    hide: 'fl-drag-body-hide',
                    box: 'fl-drag-box',
                    prev: 'fl-drag-prev',
                    next: 'fl-drag-next',
                    content: 'fl-drag-cont',
                    list: 'fl-drag-list',
                    source: 'source-list',
                    item: 'fl-drag-item',
                    row: 1,
                    num: 0,
                    nums: {target: 0},
                    margin: 40,
                    elements: [],
                    height: {},
                    display: {}
                }
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
                let vm = this, width = 570, height = 368, space = 34,
                    num = [1, 2, 3], ratio = vm.ratio, list = [];
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
                this.$set(vm, 'component', list);
            },

            /**
             * get component node's client width
             * @param node currently clicked object
             * @param name class' name
             */
            getComponentNodeWidth(node, name) {
                let $dom = node.getElementsByClassName(name);
                if($dom.length > 0){
                    return $dom[0].clientWidth;
                }
                return 0;
            },

            /**
             * Calculating the page's number based on the number of component.
             * @param node currently clicked object
             * @param num component's number
             */
            getComponentPagesNumber(node, num) {
                let vm = this,
                    number = num ? parseInt(num) : vm.component.length,
                    contentWidth = vm.getComponentNodeWidth(node, vm.drag.content),
                    itemWidth = vm.getComponentNodeWidth(node, vm.drag.item),
                    totalWidth = itemWidth * number + vm.margin * (number - 1);
                return Math.ceil(totalWidth / contentWidth);
            },

            /**
             * get parent's node via class name.
             * @param event `event object`
             * @param name class name
             */
            getParentsNodeByClassName(event, name) {
                let vm = this, paths = event.path,
                    i = 0, node = null;
                for(; i < paths.length; i++){
                    if(paths.hasOwnProperty(i)){
                        if(vm.hasClass(paths[i], name)){
                            node = paths[i];
                            break;
                        }
                    }
                }
                return node;
            },

            /**
             * setting the height of the recommend's body
             * @param id
             */
            setComponentBodyHeight(id) {
                let vm = this, container = document.getElementById(id),
                    body = container.getElementsByClassName(vm.drag.body)[0];
                body.removeAttribute('style');
                let height = body.clientHeight;
                body.style.height = height + 'px';
                vm.$set(vm.drag.height, id, height);
                if(height > 0) vm.$set(vm.drag.display, id, true);
                else vm.$set(vm.drag.display, id, false);
                bus.$emit('send-display-data', vm.drag.display);
            },

            /**
             * switch on the previous page
             * @param event
             */
            handleComponentPrev(event) {
                let vm = this,
                    parentNode = event.currentTarget.parentNode,
                    listNode = parentNode.getElementsByClassName(vm.drag.list)[0],
                    num = vm.drag.num,
                    name = parentNode.getAttribute('data-name'),
                    isTarget = name.indexOf('target') > -1;
                if(isTarget){
                    num = vm.drag.nums[name];
                    if(num > 0){
                        num -= 100;
                        vm.$set(vm.drag.nums, name, num);
                    }
                    listNode.style.transform = 'translateX(-' + num + '%) translateZ(0px)';
                    let number = vm.getComponentPagesNumber(parentNode, listNode.children.length);
                    vm.handleComponentTargetSwitch(parentNode, number, name);
                }else{
                    if(num > 0){
                        num -= 100;
                        vm.$set(vm.drag, 'num', num);
                    }
                    listNode.style.transform = 'translateX(-' + num + '%) translateZ(0px)';
                    vm.handleComponentSourceSwitch(parentNode, 'prev');
                }
            },

            /**
             * switch on the next page
             * @param event
             */
            handleComponentNext(event) {
                let vm = this,
                    parentNode = event.currentTarget.parentNode,
                    listNode = parentNode.getElementsByClassName(vm.drag.list)[0],
                    name = parentNode.getAttribute('data-name'),
                    isTarget = name.indexOf('target') > -1;
                if(isTarget){
                    let num = listNode.children.length,
                        number = vm.getComponentPagesNumber(parentNode, num),
                        targetNum = vm.drag.nums[name] ? vm.drag.nums[name] : 0;
                    if(targetNum < (number - 1) * 100){
                        targetNum += 100;
                        vm.$set(vm.drag.nums, name, targetNum);
                    }
                    listNode.style.transform = 'translateX(-' + targetNum + '%) translateZ(0px)';
                    vm.handleComponentTargetSwitch(parentNode, number, name);
                }else{
                    let num = vm.drag.num,
                        number = vm.getComponentPagesNumber(parentNode);
                    if(num < (number - 1) * 100){
                        num += 100;
                        vm.$set(vm.drag, 'num', num);
                    }
                    listNode.style.transform = 'translateX(-' + num + '%) translateZ(0px)';
                    vm.handleComponentSourceSwitch(parentNode, 'next', number);
                }
            },

            /**
             * `source-list` switcher state
             * @param node
             * @param action
             * @param number
             */
            handleComponentSourceSwitch(node, action, number) {
                let vm = this,
                    disabled = vm.drag.disabled,
                    next = node.getElementsByClassName(vm.drag.next)[0],
                    prev = node.getElementsByClassName(vm.drag.prev)[0];
                if(action === 'prev'){
                    vm.removeClass(next, disabled);
                    if(vm.drag.num === 0){
                        vm.addClass(prev, disabled);
                    }
                }else if(action === 'next'){
                    if(vm.drag.num > 0){
                        vm.removeClass(prev, disabled);
                    }else{
                        vm.addClass(prev, disabled);
                    }
                    if(this.drag.num === (number - 1) * 100){
                        vm.addClass(next, disabled);
                    }
                }
            },

            /**
             * `target-list` switcher state
             * @param node parent's node
             * @param number page's number
             * @param dest target's name
             */
            handleComponentTargetSwitch(node, number, dest) {
                let vm = this, disabled = vm.drag.disabled,
                    num = vm.drag.nums[dest] ? vm.drag.nums[dest] : 0,
                    next = node.getElementsByClassName(this.drag.next)[0],
                    prev = node.getElementsByClassName(this.drag.prev)[0];
                if(num > 0){
                    vm.removeClass(prev, disabled);
                    if(num === (number - 1) * 100){
                        vm.addClass(next, disabled);
                    }else{
                        vm.removeClass(next, disabled);
                    }
                }else{
                    vm.addClass(prev, disabled);
                    if(number > 1){
                        vm.removeClass(next, disabled);
                    }
                }
            },

            /**
             * Control the recommend row is showing up or hidding.
             * @paran event
             */
            handleComponentDisplay(event) {
                let vm = this,
                    node = vm.getParentsNodeByClassName(event, vm.drag.container);
                if(node !== null){
                    vm.addClass(node, '');
                    let id = node.getAttribute('id'),
                        body = node.getElementsByClassName(vm.drag.body)[0],
                        height = body.clientHeight;
                    if(height > 0){
                        body.style.height = 0;
                        vm.$set(vm.drag.display, id, false);
                        vm.addClass(node, vm.drag.hide);
                    }else{
                        let ids = id.split('-'),
                            row = parseInt(ids[ids.length - 1]),
                            isNotNum = isNaN(row);
                        if(isNotNum) row = 0;
                        vm.handleComponentOneShow(row + 1);
                        body.style.height = vm.drag.height[id] + 'px';
                        vm.$set(vm.drag.display, id, true);
                        vm.removeClass(node, vm.drag.hide);
                    }
                }
            },

            /**
             * Only one recommend row is shown at a time.
             * @param row `row number`
             * @param execute set height of the current body or not.
             */
            handleComponentOneShow(row, execute) {
                let vm = this, id = row < 2 ? 'target-list' : 'target-list-' + (row - 1);
                vm.$nextTick(() => {
                    let container = document.getElementsByClassName(vm.drag.container),
                        length = container.length, i = 0, cur, body;
                    for(; i < length; i++){
                        if(container.hasOwnProperty(i)){
                            cur = container[i];
                            let rowId = cur.getAttribute('id');
                            if(rowId !== id){
                                vm.addClass(cur, vm.drag.hide);
                                body = cur.getElementsByClassName(vm.drag.body)[0];
                                body.style.height = 0;
                                vm.$set(vm.drag.display, rowId, false);
                            }
                        }
                    }
                    if(execute){
                        let current = document.getElementById(id);
                        if(current){
                            vm.removeClass(current, vm.drag.hide);
                            vm.setComponentBodyHeight(id);
                        }
                    }
                });
            },

            /**
             * Initilize the original drag list
             * Contains `source-list` and `container (mainly use to delete.)`
             */
            initComponentSourceDraggable() {
                let vm = this;
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
                let container = document.getElementsByClassName('fl-container')[0];
                Sortable.create(container, {
                    group: {
                        name: 'body',
                        pull: true,
                        put: ['target']
                    },
                    animation: 120,
                    ghostClass: 'fl-dragging',
                    onAdd(event) {
                        let children = event.target.children;
                        if(children.length > 1){
                            for(let i = 0; i < children.length; i++){
                                if(children.hasOwnProperty(i)){
                                    let cur = children[i];
                                    if(vm.hasClass(cur, vm.drag.item)){
                                        cur.remove();
                                    }
                                }
                            }
                        }
                    }
                });
            },

            /**
             * Initilize the target drag list
             * Control of the switcher when the list is adding or removing.
             * @param id dom's id
             */
            initComponentTargetDraggable(id) {
                id = id ? id : 'target';
                let vm = this, target = document.getElementById(id),
                    add = function(event){
                        let parentNode = target.parentNode.parentNode,
                            num = target.children.length,
                            number = vm.getComponentPagesNumber(parentNode, num);
                        vm.handleComponentTargetSwitch(parentNode, number, id);
                        let node = vm.getParentsNodeByClassName(event, vm.drag.container),
                            tid = node.getAttribute('id');
                        vm.setComponentBodyHeight(tid);
                    },
                    update = function(event){
                        let parentNode = target.parentNode.parentNode,
                            num = target.children.length,
                            number = vm.getComponentPagesNumber(parentNode, num),
                            pageNum = vm.drag.nums[id] ? vm.drag.nums[id] : 0,
                            newNum = (number - 1) * 100;
                        if(pageNum > newNum){
                            target.style.transform = 'translateX(-' + newNum + '%) translateZ(0px)';
                            vm.$set(vm.drag.nums, id, newNum);
                        }
                        vm.handleComponentTargetSwitch(parentNode, number, id);
                        let node = vm.getParentsNodeByClassName(event, vm.drag.container),
                            tid = node.getAttribute('id');
                        vm.setComponentBodyHeight(tid);
                    };
                Sortable.create(target, {
                    group: {
                        name: id,
                        pull: true,
                        put: ['source']
                    },
                    animation: 120,
                    ghostClass: 'fl-dragging',
                    onAdd(event) {
                        add(event);
                        event.item.style = 'margin-right: ' + vm.margin + 'px';
                    },
                    onRemove(event) {
                        update(event);
                    }
                });
            },

            /**
             * create recommend's row
             * via update the `elements` variable ( insert in the queue head )
             */
            createComponentRow() {
                let vm = this;
                vm.drag.elements.unshift({component: 'recommend-row', props: {row: vm.drag.row}});
                vm.drag.row++;
                vm.handleComponentOneShow(vm.drag.row, true);
            },

            /**
             * Communication between components.
             * via the common Vue object called `bus`
             */
            handleBroadcast() {
                let vm = this;
                bus.$on('prev-action', function(event){
                    vm.handleComponentPrev(event);
                });
                bus.$on('next-action', function(event){
                    vm.handleComponentNext(event);
                });
                bus.$on('init-target-draggable', function(id){
                    vm.initComponentTargetDraggable(id);
                });
                bus.$on('init-target-display', function(event){
                    vm.handleComponentDisplay(event);
                    bus.$emit('send-display-data', vm.drag.display);
                });
            }
        },
        mounted () {
            this.uploadList = this.$refs.upload.fileList;
            this.getComponentData();
            this.initComponentSourceDraggable();
            this.initComponentTargetDraggable();
            this.setComponentBodyHeight('target-list');
            this.handleBroadcast();
        }
    };
    export default FormComponent;
</script>
