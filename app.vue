<script setup>
import { useUserStore } from "~/stores/auth";

async function checkIsLogged() {
  const response = await fetch("http://localhost:3001/api/session", {
    credentials: "include",
  });

  const userStore = useUserStore();

  if (response.ok) {
    const { user, isLoggedIn } = await response.json();

    userStore.setUser(user, isLoggedIn);
  } else {
    userStore.clearUser();
  }
}

onMounted(() => {
  checkIsLogged();
});
</script>

<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
