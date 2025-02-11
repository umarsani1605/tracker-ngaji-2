<template>
    <div class="max-w-44 m-auto">
        <div class="px-2 py-4">
            <h1 class="text-4xl font-bold">📝 Aplikasi Ujian Oji</h1>
        </div>
        <div class="flex flex-col gap-4">
            <router-link to="/admin">
                <Button class="w-full" label="Admin" />
            </router-link>
            <router-link to="/pentashih">
                <Button class="w-full" label="Pentashih" />
            </router-link>
            <router-link to="/raport-santri">
                <Button class="w-full" label="Raport Santri" />
            </router-link>
        </div>
    </div>
</template>
