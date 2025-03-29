import AppLayout from '@/layout/AppLayout.vue';
import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            component: AppLayout,
            children: [
                {
                    path: '',
                    name: 'Entry Point',
                    component: () => import('@/views/EntryPoint.vue')
                },
                {
                    path: 'admin',
                    meta: {
                        roles: ['admin'],
                        requiresAuth: false
                    },
                    children: [
                        {
                            path: '',
                            component: () => import('@/views/pages/admin/Dashboard.vue')
                        },
                        {
                            path: 'daftar-santri',
                            component: () => import('@/views/pages/admin/DaftarSantri.vue')
                        },
                        {
                            path: 'kategori-penilaian',
                            component: () => import('@/views/pages/admin/KategoriPenilaian.vue')
                        },
                        {
                            path: 'subyek-penilaian',
                            component: () => import('@/views/pages/admin/SubyekPenilaian.vue')
                        },
                        {
                            path: 'daftar-pentashih',
                            name: 'DaftarPentashih',
                            component: () => import('@/views/pages/admin/DaftarPentashih.vue'),
                            meta: {
                                requiresAuth: true,
                                title: 'Daftar Pentashih',
                                roles: ['admin']
                            }
                        },
                        {
                            path: 'daftar-penilaian',
                            name: 'DaftarPenilaian',
                            component: () => import('@/views/pages/admin/DaftarPenilaian.vue'),
                            meta: {
                                title: 'Daftar Penilaian',
                                requiresAuth: true
                            }
                        }
                    ]
                },
                {
                    path: 'pentashih',
                    meta: {
                        roles: ['pentashih'],
                        requiresAuth: false
                    },
                    children: [
                        {
                            path: '',
                            component: () => import('@/views/pages/pentashih/Dashboard.vue')
                        },
                        {
                            path: 'daftar-santri',
                            component: () => import('@/views/pages/pentashih/DaftarSantri.vue')
                        }
                    ]
                },
                {
                    path: 'santri',
                    meta: {
                        roles: ['santri'],
                        requiresAuth: false
                    },
                    children: [
                        {
                            path: '',
                            component: () => import('@/views/pages/santri/Dashboard.vue')
                        }
                    ]
                }
                // {
                //     path: '/pentashih',
                //     name: 'pentashih',
                //     component: () => import('@/views/pages/Pentashih.vue'),
                //     children: [
                //         {
                //             path: '/pages/empty/alquran',
                //             component: () => import('@/views/pages/menu/AlQuran.vue')
                //         },
                //         {
                //             path: '/pages/empty/tahlil-wirid',
                //             component: () => import('@/views/pages/menu/TahlilWirid.vue')
                //         },
                //         {
                //             path: '/pages/empty/sholat-wudhu',
                //             component: () => import('@/views/pages/menu/SholatWudhu.vue')
                //         }
                //     ]
                // },
                // {
                //     path: '/raport-santri',
                //     name: 'raport-santri',
                //     component: () => import('@/views/pages/Santri.vue')
                // }
            ]
        },
        {
            path: '/auth/login',
            component: () => import('@/views/pages/auth/Login.vue')
        },
        {
            path: '/auth/register',
            component: () => import('@/views/pages/auth/Login.vue')
        },
        {
            path: '/pages/notfound',
            component: () => import('@/views/pages/NotFound.vue')
        }
    ]
});

export default router;
