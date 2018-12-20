<template>
    <Row>
        <iframe :src="url" id="loginLog"></iframe>
        <Spin v-if="spinShow" size="large" fix></Spin>
    </Row>
</template>
<script>
    const LoginLogsComponent = {
        data() {
            return {
                spinShow: false,
                page: 'loginLog.html',
                url: process.env.WEB_SERVICES
            };
        },
        methods: {
            parseUrlParams() {
                const vm = this,
                    location = window.location,
                    hash = location.hash,
                    hashs = hash.split('?');
                hashs.shift();
                if(hashs.length > 0){
                    const parameters = hashs[0].split('&');
                    let params = {};
                    for(let i = 0; i < parameters.length; i++){
                        const item = parameters[i],
                            items = item.split('=');
                        params[items[0]] = decodeURIComponent(items[1])
                            .toString()
                            .replace(/^\{/gi, '')
                            .replace(/\}$/gi, '');
                    }
                    const mapping = vm.G.id.mapping;
                    for(let k in mapping){
                        if(mapping.hasOwnProperty(k)){
                            if(params.hasOwnProperty(mapping[k])){
                                params[mapping[k]] = vm.G.id[k];
                            }
                        }
                    }
                    let parameter = [];
                    for(let n in params){
                        if(params.hasOwnProperty(n)){
                            if(params[n].toString().indexOf('.htm') !== -1){
                                vm.$set(vm, 'page', params[n]);
                                delete params[n];
                            }else parameter.push(n.toString() + '=' + params[n]);
                        }
                    }
                    vm.$set(vm, 'url', process.env.WEB_SERVICES + '/' + vm.page + '?' + parameter.join('&'));
                }
            }
        },
        created() {
            const vm = this,
                host = window.location.hostname,
                hosts = host.split('.');
            hosts.shift();
            document.domain = hosts.join('.');
            vm.parseUrlParams();
            window.vueObj = this;
        }
    };
    export default LoginLogsComponent;
</script>
