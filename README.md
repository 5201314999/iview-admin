# :star: 基础框架 :star:

* 1. [开发流程](#1-开发流程)
    * 1.1 [基础框架](#11-基础框架)
    * 1.2 [开发分支](#12-开发分支)
    * 1.3 [项目部署](#13-项目部署)
* 2. [框架基础](#2-框架基础)
    * 2.1 [目录结构](#21-目录结构)
    * 2.2 [开始使用](#22-开始使用)
    * 2.3 [常用组件](#23-常用组件)
        * 2.3.1 [Table 表格](#231-`Table` 表格)
        * 2.3.2 [Page 分页](#232-`Page` 分页)
        * 2.3.3 [Upload 上传](#233-`Upload` 上传)
        * 2.3.4 [Carousel 轮播](#234-`Carousel` 轮播)
        * 2.3.5 [Form 表单](#235-`Form` 表单)
        * 2.3.6 [Modal 弹窗](#236-`Modal` 弹窗)
        * 2.3.7 [Draggable 拖拽](#237-`Draggable` 拖拽)


## 1. 开发流程

### 1.1 基础框架

    从 [GOGS](http://gogs.tvflnet.com/flw_tv/Vue-BasicFrame.git) 拉取至本地，独立一个文件夹，每次项目开发前先更新基础框架代码

### 1.2 开发分支

    每个项目或组件下都会新增 `dev` 前缀的分支，开发人员从该分支下派生一个自己所属的仓库进行项目开发，
    开发完成后提交代码合并操作（至少每天提交一次合并请求）

### 1.3 项目部署

    项目开发环境的部署（线上测试环境），由后端人员协助部署或前端开发人员自行将代码部署至前端服务器（注意部署后的根目录指向问题）

## 2. 框架基础

    说明：该部分内容持续更新，主要更新基础框架，常用组件等内容
    通过 [GOGS](http://gogs.tvflnet.com/flw_tv/Vue-BasicFrame.git) 拉取最新基础框架代码

### 2.1 目录结构

    build：`webpack` 打包配置文件
    config：开发 / 生产环境相关变量配置文件
    src：项目源码
        common：公用类库，全局函数
        components：公用组件
        config：全局配置
        directive: 指令
        images：图片
        plugins：插件或第三方类库
        router：路由
        store：`VUEX`
        styles：样式
        views：页面

    其它说明：
    1. 路由定义：虽不用完全套用 restful 风格的原则，但尽量往这种风格上靠拢去定义路由，让路由的层次
       更明显，能从路由直接看出，直接定位到项目代码文件，方便他人找文件，解决 BUG 等
    2. 文件命名：所有 VUE 后缀文件采用帕斯卡（大驼峰）命名法，其它文件采用小驼峰命名法

### 2.2 开始使用

    说明：拉取最新代码后，进行代码基础信息配置，包含：
    1. title ( 文档标题 )
    2. menu ( 左侧菜单 )
    3. user ( 用户信息 - 无需配置，等待接口请求完成后自动赋值 )
    4. api ( 后台请求接口集合 )
    5. footer ( 底部内容 )
    
    注：`Layout` 为一合成组件，不支持单独使用头部、菜单等组件，后续会对接好用户权限等内容，开发人员本地更新基础代码，
    配置完成后，可直接进行业务代码开发 ( 另外，在业务页面开发时，任何路由的资源文件，都必须嵌套在如下所示的全局公用
    样式类名中，弹窗除外 )


    // 例1
    <div class="fl-container">
        <div class="fl-content">
            // 业务代码
            <router-view></router-view>
        </div>
    </div>

    // 例2
    <div class="fl-container">
        <router-view></router-view>
    </div>

    <div class="fl-content">
        <router-view></router-view>
    </div>



### 2.3 常用组件

    说明：主要是以 iview 框架为基础，进行定制的一系列公司内部常用的组件样式
    具体查看 iview 官网 [iview](https://www.iviewui.com/docs/guide/install)

#### 2.3.1 `Table` 表格

    说明：Table 组件外包一层 fl-table 公用样式
    1. size 采用 large 大小，设定  stripe，loading 属性 ( 三个 required 属性 )
    2. 涉及到 ID 的列，则统一宽度为 120，文字居中对齐
    3. 涉及时间的列，在渲染时，统一封一层 date 公用样式类名，宽度为 280
    4. 各列的宽度，比例等根据项目的内容需求，灵活变动


    // table
    <Row class="fl-table">
        <Table :columns="columns" :data="list" :loading="loading" size="large" stripe></Table>
    </Row>

    <script>
        export default {
            name: 'demo',
            data() {
                loading: true,
                columns: [
                    // ID
                    {
                        title: 'ID',
                        key: 'id',
                        width: 120,
                        align: 'center'
                    }
                    //time
                    {
                        title: '操作时间',
                        key: 'date',
                        width: 280,
                        sortable: true,
                        render: (h, params) => {
                            return h('div', {
                                slot: 'content',
                                class: 'date'
                            }, [
                                h('p', '创建：' + this.formatDate(new Date()) + ' ' + row.creator),
                                h('p', '更新：' + this.formatDate(new Date()) + ' ' + row.updater)
                            ]);
                        }
                    }
                ]
            }
        }
    </script>
    

#### 2.3.2 `Page` 分页

    说明：Page 组件外封一层 pagination 公用样式类名，具体如下：


    // html
    <Row class="pagination">
        <span class="pagination-total">共 {{ total }} 条记录 第 {{ pagination.pageNum }} / {{ Math.ceil(total/pagination.pageSize) }} 页</span>
        <Page :total="total" :current="pagination.pageNum" :page-size="pagination.pageSize" show-elevator show-sizer
        @on-change="setPaginationNum" @on-page-size-change="setPaginationSize"></Page>
    </Row>

    <script>
    export default {
        name: 'demo',
        data() {
            pagination: {
                pageNum: 1,
                pageSize: 20
            },
            total: 0,
            headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'}
        },
        methods: {
            getData() {
                let that = this;
                that.api.post(url, {}, function(res){
                    // do something
                }, function(err){
                    // console.log(err.ret.retMsg);
                }, {headers: that.headers});
            },
            setPaginationSize(size) {
                this.$set(this.pagination, 'pageSize', size);
            },
            setPaginationNum(num) {
                this.$set(this.pagination, 'pageNum', num);
                this.getData();
            }
        }
    }
    </script>
    

#### 2.3.3 `Upload` 上传

#### 2.3.4 `Carousel` 轮播

#### 2.3.5 `Form` 表单

#### 2.3.6 `Modal` 弹窗

#### 2.3.7 `Draggable` 拖拽



