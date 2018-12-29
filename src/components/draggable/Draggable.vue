<template>
	<Row class="wi-draggable" :class="setDraggableClass" ref="draggable">
		<Card :id="classes.drag.source" v-if="setting.assembled">
			<!-- search -->
			<div class="wi-search">
				<!-- search & layout -->
				<Row class="wi-search-left">
					<Select v-model="search.height" :style="{width: '100px'}" @on-change="handleComponentSearch" class="wi-select" filterable>
						<Option v-for="(item, index) in height" :label="item" :value="item" :key="index"></Option>
					</Select>
					<Button type="primary" size="large" class="ml15" @click="getCommonLayout" v-if="setting.template.referenced">常用布局</Button>
				</Row>
				<!-- create button -->
				<Row class="wi-search-right">
					<Button type="primary" size="large" ref="create" @click="createDraggable">
                        <icon type="plus-round" class="mr5"></icon>添加推荐行
                    </Button>
				</Row>
				<!-- modal -->
				<Modal v-model="template.modal" :title="template.title" :transfer="true" :width="1132" :scrollable="true" :class-name="classes.modal.container + ' wi-modal-custom'" v-if="setting.template.referenced">
					<!-- search & list -->
					<Row class="wi-common-layout-search" ref="search">
						<Row class="wi-search">
							<Row class="wi-search-left">
								<Input icon="ios-search" size="large" placeholder="搜索常用布局ID或常用布局标题" @keyup.native="searchCommonLayout" v-model="template.condition.queryParam" :style="{width: '350px'}" />
							</Row>
						</Row>
						<Row class="wi-search-list">
							<Row class="wi-common-layout-prev">
								<icon type="ios-arrow-back" :class="classes.disabled" data-direct="left" v-on:click="switchCommonLayoutSearch" ref="left"></icon>
							</Row>
							<Row class="wi-search-content">
								<ul class="wi-search-items clearfix" ref="template">
									<li v-for="(li, k) in template.data" :key="k" v-html="li['layoutTitle']" @click="selectCommonLayout" :data-id="li['layoutId']" :title="li['layoutTitle']" :class="template.active === li['layoutId'] ? classes.template.active : ''"></li>
								</ul>
							</Row>
							<Row class="wi-common-layout-next">
								<icon type="ios-arrow-forward" :class="classes.disabled" data-direct="right" v-on:click="switchCommonLayoutSearch" ref="right"></icon>
							</Row>
						</Row>
					</Row>
					<!-- name -->
					<Row class="wi-common-layout-name" v-html="template.name"></Row>
					<!-- content -->
					<Row class="wi-common-layout-container">
						<Row class="wi-common-layout-prev">
							<icon type="ios-arrow-back" :class="classes.disabled" data-direct="left" v-on:click="switchCommonLayoutPreview" ref="prev"></icon>
						</Row>
						<Row class="wi-common-layout-content" ref="preview" :style="{padding: '0 ' + Math.round(setting.base.left * setting.base.ratio) + 'px', 'max-height': template.height + 'px'}">
							<Row class="wi-common-layout-row" ref="row">
								<Row v-for="(list, index) in template.list" :style="{'margin-top' : index > 0 ? Math.round(setting.base.row * setting.base.ratio) + 'px' : 0}" :key="index" class="wi-common-layout-list">
									<Row v-for="(item, key) in list[mapping.row.blocks]" :style="{'margin-left': key > 0 ? Math.round(setting.base.block * setting.base.ratio) + 'px' : 0}" :key="key" class="wi-common-layout-item">
										<Row class="wi-common-layout-block" v-for="(block, i) in item.blocks" :key="i" :style="{width: Math.round(block.width * setting.base.ratio) + 'px', height: Math.round(block.height * setting.base.ratio) + 'px', 'margin-top': (i > 0 ? setting.base.space * setting.base.ratio + 'px' : 0)}" v-html="block.width + ' * ' + block.height"></Row>
									</Row>
								</Row>
							</Row>
						</Row>
						<Row class="wi-common-layout-next">
							<icon type="ios-arrow-forward" :class="classes.disabled" data-direct="right" v-on:click="switchCommonLayoutPreview" ref="next"></icon>
						</Row>
					</Row>
					<!-- button -->
					<Row class="wi-common-layout-btn">
						<Button type="primary" size="large" @click="setCommonLayout">确定</Button>
					</Row>
					<Row slot="footer"></Row>
				</Modal>
			</div>
			<!-- source -->
			<Row :class="classes.drag.box" data-name="source">
				<Row :class="classes.drag.prev + ' ' + classes.disabled" @click.native="handleComponentPrev">
					<icon type="ios-arrow-back"></icon>
				</Row>
				<Row :class="classes.drag.content">
					<Row :class="classes.drag.list" id="source" ref="source">
						<Row :class="classes.drag.item" v-for="(item, index) in items" :key="prefix.common + item.id + '-' + $unique()" :data-index="item.id" :data-num="item.number" :data-width="item.width" :data-height="item.height" :style="{'margin-right': index === items.length - 1 ? '0' : (setting.base.block * setting.ratio) + 'px'}">
							<Row v-for="(block, key) in item.data" :style="{width: block.width + 'px', height: block.height + 'px', 'margin-bottom': block.space + 'px'}" :key="item.id + '-' + key" :class="classes.drag.single" :data-width="block.source.width" :data-height="block.source.height">
								{{ block.source.width }} * {{ block.source.height }}
							</Row>
						</Row>
					</Row>
				</Row>
				<Row :class="classes.drag.next + ' ' + classes.disabled" @click.native="handleComponentNext">
					<icon type="ios-arrow-forward"></icon>
				</Row>
			</Row>
		</Card>
		<!-- target -->
		<Row class="wi-tabs wi-draggable-tabs" :class="setting.assembled ? 'mt20' : ''">
			<Tabs name="recommend" :value="drag.tabs.value" v-model="drag.tabs.value" @on-click="switchComponentTab">
				<TabPane label="第 1 行推荐" :name="name">
					<Row :class="classes.drag.container" :id="prefix.row + '1'">
						<Row :class="classes.drag.box + ' wi-draggable-target'" :data-name="name">
							<Row :class="classes.drag.prev" @click.native="handleComponentPrev">
								<icon type="ios-arrow-back"></icon>
							</Row>
							<Row :class="classes.drag.content">
								<!-- list -->
								<Row :class="classes.drag.list" :id="name"></Row>
								<!-- cross line -->
								<Row :class="classes.drag.line" :style="{left: ((setting.base.screen - setting.base.left) * setting.base.ratio) + 'px'}" v-if="drag.pages.target[name] <= 1"></Row>
								<!-- align line -->
								<Row :class="classes.drag.align" ref="align" :style="{left: ((setting.base.screen - (setting.base.left * 2)) * setting.base.ratio) + 'px'}" v-if="drag.pages.target[name] <= 1"></Row>
								<!-- shadow -->
								<Row :class="classes.shadow.single" @click.native="removeDraggableBlockShadow"></Row>
							</Row>
							<Row :class="classes.drag.next" @click.native="handleComponentNext">
								<icon type="ios-arrow-forward"></icon>
							</Row>
							<Row class="wi-draggable-tip" v-if="setting.assembled && drag.tips[name]">选择组件，拖放至此处</Row>
						</Row>
					</Row>
				</TabPane>
				<TabPane v-for="(element, index) in drag.elements" :label="createDraggableLabel(element)" :name="prefix.target + element.key" :key="index">
					<Row :is="element.component" v-bind="element.props"></Row>
				</TabPane>
			</Tabs>
		</Row>
	</Row>
