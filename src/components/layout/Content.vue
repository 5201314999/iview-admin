<template>
    <div class="layout-content">
        <Breadcrumb>
            <template v-for="(item, index) in breadcrumb">
                <BreadcrumbItem :to="item.path" :key="index">
                    <icon :type="item.icon" v-if="item.icon"></icon>{{ item.title }}
                </BreadcrumbItem>
            </template>
        </Breadcrumb>
        <Content><router-view></router-view></Content>
    </div>
</template>

<script>

    const ContentComponent = {
        data() {
            return {
                breadcrumb: []
            };
        },
        mounted() {
            this.getBreadcrumb();
        },
        methods: {
            getBreadcrumb() {
                let vm = this,
                    match = vm.$route.matched,
                    breadcrumb = [], i = 0,
                    icon = 'ios-home-outline';
                if(match.length <= 1){
                    breadcrumb.push({title: match[i].name, icon: icon});
                }else{
                    for(i in match){
                        if(parseInt(i.toString()) === parseInt((match.length - 1).toString())){
                            if(typeof match[i].name === 'undefined' || match[i].name === ''){
                                let last = breadcrumb.pop();
                                breadcrumb.push({title: last.title});
                            }else{
                                breadcrumb.push({title: match[i].name});
                            }
                        }else{
                            if(parseInt(i.toString()) === 0){
                                let path = match[i].path === '' ? '/' : match[i].path;
                                breadcrumb.push({path: path, title: match[i].name, icon: icon});
                            }else{
                                let temp = match[i].name
                                    ? match[i].name
                                    : (match[i].meta.name ? match[i].meta.name : '');
                                if(match[i].name !== ''){
                                    breadcrumb.push({path: match[i].path, title: temp});
                                }
                            }
                        }
                    }
                }
                vm.breadcrumb = breadcrumb;
            }
        },
        watch: {
            '$route': function(){
                this.getBreadcrumb();
            }
        }
    };

    export default ContentComponent;

</script>
