<template>
  <div class="">
    <div class="py-3">
        <h5>Capaian Sholat dan Wudhu</h5>
    </div>
    <div class="px-3">
        <div class="field grid mb-4">
            <label for="name3" class="col-12 mb-2 md:col-2 md:mb-0">Juz Amma</label>
            <div class="col-12 md:col-10">
                <Dropdown v-model="dropdownValue" :options="dropdownValues" optionLabel="name" placeholder="Capaian" />
            </div>
        </div>
        <div class="field grid mb-4">
            <label for="name3" class="col-12 mb-2 md:col-2 md:mb-0">Al-Mulk</label>
            <div class="col-12 md:col-10">
                <Dropdown v-model="dropdownValue" :options="dropdownValues" optionLabel="name" placeholder="Capaian" />
            </div>
        </div>
        <div class="field grid mb-4">
            <label for="name3" class="col-12 mb-2 md:col-2 md:mb-0">As-Sajdah</label>
            <div class="col-12 md:col-10">
                <Dropdown v-model="dropdownValue" :options="dropdownValues" optionLabel="name" placeholder="Capaian" />
            </div>
        </div>
        <div class="field grid mb-4">
            <label for="name3" class="col-12 mb-2 md:col-2 md:mb-0">As-Waqiah</label>
            <div class="col-12 md:col-10">
                <Dropdown v-model="dropdownValue" :options="dropdownValues" optionLabel="name" placeholder="Capaian" />
            </div>
        </div>
        <div class="field grid mb-4">
            <label for="name3" class="col-12 mb-2 md:col-2 md:mb-0">As-Rahman</label>
            <div class="col-12 md:col-10">
                <Dropdown v-model="dropdownValue" :options="dropdownValues" optionLabel="name" placeholder="Capaian" />
            </div>
        </div>
        <div class="field grid mb-4">
            <label for="name3" class="col-12 mb-2 md:col-2 md:mb-0">Yasin</label>
            <div class="col-12 md:col-10">
                <Dropdown v-model="dropdownValue" :options="dropdownValues" optionLabel="name" placeholder="Capaian" />
            </div>
        </div>
    </div>
  </div>
</template>