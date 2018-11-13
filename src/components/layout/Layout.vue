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
        }
    };
    export default LayoutComponent;
</script>
