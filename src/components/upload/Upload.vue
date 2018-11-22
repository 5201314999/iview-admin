<template>
    <Row class="wi-upload wrapper" @drop.prevent.stop>
        <Row class="template-wrapper" v-for="(item, index) in uploadList" :key="index">
            <template v-if="item.status === 'finished'">
                <Row v-show="!item.compressing" class="drag-item" @click="handleItemClick(index)"
                     :class="{dragActive:dragActive(index)} ">
                    <Row class="img-wrapper" @dragend="dragend" @dragover.prevent="dragover($event, index)"
                         @dragstart="dragstart($event, index)" draggable="true">
                        <img class="drag-img" :src="item.url" :onerror="errorImg" v-viewer />
                    </Row>
                    <Row class="cover">
                        <icon type="ios-trash-outline" @click.native.stop="handleRemove(item, index)"></icon>
                    </Row>
                </Row>
                <Row v-show="item.compressing" class="compress-wrapper">
                    <div class="compress-bar"></div>
                    <p class="txt">压缩中...</p>
                </Row>
            </template>
            <template v-else>
                <Progress class="progress" v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
            </template>
        </Row>
        <Upload class="uploader" v-show="uploadList.length<maxCount" type="drag" ref="upload"
                :show-upload-list="false"
                :default-file-list="defaultList"
                :multiple="multiple"
                :accept="accept"
                :format="format"
                :max-size="maxSize"
                :on-exceeded-size="handleMaxSize"
                :on-format-error="handleFormatError"
                :before-upload="handleBeforeUpload"
                :on-success="handleSuccess"
                :action="actionUrl"
                :data="{fbId: fbId}"
                style="display: inline-block;width:120px;box-sizing:border-box;">
            <Row class="uploadBtn" @click="handleUploadBtnClick">
                <Row class="btnIcon">
                    <icon type="ios-cloud-upload-outline" size="38"></icon>
                </Row>
                <Row class="btnText">
                    <span>上传</span>
                </Row>
            </Row>
        </Upload>
        <span v-if="noteText && noteText.length" class="noteText" v-html="noteText"></span>
        <Row class="compressList-table-wrapper">
            <Table class="compressList-table"
                   :columns="columns"
                   :data="compressList"
                   v-show="compressList.length">
            </Table>
        </Row>
        <Modal v-model="showCoverImg" class-name="wi-modal-cover">
            <img :src="showImg" v-if="showCoverImg" style="width: 100%" :onerror="errorImg" v-viewer>
        </Modal>
    </Row>
