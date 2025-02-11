<script setup>
import { computed } from 'vue';
import { sidebarMenu } from './composables/menu';
import { useRoute } from 'vue-router';
import AppMenuItem from './AppMenuItem.vue';

const route = useRoute();
const currentRole = computed(() => route.path.split('/')[1] || 'admin');
const model = computed(() => sidebarMenu[currentRole.value]?.items || []);
</script>

<template>
    <ul class="layout-menu">
        <template v-for="(item, i) in model">
            <app-menu-item v-if="!item.separator" :item="item" :index="i" :key="i"></app-menu-item>
            <li v-if="item.separator" class="menu-separator" :key="i"></li>
        </template>
    </ul>
</template>

<style lang="scss" scoped></style>
