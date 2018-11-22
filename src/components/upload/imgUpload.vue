<!--  -->
<template>
    <!-- drop阻止火狐默认事件 -->
    <div class="wrapper " @drop.prevent.stop :class="{dragging:flag_drag, compressed:compressList.length}">
        <div class="template-wrapper" v-for="(item,index) in uploadList" :key="index">
            <template v-if="item.status === 'finished'">
                <div v-show="!item.compressing" class="drag-item" @click="handleItemClick(index)"
                     :class="{dragActive:dragActive(index)} ">
                    <div class="img-wrapper" @dragend="dragend" @dragover.prevent="dragover($event,index)"
                         @dragstart="dragstart($event,index)" draggable>
                        <img class="drag-img" :src="item.url" :onerror="errorImg">
                    </div>
                    <div class="cover">
                        <Icon type="ios-eye-outline" @click.native.stop="handleView(item)"></Icon>
                        <Icon type="ios-trash-outline" @click.native.stop="handleRemove(item,index)"></Icon>
                    </div>
                </div>
                <div v-show="item.compressing" class="compress-wrapper">
                    <div class="compress-bar"></div>
                    <p class="txt">压缩中...</p>
                </div>
            </template>
            <template v-else>
                <Progress class="progress" v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
            </template>
        </div>
        <!-- v-if="showUpload" -->
        <Upload class="uploader" v-show="uploadList.length<maxCount" ref="upload" :show-upload-list="false"
                :default-file-list="defaultList" :multiple="multiple" type="drag" :accept="accept" :format="format"
                :max-size="maxSize" :on-exceeded-size="handleMaxSize" :on-format-error="handleFormatError"
                :before-upload="handleBeforeUpload" :on-success="handleSuccess" :action="actionUrl" :data="{fbId:fbId}"
                style="display: inline-block;width:120px;box-sizing:border-box;">
            <div class="uploadBtn" @click="handleUploadBtnClick">
                <div class="btnIcon">
                    <Icon type="ios-cloud-upload-outline" size="38"></Icon>
                </div>
                <div class="btnText">
                    <span>上传</span>
                </div>
            </div>
        </Upload>
        <span v-if="noteText&&noteText.length" class="noteText">{{noteText}}</span>


        <div class="compressList-table-wrapper">
            <Table class="compressList-table" :columns="columns" :data="compressList"
                   v-show="compressList.length"></Table>
        </div>

        <Modal v-model="showCoverImg" class-name="modal_cover">
            <img :src="imgShow" v-if="showCoverImg" style="width: 100%" :onerror="errorImg">
        </Modal>
    </div>
</template>

