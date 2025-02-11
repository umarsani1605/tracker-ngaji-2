<script setup>
import AppMenu from './AppMenu.vue';
</script>

<template>
    <div class="layout-sidebar !top-0 !left-0 py-8 flex flex-col !h-dvh border border-r-slate-200 rounded-none">
        <router-link to="/" class="layout-topbar-logo !gap-4 mx-auto mb-12">
            <img src="/logo.png" alt="logo" class="h-16" />
        </router-link>
        <div class="font-bold ml-4">Menu Admin</div>
        <app-menu></app-menu>
    </div>
</template>

<style lang="scss" scoped></style>
