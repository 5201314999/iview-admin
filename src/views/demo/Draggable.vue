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
                                    <Option :value="item" v-for="(item, index) in height" :key="index"></Option>
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
                                        <span class="fl-screen-line" :style="{left: (1920 * ratio + base.left) + 'px', height: drag.height['target'] + 'px'}"></span>
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
                ratio: 0.5
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
            vm.$on('set-ratio', function(ratio){
                vm.ratio = ratio;
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
                },
                html: '<div class="fl-container">\n' +
                '    <Card>\n' +
                '        <Row class="fl-draggable">\n' +
                '            <Card id="source-list">\n' +
                '                <div class="fl-search clearfix">\n' +
                '                    <div class="search-input left">\n' +
                '                        <Input icon="ios-search" size="large" placeholder="搜索组件ID或组件标题" />\n' +
                '                    </div>\n' +
                '                    <div class="search-button left">\n' +
                '                        <div class="fl-select">\n' +
                '                            <Select placeholder="请选择" value="movie" :style="{width: \'60px\'}">\n' +
                '                                <Option value="movie">100</Option>\n' +
                '                                <Option value="app1">256</Option>\n' +
                '                                <Option value="app2">366</Option>\n' +
                '                                <Option value="app3">400</Option>\n' +
                '                            </Select>\n' +
                '                        </div>\n' +
                '                    </div>\n' +
                '                    <div class="search-button right">\n' +
                '                        <Button type="primary" size="large" @click="createComponentRow">\n' +
                '                            <icon type="plus-round" class="mr5"></icon>添加推荐行\n' +
                '                        </Button>\n' +
                '                    </div>\n' +
                '                </div>\n' +
                '                <div class="fl-drag-box flex" data-name="source">\n' +
                '                    <div class="fl-drag-prev disabled" @click="handleComponentPrev">\n' +
                '                        <Icon type="arrow-left-b"></Icon>\n' +
                '                    </div>\n' +
                '                    <div class="fl-drag-cont clearfix">\n' +
                '                        <div class="fl-drag-list" id="source">\n' +
                '                            <div class="fl-drag-item" v-for="(item, index) in component" :key="index" :data-index="index" :style="{\'margin-right\': index === component.length - 1 ? \'0\' : margin + \'px\'}">\n' +
                '                                <span v-for="(box, k) in item" :style="{width: box.width + \'px\', height: box.height + \'px\', \'margin-bottom\': box.space + \'px\'}" :key="k">{{ box.sourceWidth + \' * \' + box.sourceHeight }}</span>\n' +
                '                            </div>\n' +
                '                        </div>\n' +
                '                    </div>\n' +
                '                    <div class="fl-drag-next" @click="handleComponentNext">\n' +
                '                        <Icon type="arrow-right-b"></Icon>\n' +
                '                    </div>\n' +
                '                </div>\n' +
                '            </Card>\n' +
                '            <Row class="fl-tabs fl-recommend-tab mt20">\n' +
                '                <Tabs name="recommend" :value="drag.tabs.value" v-model="drag.tabs.value">\n' +
                '                    <TabPane label="第 1 行推荐" name="tab">\n' +
                '                        <div class="fl-drag-container" id="target-list">\n' +
                '                            <div class="fl-drag-box fl-drag-target-box flex" data-name="target">\n' +
                '                                <div class="fl-drag-prev disabled" @click="handleComponentPrev">\n' +
                '                                    <icon type="arrow-left-b"></icon>\n' +
                '                                </div>\n' +
                '                                <div class="fl-drag-cont">\n' +
                '                                    <div class="fl-drag-list clearfix" id="target"></div>\n' +
                '                                    <span class="fl-screen-line" :style="{left: ((ratio * 1920) + 20) + \'px\'}"></span>\n' +
                '                                </div>\n' +
                '                                <div class="fl-drag-next disabled" @click="handleComponentNext">\n' +
                '                                    <Icon type="arrow-right-b"></Icon>\n' +
                '                                </div>\n' +
                '                            </div>\n' +
                '                        </div>\n' +
                '                    </TabPane>\n' +
                '                    <TabPane v-for="(element, index) in drag.elements" :label="setComponentTabLabel(element.id)" :ref="\'tab-\' + element.props.row" :key="index" :name="\'tab-\' + element.id">\n' +
                '                        <div :is="element.component" v-bind="element.props"></div>\n' +
                '                    </TabPane>\n' +
                '                </Tabs>\n' +
                '            </Row>\n' +
                '        </Row>\n' +
                '    </Card>\n' +
                '</div>\n' +
                '<script>\n' +
                '    import Vue from \'vue\';\n' +
                '    import Sortable from \'sortablejs\';\n' +
                '\n' +
                '    let bus = new Vue();\n' +
                '\n' +
                '    Vue.component(\'recommend-row\', {\n' +
                '        template: `<Row class="fl-drag-container" :id="\'target-list-\' + row">\n' +
                '    <div class="fl-drag-box fl-drag-target-box flex" :data-name="\'target-\' + row">\n' +
                '        <div class="fl-drag-prev disabled" @click="handleComponentPrev">\n' +
                '            <Icon type="arrow-left-b"></Icon>\n' +
                '        </div>\n' +
                '        <div class="fl-drag-cont">\n' +
                '            <div class="fl-drag-list clearfix" :id="\'target-\' + row"></div>\n' +
                '            <span class="fl-screen-line" :style="{left: ((ratio * 1920) + 20) + \'px\'}"></span>\n' +
                '        </div>\n' +
                '        <div class="fl-drag-next disabled" @click="handleComponentNext">\n' +
                '            <Icon type="arrow-right-b"></Icon>\n' +
                '        </div>\n' +
                '    </div>\n' +
                '</Row>`,\n' +
                '        data() {\n' +
                '            return {\n' +
                '                ratio: 0.5\n' +
                '            }\n' +
                '        },\n' +
                '        props: {\n' +
                '            row: {type: Number}\n' +
                '        },\n' +
                '        methods: {\n' +
                '            handleComponentPrev(event) {\n' +
                '                bus.$emit(\'prev-action\', event);\n' +
                '            },\n' +
                '            handleComponentNext(event) {\n' +
                '                bus.$emit(\'next-action\', event);\n' +
                '            },\n' +
                '            initComponentTargetDraggable() {\n' +
                '                bus.$emit(\'init-target-draggable\');\n' +
                '            }\n' +
                '        },\n' +
                '        mounted() {\n' +
                '            let vm = this;\n' +
                '            vm.initComponentTargetDraggable();\n' +
                '            vm.$on(\'set-ratio\', function(ratio){\n' +
                '                vm.ratio = ratio;\n' +
                '            });\n' +
                '        }\n' +
                '    });\n' +
                '    const DragComponent = {\n' +
                '        data() {\n' +
                '            return {\n' +
                '                component: [],\n' +
                '                ratio: 0.5,\n' +
                '                margin: 17,\n' +
                '                drag: {\n' +
                '                    layout: \'fl-container\',\n' +
                '                    container: \'fl-drag-container\',\n' +
                '                    disabled: \'disabled\',\n' +
                '                    box: \'fl-drag-box\',\n' +
                '                    prev: \'fl-drag-prev\',\n' +
                '                    next: \'fl-drag-next\',\n' +
                '                    content: \'fl-drag-cont\',\n' +
                '                    list: \'fl-drag-list\',\n' +
                '                    source: \'source-list\',\n' +
                '                    item: \'fl-drag-item\',\n' +
                '                    row: 1,                     // row number.\n' +
                '                    num: 0,                     // page\'s number ( source ).\n' +
                '                    nums: {target: 0},          // page\'s number ( target ).\n' +
                '                    elements: {},               // component elements.\n' +
                '                    width: {},                  // row width.\n' +
                '                    height: {},                 // row height.\n' +
                '                    target: {},                 // sortable object.\n' +
                '                    tabs: {\n' +
                '                        container: \'fl-recommend-tab\',\n' +
                '                        row: [],\n' +
                '                        icon: \'ios-close-outline\',\n' +
                '                        id: 1,\n' +
                '                        value: \'tab\'\n' +
                '                    }\n' +
                '                }\n' +
                '            }\n' +
                '        },\n' +
                '        methods: {\n' +
                '            /**\n' +
                '             * get component data.\n' +
                '             * calculating: ((height - space * (total - 1)) / total) * ratio = position height.\n' +
                '             * ```\n' +
                '             * note: the group contains mutiple positions.\n' +
                '             * @height: recommended group height.\n' +
                '             * @space: spacing between two positions ( fixed ).\n' +
                '             * @total: total number of positions.\n' +
                '             * @ratio: scaling ratio.\n' +
                '             * ```\n' +
                '             * object: {width, height, space, sourceWidth, sourceHeight}.\n' +
                '             */\n' +
                '            getComponentData() {\n' +
                '                let vm = this, width = 570, height = 368, space = 34,\n' +
                '                    num = [1, 2, 3], ratio = vm.ratio, list = [];\n' +
                '                vm.setComponentRatio();\n' +
                '                for(let i = 0; i < 10; i++){\n' +
                '                    let n = num[Math.round(Math.random() * (num.length - 1))],\n' +
                '                        data = [], h;\n' +
                '                    if(n > 1){\n' +
                '                        for(let k = 0; k < n; k++){\n' +
                '                            let ratioH = (height - space * (n - 1)) / n;\n' +
                '                            h = Math.round((ratioH * ratio) * 10) / 10;\n' +
                '                            let temp = {width: width * ratio, space: space * ratio, height: h, sourceWidth: width, sourceHeight: ratioH};\n' +
                '                            if(k === n - 1) temp[\'space\'] = 0;\n' +
                '                            data.push(temp);\n' +
                '                        }\n' +
                '                    }else{\n' +
                '                        h = Math.round(height * ratio * 10) / 10;\n' +
                '                        let temp = {width: width * ratio, space: 0, height: h, sourceWidth: width, sourceHeight: height};\n' +
                '                        data.push(temp);\n' +
                '                    }\n' +
                '                    list.push(data);\n' +
                '                }\n' +
                '                this.$set(vm, \'component\', list);\n' +
                '            },\n' +
                '\n' +
                '            /**\n' +
                '             * get component node\'s client width\n' +
                '             * @param node currently clicked object\n' +
                '             * @param name class\' name\n' +
                '             */\n' +
                '            getComponentNodeWidth(node, name) {\n' +
                '                let $dom = node.getElementsByClassName(name);\n' +
                '                if($dom.length > 0){\n' +
                '                    return $dom[0].clientWidth;\n' +
                '                }\n' +
                '                return 0;\n' +
                '            },\n' +
                '\n' +
                '            /**\n' +
                '             * Calculating the page\'s number based on the number of component.\n' +
                '             * @param node currently clicked object\n' +
                '             * @param num component\'s number\n' +
                '             */\n' +
                '            getComponentPagesNumber(node, num) {\n' +
                '                let vm = this,\n' +
                '                    number = num ? parseInt(num) : vm.component.length,\n' +
                '                    contentWidth = vm.getComponentNodeWidth(node, vm.drag.content),\n' +
                '                    itemWidth = vm.getComponentNodeWidth(node, vm.drag.item),\n' +
                '                    totalWidth = itemWidth * number + vm.margin * (number - 1);\n' +
                '                return Math.ceil(totalWidth / contentWidth);\n' +
                '            },\n' +
                '\n' +
                '            /**\n' +
                '             * get parent\'s node via class name.\n' +
                '             * @param event `event object`\n' +
                '             * @param name class name\n' +
                '             */\n' +
                '            getParentsNodeByClassName(event, name) {\n' +
                '                let vm = this, paths = event.path,\n' +
                '                    i = 0, node = null;\n' +
                '                for(; i < paths.length; i++){\n' +
                '                    if(paths.hasOwnProperty(i)){\n' +
                '                        if(vm.hasClass(paths[i], name)){\n' +
                '                            node = paths[i];\n' +
                '                            break;\n' +
                '                        }\n' +
                '                    }\n' +
                '                }\n' +
                '                return node;\n' +
                '            },\n' +
                '\n' +
                '            /**\n' +
                '             * set ratio.\n' +
                '             * being use in bro component.\n' +
                '             */\n' +
                '            setComponentRatio() {\n' +
                '                let vm = this;\n' +
                '                vm.$emit(\'set-ratio\', vm.ratio);\n' +
                '            },\n' +
                '\n' +
                '            /**\n' +
                '             * setting the height of the recommend\'s body\n' +
                '             * @param id\n' +
                '             */\n' +
                '            setComponentBodyHeight(id) {\n' +
                '                id = id ? id : \'target-list\';\n' +
                '                let vm = this, body = document.getElementById(id);\n' +
                '                body.style.height = \'\';\n' +
                '                let height = body.scrollHeight;\n' +
                '                body.style.height = height + \'px\';\n' +
                '                vm.$set(vm.drag.height, id, height);\n' +
                '            },\n' +
                '\n' +
                '            /**\n' +
                '             * setting the width of the recommend\'s body\n' +
                '             * @param id {*} `dom` id.\n' +
                '             */\n' +
                '            setComponentBodyWidth(id) {\n' +
                '                let vm = this, body = document.getElementById(id);\n' +
                '                if(body){\n' +
                '                    let width = body.scrollWidth,\n' +
                '                        temp = vm.drag.width.width;\n' +
                '                    if(typeof temp !== \'undefined\'){\n' +
                '                        if(temp !== width){\n' +
                '                            vm.$set(vm.drag.width, \'width\', width);\n' +
                '                            let nums = vm.drag.width.nums, i;\n' +
                '                            for(i in nums){\n' +
                '                                if(nums.hasOwnProperty(i)){\n' +
                '                                    let list = document.getElementById(i);\n' +
                '                                    list.style.width = width * nums[i] + \'px\';\n' +
                '                                    vm.$set(vm.drag.width.nums, id, 1);\n' +
                '                                }\n' +
                '                            }\n' +
                '                        }\n' +
                '                    }else{\n' +
                '                        vm.$set(vm.drag.width, \'width\', width);\n' +
                '                        vm.$set(vm.drag.width, \'nums\', []);\n' +
                '                        vm.$set(vm.drag.width.nums, id, 1);\n' +
                '                    }\n' +
                '                }\n' +
                '            },\n' +
                '\n' +
                '            /**\n' +
                '             * update list\'s height.\n' +
                '             * when you choose item in the source list (mouse enter - the start),\n' +
                '             * and dragging the item to target list until the mouse leave (the end), updated it\n' +
                '             * @param type {*} `onStrat` or `onEnd` action.\n' +
                '             * @param event {*} event handle\n' +
                '             */\n' +
                '            updateComponentBodyWidth(type, event) {\n' +
                '                let vm = this, curContainer,\n' +
                '                    container = document.getElementsByClassName(vm.drag.container),\n' +
                '                    list, number, num, id, itemWidth, totalWidth, current;\n' +
                '                if(container.length > 0){\n' +
                '                    let values = JSON.parse(JSON.stringify(vm.drag.tabs.value)).split(\'-\'),\n' +
                '                        value = parseInt(values[values.length - 1]);\n' +
                '                    if(isNaN(value)) current = container[0];\n' +
                '                    else current = container[value];\n' +
                '                    curContainer = document.getElementById(current.getAttribute(\'id\'));\n' +
                '                    list = current.getElementsByClassName(vm.drag.list)[0];\n' +
                '                    id = list.getAttribute(\'id\');\n' +
                '                    number = list.getElementsByClassName(vm.drag.item).length;\n' +
                '                    itemWidth = vm.getComponentNodeWidth(list, vm.drag.item);\n' +
                '                    totalWidth = itemWidth * number + vm.margin * (number - 1);\n' +
                '                    totalWidth = totalWidth > 0 ? totalWidth : 0;\n' +
                '                    let contentWidth = vm.getComponentNodeWidth(curContainer, vm.drag.content);\n' +
                '                    num = Math.ceil(totalWidth / contentWidth);\n' +
                '                    if(num !== vm.drag.width.nums[id]){\n' +
                '                        vm.$set(vm.drag.width.nums, id, num);\n' +
                '                    }\n' +
                '                    if(type === \'start\'){\n' +
                '                        let curWidth = event.item.clientWidth;\n' +
                '                        if(totalWidth + curWidth > vm.drag.width.width){\n' +
                '                            num = parseInt(vm.drag.width.nums[id]) + 1;\n' +
                '                            vm.$set(vm.drag.width.nums, id, num);\n' +
                '                        }\n' +
                '                    }\n' +
                '                    if(num > 0) list.style.width = vm.drag.width.width * num + \'px\';\n' +
                '                    else list.style.width = vm.drag.width.width + \'px\';\n' +
                '                }\n' +
                '            },\n' +
                '\n' +
                '            /**\n' +
                '             * set the recommend row\'s label\n' +
                '             */\n' +
                '            setComponentTabLabel(row) {\n' +
                '                let vm = this, num = row + 1,\n' +
                '                    label = \'第 \' + num + \' 行推荐\';\n' +
                '                return (h) => {\n' +
                '                    return h(\'div\', [\n' +
                '                        h(\'span\', label),\n' +
                '                        h(\'icon\', {\n' +
                '                            props: {type: vm.drag.tabs.icon},\n' +
                '                            attrs: {\n' +
                '                                \'data-row\': row,\n' +
                '                                title: \'删除\'\n' +
                '                            },\n' +
                '                            on: {\n' +
                '                                click: (event) => {\n' +
                '                                    let parent = event.currentTarget.parentNode.parentNode,\n' +
                '                                        brother = parent.previousSibling, id = -1,\n' +
                '                                        number = event.currentTarget.getAttribute(\'data-row\'),\n' +
                '                                        elements = JSON.parse(JSON.stringify(vm.drag.elements));\n' +
                '                                    brother.click();\n' +
                '                                    for(let i in elements){\n' +
                '                                        if(elements.hasOwnProperty(i)){\n' +
                '                                            let temp = parseInt(elements[i].id);\n' +
                '                                            if(temp === parseInt(number)){\n' +
                '                                                id = temp;\n' +
                '                                                delete elements[i];\n' +
                '                                                break;\n' +
                '                                            }\n' +
                '                                        }\n' +
                '                                    }\n' +
                '                                    if(Object.keys(elements).length > 0){\n' +
                '                                        for(let n in elements){\n' +
                '                                            if(elements.hasOwnProperty(n)){\n' +
                '                                                let temp = parseInt(elements[n].id);\n' +
                '                                                if(temp > id){\n' +
                '                                                    elements[n].id = temp - 1;\n' +
                '                                                }\n' +
                '                                            }\n' +
                '                                        }\n' +
                '                                    }\n' +
                '                                    vm.$set(vm.drag, \'elements\', elements);\n' +
                '                                    vm.$set(vm.drag.tabs, \'id\', vm.drag.tabs.id - 1);\n' +
                '                                }\n' +
                '                            }\n' +
                '                        })\n' +
                '                    ]);\n' +
                '                }\n' +
                '            },\n' +
                '\n' +
                '            /**\n' +
                '             * window resize.\n' +
                '             * updated the list height and width.\n' +
                '             */\n' +
                '            handleWindowResize() {\n' +
                '                let vm = this, current, list,\n' +
                '                    container = document.getElementsByClassName(vm.drag.container),\n' +
                '                    values = JSON.parse(JSON.stringify(vm.drag.tabs.value)).split(\'-\'),\n' +
                '                    value = parseInt(values[values.length - 1]),\n' +
                '                    oldWidth, newWidth, num, number, curNum, listId;\n' +
                '                if(isNaN(value)) current = container[0];\n' +
                '                else current = container[value];\n' +
                '                vm.setComponentBodyHeight(current.getAttribute(\'id\'));\n' +
                '                list = current.getElementsByClassName(vm.drag.list)[0];\n' +
                '                oldWidth = list.clientWidth;\n' +
                '                list.removeAttribute(\'style\');\n' +
                '                listId = list.getAttribute(\'id\');\n' +
                '                newWidth = list.clientWidth;\n' +
                '                number = vm.drag.width.nums[listId];\n' +
                '                num = vm.getComponentPagesNumber(current, list.children.length);\n' +
                '                if(newWidth !== vm.drag.width.width){\n' +
                '                    vm.$set(vm.drag.width, \'width\', newWidth);\n' +
                '                    vm.$set(vm.drag.width.nums, listId, num);\n' +
                '                    let targetNum = vm.drag.nums[listId];\n' +
                '                    if(targetNum > 0){\n' +
                '                        if(num < number) curNum = 0;\n' +
                '                        else curNum = (oldWidth / targetNum) - 1;\n' +
                '                        let left = newWidth * curNum;\n' +
                '                        vm.$set(vm.drag.nums, listId, left);\n' +
                '                    }\n' +
                '                }\n' +
                '                list.style.width = vm.drag.width.width * vm.drag.width.nums[listId] + \'px\';\n' +
                '                if(vm.drag.nums[listId] > 0){\n' +
                '                    list.style.marginLeft = \'-\' + vm.drag.nums[listId] + \'px\';\n' +
                '                }\n' +
                '                vm.handleComponentTargetSwitch(current, num, listId);\n' +
                '            },\n' +
                '\n' +
                '            /**\n' +
                '             * switch on the previous page\n' +
                '             * @param event\n' +
                '             */\n' +
                '            handleComponentPrev(event) {\n' +
                '                let vm = this,\n' +
                '                    parentNode = event.currentTarget.parentNode,\n' +
                '                    listNode = parentNode.getElementsByClassName(vm.drag.list)[0],\n' +
                '                    num = vm.drag.num,\n' +
                '                    name = parentNode.getAttribute(\'data-name\'),\n' +
                '                    isTarget = name.indexOf(\'target\') > -1;\n' +
                '                if(isTarget){\n' +
                '                    num = vm.drag.nums[name];\n' +
                '                    if(num > 0){\n' +
                '                        num -= vm.drag.width.width;\n' +
                '                        vm.$set(vm.drag.nums, name, num);\n' +
                '                    }\n' +
                '                    listNode.style.marginLeft = \'-\' + num + \'px\';\n' +
                '                    let number = vm.getComponentPagesNumber(parentNode, listNode.children.length);\n' +
                '                    vm.handleComponentTargetSwitch(parentNode, number, name);\n' +
                '                }else{\n' +
                '                    if(num > 0){\n' +
                '                        num -= 100;\n' +
                '                        vm.$set(vm.drag, \'num\', num);\n' +
                '                    }\n' +
                '                    listNode.style.transform = \'translateX(-\' + num + \'%) translateZ(0px)\';\n' +
                '                    vm.handleComponentSourceSwitch(parentNode, \'prev\');\n' +
                '                }\n' +
                '            },\n' +
                '\n' +
                '            /**\n' +
                '             * switch on the next page\n' +
                '             * @param event\n' +
                '             */\n' +
                '            handleComponentNext(event) {\n' +
                '                let vm = this,\n' +
                '                    parentNode = event.currentTarget.parentNode,\n' +
                '                    listNode = parentNode.getElementsByClassName(vm.drag.list)[0],\n' +
                '                    name = parentNode.getAttribute(\'data-name\'),\n' +
                '                    isTarget = name.indexOf(\'target\') > -1;\n' +
                '                if(isTarget){\n' +
                '                    let num = listNode.children.length,\n' +
                '                        number = vm.getComponentPagesNumber(parentNode, num),\n' +
                '                        targetNum = vm.drag.nums[name] ? vm.drag.nums[name] : 0;\n' +
                '                    if(targetNum < (number - 1) * vm.drag.width.width){\n' +
                '                        targetNum += vm.drag.width.width;\n' +
                '                        vm.$set(vm.drag.nums, name, targetNum);\n' +
                '                    }\n' +
                '                    listNode.style.marginLeft = \'-\' + targetNum + \'px\';\n' +
                '                    vm.handleComponentTargetSwitch(parentNode, number, name);\n' +
                '                }else{\n' +
                '                    let num = vm.drag.num,\n' +
                '                        number = vm.getComponentPagesNumber(parentNode);\n' +
                '                    if(num < (number - 1) * 100){\n' +
                '                        num += 100;\n' +
                '                        vm.$set(vm.drag, \'num\', num);\n' +
                '                    }\n' +
                '                    listNode.style.transform = \'translateX(-\' + num + \'%) translateZ(0px)\';\n' +
                '                    vm.handleComponentSourceSwitch(parentNode, \'next\', number);\n' +
                '                }\n' +
                '            },\n' +
                '\n' +
                '            /**\n' +
                '             * `source-list` switcher state\n' +
                '             * @param node\n' +
                '             * @param action\n' +
                '             * @param number\n' +
                '             */\n' +
                '            handleComponentSourceSwitch(node, action, number) {\n' +
                '                let vm = this,\n' +
                '                    disabled = vm.drag.disabled,\n' +
                '                    next = node.getElementsByClassName(vm.drag.next)[0],\n' +
                '                    prev = node.getElementsByClassName(vm.drag.prev)[0];\n' +
                '                if(action === \'prev\'){\n' +
                '                    vm.removeClass(next, disabled);\n' +
                '                    if(vm.drag.num === 0){\n' +
                '                        vm.addClass(prev, disabled);\n' +
                '                    }\n' +
                '                }else if(action === \'next\'){\n' +
                '                    if(vm.drag.num > 0){\n' +
                '                        vm.removeClass(prev, disabled);\n' +
                '                    }else{\n' +
                '                        vm.addClass(prev, disabled);\n' +
                '                    }\n' +
                '                    if(this.drag.num === (number - 1) * 100){\n' +
                '                        vm.addClass(next, disabled);\n' +
                '                    }\n' +
                '                }\n' +
                '            },\n' +
                '\n' +
                '            /**\n' +
                '             * `target-list` switcher state\n' +
                '             * @param node parent\'s node\n' +
                '             * @param number page\'s number\n' +
                '             * @param dest target\'s name\n' +
                '             */\n' +
                '            handleComponentTargetSwitch(node, number, dest) {\n' +
                '                let vm = this, disabled = vm.drag.disabled,\n' +
                '                    num = vm.drag.nums[dest] ? vm.drag.nums[dest] : 0,\n' +
                '                    next = node.getElementsByClassName(this.drag.next)[0],\n' +
                '                    prev = node.getElementsByClassName(this.drag.prev)[0];\n' +
                '                if(num > 0){\n' +
                '                    vm.removeClass(prev, disabled);\n' +
                '                    if(num === (number - 1) * vm.drag.width.width){\n' +
                '                        vm.addClass(next, disabled);\n' +
                '                    }else{\n' +
                '                        vm.removeClass(next, disabled);\n' +
                '                    }\n' +
                '                }else{\n' +
                '                    vm.addClass(prev, disabled);\n' +
                '                    if(number > 1){\n' +
                '                        vm.removeClass(next, disabled);\n' +
                '                    }else{\n' +
                '                        vm.addClass(next, disabled);\n' +
                '                    }\n' +
                '                }\n' +
                '            },\n' +
                '\n' +
                '            /**\n' +
                '             * init component container(draggable)\n' +
                '             * mainly use to delete for all target-list\n' +
                '             */\n' +
                '            initComponentBodyDraggable() {\n' +
                '                let vm = this,\n' +
                '                    container = document.getElementsByClassName(vm.drag.layout)[0];\n' +
                '                Sortable.create(container, {\n' +
                '                    group: {\n' +
                '                        name: \'container\',\n' +
                '                        pull: true,\n' +
                '                        put: [\'target\']\n' +
                '                    },\n' +
                '                    animation: 120,\n' +
                '                    ghostClass: \'fl-dragging\',\n' +
                '                    onAdd(event) {\n' +
                '                        let children = event.target.children;\n' +
                '                        if(children.length > 1){\n' +
                '                            for(let i = 0; i < children.length; i++){\n' +
                '                                if(children.hasOwnProperty(i)){\n' +
                '                                    let cur = children[i];\n' +
                '                                    if(vm.hasClass(cur, vm.drag.item)){\n' +
                '                                        cur.remove();\n' +
                '                                    }\n' +
                '                                }\n' +
                '                            }\n' +
                '                        }\n' +
                '                    }\n' +
                '                });\n' +
                '            },\n' +
                '\n' +
                '            /**\n' +
                '             * Initilize the original drag list\n' +
                '             * Contains `source-list`\n' +
                '             */\n' +
                '            initComponentSourceDraggable() {\n' +
                '                document.body.ondrop = function (event) {\n' +
                '                    event.preventDefault();\n' +
                '                    event.stopPropagation();\n' +
                '                };\n' +
                '                let vm = this, source = document.getElementById(\'source\');\n' +
                '                Sortable.create(source, {\n' +
                '                    group: {\n' +
                '                        name: \'source\',\n' +
                '                        pull: \'clone\',\n' +
                '                        put: [\'none\']\n' +
                '                    },\n' +
                '                    animation: 120,\n' +
                '                    ghostClass: \'fl-dragging\',\n' +
                '                    sort: false,\n' +
                '                    onStart(event) {\n' +
                '                        vm.updateComponentBodyWidth(\'start\', event);\n' +
                '                    },\n' +
                '                    onEnd() {\n' +
                '                        vm.updateComponentBodyWidth();\n' +
                '                    }\n' +
                '                });\n' +
                '            },\n' +
                '\n' +
                '            /**\n' +
                '             * Initilize the target drag list\n' +
                '             * Control of the switcher when the list is adding or removing.\n' +
                '             * @param id dom\'s id\n' +
                '             */\n' +
                '            initComponentTargetDraggable(id) {\n' +
                '                id = id ? \'target-\' + id : \'target\';\n' +
                '                let vm = this, target = document.getElementById(id),\n' +
                '                    add = function(event){\n' +
                '                        let parentNode = target.parentNode.parentNode,\n' +
                '                            num = target.children.length,\n' +
                '                            number = vm.getComponentPagesNumber(parentNode, num);\n' +
                '                        vm.handleComponentTargetSwitch(parentNode, number, id);\n' +
                '                        vm.updateComponentBodyWidth();\n' +
                '                        let node = vm.getParentsNodeByClassName(event, vm.drag.container),\n' +
                '                            tid = node.getAttribute(\'id\');\n' +
                '                        vm.setComponentBodyHeight(tid);\n' +
                '                    },\n' +
                '                    update = function(event){\n' +
                '                        let parentNode = target.parentNode.parentNode,\n' +
                '                            num = target.children.length,\n' +
                '                            number = vm.getComponentPagesNumber(parentNode, num),\n' +
                '                            oldWidth = vm.drag.nums[id] ? vm.drag.nums[id] : 0,\n' +
                '                            newWidth = (number - 1) * vm.drag.width.width,\n' +
                '                            first = oldWidth === 0 && newWidth === 0;\n' +
                '                        if(first || oldWidth > newWidth){\n' +
                '                            target.style.marginLeft = \'-\' + newWidth + \'px\';\n' +
                '                            let width = newWidth <= 0 ? vm.drag.width.width : newWidth;\n' +
                '                            target.style.width = width + \'px\';\n' +
                '                            vm.$set(vm.drag.nums, id, newWidth);\n' +
                '                        }\n' +
                '                        vm.handleComponentTargetSwitch(parentNode, number, id);\n' +
                '                        vm.updateComponentBodyWidth();\n' +
                '                        let node = vm.getParentsNodeByClassName(event, vm.drag.container),\n' +
                '                            tid = node.getAttribute(\'id\');\n' +
                '                        vm.setComponentBodyHeight(tid);\n' +
                '                    };\n' +
                '                vm.setComponentBodyWidth(id);\n' +
                '                vm.drag.target[id] = Sortable.create(target, {\n' +
                '                    group: {\n' +
                '                        name: \'target\',\n' +
                '                        pull: true,\n' +
                '                        put: [\'source\']\n' +
                '                    },\n' +
                '                    animation: 120,\n' +
                '                    ghostClass: \'fl-dragging\',\n' +
                '                    onAdd(event) {\n' +
                '                        add(event);\n' +
                '                        event.item.style = \'margin-right: \' + vm.margin + \'px\';\n' +
                '                    },\n' +
                '                    onRemove(event) {\n' +
                '                        update(event);\n' +
                '                    }\n' +
                '                });\n' +
                '            },\n' +
                '\n' +
                '            /**\n' +
                '             * create recommend\'s row\n' +
                '             * via update the `elements` variable ( insert in the queue head )\n' +
                '             */\n' +
                '            createComponentRow() {\n' +
                '                let vm = this;\n' +
                '                vm.$set(vm.drag.elements, vm.drag.row, {id: vm.drag.tabs.id, component: \'recommend-row\', props: {row: vm.drag.row}});\n' +
                '                let row = vm.drag.row + 1,\n' +
                '                    num = vm.drag.tabs.id + 1;\n' +
                '                vm.drag.tabs.row.push(row);\n' +
                '                vm.$set(vm.drag.tabs, \'value\', \'tab-\' + vm.drag.tabs.id);\n' +
                '                vm.$set(vm.drag, \'row\', row);\n' +
                '                vm.$set(vm.drag.tabs, \'id\', num);\n' +
                '            },\n' +
                '\n' +
                '            /**\n' +
                '             * Communication between components.\n' +
                '             * via the common Vue object called `bus`\n' +
                '             */\n' +
                '            handleBroadcast() {\n' +
                '                let vm = this;\n' +
                '                bus.$on(\'prev-action\', function(event){\n' +
                '                    vm.handleComponentPrev(event);\n' +
                '                });\n' +
                '                bus.$on(\'next-action\', function(event){\n' +
                '                    vm.handleComponentNext(event);\n' +
                '                });\n' +
                '                bus.$on(\'init-target-draggable\', function(){\n' +
                '                    vm.$nextTick(() => {\n' +
                '                        let row = vm.drag.row - 1;\n' +
                '                        vm.initComponentTargetDraggable(row);\n' +
                '                        vm.initComponentBodyDraggable();\n' +
                '                    });\n' +
                '                });\n' +
                '            }\n' +
                '        },\n' +
                '        mounted () {\n' +
                '            let vm = this;\n' +
                '            vm.getComponentData();\n' +
                '            vm.initComponentBodyDraggable();\n' +
                '            vm.initComponentSourceDraggable();\n' +
                '            vm.initComponentTargetDraggable();\n' +
                '            vm.setComponentBodyHeight();\n' +
                '            vm.handleBroadcast();\n' +
                '            window.onresize = function(){\n' +
                '                vm.handleWindowResize();\n' +
                '            };\n' +
                '        }\n' +
                '    };\n' +
                '    export default DragComponent;\n' +
                '<\/script>'
            }
        },
        methods: {
            getBaseData() {
                let vm = this;
                vm.$api.get(vm.G.api.recommend.base, {}, function(res){
                    if(res['ret']['retCode'].toString() === '0'){
                        let left = res.data['leftMargin'] * vm.ratio,
                            space = res.data['recModuleInterval'] * vm.ratio,
                            list = document.getElementById('target'),
                            style = 'margin: 0;padding: 0 ' + left + 'px;';
                        vm.$set(vm.base, 'left', left);
                        vm.$set(vm.base, 'margin', space);
                        list.parentNode.setAttribute('style', style);
                    }
                }, function(err){

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
                let vm = this;
                vm.$api.post(vm.G.api.recommend.group.list, vm.search, function(res){

                }, function(err){

                });
                let width = 570, height = 368, space = 34,
                    num = [1, 2, 3], ratio = vm.ratio, list = [];
                vm.setComponentRatio();
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
             * get component `height` type.
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
             * set ratio.
             * being use in bro component.
             */
            setComponentRatio() {
                let vm = this;
                vm.$emit('set-ratio', vm.ratio);
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
                    value = parseInt(values[values.length - 1]),
                    oldWidth, newWidth, num, number, curNum, listId;
                if(isNaN(value)) current = container[0];
                else current = container[value];
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
                }
                list.style.width = vm.drag.width.width * vm.drag.width.nums[listId] + 'px';
                if(vm.drag.nums[listId] > 0){
                    list.style.marginLeft = '-' + vm.drag.nums[listId] + 'px';
                }
                vm.handleComponentTargetSwitch(current, num, listId);
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

            handleComponentSearch() {
                let vm = this;
                console.log(vm.search.idOrName);
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
                if(vm.base.left) target.style.paddingLeft = vm.base.left + 'px';
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
            vm.getBaseData();
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