</template>
<script>
	/**
	 * 使用方法(instructions):
	 *
	 * 1. `import` 引入该组件; eg. `import draggable from '@/components/draggable/Draggable'`;
	 *
	 * 2. 页面初始化(initialization):
	 *  ```
	 *  <draggable
	 *      :rows="rows"
	 *      :exec="exec"
	 *      :init="true"
	 *      :click="true"
	 *      v-on:click-call="handleClick"
	 *      v-on:layout-data="getLayoutData"
	 *      :config="{...}" ...>
	 *  </draggable>
	 *  ```
	 *
	 * 3. 参数说明(parameters):
	 * [ init [Boolean]]: 是否执行初始化操作(whether is initialization).
	 * [ rows [Array]]: 初始化数据, 具体格式请查看接口响应数据(initialization datas).
	 * [ exec [Any]]: 数据变更，重新渲染的执行标识(reinitialized if the value of `exec` is changed, recommended use `this.$unique()`).
	 * [ active [Number]]: 当前选中的推荐行, 从`1`开始(tab of currently selected, start from 1).
	 * [ click [Boolean]]: 是否可点击(whether can click).
	 * [ click-call [Callback]]: 点击组件块的事件回调 - 选中(callback after click component's block - selection).
	 * [ click-cancel [Callback]]: 再次点击组件块, 将取消选中(when component's block is clicked again, the event take place).
	 * [ finish [Callback]]: 初始化完成后的回调(callback after initialization).
	 * [ reacquire [Any]]: 执行再次获取组件数据的状态标识(change this value to trigger reacquisition of data).
	 * [ layout-data [Callback]]: 获取组件数据的回调(get componet's data if `reacquire` is changed).
	 * [ template-data [Callback]]: 获取`常用模板`数据的回调
	 * [ config [Object]]: 其它配置选项, 具体见如下说明(other configuration, see the specific instructions below).
	 *      ``` --------------------------------------------------------------------------------
	 *      3.1. `config` 参数说明(parameters of called config):
	 *      [ api [Object]]: 请求接口配置, 如下(api, has default values, customizable configuration):
	 *          ``` ------------------------------------------------------------
	 *          3.1.1. `api` 参数说明(parameters of called `api`):
	 *          [ base [String]]: 获取基础数据的接口(get basic data).
	 *          [ list [String]]: 获取指定`height`的组件列表的接口(get component list of the specified height).
	 *          [ height [String]]: 获取所有组件的不同高度值的接口(get difference height list in all components).
	 *          [ template [String]]: 获取指定`id`的常用模板数据的接口(get common template data of the specified id).
	 *          [ layout [String]]: 获取常用模板列表数据的接口(get all common template datas).
	 *          ``` ------------------------------------------------------------
	 *      [ base [Object]]: 基础数据, 如`左边距`, `块间距`等(basic data, such as `left margin`, `block margin` and so on).
	 *          ``` ------------------------------------------------------------
	 *          3.1.2. `base` 参数说明(parameters of called `base`):
	 *          [ left [Number]]: 左边距(left margin).
	 *          [ top: [Number]]: 上边距(top margin).
	 *          [ group [Number]]: 推荐组间距(recommend group margin).
	 *          [ row [Number]]: 推荐行间距(recommend row margin).
	 *          [ block [Number]]: 组件块间距(component block margin).
	 *          [ space [Number]]: 推荐位间距(recommend position margin).
	 *          [ ratio [Number]]: 缩放比例(scaling ratio).
	 *          [ screen [Number]]: 屏幕尺寸(screen size).
	 *          ``` ------------------------------------------------------------
	 *      [ assembled [Boolean]]: 是否是组装的状态, 默认为`true`
	 *      [ template [Object]]: 常用布局模板配置(the configuaration of common templates):
	 *          ``` ------------------------------------------------------------
	 *          3.1.3. `template` 参数说明(parameters of called `template`):
	 *          [ referenced [Boolean]]: 是否引用常用模板(Whether to reference common templates)
	 *          ``` ------------------------------------------------------------
	 *      [ carousel [Object]]: 轮播配置
	 *          ``` ------------------------------------------------------------
	 *          3.1.4. `carousel` 参数说明(parameters of called `carousel`):
	 *          [ auto [Boolean]]: 是否自动轮播(whether to automatically)
	 *          [ speed [Number]]: 轮播切换的速度, 单位：毫秒(Carousel switching speed, unit: ms)
	 *          [ radiuDot [Boolean]]: 切换按钮是否为圆形(whether the toggle button is round)
	 *          ``` ------------------------------------------------------------
	 *      []
	 *
	 *      eg.
	 *      {
	 *          api: {
	 *              base: 'https://api.google.com/v1/basics',
	 *              list: 'https://api.google.com/v1/lists',
	 *              height: 'https://api.google.com/v1/heights',
	 *              template: 'https://api.google.com/v1/templates',
	 *              layout: 'https://api.google.com/v1/layouts'
	 *          },
	 *          base: {
	 *              left: 87,
	 *              top: 206,
	 *              group: 60,
	 *              row: 40,
	 *              block: 30,
	 *              space: 20,
	 *              ratio: 0.5,
	 *              screen: 1920
	 *          },
	 *          assembled: true,
	 *          template: {
	 *              referenced: true
	 *          },
	 *          carousel: {
	 *              auto: true,
	 *              speed: 400,
	 *              radiuDot: true
	 *          }
	 *      }
	 *      ``` --------------------------------------------------------------------------------
	 */
    import Vue from 'vue';
    import Sortable from 'sortablejs';
    /** common instance */
    const bus = new Vue();
    /** common variables */
    const component = 'wi-row-component',
	    prefix = {
            common: 'wi-',
		    target: 'target-',
		    row: 'target-row-',
	    },
	    classes = {
		    layout: prefix.common + 'layout',
		    container: prefix.common + 'container',
		    drag: {
		        container: prefix.common + 'draggable-container',
		        body: prefix.common + 'draggable-body',
		        box: prefix.common + 'draggable-box',
		        prev: prefix.common + 'draggable-prev',
		        next: prefix.common + 'draggable-next',
		        content: prefix.common + 'draggable-content',
		        list: prefix.common + 'draggable-list',
		        source: prefix.common + 'draggable-source',
		        target: prefix.common + 'draggable-target',
		        item: prefix.common + 'draggable-item',
		        single: prefix.common + 'draggable-item-one',
		        active: prefix.common + 'draggable-item-active',
		        image: prefix.common + 'draggable-item-image',
		        line: prefix.common + 'draggable-screen-line',
		        align: prefix.common + 'draggable-align-line',
		        through: prefix.common + 'draggable-align-line-through',
		        assembled: prefix.common + 'draggable-assembled',
		        dragging: prefix.common + 'draggable-dragging',
		        click: prefix.common + 'draggable-click'
		    },
		    shadow: {
		        single: prefix.common + 'draggable-item-shadow',
		        active: prefix.common + 'draggable-item-shadow-active'
		    },
		    tabs: {
		        container: prefix.common + 'draggable-tabs',
		        pane: 'ivu-tabs-tabpane',
		        tab: 'ivu-tabs-tab',
		        active: 'ivu-tabs-tab-active',
		        icon: 'ios-close-circle-outline'
		    },
		    block: {
		        prefix: prefix.common + 'draggable-block',
		        image: prefix.common + 'draggable-item-block-image',
		        cover: prefix.common + 'draggable-item-block-image-cover'
		    },
		    modal: {
		        container: 'wi-common-layout-preview-modal',
		        content: 'ivu-modal-content'
		    },
		    template: {
		        active: prefix.common + 'search-item-active'
		    },
		    disabled: 'disabled',
		    hidden: 'hidden'
		},
	    mapping = {
            row: {
                id: 'layoutRowId',
	            blocks: 'layoutRowModules',
	            group: 'groupRowId'
            },
	        content: {
                title: 'showTitle',
		        sub: 'showSubTitle',
		        pos: 'titlePosition'
	        },
	        space: {
                left: 'leftMargin',
		        top: 'topMargin',
		        group: 'recGroupInterval',
		        row: 'recRowInterval',
		        block: 'recModuleInterval',
		        pos: 'recPositionInterval'
	        },
	        module: {
                id: 'moduleId',
		        gid: 'groupRowModuleId',
		        pid: 'recPositionId',
		        init: 'recInitData',
                number: 'positionNum',
		        width: 'moduleWidth',
		        height: 'moduleHeight',
		        position: 'recPositions'
	        },
	        attrs: {
                id: 'data-id',
		        mid: 'data-mid',
		        key: 'data-key',
                row: 'data-row',
		        num: 'data-num',
		        pos: 'data-pos',
                index: 'data-index',
		        type: 'data-type',
		        width: 'data-width',
		        height: 'data-height',
		        name: 'data-name',
		        relate: 'data-relate',
		        direct: 'data-direct'
	        },
	        field: {
                id: 'recContentId',
                cover: {
                    one: 'image1Url',
	                two: 'image2Url'
                },
		        poster: 'posterUrl'
	        }
        },
	    base = {
            left: 87,
	        top: 206,
	        group: 60,
	        row: 40,
	        block: 30,
	        space: 20,
	        ratio: 0.5,
		    screen: 1920
	    },
	    broadcast = {
            base: 'set-base-data-action',
		    drag: 'set-drag-data-action',
		    prev: 'handle-prev-action',
		    next: 'handle-next-action',
		    align: 'update-align-line-action',
		    shadow: 'remove-shadow-action',
		    init: 'init-draggable-target-action',
		    finish: 'init-finish-action',
		    callback: {
                tab: 'switch-tab',
			    template: 'template-data',
			    layout: 'layout-data',
			    click: {
                    ok: 'click-call',
				    cancel: 'click-cancel'
			    },
			    finish: 'finish'
		    }
	    };
    /** row component */
    const RowComponent = Vue.extend({
	    props: {
	        num: {type: Number}
	    },
	    data() {
	        return {
	            prefix: prefix,
		        setting: {base: base},
	            classes: classes,
		        drag: {
	                pages: {target: {}},
			        tips: {}
		        }
	        };
	    },
	    methods: {
	        handleComponentPrev(event) {
	            bus.$emit(broadcast.prev, event);
	        },
		    handleComponentNext(event) {
	            bus.$emit(broadcast.next, event);
		    },
		    handleBroadcast() {
	            const vm = this;
	            bus.$on(broadcast.base, (data) => {
		            vm.$set(vm, 'setting', data);
		        });
		        bus.$on(broadcast.drag, (data) => {
			        vm.$set(vm, 'drag', data.drag);
			        vm.$nextTick(() => {vm.updateComponentAlignLine(data.active);});
		        });
		    },
		    updateComponentAlignLine(active) {
	            bus.$emit(broadcast.align, active);
		    },
		    removeDraggableBlockShadow(event) {
	            bus.$emit(broadcast.shadow, event);
		    }
	    },
	    created() {
	        const vm = this;
	        vm.handleBroadcast();
	    },
	    mounted() {
	        const vm = this;
	        vm.$nextTick(() => {
	            bus.$emit(broadcast.init);
	        });
	    },
	    template: `<Row :class="classes.drag.container" :id="prefix.row + num">
	<Row :class="classes.drag.box + ' ' + classes.drag.target" :data-name="prefix.target + num">
		<Row :class="classes.drag.prev" @click.native="handleComponentPrev">
			<icon type="ios-arrow-back"></icon>
		</Row>
		<Row :class="classes.drag.content">
			<Row :class="classes.drag.list" :id="prefix.target + num"></Row>
			<Row :class="classes.drag.line" :style="{left: ((setting.base.screen - setting.base.left) * setting.base.ratio) + 'px'}" v-if="drag.pages.target[prefix.target + num] <= 1"></Row>
			<Row :class="classes.drag.align" ref="align" :style="{left: ((setting.base.screen - (setting.base.left * 2)) * setting.base.ratio) + 'px'}" v-if="drag.pages.target[prefix.target + num] <= 1"></Row>
			<Row :class="classes.shadow.single" @click.native="removeDraggableBlockShadow"></Row>
		</Row>
		<Row :class="classes.drag.next" @click.native="handleComponentNext">
			<icon type="ios-arrow-forward"></icon>
		</Row>
		<Row class="wi-draggable-tip" v-if="setting.assembled && drag.tips[prefix.target + num]">选择组件，拖放至此处</Row>
	</Row>
</Row>`
    });
    /** draggable component */
    const DraggableComponent = {
        name: 'wi-draggable',
	    computed: {
            setDraggableClass() {
                const vm = this,
	                click = vm.click ? classes.drag.click : '',
	                assembled = !vm.setting.assembled ? (click ? ' ' : '') + classes.drag.assembled : '';
                return click + assembled;
            }
	    },
        props: {
        	exec: {
        		type: [String, Number, Boolean],
		        defalut: false
	        },
            config: {
                type: Object,
                default: () => {}
            },
	        rows: {
            	type: Array,
		        default: () => []
	        },
	        init: {
                type: Boolean,
                default: false
            },
            click: {
                type: Boolean,
                defalut: false
            },
	        reacquire: {
        	    type: [Boolean, String, Number, Array, Object]
	        },
	        active: {
                type: Number,
                default: 0
            }
        },
        data() {
        	const vm = this,
		        name = 'target-1';
        	return {
        		prefix: prefix,
		        name: name,
        		isInit: true,
		        setting: vm.parseComponentConfiguration(),
		        search: {
        			temp: 0,
			        height: 370,
			        condition: {queryParam: ''}
		        },
		        height: [],
		        items: [],              // source list.
		        component: [],
		        classes: classes,
		        drag: {
        			elements: {},
			        data: {},
        			pages: {
        				source: 1,
				        target: {'target-1': 1}
			        },
			        instance: {             // sortable instance object.
        				layout: {},
				        source: {},
				        target: {}
			        },
			        rows: {
        				id: prefix.common + vm.$unique(),   // row's id.
				        key: 1,                             // row's number.(actual)
        				num: 2,                             // row's number.
				        width: 0,                           // row's width.
				        height: {}                          // row's height.
			        },
			        blocks: {
        				template: [],
				        instance: [],
				        values: {}
			        },
			        tabs: {
        				id: 1,
        				value: name
			        },
			        cross: {},
			        shadow: {},
			        tips: {'target-1': true}
		        },
		        mapping: mapping,
		        template: {
        			condition: {
        				queryParam: null,
                        sortMark: 'DESC',
                        pageNum: 1,
				        pageSize: 10000
                    },
			        form: {
                        validate: {
                            title: '0',
                            subTitle: '1',
                            position: '1'
                        },
                        exist: {},
                        disabled: false,
                        rules: {},
                        data: {}
                    },
			        offset: {
        				list: 0,
				        preview: 0
			        },
			        screen: 960,
			        width: 960,
			        max: 0,             // component (common layout) max width.
			        active: 0,
			        list: [],
			        modal: false,
			        referenced: false,  // communal template being referenced.
			        height: 0,          // modal max height.
			        title: '选择推荐组常用布局模板',
			        name: '常用布局模板预览'
		        }
	        };
        },
        methods: {
	        /**
	         * component basic information.
	         * such as `row, block, group` spacing.
	         */
        	getComponentBaseData() {
        		const vm = this;
        		vm.$set(vm.setting, 'base', base);
        		vm.$api.get(vm.setting.api.base, {}, (res) => {
        			if(res['ret']['retCode'].toString() === '0'){
        				const top = res.data[mapping.space.top],
					        left = res.data[mapping.space.left],
					        group = res.data[mapping.space.row],
					        row = res.data[mapping.space.row],
					        block = res.data[mapping.space.block],
					        space = res.data[mapping.space.pos];
        				vm.$set(vm.setting, 'base', {
        					left: left,
					        top: top,
					        group: group,
					        row: row,
					        block: block,
					        space: space,
					        ratio: 0.5,
					        screen: 1920
				        });
        				if(!vm.init) vm.getComponentHeightData();
        	            vm.$nextTick(() => {
        	                vm.emitComponentBaseData();
        	                if(vm.setting.assembled) vm.initDraggableSource();
        	            });
			        }else{
        				vm.$error(res['ret']['retMsg']);
        				return false;
			        }
		        }, (err) => {
        			vm.$error(err);
        			return false;
		        });
	        },
	        
	        /**
             * component base data.
             * via common object `bus`.
	         * @see getComponentBaseData
             */
	        emitComponentBaseData() {
	            const vm = this;
	            bus.$emit(broadcast.base, vm.setting);
	        },
	        
	        /**
             * set draggable data for component.
             * `pages`, `height`, `width` etc.
	         * @param active {*} active tab (boolean) or name (string).
	         * @see handleComponentNext
             */
	        emitComponentDraggableData(active) {
	            const vm = this;
	            active = active ? ((typeof active).toUpperCase() === 'BOOLEAN' ? vm.drag.tabs.value : active) : null;
	            const values = active ? active.split('-') : vm.drag.tabs.value.split('-'),
		            id = parseInt(values[values.length - 1]);
	            if(!isNaN(id) && id === 1){
	                vm.updateComponentAlignLine(vm.name);
	            }else{
	                bus.$emit(broadcast.drag, {
		                drag: vm.drag,
			            active: active
		            });
	            }
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
        		const vm = this,
			        url = vm.parseUrl(vm.setting.api.list, {height: vm.search.height});
        		let list = [];
        		vm.$api.post(url, vm.search.condition, (res) => {
        			if(res['ret']['retCode'].toString() === '0'){
        				vm.$set(vm, 'items', list);
        				list = vm.parseComponentData(res.data, false);
        				vm.$set(vm, 'items', list);
        				const source = vm.$refs.source;
        				if(source){
        				    const parent = source.$el.parentNode,
					            parents = parent.parentNode;
        				    vm.$nextTick(() => {vm.switchComponentSource(parents);});
				        }
			        }else{
        				vm.$error(res['ret']['retMsg']);
        				return false;
			        }
		        }, (err) => {
        			vm.$error(err);
        			return false;
		        });
	        },
	
	        /**
	         * parse component data.
	         * @param datas
	         * @param id
	         * @returns {Array}
	         */
	        parseComponentData(datas, id) {
        		const vm = this,
			        ratio = vm.setting.base.ratio,
			        space = vm.setting.base.space,
			        list = [];
        		let temp = {
        			width: 0,
			        height: 0,
			        space: 0
		        };
        		datas.map((item) => {
        			const data = [],
				        num = parseInt(item[mapping.module.number]),
				        width = parseInt(item[mapping.module.width]),
				        height = parseInt(item[mapping.module.height]),
				        mid = parseInt(item[mapping.module.id]);
        			let h;
        			if(item[mapping.module.position]){
        				/* one block, many position. */
        				item[mapping.module.position].map((pos, k) => {
        					h = Math.round((pos.height * ratio) * 100) / 100;
        					let one = {
        						mid: mid,
						        width: width * ratio,
						        space: space * ratio,
						        height: h,
						        source: {
        							width: width,
							        height: pos.height
						        },
						        position: pos[mapping.module.pid],
						        relate: item[mapping.module.gid],
						        initData: pos[mapping.module.init] ? pos[mapping.module.init] : []
					        };
        					if(k === num - 1) one.space = 0;
        					data.push(one);
				        });
			        }else{
        				if(temp.width <= 0) temp.width = width * ratio;
        				if(temp.space <= 0) temp.space = space * ratio;
        				temp.height = height * ratio > temp.height ? height * ratio : temp.height;
        				if(num > 1){
        					for(let n = 0; n < num; n++){
        						const high = Math.round((height - space * (num - 1)) / num * 100) / 100;
        						h = Math.round((high * ratio) * 100) / 100;
        						let one = {
        							mid: mid,
							        width: width * ratio,
							        space: space * ratio,
							        height: h,
							        source: {
        								width: width,
								        height: high
							        },
							        position: 0,
							        relate: 0,
							        initData: []
						        };
        						if(n === num - 1) one.space = 0;
        						data.push(one);
					        }
				        }else{
        					h = Math.round(height * ratio * 100) / 100;
        					let one = {
        						mid: mid,
						        width: width * ratio,
						        height: h,
						        space: 0,
						        source: {
        							width: width,
							        height: height
						        },
						        position: 0,
						        relate: 0,
						        initData: []
					        };
        					data.push(one);
				        }
			        }
        			list.push({
				        id: item.moduleId,
				        number: num,
				        width: width,
				        height: height,
				        data: data,
				        lid: id ? id : null
			        });
		        });
        		return list;
	        },
	        
	        /**
             * get the recommend data. all of recommend rows.
             * @return {Array|Boolean}
             * @see checkComponentRowData
             */
	        wrapComponentData() {
	        	const vm = this;
	        	return vm.checkComponentData();
	        },
	        
	        /**
             * Checked the row data.
             * It's not empty and total width must longer than the base line.
             * @return {Array|Boolean}
             */
	        checkComponentData() {
	        	const vm = this, rows = [],
			        container = document.getElementsByClassName(classes.tabs.container),
			        standard = Math.round((vm.setting.base.screen - vm.setting.base.left * 2 - 2) * vm.setting.base.ratio);
	        	let tabs = null, length = 0, validate = true,
			        params = {}, template = [];
	        	if(container && container.length > 0){
	        		const body = container[0];
	        		tabs = body.getElementsByClassName(classes.tabs.pane);
	        		length = tabs.length;
	        		for(let i = 0; i < length; i++){
	        			const cur = tabs[i], data = [], commonly = [],
					        items = cur.getElementsByClassName(classes.drag.item),
					        target = cur.getElementsByClassName(classes.drag.box);
	        			let width = 0, name, setting;
	        			/** `title` setting */
                        if(target){
                            name = target[0].getAttribute(mapping.attrs.name);
                            if(name === vm.drag.tabs.value){
                                setting = JSON.parse(JSON.stringify(vm.template.form.validate));
					        }else{
                                setting = JSON.parse(JSON.stringify(vm.template.form.data[name]
	                                ? vm.template.form.data[name] : {}));
                            }
                            if(setting){
                                params = {
                                    showTitle: setting.title,
							        titlePosition: setting.position,
							        showSubTitle: setting.subTitle
						        };
					        }else{
                                params = {
                                    showTitle: JSON.parse(JSON.stringify(vm.template.form.validate.title)),
                                    titlePosition: JSON.parse(JSON.stringify(vm.template.form.validate.position)),
                                    showSubTitle: JSON.parse(JSON.stringify(vm.template.form.validate.subTitle))
						        };
					        }
                            if(!parseInt(params.showTitle)){
                                /** restoring the defaults. */
                                params.titlePosition = '1';
                                params.subTitle = '1';
					        }
				        }
	        			if(vm.setting.template.referenced){
	        				/** commonly layout. */
	        				for(let k = 0; k < items.length; k++){
	        					const item = items[k],
							        id = parseInt(item.getAttribute(mapping.attrs.index)),
							        w = parseInt(item.getAttribute(mapping.attrs.width));
	        					if(!isNaN(id) && id > 0) commonly.push(id);
	        					if(!isNaN(w) && w > 0) width += Math.round(w * vm.setting.base.ratio);
	        					if(k < items.length - 1) width += Math.round(vm.setting.base.block * vm.setting.base.ratio);
					        }
	        				template.push(commonly);
				        }else{
	        				/** recommend rows' layout. */
	        				for(let n = 0; n < items.length; n++){
	        					const item = items[n],
							        id = parseInt(item.getAttribute(mapping.attrs.index)),
							        row = parseInt(item.getAttribute(mapping.attrs.row)),
							        num = parseInt(item.getAttribute(mapping.attrs.num)),
							        w = parseInt(item.getAttribute(mapping.attrs.width)),
							        height = parseInt(item.getAttribute(mapping.attrs.height)),
							        blocks = item.getElementsByClassName(classes.drag.single),
							        temporary = [];
	        					let relate = 0;
	        					for(let m = 0; m < blocks.length; m++){
	        						const block = blocks[m],
								        variable = {
	        							    width: parseInt(block.getAttribute(mapping.attrs.width)),
									        height: parseInt(block.getAttribute(mapping.attrs.height)),
									        position: parseInt(block.getAttribute(mapping.attrs.pos)),
									        relate: parseInt(block.getAttribute(mapping.attrs.relate))
								        };
	        						if(variable.relate) relate = variable.relate;
	        						let single = {
	        							width: variable.width,
								        height: variable.height
							        };
	        						if(variable.position && !isNaN(variable.position))
	        							Object.assign(single, {recPositionId: variable.position});
	        						temporary.push(single);
						        }
	        					let modules = {
	        						moduleId: id,
							        positionNum: num,
							        width: w,
							        height: height,
							        recPositions: temporary
						        };
	        					if(relate) Object.assign(modules, {
	        						groupRowModuleId: relate
						        });
	        					data.push(modules);
	        					width += Math.round(w * vm.setting.base.ratio);
	        					if(n < items.length - 1) width += Math.round(vm.setting.base.block * vm.setting.base.ratio);
	        					/** update, needs `groupRowId` */
	        					if(
	        						row
							        && !isNaN(row)
							        && !params.groupRowId
							        && !vm.template.referenced
						        ) params.groupRowId = row;
	        					params.modules = data;
					        }
	        				rows.push(params);
				        }
	        			if(width < standard){
	        				validate = false;
	        				break;
				        }
			        }
		        }
	        	return validate ? (vm.setting.template.referenced ? template : rows) : [];
	        },
	
	        /**
	         * Getting component heights' list.
	         * all of heights.
	         */
	        getComponentHeightData() {
	        	const vm = this;
	        	if(vm.setting.assembled){
	        		vm.$api.get(vm.setting.api.height, {}, (res) => {
	        			if(res['ret']['retCode'].toString() === '0'){
	        				const height = parseInt(res.data[0]);
	        				if(vm.search.height <= 0){
	        					vm.$set(vm.search, 'height', isNaN(height) ? 0 : height);
	        					vm.$set(vm.search, 'temp', isNaN(height) ? 0 : height);
					        }
	        				vm.$set(vm, 'height', res.data);
	        				if(
	        					(!vm.click && !vm.init)
						        || (vm.setting.template.referenced && !vm.init)
						        || (vm.setting.create)
						        || (vm.init && vm.rows && vm.rows.length <= 0)
					        ){
	        					vm.getComponentData();
					        }
				        }else{
	        				vm.$error(res['ret']['retMsg']);
	        				return false;
				        }
			        }, (err) => {
	        			vm.$error(err);
	        			return false;
			        });
		        }
	        },
	        
	        /**
	         * Getting components' total width.
	         * @param data
	         * @param spacing
	         * @returns {number}
	         */
	        getComponentWidth(data, spacing) {
	        	let width = 0;
	        	data.forEach((item) => {
	        		if(item.data && item.data.length > 0){
	        			width += (item.data[0].width + spacing);
			        }
		        });
	        	width = width > 0 ? width - spacing : width;
	        	return width;
	        },
	        
	        /**
             * get component node's client width.
             * @param node currently clicked object
             * @param name class' name
             * @returns {number}
	         * @see getComponentPages
             */
	        getComponentNodeWidth(node, name) {
	        	const element = node.getElementsByClassName(name);
	        	if(element.length > 0){
	        		const elem = element[0];
	        		return elem.clientWidth;
		        }
	        	return 0;
	        },
	        
	        /**
             * Calculating the row's number based on the number of component.
             * @param node node currently clicked object
             * @returns {number}
	         * @see getComponentNodeWidth
             */
	        getComponentPages(node) {
	            if(!node) return 1;
	        	const vm = this,
			        width = vm.getComponentNodeWidth(node, classes.drag.content),
			        items = node.getElementsByClassName(classes.drag.item),
			        number = items.length;
	        	let widths = {
	        		item: 0,
			        total: 0
		        };
	        	for(let i = 0; i < number; i++){
                    if(items.hasOwnProperty(i)){
                        const cur = items[i],
					        temp = parseInt(cur.getAttribute(mapping.attrs.width));
                        if(!isNaN(temp)) widths.item += temp * vm.setting.base.ratio;
			        }
		        }
	        	widths.total = widths.item + (vm.setting.base.block * vm.setting.base.ratio) * (number - 1);
	        	return Math.ceil(widths.total / width);
	        },
	        
	        /**
	         * setting the width of recommends' body (screen).
	         * @param id {*} `dom` id
	         */
	        setComponentBodyWidth(id) {
	        	const vm = this,
			        body = document.getElementById(id);
	        	if(body){
	        		const parent = body.parentNode,
				        width = parent.clientWidth;
	        		vm.$set(vm.drag.rows, 'width', width);
		        }
	        },
	        
	        /**
             * update align line.
             * caculation formula: (screen - (base'left + base' right)) * ratio = align line.
             * if total width of blocks large than this value, alignment line be turn green.
	         * @param id {string}
             * @see initDraggableTarget
             */
	        updateComponentAlignLine(id) {
	        	const vm = this,
			        standard = Math.round((vm.setting.base.screen - vm.setting.base.left * 2 - 2) * vm.setting.base.ratio),
			        update = (elements, alignment) => {
	        	        let width = 0;
	        	        for(let n = 0; n < elements.length; n++){
                            const element = elements[n],
						        w = parseInt(element.getAttribute(mapping.attrs.width));
                            width += Math.round(w * vm.setting.base.ratio);
                            if(n < elements.length - 1) width += Math.round(vm.setting.base.block * vm.setting.base.ratio);
				        }
	                    if(width < standard){
	                        vm.removeClass(alignment, classes.drag.through);
				        }else{
	                        if(!vm.hasClass(alignment, classes.drag.through)){
	                            vm.addClass(alignment, classes.drag.through);
				            }
				        }
			        };
	        	if(id){
	        	    const current = document.getElementById(id);
	        	    if(current){
	        	        const items = current.getElementsByClassName(classes.drag.item),
			                parent = current.parentNode,
			                align = parent.getElementsByClassName(classes.drag.align);
	        	        let alignment;
	                    if(align) alignment = align[0];
	                    if(alignment) update(items, alignment);
		            }
		        }else{
	        	    const container = document.getElementsByClassName(classes.tabs.container);
		            let tabs = null, length = 0;
		            if(container && container.length > 0){
		                const body = container[0];
		                    tabs = body.getElementsByClassName(classes.tabs.pane);
		                    length = tabs.length;
		                for(let i = 0; i < length; i++){
		                    const cur = tabs[i],
						        items = cur.getElementsByClassName(classes.drag.item),
						        align = cur.getElementsByClassName(classes.drag.align);
		                    let alignment;
		                    if(align) alignment = align[0];
		                    if(alignment) update(items, alignment);
				        }
		            }
		        }
	        },
	        
	        /**
             * update row tip (nothing).
             * @param all whether is updated all.
             */
	        updateComponentNoneTip(all) {
	            const vm = this;
	            if(all){
	                const container = document.getElementsByClassName(classes.tabs.container);
		            let tabs = null, length = 0;
		            if(container && container.length > 0){
		                const body = container[0];
		                    tabs = body.getElementsByClassName(classes.tabs.pane);
		                    length = tabs.length;
		                for(let i = 0; i < length; i++){
		                    const cur = tabs[i],
			                    box = cur.getElementsByClassName(classes.drag.box),
			                    name = box ? box[0].getAttribute(mapping.attrs.name) : null,
						        items = cur.getElementsByClassName(classes.drag.item);
		                    if(items && items.length > 0) vm.$set(vm.drag.tips, name, false);
				        }
		            }
	            }else{
	                const id = vm.drag.tabs.value,
		                container = document.getElementById(id);
	                if(container){
	                    const items = container.getElementsByClassName(classes.drag.item);
	                    if(items && items.length > 0) vm.$set(vm.drag.tips, id, false);
	                    else vm.$set(vm.drag.tips, id, true);
	                }
	            }
	        },
	        
	        /**
             * update row offset.
             * turn back to previous page if the `total width` less than `row's width * current pages` when remove component.
	         * @see initDraggableTarget
             */
	        updateComponentDraggableOffset() {
	            const vm = this,
		            id = vm.drag.tabs.value,
		            list = document.getElementById(id);
	            if(list){
	                const items = list.getElementsByClassName(classes.drag.item),
		                parent = list.parentNode.parentNode,
		                length = items.length,
		                page = vm.drag.pages.target[id];
	                let total = 0;
	                for(let i = 0; i < length; i++){
	                    const item = items[i],
		                    width = Math.round(item.getAttribute(mapping.attrs.width) * vm.setting.base.ratio);
	                    total += width;
	                }
	                if(total < ((page - 1) * vm.drag.rows.width)){
	                    vm.$set(vm.drag.pages.target, id, page - 1);
	                    const prev = parent.getElementsByClassName(classes.drag.prev);
	                    if(prev && prev.length > 0) prev[0].click();
	                }
	            }
	        },
	        
	        /**
             * search ( refresh ).
             * when click the search button, get data and refresh layout.
             * @see getComponentData
             */
	        handleComponentSearch() {
	        	const vm = this,
			        $source = vm.$refs.source;
	        	vm.getComponentData();
	        	if($source){
	        	    const source = $source.$el,
			            parent = source.parentNode,
			            parents = parent.parentNode;
	        	    source.style.marginLeft = '0';
	        	    vm.$set(vm.drag.pages, 'source', 1);
	        	    vm.$nextTick(() => {vm.switchComponentSource(parents);});
		        }
	        },
	        
	        /**
             * switch on the previous row.
             * @param event
             * @see handleComponentNext
             */
	        handleComponentPrev(event) {
	            const vm = this,
		            parent = event.currentTarget.parentNode,
		            parents = parent.parentNode,
		            $list = parent.getElementsByClassName(classes.drag.list),
		            $shadow = parents.getElementsByClassName(classes.shadow.single),
		            name = parent.getAttribute(mapping.attrs.name),
		            isTarget = name.indexOf('target') > -1;
	            let list = null, shadow = null;
	            if($list && $list.length > 0) list = $list[0];
	            if($shadow && $shadow.length > 0) shadow = $shadow[0];
	            if(isTarget){
	                /** target list */
	                let num = vm.drag.pages.target[name]
		                ? parseInt(JSON.parse(JSON.stringify(vm.drag.pages.target[name])))
		                : 1;
	                if(num > 1){
	                    num -= 1;
	                    vm.$set(vm.drag.pages.target, name, num);
	                    if(shadow){
	                        const offset = shadow.offsetLeft,
		                        style = [
		                            `top: ${shadow.offsetTop}px;`,
			                        `left: ${offset + vm.drag.rows.width}px;`,
			                        `width: ${shadow.clientWidth}px;`,
			                        `height: ${shadow.clientHeight}px;`,
			                        `display: block;`
		                        ];
	                        shadow.removeAttribute('style');
	                        shadow.setAttribute('style', style.join(''))
	                    }
	                }
	                if(list) list.style.marginLeft = - ((num - 1) * vm.drag.rows.width) + 'px';
	                const number = vm.getComponentPages(parent);
	                vm.switchComponentTarget(parent, number, name);
	                vm.emitComponentDraggableData(true);
	            }else{
	                /** source list */
	                let num = parseInt(JSON.parse(JSON.stringify(vm.drag.pages.source)));
	                if(num > 1){
	                    num -= 1;
	                    vm.$set(vm.drag.pages, 'source', num);
	                }
	                if(list) list.style.marginLeft = - ((num - 1) * vm.drag.rows.width) + 'px';
	                vm.switchComponentSource(parent);
	            }
	        },
	        
	        /**
             * switch on the next row.
             * @param event
             * @see handleComponentPrev
             */
	        handleComponentNext(event) {
	            const vm = this,
		            parent = event.currentTarget.parentNode,
		            parents = parent.parentNode,
		            $list = parent.getElementsByClassName(classes.drag.list),
		            $shadow = parents.getElementsByClassName(classes.shadow.single),
		            name = parent.getAttribute(mapping.attrs.name),
		            isTarget = name.indexOf('target') > -1;
	            let list = null, shadow =  null;
	            if($list && $list.length > 0) list = $list[0];
	            if($shadow && $shadow.length > 0) shadow = $shadow[0];
	            if(isTarget){
	                /** target list */
	                const number = vm.getComponentPages(parent),
		                width = list ? list.parentNode['clientWidth'] : 0;
	                let num = vm.drag.pages.target[name] ? vm.drag.pages.target[name] : 1;
	                if(width > 0 && width !== vm.drag.rows.width){
	                    vm.$set(vm.drag.rows.width, 'width', width);
	                }
	                if(num < number){
	                    if(shadow){
	                        const offset = shadow.offsetLeft,
		                        style = [
		                            `top: ${shadow.offsetTop}px;`,
			                        `left: ${offset - vm.drag.rows.width}px;`,
			                        `width: ${shadow.clientWidth}px;`,
			                        `height: ${shadow.clientHeight}px;`,
			                        `display: block;`
		                        ];
	                        shadow.removeAttribute('style');
	                        shadow.setAttribute('style', style.join(''))
	                    }
	                    if(list){
	                        list.style.marginLeft = - (num * vm.drag.rows.width) + 'px';
		                    num += 1;
		                    vm.$set(vm.drag.pages.target, name, num);
	                    }
	                    vm.switchComponentTarget(parent, number, name);
	                    vm.emitComponentDraggableData(true);
	                }
	            }else{
	                /** source list */
	                const number = vm.getComponentPages(parent);
	                let num = parseInt(JSON.parse(JSON.stringify(vm.drag.pages.source)));
	                if(num < number){
	                    if(list) list.style.marginLeft = - (num * vm.drag.rows.width) + 'px';
	                    num += 1;
	                    vm.$set(vm.drag.pages, 'source', num);
	                }
	                vm.switchComponentSource(parent, number);
	            }
	        },
	        
	        /**
             * reset/set default data of title.
             * content's title.
             * @param id
	         * @see switchComponentTab
             */
	        resetComponentTitleContent(id) {
	            const vm = this,
                    data = {
                        title: '0',
                        subTitle: '1',
                        position: '1'
                    };
                vm.$set(vm.template.form, 'validate', data);
                vm.$set(vm.template.form, 'disabled', false);
                if(id) vm.$set(vm.template.form.data, id, data);
	        },
	        
	        /**
             * remove `active` state
             * all of block and shadow.
             * @see switchComponentTab
             */
	        removeComponentBlockActive() {
	            const vm = this,
		            containers = document.getElementsByClassName(classes.tabs.container);
	            if(containers){
	                const container = containers[0],
		                blocks = container.getElementsByClassName(classes.drag.single),
		                shadows = container.getElementsByClassName(classes.shadow.single);
	                for(let i = 0; i < blocks.length; i++){
	                    const block = blocks[i];
	                    if(block) vm.removeClass(block, classes.drag.active);
	                }
	                if(shadows){
	                    const active = vm.active ? vm.active - 1 : shadows.length - 1,
		                    shadow = shadows[active];
	                    if(shadow){
	                        vm.removeClass(shadow, classes.shadow.active);
	                        shadow.setAttribute('style', 'display: none;');
	                    }
	                }
	            }
	        },
	        
	        /**
             * switch tab.
             * To get datas when click the tab.(emit: `switch-tab`)
             * @param name {string}
	         * @see resetComponentTitleContent
	         * @see removeComponentBlockActive
             */
	        switchComponentTab(name) {
	            const vm = this,
		            target = document.getElementById(name),
		            names = name.split('-'),
		            active = names[1] ? parseInt(names[1]) : 1;
	            if(target){
	                let exist = {};
	                vm.$set(vm.template.form, 'disabled', false);
	                if(vm.template.form.exist && vm.template.form.exist[name]){
	                    exist = JSON.parse(JSON.stringify(vm.template.form.exist[name]));
	                    const title = parseInt(exist.title),
		                    sub = parseInt(exist.subTitle);
	                    if(title && !sub) vm.$set(vm.template.form, 'disabled', true);
	                }
	                if(vm.template.form.data[name]){
	                    vm.$set(vm.template.form, 'validate', JSON.parse(JSON.stringify(vm.template.form.data[name])));
	                }else vm.resetComponentTitleContent(name);
	                const items = target.getElementsByClassName(classes.drag.item);
	                if(items && items.length > 0){
	                    const item = items[0],
		                    height = parseInt(item.getAttribute(mapping.attrs.height));
	                    if(!isNaN(height) && height > 0 && vm.setting.assembled && height !== vm.search.height){
	                        vm.$set(vm.search, 'height', height);
                            vm.$set(vm.search, 'temp', height);
                            vm.getComponentData();
	                    }
	                }
	            }
	            const row = vm.rows[active - 1];
	            let data = {name: name, active: active};
	            if(row) data.id = row[mapping.row.id];
	            vm.$set(vm.drag.tabs, 'id', active);
	            vm.$emit(broadcast.callback.tab, data);
	            vm.removeComponentBlockActive();
	        },
	        
	        /**
             * switch state (source list).
             * @param node parent node.
             * @param number page number.
	         * @see handleComponentPrev
             * @see handleComponentNext
             */
	        switchComponentSource(node, number) {
	            node = node ? node : (vm.$refs.source
		            ? vm.$refs.source.$el.parentNode.parentNode
		            : null);
	            const vm = this,
		            disabled = classes.disabled,
		            num = vm.drag.pages.source,
		            $next = node.getElementsByClassName(classes.drag.next),
		            $prev = node.getElementsByClassName(classes.drag.prev);
	            let next, prev;
	            if($next && $next.length > 0) next = $next[0];
	            if($prev && $prev.length > 0) prev = $prev[0];
	            if(prev && next){
	                number = !vm.isEmpty(number) && !isNaN(number) ? number : vm.getComponentPages(node);
	                if(num > 1){
	                    vm.removeClass(prev, disabled);
	                    if(num < number) vm.removeClass(next, disabled);
	                    else vm.addClass(next, disabled);
	                }else{
	                    vm.addClass(prev, disabled);
	                    if(number > 1) vm.removeClass(next, disabled);
	                    else vm.addClass(next, disabled);
	                }
	            }
	        },
	        
	        /**
             * switch state (target list).
             * @param node parent node.
             * @param number page number.
             * @param dest target name.
             * @see handleComponentPrev
             * @see handleComponentNext
             */
	        switchComponentTarget(node, number, dest) {
	            const vm = this,
		            disabled = classes.disabled,
		            num = vm.drag.pages.target[dest] ? vm.drag.pages.target[dest] : 1,
		            $next = node.getElementsByClassName(classes.drag.next),
		            $prev = node.getElementsByClassName(classes.drag.prev);
	            let next, prev;
	            if($next && $next.length > 0) next = $next[0];
	            if($prev && $prev.length > 0) prev = $prev[0];
	            if(prev && next){
	                number = number ? number : vm.getComponentPages(node);
	                if(num > 1){
		                vm.removeClass(prev, disabled);
		                if(num === number){
		                    if(!vm.hasClass(next, disabled)) vm.addClass(next, disabled);
		                }else{
		                    vm.removeClass(next, disabled);
		                }
		            }else{
		                if(!vm.hasClass(prev, disabled)) vm.addClass(prev, disabled);
		                if(number > 1){
		                    vm.removeClass(next, disabled);
		                }else{
		                    if(!vm.hasClass(next, disabled)) vm.addClass(next, disabled);
		                }
		            }
	            }
	        },
	
	        /**
	         * get common layout.
	         * the modal is opened, select first and click it (default).
	         * @see updateCommonLayoutModalHeight
	         */
	        getCommonLayout() {
	        	const vm = this;
	        	vm.resetCommonLayout();
	        	vm.$api.get(vm.setting.api.layout, vm.template.condition, (res) => {
	        		if(res['ret']['retCode'].toString() === '0'){
	        			vm.$set(vm.template, 'modal', true);
	        			vm.$set(vm.template, 'data', res.data.layouts);
	        			vm.$set(vm.template, 'width', Math.round((vm.template.screen - (vm.setting.base.left * vm.setting.base.ratio * 2))));
	        			vm.$nextTick(() => {
	        				/** click first one (default). */
	        				const elem = vm.$refs.template,
						        li = elem ? elem.getElementsByTagName('li') : [];
	        				if(li.length > 0) li[0].click();
	        				if(vm.template.data.length > 6) vm.removeClass(vm.$refs.right.$el, classes.disabled);
	        				vm.updateCommonLayoutModalHeight();
				        });
			        }else{
	        			vm.$warning('暂无常用模板, 请前往 [ 模板库 ] 进行创建');
	        			return false;
			        }
		        }, (err) => {
	        		vm.$error(err);
	        		return false;
		        });
	        },
	        
	        /**
             * init common template when selected.
             * @returns {boolean}
             */
	        setCommonLayout() {
	            const vm = this;
	            if(vm.template.active > 0){
	                vm.$set(vm.template, 'modal', false);
	                vm.$set(vm.template, 'referenced', true);
	                vm.$emit(broadcast.callback.template, vm.template.list);
	            }else{
	                vm.$Message.error('请选择常用模板');
	                return false;
	            }
	        },
	        
	        /**
	         * reset common layout.
	         * the first one is activity status, and empty the `list`.
	         */
	        resetCommonLayout() {
	        	const vm = this;
	        	vm.$set(vm.template, 'active', 0);
	        	vm.$set(vm.template, 'list', []);
	        },
	        
	        /**
	         * parse common layout data.
	         * @param datas
	         * @returns {*}
	         */
	        parseCommonLayout(datas) {
	        	const vm = this;
	        	let list = [],
			        widths = [];
	        	datas.map((data) => {
	        		const modules = data[mapping.row.blocks];
	        		let w = 0;
	        		modules.map((module, k) => {
	        			const num = module[mapping.module.number],
					        width = module[mapping.module.width],
					        height = module[mapping.module.height];
	        			if(num > 1){
	        				const spacing = vm.setting.base.space * (num - 1),
						        h = Math.round((height - spacing) / num * 100) / 100;
	        				for(let i = 0; i < num; i++){
	        					list.push({
							        width: width,
							        height: h
						        });
					        }
				        }else{
	        				list.push({
						        width: width,
						        height: height
					        });
				        }
	        			w += width;
	        			if(k < modules.length - 1) w += vm.setting.base.row;
	        			modules[k]['blocks'] = list;
	        			list = [];
			        });
	        		widths.push(w);
		        });
	        	vm.$set(vm.template, 'max', Math.max.apply(null, widths));
	        	return datas;
	        },
	        
	        /**
	         * search common layout.
	         * @see getCommonLayout
	         */
	        searchCommonLayout() {
	        	const vm = this;
	        	vm.getCommonLayout();
	        },
	        
	        /**
	         * select common layout.
	         * @param event
	         * @see updateCommonLayoutSwitch
	         */
	        selectCommonLayout(event) {
	        	const vm = this,
			        elem = event.target,
			        id = parseInt(elem.getAttribute(mapping.attrs.id));
	        	if(!isNaN(id) && id > 0){
	        		if(vm.template.active !== id){
	        			vm.$set(vm.template, 'active', id);
	        			const name = vm.trim(elem.getAttribute('title')),
					        row = vm.$refs.row.$el;
	        			vm.$set(vm.template, 'name', '[ ' + name + ' ] 布局预览');
	        			vm.$api.get(vm.parseUrl(vm.setting.api.template, {id: id}), {}, (res) => {
	        				if(res['ret']['retCode'].toString() === '0'){
	        					vm.$set(vm.template, 'list', vm.parseCommonLayout(res.data['layoutRows']));
	        					vm.$set(vm.template.offset, 'preview', 0);
	        					if(row) row.style.marginLeft = '0';
	        					vm.updateCommonLayoutSwitch();
					        }else{
	        					vm.$error(res['ret']['retMsg']);
	        					return false;
					        }
				        }, (err) => {
	        				vm.$error(err);
	        				return false;
				        });
			        }
		        }else{
	        		vm.$error('[ 布局模板ID ] 参数有误，请刷新后再试');
                    return false;
		        }
	        },
	        
	        /**
	         * switch common layout.
	         * `left` or `right`, set the offset of element in content.
	         * and control the switch button
	         */
	        switchCommonLayoutSearch(event) {
	        	const vm = this,
			        elem = event.target,
			        direct = vm.trim(elem.getAttribute(mapping.attrs.direct)),
			        info = {single: 150, total: 960, spacing: 12},
			        length = vm.template.data.length,
			        max = info.single * length + info.spacing * (length - 1),
			        offset = vm.template.offset.list,
			        element = vm.$refs.template;
	        	let pos = 0;
	        	if(direct === 'left'){
	        		if(offset > 0){
	        			pos = Math.abs(offset - info.total);
	        			pos = pos > 0 ? pos : 0;
	        			element.style.marginLeft = - pos + 'px';
	        	        vm.$set(vm.template.offset, 'list', pos);
	        	        if(pos <= 0) vm.addClass(elem, classes.disabled);
	        	        vm.removeClass(vm.$refs.right.$el, classes.disabled);
			        }
		        }else if(direct === 'right'){
	        		if(offset < (max - info.total)){
	        			pos = Math.abs(info.total + offset);
	        			element.style.marginLeft = - pos + 'px';
	        	        vm.$set(vm.template.offset, 'list', pos);
	        	        if(pos > max - info.total) vm.addClass(elem, classes.disabled);
	        	        vm.removeClass(vm.$refs.left.$el, classes.disabled);
			        }
		        }
	        },
	        
	        /**
             * handle preview content switcher.
             * @param event
	         * @see updateCommonLayoutSwitch
             */
	        switchCommonLayoutPreview(event) {
	            const vm = this,
		            elem = event.target,
		            direct = elem.getAttribute(mapping.attrs.direct),
		            row = vm.$refs.row.$el,
		            max = Math.round(vm.template.max * vm.setting.base.ratio),
		            offset = vm.template.offset.preview,
		            width = vm.template.width;
	            if(!vm.hasClass(elem, classes.disabled)){
	                if(direct === 'left'){
		                if(offset > 0){
		                    let pos = Math.abs(offset - width);
		                    pos = pos > 0 ? pos : 0;
		                    row.style.marginLeft = - pos + 'px';
		                    vm.$set(vm.template.offset, 'preview', pos);
		                }
		            }else if(direct === 'right'){
		                if(offset < (max - width)){
		                    const pos = Math.abs(width + offset);
		                    row.style.marginLeft = - pos + 'px';
		                    vm.$set(vm.template.offset, 'preview', pos);
		                }
		            }
		            vm.updateCommonLayoutSwitch();
	            }
	        },
	        
	        /**
             * update modal height(common layout)
             * init or window resize.
	         * @see getCommonLayout
             */
	        updateCommonLayoutModalHeight() {
	            const vm = this,
		            bodyHeight = document.body.offsetHeight,
			        element = document.getElementsByClassName(classes.modal.content),
			        modalHeight = element ? element[0].clientHeight : 0,
			        contentHeight = bodyHeight - 380,
			        maxHeight = bodyHeight - (modalHeight ? modalHeight : contentHeight) - 100;
                vm.$set(vm.template, 'height', contentHeight > 100
			        ? (contentHeight > maxHeight ? (maxHeight > 100 ? maxHeight : 100) : contentHeight)
			        : 100);
	        },
	        
	        /**
             * update modal switcher state ( preview ).
             * calculated max width and compare with content's offset.
	         * @see selectCommonLayout
             */
	        updateCommonLayoutSwitch() {
	            const vm = this,
		            prev = vm.$refs.prev.$el,
		            next = vm.$refs.next.$el,
		            list = vm.template.list,
		            offset = vm.template.offset.preview,
		            left = Math.round(vm.setting.base.left * vm.setting.base.ratio),
		            widths = [];
	            let max = 0;
	            if(list && list.length > 0){
	                list.forEach((item) => {
	                    let width = 0;
	                    const blocks = item[mapping.row.blocks];
	                    if(blocks && blocks.length > 0){
	                        blocks.forEach((block, key) => {
	                            width += block[mapping.module.width];
	                            if(key < blocks.length - 1) width += vm.setting.base.block;
	                        });
	                        widths.push(width);
	                    }
	                });
	            }
	            if(widths.length > 0) max = Math.round((Math.max.apply(null, widths) * vm.setting.base.ratio));
	            if(offset > 0) vm.removeClass(prev, classes.disabled);
	            else vm.addClass(prev, classes.disabled);
	            if(max - left > offset){
	                if(max > offset + left + vm.template.screen) vm.removeClass(next, classes.disabled);
	                else vm.addClass(next, classes.disabled);
	            }else vm.addClass(next, classes.disabled);
	        },
	        
	        /**
             * Communication between components.
             * via the common Vue object called `bus`
             */
	        handleBroadcast() {
	            const vm = this;
	            bus.$on(broadcast.prev, (event) => {
	                vm.handleComponentPrev(event);
	            });
	            bus.$on(broadcast.next, (event) => {
	                vm.handleComponentNext(event);
	            });
	            bus.$on(broadcast.shadow, (event) => {
	                vm.removeDraggableBlockShadow(event);
	            });
	            bus.$on(broadcast.init, () => {
	                vm.$nextTick(() => {
	                    const row = vm.drag.rows.num - 1;
	                    vm.initDraggableTarget(row);
	                });
	            });
	            bus.$on(broadcast.align, (active) => {
	                vm.updateComponentAlignLine(active);
	            });
	            vm.$on(broadcast.finish, () => {
	                const data = vm.wrapComponentData();
	                vm.$emit(broadcast.callback.finish, data, true);
	            });
	        },
	        
	        /**
	         * reset draggable setting.
	         * `sortable object` & `components' elements`.
	         */
	        resetDraggable() {
	        	const vm = this;
	        	vm.$set(vm.drag, 'elements', {});
	        	vm.$set(vm.drag.rows, 'instance', {});
	        	vm.$set(vm.drag.pages, 'target', {'target-1': 1});
	        },
	
	        /**
	         * create a new row that can draggable.
	         * via update `elements` variable (insert in the queue head).
	         * @see createDraggableLabel
	         */
	        createDraggable() {
	        	const vm = this,
			        label = parseInt(JSON.parse(JSON.stringify(vm.drag.rows.key))) + 1;
	        	vm.$set(vm.drag.elements, vm.drag.rows.num, {
	        		id: prefix.common + vm.$unique(),
			        key: label,             // actual number.
			        component: component,
			        num: vm.drag.rows.num,  // for showing.
			        props: {num: label}
		        });
	        	const key = parseInt(JSON.parse(JSON.stringify(vm.drag.rows.key))) + 1,
			        num = parseInt(JSON.parse(JSON.stringify(vm.drag.rows.num))) + 1,
			        row = prefix.target + label;
	        	vm.$set(vm.drag.rows, 'num', num);
	        	vm.$set(vm.drag.rows, 'key', key);
	        	/** default datas */
	        	if(!vm.drag.pages.target[row]) vm.$set(vm.drag.pages.target, row, 1);
	        	if(typeof vm.drag.tips[row] === 'undefined') vm.$set(vm.drag.tips, row, true);
	        	/** default selection */
	        	vm.$set(vm.drag.tabs, 'value', prefix.target + label);
	        	if(vm.active) vm.$set(vm.drag.tabs, 'value', prefix.target + vm.active);
	        	vm.$nextTick(() => {vm.emitComponentBaseData();});
	        },
	        
	        /**
             * create component row's label.
             * used function (`h`) to compile for render customized content.
             * @param elem
             * @returns {function(*): *}
             */
	        createDraggableLabel(elem) {
	            const vm = this,
		            label = '第 ' + elem.num + ' 行推荐';
	            return (h) => {
	                return h('Row', [
	                    h('span', label),
		                !vm.setting.assembled ? '' : h('icon', {
		                    props: {type: classes.tabs.icon},
		                    attrs: {
		                        'data-id': elem.id,
			                    title: '删除'
		                    },
		                    on: {
		                        click: (event) => {
		                            const parent = event.currentTarget.parentNode.parentNode,
                                        brother = parent.previousSibling,
                                        id = event.currentTarget.getAttribute(mapping.attrs.id),
                                        elements = JSON.parse(JSON.stringify(vm.drag.elements));
		                            brother.click();
		                            let temp = 0, name = prefix.target;
		                            for(const i in elements){
		                                if(elements.hasOwnProperty(i)){
                                            if(elements[i].id === id){
                                                temp = elements[i].num;
                                                name += elements[i].key;
                                                delete elements[i];
                                                break;
                                            }
		                                }
		                            }
		                            let rows = {};
		                            if(Object.keys(elements).length > 0){
		                                for(const k in elements){
		                                    if(elements.hasOwnProperty(k)){
		                                        if(elements[k].num <= temp){
		                                            rows[elements[k].num] = elements[k];
		                                        }else{
		                                            --elements[k].num;
		                                            rows[elements[k].num] = elements[k];
		                                        }
		                                    }
		                                }
		                            }
		                            if(vm.template.form.data[name]) delete vm.template.form.data[name];
		                            vm.$set(vm.drag, 'elements', rows);
		                            vm.drag.rows.num--;
		                        }
		                    }
		                })
	                ]);
	            };
	        },
	        
	        /**
	         * init draggable (edit).
	         * via `recommend-layout-id`.
	         * @see initDraggableBlock
	         */
	        initDraggable() {
	        	const vm = this,
			        template = {},
			        add = vm.$refs.create;
	        	let height = 0;
	        	vm.getComponentHeightData();
	        	if(vm.rows && vm.rows.length > 0){
	        	    vm.$set(vm.drag.tips, vm.name, false);
	        		vm.resetDraggable();
	        		vm.rows.forEach((item, i) => {
	        			const id = i > 0 ? (prefix.target + vm.drag.rows.num) :vm.name;
	        			let data = item[mapping.row.blocks],
					        rowId = item[mapping.row.id];
	        			if(i > 0){
	        				if(add) add.$el.click();
	        				else vm.createDraggable();
				        }
	        			if(typeof item[mapping.content.title] !== 'undefined'){
	        				data = item['modules'];
	        				rowId = item[mapping.row.group];
	        				const title = {
	        					title: item[mapping.content.title].toString(),
						        subTitle: item[mapping.content.title.sub].toString(),
						        position: item[mapping.content.pos].toString()
					        };
	        				vm.$set(vm.template.form.data, id, title);
	        				vm.$set(vm.template.form.exist, id, title);
	        				if(i === vm.rows.length - 1){
	        					vm.$set(vm.template.form, 'validate', title);
	        					if(item[mapping.content.title]){
	        						if(item[mapping.content.sub]) vm.$set(vm.template.form, 'disabled', false);
	        						else vm.$set(vm.template.form, 'disabled', true);
						        }else{
	        					    vm.resetComponentTitleContent();
	        						vm.$set(vm.template.form, 'disabled', true);
						        }
					        }else{
	        					if(!item[mapping.content.title]) vm.$set(vm.template.form.data[id], 'subTitle', '1');
					        }
				        }else vm.resetComponentTitleContent(id);
	        			const list = vm.parseComponentData(data, rowId),
					        width = vm.getComponentWidth(list, vm.setting.base.block);
	        			if(list.length > 0){
	        				list.forEach((block, index) => {
	        					if(index === 0) height = block.height > height ? block.height : height;
	        					if(!vm.drag.data[id]) vm.$set(vm.drag.data, id, []);
	        					vm.drag.data[id].push(block);
					        });
				        }
	        			template[id] = {
	        				template: vm.initDraggableBlock(list, id),
					        height: height,
					        total: width
				        };
			        });
	        		vm.$nextTick(() => {
	        			if(vm.setting.assembled) vm.initDraggableSource();
	        			if(Object.keys(template).length > 0){
	        				Object.keys(template).forEach((key) => {
	        					const cur = template[key],
							        container = document.getElementById(key);
	        					let node = null;
	        					if(container){
	        						node = container.parentNode.parentNode;
	        						vm.$set(vm.drag.rows.height, key, cur.height);
	        						vm.$set(vm.drag.pages.target, key, 1);
	        						container.innerHTML = cur.template;
	        						/** re initialization */
	        						if(!vm.click && !vm.init){
	        							if(typeof vm.drag.instance.target[key] === 'undefined'){
	        								const keys = key.split('-'),
										        target = parseInt(keys[1]);
	        								vm.initDraggableTarget(target);
								        }
							        }else vm.setComponentBodyWidth(key);
	        						vm.switchComponentTarget(node);
						        }
					        });
	        				bus.$emit(broadcast.init);
	        				/**
					         * search the source list.
					         * set height accordding to the last recommend row.
					         */
	        				let last = '';
	        				if(vm.click || vm.init){
	        					const length = vm.drag.blocks.template.length;
	        					if(length > 0){
	        						vm.drag.blocks.template.forEach((templet, t) => {
	        							const ids = templet.id.split('-'),
									        row = parseInt(ids[1]);
	        							vm.drag.blocks.instance.push(new Vue({
									        el: '#' + templet.id,
									        data() {return {values: vm.drag.blocks.values};},
									        render: Vue.compile(templet.template).render,
									        methods: {
									            click(event) {vm.handleDraggableBlockClick(event);}
									        }
								        }));
	        							vm.initDraggableTarget(row);
	        							if(t === length - 1) last = templet.id;
							        });
						        }
	        					last = last ? last : vm.name;
                                const temp = document.getElementById(last);
                                if(temp){
                                    const items = temp.getElementsByClassName(classes.drag.item);
                                    if(items.length > 0){
                                        const item = items[0],
									        height = parseInt(item.getAttribute(mapping.attrs.height));
                                        if(!isNaN(height) && height > 0 && vm.setting.assembled){
                                            vm.$set(vm.search, 'height', height);
                                            vm.$set(vm.search, 'temp', height);
                                            vm.getComponentData();
								        }
							        }
						        }
                                vm.updateComponentNoneTip(true);
	        					vm.$emit(broadcast.finish);
					        }
				        }else{
	        				vm.$error('拖拽组件初始化失败, 请刷新后再试');
	        				return false;
				        }
			        });
		        }
	        },
	        
	        /**
             * init component draggable container(source)
             * original draggable list.
             * start: whether the height is equal with destination list's height.
             * end: update the align line of components.
             */
	        initDraggableSource() {
	        	document.body.ondrop = function (event) {
                    event.preventDefault();
                    event.stopPropagation();
                };
	        	const vm = this,
			        source = vm.$refs.source.$el,
			        getList = () => {
	        	        const current = document.getElementById(vm.drag.tabs.value),
			                list = current ? current : {children: []};
	        	        return {
	        	            object: list,
			                length: list.children.length
		                };
			        },
			        start = (event) => {
	        	        const list = getList();
	        	        if(list.length > 0){
	        	            const items = list.object.getElementsByClassName(classes.drag.item);
	        	            if(items && items.length > 0){
	        	                const item = items[0],
			                        originalHeight = parseInt(item.getAttribute(mapping.attrs.height)),
			                        compareHeight = parseInt(event.item.getAttribute(mapping.attrs.height));
	        	                if(!isNaN(originalHeight) && originalHeight !== compareHeight){
	        	                    vm.$error(`<Row>高度不一致 ( <span class="red">注：</span>清空当前推荐行内的组件或选择高度一致的组件，当前高度为 <span class="theme">${originalHeight}</span> )</Row>`, 380);
	        	                    return false;
		                        }
		                    }
		                }
			        },
			        end = () => {
	        	        const data = vm.wrapComponentData();
	        	        if(data) vm.$emit(broadcast.callback.layout, data);
	        	        vm.updateComponentNoneTip();
	        	        vm.emitComponentDraggableData(true);
			        };
	        	vm.drag.instance.source = Sortable.create(source, {
			        group: {
			        	name: 'source',
				        pull: 'clone',
				        put: false
			        },
			        animation: 120,
			        ghostClass: classes.drag.dragging,
			        sort: false,
			        onStart(event) {start(event);},
			        onEnd() {end();}
		        });
	        },
	        
	        /**
             * init component draggable container(target)
             * Control of the switcher when the component is adding or removing.
             * @param id
             */
	        initDraggableTarget(id) {
	        	const vm = this;
	        	id = (id && !isNaN(id) ? id : vm.drag.rows.num - 1);
	        	const name = prefix.target + id;
	        	vm.setComponentBodyWidth(name);
	        	const target = document.getElementById(name),
			        updateObject = (event, children) => {
		                const temp = [],
			                source = vm.$refs.source;
                        let i = 0, n = 0;
                        for(; i < children.length; i++){
                            temp.push(children[i].cloneNode(true));
                        }
                        target.innerHTML = '';
                        for(; n < temp.length; n++){
                            temp[n].style.marginRight = (vm.setting.base.block * vm.setting.base.ratio) + 'px';
                            target.appendChild(temp[n]);
                        }
                        if(source) source.$el.insertBefore(event.item, event.clone);
                        event.clone.remove();
			        },
			        add = (event) => {
	        		    const parent = target.parentNode,
				            parents = parent.parentNode,
				            children = target.children,
				            number = vm.getComponentPages(parents);
	        		    updateObject(event, children);
	        		    vm.switchComponentTarget(parents, number, name);
	        		    parent.scrollLeft = 0;
	        		    vm.setComponentBodyWidth(name);
			        },
			        update = () => {
	        		    const parent = target.parentNode,
				            parents = parent.parentNode,
				            number = vm.getComponentPages(parents),
				            width = {
	        		    	    old: vm.drag.pages.target[name] ? vm.drag.pages.target[name] : 0,
					            new: (number - 1) * vm.drag.rows.width
				            },
				            first = width.old === 0 && width.new === 0;
	        		    if(first && width.old > width.new){
	        		    	target.style.marginLeft = '-' + width.new + 'px';
	        		    	const temp = width.new <= 0 ? vm.drag.rows.width : width.new;
	        		    	target.style.width = temp + 'px';
	        		    	vm.$set(vm.drag.pages.target, name, width.new);
			            }
	        		    vm.switchComponentTarget(parents, number, name);
	        		    vm.updateComponentDraggableOffset();
	        		    parent.scrollLeft = 0;
			        };
	        	vm.emitComponentDraggableData();
	        	if(target){
	        		if(vm.click || !vm.setting.assembled){
	        			vm.$set(vm.drag.instance.target, name, {});
			        }else{
	        			vm.drag.instance.target[name] = Sortable.create(target, {
	        				group: {
	        					name: 'target',
						        pull: true,
						        put: ['source']
					        },
					        animation: 120,
					        ghostClass: classes.drag.dragging,
					        onStart() {vm.initDraggableBody();},
					        onAdd(event) {
	        					add(event);
	        					event.item.style.marginRight = vm.setting.base.block * vm.setting.base.ratio + 'px';
					        },
					        onEnd() {
	        					const data = vm.wrapComponentData();
	        					vm.$emit(broadcast.callback.layout, data);
	        					vm.updateComponentNoneTip();
	        					vm.initDraggableBody(true);
	        					vm.emitComponentDraggableData(true);
					        },
					        onRemove() {update();}
				        });
			        }
		        }
	        },
	
	        /**
	         * init component draggable container(body)
             * mainly use to delete for all `target item`.
	         * @param disabled
	         */
	        initDraggableBody(disabled) {
	        	const vm = this,
			        layout = document.getElementsByClassName(classes.layout);
	        	disabled = typeof disabled !== 'undefined' ? disabled : false;
	        	if(layout){
	        		const container = layout[0];
	        		if(disabled && Object.keys(vm.drag.instance.layout).length > 0){
	        		    vm.drag.instance.layout.option('disabled', disabled);
			        }else{
	        		    vm.drag.instance.layout = Sortable.create(container, {
		                    group: {
		                        name: 'layout',
						        pull: true,
						        put: ['target']
					        },
					        animation: 120,
					        ghostClass: classes.drag.dragging,
					        disabled: disabled,
					        sort: false,
					        onAdd(event) {
		                        /** remove item & delete rows.data[$child] */
		                        const data = vm.drag.data[vm.drag.tabs.value],
							        item = event.item;
		                        if(data){
	                                const id = item ? parseInt(item.getAttribute(mapping.attrs.index)) : 0;
	                                if(!isNaN(id) && id > 0){
	                                    data.map((block, key) => {
	                                        if(block.id === id){
	                                            data.splice(key, 1);
	                                            return false;
				                            }
			                            });
		                            }
	                            }
		                        item.remove();
	                        }
				        });
			        }
		        }
	        },
	        
	        /**
	         * init recommend rows' template.
	         * @param data
	         * @param id {*} `container` id.
	         * @returns {string}
	         * @see handleDraggableBlockClick
	         */
	        initDraggableBlock(data, id) {
	        	const vm = this,
			        templates = [],
			        icon = '<icon type="ios-add-circle-outline"></icon>';
		        data.forEach((item) => {
		        	const items = item.data,
				        template = [],
				        element = [];
		        	let right = (vm.setting.base.block * vm.setting.base.ratio) + 'px',
				        attrs = [
				        	`${mapping.attrs.index}="${item.id}"`,
					        `${mapping.attrs.num}="${item.number}"`,
					        `${mapping.attrs.row}="${item.lid}"`,
					        `${mapping.attrs.width}="${item.width}"`,
					        `${mapping.attrs.height}="${item.height}"`,
					        `class="${classes.drag.item}"`,
					        `style="margin-right: ${right}"`
				        ];
		        	template.push(`<Row ${attrs.join(' ')}>`);
		        	/** recommend position (block) */
		        	items.forEach((part) => {
		        		const text = part.source.width + ' * ' + part.source.height,
					        style = [
					        	`width: ${part.width}px;`,
						        `height: ${part.height}px;`,
						        `margin-bottom: ${part.space}px;`
					        ],
					        content = vm.click
						        ? (vm.setting.text ? `<Row>${text}</Row>` : icon)
						        : (vm.init ? `<Row>${text}</Row>` : text),
					        params = [],
					        string = {},
					        id = vm.$unique();
		        		/** set `carousel` `v-model` values. */
		        		vm.$set(vm.drag.blocks.values, id, 0);
		        		/** whether can click or not. */
		        		if(vm.init || vm.click){
		        			/** attributes data */
		        			const key = vm.prefix.target + id,
						        attributes = [
						        	`id="${key}"`,
							        `${mapping.attrs.id}="${item.id}"`,
							        `${mapping.attrs.mid}="${part.mid}"`,
							        `${mapping.attrs.row}="${item.lid}"`,
							        `${mapping.attrs.pos}="${part.position}"`,
							        `${mapping.attrs.relate}="${part.relate}"`,
							        `${mapping.attrs.key}="${key}"`,
							        `${mapping.attrs.width}="${part.source.width}"`,
							        `${mapping.attrs.height}="${part.source.height}"`,
							        `class="${classes.drag.single}"`
						        ];
		        			/** click event */
		        			if(vm.click) attributes.push(`@click.native="click"`);
		        			/** node */
		        			const initData = part.initData,
						        carousel = [],
						        len = initData.length,
						        type = len > 0 ? initData[0]['recType'] : false;
		        			if(type) attributes.push(`${mapping.attrs.type}="${type}"`);
		        			params.push(attributes.join(' '));
		        			/** style */
		        			if(vm.click && content === icon && len !== 1){
		        				style.push(`font-size: ${Math.round(part.height * vm.setting.base.ratio)}px;`);
					        }
		        			/** convert to `string` */
		        			string.params = params.join('');
		        			string.style = style.join('');
		        			if(len <= 0){
		        				/** none (add icon or text) */
		        				element.push(
		        					`<Row ${string.params} style="${string.style}">${content}</Row>`
						        );
					        }else if(len === 1){
		        				/** single image */
		        				const single = initData[0];
		        				let cover = single[mapping.field.cover.one]
							        ? `<img src="${single[mapping.field.cover.one]}" class="${classes.block.cover}" />`
							        : ``;
		        				cover += single[mapping.field.cover.two]
							        ? `<img src="${single[mapping.field.cover.two]}" class="${classes.block.cover}" />`
							        : ``;
		        				element.push(
		        					`<Row ${string.params} style="${string.style}">`,
							            `<Row class="${classes.drag.image}">`,
							                `<img src="${single[mapping.field.poster]}" class="${classes.block.image}" ${mapping.attrs.index}="${single[mapping.field.id]}" />`,
							                cover,
							            `</Row>`,
							        `</Row>`
						        );
					        }else if(len > 1){
		        				/** carousel */
		        				initData.forEach((single) => {
		        					let cover = single[mapping.field.cover.one]
								        ? `<img src="${single[mapping.field.cover.one]}" class="${classes.block.cover}" />`
								        : ``;
		        					cover += single[mapping.field.cover.two]
								        ? `<img src="${single[mapping.field.cover.two]}" class="${classes.block.cover}" />`
								        : ``;
		        					carousel.push(
		        						`<CarouselItem>`,
								            `<img src="${single[mapping.field.poster]}" class="${classes.block.image}" ${mapping.attrs.index}="${single[mapping.field.id]}" />`,
								            cover,
								        `</CarouselItem>`
							        );
						        });
		        				const setting = [
		        					`:autoplay="${vm.setting.carousel.auto}"`,
							        `:autoplay-speed="${vm.setting.carousel.speed}"`,
							        `:radius-dot="${vm.setting.carousel.radiuDot}"`,
							        `v-model="values['${id}']" loop`
						        ];
		        				element.push(
		        					`<Row ${string.params} style="${string.style}">`,
							            `<Carousel ${setting.join(' ')}>`,
							                `${carousel.join('')}`,
							            `</Carousel>`,
							        `</Row>`
						        );
					        }
				        }else{
		        			/** normal, can not click. */
		        			string.params = params.join('');
		        			string.style = style.join('');
		        			element.push(
		        				`<Row class="${classes.drag.single}" ${string.params} style="${string.style}">${content}</Row>`
					        )
				        }
			        });
		        	template.push(element.join('') + '</Row>');
		        	templates.push(template.join(''));
		        });
		        /** `template` records. */
		        if(vm.init || vm.click){
		        	vm.drag.blocks.template.push({
				        id: id,
				        template: `<Row id="${id}" class="${classes.drag.list}" clearfix>${templates.join('')}</Row>`
			        });
		        }
		        return templates.join('');
	        },
	        
	        /**
             * handle block's click event.
             * @param event
	         * @see setDraggableBlockShadow
	         * @see getDraggableBlockShadowData
             */
	        handleDraggableBlockClick(event) {
	            const vm = this,
		            elem = vm.hasClass(event.target, classes.drag.single) ? event.target : event.target.parentNode;
	            if(elem && !vm.hasClass(elem, classes.drag.active)){
	                vm.removeComponentBlockActive();
	                vm.addClass(elem, classes.drag.active);
	                const data = vm.getDraggableBlockShadowData(elem);
                    vm.$set(vm.drag, 'shadow', data);
                    vm.setDraggableBlockShadow(elem);
		            vm.$emit(broadcast.callback.click.ok, data);
	            }
	        },
	        
	        /**
             * get block' shadow data to callback.
             * @param elem
             */
	        getDraggableBlockShadowData(elem) {
	            const vm = this;
	            let data = {};
	            if(elem){
	                const row = elem.getAttribute(mapping.attrs.row),
		                id = elem.getAttribute(mapping.attrs.id),
		                mid = elem.getAttribute(mapping.attrs.mid),
		                key = elem.getAttribute(mapping.attrs.key),
		                pos = elem.getAttribute(mapping.attrs.pos),
		                type = elem.getAttribute(mapping.attrs.type);
		            data = {
	                    id: key,
	                    recRowId: row,
	                    recModuleId: id,
	                    recRowModuleId: mid,
	                    pos: pos,
	                    type: type
	                };
	            }
	            return data;
	        },
    
            /**
             * show block' shadow.
             * @param node
             * @see removeDraggableBlockShadow
             */
	        setDraggableBlockShadow(node) {
	            const vm = this,
		            offset = node.parentNode.offsetLeft,
		            parent = node.parentNode.parentNode,
		            parents = parent.parentNode,
		            id = parent.getAttribute('id'),
		            left = vm.drag.pages.target[id] && vm.drag.pages.target[id] > 1
			            ? offset - ((vm.drag.pages.target[id] - 1) * vm.drag.rows.width)
			            : offset,
		            top = node.offsetTop,
		            width = Math.round(node.getAttribute(mapping.attrs.width) * vm.setting.base.ratio),
		            height = Math.round(node.getAttribute(mapping.attrs.height) * vm.setting.base.ratio);
	            if(parents && vm.hasClass(parents, classes.drag.content)){
	                const elem = parents.getElementsByClassName(classes.shadow.single)[0],
		                style = [];
	                if(elem){
	                    elem.removeAttribute('style');
	                    vm.removeClass(elem, classes.shadow.active);
	                    style.push(
	                        `top: ${top}px;`,
		                    `left: ${left}px;`,
		                    `width: ${width}px;`,
		                    `height: ${height}px;`
	                    );
	                    elem.setAttribute('style', style.join(''));
	                    vm.addClass(elem, classes.shadow.active);
	                }
	            }
	        },
	        
	        /**
             * remove block' shadow.
             * @param event
	         * @see setDraggableBlockShadow
             */
	        removeDraggableBlockShadow(event) {
	            const vm = this,
		            elem = event.target;
	            if(elem && vm.hasClass(elem, classes.shadow.active)){
	                vm.removeClass(elem, classes.shadow.active);
	                const item = document.getElementById(vm.drag.shadow.id);
	                let data = {};
	                if(item){
	                    data = vm.getDraggableBlockShadowData(item);
	                    vm.removeClass(item, classes.drag.active);
	                }
	                vm.$emit(broadcast.callback.click.cancel, data);
	            }
	        },
	        
	        parseComponentConfiguration() {
	        	const vm = this,
			        config = vm.config,
			        api = config && config.api ? config.api : {},
			        template = config && config.template ? config.template : {},
			        carousel = config && config.carousel ? config.carousel : {};
	        	return {
	        		api: {
                        base: api.base ? vm.trim(api.base) : vm.G.api.draggable.base,
				        list: api.list ? vm.trim(api.list) : vm.G.api.draggable.list,
				        height: api.height ? vm.trim(api.height) : vm.G.api.draggable.height,
				        template: api.template ? vm.trim(api.template) : vm.G.api.draggable.template,
				        layout: api.layout ? vm.trim(api.layout) : vm.G.api.draggable.layout
			        },
			        base: {},
			        assembled: typeof config.assembled !== 'undefined' ? config.assembled : true,
			        template: {
	        		    referenced: typeof template.referenced !== 'undefined' ? template.referenced : false
			        },
			        carousel: {
	        			auto: typeof carousel.auto !== 'undefined' ? carousel.auto : true,
				        speed: carousel.speed ? parseInt(carousel.speed) : 4000,
				        radiuDot: typeof carousel.radiuDot !== 'undefined' ? carousel.radiuDot : true
			        }
		        };
	        },
	        
	        handleWindowResize() {
	            const vm = this;
	            vm.updateCommonLayoutModalHeight();
	        },
        },
        watch: {
        	exec: function() {
        		const vm = this;
        		if(vm.init) vm.initDraggable();
	        },
	        'template.modal': function() {
        	    const vm = this;
        	    if(vm.template.modal){
        	        document.body.style.overflow = 'hidden';
	            }else{
        	        document.body.removeAttribute('style');
	            }
	        },
	        reacquire: function() {
        	    const vm = this,
		            data = vm.wrapComponentData();
        	    vm.$emit(broadcast.callback.layout, data);
	        }
        },
	    created() {
            const vm = this;
            vm.resetComponentTitleContent(vm.name);
            Vue.component(component, RowComponent);
        	vm.getComponentBaseData();
        	vm.handleBroadcast();
        	setTimeout(() => window.onresize = () => {
        	    vm.handleWindowResize();
	        }, 50);
	    },
        destoryed() {
            window.onresize = null;
        }
    };
    export default DraggableComponent;
</script>
