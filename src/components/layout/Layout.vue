<template>
    <Row class="layout has-sider" :class="G.embed ? 'layout-embed' : ''">
        <layout>
            <wi-sider @username="setUsername" :collapse="collapse" :update="update" :project="project" :logo="logo" v-if="!G.embed"></wi-sider>
            <layout>
                <wi-header :username="username" @collapsed="setCollapsed" @update-logo="setLogo" v-if="!G.embed"></wi-header>
                <wi-content></wi-content>
                <wi-footer v-if="!G.embed"></wi-footer>
            </layout>
        </layout>
    </Row>
</template>
<script>
    import Sider from '@/components/layout/Sider';
    import Header from '@/components/layout/Header';
    import Content from '@/components/layout/Content';
    import Footer from '@/components/layout/Footer';
    import axios from 'axios';
    const LayoutComponent = {
        components: {
            'wi-sider': Sider,
            'wi-header': Header,
            'wi-content': Content,
            'wi-footer': Footer
        },
        data() {
            const vm = this;
            return {
                collapse: vm.G.menu.collapsed,
                username: vm.G.user.name,
                update: false,
                project: vm.G.title,
                logo: vm.G.logo
            };
        },
        methods: {
            /**
             * set username.(callback)
             * Get the global user name and send it to `Header Component`,
             * after the request finished.
             */
            setUsername() {
                const vm = this;
                vm.$set(vm, 'username', vm.G.user.name);
            },
            /**
             * collapsed.(callback)
             * If click `collapse` in `Header Component`,
             * send broadcast to `Sider Component`
             */
            setCollapsed() {
                const vm = this;
                vm.$set(vm, 'collapse', vm.G.menu.collapsed);
                if(!vm.G.menu.collapsed) vm.$set(vm, 'update', !vm.update);
            },
            setLogo() {
                const vm = this;
                vm.$set(vm, 'project', vm.G.title);
                vm.$set(vm, 'logo', vm.G.logo);
            }
        },
        created() {
            const vm = this,
                app = vm.getUrlOrParam(vm.G.id.mapping.app),
                pro = parseInt(vm.getUrlOrParam(vm.G.id.mapping.pro)),
                soa = vm.getUrlOrParam(vm.G.id.mapping.soa),
                embed = vm.getUrlOrParam('embed');
            if(app) vm.$set(vm.G.id, 'app', app);
            if(pro && !isNaN(pro)) vm.$set(vm.G.id, 'pro', pro);
            if(soa) vm.$set(vm.G.id, 'soa', soa);
            axios.defaults.headers = {
                'Content-Type': 'application/json;charset=utf-8',
                'App-Id': vm.G.id.app,
                'Pro-Id': vm.G.id.pro,
                'SOA-Pro-Id': vm.G.id.soa
            };
            const cookie = vm.getCookie(vm.G.cookie.collapse.name);
            if(cookie && vm.trim(cookie) !== 'false'){
                vm.$set(vm, 'collapse', cookie);
                vm.$set(vm.G.menu, 'collapsed', cookie);
            }
            if(typeof embed !== 'undefined' && embed !== null) vm.$set(vm.G, 'embed', embed);
        },
        watch: {
            '$route': function() {
                const vm = this;
                if(vm.G.embed){
                    vm.resetIframeHeight();
                    vm.$nextTick(() => {
                        vm.monitorIframeHeight();
                    });
                }
            }
        },
        mounted() {
            const vm = this;
            if(vm.G.embed){
                const vm = this,
                    host = window.location.hostname,
                    hosts = host.split('.');
                hosts.shift();
                document.domain = hosts.join('.');
                if(vm.G.embed){
                    vm.$nextTick(() => {
                        vm.setIframeHeight();
                    });
                }
            }
        }
    };
    export default LayoutComponent;
</script>
