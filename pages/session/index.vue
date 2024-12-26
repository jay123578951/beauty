<script setup>
import { storeToRefs } from "pinia";

const config = useRuntimeConfig();
const apiUrl = config.public.apiUrl;

// const userStore = useUserStore();
// const { user, isLoggedIn } = storeToRefs(userStore);

const loginFormValues = ref({
  username: null,
  password: null,
});
const error = ref(false);
async function login() {
  try {
    const response = await fetch(`${apiUrl}/api/auth/login`, {
      method: "POST",
      body: JSON.stringify({
        username: loginFormValues.value.username,
        password: loginFormValues.value.password,
      }),
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (response.ok) {
      const data = await response.json();
      const userStore = useUserStore();

      await userStore.fetchUser(data.user.uuid);
      await navigateTo("/");
    } else {
      error.value = !error.value;
      console.error("Login failed:", errorData);
    }
  } catch (error) {
    console.error("Network error:", error);
  }
}
</script>

<template>
  <section class="flex h-screen items-center justify-center bg-primary-light">
    <form class="w-full max-w-72">
      <h1 class="mb-1 text-3xl font-medium tracking-wide">登入</h1>
      <h2 class="mb-8 text-base tracking-wide text-gray-800">
        開始預約屬於你的時尚。
      </h2>
      <div class="mb-4">
        <label
          class="mb-2 block text-sm font-bold text-gray-700"
          for="username"
        >
          帳號
        </label>
        <input
          v-model="loginFormValues.username"
          class="focus:shadow-outline mb-3 w-full appearance-none rounded bg-primary-light px-4 py-2 leading-tight focus:border-primary focus:outline-none focus:ring-primary"
          id="username"
          type="text"
          placeholder=""
        />
      </div>
      <div class="mb-6">
        <label
          class="mb-2 block text-sm font-bold text-gray-700"
          for="password"
        >
          密碼
        </label>
        <input
          v-model="loginFormValues.password"
          class="focus:shadow-outline mb-3 w-full appearance-none rounded bg-primary-light px-4 py-2 leading-tight focus:border-primary focus:outline-none focus:ring-primary"
          id="password"
          type="password"
          placeholder="******************"
        />
        <p v-if="error" class="text-xs italic text-red-500">請檢查帳號或密碼</p>
      </div>
      <div>
        <button
          @click="login"
          class="focus:shadow-outline mb-3 w-full rounded-full bg-gray-800 px-4 py-3 font-bold text-white hover:bg-gray-700 focus:outline-none"
          type="button"
        >
          登入
        </button>
        <p
          class="inline-block w-full text-center align-baseline text-sm text-gray-500 hover:text-gray-800"
        >
          沒有帳號嗎？
          <a href="#" class="underline">立即加入</a>
        </p>
      </div>
    </form>
  </section>
</template>
