<template>
    <div class="layout-header">
        <div class="header">
            <icon type="android-menu" class="header-trigger" @click="collapsedMenu"></icon>
            <div class="header-nav right">
                <Dropdown @on-click="logoutUser">
                    <a href="javascript:void(0);">
                        <img v-if="G.user && G.user.icon" :src="G.user.icon" class="header-avatar" /> {{ getUserName }}
                    </a>
                    <DropdownMenu slot="list">
                        <DropdownItem name="setting" disabled>
                            <icon type="ios-gear-outline"></icon>设置
                        </DropdownItem>
                        <DropdownItem name="exit">
                            <icon type="ios-minus-outline"></icon>退出
                        </DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </div>
            <div class="header-nav-tabs right">
                <Menu ref="menu" mode="horizontal" theme="light" :active-name="activeName">
                    <MenuItem v-for="(item,index) in headerTabs" :key="item.programname" :name="item.programname"
                              :class="{'ivu-menu-item-active':item.url && item.url.length && location.indexOf(item.url)!==-1}"
                              @click.native="navigate(item)">
                        {{item.programname}}
                    </MenuItem>
                </Menu>
            </div>
        </div>
    </div>
</template>

<script>
    import axios from 'axios';

    const HeaderComponent = {
        data(){
            return {
                headerTabs: [],
                location: "",
                activeName: "",
            };
        },
        created() {
            axios.defaults.withCredentials = true;
            this.G.proId = this.getQueryString('proId');

            const server = process.env.AUTH_SERVICES;
            if(null != this.G.proId){
                axios
                    .get(`${server}/LoginServlet?method=getProLink&proId=${this.G.proId}`)
                    .then(res=>{
                        if(res.data['ret']['retCode'].toString() === '0'){
                            if(res.data.data){
                                this.headerTabs = res.data.data.menu;

                                if(res.data.data.program){
                                    this.G.title = res.data.data.program.programname ? res.data.data.program.programname : "";
                                    this.G.logoIcon = res.data.data.program.icon;
                                }

                            }
                        }
                    });
            }
            this.location = window.location.href;
        },
        methods: {
            getQueryString(name) {
                let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
                let r = window.location.search.substr(1).match(reg);
                if (r != null) return unescape(r[2]);
                return null;
            },
            collapsedMenu() {
                const vm = this;
                vm.G.menu.collapsed = !vm.G.menu.collapsed;
                vm.$emit('collapsed');
                this.$root.$emit('resize');
            },
            logoutUser(name) {
                const vm = this;
                if(name === 'exit') vm.logout();
            },
            navigate(data){
                const vm = this;
                vm.activeName = '';
                setTimeout(()=>{
                    let activeItems = vm.$refs.menu.$el.querySelectorAll('.ivu-menu-item-active');
                    vm.$nextTick(() => {
                        activeItems.forEach(item => {
                            item.classList.remove("ivu-menu-item-active");
                        });
                    });
                    vm.headerTabs.map(item=>{
                        if(item.url && item.url.length && vm.location.indexOf(item.url) !== -1){
                            vm.activeName = item['programname'];
                        }
                    });

                    if(data.url && data.url.length){
                        window.location.href = data.url+`?proId=${this.G.proId}&soaProId=${data.soaProjectId}`;
                    }
                },100);
            }
        },
        props: {
            username: {
                type: String
            }
        },
        computed: {
            getUserName() {
                return this.username;
            }
        },
        mounted() {
            const vm = this;
            vm.setTitle();
        }
    };

    export default HeaderComponent;

</script>
<style lang="scss" scoped>
    .header-trigger{
        vertical-align: top;
    }
    .header-nav-tabs{
        display: inline-block;
        height:64px;
        margin-right: 20px;
        ul{
            height:100%;
            li.ivu-menu-item{
                height:100%;
                line-height: 64px;
            }
            &::after{
                display: none;
            }
        }
    }
</style>