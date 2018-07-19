<template>
    <div class="fl-container">
        <Card>
            <Row class="fl-draggable">
                <Card id="source-list">
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
                                    <span v-for="(box, k) in item.data" :style="{width: box.width + 'px', height: box.height + 'px', 'margin-bottom': box.space + 'px'}" :key="item['id'] + '-' + k">{{ box.sourceWidth + ' * ' + box.sourceHeight }}</span>
                                </div>
                            </div>
                        </div>
                        <div class="fl-drag-next" @click="handleComponentNext">
                            <Icon type="arrow-right-b"></Icon>
                        </div>
                    </div>
                </Card>
                <Row class="fl-tabs fl-recommend-tab mt20">
                    <Tabs name="recommend" :value="drag.tabs.value" v-model="drag.tabs.value">
                        <TabPane label="第 1 行推荐" name="tab">
                            <div class="fl-drag-container" id="target-list">
                                <div class="fl-drag-box fl-drag-target-box flex" data-name="target">
                                    <div class="fl-drag-prev disabled" @click="handleComponentPrev">
                                        <icon type="arrow-left-b"></icon>
                                    </div>
                                    <div class="fl-drag-cont">
                                        <div class="fl-drag-list clearfix" id="target"></div>
                                        <span class="fl-screen-line" :style="{left: ((1920 - base.left) * ratio) + 'px', height: drag.height['target'] + 'px'}" v-if="drag.nums['target'] <= 0"></span>
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
    </div>
</template>

