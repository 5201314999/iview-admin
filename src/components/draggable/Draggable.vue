<template>
	<Row class="wi-draggable" ref="draggable">
		<Card :id="classes.drag.source" v-if="!setting.only">
			<Row class="wi-search clearfix">
				<Row class="wi-search-left">
					<Row class="wi-select">
						<Select v-model="search.height" :style="{width: '100px'}">
							<Option v-for="(item, index) in height" :label="item" :value="item" :key="index"></Option>
						</Select>
					</Row>
				</Row>
				<Row class="wi-search-right">
				
				</Row>
			</Row>
		</Card>
	</Row>
</template>
<script>
    import Vue from 'vue';
    import Sortable from 'sortablejs';
    import  {on, off} from 'iview/src/utils/dom';

    const bus = new Vue();
    const name = 'wi-component-row';

    const RecommendRowComponent = {};

    const DraggableComponent = {
        name: 'wi-draggable',
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
			        condition: {
        				queryParam: ''
			        }
		        },
		        height: [],
		        items: [],
		        component: [],
		        classes: {
        			body: null,
			        wrapper: prefix + 'drag-delete-wrap',
			        container: prefix + 'wi-container',
			        drag: {
        				container: prefix + 'drag-container',
				        box: prefix + 'drag-box',
				        prev: prefix + 'drag-prev',
				        next: prefix + 'drag-next',
				        content: prefix + 'drag-content',
				        list: prefix + 'drag-list',
				        source: prefix + 'drag-source',
				        target: prefix + 'drag-target',
				        item: prefix + 'drag-item',
				        single: prefix + 'drag-item-one',
				        active: prefix + 'drag-item-active',
				        image: prefix + 'drag-item-image',
				        line: prefix + 'drag-screen-line',
				        align: prefix + 'drag-align-line',
				        only: prefix + 'drag-only-target'
			        },
			        shadow: {
        				single: prefix + 'drag-item-shadow',
				        active: prefix + 'drag-item-shadow-active'
			        },
			        tabs: {
        				container: prefix + 'recommend-tabs',
				        pane: 'ivu-tabs-tabpane',
				        tab: 'ivu-tabs-tab',
				        active: 'ivu-tabs-tab-active',
				        icon: 'ios-close-outline'
			        },
			        block: {
        				prefix: prefix + 'block',
				        image: prefix + 'drag-item-block-image',
				        cover: prefix + 'drag-item-block-image-cover'
			        },
			        disabled: 'disabled',
			        hidden: 'hidden'
		        },
		        drag: {
        			elements: {},
        			pages: {
        				source: 0,
				        target: {'target-1': 1}
			        },
			        rows: {
        				id: 1,          // row's number.
        				num: 1,         // row's number. (actual)
				        width: {},      // row's width.
				        height: {},     // row's height.
				        instance: {}    // sortable object. (target)
			        },
			        blocks: {
        				template: [],
				        instance: [],
				        values: {}
			        }
		        },
		        template: {
        			condition: {
                        queryParam: null,
                        sortMark: 'DESC',
                        pagination: {
                            pageNum: 1,
                            pageSize: 10000
                        }
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
                    }
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
        				const top = res.data['topMargin'],
					        left = res.data['leftMargin'],
					        block = res.data['recModuleInterval'],
					        row = res.data['recRowInterval'],
					        space = res.data['recPositionInterval'],
					        group = res.data['recGroupInterval'];
        				vm.$set(vm.setting, 'base', {
        					left: left,
					        top: top,
					        group: group,
					        row: row,
					        block: block,
					        space: space,
					        ratio: 0.5
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
        				const source = document.getElementById(vm.classes.drag.source);
        				if(source){
        					const parent = source.parentNode,
						        width = parent.clientWidth,
						        parents = parent.parentNode,
						        $next = parents.getElementsByClassName(vm.classes.drag.next);
        					let total = 0;
        					list.map((data) => {
        						total += data.width;
					        });
        					if($next){
        						const next = $next[0];
        						if(total < width){
        							vm.addClass(next, vm.classes.disabled);
						        }else{
        							vm.removeClass(next, vm.classes.disabled);
						        }
					        }
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
				        num = parseInt(item['positionNum']),
				        width = parseInt(item['moduleWidth']),
				        height = parseInt(item['moduleHeight']),
				        mid = parseInt(item['moduleId']);
        			let h;
        			if(item['recPositions']){
        				/* one block, many position. */
        				item['recPositions'].map((pos, k) => {
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
						        position: pos['recPositionId'],
						        relate: item['groupRowModuleId'],
						        initData: pos['recInitData'] ? pos['recInitData'] : []
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
	         * get component heights' list.
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
	         * get components' total width.
	         * @param data
	         * @param spacing
	         * @returns {number}
	         */
	        getComponentTotalWidth(data, spacing) {
	        	let width = 0;
	        	data.map((item) => {
	        		if(item.data && item.data.length > 0){
	        			width += (item.data[0].width + spacing);
			        }
		        });
	        	width = width > 0 ? width - spacing : width;
	        	return width;
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
	        		vm.$set(vm.drag.rows.width, 'nums', []);
	        		vm.$set(vm.drag.rows.width['nums'], id, 1);
		        }
	        },
	        
	        updateComponentBodyWidth() {},
	        
	        handleComponentSwitchTarget(node) {},
	        
	        handleComponentSwitchSource() {},
	        
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
	         * init draggable (edit).
	         * via `recommend-layout-id`.
	         */
	        initDraggable() {
	        	const vm = this,
			        template = {},
			        add = vm.$refs.create;
	        	let height = 0;
	        	vm.getComponentHeightData();
	        	if(vm.rows && vm.rows.length > 0){
	        		vm.resetDraggable();
	        		vm.rows.map((item, i) => {
	        			const id = 'target-' + vm.drag.rows.num;
	        			let data = item['layoutRowModules'],
					        rowId = item['layoutRowId'];
	        			if(i > 0){
	        				if(add) add.$el.click();
	        				else vm.setDraggable();
				        }
	        			if(typeof item.showTitle !== 'undefined'){
	        				data = item['modules'];
	        				rowId = item['groupRowId'];
	        				const title = {
	        					title: item.showTitle.toString(),
						        subTitle: item['showSubTitle'].toString(),
						        position: item['titlePosition'].toString()
					        };
	        				vm.$set(vm.template.form.data, id, title);
	        				vm.$set(vm.template.form.exist, id, title);
	        				if(i === vm.rows.length - 1){
	        					vm.$set(vm.template.form, 'validate', title);
	        					if(item.showTitle){
	        						if(item['showSubTitle']) vm.$set(vm.template.form, 'disabled', false);
	        						else vm.$set(vm.template.form, 'disabled', true);
						        }else{
	        						vm.$set(vm.template.form, 'disabled', true);
						        }
					        }else{
	        					if(!item.showTitle) vm.$set(vm.template.form.data[id], 'subTitle', '1');
					        }
				        }
	        			const list = vm.parseComponentData(data, rowId),
					        width = vm.getComponentTotalWidth(list, vm.setting.base.block);
	        			height = list ? (list[0].height > height ? list[0].height : height) : height;
	        			template[id] = {
	        				template: vm.initDraggableBlock(list, id),
					        height: height,
					        total: width
				        };
			        });
	        		vm.$nextTick(() => {
	        			if(vm.setting.only) vm.initDraggableSource();
	        			if(Object.keys(template).length > 0){
	        				Object.keys(template).forEach((key) => {
	        					const cur = template[key],
							        container = document.getElementById(key);
	        					let node = null;
	        					if(container){
	        						node = container.parentNode.parentNode;
	        						vm.$set(vm.drag.rows.height, key, cur.height);
	        						vm.$set(vm.drag.pages.target, key, 1);
	        						vm.$set(vm.drag.rows.width['nums'], k, 1);
	        						container.innerHTML = cur.template;
	        						/** re initialization */
	        						if(!vm.click && !vm.init){
	        							if(typeof vm.drag.rows.instance[key] === 'undefined'){
	        								const keys = key.split('-'),
										        target = parseInt(keys[1]);
	        								vm.initDraggableTarget(target);
								        }
							        }else vm.setComponentBodyWidth(key);
	        						vm.handleComponentSwitchTarget(node);
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
	        						vm.drag.blocks.template.map((templet, t) => {
	        							const ids = templet.id.split('-'),
									        row = parseInt(ids[1]);
	        							vm.drag.blocks.instance.push(new Vue({
									        el: '#' + templet.id,
									        data() {return {values: vm.drag.blocks.values};},
									        render: Vue.compile(templet.template).render
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
	        								const first = items[0],
										        height = parseInt(first.getAttribute('data-height'));
	        								if(!isNaN(height) && height > 0 && !vm.setting.only){
	        									vm.$set(vm.search, 'height', height);
	        									vm.$set(vm.search, 'temp', height);
	        									vm.getComponentData();
									        }
								        }
							        }
						        });
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
	         * init recommend rows' template.
	         * @param data
	         * @param id {*} `container` id.
	         * @returns {string}
	         */
	        initDraggableBlock(data, id) {
	        	const vm = this,
			        templates = [],
			        icon = '<icon type="ios-add-circle-outline"></icon>';
		        data.map((item) => {
		        	const items = item.data,
				        template = [],
				        element = [];
		        	let right = (vm.setting.base.block * vm.setting.base.ratio) + 'px',
				        attrs = [
				        	`data-index="${item.id}"`,
					        `data-num="${item.number}"`,
					        `data-row="${item.lid}"`,
					        `data-width="${item.width}"`,
					        `data-height="${item.height}"`,
					        `class="${vm.classes.drag.item}"`,
					        `style="margin-right: ${right}"`
				        ];
		        	template.push(`<Row ${attrs.join(' ')}>`);
		        	/** recommend position (block) */
		        	items.map((part) => {
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
		        			const key = vm.prefix + '-' + id,
						        attributes = [
						        	`id="${key}"`,
							        `data-id="${item.id}"`,
							        `data-mid="${part.mid}"`,
							        `data-row="${item.lid}"`,
							        `data-pos="${part.position}"`,
							        `data-relate="${part.relate}"`,
							        `data-key="${key}"`,
							        `data-width="${part.source.width}"`,
							        `data-height="${part.source.height}"`,
							        `class="${vm.classes.drag.single}"`
						        ];
		        			/** node */
		        			const initData = part.initData,
						        carousel = [],
						        len = initData.length,
						        type = len > 0 ? initData[0]['recType'] : false;
		        			if(type) attributes.push(`data-type="${type}"`);
		        			params.push(attributes.join(' '));
		        			/** style */
		        			if(vm.click && content === icon && len !== 1){
		        				style.push(`font-size="${part.height}px;"`);
					        }
		        			/** convert to `string` */
		        			string.params = params.join('');
		        			string.style = style.join('');
		        			if(len < 0){
		        				/** none (add icon or text) */
		        				element.push(
		        					`<Row ${string.params} style="${string.style}">${content}</Row>`
						        );
					        }else if(len === 1){
		        				/** single image */
		        				const single = initData[0];
		        				let cover = single['image1Url']
							        ? `<img src="${single['image1Url']}" class="${vm.classes.block.cover}" />`
							        : ``;
		        				cover += single['image2Url']
							        ? `<img src="${single['image2Url']}" class="${vm.classes.block.cover}" />`
							        : ``;
		        				element.push(
		        					`<Row ${string.params} style="${string.style}">`,
							            `<Row class="${vm.classes.drag.image}">`,
							                `<img src="${single['posterUrl']}" class="${vm.classes.block.image}" data-index="${single['recContentId']}" />`,
							                cover,
							            `</Row>`,
							        `</Row>`
						        );
					        }else if(len > 1){
		        				/** carousel */
		        				initData.map((single) => {
		        					let cover = single['image1Url']
								        ? `<img src="${single['image1Url']}" class="${vm.classes.block.cover}" />`
								        : ``;
		        					cover += single['image2Url']
								        ? `<img src="${single['image2Url']}" class="${vm.classes.block.cover}" />`
								        : ``;
		        					carousel.push(
		        						`<CarouselItem>`,
								            `<img src="${single['posterUrl']}" class="${vm.classes.block.image}" data-index="${single['recContentId']}" />`,
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
	        
	        initDraggableSource() {},
	        
	        initDraggableTarget(id) {
	        	const vm = this;
	        	id = id && !isNaN(id) ? 'target-' + id : 'target-' + vm.drag.rows.num;
	        	vm.setComponentBodyWidth(id);
	        },
	        
	        parseComponentConfiguration() {
	        	const vm = this,
			        config = vm.config,
			        api = config && config.api ? config.api : {},
			        carousel = config && config.carousel ? config.carousel : {};
	        	return {
	        		api: {
                        base: api.base ? vm.trim(api.base) : vm.G.api.draggable.base,
				        list: api.list ? vm.trim(api.list) : vm.G.api.draggable.list,
				        height: api.height ? vm.trim(api.height) : vm.G.api.draggable.height
			        },
			        base: {},
			        only: false,
			        carousel: {
	        			auto: typeof carousel.auto !== 'undefined' ? carousel.auto : true,
				        speed: carousel.speed ? parseInt(carousel.speed) : 4000,
				        radiuDot: typeof carousel.radiuDot !== 'undefined' ? carousel.radiuDot : true
			        }
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
        	if(!vm.init) vm.getComponentHeightData();
        	if(!vm.setting.only) vm.initDraggableSource();
        	vm.initDraggableTarget();
        },
        destoryed() {}
    };
    export default DraggableComponent;
</script>