<script>
    "use strict";
    import errorImg_ from './errorImg.png';

    export default {
        name: "imgUpload",
        props: ["config"],
        data() {
            return {
                accept: this.config && this.config.accept ? this.config.accept : "image/jpeg,image/png",
                format: this.config && this.config.format ? this.config.format : ['jpg', 'jpeg', 'png'],

                noteText: this.config && this.config.noteText ? this.config.noteText : "",
                maxCount:
                    this.config && null != this.config.maxCount
                        ? this.config.maxCount
                        : 100,
                //允许多选
                multiple: (this.config && this.config.multiple && null != this.config.maxCount && this.config.maxCount > 1) ? true : false,
                //限制(默认限制压缩前不大于3M)
                maxSize: this.config && this.config.maxSize ? this.config.maxSize : null,
                //需要压缩的体积
                compressSize: this.config && this.config.compressSize ? this.config.compressSize : null,

                fbId: this.config && this.config.fbId ? this.config.fbId : "",

                errorImg: `this.src="${errorImg_}"`,
                defaultList: [],
                dragIndex: null,
                flag_drag: false,
                imgShow: "",
                showCoverImg: false,
                uploadList: [],
                api: "/upload/normal/batch-file",
                fileServer: this.config && this.config.fileServer ? this.config.fileServer : "",
                uploadServer: this.config && this.config.uploadServer ? this.config.uploadServer : "",
                actionUrl: this.config.uploadServer + "/upload/normal/batch-file",
                compressServer: this.config && this.config.compressServer ? this.config.compressServer : null,
                maxCompressedSize: this.config && this.config.maxCompressedSize ? this.config.maxCompressedSize : null,

                targetImgIndex: null,

                columns: [
                    {
                        title: '图片名称',
                        key: 'name',
                        ellipsis: true
                    },
                    {
                        title: '压缩前',
                        maxWidth: 105,
                        render: (h, params) => {
                            let v = params.row.size;
                            if (null != params.row.size) {
                                v = this.getFileSize(v)
                            }
                            return h("span",
                                {
                                    class: {
                                        "sizeCompare": true
                                    },
                                    on: {
                                        click: () => {
                                            this.handleView({
                                                url: this.compressList[params.index].originUrl
                                            })
                                        }
                                    }
                                },
                                v);
                        }
                    },
                    {
                        title: '压缩后',
                        maxWidth: 105,
                        render: (h, params) => {
                            let v = params.row.compress[0].fileSize;
                            if (null != v) {
                                v = this.getFileSize(v)
                            }
                            return h("span",
                                {
                                    class: {
                                        "sizeCompare": true
                                    },
                                    on: {
                                        click: () => {
                                            this.handleView({
                                                url: this.compressList[params.index].url
                                            })
                                        }
                                    }
                                },
                                v);
                        }
                    }
                ],
            };
        },
        computed: {
            compressing() {
                let flag = false;
                this.uploadList.map(item => {
                    if (item.compressing) {
                        flag = true;
                    }
                });
                return flag;
            },
            compressList() {
                let list = [];
                this.uploadList.map(item => {
                    if (item.compressed) {
                        list.push(item);
                    }
                });
                return list;
            }
        },
        components: {},
        created() {
        },
        mounted() {
            if (this.$refs.upload) {
                this.uploadList = this.$refs.upload.fileList;
            }
        },
        methods: {
            getFileSize(fileByte) {
                var fileSizeByte = fileByte;
                var fileSizeMsg = "";
                if (fileSizeByte < 1048576) fileSizeMsg = (fileSizeByte / 1024).toFixed(2) + "KB";
                else if (fileSizeByte == 1048576) fileSizeMsg = "1MB";
                else if (fileSizeByte > 1048576 && fileSizeByte < 1073741824) fileSizeMsg = (fileSizeByte / (1024 * 1024)).toFixed(2) + "MB";
                else if (fileSizeByte > 1048576 && fileSizeByte == 1073741824) fileSizeMsg = "1GB";
                else if (fileSizeByte > 1073741824 && fileSizeByte < 1099511627776) fileSizeMsg = (fileSizeByte / (1024 * 1024 * 1024)).toFixed(2) + "GB";
                else fileSizeMsg = "文件超过1TB";
                return fileSizeMsg;
            },
            handleUploadBtnClick() {
                this.targetImgIndex = null;
            },
            handleItemClick(index) {
                this.targetImgIndex = index;
                this.$refs.upload.handleClick();
            },
            alertError(msg) {
                if (this.$error) {
                    this.$error(msg);
                } else {
                    this.$Message.error(msg);
                }
            },
            handleRemove(file, index) {
                let content = "确定删除当前所选图片";

                this.$confirm(content, () => {
                    this.remove(file, index);
                });
            },
            remove(file, index, emit = true) {
                const fileList = this.$refs.upload.fileList;
                if (fileList && fileList.length) {
                    this.$refs.upload.fileList.splice(fileList.indexOf(file), 1);
                    this.uploadList = this.$refs.upload.fileList;
                    if (emit) {
                        this.$nextTick(() => {
                            this.$emit("change", this.$refs.upload.fileList);
                        });
                    }
                }
            },
            handleView(item) {
                this.imgShow = item.url;
                this.showCoverImg = true;
            },
            handleBeforeUpload(file) {
                if (this.uploadList.length > 0) {
                    if (this.maxCount === 1) {
                        this.$refs.upload.fileList = [];
                        this.emitChange();
                    } else if (null != this.targetImgIndex) {
                        this.remove(this.$refs.upload.fileList[this.targetImgIndex], null);
                    }
                }

                this.uploadList = this.$refs.upload.fileList;
                const check = this.uploadList.length < this.maxCount;

                if (!check) {
                    this.alertError(`最多上传${this.maxCount}张图片！`);
                }

                if (check && this.config && ((null != this.config.width && null != this.config.height) || null != this.config.ratio)) {
                    return loadImg(file, this);
                }

                return check;

                //读取图片方法
                function loadImg(file_img, vm) {
                    return new Promise((resolve, reject) => {
                        var reader = new FileReader();
                        reader.readAsDataURL(file_img);
                        reader.onload = function (loaded) {
                            var img = new Image();
                            img.onload = function () {
                                var width = img.width;
                                var height = img.height;
                                //限制确定宽高
                                if (null != vm.config.width && null != vm.config.height) {
                                    if (width != Number(vm.config.width) || height != Number(vm.config.height)) {
                                        vm.alertError(`请上传宽高为${vm.config.width}*${vm.config.height}的图片`);
                                        reject();
                                    }
                                } else {
                                    //限制宽高比例
                                    if (vm.config.ratio.indexOf('*') !== -1) {
                                        let lens = vm.config.ratio.split('*');
                                        let limitWidth = Number(lens[0]);
                                        let limitHeight = Number(lens[1]);
                                        if (0 !== limitWidth && 0 !== limitHeight) {
                                            let limitRatio = limitWidth / limitHeight;
                                            if (limitRatio !== width / height) {
                                                vm.alertError(`请上传宽高比例为${limitWidth}*${limitHeight}的图片`);
                                                reject();
                                            }
                                        }
                                    }
                                }
                                resolve();
                            };
                            img.onerror = reject;
                            img.src = loaded.target.result;
                        }
                        reader.onerror = reject;
                    });
                }
            },
            handleSuccess(res, file) {
                if (res.ret && "0" == res.ret.retCode) {
                    file.url = this.fileServer + res.data[0].filePath;
                    file.name = res.data[0].fileName;
                    file.path = res.data[0].filePath;

                    //压缩
                    if (this.compressSize && this.compressSize * 1024 < file.size) {
                        file.compressing = true;
                        this.$api.post(this.compressServer,
                            {
                                fbId: this.fbId, //文件路径
                                creator: this.config.creator, //创建人
                                filePaths: [file.path] //需要压缩的图片数组
                            },
                            res => {
                                if (0 == res.ret.retCode) {
                                    file.originUrl = file.url;
                                    file.url = this.fileServer + '/' + res.data[0].filePath;
                                    file.compress = res.data;
                                    file.compressing = false;
                                    file.compressed = true;

                                    if (res.data[0].fileSize > this.maxCompressedSize * 1024) {
                                        this.alertError(`图片压缩后大小是${this.getFileSize(res.data[0].fileSize)}, 超过最大限值${this.getFileSize(this.maxCompressedSize * 1024)}.`);
                                        this.remove(file);
                                    }

                                    this.emitChange();
                                } else {
                                    this.alertError(res.ret.retMsg);
                                    this.remove(file);
                                }
                            },
                            err => {
                                this.alertError("压缩失败");
                                this.remove(file);
                            },
                            {
                                timeout: 0
                            }
                        );
                    } else {
                        this.emitChange();
                    }
                } else {
                    //
                    const fileList = this.$refs.upload.fileList;
                    if (-1 !== fileList.indexOf(file)) {
                        this.$refs.upload.fileList.splice(fileList.indexOf(file), 1);
                        this.emitChange();
                    }
                    if (res.ret) {
                        this.alertError(res.ret.retMsg);
                    }
                }
            },
            emitChange() {
                this.uploadList = JSON.parse(JSON.stringify(this.$refs.upload.fileList));
                this.$nextTick(() => {
                    this.$emit("change", this.$refs.upload.fileList);
                });
            },
            handleFormatError(file) {
                this.alertError(`文件格式不正确， 请选择 jpg 或 png.`);
            },
            handleMaxSize(file) {
                this.alertError(`图片大小超过最大限值${this.getFileSize(this.maxSize * 1024)}.`);
            },
            // 拖动相关
            dragstart($event, index) {
                if (this.maxCount <= 1) {
                    return;
                }
                this.dragIndex = index;
                this.flag_drag = true;
            },
            dragover($event, indexOver) {
                if (this.maxCount <= 1) {
                    return;
                }
                let mouseX = $event.clientX + window.scrollX;
                let elX = this.getLeft($event.target);
                let elWidth = $event.target.offsetWidth;

                let indexInsert = null;
                if (this.dragIndex < indexOver) {
                    if (mouseX - elX > elWidth / 2) {
                        indexInsert = indexOver;
                    } else {
                        indexInsert = indexOver - 1;
                    }
                    this.changeIndex(this.dragIndex, indexInsert);
                } else if (this.dragIndex > indexOver) {
                    if (mouseX - elX > elWidth / 2) {
                        indexInsert = indexOver + 1;
                    } else {
                        indexInsert = indexOver;
                    }
                    this.changeIndex(this.dragIndex, indexInsert);
                }
            },
            dragend() {
                if (this.maxCount <= 1) {
                    return;
                }
                this.flag_drag = false;
            },
            getLeft(e) {
                var offset = e.offsetLeft;
                if (e.offsetParent != null) offset += this.getLeft(e.offsetParent);
                return offset;
            },
            changeIndex(from, to) {
                let uploadList = this.uploadList;
                let file = uploadList.splice(from, 1)[0];
                uploadList.splice(to, 0, file);
                this.uploadList = uploadList;
                this.dragIndex = to;
                this.$emit("change", uploadList);
            },
            dragActive(index) {
                return this.flag_drag && index === this.dragIndex;
            },
            //对外
            getUploadList() {
                return this.uploadList;
            },
            setDefaultList(urls) {
                if (!urls || 0 === urls.length) {
                    return;
                }

                let defaultList = [];
                for (let i in urls) {
                    defaultList.push({
                        url: urls[i].indexOf("http") == -1 ? this.fileServer + urls[i] : urls[i],
                        name: i,
                        path: urls[i]
                    });
                }
                this.defaultList = defaultList;

                this.$nextTick(() => {
                    this.uploadList = this.$refs.upload.fileList;
                });
            }
        }
    };
