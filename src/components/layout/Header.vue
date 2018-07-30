<template>
    <div class="layout-header">
        <div class="header">
            <icon type="android-menu" class="header-trigger" @click="collapsedMenu"></icon>
            <div class="header-nav right">
                <span class="nav-item"><icon type="android-person"></icon>{{ name }}</span>
                <span class="nav-item" @click="logoutUser">
                    <icon type="power"></icon>退出登录
                </span>
            </div>
        </div>
    </div>
</template>

<script>

    const HeaderComponent = {
        mounted() {
            let vm = this;
            vm.setTitle();
            vm.getUserInfo();
            vm.$on('get-user-success', function(){
                vm.$set(vm, 'name', vm.G.user.name);
                let menu = [
                        {
                            "resid": 1095,
                            "resurl": "#",
                            "resparam": "#",
                            "resname": "任务分析",
                            "resinfo": "任务分析",
                            "parentid": 0,
                            "istitle": 1,
                            "programid": 126,
                            "permission": null,
                            "create_date": "2018-03-27 13:43:46.0",
                            "sort": 1,
                            "icon": "fa fa-bar-chart-o",
                            "listChildren": [
                                {
                                    "resid": 1134,
                                    "resurl": "/task-analysis/total-count-statistics|/task-analysis/time-interval-count-statistics|/task-analysis/task-list|/task-analysis/task|/task-analysis/task/*/time-interval-count-statistics|/task-analysis/task/*/old-version-statistics|/task-analysis/task/*/model-statistics|/task-analysis/task/*/province-top10-statistics",
                                    "resparam": "/view/taskAnalysis/taskAnalysis.html",
                                    "resname": "任务分析",
                                    "resinfo": "任务分析",
                                    "parentid": 1095,
                                    "istitle": 1,
                                    "programid": 126,
                                    "permission": "11:analysis:manager",
                                    "create_date": "2018-04-25 19:09:10.0",
                                    "sort": 1,
                                    "icon": "icon-add",
                                    "listChildren": [ ]
                                }
                            ]
                        },
                        {
                            "resid": 1202,
                            "resurl": "#",
                            "resparam": "#",
                            "resname": "应用库管理",
                            "resinfo": "应用OTA-应用库管理",
                            "parentid": 0,
                            "istitle": 1,
                            "programid": 126,
                            "permission": null,
                            "create_date": "2018-07-05 15:49:23.0",
                            "sort": 1,
                            "icon": "fa fa-suitcase",
                            "listChildren": [
                                {
                                    "resid": 1203,
                                    "resurl": "#",
                                    "resparam": "/view/applyLibrary/applyLibraryList.html",
                                    "resname": "应用列表",
                                    "resinfo": "应用列表",
                                    "parentid": 1202,
                                    "istitle": 1,
                                    "programid": 126,
                                    "permission": "11:app:manager",
                                    "create_date": "2018-07-05 15:50:23.0",
                                    "sort": 1,
                                    "icon": "menu_icon_datadeal",
                                    "listChildren": [ ]
                                }
                            ]
                        },
                        {
                            "resid": 1096,
                            "resurl": "#",
                            "resparam": "#",
                            "resname": "任务管理",
                            "resinfo": "正式任务和测试任务的管理",
                            "parentid": 0,
                            "istitle": 1,
                            "programid": 126,
                            "permission": null,
                            "create_date": "2018-03-27 13:46:06.0",
                            "sort": 2,
                            "icon": "fa fa-folder",
                            "listChildren": [
                                {
                                    "resid": 1169,
                                    "resurl": "#",
                                    "resparam": "/view/taskManage/official_taskList.html",
                                    "resname": "正式任务管理",
                                    "resinfo": "应用OTA-正式任务管理",
                                    "parentid": 1096,
                                    "istitle": 1,
                                    "programid": 126,
                                    "permission": "11:task:manager",
                                    "create_date": "2018-07-05 10:52:21.0",
                                    "sort": 1,
                                    "icon": "menu_icon_datadeal",
                                    "listChildren": [ ]
                                },
                                {
                                    "resid": 1098,
                                    "resurl": "#",
                                    "resparam": "/view/taskManage/test_taskList.html",
                                    "resname": "测试任务管理",
                                    "resinfo": "应用OTA-测试任务管理",
                                    "parentid": 1096,
                                    "istitle": 1,
                                    "programid": 126,
                                    "permission": "11:test:manager",
                                    "create_date": "2018-03-27 13:54:53.0",
                                    "sort": 2,
                                    "icon": "menu_icon_datadeal",
                                    "listChildren": [ ]
                                },
                                {
                                    "resid": 1099,
                                    "resurl": "#",
                                    "resparam": "/view/taskManage/official_task_delete_list.html",
                                    "resname": "已删除正式任务",
                                    "resinfo": "应用OTA-已删除正式任务",
                                    "parentid": 1096,
                                    "istitle": 1,
                                    "programid": 126,
                                    "permission": "11:task:manager",
                                    "create_date": "2018-03-27 13:56:26.0",
                                    "sort": 3,
                                    "icon": "menu_icon_datadeal",
                                    "listChildren": [ ]
                                },
                                {
                                    "resid": 1100,
                                    "resurl": "#",
                                    "resparam": "/view/taskManage/test_task_del_list.html",
                                    "resname": "已删除测试任务",
                                    "resinfo": "应用OTA-已删除测试任务",
                                    "parentid": 1096,
                                    "istitle": 1,
                                    "programid": 126,
                                    "permission": "11:tesk:manager",
                                    "create_date": "2018-03-27 13:57:29.0",
                                    "sort": 4,
                                    "icon": "menu_icon_datadeal",
                                    "listChildren": [ ]
                                }
                            ]
                        },
                        {
                            "resid": 1103,
                            "resurl": "#",
                            "resparam": "#",
                            "resname": "基础设置",
                            "resinfo": "基础设置",
                            "parentid": 0,
                            "istitle": 1,
                            "programid": 126,
                            "permission": null,
                            "create_date": "2018-03-27 14:02:14.0",
                            "sort": 4,
                            "icon": "fa fa fa-gear",
                            "listChildren": [
                                {
                                    "resid": 1104,
                                    "resurl": "#",
                                    "resparam": "/view/basicSettings/BlackList.html",
                                    "resname": "全局黑名单",
                                    "resinfo": "应用OTA-全局黑名单",
                                    "parentid": 1103,
                                    "istitle": 1,
                                    "programid": 126,
                                    "permission": "11:black:manager",
                                    "create_date": "2018-03-27 14:03:55.0",
                                    "sort": 1,
                                    "icon": "menu_icon_datadeal",
                                    "listChildren": [ ]
                                },
                                {
                                    "resid": 1105,
                                    "resurl": "#",
                                    "resparam": "/view/basicSettings/ChannelList.html",
                                    "resname": "渠道管理",
                                    "resinfo": "渠道管理",
                                    "parentid": 1103,
                                    "istitle": 1,
                                    "programid": 126,
                                    "permission": "11:channel:manager",
                                    "create_date": "2018-03-27 14:05:32.0",
                                    "sort": 2,
                                    "icon": "menu_icon_datadeal",
                                    "listChildren": [ ]
                                },
                                {
                                    "resid": 1114,
                                    "resurl": "#",
                                    "resparam": "/view/basicSettings/userGroupList.html",
                                    "resname": "用户组管理",
                                    "resinfo": "用户组管理",
                                    "parentid": 1103,
                                    "istitle": 1,
                                    "programid": 126,
                                    "permission": "11:userGroup:manager",
                                    "create_date": "2018-04-19 16:46:16.0",
                                    "sort": 3,
                                    "icon": "menu_icon_datadeal",
                                    "listChildren": [ ]
                                }
                            ]
                        },
                        {
                            "resid": 1115,
                            "resurl": "#",
                            "resparam": "#",
                            "resname": "操作日志",
                            "resinfo": "应用OTA操作日志",
                            "parentid": 0,
                            "istitle": 1,
                            "programid": 126,
                            "permission": null,
                            "create_date": "2018-04-19 17:21:45.0",
                            "sort": 6,
                            "icon": "fa fa-edit",
                            "listChildren": [
                                {
                                    "resid": 1116,
                                    "resurl": "#",
                                    "resparam": "https://dev-web-services.tvflnet.com/logRecord/view/operationLog.html?projectId=11",
                                    "resname": "操作日志",
                                    "resinfo": "应用OTA操作日志",
                                    "parentid": 1115,
                                    "istitle": 1,
                                    "programid": 126,
                                    "permission": null,
                                    "create_date": "2018-04-19 17:55:24.0",
                                    "sort": 1,
                                    "icon": null,
                                    "listChildren": [ ]
                                }
                            ]
                        }
                    ],
                    permission = [
                        "11:test:manager",
                        "11:task:manager",
                        "11:tesk:manager",
                        "11:black:manager",
                        "11:channel:manager",
                        "11:userGroup:manager",
                        "11:analysis:manager",
                        "11:task:manager",
                        "11:task:manager:add",
                        "11:task:manager:update",
                        "11:task:manager:delete",
                        "11:task:manager:list",
                        "11:test:manager:add",
                        "11:test:manager:update",
                        "11:test:manager:delete",
                        "11:test:manager:list",
                        "11:task:manager:list",
                        "11:tesk:manager:list",
                        "11:black:manager:add",
                        "11:black:manager:delete",
                        "11:black:manager:list",
                        "11:channel:manager:add",
                        "11:channel:manager:update",
                        "11:channel:manager:delete",
                        "11:channel:manager:list",
                        "11:userGroup:manager:add",
                        "11:userGroup:manager:update",
                        "11:userGroup:manager:delete",
                        "11:userGroup:manager:list",
                        "11:app:manager",
                        "11:app:manager:add",
                        "11:app:manager:update",
                        "11:app:manager:delete",
                        "11:app:manager:list",
                        "11:app:manager:upload",
                        "11:analysis:manager:list"
                    ];
                let menus = vm.parseMenu(menu);
                vm.$set(vm.G.menu, 'items', menus);
            });
        },
        methods: {
            collapsedMenu() {
                let vm = this;
                vm.G.menu.collapsed = !vm.G.menu.collapsed;
                vm.$emit('collapsed');
            },
            logoutUser() {
                this.logout();
            },
            parseMenu(menu) {
                let vm = this, temp = [], length = menu.length,
                    getChildren = function(data){
                        let res = [], len = data.length, i = 0;
                        if(len > 0){
                            for(; i < len; i++){
                                let cur = data[i],
                                    children = cur['listChildren'],
                                    item = {
                                        title: cur['resname'],
                                        name: vm.$unique()
                                    };
                                if(children && children.length > 0){
                                    item.children = getChildren(children);
                                }else{
                                    item.path = cur['resparam'];
                                }
                                res.push(item);
                            }
                        }
                        return res;
                    };
                for(let i = 0; i < length; i++){
                    let cur = menu[i],
                        children = cur['listChildren'],
                        item = {
                            title: cur['resname'],
                            icon: cur['icon'],
                            name: vm.$unique(),
                            children: []
                        };
                    item.children = getChildren(children);
                    temp.push(item);
                }
                return temp;
            }
        },
        data() {
            return {name: ''}
        }
    };

    export default HeaderComponent;

</script>
