<script setup>
import { storeToRefs } from "pinia";
import {
  Popover,
  PopoverButton,
  PopoverGroup,
  PopoverPanel,
} from "@headlessui/vue";
import {
  TransitionRoot,
  TransitionChild,
  Dialog,
  DialogPanel,
  DialogTitle,
} from "@headlessui/vue";

const config = useRuntimeConfig();
const apiUrl = config.public.apiUrl;

function handleHomeButton() {
  navigateTo({ path: "/" });
}

const userStore = useUserStore();
const { user, isLoggedIn } = storeToRefs(userStore);

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
    } else {
      error.value = !error.value;
      console.error("Login failed:", errorData);
    }
  } catch (error) {
    console.error("Network error:", error);
  }
}

async function logout() {
  try {
    const response = await fetch(`${apiUrl}/api/auth/logout`, {
      method: "POST",
      credentials: "include",
    });

    if (response.ok) {
      const userStore = useUserStore();

      userStore.clearUser();

      loginFormValues.value.username = null;
      loginFormValues.value.password = null;
    } else {
      console.error("Logout failed");
    }
  } catch (error) {
    console.error("Network error:", error);
  }
}

const isHidden = ref(false);
let lastScrollY = 0;
const threshold = 64;

const handleScroll = () => {
  const currentScrollY = window.scrollY;

  if (Math.abs(currentScrollY - lastScrollY) > threshold) {
    if (currentScrollY > lastScrollY) {
      isHidden.value = true;
    } else {
      isHidden.value = false;
    }
    lastScrollY = currentScrollY;
  }
};

onMounted(() => {
  window.addEventListener("scroll", handleScroll);
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});
</script>

<template>
  <header
    class="sticky top-0 z-40 flex w-full items-center justify-between p-4 py-8"
  >
    <nav
      class="flex w-[56px] items-center rounded-full bg-primary p-1 drop-shadow-xl lg:w-fit"
    >
      <div class="mr-2 flex rounded-full bg-primary-light p-3 lg:flex-1">
        <a href="#" class="-m-1.5 p-1.5" @click.prevent="handleHomeButton()">
          <span class="sr-only">Your Company</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            class="size-[24px] text-primary-dark lg:size-[34px]"
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
      <div class="hidden w-full lg:block" id="navbar-default">
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
      <PopoverGroup class="flex justify-end">
        <Popover class="relative">
          <PopoverButton
            class="group flex items-center rounded-full bg-primary p-1 leading-6 text-gray-900 ring-0 focus-visible:outline-none"
          >
            <div
              class="mr-1 transform rounded-full bg-primary-light p-1 transition-all delay-200 lg:mr-2 lg:p-2 lg:group-hover:hidden"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="0.6"
                stroke="currentColor"
                class="size-10 text-primary-dark"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                />
              </svg>
            </div>
            <template v-if="!isLoggedIn">
              <span
                class="hidden transform rounded-full bg-primary-dark px-12 py-3 text-white transition-all ease-out lg:block lg:py-4 lg:group-hover:px-20"
                >登入</span
              >
              <!-- Mobile login button -->
              <NuxtLink
                to="/session"
                class="block transform rounded-full bg-primary-dark px-12 py-3 text-white transition-all ease-out lg:hidden lg:py-4 lg:group-hover:px-20"
                >登入</NuxtLink
              >
            </template>
            <span
              v-else
              class="transform rounded-full bg-primary-dark px-12 py-4 text-white transition-all ease-out lg:group-hover:px-20"
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
                      class="focus:shadow-outline mb-3 w-full appearance-none rounded px-3 py-2 leading-tight focus:border-primary focus:outline-none focus:ring-primary"
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
                      class="focus:shadow-outline mb-3 w-full appearance-none rounded px-3 py-2 leading-tight focus:border-primary focus:outline-none focus:ring-primary"
                      id="password"
                      type="password"
                      placeholder="******************"
                    />
                    <p v-if="error" class="text-xs italic text-red-500">
                      請檢查帳號或密碼
                    </p>
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
                  <ul class="mb-6 space-y-2">
                    <li class="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        class="me-2 size-5"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
                        />
                      </svg>
                      <p>最新消息</p>
                    </li>
                    <li class="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        class="me-2 size-5"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z"
                        />
                      </svg>
                      <p>支付管理</p>
                    </li>
                    <li class="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        class="me-2 size-5"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Zm6-10.125a1.875 1.875 0 1 1-3.75 0 1.875 1.875 0 0 1 3.75 0Zm1.294 6.336a6.721 6.721 0 0 1-3.17.789 6.721 6.721 0 0 1-3.168-.789 3.376 3.376 0 0 1 6.338 0Z"
                        />
                      </svg>
                      <p>會員情報</p>
                    </li>
                    <li class="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        class="me-2 size-5"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z"
                        />
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                        />
                      </svg>
                      <p>設定</p>
                    </li>
                  </ul>
                  <button
                    @click="logout"
                    class="focus:shadow-outline rounded bg-primary-dark px-4 py-2 font-bold text-white hover:bg-gray-700 focus:outline-none"
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

    <!-- Bottom navigation -->
    <nav
      class="fixed bottom-4 left-4 z-20 h-16 w-[calc(100%-32px)] rounded-full bg-white drop-shadow-xl transition-all duration-300 lg:hidden"
      :class="
        isHidden ? '-translate-y-4 opacity-0' : 'translate-y-0 opacity-100'
      "
    >
      <div class="mx-auto grid h-full max-w-lg grid-cols-4">
        <button
          type="button"
          class="inline-flex flex-col items-center justify-center px-5"
          @click.prevent="handleHomeButton()"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="mb-1 size-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
            />
          </svg>
          <span class="text-xs opacity-75">搜尋</span>
        </button>
        <NuxtLink
          to="/collect"
          class="inline-flex flex-col items-center justify-center px-5"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="mb-1 size-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
            />
          </svg>
          <span class="text-xs opacity-75">收藏</span>
        </NuxtLink>
        <button
          type="button"
          class="inline-flex flex-col items-center justify-center px-5"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="mb-1 size-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
          </svg>
          <span class="text-xs opacity-75">預約</span>
        </button>
        <button
          type="button"
          class="inline-flex flex-col items-center justify-center px-5"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="mb-1 size-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
            />
          </svg>
          <span class="text-xs opacity-75">關於我</span>
        </button>
      </div>
    </nav>
  </header>
</template>