</script>


<style lang="scss">
    .modal_cover {
        .ivu-modal-footer {
            display: none !important;
        }
    }
</style>
<style lang='scss' scoped>
    @keyframes rotating {
        from {
            transform: rotate(0);
        }
        to {
            transform: rotate(360deg);
        }
    }

    @keyframes progress {
        from {
            background-position: 0
        }

        to {
            background-position: calc(100%)
        }
    }

    .wrapper {
        &.compressed {
            width: 100%;
        }
        display: inline-block;
        max-width: 100%;
        line-height: 1;
        .noteText {
            font-size: 12px;
            line-height: 1;
            color: #aaa;
            vertical-align: bottom;
            margin-bottom: 3px;
            display: inline-block;
            word-break: keep-all;
            white-space: nowrap;
        }
        box-sizing: border-box;
        padding: 10px;
        user-select: none;
        &.dragging {
            .cover {
                visibility: hidden;
            }
        }
        .loading {
            width: 120px;
            height: 120px;
            line-height: 120px;
            text-align: center;
            display: inline-block;
            // color: #2d8cf0;
            color: #bbb;
            i {
                transform-origin: center center;
                animation: rotating 0.8s linear infinite;
            }
        }
        .template-wrapper {
            display: inline-block;
            line-height: 1;
            vertical-align: top;
            width: 120px;
            height: 120px;
            box-sizing: border-box;
            margin-right: 5px;
            // border:1px solid #eee;
            .progress {
                width: 120px;
                height: 120px;
                line-height: 120px;
            }
            .compress-wrapper {
                padding-top: 57px;
                .txt {
                    text-align: center;
                    color: #999;
                }
                .compress-bar {
                    height: 10px;
                    width: 100%;
                    background: red;
                    border-radius: 100px;
                    background: linear-gradient(45deg, #2989d8 10px, #7db9e8 11px, #7db9e8 20px, #2989d8 21px);
                    background-size: 30px 100%;
                    background-repeat: repeat-x;
                    animation: progress 1.5s linear 0s infinite;
                }
            }
        }
        .compressList-table-wrapper {
            width: 100%;
            .compressList-table {
                margin-top: 15px;
                width: 100%;
            }
            /deep/ .sizeCompare {
                cursor: pointer;
                &:hover {
                    color: #1890ff;
                }
            }
            /deep/ .ivu-table-cell-ellipsis {
                line-height: 16px;
            }
        }

        .drag-item {
            position: relative;
            width: 100%;
            height: 120px;
            line-height: 1;
            overflow: hidden;
            display: inline-block;
            vertical-align: top;
            &:hover {
                border: 1px solid transparent;
                .cover {
                    display: block;
                }
            }
            .img-wrapper {
                width: 100%;
                height: 100%;
                font-size: 0;
                display: flex;
                .drag-img {
                    max-width: 100%;
                    max-height: 100%;
                    display: block;
                    margin: auto;
                }
            }

            .cover {
                display: none;
                position: absolute;
                top: -1px;
                left: -1px;
                background: rgba(0, 0, 0, 0.6);
                i {
                    color: #fff;
                    font-size: 20px;
                    cursor: pointer;
                    margin: 0 2px;
                }
            }
            &.dragActive {
                .drag-img,
                .cover {
                    visibility: hidden;
                }
            }
        }

        .uploader {
            line-height: 1;
            /deep/ .ivu-upload-drag {
                width: 120px;
                height: 120px;
                box-sizing: border-box;
            }
            .uploadBtn {
                width: 120px;
                height: 120px;
                color: #a9a9a9;
                box-sizing: border-box;
                .btnIcon {
                    height: 110px;
                    line-height: 110px;
                }
                .btnText {
                    font-size: 12px;
                    line-height: 1;
                    margin-top: -35px;
                }
            }
            .uploadBtn:hover {
                color: #2d8cf0;
            }
        }
    }
</style>
