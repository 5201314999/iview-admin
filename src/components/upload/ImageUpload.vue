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
						<div class="cover-item view" @click.stop="handleView(item)"></div>
						<div class="cover-item delete" @click.stop="handleRemove(item,index)"></div>
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
		        style="display: inline-block;width120px;box-sizing:border-box;">
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
		
		<Modal v-model="showCoverImg" class-name="modal_cover wi-modal-custom" footer-hide>
			<img :src="imgShow" v-if="showCoverImg" style="width: 100%" :onerror="errorImg">
			<Row slot="footer"></Row>
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
            const vm = this,
                upload = vm.config && vm.config.uploadServer ? vm.config.uploadServer : vm.G.files.server.upload,
                server = vm.config && vm.config.fileServer ? vm.config.fileServer : vm.G.files.server.download,
                action = '/upload/normal/batch-file';
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
                fileServer: server,
                uploadServer: upload,
                actionUrl: upload + action,
                compressServer: this.config && this.config.compressServer ? this.config.compressServer : null,
                maxCompressedSize: this.config && this.config.maxCompressedSize ? this.config.maxCompressedSize : null,
                
                targetImgIndex: null,
                dragable: this.config && this.config.dragable ? true : false,
                
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
                ]
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
                                    file.originPath = file.path;
                                    file.url = this.fileServer + '/' + res.data[0].filePath;
                                    file.path = res.data[0].filePath;
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
                if (this.maxCount <= 1 || !this.dragable) {
                    return;
                }
                this.dragIndex = index;
                this.flag_drag = true;
            },
            dragover($event, indexOver) {
                if (this.maxCount <= 1 || !this.dragable) {
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
                if (this.maxCount <= 1 || !this.dragable) {
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