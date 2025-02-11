export const sidebarMenu = {
    admin: {
        title: 'Menu Admin',
        items: [
            {
                items: [
                    { label: 'Dashboard', icon: 'pi pi-th-large', to: '/admin' },
                    { label: 'Daftar Santri', icon: 'pi pi-users', to: '/admin/daftar-santri' },
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
                    { label: 'Daftar Santri', icon: 'pi pi-users', to: '/pentashih/daftar-santri' }
                ]
            }
        ]
    },
    santri: {
        title: 'Menu Santri',
        items: [
            {
                items: [{ label: 'Rekap Penilaian', icon: 'pi pi-chart-bar', to: '/santri' }]
            }
        ]
    }
};
