<template>
    <Card ref="draggable" :class="only ? 'fl-draggable-only-target' : ''">
        <Row class="fl-draggable">
            <Card id="source-list" v-if="!only">
                <div class="fl-search clearfix">
                    <div class="search-input left">
                        <Input icon="ios-search" size="large" placeholder="搜索组件ID或组件标题" @keyup.native="handleComponentSearch" v-model="search.idOrName" />
                    </div>
                    <div class="search-button left">
                        <div class="fl-select">
                            <Select v-model="search.height" :style="{width: '80px'}" @on-change="handleComponentSearch">
                                <Option :label="item" :value="item" v-for="(item, index) in height" :key="index"></Option>
                            </Select>
                        </div>
                    </div>
                    <div class="search-button right">
                        <Button type="primary" size="large" @click="createComponentRow">
                            <icon type="plus-round" class="mr5"></icon>添加推荐行
                        </Button>
                    </div>
                </div>
                <div class="fl-drag-box flex" data-name="source">
                    <div class="fl-drag-prev disabled" @click="handleComponentPrev">
                        <Icon type="arrow-left-b"></Icon>
                    </div>
                    <div class="fl-drag-cont clearfix">
                        <div class="fl-drag-list" id="source">
                            <div class="fl-drag-item" v-for="(item, index) in items" :key="item['id'] + '-' + $unique"  :data-index="item['id']" :style="{'margin-right': index === items.length - 1 ? '0' : (base.margin * ratio) + 'px'}">
                                <div v-for="(box, k) in item.data" :style="{width: box.width + 'px', height: box.height + 'px', 'margin-bottom': box.space + 'px'}" :key="item['id'] + '-' + k" :class="drag.div">{{ box.sourceWidth + ' * ' + box.sourceHeight }}</div>
                            </div>
                        </div>
                    </div>
                    <div class="fl-drag-next" @click="handleComponentNext">
                        <Icon type="arrow-right-b"></Icon>
                    </div>
                </div>
            </Card>
            <Row class="fl-tabs fl-recommend-tab" :class="only ? '' : 'mt20'">
                <Tabs name="recommend" :value="drag.tabs.value" v-model="drag.tabs.value">
                    <TabPane label="第 1 行推荐" name="tab">
                        <div class="fl-drag-container" id="target-list">
                            <div class="fl-drag-box fl-drag-target-box flex" data-name="target">
                                <div class="fl-drag-prev disabled" @click="handleComponentPrev">
                                    <icon type="arrow-left-b"></icon>
                                </div>
                                <div class="fl-drag-cont">
                                    <div class="fl-drag-list clearfix" id="target"></div>
                                    <span :class="drag.line" :style="{left: ((1920 - base.left) * ratio) + 'px', height: drag.height['target'] + 'px'}" v-if="drag.nums['target'] <= 0"></span>
                                    <span :class="drag.shadow.normal"></span>
                                </div>
                                <div class="fl-drag-next disabled" @click="handleComponentNext">
                                    <Icon type="arrow-right-b"></Icon>
                                </div>
                            </div>
                        </div>
                    </TabPane>
                    <TabPane v-for="(element, index) in drag.elements" :label="setComponentTabLabel(element.id)" :ref="'tab-' + element.props.row" :key="index" :name="'tab-' + element.id">
                        <div :is="element.component" v-bind="element.props"></div>
                    </TabPane>
                </Tabs>
            </Row>
        </Row>
    </Card>
</template>

