<script setup>
import { reactive } from "vue";

const searchData = reactive({
  store: null,
  location: null,
  dateRange: {
    start: new Date(),
    end: new Date(),
  },
  service: null,
});

const handleSearchDataUpdate = (date) => {
  Object.assign(searchData, toRaw(date));
};

definePageMeta({
  layout: "main",
});
</script>

<template>
  <main>
    <section
      class="background-main flex min-h-[60vh] flex-col items-center justify-between rounded-2xl bg-orange-100 bg-cover bg-local bg-center p-4"
    >
      <div class="w-full max-w-7xl p-12">
        <h1 class="mb-3 text-6xl font-bold text-white text-opacity-[85%]">
          完美造型，隨時隨地
        </h1>
        <p class="text-2xl text-white text-opacity-[85%]">
          快速預約，輕鬆找到最適合你的髮型設計師！
        </p>
      </div>
      <div class="flex w-full max-w-7xl rounded-2xl bg-white p-3">
        <SearchBar
          :formValue="searchData"
          @update:form-value="handleSearchDataUpdate"
        />
      </div>
    </section>

    <section>
      <slot />
    </section>
  </main>
</template>

<style>
.background-main {
  background-image: url("/assets/img/indexBanner.jpg");
}
</style>
