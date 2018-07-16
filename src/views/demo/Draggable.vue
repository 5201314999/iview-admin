<template>
    <div class="fl-container">
        <Card>
            <Row class="fl-draggable">
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
        </div>
        <div class="fl-drag-next disabled" @click="handleComponentNext">
            <Icon type="arrow-right-b"></Icon>
        </div>
    </div>
</Row>`,
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
            initComponentTargetDraggable() {
                bus.$emit('init-target-draggable');
            }
        },
        mounted() {
            let vm = this;
            vm.initComponentTargetDraggable();
        }
    });
    const DragComponent = {
        data() {
            return {
                component: [],
                ratio: 0.5,
                margin: 17,
                drag: {
                    layout: 'fl-container',
                    container: 'fl-drag-container',
                    disabled: 'disabled',
                    box: 'fl-drag-box',
                    prev: 'fl-drag-prev',
                    next: 'fl-drag-next',
                    content: 'fl-drag-cont',
                    list: 'fl-drag-list',
                    source: 'source-list',
                    item: 'fl-drag-item',
                    row: 1,                     // row number.
                    num: 0,                     // page's number ( source ).
                    nums: {target: 0},          // page's number ( target ).
                    elements: {},               // component elements.
                    width: {},                  // row width.
                    height: {},                 // row height.
                    target: {},                 // sortable object.
                    tabs: {
                        container: 'fl-recommend-tab',
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
                id = id ? id : 'target-list';
                let vm = this, body = document.getElementById(id);
                body.style.height = '';
                let height = body.scrollHeight;
                body.style.height = height + 'px';
                vm.$set(vm.drag.height, id, height);
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
             * update list's height.
             * when you choose item in the source list (mouse enter - the start),
             * and dragging the item to target list until the mouse leave (the end), updated it
             * @param type {*} `onStrat` or `onEnd` action.
             * @param event {*} event handle
             */
            updateComponentBodyWidth(type, event) {
                let vm = this, curContainer,
                    container = document.getElementsByClassName(vm.drag.container),
                    list, number, num, id, itemWidth, totalWidth, current;
                if(container.length > 0){
                    let values = JSON.parse(JSON.stringify(vm.drag.tabs.value)).split('-'),
                        value = parseInt(values[values.length - 1]);
                    if(isNaN(value)) current = container[0];
                    else current = container[value];
                    curContainer = document.getElementById(current.getAttribute('id'));
                    list = current.getElementsByClassName(vm.drag.list)[0];
                    id = list.getAttribute('id');
                    number = list.getElementsByClassName(vm.drag.item).length;
                    itemWidth = vm.getComponentNodeWidth(list, vm.drag.item);
                    totalWidth = itemWidth * number + vm.margin * (number - 1);
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
                    if(num > 0) list.style.width = vm.drag.width.width * num + 'px';
                    else list.style.width = vm.drag.width.width + 'px';
                }
            },

            /**
             * set the recommend row's label
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
             * window resize.
             * updated the list height and width.
             */
            handleWindowResize() {
                let vm = this, current, list,
                    container = document.getElementsByClassName(vm.drag.container),
                    values = JSON.parse(JSON.stringify(vm.drag.tabs.value)).split('-'),
                    value = parseInt(values[values.length - 1]);
                if(isNaN(value)) current = container[0];
                else current = container[value];
                vm.setComponentBodyHeight(current.getAttribute('id'));
                list = current.getElementsByClassName(vm.drag.list)[0];
                list.removeAttribute('style');
                let id = list.getAttribute('id'),
                    width = list.scrollWidth;
                list.style.width = width * vm.drag.width.nums[id] + 'px';
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
                    add = function(event){
                        let parentNode = target.parentNode.parentNode,
                            num = target.children.length,
                            number = vm.getComponentPagesNumber(parentNode, num);
                        vm.handleComponentTargetSwitch(parentNode, number, id);
                        vm.updateComponentBodyWidth();
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
                        let node = vm.getParentsNodeByClassName(event, vm.drag.container),
                            tid = node.getAttribute('id');
                        vm.setComponentBodyHeight(tid);
                    };
                vm.setComponentBodyWidth(id);
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
            vm.getComponentData();
            vm.initComponentBodyDraggable();
            vm.initComponentSourceDraggable();
            vm.initComponentTargetDraggable();
            vm.setComponentBodyHeight();
            vm.handleBroadcast();
            window.onresize = function(){
                vm.handleWindowResize();
            };
        }
    };
    export default DragComponent;
</script>
