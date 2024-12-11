<script setup>
import { ref } from "vue";
import { storeToRefs } from "pinia";
import {
  Popover,
  PopoverButton,
  PopoverGroup,
  PopoverPanel,
} from "@headlessui/vue";

function handleHomeButton() {
  navigateTo({ path: "/" });
}

const userStore = useUserStore();
const { user, isLoggedIn } = storeToRefs(userStore);

const loginFormValues = ref({
  username: null,
  password: null,
});

async function login() {
  try {
    const response = await fetch("http://localhost:3001/api/auth/login", {
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
    } else {
      const errorData = await response.text();

      this.error = errorData || "Something went wrong!";

      console.error("Login failed:", errorData);
    }
  } catch (error) {
    this.error = "Network error occurred";

    console.error("Network error:", error);
  }
}

async function logout() {
  try {
    const response = await fetch("http://localhost:3001/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });

    if (response.ok) {
      const userStore = useUserStore();

      userStore.clearUser();
    } else {
      console.error("Logout failed");
    }
  } catch (error) {
    console.error("Network error:", error);
  }
}
</script>

<template>
  <header
    class="sticky top-0 z-40 flex w-full items-center justify-between px-4 py-8"
  >
    <nav class="flex items-center rounded-full bg-primary p-1 drop-shadow-xl">
      <div class="mr-2 flex rounded-full bg-[#F4F1EC] p-3 lg:flex-1">
        <a href="#" class="-m-1.5 p-1.5" @click.prevent="handleHomeButton">
          <span class="sr-only">Your Company</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            class="size-[34px] text-primary-dark"
          >
            <path
              fill-rule="evenodd"
              d="M8.128 9.155a3.751 3.751 0 1 1 .713-1.321l1.136.656a.75.75 0 0 1 .222 1.104l-.006.007a.75.75 0 0 1-1.032.157 1.421 1.421 0 0 0-.113-.072l-.92-.531Zm-4.827-3.53a2.25 2.25 0 0 1 3.994 2.063.756.756 0 0 0-.122.23 2.25 2.25 0 0 1-3.872-2.293ZM13.348 8.272a5.073 5.073 0 0 0-3.428 3.57 5.08 5.08 0 0 0-.165 1.202 1.415 1.415 0 0 1-.707 1.201l-.96.554a3.751 3.751 0 1 0 .734 1.309l13.729-7.926a.75.75 0 0 0-.181-1.374l-.803-.215a5.25 5.25 0 0 0-2.894.05l-5.325 1.629Zm-9.223 7.03a2.25 2.25 0 1 0 2.25 3.897 2.25 2.25 0 0 0-2.25-3.897ZM12 12.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z"
              clip-rule="evenodd"
            />
            <path
              d="M16.372 12.615a.75.75 0 0 1 .75 0l5.43 3.135a.75.75 0 0 1-.182 1.374l-.802.215a5.25 5.25 0 0 1-2.894-.051l-5.147-1.574a.75.75 0 0 1-.156-1.367l3-1.732Z"
            />
          </svg>
        </a>
      </div>
      <div class="w-full" id="navbar-default">
        <ul class="flex gap-x-12 px-8 leading-6 text-gray-900">
          <li>
            <NuxtLink to="/recommend" class="text-gray-900 hover:text-gray-600"
              >推薦</NuxtLink
            >
          </li>
          <li>
            <NuxtLink to="/salon" class="text-gray-900 hover:text-gray-600"
              >沙龍檢索</NuxtLink
            >
          </li>
          <li>
            <NuxtLink to="/collect" class="text-gray-900 hover:text-gray-600"
              >收藏</NuxtLink
            >
          </li>
          <li>
            <NuxtLink to="/history" class="text-gray-900 hover:text-gray-600"
              >預約履歷</NuxtLink
            >
          </li>
        </ul>
      </div>
    </nav>

    <nav class="w-fit rounded-full bg-white drop-shadow-xl" aria-label="Global">
      <PopoverGroup class="hidden lg:flex lg:flex-1 lg:justify-end">
        <Popover class="relative">
          <PopoverButton
            class="flex items-center rounded-full bg-[#D0C6B6] p-1 leading-6 text-gray-900"
          >
            <div class="mr-2 rounded-full bg-primary-light p-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="0.6"
                stroke="currentColor"
                class="size-10 text-[#23262C]"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                />
              </svg>
            </div>
            <span
              v-if="!isLoggedIn"
              class="rounded-full bg-[#23262C] px-12 py-4 text-white"
              >登入</span
            >
            <span
              v-else
              class="rounded-full bg-[#23262C] px-12 py-4 text-white"
              >{{ user.username }}</span
            >
          </PopoverButton>

          <transition
            enter-active-class="transition ease-out duration-200"
            enter-from-class="opacity-0 translate-y-1"
            enter-to-class="opacity-100 translate-y-0"
            leave-active-class="transition ease-in duration-150"
            leave-from-class="opacity-100 translate-y-0"
            leave-to-class="opacity-0 translate-y-1"
          >
            <PopoverPanel
              class="absolute -right-8 right-1 top-full z-10 mt-3 w-screen max-w-xs overflow-hidden rounded-3xl bg-white shadow-lg ring-gray-900/5"
            >
              <div v-if="!isLoggedIn" class="w-full max-w-xs">
                <form class="mb-4 rounded px-8 pb-8 pt-6">
                  <div class="mb-4">
                    <label
                      class="mb-2 block text-sm font-bold text-gray-700"
                      for="username"
                    >
                      帳號
                    </label>
                    <input
                      v-model="loginFormValues.username"
                      class="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
                      id="username"
                      type="text"
                      placeholder="Username"
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
                      class="focus:shadow-outline mb-3 w-full appearance-none rounded border border-red-500 px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
                      id="password"
                      type="password"
                      placeholder="******************"
                    />
                    <p class="text-xs italic text-red-500">請輸入密碼</p>
                  </div>
                  <div class="flex items-center justify-between">
                    <button
                      @click="login"
                      class="focus:shadow-outline rounded bg-gray-800 px-4 py-2 font-bold text-white hover:bg-gray-700 focus:outline-none"
                      type="button"
                    >
                      登入
                    </button>
                    <a
                      class="inline-block align-baseline text-sm text-gray-500 hover:text-gray-800"
                      href="#"
                    >
                      忘記密碼?
                    </a>
                  </div>
                </form>
              </div>
              <div v-else class="w-full max-w-xs">
                <div class="rounded px-8 pb-8 pt-6">
                  <ul class="mb-4">
                    <li>最新消息</li>
                    <li>支付管理</li>
                    <li>會員情報</li>
                    <li>設定</li>
                  </ul>
                  <button
                    @click="logout"
                    class="focus:shadow-outline rounded bg-gray-800 px-4 py-2 font-bold text-white hover:bg-gray-700 focus:outline-none"
                    type="button"
                  >
                    登出
                  </button>
                </div>
              </div>
            </PopoverPanel>
          </transition>
        </Popover>
      </PopoverGroup>
    </nav>
  </header>
</template>