<script>

    /**
     * 使用方法:
     *  1. `import` 引入该组件 eg. `import draggable from '@/components/draggable/Draggable'`;
     *  2. 页面初始化
     *      ```
     *      <draggable :index="index" v-on:get-data="getComponentData" :init="true" :rows="rows" :id="key" :only="true" :click="true" v-on:callback="handleClick" :fill="fillData"></draggable>
     *      ```
     *      参数说明:
     *      [index]: 动态变更, 触发获取最新推荐行数据动作, 可调用 vm.$unique() 进行赋值变更.
     *      [get-data]: `index`变更后的回调, 携带推荐行数据返回.
     *      [init]: 是否执行初始化操作 ( 注: 需配合`rows`参数使用, 即初始化数据 ).
     *      [rows]: 初始化数据 (推荐行数据).
     *      [id]: 动态变更, 与`index`参数同理, 变更后执行数据初始化动作.
     *      [only]: 是否仅显示推荐行列表, 不显示原始拖拽数据.
     *      [click]: 推荐位是否支持点击.
     *      [detail]: 是否是详情页面 (主要针对详情页面的展示, 避免显示点击添加按钮).
     *      [callback]: 点击回调 {@return: {recRowId, recModuleId, recRowModuleId, recPositionId}}
     *      [fill]: 填充数据 ( 初始化为数组, 填充或删除时，为对象 ) 如下所示:
     *      ```
     *      // 默认初始化数据 ( array )
     *      const data = [
     *          {
     *              index: 1,   // 添加成功后, 接口返回的`id` 或 待删除的`id` ( 推荐内容`id`, 唯一标识 )
     *              link: 'http://dev-file.tvflnet.com/example.jpg' // 图片地址
     *          },
     *          {
     *              index: 2,
     *              link: 'http://dev-file.tvflnet.com/example.jpg'
     *          }
     *      ];
     *
     *      // 填充/删除数据 (删除数据多一个判断参数: action, 该值为 `delete`)
     *      const data = {
     *          id: 'fl-shape-5628043B92A64EEBB46474A9C9344583', // 推荐位id, 该值在点击推荐位时返回
     *          index: 1,
     *          action: 'delete',   // 非删除时, 不要携带该字段及内容
     *          link: 'http://dev-file.tvflnet.com/example.jpg'
     *      };
     *      ```
     */

    import Vue from 'vue';
    import Sortable from 'sortablejs';
    import {on, off} from 'iview/src/utils/dom';

    const bus = new Vue();
    const component = 'recommend-row';
    const RecommendRowComponent = Vue.extend({
        data() {
            return {
                ratio: 0.5,
                base: {
                    left: 0,
                    margin: 0
                },
                drag: {
                    height: {},
                    nums: {target: 0},
                    line: 'fl-drag-screen-line',
                    shadow: 'fl-drag-item-border-shadow'
                }
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
            initComponentTargetDraggable() {
                bus.$emit('init-target-draggable');
            }
        },
        mounted() {
            let vm = this;
            vm.initComponentTargetDraggable();
            bus.$on('set-base-data', function(data){
                vm.$set(vm, 'base', data[0]);
                vm.$set(vm, 'ratio', data[1]);
            });
            bus.$on('set-drag-data', function(data){
                vm.$set(vm.drag, 'height', data.height);
                vm.$set(vm.drag, 'nums', data.nums);
            });
        },
        template: `<Row class="fl-drag-container" :id="'target-list-' + row">
    <div class="fl-drag-box fl-drag-target-box flex" :data-name="'target-' + row">
        <div class="fl-drag-prev disabled" @click="handleComponentPrev">
            <Icon type="arrow-left-b"></Icon>
        </div>
        <div class="fl-drag-cont">
            <div class="fl-drag-list clearfix" :id="'target-' + row"></div>
            <span :class="drag.line" :style="{left: ((1920 - base.left) * ratio) + 'px', height: drag.height['target-' + row] + 'px'}" v-if="drag.nums['target-' + row] <= 0"></span>
            <span :class="drag.shadow"></span>
        </div>
        <div class="fl-drag-next disabled" @click="handleComponentNext">
            <Icon type="arrow-right-b"></Icon>
        </div>
    </div>
</Row>`
    });

    const DragComponent = {
        props: {
            index: '',
            id: {type: String},
            rows: {type: Array},
            fill: {type: [Array, Object]},
            only: {
                type: Boolean,
                default: false
            },
            init: {
                type: Boolean,
                default: false
            },
            click: {
                type: Boolean,
                defalut: false
            },
            detail: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                search: {
                    idOrName: '',
                    height: 0
                },
                base: {
                    left: '',
                    margin: 0
                },
                height: [],
                items: [],
                component: [],
                ratio: 0.5,
                drag: {
                    layout: 'fl-container',
                    container: 'fl-drag-container',
                    disabled: 'disabled',
                    box: 'fl-drag-box',
                    prev: 'fl-drag-prev',
                    next: 'fl-drag-next',
                    content: 'fl-drag-cont',
                    list: 'fl-drag-list',
                    source: 'source',
                    item: 'fl-drag-item',
                    div: 'fl-drag-item-one',
                    active: 'fl-drag-item-active',
                    line: 'fl-drag-screen-line',
                    shadow: {
                        normal: 'fl-drag-item-border-shadow',
                        active: 'fl-drag-item-shadow-active',
                        data: {}
                    },
                    row: 1,                     // row number.
                    num: 0,                     // page's number ( source ).
                    nums: {target: 0},          // page's number ( target ).
                    elements: {},               // component elements.
                    width: {},                  // row width.
                    height: {},                 // row height.
                    target: {},                 // sortable object ( target ).
                    tabs: {
                        container: 'fl-recommend-tab',
                        tab: 'ivu-tabs-tabpane',
                        row: [],
                        icon: 'ios-close-outline',
                        id: 1,
                        value: 'tab'
                    },
                    shape: {
                        prefix: 'fl-shape',
                        image: 'fl-drag-item-image',
                        template: [],
                        instance: [],
                        values: {},
                        setting: {
                            auto: false,
                            speed: 4000,
                            radiuDot: true
                        }
                    }
                }
            }
        },
        methods: {
            /**
             * base data.
             * such as `margin-left`, `margin-top`
             */
            getComponentBaseData() {
                const vm = this;
                vm.$api.get(vm.G.api.recommend.base, {}, function(res){
                    if(res['ret']['retCode'].toString() === '0'){
                        const left = res.data['leftMargin'],
                            space = res.data['recModuleInterval'];
                        vm.$set(vm.base, 'left', left);
                        vm.$set(vm.base, 'margin', space);
                    }else{
                        vm.$error(res['ret']['retMsg']);
                        return false;
                    }
                }, function(err){
                    vm.$error(err);
                    return false;
                });
            },

            /**
             * get component data.
             * calculating: ((height - space * (total - 1)) / total) * ratio = position height.
             * ```
             * note: the group contains mutiple positions.
             * @height: recommended group height.
             * @space: spacing between two positions ( fixed ).
             * @total: total number of positions.
             * @ratio: scaling ratio.
             * ```
             * object: {width, height, space, sourceWidth, sourceHeight}.
             */
            getComponentData() {
                const vm = this;
                let list = [];
                vm.$api.post(vm.G.api.recommend.group.list, vm.search, function(res){
                    if(res['ret']['retCode'].toString() === '0'){
                        vm.$set(vm, 'items', list);
                        let tempWidth, tempSpace;
                        const tempData = vm.parseComponentData(res.data, false);
                        list = tempData.list;
                        tempSpace = tempData.space;
                        tempWidth = tempData.width;
                        vm.$set(vm, 'items', list);
                        const source = document.getElementById('source'),
                            sourceWidth = source.clientWidth,
                            parent = source.parentNode.parentNode,
                            length = res.data.length,
                            totalWidth = tempWidth * length + tempSpace * (length - 1);
                        if(totalWidth < sourceWidth){
                            const next = parent.getElementsByClassName(vm.drag.next)[0];
                            vm.addClass(next, vm.drag.disabled);
                        }
                    }else{
                        vm.$error(res['ret']['retMsg']);
                        return false;
                    }
                }, function(err){
                    vm.$error(err);
                    return false;
                });
            },

            /**
             * parse component data.
             * @param datas
             * @param row {*}
             * @returns {Object}
             */
            parseComponentData(datas, row) {
                const vm = this, ratio = vm.ratio, list = [];
                let tempWidth = 0, tempSpace = 0, tempHeight = 0;
                for(let i = 0; i < datas.length; i++){
                    const cur = datas[i], data = [],
                        num = parseInt(cur['recPositionNum']),
                        width = cur['recModuleWidth'],
                        height = cur['recModuleHeight'],
                        space = cur['rowSpacing'],
                        mid = cur['recRowModuleId'],
                        position = cur['recPositionIds'] ? cur['recPositionIds'] : [],
                        initData = cur['recInitData'] ? cur['recInitData'] : [];
                    let h;
                    if(tempWidth <= 0) tempWidth = width * ratio;
                    if(tempSpace <= 0) tempSpace = space * ratio;
                    tempHeight = height * ratio > tempHeight ? height * ratio : tempHeight;
                    if(num > 1){
                        for(let n = 0; n < num; n++){
                            const oneHeight = (height - space * (num - 1)) / num;
                            h = Math.round((oneHeight * ratio) * 10) / 10;
                            const temp = {
                                mid: mid,
                                width: width * ratio,
                                space: space * ratio,
                                height: h,
                                sourceWidth: width,
                                sourceHeight: oneHeight,
                                position: position[n],
                                initData: initData[position[n]] ? initData[position[n]] : []
                            };
                            if(n === num - 1){
                                temp['space'] = 0;
                            }
                            data.push(temp);
                        }
                    }else{
                        h = Math.round(height * ratio * 10) / 10;
                        const temp = {
                            mid: mid,
                            width: width * ratio,
                            height: h,
                            space: 0,
                            sourceWidth: width,
                            sourceHeight: height,
                            position: position[0],
                            initData: initData[position[0]] ? initData[position[0]] : []
                        };
                        data.push(temp);
                    }
                    list.push({id: cur['recModuleId'], data: data});
                }
                return {
                    list: list,
                    width: tempWidth,
                    height: tempHeight,
                    space: tempSpace,
                    row: row ? row : null
                };
            },

            /**
             * get component `height` type.
             * all of it.
             */
            getComponentHeightData() {
                const vm = this;
                if(!vm.only){
                    vm.$api.get(vm.G.api.recommend.group.height, {}, function(res){
                        if(res['ret']['retCode'].toString() === '0'){
                            vm.$set(vm.search, 'height', res.data[0]);
                            vm.$set(vm, 'height', res.data);
                            vm.getComponentData();
                        }else{
                            vm.$error(res['ret']['retMsg']);
                            return false;
                        }
                    }, function(err){
                        vm.$error(err.msg);
                        return false;
                    });
                }
            },

            /**
             * get component node's client width
             * @param node currently clicked object
             * @param name class' name
             */
            getComponentNodeWidth(node, name) {
                const $dom = node.getElementsByClassName(name);
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
                const vm = this,
                    number = typeof num !== 'undefined' ? parseInt(num) : vm.items.length,
                    contentWidth = vm.getComponentNodeWidth(node, vm.drag.content),
                    items = node.getElementsByClassName(vm.drag.item);
                let itemWidth = 0,  totalWidth;
                if(number > 0){
                    for(let i = 0; i < number; i++){
                        itemWidth += items[i].clientWidth;
                    }
                }
                totalWidth = itemWidth + (vm.base.margin * vm.ratio) * (number - 1);
                return Math.ceil(totalWidth / contentWidth);
            },

            /**
             * current tab container.
             * via `this.drag.tabs.value` variable.
             */
            getCurrentTabContainer() {
                const vm = this,
                    container = document.getElementsByClassName(vm.drag.container),
                    values = JSON.parse(JSON.stringify(vm.drag.tabs.value)).split('-'),
                    value = parseInt(values[values.length - 1]);
                let current;
                if(isNaN(value)) current = container[0];
                else current = container[value];
                return current;
            },

            /**
             * component base data.
             * `margin-left`, `margin-top` etc.
             */
            setComponentBaseData() {
                const vm = this;
                bus.$emit('set-base-data', [vm.base, vm.ratio]);
            },

            /**
             * drag data.
             * `target-list` height, `page-nums` etc.
             */
            setComponentDragData() {
                const vm = this;
                bus.$emit('set-drag-data', vm.drag);
            },

            /**
             * setting the height of the recommend's body
             * @param id {*} dom id
             */
            setComponentBodyHeight(id) {
                id = id ? id : 'target';
                const vm = this, body = document.getElementById(id);
                if(body){
                    body.style.height = '';
                    const height = body.scrollHeight;
                    vm.$set(vm.drag.height, id, height);
                    vm.setComponentDragData();
                }
            },

            /**
             * setting the width of the recommend's body
             * @param id {*} `dom` id.
             */
            setComponentBodyWidth(id) {
                const vm = this, body = document.getElementById(id).parentNode;
                if(body){
                    const width = body.clientWidth;
                    vm.$set(vm.drag.width, 'width', width);
                    vm.$set(vm.drag.width, 'nums', []);
                    vm.$set(vm.drag.width.nums, id, 1);
                }
            },

            /**
             * set the recommend row's label.
             * customized content (render).
             */
            setComponentTabLabel(row) {
                const vm = this, num = row + 1,
                    label = '第 ' + num + ' 行推荐';
                return (h) => {
                    return h('div', [
                        h('span', label),
                        vm.only ? '' : h('icon', {
                            props: {type: vm.drag.tabs.icon},
                            attrs: {
                                'data-row': row,
                                title: '删除'
                            },
                            on: {
                                click: (event) => {
                                    const parent = event.currentTarget.parentNode.parentNode,
                                        brother = parent.previousSibling,
                                        number = event.currentTarget.getAttribute('data-row'),
                                        elements = JSON.parse(JSON.stringify(vm.drag.elements));
                                    let id = -1;
                                    brother.click();
                                    for(const i in elements){
                                        if(elements.hasOwnProperty(i)){
                                            const temp = parseInt(elements[i].id);
                                            if(temp === parseInt(number)){
                                                id = temp;
                                                delete elements[i];
                                                break;
                                            }
                                        }
                                    }
                                    if(Object.keys(elements).length > 0){
                                        for(const n in elements){
                                            if(elements.hasOwnProperty(n)){
                                                const temp = parseInt(elements[n].id);
                                                if(temp > id){
                                                    elements[n].id = temp - 1;
                                                }
                                            }
                                        }
                                    }
                                    vm.$set(vm.drag, 'elements', elements);
                                    vm.$set(vm.drag.tabs, 'id', vm.drag.tabs.id - 1);
                                    vm.handleDraggableShapeShadowActive();
                                }
                            }
                        })
                    ]);
                }
            },

            /**
             * update list's width.
             * when you choose item in the source list (mouse enter - the start),
             * and dragging the item to target list until the mouse leave (the end), updated it
             * @param type {*} `onStrat` or `onEnd` action.
             * @param event {*} event handle
             */
            updateComponentBodyWidth(type, event) {
                const vm = this,
                    container = document.getElementsByClassName(vm.drag.container);
                let curContainer, list, number, num, id, itemWidth = 0, totalWidth, current;
                if(container.length > 0){
                    current = vm.getCurrentTabContainer();
                    curContainer = document.getElementById(current.getAttribute('id'));
                    list = current.getElementsByClassName(vm.drag.list)[0];
                    id = list.getAttribute('id');
                    const items = list.getElementsByClassName(vm.drag.item);
                    number = items.length;
                    if(number > 0){
                        for(let i = 0; i < number; i++){
                            itemWidth += items[i].clientWidth;
                        }
                    }
                    totalWidth = itemWidth + (vm.base.margin * vm.ratio) * (number - 1);
                    totalWidth = totalWidth > 0 ? totalWidth : 0;
                    const contentWidth = vm.getComponentNodeWidth(curContainer, vm.drag.content);
                    num = Math.ceil(totalWidth / contentWidth);
                    if(num !== vm.drag.width.nums[id]){
                        vm.$set(vm.drag.width.nums, id, num);
                    }
                    if(type === 'start'){
                        const curWidth = event.item.clientWidth,
                            countWidth = totalWidth + curWidth + (vm.base.margin * vm.ratio);
                        if(countWidth > vm.drag.width.width){
                            num = parseInt(vm.drag.width.nums[id]) + 1;
                            vm.$set(vm.drag.width.nums, id, num);
                        }
                        if(vm.drag.width.width !== contentWidth){
                            vm.$set(vm.drag.width, 'width', contentWidth);
                        }
                    }
                    if(num > 0) list.style.width = vm.drag.width.width * num + 'px';
                    else list.style.width = vm.drag.width.width + 'px';
                }
            },

            /**
             * get the recommend data.
             * all of recommend rows. if nothing by default `[]`.
             */
            wrapComponentData() {
                const vm = this,
                    container = document.getElementsByClassName(vm.drag.tabs.container)[0];
                let tabs, length = 0, i = 0, data = [];
                if(container){
                    tabs = container.getElementsByClassName(vm.drag.tabs.tab);
                    length = tabs.length;
                    if(length > 0){
                        for(; i < length; i++){
                            const curTab = tabs[i], temp = [],
                                items = curTab.getElementsByClassName(vm.drag.item);
                            if(items.length > 0){
                                for(let n = 0; n < items.length; n++){
                                    const cur = items[n],
                                        id = cur.getAttribute('data-index');
                                    temp.push(id);
                                }
                            }
                            data.push(temp);
                        }
                    }
                }
                return data;
            },

            /**
             * window resize.
             * updated the list height and width.
             */
            handleWindowResize() {
                const vm = this,
                    current = vm.getCurrentTabContainer(),
                    list = current.getElementsByClassName(vm.drag.list)[0],
                    oldWidth = list.clientWidth,
                    num = vm.getComponentPagesNumber(current, list.children.length),
                    listId = list.getAttribute('id'),
                    number = vm.drag.width.nums[listId];
                let newWidth, curNum;
                list.removeAttribute('style');
                newWidth = list.clientWidth;
                if(newWidth !== vm.drag.width.width){
                    vm.$set(vm.drag.width, 'width', newWidth);
                    vm.$set(vm.drag.width.nums, listId, num);
                    const targetNum = vm.drag.nums[listId];
                    if(targetNum > 0){
                        if(num < number) curNum = 0;
                        else curNum = (oldWidth / targetNum) - 1;
                        const left = newWidth * curNum;
                        vm.$set(vm.drag.nums, listId, left);
                    }
                    vm.setComponentDragData();
                }
                list.style.width = vm.drag.width.width * vm.drag.width.nums[listId] + 'px';
                if(vm.drag.nums[listId] > 0){
                    list.style.marginLeft = '-' + vm.drag.nums[listId] + 'px';
                }
                vm.handleComponentTargetSwitch(current, num, listId);
            },

            /**
             * search ( refresh ).
             */
            handleComponentSearch() {
                const vm = this;
                vm.getComponentData();
            },

            /**
             * switch on the previous page
             * @param event
             */
            handleComponentPrev(event) {
                const vm = this,
                    parentNode = event.currentTarget.parentNode,
                    listNode = parentNode.getElementsByClassName(vm.drag.list)[0],
                    shadowNode = parentNode.parentNode.getElementsByClassName(vm.drag.shadow.normal)[0],
                    name = parentNode.getAttribute('data-name'),
                    isTarget = name.indexOf('target') > -1;
                let num = vm.drag.num;
                if(isTarget){
                    num = vm.drag.nums[name];
                    if(num > 0){
                        num -= vm.drag.width.width;
                        vm.$set(vm.drag.nums, name, num);
                        const shadowLeft = shadowNode.offsetLeft,
                            shadowStyle = [
                                `top: ${shadowNode.offsetTop}px;`,
                                `width: ${shadowNode.clientWidth}px;`,
                                `height: ${shadowNode.clientHeight}px;`,
                                `display: block;`

                            ];
                        shadowNode.removeAttribute('style');
                        shadowStyle.push(`left: ${shadowLeft + vm.drag.width.width}px;`);
                        shadowNode.setAttribute('style', shadowStyle.join(''));
                    }
                    listNode.style.marginLeft = '-' + num + 'px';
                    const number = vm.getComponentPagesNumber(parentNode, listNode.children.length);
                    vm.handleComponentTargetSwitch(parentNode, number, name);
                    vm.setComponentDragData();
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
                const vm = this,
                    parentNode = event.currentTarget.parentNode,
                    listNode = parentNode.getElementsByClassName(vm.drag.list)[0],
                    shadowNode = parentNode.parentNode.getElementsByClassName(vm.drag.shadow.normal)[0],
                    name = parentNode.getAttribute('data-name'),
                    isTarget = name.indexOf('target') > -1;
                if(isTarget){
                    const num = listNode.children.length,
                        number = vm.getComponentPagesNumber(parentNode, num),
                        tempWidth = listNode.parentNode.clientWidth;
                    let targetNum = vm.drag.nums[name] ? vm.drag.nums[name] : 0;
                    if(tempWidth > 0 && tempWidth !== vm.drag.width.width){
                        vm.$set(vm.drag.width, 'width', tempWidth);
                    }
                    if(targetNum < (number - 1) * vm.drag.width.width){
                        targetNum += vm.drag.width.width;
                        vm.$set(vm.drag.nums, name, targetNum);
                        const shadowLeft = shadowNode.offsetLeft,
                            shadowStyle = [
                                `top: ${shadowNode.offsetTop}px;`,
                                `width: ${shadowNode.clientWidth}px;`,
                                `height: ${shadowNode.clientHeight}px;`,
                                `display: block;`

                            ];
                        shadowNode.removeAttribute('style');
                        shadowStyle.push(`left: ${shadowLeft - vm.drag.width.width}px;`);
                        shadowNode.setAttribute('style', shadowStyle.join(''));
                    }
                    listNode.style.marginLeft = '-' + targetNum + 'px';
                    vm.handleComponentTargetSwitch(parentNode, number, name);
                    vm.setComponentDragData();
                }else{
                    const number = vm.getComponentPagesNumber(parentNode);
                    let num = vm.drag.num;
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
                const vm = this,
                    disabled = vm.drag.disabled,
                    next = node.getElementsByClassName(vm.drag.next)[0],
                    prev = node.getElementsByClassName(vm.drag.prev)[0];
                if(action === 'prev'){
                    const listNode = node.getElementsByClassName(vm.drag.list)[0],
                        num = vm.getComponentPagesNumber(node, listNode.children.length);
                    if(num > 1) vm.removeClass(next, disabled);
                    else vm.addClass(next, disabled);
                    if(vm.drag.num === 0){
                        vm.addClass(prev, disabled);
                    }
                }else if(action === 'next'){
                    if(vm.drag.num > 0){
                        vm.removeClass(prev, disabled);
                    }else{
                        vm.addClass(prev, disabled);
                    }
                    if(vm.drag.num === (number - 1) * 100){
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
                const vm = this, disabled = vm.drag.disabled,
                    num = vm.drag.nums[dest] ? vm.drag.nums[dest] : 0,
                    next = node.getElementsByClassName(this.drag.next)[0],
                    prev = node.getElementsByClassName(this.drag.prev)[0];
                if(num > 0){
                    vm.removeClass(prev, disabled);
                    if(num === (number - 1) * vm.drag.width.width){
                        vm.addClass(next, disabled);
                    }else{
                        vm.removeClass(next, disabled);
                    }
                }else{
                    vm.addClass(prev, disabled);
                    if(number > 1){
                        vm.removeClass(next, disabled);
                    }else{
                        vm.addClass(next, disabled);
                    }
                }
            },

            /**
             * init component container(draggable)
             * mainly use to delete for all target-list
             */
            initComponentBodyDraggable() {
                const vm = this,
                    container = document.getElementsByClassName(vm.drag.layout)[0];
                Sortable.create(container, {
                    group: {
                        name: 'container',
                        pull: true,
                        put: ['target']
                    },
                    animation: 120,
                    ghostClass: 'fl-dragging',
                    onAdd(event) {
                        const children = event.target.children,
                            length = children.length;
                        if(length > 1){
                            for(let i = 0; i < length; i++){
                                if(children.hasOwnProperty(i)){
                                    const cur = children[i];
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
             * Initilize the original drag list
             * Contains `source-list`
             */
            initComponentSourceDraggable() {
                document.body.ondrop = function (event) {
                    event.preventDefault();
                    event.stopPropagation();
                };
                const vm = this, source = document.getElementById('source');
                Sortable.create(source, {
                    group: {
                        name: 'source',
                        pull: 'clone',
                        put: ['none']
                    },
                    animation: 120,
                    ghostClass: 'fl-dragging',
                    sort: false,
                    onStart(event) {
                        vm.updateComponentBodyWidth('start', event);
                        const current = vm.getCurrentTabContainer(),
                            list = current.getElementsByClassName(vm.drag.list)[0],
                            length = list.children.length,
                            height = list.clientHeight;
                        if(length > 0){
                            if(event.item.clientHeight !== height){
                                vm.$error('高度不一致 ( <span class="red">注：</span>清空当前展开推荐行内的组件或选择高度一致的组件，当前高度为 <span class="theme">' + (height / vm.ratio) + '</span> )', 400, 3);
                                return false;
                            }
                        }
                    },
                    onEnd() {
                        vm.updateComponentBodyWidth();
                    }
                });
            },

            /**
             * Initilize the target drag list
             * Control of the switcher when the list is adding or removing.
             * @param id dom's id
             */
            initComponentTargetDraggable(id) {
                id = id ? 'target-' + id : 'target';
                const vm = this, target = document.getElementById(id),
                    updateObj = function(event, children){
                        const temp = [];
                        let i = 0, n = 0;
                        for(; i < children.length; i++){
                            temp.push(children[i].cloneNode(true));
                        }
                        target.innerHTML = '';
                        for(; n < temp.length; n++){
                            temp[n].style.marginRight = (vm.base.margin * vm.ratio) + 'px';
                            target.appendChild(temp[n]);
                        }
                        document.getElementById(vm.drag.source).insertBefore(event.item, event.clone);
                        event.clone.remove();
                    },
                    add = function(event){
                        const node = target.parentNode,
                            parentNode = node.parentNode,
                            children = target.children,
                            num = children.length,
                            number = vm.getComponentPagesNumber(parentNode, num);
                        updateObj(event, children);
                        vm.handleComponentTargetSwitch(parentNode, number, id);
                        node.scrollLeft = 0;
                        vm.setComponentBodyHeight(id);
                    },
                    update = function(){
                        const node = target.parentNode,
                            parentNode = node.parentNode,
                            num = target.children.length,
                            number = vm.getComponentPagesNumber(parentNode, num),
                            oldWidth = vm.drag.nums[id] ? vm.drag.nums[id] : 0,
                            newWidth = (number - 1) * vm.drag.width.width,
                            first = oldWidth === 0 && newWidth === 0;
                        if(first || oldWidth > newWidth){
                            target.style.marginLeft = '-' + newWidth + 'px';
                            const width = newWidth <= 0 ? vm.drag.width.width : newWidth;
                            target.style.width = width + 'px';
                            vm.$set(vm.drag.nums, id, newWidth);
                        }
                        vm.handleComponentTargetSwitch(parentNode, number, id);
                        node.scrollLeft = 0;
                    };
                vm.setComponentBodyWidth(id);
                vm.setComponentBodyHeight(id);
                vm.$set(vm.drag.nums, id, 0);
                vm.setComponentBaseData();
                if(target) {
                    if(vm.click || vm.only){
                        vm.drag.target[id] = {};
                    }else{
                        vm.drag.target[id] = Sortable.create(target, {
                            group: {
                                name: 'target',
                                pull: true,
                                put: ['source']
                            },
                            animation: 120,
                            ghostClass: 'fl-dragging',
                            onAdd(event) {
                                add(event);
                                event.item.style = 'margin-right: ' + (vm.base.margin * vm.ratio) + 'px';
                            },
                            onRemove() {update();}
                        });
                    }
                }
            },

            /**
             * create recommend's row
             * via update the `elements` variable ( insert in the queue head )
             */
            createComponentRow() {
                const vm = this;
                vm.$set(vm.drag.elements, vm.drag.row, {id: vm.drag.tabs.id, component: component, props: {row: vm.drag.row}});
                const row = vm.drag.row + 1,
                    num = vm.drag.tabs.id + 1;
                vm.drag.tabs.row.push(row);
                vm.$set(vm.drag.tabs, 'value', 'tab-' + vm.drag.tabs.id);
                vm.$set(vm.drag, 'row', row);
                vm.$set(vm.drag.tabs, 'id', num);
            },

            /**
             * Communication between components.
             * via the common Vue object called `bus`
             */
            handleBroadcast() {
                const vm = this;
                bus.$on('prev-action', function(event){
                    vm.handleComponentPrev(event);
                });
                bus.$on('next-action', function(event){
                    vm.handleComponentNext(event);
                });
                bus.$on('init-target-draggable', function(){
                    vm.$nextTick(() => {
                        const row = vm.drag.row - 1;
                        vm.initComponentTargetDraggable(row);
                        if(!vm.only) vm.initComponentBodyDraggable();
                    });
                });
                vm.$on('init-finish', function(){
                    if(vm.click){
                        vm.initDraggableShapeClick();
                    }
                });
            },

            /**
             * init draggable (edit).
             * via recommend-layout-id.
             */
            initDraggable() {
                const vm = this, template = {};
                let i = 0, height = 0;
                if(vm.rows && vm.rows.length > 0){
                    const getTotalWidth = function(data, space){
                        let tempWidth = 0;
                        if(data.length > 0){
                            for(let d = 0; d < data.length; d++){
                                const tempCur = data[d];
                                if(tempCur.data.length > 0){
                                    tempWidth += (tempCur.data[0].width + space);
                                }
                            }
                        }
                        tempWidth -= space;
                        return tempWidth;
                    };
                    for(; i < vm.rows.length; i++){
                        const cur = vm.rows[i],
                            data = cur['recRowModules'],
                            temp = vm.parseComponentData(data, cur['recRowId']),
                            id = i <= 0 ? 'target' : 'target-' + i,
                            totalWidth = getTotalWidth(temp.list, temp.space);
                        if(i > 0) vm.createComponentRow();
                        height = temp.height > height ? temp.height : height;
                        template[id] = {
                            template: vm.initDraggableShape(temp, id),
                            height: temp.height,
                            pages: Math.ceil(totalWidth / vm.drag.width.width)
                        };
                    }
                    vm.$nextTick(() => {
                        if(Object.keys(template).length > 0){
                            for(const k in template){
                                if(template.hasOwnProperty(k)){
                                    const current = template[k],
                                        container = document.getElementById(k);
                                    vm.$set(vm.drag.height, k, current.height);
                                    vm.$set(vm.drag.nums, k, 0);
                                    vm.$set(vm.drag.width.nums, k, 1);
                                    container.innerHTML = current.template;
                                    /** re initialization */
                                    if(typeof vm.drag.target[k] === 'undefined'){
                                        const ks = k.split('-'),
                                            row = parseInt(ks[1]);
                                        if(row !== 'null' && row !== '' && !isNaN(row)){
                                            vm.initComponentTargetDraggable(row);
                                        }
                                    }
                                    vm.handleComponentTargetSwitch(container.parentNode.parentNode, current.pages, k);
                                }
                            }
                            if(vm.click || vm.init){
                                if(vm.drag.shape.template.length > 0){
                                    for(const n in vm.drag.shape.template){
                                        if(vm.drag.shape.template.hasOwnProperty(n)){
                                            const cur = vm.drag.shape.template[n];
                                            vm.drag.shape.instance.push(new Vue({
                                                el: '#' + cur.id,
                                                data() {
                                                    return {
                                                        values: vm.drag.shape.values
                                                    };
                                                },
                                                render: Vue.compile(cur.template).render
                                            }));
                                        }
                                    }
                                }
                                vm.$emit('init-finish');
                            }
                        }else{
                            vm.$error('组件初始化失败，请刷新后再试');
                            return false;
                        }
                    });
                }
            },

            /**
             * init recommend row template.
             * @param data
             * @param cid {*} `container id`
             * @returns {string}
             */
            initDraggableShape(data, cid) {
                const vm = this,
                    list = data.list,
                    length = list.length,
                    cls = vm.drag.div,
                    templates = [],
                    icon = `<icon type="ios-plus-outline"></icon>`;
                /** shape list (recommend group) */
                for(let i = 0; i < length; i++){
                    const cur = list[i],
                        items = cur.data,
                        len = items.length,
                        div = [], template = [];
                    let right = vm.base.margin * vm.ratio;
                    right = right > 0 ? right + 'px' : '17px';
                    template.push(
                        `<div class="${vm.drag.item}" data-index="${cur.id}" style="margin-right: ${right}">`
                    );
                    /** recommend position (items) */
                    for(let n = 0; n < len; n++){
                        const item = items[n],
                            text = item.sourceWidth + ' * ' + item.sourceHeight,
                            style = [
                                `width: ${item.width}px;`,
                                `height: ${item.height}px;`,
                                `margin-bottom: ${item.space}px;`
                            ],
                            content = vm.click
                                ? (vm.detail ? `<Row>${text}</Row>` : icon)
                                : (vm.init ? `<Row>${text}</Row>` : text),
                            params = [], string = {},
                            id = vm.$unique();
                        /** set `carousel v-model` values */
                        vm.$set(vm.drag.shape.values, id, 0);
                        /** whether can click or not. */
                        if(vm.init || vm.click){
                            /** attributes data */
                            const attrs = [
                                `id="${vm.drag.shape.prefix}-${id}"`,
                                `data-id="${cur.id}"`,
                                `data-mid="${item.mid}"`,
                                `data-pos="${item.position}"`,
                                `data-row="${data.row}"`,
                                `data-key="${vm.drag.shape.prefix}-${id}"`,
                                `class="${cls}"`
                            ];
                            params.push(attrs.join(' '));
                            /** node */
                            const initData = item.initData,
                                ilen = initData.length,
                                items = [];
                            /** style */
                            if(vm.click && content === icon && ilen !== 1){
                                style.push(`font-size: ${item.height}px;`);
                            }
                            /** convert to `string` */
                            string.params = params.join('');
                            string.style = style.join('');
                            if(ilen <= 0){
                                /** none (add icon or `text`) */
                                div.push(
                                    `<div ${string.params} style="${string.style}">${content}</div>`
                                );
                            }else if(ilen === 1){
                                /** single image */
                                div.push(
                                    `<div ${string.params} style="${string.style}"><Row class="fl-drag-item-img"><img src="${initData[0].link}" class="${vm.drag.shape.image}" data-index="${initData[0].index}" /></Row></div>`
                                );
                            }else if(ilen > 1){
                                /** carousel */
                                vm.$set(vm.drag.shape.setting, 'auto', true);
                                for(const k in initData){
                                    if(initData.hasOwnProperty(k)){
                                        items.push(
                                            `<CarouselItem><img src="${initData[k].link}" class="${vm.drag.shape.image}" data-index="${initData[k].index}" /></CarouselItem>`
                                        );
                                    }
                                }
                                div.push(
                                    `<div ${string.params} style="${string.style}"><Carousel :autoplay="${vm.drag.shape.setting.auto}" :autoplay-speed="${vm.drag.shape.setting.speed}" :radius-dot="${vm.drag.shape.setting.radiuDot}" v-model="values['${id}']" loop>${items.join('')}</Carousel></div>`
                                );
                            }
                        }else{
                            /** normal, can't click. */
                            string.params = params.join('');
                            string.style = style.join('');
                            div.push(
                                `<div class="${vm.drag.div}" ${string.params} style="${string.style}">${content}</div>`
                            );
                        }
                    }
                    template.push(div.join('') + '</div>');
                    templates.push(template.join(''));
                }
                if(vm.click || vm.init){
                    /** `template` record. */
                    vm.drag.shape.template.push({
                        id: cid,
                        template: `<div id="${cid}" class="${vm.drag.list} clearfix">${templates.join('')}</div>`
                    });
                }
                return templates.join('');
            },

            /**
             * init click event.
             * emit `callback` function.
             */
            initDraggableShapeClick() {
                const vm = this,
                    container = vm.$refs.draggable.$el,
                    items = container.getElementsByClassName(vm.drag.div),
                    length = items.length;
                let i = 0;
                if(length > 0){
                    for(; i < length; i++){
                        const cur = items[i],
                            eventHandle = function(){
                                if(!vm.hasClass(cur, vm.drag.active)){
                                    vm.removeClass(items, vm.drag.active);
                                    vm.addClass(cur, vm.drag.active);
                                    const row = cur.getAttribute('data-row'),
                                        pos = cur.getAttribute('data-pos'),
                                        id = cur.getAttribute('data-id'),
                                        mid = cur.getAttribute('data-mid'),
                                        key = cur.getAttribute('data-key'),
                                        data = {id: key, recRowId: row, recModuleId: id, recRowModuleId: mid, recPositionId: pos};
                                    vm.$set(vm.drag.shadow, 'data', data);
                                    vm.setDraggableShapeShadow(cur);
                                    return data;
                                }
                                return false;
                            },
                            click = function(){
                                const data = eventHandle();
                                if(data){
                                    vm.$emit('callback', data);
                                }
                            };
                        off(cur, 'click', click);
                        on(cur, 'click', click);
                    }
                }
            },

            /**
             * set border shadow.
             * add active class in current element.
             * @param node
             * @param data
             */
            setDraggableShapeShadow(node, data) {
                const vm = this,
                    parent = node.parentNode.parentNode,
                    id = parent.getAttribute('id'),
                    left = vm.drag.nums[id] > 0
                        ? node.offsetLeft - vm.drag.nums[id]
                        : node.offsetLeft,
                    top = node.offsetTop,
                    width = node.clientWidth,
                    height = node.clientHeight,
                    parents = parent.parentNode;
                if(parents && vm.hasClass(parents, vm.drag.content)){
                    const elem = parents.getElementsByClassName(vm.drag.shadow.normal)[0],
                        style = [];
                    if(elem){
                        elem.removeAttribute('style');
                        style.push(
                            `top: ${top}px;`,
                            `left: ${left}px;`,
                            `width: ${width}px;`,
                            `height: ${height}px;`,
                            `display: block;`
                        );
                        elem.setAttribute('style', style.join(''));
                        vm.addClass(elem, vm.drag.shadow.active);
                        const click = function(){
                            if(vm.hasClass(this, vm.drag.shadow.active)){
                                vm.removeClass(this, vm.drag.shadow.active);
                                this.style.display = 'none';
                                vm.removeClass(document.getElementById(vm.drag.shadow.data.id), vm.drag.active);
                                vm.$emit('cancel', data);
                            }
                        };
                        off(elem, 'click', click);
                        on(elem, 'click', click);
                    }
                }
            },

            /**
             * remove shadow active class.
             * add active class in current element.
             */
            handleDraggableShapeShadowActive() {
                const vm = this,
                    actives = document.getElementsByClassName(vm.drag.shadow.active),
                    length = actives.length;
                if(length > 0){
                    for(let i = 0; i < length; i++){
                        const cur = actives[i];
                        vm.removeClass(cur, vm.drag.shadow.active);
                    }
                }
            }
        },
        watch: {
            index: function(){
                const vm = this, data = vm.wrapComponentData();
                vm.$emit('get-data', data);
            },
            id: function(){
                const vm = this;
                if(vm.init) vm.initDraggable();
            },
            fill: function(){
                const vm = this,
                    elem = document.getElementById(vm.fill.id),
                    image = document.createElement('img'),
                    cls = vm.drag.shape.image,
                    selector = '.higher .' + cls,
                    template = [];
                if(elem){
                    let images = elem.querySelectorAll(selector),
                        ilen = images ? images.length : 0, list = [];
                    /** `carousel` or not. */
                    if(ilen <= 0){
                        images = elem.getElementsByClassName(cls);
                        ilen = images.length;
                    }
                    /** get the current node's attributes */
                    const attrs = [
                        `id="${elem.getAttribute('id')}"`,
                        `data-id="${elem.getAttribute('data-id')}"`,
                        `data-mid="${elem.getAttribute('data-mid')}"`,
                        `data-pos="${elem.getAttribute('data-pos')}"`,
                        `data-row="${elem.getAttribute('data-row')}"`,
                        `data-key="${elem.getAttribute('data-key')}"`,
                        `class="${elem.className}"`,
                        `style="${elem.getAttribute('style')}"`
                    ];
                    if(vm.fill.action && vm.fill.action.toLowerCase() === 'delete'){
                        template.push(`<div ${attrs.join(' ')}>`);
                        if(ilen > 1){
                            template.push(
                                `<Carousel :autoplay="${vm.drag.shape.setting.auto}" :autoplay-speed="${vm.drag.shape.setting.speed}" :radius-dot="${vm.drag.shape.setting.radiuDot}" loop>`
                            );
                            for(let i = 0; i < ilen; i++){
                                const cur = images[i];
                                list.push(cur.getAttribute('data-index'));
                            }
                            for(const x in list){
                                if(list.hasOwnProperty(x)){
                                    if(vm.trim(list[x]) !== vm.trim(vm.file.index)){
                                        list.splice(x, 1);
                                    }else{
                                        template.push(`<CarouselItem>`);
                                        template.push(`<img src="${list[n].link}" class="${cls}" data-index="${list[n].index}" />`);
                                        template.push(`</CarouselItem>`);
                                    }
                                }
                            }
                            template.push(`</Carousel></div>`);
                            /** after delete */
                            if(list.length === 1){
                                template.splice(0, template.length);
                                template.push(
                                    `<div ${attrs.join(' ')}>`,
                                    `<Row><img src="${list[0].link}" class="${vm.drag.shape.image}" data-index="${list[0].index}" /></Row>`,
                                    `</div>`
                                );
                            }
                        }else{
                            template.push(`<icon type="ios-plus-outline"></icon></div>`);
                            elem.innerHTML = '<icon type="ios-plus-outline"></icon>';
                        }
                    }else{
                        if(vm.fill.link){
                            image.src = vm.fill.link;
                            image.className = vm.drag.shape.image;
                            image.setAttribute('data-index', vm.fill.index);
                            if(ilen > 0){
                                /** get existing images */
                                list.push({index: vm.fill.index, link: vm.fill.link});
                                for(let i = 0; i < ilen; i++){
                                    const cur = images[i];
                                    list.push({
                                        index: cur.getAttribute('data-index'),
                                        link: cur.getAttribute('src')
                                    });
                                }
                                /** assembly `carousel` template */
                                vm.$set(vm.drag.shape.setting, 'auto', true);
                                template.push(
                                    `<div ${attrs.join(' ')}>`,
                                    `<Carousel :autoplay="${vm.drag.shape.setting.auto}" :autoplay-speed="${vm.drag.shape.setting.speed}" :radius-dot="${vm.drag.shape.setting.radiuDot}" loop>`
                                );
                                for(const n in list){
                                    if(list.hasOwnProperty(n)){
                                        template.push(`<CarouselItem>`);
                                        template.push(`<img src="${list[n].link}" class="${cls}" data-index="${list[n].index}" />`);
                                        template.push(`</CarouselItem>`);
                                    }
                                }
                                template.push(`</Carousel></div>`);
                                elem.innerHTML = template.join('');
                            }else{
                                /** single image */
                                elem.innerHTML = '';
                                elem.appendChild(image);
                            }
                        }else{
                            vm.$error('链接有误，图片显示失败');
                            return false;
                        }
                    }
                    if(template.length > 0){
                        /** compile and render the template */
                        vm.drag.shape.instance.push(new Vue({
                            el: '#' + vm.fill.id,
                            data() {
                                return {
                                    values: vm.drag.shape.values
                                }
                            },
                            render: Vue.compile(template.join('')).render
                        }));
                        /** re binding events */
                        if(vm.click){
                            vm.initDraggableShapeClick();
                        }
                    }
                }
            }
        },
        mounted() {
            const vm = this;
            Vue.component(component, RecommendRowComponent);
            vm.getComponentBaseData();
            vm.getComponentHeightData();
            if(!vm.only){
                vm.initComponentBodyDraggable();
                vm.initComponentSourceDraggable();
            }
            vm.initComponentTargetDraggable();
            vm.handleBroadcast();
            on(window, 'resize', vm.handleWindowResize);
        },
        destroyed() {
            const vm = this;
            off(window, 'resize', vm.handleWindowResize);
        }
    };
    export default DragComponent;

</script>
