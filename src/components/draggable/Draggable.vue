<template>
	<Row class="wi-draggable" :class="setDraggableClass" ref="draggable">
		<Card :id="classes.drag.source" v-if="!setting.only">
			<div class="wi-search">
				<!-- search & layout -->
				<Row class="wi-search-left">
					<Select v-model="search.height" :style="{width: '100px'}" @on-change="handleComponentSearch" class="wi-select" filterable>
						<Option v-for="(item, index) in height" :label="item" :value="item" :key="index"></Option>
					</Select>
					<Button type="primary" size="large" class="ml15" @click="getCommonLayout" v-if="setting.commonly">常用布局</Button>
				</Row>
				<!-- create button -->
				<Row class="wi-search-right">
					<Button type="primary" size="large" ref="create">
                        <icon type="plus-round" class="mr5"></icon>添加推荐行
                    </Button>
				</Row>
				<!-- modal -->
				<Modal v-model="template.modal" :title="template.title" :transfer="true" :width="1132" :scrollable="true" class-name="wi-common-layout-preview-modal" v-if="setting.commonly">
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
						<Row class="wi-common-layout-content" ref="preview" :style="{padding: '0 ' + Math.round((960 - template.width) * setting.base.ratio) + 'px'}">
							<Row class="wi-common-layout-row" ref="row">
								<Row v-for="(list, index) in template.list" :style="{'margin-top' : index > 0 ? Math.round(setting.base.row * setting.base.ratio) + 'px' : 0}" :key="index" class="wi-common-layout-list">
									<Row v-for="(item, key) in list[mapping.row.blocks]" :style="{'margin-left': key > 0 ? Math.round(setting.base.block * setting.base.ratio) + 'px' : 0}" :key="key" class="wi-common-layout-item">
										<Row class="wi-common-layout-block" v-for="(block, i) in item.blocks" :key="i" :style="{width: Math.round(block.width * setting.base.ratio) + 'px', height: Math.round(block.height * setting.base.ratio) + 'px', 'margin-top': (i > 0 ? setting.base.space * setting.base.ratio + 'px' : 0)}" v-html="block.width + ' * ' + block.height"></Row>
									</Row>
								</Row>
							</Row>
						</Row>
						<Row class="wi-common-layout-next">
							<icon type="ios-arrow-forward" :class="classes.disabled" data-direct="next" v-on:click="switchCommonLayoutPreview" ref="right"></icon>
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
						<Row :class="classes.drag.item" v-for="(item, index) in items" :key="prefix + item.id + '-' + $unique()" :data-index="item.id" :data-num="item.number" :data-width="item.width" :data-height="item.height" :style="{'margin-right': index === items.length - 1 ? '0' : (setting.base.block * setting.ratio) + 'px'}">
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
		<Row class="wi-tabs wi-draggable-tabs" :class="setting.only ? '' : 'mt20'">
			<Tabs name="recommend" :value="drag.tabs.value" v-model="drag.tabs.value" @on-click="switchComponentRow">
				<TabPane label="第 1 行推荐" name="target-1">
					<Row :class="classes.drag.container" id="target-row-1">
						<Row :class="classes.drag.box + ' wi-draggable-target'" data-name="target-1">
							<Row :class="classes.drag.prev" @click.native="handleComponentPrev">
								<icon type="ios-arrow-back"></icon>
							</Row>
							<Row :class="classes.drag.content">
								<!-- list -->
								<Row :class="classes.drag.list" id="target-1"></Row>
								<!-- cross line -->
								<Row :class="classes.drag.line" :style="{left: ((1920 - setting.base.left) * setting.base.ratio) + 'px'}" v-if="drag.pages.target['target-1'] <= 1"></Row>
								<!-- align line -->
								<Row :class="classes.drag.align" ref="align" :style="{left: ((1920 - (setting.base.left * 2)) * setting.base.ratio) + 'px'}" v-if="drag.pages.target['target-1'] <= 1"></Row>
								<!-- shadow -->
								<Row :class="classes.shadow.single" @click.native="removeDraggableBlockShadow"></Row>
							</Row>
							<Row :class="classes.drag.next" @click.native="handleComponentNext">
								<icon type="ios-arrow-forward"></icon>
							</Row>
							<Row class="wi-draggable-tip" ref="tip" v-if="!setting.only && drag.tip">选择组件，拖放至此处</Row>
						</Row>
					</Row>
				</TabPane>
			</Tabs>
		</Row>
	</Row>
