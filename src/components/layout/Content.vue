<template>
    <div class="layout-content">
        <Breadcrumb class="layout-breadcrumb">
            <template v-for="(item, index) in breadcrumb">
                <BreadcrumbItem :to="item.path" :key="index">
                    <icon :type="item.icon" v-if="item.icon"></icon>
                    {{ item.title }}
                </BreadcrumbItem>
            </template>
        </Breadcrumb>
        <Content>
            <Row class="wi-container">
                <router-view></router-view>
            </Row>
        </Content>
    </div>
</template>
<script>
    const ContentComponent = {
        data() {
            return {
                breadcrumb: []
            }
        },
        methods: {
            getBreadcrumb() {
                const vm = this,
                    matches = vm.$route.matched,
                    breadcrumb = [],
                    icon = 'ios-home-outline';
                let i = 0;
                if(matches.length <= 1){
                    breadcrumb.push({
                        title: matches[i].name,
                        icon: icon
                    });
                }else{
                    for(i in matches){
                        if(matches.hasOwnProperty(i)){
                            const cur = matches[i],
                                name = cur.meta.name;
                            if(parseInt(i.toString()) === matches.length - 1){
                                /* last */
                                if(typeof name === 'undefined' || name === ''){
                                    const last = breadcrumb.pop();
                                    breadcrumb.push({
                                        title: last.title
                                    });
                                }else{
                                    breadcrumb.push({
                                        title: name
                                    });
                                }
                            }else{
                                if(parseInt(i.toString()) === 0){
                                    /* home */
                                    const path = cur.path === '' ? '/' : cur.path;
                                    breadcrumb.push({
                                        path: path,
                                        title: name,
                                        icon: icon
                                    });
                                }else{
                                    /* other */
                                    const temp = name ? name : (cur.meta.name ? cur.meta.name : '');
                                    if(temp !== ''){
                                        breadcrumb.push({
                                            path: cur.path,
                                            title: temp
                                        });
                                    }
                                }
                            }
                        }
                    }
                }
                vm.$set(vm, 'breadcrumb', breadcrumb);
            }
        },
        watch: {
            '$route': function() {
                const vm = this;
                vm.getBreadcrumb();
            }
        },
        mounted() {
            const vm = this;
            vm.getBreadcrumb();
        }
    };
    export default ContentComponent;
</script>
