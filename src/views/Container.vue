<template>
    <div class="route-inside">
        <keep-alive>
            <router-view v-if="$route.meta.keepAlive" :key="$route.fullPath"></router-view>
        </keep-alive>
        <router-view v-if="!$route.meta.keepAlive" :key="$route.fullPath"></router-view>
    </div>
</template>
<style lang="scss" scoped> 
    .fl-content{
        background-color: #ffffff;
        min-height:100%;
    }
</style>

