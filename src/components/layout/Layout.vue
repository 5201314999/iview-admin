<template>
    <div class="layout has-sider">
        <layout>
            <fl-sider :collapse="collapse"></fl-sider>
            <layout>
                <fl-header @collapsed="collapse = G.menu.collapsed"></fl-header>
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
            return {
                collapse: this.G.menu.collapsed
            }
        }
    };

    export default LayoutComponent;

</script>