</template>
<script>
    'use strict';
    import errorImg from './error.png';
    const UploadComponent = {
        props: ['config'],
        data() {
            const vm = this,
                upload = vm.config && vm.config.uploadServer ? vm.config.uploadServer : vm.G.files.server.upload,
                sever = vm.config && vm.config.fileServer ? vm.config.fileServer : vm.G.files.server.download,
                action = '/upload/normal/batch-file';
            return {
                accept: vm.config && vm.config.accept ? vm.config.accept : vm.G.files.accept.image,
                format: vm.config && vm.config.format ? vm.config.format : vm.G.files.format,
                noteText: vm.config && vm.config.noteText ? vm.config.noteText : '',
                maxCount: vm.config && null != vm.config.maxCount
                        ? vm.config.maxCount
                        : 100,
                /* 多选 */
                multiple: vm.config && vm.config.multiple && null != vm.config.maxCount && vm.config.maxCount > 1,
                /* 大小限制 ( 压缩前不大于3M ) */
                maxSize: vm.config && vm.config.maxSize ? vm.config.maxSize : null,
                /* 压缩的体积 */
                compressSize: vm.config && vm.config.compressSize ? vm.config.compressSize : null,
                fbId: vm.config && vm.config.fbId ? vm.config.fbId : '',
                errorImg: `this.src="${errorImg}"`,
                defaultList: [],
                dragIndex: null,
                dragFlag: false,
                showImg: '',
                showCoverImg: false,
                uploadList: [],
                api: action,
                fileServer: sever,
                uploadServer: upload,
                actionUrl: upload + action,
                compressServer: vm.config && vm.config.compressServer ? vm.config.compressServer : null,
                maxCompressedSize: vm.config && vm.config.maxCompressedSize ? vm.config.maxCompressedSize : null,
                targetImgIndex: null,
                columns: [{
                    title: '图片名称',
                    key: 'name',
                    ellipsis: true
                }, {
                    title: '压缩前',
                    maxWidth: 105,
                    render: (h, params) => {
                        let v = params.row.size;
                        if (null != params.row.size) {
                            v = vm.getFileSize(v)
                        }
                        return h('span', {
                            class: {sizeCompare: true},
                            on: {
                                click: () => {
                                    vm.handleView({
                                        url: vm.compressList[params.index].originUrl
                                    })
                                }
                            }
                        }, v);
                    }
                }, {
                    title: '压缩后',
                    maxWidth: 105,
                    render: (h, params) => {
                        let v = params.row.compress[0]['fileSize'];
                        if (null != v) {
                            v = vm.getFileSize(v)
                        }
                        return h('span', {
                            class: {sizeCompare: true},
                            on: {
                                click: () => {
                                    vm.handleView({
                                        url: vm.compressList[params.index].url
                                    })
                                }
                            }
                        }, v);
                    }
                }]
            };
        },
        computed: {
            compressing() {
                const vm = this;
                let flag = false;
                vm.uploadList.map(item => {
                    if (item.compressing) {
                        flag = true;
                    }
                });
                return flag;
            },
            compressList() {
                const vm = this;
                let list = [];
                vm.uploadList.map(item => {
                    if (item.compressed) {
                        list.push(item);
                    }
                });
                return list;
            }
        },
        components: {},
        methods: {
            getFileSize(fileByte) {
                let fileSizeByte = fileByte,
                    fileSizeMsg = '';
                if(fileSizeByte < 1048576)
                    fileSizeMsg = (fileSizeByte / 1024).toFixed(2) + 'KB';
                else if(fileSizeByte === 1048576)
                    fileSizeMsg = '1MB';
                else if(fileSizeByte > 1048576 && fileSizeByte < 1073741824)
                    fileSizeMsg = (fileSizeByte / (1024 * 1024)).toFixed(2) + 'MB';
                else if(fileSizeByte > 1048576 && fileSizeByte === 1073741824)
                    fileSizeMsg = '1GB';
                else if(fileSizeByte > 1073741824 && fileSizeByte < 1099511627776)
                    fileSizeMsg = (fileSizeByte / (1024 * 1024 * 1024)).toFixed(2) + 'GB';
                else fileSizeMsg = '文件超过1TB';
                return fileSizeMsg;
            },
            handleUploadBtnClick() {
                const vm = this;
                vm.$set(vm, 'targetImgIndex', null);
            },
            handleItemClick(index) {
                const vm = this;
                vm.$set(vm, 'targetImgIndex', index);
                vm.$refs.upload.handleClick();
            },
            alertError(msg) {
                const vm = this;
                if(vm.$error){
                    vm.$error(msg);
                }else{
                    vm.$Message.error(msg);
                }
            },
            handleRemove(file, index) {
                const vm = this,
                    content = '确定删除当前所选图片';
                vm.$confirm(content, () => {
                    vm.remove(file, index);
                });
            },
            remove(file, index, emit = true) {
                const vm = this,
                    fileList = vm.$refs.upload.fileList;
                if(fileList && fileList.length){
                    vm.$refs.upload.fileList.splice(fileList.indexOf(file), 1);
                    vm.uploadList = vm.$refs.upload.fileList;
                    if(emit){
                        vm.$nextTick(() => {
                            vm.$emit('change', vm.$refs.upload.fileList);
                        });
                    }
                }
            },
            handleView(item) {
                const vm = this;
                vm.$set(vm, 'showImg', item.url);
                vm.$set(vm, 'showCoverImg', true);
            },
            handleBeforeUpload(file) {
                const vm = this,
                    loadImg = function(file, vm){
                        return new Promise((resolve, reject) => {
                            let reader = new FileReader();
                            reader.readAsDataURL(file);
                            reader.onload = function(loaded){
                                let img = new Image();
                                img.onload = function(){
                                    const width = img.width,
                                        height = img.height;
                                    /* 限制宽高 */
                                    if(null != vm.config.width && null != vm.config.height){
                                        if (width !== Number(vm.config.width) || height !== Number(vm.config.height)){
                                            vm.alertError(`请上传宽高为${vm.config.width}*${vm.config.height}的图片`);
                                            reject();
                                        }
                                    }else{
                                        /* 限制宽高比例 */
                                        if(vm.config.ratio.indexOf('*') !== -1){
                                            const lens = vm.config.ratio.split('*'),
                                                limitWidth = Number(lens[0]),
                                                limitHeight = Number(lens[1]);
                                            if(0 !== limitWidth && 0 !== limitHeight){
                                                const limitRatio = limitWidth / limitHeight;
                                                if(limitRatio !== width / height){
                                                    vm.alertError(`请上传宽高比例为${limitWidth}*${limitHeight}的图片`);
                                                    reject();
                                                }
                                            }
                                        }
                                    }
                                    resolve();
                                };
                                img.onerror = reject;
                                img.src = loaded.target['result'];
                            };
                            reader.onerror = reject;
                        });
                    };
                if(vm.uploadList.length > 0){
                    if(vm.maxCount === 1){
                        vm.$refs.upload.fileList = [];
                        vm.emitChange();
                    }else if(null != vm.targetImgIndex) {
                        vm.remove(vm.$refs.upload.fileList[vm.targetImgIndex], null);
                    }
                }
                vm.$set(vm, 'uploadList', vm.$refs.upload.fileList);
                const check = vm.uploadList.length < vm.maxCount;
                if(!check){
                    vm.alertError(`最多上传${vm.maxCount}张图片！`);
                }
                if(check && vm.config && ((null != vm.config.width && null != vm.config.height) || null != vm.config.ratio)){
                    return loadImg(file, vm);
                }
                return check;
            },
            handleSuccess(res, file){
                const vm = this;
                if(res['ret'] && res['ret']['retCode'].toString() === '0'){
                    const name = res.data[0]['fileName'],
                        path = res.data[0]['filePath'];
                    file.url = vm.fileServer + path;
                    file.name = name;
                    file.path = path;
                    /* 压缩 */
                    if(vm.compressSize && vm.compressSize * 1024 < file.size){
                        file.compressing = true;
                        vm.$api.post(vm.compressServer, {
                            fbId: vm.fbId,                  // bussinessID
                            creator: vm.config.creator,     // creator
                            filePaths: [file.path]          // 需要压缩的图片数组
                        }, (response) => {
                            if(response['ret']['retCode'].toString() === '0'){
                                const filePath = response.data[0]['filePath'],
                                    fileSize = response.data[0]['fileSize'];
                                file.originUrl = file.url;
                                file.url = vm.fileServer + '/' + filePath;
                                file.compress = response.data;
                                file.compressing = false;
                                file.compressed = true;
                                if(fileSize > vm.maxCompressedSize * 1024) {
                                    vm.alertError(`图片压缩后大小是${vm.getFileSize(fileSize)}, 超过最大限值${vm.getFileSize(vm.maxCompressedSize * 1024)}.`);
                                    vm.remove(file);
                                }
                                vm.emitChange();
                            }else{
                                vm.alertError(response['ret']['retMsg']);
                                vm.remove(file);
                            }
                        }, () => {
                            vm.alertError('压缩失败');
                            vm.remove(file);
                        }, {timeout: 0});

                    }else{
                        vm.emitChange();
                    }
                }else{
                    const fileList = vm.$refs.upload.fileList;
                    if(-1 !== fileList.indexOf(file)){
                        vm.$refs.upload.fileList.splice(fileList.indexOf(file), 1);
                        vm.emitChange();
                    }
                    if(res['ret']){
                        vm.alertError(res['ret']['retMsg']);
                    }
                }
            },
            emitChange() {
                const vm = this;
                vm.uploadList = JSON.parse(JSON.stringify(vm.$refs.upload.fileList));
                vm.$nextTick(() => {
                    vm.$emit('change', vm.$refs.upload.fileList);
                });
            },
            handleFormatError() {
                const vm = this;
                vm.alertError(`文件格式不正确， 请选择 jpg 或 png.`);
            },
            handleMaxSize() {
                const vm = this;
                vm.alertError(`图片大小超过最大限值${vm.getFileSize(vm.maxSize * 1024)}.`);
            },
            dragstart($event, index) {
                const vm = this;
                if(vm.maxCount <= 1) return ;
                vm.$set(vm, 'dragIndex', index);
                vm.$set(vm, 'dragFlag', true);
            },
            dragover($event, indexOver) {
                const vm = this;
                if(vm.maxCount <= 1) return ;
                const mouseX = $event.clientX + window.scrollX,
                    elX = vm.getLeft($event.target),
                    elWidth = $event.target.offsetWidth;
                let indexInsert = null;
                if(vm.dragIndex < indexOver){
                    if(mouseX - elX > elWidth / 2){
                        indexInsert = indexOver;
                    }else{
                        indexInsert = indexOver - 1;
                    }
                    vm.changeIndex(vm.dragIndex, indexInsert);
                }else if(vm.dragIndex > indexOver){
                    if(mouseX - elX > elWidth / 2){
                        indexInsert = indexOver + 1;
                    }else{
                        indexInsert = indexOver;
                    }
                    vm.changeIndex(vm.dragIndex, indexInsert);
                }
            },
            dragend() {
                const vm = this;
                if (vm.maxCount <= 1) return ;
                vm.$set(vm, 'dragFlag', false);
            },
            getLeft(e) {
                const vm = this;
                let offset = e.offsetLeft;
                if(e.offsetParent != null) offset += vm.getLeft(e.offsetParent);
                return offset;
            },
            changeIndex(from, to) {
                const vm = this;
                let uploadList = vm.uploadList;
                let file = uploadList.splice(from, 1)[0];
                uploadList.splice(to, 0, file);
                vm.$set(vm, 'uploadList', uploadList);
                vm.$set(vm, 'dragIndex', to);
                vm.$emit('change', uploadList);
            },
            dragActive(index) {
                const vm = this;
                return vm.dragFlag && index === vm.dragIndex;
            },
            getUploadList() {
                const vm = this;
                return vm.uploadList;
            },
            setDefaultList(urls) {
                const vm = this,
                    defaultList = [];
                if(!urls || 0 === urls.length) return ;
                for(let i in urls){
                    if(urls.hasOwnProperty(i)){
                        defaultList.push({
                            url: urls[i].indexOf('http') === -1 ? vm.fileServer + urls[i] : urls[i],
                            name: i,
                            path: urls[i]
                        });
                    }
                }
                vm.$set(vm, 'defaultList', defaultList);
                vm.$nextTick(() => {
                    vm.uploadList = vm.$refs.upload.fileList;
                });
            }
        },
        created() {},
        mounted() {
            const vm = this;
            if(vm.$refs.upload){
                vm.uploadList = vm.$refs.upload.fileList;
            }
        }
    };
    export default UploadComponent;
</script>
