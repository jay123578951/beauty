<script setup>
import { ref, reactive } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();

const searchData = reactive({
  store: route.query.store,
  location: route.query.location,
  dateRange: {
    start: route.query.startDate,
    end: route.query.endDate,
  },
  service: route.query.service,
});

const handleSearchDataUpdate = (date) => {
  Object.assign(searchData, toRaw(date));
};

definePageMeta({
  layout: false,
});
</script>

<template>
  <NuxtLayout name="pages">
    <template #searchBar>
      <SearchBar
        :formValue="searchData"
        @update:form-value="handleSearchDataUpdate"
      />
    </template>
    <template #content>
      <p>這裡放內容</p>
    </template>
  </NuxtLayout>
</template>
