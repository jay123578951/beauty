<script setup>
import { useUserStore } from "~/stores/auth";

const userStore = useUserStore();

onMounted(async () => {
  await userStore.checkAuth();
});
</script>

<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
