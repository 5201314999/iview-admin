<template>
	<Row class="wi-draggable" :class="setDraggableClass" ref="draggable">
		<!-- source & modal & search -->
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
		<!-- title content -->
		<Row :class="classes.template.container">
			<Row :class="classes.template.title">内容标题样式</Row>
			<Form :model="template.form.validate" :rules="template.form.rules" :class="'wi-form ' + classes.template.form">
				<Row :class="classes.template.item">
					<Col span="8">
						<FormItem prop="title" label="标题样式" :class="classes.template.select">
							<Select v-model="template.form.validate.title">
								<Option value="1">展示标题</Option>
								<Option value="0">隐藏标题</Option>
							</Select>
						</FormItem>
					</Col>
					<template v-if="template.form.validate.title === '1'">
						<Col span="8">
							<FormItem prop="position" label="标题位置" :class="classes.template.select">
								<Select v-model="template.form.validate.position">
									<Option value="1">图中</Option>
									<Option value="2">图外</Option>
								</Select>
							</FormItem>
						</Col>
						<Col span="8">
							<FormItem prop="subTitle" label="展示副标题" :class="classes.template.radio">
								<RadioGroup v-model="template.form.validate.subTitle" size="large">
			                        <template v-if="template.form.disabled">
				                        <Radio label="1" disabled><span>是</span></Radio>
			                            <Radio label="0" disabled><span>否</span></Radio>
			                        </template>
									<template v-else>
										<Radio label="1"><span>是</span></Radio>
			                            <Radio label="0"><span>否</span></Radio>
									</template>
			                    </RadioGroup>
							</FormItem>
						</Col>
					</template>
				</Row>
				
			</Form>
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
	 * [ init [Boolean]]: 是否执行初始化操作(whether to initialization).
	 * [ rows [Array]]: 初始化数据, 具体格式请查看接口响应数据(initialization datas).
	 * [ exec [Any]]: 数据变更，重新渲染的执行标识(reinitialized if the value of `exec` is changed, recommended use `this.$unique()`).
	 * [ active [Number]]: 当前选中的推荐行, 从`1`开始(tab of currently selected, start from 1).
	 * [ click [Boolean]]: 是否可点击(whether can click).
	 * [ click-call [Callback]]: 点击组件块的事件回调 - 选中(callback after click component's block - selection).
	 * [ click-cancel [Callback]]: 再次点击组件块, 将取消选中(when component's block is clicked again, the event take place).
	 * [ finish [Callback]]: 初始化完成后的回调(callback after initialization).
	 * [ reacquire [Any]]: 执行再次获取组件数据的状态标识(change this value to trigger reacquisition of data).
	 * [ layout-data [Callback]]: 获取组件数据的回调(get componet's data if `reacquire` is changed).
	 * [ template-data [Callback]]: 获取`常用模板`数据的回调(get common template data when select the single one).
	 * [ filling [String | Boolean]]: 执行数据填充(filling block content if the value is changed).
	 * [ increase [Boolean|Array|Object]]: 单个内容填充(filling data, see watcher `increase`).
	 * [ decrease [Boolean|Array|Object]]: 移除指定内容(remove data, see watcher `decrease`).
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
	 *      [ assembled [Boolean]]: 是否是组装的状态, 即是否存在`source`列表, 默认为`true`(whether there is a `source` list)
	 *      [ title [Boolean]]: 是否显示内容`title`配置选项(whether to display the title configuration option)
	 *      [ template [Object]]: 常用布局模板配置(the configuaration of common templates):
	 *          ``` ------------------------------------------------------------
	 *          3.1.3. `template` 参数说明(parameters of called `template`):
	 *          [ referenced [Boolean]]: 是否引用常用模板(whether to reference common templates)
	 *          ``` ------------------------------------------------------------
	 *      [ carousel [Object]]: 轮播配置
	 *          ``` ------------------------------------------------------------
	 *          3.1.4. `carousel` 参数说明(parameters of called `carousel`):
	 *          [ auto [Boolean]]: 是否自动轮播(whether to automatically)
	 *          [ speed [Number]]: 轮播切换的速度, 单位：毫秒(Carousel switching speed, unit: ms)
	 *          [ radius [Boolean]]: 切换按钮是否为圆形(whether the toggle button is round)
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
	 *              radius: true
	 *          }
	 *      }
	 *      ``` --------------------------------------------------------------------------------
	 *
	 * 4. 数据结构(data structure):
	 *  ( 注: api接口的变量名称变化; [ note: variable name if the `api` has changed ] ).
	 *  [rows [Array | Object]]: 初始化数据(initialization data)
	 *  ```
	 *  eg (Array).
	 *  [
	 *      {
	 *          layoutRowId: 288,
	 *          layoutRowModules: [
	 *              {
	 *                  groupRowModuleId: 3035,
	 *                  moduleId: 55,
	 *                  moduleHeight: 488,
	 *                  moduleWidth: 1300,
	 *                  positionNum: 1,
	 *                  recPositions: [
	 *                      {
	 *                          width: 488,
	 *                          height: 1300,
	 *                          recPositionId: 3158,
	 *                          recInitData: [
	 *                              {
	 *                                  contentShow: '致我们终将逝去的青春,
	 *                                  contentValue: '36654',
	 *                                  posterUrl: 'https://dev-file.tvflnet.com//F17/04/100/a.jpg',
	 *                                  recContentId: 1308,
	 *                                  recGroupId: 288,
	 *                                  recPositionId: 3158,
	 *                                  showTitle: null,
	 *                                  ...
	 *                              },
	 *                              ...
	 *                          ]
	 *                      },
	 *                      ...
	 *                  ]
	 *              },
	 *              ...
	 *          ],
	 *          showTitle: 0,
	 *          showSubTitle: 1,
	 *          titlePosition: 1
	 *      }
	 *      {...}
	 *  ]
	 *
	 *
	 *  ( 注：对象结构的数据, 该组件将会自行解析成符合格式的数据 )
	 *  ( note: the draggable component will automatically parse this data structure
	 *  into eligible to `rows` and initialization ).
	 *  使用 `object` 结构的 `rows` 数据, 只需赋值如下结构的数据, 组件将会自动解析该数据进行初始化操作.
	 *  eg (Object).
	 *  {
	 *      layout: {
	 *          groupRows: [
	 *              {
	 *                  groupRowId: 288,
	 *                  showTitle: 0,
	 *                  showSubTitle: 1,
	 *                  titlePosition: 1,
	 *                  isCrossScreen: 0,
	 *                  modules: [
	 *                      {
	 *                          groupRowModuleId: 3035,
	 *                          moduleId: 55
	 *                          // @see rows(Array).
	 *                          ...
	 *                      },
	 *                      ...
	 *                  ]
	 *              },
	 *              ...
	 *          ]
	 *      },
	 *      content: [
	 *          {
	 *              contentShow: '致我们终将逝去的青春,
	 *              contentValue: '36654',
	 *              // @see rows(Array).
	 *              ...
	 *          },
	 *          ...
	 *      ]
	 *  }
	 *  ```
	 */
    import Vue from 'vue';
    import Sortable from 'sortablejs';
    import lazyLoad from 'vue-lazyload';
    Vue.use(lazyLoad, {
        error: require('static/images/error.png'),
        loading: require('static/images/common.png'),
        attempt: 1
    });
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
			    twinkling: prefix.common + 'draggable-item-twinkling',
		        single: prefix.common + 'draggable-item-one',
		        active: prefix.common + 'draggable-item-active',
		        image: prefix.common + 'draggable-item-image',
		        line: prefix.common + 'draggable-screen-line',
		        align: prefix.common + 'draggable-align-line',
		        through: prefix.common + 'draggable-align-line-through',
		        assembled: prefix.common + 'draggable-assembled',
		        dragging: prefix.common + 'draggable-dragging',
		        click: prefix.common + 'draggable-click',
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
		        cover: prefix.common + 'draggable-item-block-image-cover',
			    carousel: {
		            item: 'ivu-carousel-item',
				    track: '.higher'
			    }
		    },
		    modal: {
		        container: 'wi-common-layout-preview-modal',
		        content: 'ivu-modal-content'
		    },
		    template: {
		        container: prefix.common + 'template-form',
			    title: prefix.common + 'template-form-title',
			    form: prefix.common + 'template-form-content',
			    item: prefix.common + 'item ' + prefix.common + 'form-item',
			    select: prefix.common + 'select',
			    radio: prefix.common + 'radio',
		        active: prefix.common + 'search-item-active'
		    },
		    icons: {
		        forward: 'ivu-icon-ios-arrow-forward',
			    back: 'ivu-icon-ios-arrow-back',
			    add: 'ios-add-circle-outline'
		    },
		    disabled: 'disabled',
		    hidden: 'hidden'
		},
	    mapping = {
            row: {
                id: 'layoutRowId',
	            blocks: 'layoutRowModules',
	            group: 'groupRowId',
	            list: 'groupRows'
            },
	        content: {
                title: 'showTitle',
		        sub: 'showSubTitle',
		        pos: 'titlePosition',
		        back: {
                    id: 'id',
			        mid: 'recRowModuleId',
			        rid: 'recRowId',
			        module: 'recModuleId',
			        pos: 'pos',
			        type: 'type'
		        }
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
		        list: 'modules',
		        cross: 'isCrossScreen',
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
		        src: 'data-src',
		        type: 'data-type',
		        width: 'data-width',
		        height: 'data-height',
		        name: 'data-name',
		        relate: 'data-relate',
		        direct: 'data-direct'
	        },
	        fields: {
                id: 'recContentId',
                cover: {
                    default: 'imageUrl',
                    one: 'image1Url',
	                two: 'image2Url'
                },
		        poster: 'posterUrl',
		        pos: 'recPositionId',
		        type: 'recType',
		        width: 'width',
		        height: 'height'
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
	            bus.$emit(broadcast.init, vm.num);
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
            	type: [Array, Object],
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
            },
	        filling: {
        	    type: [String, Boolean],
		        default: false
	        },
	        increase: {
        	    type: [Boolean, Array, Object],
		        default: false
	        },
	        decrease: {
        	    type: [Boolean, Array, Object],
		        default: false
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
				        target: {},
				        block: {}
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
        				value: name,
				        last: name
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
        		if(datas && datas.length > 0){
        		    datas.forEach((item) => {
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
		        }
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
			        params = {}, template = [], groups = {};
	        	if(container && container.length > 0){
	        		const body = container[0];
	        		tabs = body.getElementsByClassName(classes.tabs.pane);
	        		length = tabs.length;
	        		for(let i = 0; i < length; i++){
	        			const cur = tabs[i], data = [], commonly = [],
					        items = cur.getElementsByClassName(classes.drag.item),
					        target = cur.getElementsByClassName(classes.drag.box);
	        			params[mapping.module.cross] = 0;
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
                                params[mapping.content.title] = setting.title;
                                params[mapping.content.sub] = setting.subTitle;
                                params[mapping.content.pos] = setting.position;
					        }else{
                                params[mapping.content.title] = JSON.parse(JSON.stringify(vm.template.form.validate.title));
                                params[mapping.content.sub] = JSON.parse(JSON.stringify(vm.template.form.validate.subTitle));
                                params[mapping.content.pos] = JSON.parse(JSON.stringify(vm.template.form.validate.position));
					        }
                            if(!parseInt(params.showTitle)){
                                /** restoring the defaults. */
                                params[mapping.content.pos] = '1';
                                params[mapping.content.sub] = '1';
					        }
				        }
	        			if(vm.setting.template.referenced){
	        				/** commonly layout. */
	        				for(let k = 0; k < items.length; k++){
	        					const item = items[k],
							        id = parseInt(item.getAttribute(mapping.attrs.id)),
							        w = parseInt(item.getAttribute(mapping.attrs.width));
	        					if(!isNaN(id) && id > 0) commonly.push(id);
	        					if(!isNaN(w) && w > 0) width += Math.round(w * vm.setting.base.ratio);
	        					if(k < items.length - 1) width += Math.round(vm.setting.base.block * vm.setting.base.ratio);
					        }
	        				template.push(commonly);
				        }else{
	        				/** recommend rows' layout. */
	        				groups[mapping.row.list] = {};
	        				for(let n = 0; n < items.length; n++){
	        					const item = items[n],
							        id = parseInt(item.getAttribute(mapping.attrs.id)),
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
	        						let single = {};
	        					    single[mapping.fields.width] = variable.width;
	        					    single[mapping.fields.height] = variable.height;
	        						if(variable.position && !isNaN(variable.position))
	        						    single[mapping.module.pid] = variable.position;
	        						temporary.push(single);
						        }
	        					let modules = {};
	        					modules[mapping.module.id] = id;
	        					modules[mapping.module.number] = num;
	        					modules[mapping.fields.width] = w;
	        					modules[mapping.fields.height] = height;
	        					modules[mapping.module.position] = temporary;
	        					if(relate) modules[mapping.module.gid] = relate;
	        					data.push(modules);
	        					width += Math.round(w * vm.setting.base.ratio);
	        					if(n < items.length - 1) width += Math.round(vm.setting.base.block * vm.setting.base.ratio);
	        					/** update, needs `groupRowId` */
	        					if(
	        						row
							        && !isNaN(row)
							        && !params[mapping.row.group]
							        && !vm.setting.template.referenced
						        ) params[mapping.row.group] = row;
	        					params[mapping.module.list] = data;
					        }
	        				if(width > standard + Math.round(vm.setting.base.left * vm.setting.base.ratio))
	        				    params[mapping.module.cross] = 1;
	        				rows.push(params);
	        				groups[mapping.row.list] = rows;
				        }
	        			if(width < standard){
	        				validate = false;
	        				break;
				        }
			        }
		        }
	        	return validate ? (vm.setting.template.referenced ? template : groups) : [];
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
	                for(let k = 0; k < shadows.length; k++){
                        const shadow = shadows[k];
                        if(shadow) vm.removeClass(shadow, classes.shadow.active);
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
		            active = names[1] ? parseInt(names[1]) : 1,
		            last = {
	                    id: JSON.parse(JSON.stringify(vm.drag.tabs.last)),
			            data: JSON.parse(JSON.stringify(vm.template.form.validate))
		            };
	            if(last.id) vm.$set(vm.template.form.data, last.id, last.data);
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
	            vm.$set(vm.drag.tabs, 'last', name);
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
	        	vm.$api.get(vm.setting.api.templates, vm.template.condition, (res) => {
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
	                vm.$set(vm.drag.tabs, 'value', vm.name);
	                vm.$set(vm.drag.rows, 'num', 2);
	                vm.$set(vm.drag, 'elements', {});
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
			        modalHeight = element && element.length > 0 ? element[0].clientHeight : 0,
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
	            bus.$on(broadcast.init, (data) => {
	                vm.$nextTick(() => {
	                    const row = data ? data : vm.drag.rows.key;
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
	        	if(!vm.template.form.data[row]) vm.resetComponentTitleContent(row);
	        	/** default selection */
	        	vm.$set(vm.drag.tabs, 'value', row);
	        	vm.$set(vm.drag.tabs, 'temp', row);
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
	         * @param rows {*}
	         * @see initDraggableBlock
	         */
	        initDraggable(rows) {
	        	const vm = this,
			        template = {},
			        add = vm.$refs.create;
	        	let height = 0;
	        	rows = typeof rows !== 'undefined' ? rows : vm.rows;
	        	vm.getComponentHeightData();
	        	if(rows && rows.length > 0){
	        	    vm.$set(vm.drag.tips, vm.name, false);
	        		vm.resetDraggable();
	        		rows.forEach((item, i) => {
	        			const id = i > 0 ? (prefix.target + vm.drag.rows.num) : vm.name;
	        			let data = item[mapping.row.blocks],
					        rowId = item[mapping.row.id];
	        			if(typeof item[mapping.content.title] !== 'undefined'){
	        				rowId = item[mapping.row.id];
	        				const title = {
	        					title: item[mapping.content.title].toString(),
						        subTitle: item[mapping.content.sub].toString(),
						        position: item[mapping.content.pos].toString()
					        };
	        				vm.$set(vm.template.form.data, id, title);
	        				vm.$set(vm.template.form.exist, id, title);
	        				if(i === rows.length - 1){
	        					vm.$set(vm.template.form, 'validate', title);
	        					if(item[mapping.content.title]){
	        						if(item[mapping.content.sub]) vm.$set(vm.template.form, 'disabled', false);
	        						else vm.$set(vm.template.form, 'disabled', true);
						        }else{
	        					    vm.resetComponentTitleContent();
	        						vm.$set(vm.template.form, 'disabled', false);
						        }
					        }else{
	        					if(!item[mapping.content.title]) vm.$set(vm.template.form.data[id], 'subTitle', '1');
					        }
				        }else vm.resetComponentTitleContent(id);
	        			if(i > 0){
	        				if(add) add.$el.click();
	        				else vm.createDraggable();
				        }
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
	        							if(vm.drag.blocks.instance[templet.id] && vm.drag.blocks.instance[templet.id]){
	        							    vm.drag.blocks.instance[templet.id].destroy();
	        							    vm.$set(vm.drag.blocks.values, templet.id, 0);
								        }
	        							vm.drag.blocks.instance[templet.id] = new Vue({
									        el: '#' + templet.id,
									        data() {return {values: vm.drag.blocks.values};},
									        render: Vue.compile(templet.template).render,
									        methods: {
									            click(event) {vm.handleDraggableBlockClick(event);},
										        destroy() {this.$destroy();}
									        }
								        });
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
	        	id = (id && !isNaN(id) ? id : vm.drag.rows.key);
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
	                                const id = item ? parseInt(item.getAttribute(mapping.attrs.id)) : 0;
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
			        icon = `<icon type="${classes.icons.add}"></icon>`;
		        data.forEach((item) => {
		        	const items = item.data,
				        template = [],
				        element = [];
		        	let right = (vm.setting.base.block * vm.setting.base.ratio) + 'px',
				        attrs = [
				        	`${mapping.attrs.id}="${item.id}"`,
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
		        			const key = prefix.common + id,
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
						        type = len > 0 ? initData[0][mapping.fields.type] : false;
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
		        				let cover = single[mapping.fields.cover.one]
							        ? `<img data-src="${single[mapping.fields.cover.one]}" class="${classes.block.cover}" />`
							        : ``;
		        				cover += single[mapping.fields.cover.two]
							        ? `<img data-src="${single[mapping.fields.cover.two]}" class="${classes.block.cover}" />`
							        : ``;
		        				element.push(
		        					`<Row ${string.params} style="${string.style}">`,
							            `<Row class="${classes.drag.image}" v-lazy-container="{selector: 'img'}">`,
							                `<img data-src="${single[mapping.fields.poster]}" class="${classes.block.image}" ${mapping.attrs.id}="${single[mapping.fields.id]}" />`,
							                cover,
							            `</Row>`,
							        `</Row>`
						        );
					        }else if(len > 1){
		        				/** carousel */
		        				initData.forEach((single) => {
		        					let cover = single[mapping.fields.cover.one]
								        ? `<img src="${single[mapping.fields.cover.one]}" class="${classes.block.cover}" />`
								        : ``;
		        					cover += single[mapping.fields.cover.two]
								        ? `<img src="${single[mapping.fields.cover.two]}" class="${classes.block.cover}" />`
								        : ``;
		        					carousel.push(
		        						`<CarouselItem>`,
								            `<img src="${single[mapping.fields.poster]}" class="${classes.block.image}" ${mapping.attrs.id}="${single[mapping.fields.id]}" />`,
								            cover,
								        `</CarouselItem>`
							        );
						        });
		        				const setting = vm.getDraggableBlockCarouselSetting(id);
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
	         * rerender block.
	         * @param id {string} `block` id.
	         * @param template {string} new template.
	         */
	        rerenderDraggableBlock(id, template) {
	            const vm = this;
	            if(vm.drag.instance.block && vm.drag.instance.block.$el) vm.drag.instance.block.destory();
	            vm.$set(vm.drag.blocks.values, id.replace(prefix.common, ''), 0);
                vm.drag.instance.block = new Vue({
                    el: '#' + id,
                    data() {return {values: vm.drag.blocks.values};},
                    methods: {
                        click(event) {vm.handleDraggableBlockClick(event);},
	                    destory() {this.$destroy();}
                    },
                    render: Vue.compile(template).render
                });
	        },
	        
	        /**
             * handle block's click event.
             * @param event
	         * @return {*}
	         * @see setDraggableBlockShadow
	         * @see getDraggableBlockShadowData
             */
	        handleDraggableBlockClick(event) {
	            const vm = this,
		            target = event.target;
	            if(vm.hasClass(target, classes.icons.forward) || vm.hasClass(target, classes.icons.back)) return ;
		        const elem = vm.hasClass(target, classes.drag.single) ? target : vm.parents(target, classes.drag.single, false);
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
	         * filling data.
	         * @see watcher `increase`.
	         */
	        handleDraggableBlockIncrease() {
	            const vm = this,
		            name = classes.block.image,
		            selector = classes.block.carousel.track + ' .' + name,
		            template = [], list = [],
		            poster = document.createElement('img'),
		            elem = document.getElementById(vm.increase.id);
	            if(elem){
	                let elements = null, id = '',
		                nodes = elem.querySelectorAll(selector),
		                length = nodes.length;
	                /** carousel or not. */
	                if(length <= 0){
	                    elements = elem.getElementsByClassName(name);
	                    length = elements.length;
	                }
	                const attrs = [],
		                names = elem.getAttribute('class'),
		                styles = elem.getAttribute('style');
	                id = elem.getAttribute('id');
	                attrs.push(
	                    `id="${id}"`,
		                `${mapping.attrs.id}="${elem.getAttribute(mapping.attrs.id)}"`,
		                `${mapping.attrs.mid}="${elem.getAttribute(mapping.attrs.mid)}"`,
		                `${mapping.attrs.row}="${elem.getAttribute(mapping.attrs.row)}"`,
		                `${mapping.attrs.pos}="${elem.getAttribute(mapping.attrs.pos)}"`,
		                `${mapping.attrs.relate}="${elem.getAttribute(mapping.attrs.relate)}"`,
		                `${mapping.attrs.key}="${elem.getAttribute(mapping.attrs.key)}"`,
		                `${mapping.attrs.width}="${elem.getAttribute(mapping.attrs.width)}"`,
		                `${mapping.attrs.height}="${elem.getAttribute(mapping.attrs.height)}"`,
		                names ? `class="${names}"` : ``,
		                styles ? `style="${styles}"` : ``
	                );
	                if(vm.click) attrs.push(`@click.native="click"`);
	                if(length > 0){
	                    /** get exsiting images */
                        const items = nodes.length > 0 ? nodes : elements;
                        for(let i = 0; i < length; i++){
                            const image = items[i];
                            list.push({
	                            id: image.getAttribute(mapping.attrs.id),
	                            poster: vm.formatUrl(image.getAttribute('src'))
                            });
                        }
	                }
	                /** single one */
	                if(vm.increase.poster){
	                    const src = vm.formatUrl(vm.increase.poster);
	                    poster.src = src;
	                    poster.className = name;
	                    poster.setAttribute(mapping.attrs.id, vm.increase.cid);
	                    list.push({id: vm.increase.cid, poster: src});
	                }else{
	                    /** list(multiple) */
	                    if(vm.increase.list && vm.increase.list.length > 0){
	                        vm.increase.list.forEach((item) => {
	                            const url = vm.formatUrl(item.poster);
	                            poster.src = url;
	                            poster.className = name;
	                            poster.setAttribute(mapping.attrs.id, item.cid);
	                            list.push({id: item.cid, poster: url});
	                        });
	                    }else{
	                        vm.$error('图片回显失败，链接有误，请刷新后重试');
	                        return false;
	                    }
	                }
                    if(list.length > 1){
                        /** assembly `carousel` template */
	                    const setting = vm.getDraggableBlockCarouselSetting(id);
	                    template.push(
	                        `<Row ${attrs.join(' ')}>`,
	                            `<Carousel ${setting.join(' ')}>`
	                    );
	                    list.forEach((item) => {
	                        template.push(
	                            `<CarouselItem>`,
	                                `<img src="${item.poster}" class="${name}" data-id="${item.id}" />`,
	                            `</CarouselItem>`
	                        );
	                    });
	                    template.push(`</Carousel></Row>`);
                        vm.rerenderDraggableBlock(vm.increase.id, template.join(''));
                    }else{
                        elem.innerHTML = '';
	                    elem.appendChild(poster);
                    }
	            }
	        },
    
            /**
             * remove data.
             * @see watcher `decrease`.
             */
	        handleDraggableBlockDecrease() {
	            const vm = this, elements = [],
		            name = classes.block.image,
		            selector = `img[class="${name}"]`,
		            icon = `<icon type="${classes.icons.add}"></icon>`;
	            if(vm.decrease && vm.decrease.length > 0){
	                vm.decrease.forEach((item) => {
	                    elements.push(document.querySelector(selector + `[${mapping.attrs.id}="${item}"]`));
	                });
	                elements.forEach((elem, key) => {
	                    const node = vm.parent(elem),
		                    template = [];
	                    let unique = null;
	                    if(node && vm.hasClass(node, classes.drag.image)){
	                        /** single */
	                        const block = vm.parent(node);
	                        node.remove();
	                        if(block && vm.hasClass(block, classes.drag.single)){
	                            template.push(icon);
	                            unique = block.getAttribute('id');
	                        }
	                    }else if(node && vm.hasClass(node, classes.block.carousel.item)){
	                        /** carousel */
	                        const list = vm.parent(node),
		                        block = vm.parents(list, classes.drag.single, false);
	                        node.remove();
		                    if(block && vm.hasClass(block, classes.drag.single)){
		                        unique = block.getAttribute('id');
			                    const images = list.querySelectorAll(selector),
			                        length = images.length;
		                        if(length > 1){
		                            /** still carousel */
		                            const items = [];
		                            /** assembly `carousel` template */
		                            for(let i = 0; i < length; i++){
		                                const item = list[i],
			                                src = item.getAttribute('src'),
			                                cid = item.getAttribute(mapping.attrs.id);
		                                items.push(
		                                    `<CarouselItem>`,
			                                    `<img src="${src}" class="${name}" ${mapping.attrs.id}="${cid}" />`,
			                                `</CarouselItem>`
		                                );
		                            }
		                            const setting = vm.getDraggableBlockCarouselSetting(unique);
		                            template.push(
		                                `<Carousel ${setting.join(' ')}>`,
			                                items.join(''),
		                                `<Carousel>`
		                            );
		                        }else{
		                            /** single one */
		                            const image = list[0],
			                            id = image.getAttribute(mapping.attrs.id);
		                            template.push(
		                                `<Row class="">`,
			                                `<img src="${image.getAttribute('src')}" class="${name}" ${mapping.attrs.id}="${id}" />`,
			                            `</Row>`
		                            );
		                        }
		                    }
	                    }
	                    if(unique){
	                        /** copy element and rerender. */
	                        const element = document.getElementById(unique),
	                            height = parseInt(element.getAttribute(mapping.attrs.height)),
	                            size = Math.round(height * vm.setting.base.ratio * vm.setting.base.ratio) + 'px';
                            let temp = document.createElement('div');
                            vm.addClass(element, classes.drag.twinkling);
                            vm.removeClass(element, classes.drag.active);
                            element.innerHTML = template.join('');
                            element.style.fontSize = size;
                            temp.appendChild(element.cloneNode(true));
		                    let string = temp.innerHTML,
			                    strings = string.split('>');
                            if(vm.click && strings) strings[0] = strings[0] + ' @click.native="click"';
                            string = strings.join('>').replace(/div/ig, 'Row');
                            temp = null;
                            vm.rerenderDraggableBlock(unique, string);
                            /** select one to twinkling and switch tab */
                            if(key === 0){
                                vm.$nextTick(() => {
                                    const selection = document.getElementById(unique);
	                                if(selection){
	                                    const list = selection ? vm.parents(selection, classes.drag.list, false) : null;
	                                    if(list){
		                                    const id = list.getAttribute('id');
		                                    if(id) vm.$set(vm.drag.tabs, 'value', id);
		                                }
	                                    setTimeout(() => {
	                                        vm.removeClass(selection, classes.drag.twinkling);
	                                    }, 1600);
	                                }
                                });
                            }
	                    }
	                });
	            }
	        },
	        
	        /**
             * get block' shadow data to callback.
             * @param elem
             */
	        getDraggableBlockShadowData(elem) {
	            let data = {};
	            if(elem){
	                const row = elem.getAttribute(mapping.attrs.row),
		                id = elem.getAttribute(mapping.attrs.id),
		                mid = elem.getAttribute(mapping.attrs.mid),
		                key = elem.getAttribute(mapping.attrs.key),
		                pos = elem.getAttribute(mapping.attrs.pos),
		                type = elem.getAttribute(mapping.attrs.type);
	                data[mapping.content.back.id] = key;
	                data[mapping.content.back.rid] = row;
	                data[mapping.content.back.module] = id;
	                data[mapping.content.back.mid] = mid;
	                data[mapping.content.back.pos] = pos;
	                data[mapping.content.back.type] = type;
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
	        
	        /**
	         * carousel setting.
	         * @param id {string} model
	         * @return {Array}
	         */
	        getDraggableBlockCarouselSetting(id) {
	            const vm = this;
	            return [
                    `:autoplay="${vm.setting.carousel.auto}"`,
			        `:autoplay-speed="${vm.setting.carousel.speed}"`,
			        `:radius-dot="${vm.setting.carousel.radius}"`,
			        `v-model="values['${id.replace(prefix.common, '')}']"`,
		            `loop`
		        ];
	        },
	        
	        /**
	         * resize.
	         * update list width and page number.
	         * update modal content height.
	         */
	        handleWindowResize() {
	            const vm = this,
		            id = vm.drag.tabs.value,
		            list = document.getElementById(id),
		            page = vm.drag.pages.target[id],
		            content = list.parentNode,
		            container = content.parentNode,
		            width = vm.drag.rows.width,
		            number = vm.getComponentPages(container);
	            let temp = content.clientWidth;
	            if(temp !== width){
	                vm.$set(vm.drag.rows, 'width', temp);
	                if(page > 1) list.style.marginLeft = - Math.round(temp * page) + 'px';
	                if(number > 1){
	                    vm.switchComponentTarget(content.parentNode, number);
	                }else{
	                    vm.$set(vm.drag.pages.target, id, 1);
	                    list.style.marginLeft = '0';
	                }
	            }
	            vm.updateCommonLayoutModalHeight();
	        },
	        
	        /**
             * parse configuration.
             * @returns {{template: {referenced: boolean}, api: {template: *, templates: *, list: *, base: *, height: *}, assembled: *, title: boolean, carousel: {auto: boolean, radius: boolean, speed: number}, base: {}}}
             */
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
				        templates: api.templates ? vm.trim(api.templates) : vm.G.api.draggable.templates
			        },
			        base: {},
			        assembled: typeof config.assembled !== 'undefined' ? config.assembled : true,
			        template: {
	        		    referenced: typeof template.referenced !== 'undefined' ? template.referenced : false
			        },
			        title: typeof config.title !== 'undefined' ? config.title : false,
			        carousel: {
	        			auto: typeof carousel.auto !== 'undefined' ? carousel.auto : true,
				        speed: carousel.speed ? parseInt(carousel.speed) : 4000,
				        radius: typeof carousel.radius !== 'undefined' ? carousel.radius : true
			        }
		        };
	        }
        },
        watch: {
            /**
             * 执行初始化 (exec[run]).
             * initialization.
             */
        	exec: function() {
        		const vm = this;
        		if(vm.init) vm.initDraggable();
	        },
	        
	        /**
	         * 常用模板弹窗 (template modal`).
	         * if it's opened, hide `overflow`.
	         */
	        'template.modal': function() {
        	    const vm = this;
        	    if(vm.template.modal){
        	        document.body.style.overflow = 'hidden';
	            }else{
        	        document.body.removeAttribute('style');
	            }
	        },
	        
            /**
             * 重新获取数据(reacquire data).
             * trigger `get-data` callback if the value is changed ( can call `this.$unique()` function to assignment ).
             */
	        reacquire: function() {
        	    const vm = this,
		            data = vm.wrapComponentData();
        	    vm.$emit(broadcast.callback.layout, data);
	        },
    
            /**
             * 内容填充 - 初始化(filling datas - initialization).
             * set `rows` data, the component will parse of it (see instructions).
             *  ```
             *  structure:
             *  {
             *      layout: {...},
             *      content: [...]
             *  }
             *  ```
             */
	        filling: function() {
	            const vm = this;
	            if((typeof vm.filling).toUpperCase() === 'BOOLEAN' && vm.filling === false) return ;
		        const layout = vm.rows.layout,
		            content = vm.rows.content;
	            let list = {};
	            for(let i = 0; i < content.length; i++){
	                content[i][mapping.fields.poster] = vm.formatUrl(content[i][mapping.fields.poster]);
	                content[i][mapping.fields.cover.default] = vm.formatUrl(content[i][mapping.fields.cover.default]);
	                if(typeof list[content[i][mapping.fields.pos]] === 'undefined'){
	                    list[content[i][mapping.fields.pos]] = [];
	                }
	                list[content[i][mapping.fields.pos]].push(content[i]);
	            }
	            const rows = [],
		            data = layout[mapping.row.list] ? layout[mapping.row.list] : [];
	            for(let k = 0; k < data.length; k++){
	                const cur = data[k];
	                let temp = {};
	                temp[mapping.row.id] = cur[mapping.row.group];
	                temp[mapping.content.title] = cur[mapping.content.title];
	                temp[mapping.content.sub] = cur[mapping.content.sub];
	                temp[mapping.content.pos] = cur[mapping.content.pos];
	                temp[mapping.row.blocks] = cur[mapping.module.list];
	                rows.push(temp);
	            }
	            for(let n = 0; n < rows.length; n++){
	                const current = rows[n],
		                length = current[mapping.row.blocks].length;
	                for(let m = 0; m < length; m++){
	                    const item = current[mapping.row.blocks][m],
		                    len = item[mapping.module.position].length;
	                    for(let x = 0; x < len; x++){
	                        const block = item[mapping.module.position][x];
	                        let init = {};
	                        init[mapping.module.init] = [];
	                        if(block[mapping.fields.pos] && list[block[mapping.fields.pos]]){
	                            init[mapping.module.init] = list[block[mapping.fields.pos]];
	                        }
	                        Object.assign(block, init);
	                    }
	                }
	            }
	            vm.$nextTick(() => {
	                if(vm.init) vm.initDraggable(rows);
	            });
	        },
    
            /**
             * 内容填充 - 单个(filling data - single one).
             * ```
             * structure (Object):
             * {
             *     id: 'current dom id',            // 当前所选的dom ID
             *     cid: 'recommend content id',     // 推荐内容ID
             *     poster: 'image / video url',     // 海报(底图)
             *     cover: 'image / video url',      // 海报(叠图)
             *     type: '1/2 (image / video)'      // 类型(图片/视频)
             * }
             *
             * structure (Array):
             * {
             *     id: 'current dom id',
             *     list: [{
             *         cid: '',
             *         poster: ''
             *         // @see `Object` structure.
             *         ...
             *     }, {...}]
             * }
             * ```
             * @see handleDraggableBlockIncrease
             */
	        increase: function() {
	            const vm = this;
	            if((typeof vm.increase).toUpperCase() === 'BOOLEAN' && vm.increase === false) return ;
	            vm.handleDraggableBlockIncrease();
	        },
    
            /**
             * 移除内容(remove data).
             *  ```
             *  structure(Object|Array):
             *      Object:
             *
             *      Array:
             *  ```
             */
	        decrease: function() {
	            const vm = this;
	            if((typeof vm.decrease).toUpperCase() === 'BOOLEAN' && vm.decrease === false) return ;
	            vm.handleDraggableBlockDecrease();
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
