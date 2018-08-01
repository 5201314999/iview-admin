<template>
    <div class="layout has-sider">
        <layout>
            <fl-sider :collapse="collapse" @username="username = G.user.name"></fl-sider>
            <layout>
                <fl-header @collapsed="collapse = G.menu.collapsed" :username="username"></fl-header>
                <fl-content></fl-content>
                <fl-footer></fl-footer>
            </layout>
        </layout>
    </div>
</template>

<script>

    import Sider from './Sider';
    import Header from './Header';
    import Content from './Content';
    import Footer from './Footer';

    const LayoutComponent = {
        components: {
            'fl-sider': Sider,
            'fl-header': Header,
            'fl-content': Content,
            'fl-footer': Footer
        },
        data() {
            const vm = this;
            return {
                collapse: vm.G.menu.collapsed,
                username: vm.G.user.name
            }
        }
    };

    export default LayoutComponent;

</script>