</template>
<script>
    import Vue from 'vue';
    import Sortable from 'sortablejs';
    const bus = new Vue();
    const name = 'wi-component-row';
    const RecommendRowComponent = {};
    const DraggableComponent = {
        name: 'wi-draggable',
	    computed: {
            setDraggableClass() {
                const vm = this,
	                click = vm.click ? vm.classes.drag.click : '',
	                only = vm.setting.only ? (click ? ' ' : '') + vm.classes.drag.only : '';
                return click + only;
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
	        active: {
                type: Number,
                default: 1
            }
        },
        data() {
        	const vm = this,
		        prefix = 'wi-';
        	return {
        		prefix: prefix,
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
		        classes: {
        			layout: prefix + 'layout',
			        container: prefix + 'container',
			        drag: {
        				container: prefix + 'draggable-container',
				        body: prefix + 'draggable-body',
				        box: prefix + 'draggable-box',
				        prev: prefix + 'draggable-prev',
				        next: prefix + 'draggable-next',
				        content: prefix + 'draggable-content',
				        list: prefix + 'draggable-list',
				        source: prefix + 'draggable-source',
				        target: prefix + 'draggable-target',
				        item: prefix + 'draggable-item',
				        single: prefix + 'draggable-item-one',
				        active: prefix + 'draggable-item-active',
				        image: prefix + 'draggable-item-image',
				        line: prefix + 'draggable-screen-line',
				        align: prefix + 'draggable-align-line',
				        through: prefix + 'draggable-align-line-through',
				        only: prefix + 'draggable-only',
				        dragging: prefix + 'draggable-dragging',
				        click: prefix + 'draggable-click'
			        },
			        shadow: {
        				single: prefix + 'draggable-item-shadow',
				        active: prefix + 'draggable-item-shadow-active'
			        },
			        tabs: {
        				container: prefix + 'draggable-tabs',
				        pane: 'ivu-tabs-tabpane',
				        tab: 'ivu-tabs-tab',
				        active: 'ivu-tabs-tab-active',
				        icon: 'ios-close-outline'
			        },
			        block: {
        				prefix: prefix + 'draggable-block',
				        image: prefix + 'draggable-item-block-image',
				        cover: prefix + 'draggable-item-block-image-cover'
			        },
			        template: {
        				active: prefix + 'search-item-active'
			        },
			        disabled: 'disabled',
			        hidden: 'hidden'
		        },
		        drag: {
        			elements: {},
			        data: {},
        			pages: {
        				source: 1,
				        target: {'target-1': 1}
			        },
			        instance: {         // sortable instance object.
        				layout: {},
				        source: {},
				        target: {}
			        },
			        rows: {
        				id: 1,          // row's number.
        				num: 1,         // row's number. (actual)
				        width: {        // row's width.
        					width: 0,
					        nums: {'target-1': 1}
				        },
				        height: {}      // row's height.
			        },
			        blocks: {
        				template: [],
				        instance: [],
				        values: {}
			        },
			        tabs: {
        				id: 1,
        				value: 'target-1'
			        },
			        cross: {},
			        shadow: {},
			        tip: true
		        },
		        mapping: {
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
			        width: 960,
			        active: 0,
			        list: [],
			        modal: false,
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
        		vm.setComponentBaseData();
        		vm.$api.get(vm.setting.api.base, {}, (res) => {
        			if(res['ret']['retCode'].toString() === '0'){
        				const top = res.data[vm.mapping.space.top],
					        left = res.data[vm.mapping.space.left],
					        group = res.data[vm.mapping.space.row],
					        row = res.data[vm.mapping.space.row],
					        block = res.data[vm.mapping.space.block],
					        space = res.data[vm.mapping.space.pos];
        				vm.$set(vm.setting, 'base', {
        					left: left,
					        top: top,
					        group: group,
					        row: row,
					        block: block,
					        space: space,
					        ratio: 0.5
				        });
        				if(!vm.init) vm.getComponentHeightData();
        	            if(!vm.setting.only) vm.initDraggableSource();
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
	         * basic information (default).
	         * manually.
	         */
	        setComponentBaseData() {
        		const vm = this;
        		vm.$set(vm.setting, 'base', {
        			left: 87,
			        top: 206,
			        group: 60,
			        row: 40,
			        block: 30,
			        space: 20,
			        ratio: 0.5
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
				        num = parseInt(item[vm.mapping.module.number]),
				        width = parseInt(item[vm.mapping.module.width]),
				        height = parseInt(item[vm.mapping.module.height]),
				        mid = parseInt(item[vm.mapping.module.id]);
        			let h;
        			if(item[vm.mapping.module.position]){
        				/* one block, many position. */
        				item[vm.mapping.module.position].map((pos, k) => {
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
						        position: pos[vm.mapping.module.pid],
						        relate: item[vm.mapping.module.gid],
						        initData: pos[vm.mapping.module.init] ? pos[vm.mapping.module.init] : []
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
			        container = document.getElementsByClassName(vm.classes.tabs.container),
			        standard = Math.round((1920 - vm.setting.base.left * 2 - 2) * vm.setting.base.ratio);
	        	let tabs = null, length = 0, validate = true,
			        params = {}, template = [];
	        	if(container && container.length > 0){
	        		const body = container[0];
	        		tabs = body.getElementsByClassName(vm.classes.tabs.pane);
	        		length = tabs.length;
	        		for(let i = 0; i < length; i++){
	        			const cur = tabs[i], data = [], commonly = [],
					        items = cur.getElementsByClassName(vm.classes.drag.item),
					        target = cur.getElementsByClassName(vm.classes.drag.box);
	        			let width = 0, name, setting;
	        			if(vm.setting.template){
	        				/** commonly layout. */
	        				for(let k = 0; k < items.length; k++){
	        					const item = items[k],
							        id = parseInt(item.getAttribute(vm.mapping.attrs.index)),
							        w = parseInt(item.getAttribute(vm.mapping.attrs.width));
	        					if(!isNaN(id) && id > 0) commonly.push(id);
	        					if(!isNaN(w) && w > 0) width += Math.round(w * vm.setting.base.ratio);
	        					if(k < items.length - 1) width += Math.round(vm.setting.base.block * vm.setting.base.ratio);
					        }
	        				template.push(commonly);
				        }else{
	        				/** `title` setting */
	        				if(target){
	        					name = target[0].getAttribute(vm.mapping.attrs.name);
	        					if(name === vm.drag.tabs.value){
	        					    setting = JSON.parse(JSON.stringify(vm.template.form.validate));
						        }else{
	        					    setting = JSON.parse(JSON.stringify(vm.template.form.data[name]));
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
	        				/** recommend rows' layout. */
	        				for(let n = 0; n < items.length; n++){
	        					const item = items[n],
							        id = parseInt(item.getAttribute(vm.mapping.attrs.index)),
							        row = parseInt(item.getAttribute(vm.mapping.attrs.row)),
							        num = parseInt(item.getAttribute(vm.mapping.attrs.num)),
							        w = parseInt(item.getAttribute(vm.mapping.attrs.width)),
							        height = parseInt(item.getAttribute(vm.mapping.attrs.height)),
							        blocks = item.getElementsByClassName(vm.classes.drag.single),
							        temporary = [];
	        					let relate = 0;
	        					for(let m = 0; m < blocks.length; m++){
	        						const block = blocks[m],
								        variable = {
	        							    width: parseInt(block.getAttribute(vm.mapping.attrs.width)),
									        height: parseInt(block.getAttribute(vm.mapping.attrs.height)),
									        position: parseInt(block.getAttribute(vm.mapping.attrs.pos)),
									        relate: parseInt(block.getAttribute(vm.mapping.attrs.relate))
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
							        && !vm.template.create
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
	        	return validate ? (vm.setting.template ? template : rows) : [];
	        },
	
	        /**
	         * Getting component heights' list.
	         * all of heights.
	         */
	        getComponentHeightData() {
	        	const vm = this;
	        	if(!vm.setting.only){
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
						        || (vm.setting.template && !vm.init)
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
			        width = vm.getComponentNodeWidth(node, vm.classes.drag.content),
			        items = node.getElementsByClassName(vm.classes.drag.item),
			        number = items.length;
	        	let widths = {
	        		item: 0,
			        total: 0
		        };
	        	for(let i = 0; i < number; i++){
                    if(items.hasOwnProperty(i)){
                        const cur = items[i],
					        temp = parseInt(cur.getAttribute(vm.mapping.attrs.width));
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
	        		vm.$set(vm.drag.rows.width, 'width', width);
	        		vm.$set(vm.drag.rows.width, 'nums', {});
	        		vm.$set(vm.drag.rows.width['nums'], id, 1);
		        }
	        },
	        
	        updateComponentBodyWidth() {},
	        
	        /**
             * set draggable data for component.
             * `pages`, `height`, `width` etc.
	         * @see handleComponentNext
             */
	        setComponentDraggableData() {
	            const vm = this;
	            bus.$emit('set-draggable-data', vm.drag);
	        },
	        
	        /**
             * update align line.
             * caculation formula: (1920 - (base'left + base' right)) * ratio = align line.
             * if total width of blocks large than this value, alignment line be turn green.
             * @see initDraggableTarget
             */
	        updateComponentAlignLine() {
	        	const vm = this,
			        container = document.getElementsByClassName(vm.classes.tabs.container),
			        standard = Math.round((1920 - vm.setting.base.left * 2 - 2) * vm.setting.base.ratio);
	        	let tabs = null, length = 0;
	        	if(container && container.length > 0){
	        		const body = container[0];
	        		tabs = body.getElementsByClassName(vm.classes.tabs.pane);
	        		length = tabs.length;
	        		for(let i = 0; i < length; i++){
	        			const cur = tabs[i],
					        items = cur.getElementsByClassName(vm.classes.drag.item),
					        align = cur.getElementsByClassName(vm.classes.drag.align);
	        			let width = 0, alignment;
	        			if(align) alignment = align[0];
	        			if(alignment){
	        			    for(let n = 0; n < items.length; n++){
	                            const item = items[n],
							        w = parseInt(item.getAttribute(vm.mapping.attrs.width));
	                            width += Math.round(w * vm.setting.base.ratio);
	                            if(n < items.length - 1) width += Math.round(vm.setting.base.block * vm.setting.base.ratio);
					        }
		                    if(width < standard){
		                        vm.removeClass(alignment, vm.classes.drag.through);
					        }else{
		                        if(!vm.hasClass(alignment, vm.classes.drag.through)){
		                            vm.addClass(alignment, vm.classes.drag.through);
					            }
					        }
				        }
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
		            $list = parent.getElementsByClassName(vm.classes.drag.list),
		            $shadow = parents.getElementsByClassName(vm.classes.shadow.single),
		            name = parent.getAttribute(vm.mapping.attrs.name),
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
			                        `left: ${offset + vm.drag.rows.width.width}px;`,
			                        `width: ${shadow.clientWidth}px;`,
			                        `height: ${shadow.clientHeight}px;`,
			                        `display: block;`
		                        ];
	                        shadow.removeAttribute('style');
	                        shadow.setAttribute('style', style.join(''))
	                    }
	                }
	                if(list) list.style.marginLeft = - ((num - 1) * vm.drag.rows.width.width) + 'px';
	                if(num === 1){
	                    vm.$nextTick(() => {
	                        vm.updateComponentAlignLine();
	                    });
	                }
	                const number = vm.getComponentPages(parent);
	                vm.switchComponentTarget(parent, number, name);
	            }else{
	                /** source list */
	                let num = parseInt(JSON.parse(JSON.stringify(vm.drag.pages.source)));
	                if(num > 1){
	                    num -= 1;
	                    vm.$set(vm.drag.pages, 'source', num);
	                }
	                if(list) list.style.marginLeft = - ((num - 1) * vm.drag.rows.width.width) + 'px';
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
		            $list = parent.getElementsByClassName(vm.classes.drag.list),
		            $shadow = parents.getElementsByClassName(vm.classes.shadow.single),
		            name = parent.getAttribute(vm.mapping.attrs.name),
		            isTarget = name.indexOf('target') > -1;
	            let list = null, shadow =  null;
	            if($list && $list.length > 0) list = $list[0];
	            if($shadow && $shadow.length > 0) shadow = $shadow[0];
	            if(isTarget){
	                /** target list */
	                const number = vm.getComponentPages(parent),
		                width = list ? list.parentNode['clientWidth'] : 0;
	                let num = vm.drag.pages.target[name] ? vm.drag.pages.target[name] : 1;
	                if(width > 0 && width !== vm.drag.rows.width.width){
	                    vm.$set(vm.drag.rows.width, 'width', width);
	                }
	                if(num < number){
	                    if(shadow){
	                        const offset = shadow.offsetLeft,
		                        style = [
		                            `top: ${shadow.offsetTop}px;`,
			                        `left: ${offset - vm.drag.rows.width.width}px;`,
			                        `width: ${shadow.clientWidth}px;`,
			                        `height: ${shadow.clientHeight}px;`,
			                        `display: block;`
		                        ];
	                        shadow.removeAttribute('style');
	                        shadow.setAttribute('style', style.join(''))
	                    }
	                    if(list){
	                        list.style.marginLeft = - (num * vm.drag.rows.width.width) + 'px';
		                    num += 1;
		                    vm.$set(vm.drag.pages.target, name, num);
	                    }
	                    vm.switchComponentTarget(parent, number, name);
	                    vm.setComponentDraggableData();
	                }
	            }else{
	                /** source list */
	                const number = vm.getComponentPages(parent);
	                let num = parseInt(JSON.parse(JSON.stringify(vm.drag.pages.source)));
	                if(num < number){
	                    if(list) list.style.marginLeft = - (num * vm.drag.rows.width.width) + 'px';
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
	         * @see switchComponentRow
             */
	        resetComponentTitleContent(id) {
	            const vm = this,
                    data = {
                        title: '0',
                        subTitle: '1',
                        position: '1'
                    };
                vm.$set(vm.template.form, 'validate', data);
                if(id) vm.$set(vm.template.form.data, id, data);
	        },
	        
	        /**
             * remove `active` state
             * all of block and shadow.
             * @see switchComponentRow
             */
	        removeComponentBlockActive() {
	            const vm = this,
		            containers = document.getElementsByClassName(vm.classes.tabs.container);
	            if(containers){
	                const container = containers[0],
		                blocks = container.getElementsByClassName(vm.classes.drag.single),
		                shadows = container.getElementsByClassName(vm.classes.shadow.single);
	                for(let i = 0; i < blocks.length; i++){
	                    const block = blocks[i];
	                    if(block) vm.removeClass(block, vm.classes.drag.active);
	                }
	                if(shadows){
	                    const active = vm.active ? vm.active - 1 : shadows.length - 1,
		                    shadow = shadows[active];
	                    if(shadow){
	                        vm.removeClass(shadow, vm.classes.shadow.active);
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
	        switchComponentRow(name) {
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
	                }else{
	                    vm.resetComponentTitleContent();
	                }
	                const items = target.getElementsByClassName(vm.classes.drag.item);
	                if(items && items.length > 0){
	                    const item = items[0],
		                    height = parseInt(item.getAttribute(vm.mapping.attrs.height));
	                    if(!isNaN(height) && height > 0 && !vm.setting.only && height !== vm.search.height){
	                        vm.$set(vm.search, 'height', height);
                            vm.$set(vm.search, 'temp', height);
                            vm.getComponentData();
	                    }
	                }
	            }
	            const row = vm.rows[active - 1];
	            let data = {name: name, active: active};
	            if(row) data.id = row[vm.mapping.row.id];
	            vm.$set(vm.drag.tabs, 'id', active);
	            vm.$set(vm.drag.tabs, 'value', name);
	            vm.$emit('switch-tab', data);
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
		            disabled = vm.classes.disabled,
		            num = vm.drag.pages.source,
		            $next = node.getElementsByClassName(vm.classes.drag.next),
		            $prev = node.getElementsByClassName(vm.classes.drag.prev);
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
		            disabled = vm.classes.disabled,
		            num = vm.drag.pages.target[dest] ? vm.drag.pages.target[dest] : 1,
		            $next = node.getElementsByClassName(vm.classes.drag.next),
		            $prev = node.getElementsByClassName(vm.classes.drag.prev);
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
	         */
	        getCommonLayout() {
	        	const vm = this;
	        	vm.resetCommonLayout();
	        	vm.$api.get(vm.setting.api.layout, vm.template.condition, (res) => {
	        		if(res['ret']['retCode'].toString() === '0'){
	        			vm.$set(vm.template, 'modal', true);
	        			vm.$set(vm.template, 'data', res.data.layouts);
	        			vm.$nextTick(() => {
	        				/** click first one (default). */
	        				const elem = vm.$refs.template,
						        li = elem ? elem.getElementsByTagName('li') : [];
	        				if(li.length > 0) li[0].click();
	        				if(vm.template.data.length > 6) vm.removeClass(vm.$refs.right.$el, vm.classes.disabled);
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
	        
	        setCommonLayout() {},
	        
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
	        		const modules = data[vm.mapping.row.blocks];
	        		let w = 0;
	        		modules.map((module, k) => {
	        			const num = module[vm.mapping.module.number],
					        width = module[vm.mapping.module.width],
					        height = module[vm.mapping.module.height];
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
	         */
	        selectCommonLayout(event) {
	        	const vm = this,
			        elem = event.target,
			        id = parseInt(elem.getAttribute(vm.mapping.attrs.id));
	        	if(!isNaN(id) && id > 0){
	        		if(vm.template.active !== id){
	        			vm.$set(vm.template, 'active', id);
	        			const name = vm.trim(elem.getAttribute('title'));
	        			vm.$set(vm.template, 'name', '[ ' + name + ' ] 布局预览');
	        			vm.$set(vm.template, 'width', 960 - Math.round(vm.setting.base.left * vm.setting.base.ratio));
	        			vm.$api.get(vm.parseUrl(vm.setting.api.template, {id: id}), {}, (res) => {
	        				if(res['ret']['retCode'].toString() === '0'){
	        					vm.$set(vm.template, 'list', vm.parseCommonLayout(res.data['layoutRows']));
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
			        direct = vm.trim(elem.getAttribute(vm.mapping.attrs.direct)),
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
	        	        if(pos <= 0) vm.addClass(elem, vm.classes.disabled);
	        	        vm.removeClass(vm.$refs.right.$el, vm.classes.disabled);
			        }
		        }else if(direct === 'right'){
	        		if(offset < (max - info.total)){
	        			pos = Math.abs(info.total + offset);
	        			element.style.marginLeft = - pos + 'px';
	        	        vm.$set(vm.template.offset, 'list', pos);
	        	        if(pos > max - info.total) vm.addClass(elem, vm.classes.disabled);
	        	        vm.removeClass(vm.$refs.left.$el, vm.classes.disabled);
			        }
		        }
	        },
	        
	        switchCommonLayoutPreview() {},
	        
	        /**
             * Communication between components.
             * via the common Vue object called `bus`
             */
	        handleBroadcast() {
	            const vm = this;
	            bus.$on('prev-action', (event) => {
	                vm.handleComponentPrev(event);
	            });
	            bus.$on('next-action', (event) => {
	                vm.handleComponentNext(event);
	            });
	            bus.$on('init-target-draggable', () => {
	                vm.$nextTick(() => {
	                
	                });
	            });
	            vm.$on('init-finish', () => {
	                const data = vm.wrapComponentData();
	                vm.$emit('finish', data, true);
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
	         */
	        setDraggable() {
	        	const vm = this;
	        	vm.$set(vm.drag.elements, vm.drag.rows.num, {
	        		id: vm.drag.rows.id,
			        component: name,
			        props: {num: vm.drag.rows.num}
		        });
	        	const num = vm.drag.rows.num + 1,
			        id = vm.drag.rows.id + 1;
	        	vm.$set(vm.drag.rows, 'num', num);
	        	vm.$set(vm.drag.rows, 'id', id);
	        },
	        
	        /**
             * current tab's container.
             * via `this.drag.tabs.value` variable.
             * @returns {Element}
             */
	        getDraggableContainer() {
	            const vm = this,
		            containers = document.getElementsByClassName(vm.classes.drag.container),
		            values = JSON.parse(JSON.stringify(vm.drag.tabs.value)).split('-'),
		            active = parseInt(values[values.length - 1]);
	            let current = null;
	            if(isNaN(active)) current = containers[0];
	            else current = containers[active - 1];
	            return current;
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
	        		vm.resetDraggable();
	        		const tip = vm.$refs.tip;
	        		if(tip && tip.$el) vm.addClass(tip.$el, vm.classes.hidden);
	        		vm.rows.map((item, i) => {
	        			const id = 'target-' + vm.drag.rows.num;
	        			let data = item[vm.mapping.row.blocks],
					        rowId = item[vm.mapping.row.id];
	        			if(i > 0){
	        				if(add) add.$el.click();
	        				else vm.setDraggable();
				        }
	        			if(typeof item[vm.mapping.content.title] !== 'undefined'){
	        				data = item['modules'];
	        				rowId = item[vm.mapping.row.group];
	        				const title = {
	        					title: item[vm.mapping.content.title].toString(),
						        subTitle: item[vm.mapping.content.title.sub].toString(),
						        position: item[vm.mapping.content.pos].toString()
					        };
	        				vm.$set(vm.template.form.data, id, title);
	        				vm.$set(vm.template.form.exist, id, title);
	        				if(i === vm.rows.length - 1){
	        					vm.$set(vm.template.form, 'validate', title);
	        					if(item[vm.mapping.content.title]){
	        						if(item[vm.mapping.content.sub]) vm.$set(vm.template.form, 'disabled', false);
	        						else vm.$set(vm.template.form, 'disabled', true);
						        }else{
	        						vm.$set(vm.template.form, 'disabled', true);
						        }
					        }else{
	        					if(!item[vm.mapping.content.title]) vm.$set(vm.template.form.data[id], 'subTitle', '1');
					        }
				        }
	        			const list = vm.parseComponentData(data, rowId),
					        width = vm.getComponentWidth(list, vm.setting.base.block);
	        			if(list.length > 0){
	        				list.map((block, index) => {
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
	        			if(!vm.setting.only) vm.initDraggableSource();
	        			if(Object.keys(template).length > 0){
	        				Object.keys(template).forEach((key) => {
	        					const cur = template[key],
							        container = document.getElementById(key);
	        					let node = null;
	        					if(container){
	        						node = container.parentNode.parentNode;
	        						vm.$set(vm.drag.rows.height, key, cur.height);
	        						vm.$set(vm.drag.pages.target, key, 1);
	        						vm.$set(vm.drag.rows.width['nums'], key, 1);
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
	        				bus.$emit('init-target-draggable');
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
	        					vm.$nextTick(() => {
	        						last = last ? last : 'target-1';
	        						const temp = document.getElementById(last);
	        						if(temp){
	        							const items = temp.getElementsByClassName(vm.classes.drag.item);
	        							if(items.length > 0){
	        								const item = items[0],
										        height = parseInt(item.getAttribute(vm.mapping.attrs.height));
	        								if(!isNaN(height) && height > 0 && !vm.setting.only){
	        									vm.$set(vm.search, 'height', height);
	        									vm.$set(vm.search, 'temp', height);
	        									vm.getComponentData();
									        }
								        }
							        }
						        });
	        					vm.updateComponentAlignLine();
	        					vm.$emit('init-finish');
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
			        source = document.getElementById('source'),
			        getList = () => {
	        	        const current = vm.getDraggableContainer(),
			                list = current ? document.getElementById(vm.drag.tabs.value) : {};
	        	        return {
	        	            object: list,
			                length: list.children ? list.children.length : 0
		                };
			        },
			        start = (event) => {
	        	        const list = getList();
	        	        if(list.length > 0){
	        	            const items = list.object.getElementsByClassName(vm.classes.drag.item);
	        	            if(items && items.length > 0){
	        	                const item = items[0],
			                        originalHeight = parseInt(item.getAttribute(vm.mapping.attrs.height)),
			                        compareHeight = parseInt(event.item.getAttribute(vm.mapping.attrs.height));
	        	                if(!isNaN(originalHeight) && originalHeight !== compareHeight){
	        	                    vm.$error(`<Row>高度不一致 ( <span class="red">注：</span>清空当前推荐行内的组件或选择高度一致的组件，当前高度为 <span class="theme">${originalHeight}</span> )</Row>`, 380);
	        	                    return false;
		                        }
		                    }
		                }else vm.$set(vm.drag, 'tip', false);
			        },
			        end = () => {
	        	        const data = vm.wrapComponentData(),
			                list = getList();
	        	        if(data) vm.$emit('get-data', data);
	        	        vm.updateComponentAlignLine();
	        	        vm.updateComponentBodyWidth();
	        	        if(list.length <= 0) vm.$set(vm.drag, 'tip', false);
			        };
	        	vm.drag.instance.source = Sortable.create(source, {
			        group: {
			        	name: 'source',
				        pull: 'clone',
				        put: ['none']
			        },
			        animation: 120,
			        ghostClass: vm.classes.drag.dragging,
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
	        	id = id && !isNaN(id) ? 'target-' + id : 'target-' + vm.drag.rows.num;
	        	vm.setComponentBodyWidth(id);
	        	const target = document.getElementById(id),
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
	        		    vm.switchComponentTarget(parents, number, id);
	        		    parent.scrollLeft = 0;
	        		    vm.setComponentBodyWidth(id);
			        },
			        update = () => {
	        		    const parent = target.parentNode,
				            parents = parent.parentNode,
				            number = vm.getComponentPages(parents),
				            width = {
	        		    	    old: vm.drag.pages.target[id] ? vm.drag.pages.target[id] : 0,
					            new: (number - 1) * vm.drag.rows.width.width
				            },
				            first = width.old === 0 && width.new === 0;
	        		    if(first && width.old > width.new){
	        		    	target.style.marginLeft = '-' + width.new + 'px';
	        		    	const temp = width.new <= 0 ? vm.drag.rows.width.width : width.new;
	        		    	target.style.width = temp + 'px';
	        		    	vm.$set(vm.drag.pages.target, id, width.new);
			            }
	        		    vm.switchComponentTarget(parents, number, id);
	        		    parent.scrollLeft = 0;
			        };
	        	if(target){
	        		if(vm.click || vm.only){
	        			vm.$set(vm.drag.instance.target, id, {});
			        }else{
	        			vm.drag.instance.target[id] = Sortable.create(target, {
	        				group: {
	        					name: 'target',
						        pull: true,
						        put: ['source']
					        },
					        animation: 120,
					        ghostClass: vm.classes.drag.dragging,
					        onStart() {
	        					vm.initDraggableBody();
					        },
					        onAdd(event) {
	        					add(event);
	        					event.item.style.marginRight = vm.setting.base.block * vm.setting.base.ratio + 'px';
					        },
					        onEnd() {
	        					const data = vm.wrapComponentData();
	        					vm.$emit('get-data', data);
	        					if(vm.drag.pages.target[id] && vm.drag.pages.target[id] <= 1) vm.updateComponentAlignLine();
	        					vm.initDraggableBody(true);
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
			        layout = document.getElementsByClassName(vm.classes.layout);
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
					        ghostClass: vm.classes.drag.dragging,
					        disabled: disabled,
					        sort: false,
					        onAdd(event) {
		                        /** remove item & delete rows.data[$child] */
		                        const data = vm.drag.data[vm.drag.tabs.value],
							        item = event.item;
		                        if(data){
	                                const id = item ? parseInt(item.getAttribute(vm.mapping.attrs.index)) : 0;
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
				        	`${vm.mapping.attrs.index}="${item.id}"`,
					        `${vm.mapping.attrs.num}="${item.number}"`,
					        `${vm.mapping.attrs.row}="${item.lid}"`,
					        `${vm.mapping.attrs.width}="${item.width}"`,
					        `${vm.mapping.attrs.height}="${item.height}"`,
					        `class="${vm.classes.drag.item}"`,
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
		        			const key = vm.prefix + id,
						        attributes = [
						        	`id="${key}"`,
							        `${vm.mapping.attrs.id}="${item.id}"`,
							        `${vm.mapping.attrs.mid}="${part.mid}"`,
							        `${vm.mapping.attrs.row}="${item.lid}"`,
							        `${vm.mapping.attrs.pos}="${part.position}"`,
							        `${vm.mapping.attrs.relate}="${part.relate}"`,
							        `${vm.mapping.attrs.key}="${key}"`,
							        `${vm.mapping.attrs.width}="${part.source.width}"`,
							        `${vm.mapping.attrs.height}="${part.source.height}"`,
							        `class="${vm.classes.drag.single}"`
						        ];
		        			/** click event */
		        			if(vm.click) attributes.push(`@click.native="click"`);
		        			/** node */
		        			const initData = part.initData,
						        carousel = [],
						        len = initData.length,
						        type = len > 0 ? initData[0]['recType'] : false;
		        			if(type) attributes.push(`${vm.mapping.attrs.type}="${type}"`);
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
		        				let cover = single[vm.mapping.field.cover.one]
							        ? `<img src="${single[vm.mapping.field.cover.one]}" class="${vm.classes.block.cover}" />`
							        : ``;
		        				cover += single[vm.mapping.field.cover.two]
							        ? `<img src="${single[vm.mapping.field.cover.two]}" class="${vm.classes.block.cover}" />`
							        : ``;
		        				element.push(
		        					`<Row ${string.params} style="${string.style}">`,
							            `<Row class="${vm.classes.drag.image}">`,
							                `<img src="${single[vm.mapping.field.poster]}" class="${vm.classes.block.image}" ${vm.mapping.attrs.index}="${single[vm.mapping.field.id]}" />`,
							                cover,
							            `</Row>`,
							        `</Row>`
						        );
					        }else if(len > 1){
		        				/** carousel */
		        				initData.forEach((single) => {
		        					let cover = single[vm.mapping.field.cover.one]
								        ? `<img src="${single[vm.mapping.field.cover.one]}" class="${vm.classes.block.cover}" />`
								        : ``;
		        					cover += single[vm.mapping.field.cover.two]
								        ? `<img src="${single[vm.mapping.field.cover.two]}" class="${vm.classes.block.cover}" />`
								        : ``;
		        					carousel.push(
		        						`<CarouselItem>`,
								            `<img src="${single[vm.mapping.field.poster]}" class="${vm.classes.block.image}" ${vm.mapping.attrs.index}="${single[vm.mapping.field.id]}" />`,
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
		        				`<Row class="${vm.classes.drag.single}" ${string.params} style="${string.style}">${content}</Row>`
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
				        template: `<Row id="${id}" class="${vm.classes.drag.list}" clearfix>${templates.join('')}</Row>`
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
		            elem = vm.hasClass(event.target, vm.classes.drag.single) ? event.target : event.target.parentNode;
	            if(elem && !vm.hasClass(elem, vm.classes.drag.active)){
	                vm.removeComponentBlockActive();
	                vm.addClass(elem, vm.classes.drag.active);
	                const data = vm.getDraggableBlockShadowData(elem);
                    vm.$set(vm.drag, 'shadow', data);
                    vm.setDraggableBlockShadow(elem);
		            vm.$emit('click-call', data);
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
	                const row = elem.getAttribute(vm.mapping.attrs.row),
		                id = elem.getAttribute(vm.mapping.attrs.id),
		                mid = elem.getAttribute(vm.mapping.attrs.mid),
		                key = elem.getAttribute(vm.mapping.attrs.key),
		                pos = elem.getAttribute(vm.mapping.attrs.pos),
		                type = elem.getAttribute(vm.mapping.attrs.type);
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
			            ? offset - ((vm.drag.pages.target[id] - 1) * vm.drag.rows.width.width)
			            : offset,
		            top = node.offsetTop,
		            width = Math.round(node.getAttribute(vm.mapping.attrs.width) * vm.setting.base.ratio),
		            height = Math.round(node.getAttribute(vm.mapping.attrs.height) * vm.setting.base.ratio);
	            if(parents && vm.hasClass(parents, vm.classes.drag.content)){
	                const elem = parents.getElementsByClassName(vm.classes.shadow.single)[0],
		                style = [];
	                if(elem){
	                    elem.removeAttribute('style');
	                    vm.removeClass(elem, vm.classes.shadow.active);
	                    style.push(
	                        `top: ${top}px;`,
		                    `left: ${left}px;`,
		                    `width: ${width}px;`,
		                    `height: ${height}px;`
	                    );
	                    elem.setAttribute('style', style.join(''));
	                    vm.addClass(elem, vm.classes.shadow.active);
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
	            if(elem && vm.hasClass(elem, vm.classes.shadow.active)){
	                vm.removeClass(elem, vm.classes.shadow.active);
	                const item = document.getElementById(vm.drag.shadow.id);
	                let data = {};
	                if(item){
	                    data = vm.getDraggableBlockShadowData(item);
	                    vm.removeClass(item, vm.classes.drag.active);
	                }
	                vm.$emit('click-cancel', data);
	            }
	        },
	
	        /**
	         * parse config.
	         * @returns {{api: {base: *, list: *, height: *, template: *, layout: *}, base: {}, only: boolean, commonly: boolean, carousel: {auto: boolean, speed: number, radiuDot: boolean}, template: boolean}}
	         */
	        parseComponentConfiguration() {
	        	const vm = this,
			        config = vm.config,
			        api = config && config.api ? config.api : {},
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
			        only: typeof config.only !== 'undefined' ? config.only : false,
			        commonly: typeof config.commonly !== 'undefined' ? config.commonly : false,
			        carousel: {
	        			auto: typeof carousel.auto !== 'undefined' ? carousel.auto : true,
				        speed: carousel.speed ? parseInt(carousel.speed) : 4000,
				        radiuDot: typeof carousel.radiuDot !== 'undefined' ? carousel.radiuDot : true
			        },
			        template: typeof config.template !== 'undefined' ? config.template : false
		        };
	        },
        },
        watch: {
        	exec: function() {
        		const vm = this;
        		if(vm.init) vm.initDraggable();
	        }
        },
        mounted() {
        	const vm = this;
        	vm.getComponentBaseData();
        	vm.handleBroadcast();
        },
        destoryed() {}
    };
    export default DraggableComponent;
</script>
