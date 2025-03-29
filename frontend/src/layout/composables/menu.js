export const sidebarMenu = {
    admin: {
        title: 'Menu Admin',
        items: [
            {
                items: [
                    { label: 'Dashboard', icon: 'pi pi-th-large', to: '/admin' },
                    { label: 'Daftar Penilaian', icon: 'pi pi-book', to: '/admin/daftar-penilaian' },
                    { label: 'Daftar Santri', icon: 'pi pi-users', to: '/admin/daftar-santri' },
                    { label: 'Daftar Pentashih', icon: 'pi pi-users', to: '/admin/daftar-pentashih' },
                    { label: 'Kategori Penilaian', icon: 'pi pi-star', to: '/admin/kategori-penilaian' },
                    { label: 'Subyek Penilaian', icon: 'pi pi-book', to: '/admin/subyek-penilaian' }
                ]
            }
        ]
    },
    pentashih: {
        title: 'Menu Pentashih',
        items: [
            {
                items: [
                    { label: 'Dashboard', icon: 'pi pi-th-large', to: '/pentashih' },
                    { label: 'Daftar Penilaian', icon: 'pi pi-book', to: '/pentashih/daftar-penilaian' },
                    { label: 'Daftar Santri', icon: 'pi pi-users', to: '/pentashih/daftar-santri' }
                ]
            }
        ]
    },
    santri: {
        title: 'Menu Santri',
        items: [
            {
                items: [
                    { label: 'Rekap Penilaian', icon: 'pi pi-chart-bar', to: '/santri' },
                    { label: 'Daftar Penilaian', icon: 'pi pi-book', to: '/santri/daftar-penilaian' }
                ]
            }
        ]
    }
};