<script>

    import Vue from 'vue';
    import Sortable from 'sortablejs';

    let bus = new Vue();

    Vue.component('recommend-row', {
        template: `<Row class="fl-drag-container" :id="'target-list-' + row">
    <div class="fl-drag-box fl-drag-target-box flex" :data-name="'target-' + row">
        <div class="fl-drag-prev disabled" @click="handleComponentPrev">
            <Icon type="arrow-left-b"></Icon>
        </div>
        <div class="fl-drag-cont">
            <div class="fl-drag-list clearfix" :id="'target-' + row"></div>
            <span class="fl-screen-line" :style="{left: ((1920 - base.left) * ratio) + 'px', height: drag.height['target-list-' + row] + 'px'}" v-if="drag.nums['target-' + row] <= 0"></span>
        </div>
        <div class="fl-drag-next disabled" @click="handleComponentNext">
            <Icon type="arrow-right-b"></Icon>
        </div>
    </div>
</Row>`,
        data() {
            return {
                ratio: 0.5,
                base: {
                    left: 0,
                    margin: 0
                },
                drag: {
                    height: {},
                    nums: {target: 0}
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
        }
    });

    const DragComponent = {
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
                let vm = this;
                vm.$api.get(vm.G.api.recommend.base, {}, function(res){
                    if(res['ret']['retCode'].toString() === '0'){
                        let left = res.data['leftMargin'],
                            space = res.data['recModuleInterval'];
                        vm.$set(vm.base, 'left', left);
                        vm.$set(vm.base, 'margin', space);
                    }else{
                        vm.$error(res['ret']['retMsg']);
                        return false;
                    }
                }, function(err){
                    vm.$error(err.msg);
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
                let vm = this, ratio = vm.ratio, list = [];
                vm.$api.post(vm.G.api.recommend.group.list, vm.search, function(res){
                    if(res['ret']['retCode'].toString() === '0'){
                        vm.$set(vm, 'items', list);
                        let tempWidth = 0, tempSpace = 0;
                        for(let i = 0; i < res.data.length; i++){
                            let cur = res.data[i], data = [], h,
                                num = parseInt(cur['recPositionNum']),
                                width = cur['recModuleWidth'],
                                height = cur['recModuleHeight'],
                                space = cur['rowSpacing'];
                            if(tempWidth <= 0) tempWidth = width * ratio;
                            if(tempSpace <= 0) tempSpace = space * ratio;
                            if(num > 1){
                                for(let n = 0; n < num; n++){
                                    let oneHeight = (height - space * (num - 1)) / num;
                                    h = Math.round((oneHeight * ratio) * 10) / 10;
                                    let temp = {width: width * ratio, space: space * ratio, height: h, sourceWidth: width, sourceHeight: oneHeight};
                                    if(n === num - 1) temp['space'] = 0;
                                    data.push(temp);
                                }
                            }else{
                                h = Math.round(height * ratio * 10) / 10;
                                let temp = {width: width * ratio, height: h, space: 0, sourceWidth: width, sourceHeight: height};
                                data.push(temp);
                            }
                            list.push({id: cur['recModuleId'], data: data});
                        }
                        vm.$set(vm, 'items', list);
                        let source = document.getElementById('source'),
                            sourceWidth = source.clientWidth,
                            parent = source.parentNode.parentNode,
                            length = res.data.length,
                            totalWidth = tempWidth * length + tempSpace * (length - 1);
                        if(totalWidth < sourceWidth){
                            let next = parent.getElementsByClassName(vm.drag.next)[0];
                            vm.addClass(next, vm.drag.disabled);
                        }
                    }else{
                        vm.$error(res['ret']['retMsg']);
                        return false;
                    }
                }, function(err){
                    vm.$error(err.msg);
                    return false;
                });
            },

            /**
             * get component `height` type.
             * all of it.
             */
            getComponentHeightData() {
                let vm = this;
                vm.$api.get(vm.G.api.recommend.group.height, {}, function(res){
                    if(res['ret']['retCode'].toString() === '0'){
                        vm.$set(vm.search, 'height', res.data[0]);
                        vm.$set(vm, 'height', res.data);
                        vm.getComponentData();
                    }else{

                    }
                }, function(err){

                });
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
                    number = typeof num !== 'undefined' ? parseInt(num) : vm.items.length,
                    contentWidth = vm.getComponentNodeWidth(node, vm.drag.content),
                    items = node.getElementsByClassName(vm.drag.item),
                    itemWidth = 0, totalWidth;
                if(number > 0){
                    for(let i = 0; i < number; i++){
                        itemWidth += items[i].clientWidth;
                    }
                }
                totalWidth = itemWidth + (vm.base.margin * vm.ratio) * (number - 1);
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
             * current tab container.
             * via `this.drag.tabs.value` variable.
             */
            getCurrentTabContainer() {
                let vm = this,
                    container = document.getElementsByClassName(vm.drag.container),
                    values = JSON.parse(JSON.stringify(vm.drag.tabs.value)).split('-'),
                    value = parseInt(values[values.length - 1]), current;
                if(isNaN(value)) current = container[0];
                else current = container[value];
                return current;
            },

            /**
             * component base data.
             * `margin-left`, `margin-top` etc.
             */
            setComponentBaseData() {
                let vm = this;
                bus.$emit('set-base-data', [vm.base, vm.ratio]);
            },

            /**
             * drag data.
             * `target-list` height, `page-nums` etc.
             */
            setComponentDragData() {
                let vm = this;
                bus.$emit('set-drag-data', vm.drag);
            },

            /**
             * setting the height of the recommend's body
             * @param id {*} dom id
             * @param init {*} init or not.
             */
            setComponentBodyHeight(id, init) {
                id = id ? id : 'target-list';
                if(init){
                    let ids = id.split('-'),
                        num = parseInt(ids[1]);
                    if(!isNaN(num)){
                        id = 'target-list-' + num;
                    }
                }
                let vm = this, body = document.getElementById(id);
                body.style.height = '';
                let height = body.scrollHeight;
                body.style.height = height + 'px';
                vm.$set(vm.drag.height, id, height);
                vm.setComponentDragData();
            },

            /**
             * setting the width of the recommend's body
             * @param id {*} `dom` id.
             */
            setComponentBodyWidth(id) {
                let vm = this, body = document.getElementById(id);
                if(body){
                    let width = body.scrollWidth,
                        temp = vm.drag.width.width;
                    if(typeof temp !== 'undefined'){
                        if(temp !== width){
                            vm.$set(vm.drag.width, 'width', width);
                            let nums = vm.drag.width.nums, i;
                            for(i in nums){
                                if(nums.hasOwnProperty(i)){
                                    let list = document.getElementById(i);
                                    list.style.width = width * nums[i] + 'px';
                                    vm.$set(vm.drag.width.nums, id, 1);
                                }
                            }
                        }
                    }else{
                        vm.$set(vm.drag.width, 'width', width);
                        vm.$set(vm.drag.width, 'nums', []);
                        vm.$set(vm.drag.width.nums, id, 1);
                    }
                }
            },

            /**
             * set the recommend row's label.
             * customized content (render).
             */
            setComponentTabLabel(row) {
                let vm = this, num = row + 1,
                    label = '第 ' + num + ' 行推荐';
                return (h) => {
                    return h('div', [
                        h('span', label),
                        h('icon', {
                            props: {type: vm.drag.tabs.icon},
                            attrs: {
                                'data-row': row,
                                title: '删除'
                            },
                            on: {
                                click: (event) => {
                                    let parent = event.currentTarget.parentNode.parentNode,
                                        brother = parent.previousSibling, id = -1,
                                        number = event.currentTarget.getAttribute('data-row'),
                                        elements = JSON.parse(JSON.stringify(vm.drag.elements));
                                    brother.click();
                                    for(let i in elements){
                                        if(elements.hasOwnProperty(i)){
                                            let temp = parseInt(elements[i].id);
                                            if(temp === parseInt(number)){
                                                id = temp;
                                                delete elements[i];
                                                break;
                                            }
                                        }
                                    }
                                    if(Object.keys(elements).length > 0){
                                        for(let n in elements){
                                            if(elements.hasOwnProperty(n)){
                                                let temp = parseInt(elements[n].id);
                                                if(temp > id){
                                                    elements[n].id = temp - 1;
                                                }
                                            }
                                        }
                                    }
                                    vm.$set(vm.drag, 'elements', elements);
                                    vm.$set(vm.drag.tabs, 'id', vm.drag.tabs.id - 1);
                                }
                            }
                        })
                    ]);
                }
            },

            /**
             * update list's height.
             * when you choose item in the source list (mouse enter - the start),
             * and dragging the item to target list until the mouse leave (the end), updated it
             * @param type {*} `onStrat` or `onEnd` action.
             * @param event {*} event handle
             */
            updateComponentBodyWidth(type, event) {
                let vm = this, curContainer,
                    container = document.getElementsByClassName(vm.drag.container),
                    list, number, num, id, itemWidth = 0, totalWidth, current;
                if(container.length > 0){
                    current = vm.getCurrentTabContainer();
                    curContainer = document.getElementById(current.getAttribute('id'));
                    list = current.getElementsByClassName(vm.drag.list)[0];
                    id = list.getAttribute('id');
                    let items = list.getElementsByClassName(vm.drag.item);
                    number = items.length;
                    if(number > 0){
                        for(let i = 0; i < number; i++){
                            itemWidth += items[i].clientWidth;
                        }
                    }
                    totalWidth = itemWidth + (vm.base.margin * vm.ratio) * (number - 1);
                    totalWidth = totalWidth > 0 ? totalWidth : 0;
                    let contentWidth = vm.getComponentNodeWidth(curContainer, vm.drag.content);
                    num = Math.ceil(totalWidth / contentWidth);
                    if(num !== vm.drag.width.nums[id]){
                        vm.$set(vm.drag.width.nums, id, num);
                    }
                    if(type === 'start'){
                        let curWidth = event.item.clientWidth;
                        if(totalWidth + curWidth > vm.drag.width.width){
                            num = parseInt(vm.drag.width.nums[id]) + 1;
                            vm.$set(vm.drag.width.nums, id, num);
                        }
                    }
                    if(vm.drag.width.width !== contentWidth){
                        vm.$set(vm.drag.width, 'width', contentWidth);
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
                let vm = this,
                    container = document.getElementsByClassName(vm.drag.tabs.container)[0],
                    tabs, length = 0, i = 0, n = 0, data = [];
                if(container){
                    tabs = container.getElementsByClassName(vm.drag.tabs.tab);
                    length = tabs.length;
                    if(length > 0){
                        for(; i < length; i++){
                            let curTab = tabs[i], temp = [],
                                items = curTab.getElementsByClassName(vm.drag.item);
                            if(items.length > 0){
                                for(; n < items.length; n++){
                                    let cur = items[n],
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
                let vm = this, current, list,
                    oldWidth, newWidth, num,
                    number, curNum, listId;
                current = vm.getCurrentTabContainer();
                vm.setComponentBodyHeight(current.getAttribute('id'));
                list = current.getElementsByClassName(vm.drag.list)[0];
                oldWidth = list.clientWidth;
                list.removeAttribute('style');
                listId = list.getAttribute('id');
                newWidth = list.clientWidth;
                number = vm.drag.width.nums[listId];
                num = vm.getComponentPagesNumber(current, list.children.length);
                if(newWidth !== vm.drag.width.width){
                    vm.$set(vm.drag.width, 'width', newWidth);
                    vm.$set(vm.drag.width.nums, listId, num);
                    let targetNum = vm.drag.nums[listId];
                    if(targetNum > 0){
                        if(num < number) curNum = 0;
                        else curNum = (oldWidth / targetNum) - 1;
                        let left = newWidth * curNum;
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
                let vm = this;
                vm.getComponentData();
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
                        num -= vm.drag.width.width;
                        vm.$set(vm.drag.nums, name, num);
                    }
                    listNode.style.marginLeft = '-' + num + 'px';
                    let number = vm.getComponentPagesNumber(parentNode, listNode.children.length);
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
                let vm = this,
                    parentNode = event.currentTarget.parentNode,
                    listNode = parentNode.getElementsByClassName(vm.drag.list)[0],
                    name = parentNode.getAttribute('data-name'),
                    isTarget = name.indexOf('target') > -1;
                if(isTarget){
                    let num = listNode.children.length,
                        number = vm.getComponentPagesNumber(parentNode, num),
                        targetNum = vm.drag.nums[name] ? vm.drag.nums[name] : 0;
                    if(targetNum < (number - 1) * vm.drag.width.width){
                        targetNum += vm.drag.width.width;
                        vm.$set(vm.drag.nums, name, targetNum);
                    }
                    listNode.style.marginLeft = '-' + targetNum + 'px';
                    vm.handleComponentTargetSwitch(parentNode, number, name);
                    vm.setComponentDragData();
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
                    let listNode = node.getElementsByClassName(vm.drag.list)[0],
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
                let vm = this,
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
             * Initilize the original drag list
             * Contains `source-list`
             */
            initComponentSourceDraggable() {
                document.body.ondrop = function (event) {
                    event.preventDefault();
                    event.stopPropagation();
                };
                let vm = this, source = document.getElementById('source');
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
                        let current = vm.getCurrentTabContainer(),
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
                let vm = this, target = document.getElementById(id),
                    updateObj = function(event, children){
                        let temp = [], i = 0, n = 0;
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
                        let parentNode = target.parentNode.parentNode,
                            children = target.children,
                            num = children.length,
                            number = vm.getComponentPagesNumber(parentNode, num);
                        updateObj(event, children);
                        vm.handleComponentTargetSwitch(parentNode, number, id);
                        vm.updateComponentBodyWidth();
                        vm.setComponentBodyHeight(id, true);
                        let node = vm.getParentsNodeByClassName(event, vm.drag.container),
                            tid = node.getAttribute('id');
                        vm.setComponentBodyHeight(tid);
                    },
                    update = function(event){
                        let parentNode = target.parentNode.parentNode,
                            num = target.children.length,
                            number = vm.getComponentPagesNumber(parentNode, num),
                            oldWidth = vm.drag.nums[id] ? vm.drag.nums[id] : 0,
                            newWidth = (number - 1) * vm.drag.width.width,
                            first = oldWidth === 0 && newWidth === 0;
                        if(first || oldWidth > newWidth){
                            target.style.marginLeft = '-' + newWidth + 'px';
                            let width = newWidth <= 0 ? vm.drag.width.width : newWidth;
                            target.style.width = width + 'px';
                            vm.$set(vm.drag.nums, id, newWidth);
                        }
                        vm.handleComponentTargetSwitch(parentNode, number, id);
                        vm.updateComponentBodyWidth();
                        vm.setComponentBodyHeight(id, true);
                        let node = vm.getParentsNodeByClassName(event, vm.drag.container),
                            tid = node.getAttribute('id');
                        vm.setComponentBodyHeight(tid);
                    };
                vm.setComponentBodyWidth(id);
                vm.setComponentBodyHeight(id, true);
                vm.$set(vm.drag.nums, id, 0);
                vm.setComponentBaseData();
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
                vm.$set(vm.drag.elements, vm.drag.row, {id: vm.drag.tabs.id, component: 'recommend-row', props: {row: vm.drag.row}});
                let row = vm.drag.row + 1,
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
                let vm = this;
                bus.$on('prev-action', function(event){
                    vm.handleComponentPrev(event);
                });
                bus.$on('next-action', function(event){
                    vm.handleComponentNext(event);
                });
                bus.$on('init-target-draggable', function(){
                    vm.$nextTick(() => {
                        let row = vm.drag.row - 1;
                        vm.initComponentTargetDraggable(row);
                        vm.initComponentBodyDraggable();
                    });
                });
            }
        },
        mounted () {
            let vm = this;
            vm.getComponentBaseData();
            vm.getComponentHeightData();
            vm.initComponentBodyDraggable();
            vm.initComponentSourceDraggable();
            vm.initComponentTargetDraggable();
            vm.setComponentBodyHeight('target', true);
            vm.handleBroadcast();
            window.onresize = function(){
                vm.handleWindowResize();
            };
        }
    };
    export default DragComponent;

</script>
