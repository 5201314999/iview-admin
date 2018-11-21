<template>
    <iframe :src="url" id="loginLog"></iframe>
</template>
<script>
    const LoginLogsComponent = {
        data() {
            const vm = this;
            return {
                url: vm.G.domains.webservices + '/loginLog.html'
            };
        },
        created() {
            const vm = this,
                permission = vm.getUrlOrParam('permission'),
                params = [
                    'proId=' + vm.G.id.pro,
                    'soaProId=' + vm.G.id.soa,
                    'permission=' + (permission ? permission : '55:logs')
                ],
                url = vm.url + '?' + params.join('&'),
                host = window.location.hostname,
                hosts = host.split('.');
            vm.$set(vm, 'url', url);
            hosts.shift();
            document.domain = hosts.join('.');
        }
    };
    export default LoginLogsComponent;
</script>
