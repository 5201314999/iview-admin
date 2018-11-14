<template>
    <Row class="layout has-sider">
        <layout>
            <wi-sider></wi-sider>
            <layout>
                <wi-header :username="username" @collapsed="collapse"></wi-header>
                <wi-content></wi-content>
                <wi-footer></wi-footer>
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
                username: vm.G.user.name
            };
        },
        created() {
            const vm = this,
                app = parseInt(vm.getUrlOrParam(vm.G.id.mapping.app)),
                pro = parseInt(vm.getUrlOrParam(vm.G.id.mapping.pro)),
                soa = parseInt(vm.getUrlOrParam(vm.G.id.mapping.soa));
            if(app && !isNaN(app)) vm.$set(vm.G.id, 'app', app);
            if(pro && !isNaN(pro)) vm.$set(vm.G.id, 'pro', pro);
            if(soa && !isNaN(soa)) vm.$set(vm.G.id, 'soa', soa);
            axios.defaults.headers = {
                'Content-Type': 'application/json;charset=utf-8',
                'App-Id': vm.G.id.app,
                'Pro-Id': vm.G.id.pro,
                'SOA-Pro-Id': vm.G.id.soa
            };
        }
    };
    export default LayoutComponent;
</script>
