<script setup>
import { TabGroup, TabList, Tab, TabPanels, TabPanel } from "@headlessui/vue";
import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/vue";
import { initCarousels } from "flowbite";

const config = useRuntimeConfig();
const apiUrl = config.public.apiUrl;
const route = useRoute();

const storeId = ref(route.params.storeId);

const lists = reactive([
  {
    id: "overview",
    name: "總攬",
  },
  {
    id: "menu",
    name: "方案",
  },
  {
    id: "designer",
    name: "設計師",
  },
  {
    id: "case",
    name: "案例",
  },
  {
    id: "comment",
    name: "評論",
  },
]);
const mobileLists = reactive([
  {
    id: "overview",
    name: "總攬",
  },
  {
    id: "designer",
    name: "設計師",
  },
  {
    id: "case",
    name: "案例",
  },
  {
    id: "comment",
    name: "評論",
  },
]);

const menus = reactive({
  data: [],
});
async function handleFetchOffers() {
  try {
    const response = await fetch(
      `${apiUrl}/api/stores/${storeId.value}/menus`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (response.ok) {
      const data = await response.json();
      menus.data = data || [];
      filteredMenus.value = [...menus.data];
    }
  } catch (error) {
    console.error("Failed to fetch stores data", error);
  }
}

const tagsName = reactive([
  {
    id: 0,
    name: "新客",
  },
  {
    id: 1,
    name: "第二次來店",
  },
  {
    id: 2,
    name: "活動",
  },
  {
    id: 3,
    name: "期間限定",
  },
]);
const filteredMenus = ref([]);
const checkedTags = reactive({
  0: false,
  1: false,
  2: false,
  3: false,
});

function handleChecked() {
  const activeTags = Object.keys(checkedTags)
    .filter((key) => checkedTags[key])
    .map(Number);

  filteredMenus.value =
    activeTags.length === 0
      ? (filteredMenus.value = [...menus.data])
      : menus.data.filter((menu) => activeTags.includes(menu.tag));
}

definePageMeta({
  layout: false,
});

onMounted(() => {
  useFlowbite(() => {
    initCarousels();
  });

  handleFetchOffers();
});
</script>

<template>
  <NuxtLayout name="store">
    <template #title>
      <h1 class="mb-2 text-xl font-medium lg:mb-4 lg:text-3xl">ALBUM 台北</h1>
      <div class="flex justify-between">
        <p class="w-full text-sm lg:w-1/3 lg:text-base">
          我們致力於創造個性化的髮型，帶給顧客耳目一新的美髮體驗。我們的造型師團隊以專業技術和創意設計，幫助每位顧客展現最自信的自己。
        </p>
        <div class="mr-4 hidden lg:block">
          <div class="m-auto h-14 w-[1px] bg-primary-dark"></div>
          <div
            class="relative bottom-5 left-2 m-auto h-6 w-[1px] rotate-45 bg-primary-dark"
          ></div>
        </div>
      </div>
    </template>
    <template #banner>
      <div class="w-full lg:mb-16">
        <div
          id="default-carousel"
          class="relative w-full"
          data-carousel="static"
        >
          <!-- Carousel wrapper -->
          <div
            class="relative h-56 overflow-hidden rounded-2xl md:h-[40vh] lg:h-[70vh]"
          >
            <!-- Item 1 -->
            <div class="hidden duration-700 ease-in-out" data-carousel-item>
              <img
                src="/img/recommend03.jpg"
                class="absolute left-1/2 top-1/2 block w-full -translate-x-1/2 -translate-y-1/2"
                alt="..."
              />
            </div>
            <!-- Item 2 -->
            <div class="hidden duration-700 ease-in-out" data-carousel-item>
              <img
                src="/img/recommend04.jpg"
                class="absolute left-1/2 top-1/2 block w-full -translate-x-1/2 -translate-y-1/2"
                alt="..."
              />
            </div>
          </div>
          <!-- Slider indicators -->
          <div
            class="absolute bottom-5 left-1/2 z-30 flex -translate-x-1/2 space-x-3 rtl:space-x-reverse"
          >
            <button
              type="button"
              class="h-3 w-3 rounded-full"
              aria-current="true"
              aria-label="Slide 1"
              data-carousel-slide-to="0"
            ></button>
            <button
              type="button"
              class="h-3 w-3 rounded-full"
              aria-current="false"
              aria-label="Slide 2"
              data-carousel-slide-to="1"
            ></button>
          </div>
          <!-- Slider controls -->
          <button
            type="button"
            class="group absolute start-0 top-0 z-30 flex h-full cursor-pointer items-center justify-center px-4 focus:outline-none"
            data-carousel-prev
          >
            <span
              class="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/30 group-hover:bg-white/50 group-focus:outline-none group-focus:ring-4 group-focus:ring-white dark:bg-gray-800/30 dark:group-hover:bg-gray-800/60 dark:group-focus:ring-gray-800/70"
            >
              <svg
                class="h-4 w-4 text-white dark:text-gray-800 rtl:rotate-180"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 6 10"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 1 1 5l4 4"
                />
              </svg>
              <span class="sr-only">Previous</span>
            </span>
          </button>
          <button
            type="button"
            class="group absolute end-0 top-0 z-30 flex h-full cursor-pointer items-center justify-center px-4 focus:outline-none"
            data-carousel-next
          >
            <span
              class="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/30 group-hover:bg-white/50 group-focus:outline-none group-focus:ring-4 group-focus:ring-white dark:bg-gray-800/30 dark:group-hover:bg-gray-800/60 dark:group-focus:ring-gray-800/70"
            >
              <svg
                class="h-4 w-4 text-white dark:text-gray-800 rtl:rotate-180"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 6 10"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="m1 9 4-4-4-4"
                />
              </svg>
              <span class="sr-only">Next</span>
            </span>
          </button>
        </div>
      </div>
    </template>
    <template #content>
      <TabGroup as="template">
        <div class="hidden flex-col justify-between lg:flex lg:flex-row">
          <div class="w-full lg:w-3/12">
            <TabList
              class="-mb-px flex flex-col divide-y divide-slate-300 border-y border-slate-300 font-medium"
            >
              <Tab
                v-for="(list, index) in lists"
                :key="index"
                v-slot="{ selected }"
                class="focus-visible:outline-none"
              >
                <div
                  class="my-3 inline-block flex w-full items-center justify-between rounded-full px-6 py-5 text-left"
                  :class="{
                    'bg-primary-dark text-white': selected,
                  }"
                >
                  {{ list.name }}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    class="size-6 text-primary-light"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M16.72 7.72a.75.75 0 0 1 1.06 0l3.75 3.75a.75.75 0 0 1 0 1.06l-3.75 3.75a.75.75 0 1 1-1.06-1.06l2.47-2.47H3a.75.75 0 0 1 0-1.5h16.19l-2.47-2.47a.75.75 0 0 1 0-1.06Z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </div>
              </Tab>
            </TabList>
          </div>
          <div class="w-full lg:w-7/12">
            <TabPanels>
              <!-- overview -->
              <TabPanel>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  coming soon.
                </p>
              </TabPanel>
              <!-- menu -->
              <TabPanel>
                <div class="items-top mb-6 flex">
                  <div class="me-6 py-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      class="size-6"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M3 6.75A.75.75 0 0 1 3.75 6h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 6.75ZM3 12a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 12Zm0 5.25a.75.75 0 0 1 .75-.75H12a.75.75 0 0 1 0 1.5H3.75a.75.75 0 0 1-.75-.75Z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </div>
                  <div>
                    <ul
                      class="scrollbar-hide relative flex w-full snap-x gap-1 overflow-x-auto scroll-smooth"
                    >
                      <li v-for="(tag, index) in tagsName" :key="index">
                        <input
                          v-model="checkedTags[index]"
                          :id="tag.id"
                          type="checkbox"
                          class="peer hidden"
                          @change="handleChecked"
                        />
                        <label
                          :for="tag.id"
                          class="mb-1 me-2 inline-flex cursor-pointer items-center justify-between rounded-full border-2 border-gray-200 bg-white px-4 py-2 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-600 peer-checked:border-primary peer-checked:bg-primary-light peer-checked:text-primary-dark"
                        >
                          <p>{{ tag.name }}</p>
                        </label>
                      </li>
                    </ul>
                  </div>
                </div>
                <ul class="space-y-4">
                  <li
                    v-for="(menu, index) in filteredMenus"
                    :key="index"
                    class="group relative flex space-x-4 rounded-3xl border border-primary-light bg-white p-3 hover:border-primary"
                  >
                    <div
                      class="relative h-56 w-full max-w-56 overflow-hidden rounded-2xl"
                    >
                      <NuxtLink
                        :to="`/salon/${storeId}/menu?menu_id=${menu.id}`"
                        target="_blank"
                        class="absolute inset-0 -bottom-2 grid place-items-center bg-[rgba(225,225,225,0.3)] opacity-0 transition-all duration-500 group-hover:bottom-0 group-hover:opacity-100"
                      >
                        <button
                          type="button"
                          class="flex items-center whitespace-nowrap rounded-full bg-primary-dark p-2 font-medium text-white hover:bg-neutral-700 focus:outline-none focus:ring-4 focus:ring-neutral-500"
                        >
                          <div class="rounded-full bg-white p-2">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                              class="size-6 text-primary-dark"
                            >
                              <path
                                fill-rule="evenodd"
                                d="M6.75 2.25A.75.75 0 0 1 7.5 3v1.5h9V3A.75.75 0 0 1 18 3v1.5h.75a3 3 0 0 1 3 3v11.25a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3V7.5a3 3 0 0 1 3-3H6V3a.75.75 0 0 1 .75-.75Zm13.5 9a1.5 1.5 0 0 0-1.5-1.5H5.25a1.5 1.5 0 0 0-1.5 1.5v7.5a1.5 1.5 0 0 0 1.5 1.5h13.5a1.5 1.5 0 0 0 1.5-1.5v-7.5Z"
                                clip-rule="evenodd"
                              />
                            </svg>
                          </div>

                          <p class="mx-4">預約這個方案</p>
                        </button>
                      </NuxtLink>
                      <img
                        :src="menu.img || '/img/hairStyle.jpg'"
                        class="block h-full w-full object-cover"
                        alt="..."
                      />
                    </div>
                    <div class="p-4">
                      <div class="mb-3 flex items-center">
                        <h3 class="text-xl font-medium">
                          {{ menu.name }}
                        </h3>
                        <p
                          class="ms-3 rounded bg-red-500 px-3 py-1 text-xs font-medium text-white"
                        >
                          {{ tagsName[menu.tag].name }}
                        </p>
                      </div>
                      <p class="mb-4 text-sm tracking-wider text-gray-700">
                        {{ menu.description }}
                      </p>
                      <div class="flex items-end justify-between">
                        <div>
                          <ul class="mb-1 flex">
                            <li
                              v-for="(tag, index) in menu.classification"
                              :key="index"
                            >
                              <span
                                class="me-1 rounded bg-red-100 px-3 py-1 text-xs font-medium text-red-400"
                                >{{ tag }}</span
                              >
                            </li>
                          </ul>
                          <ul class="flex">
                            <li
                              v-for="(tag, index) in menu.points"
                              :key="index"
                            >
                              <span
                                class="me-1 rounded bg-gray-200 px-3 py-1 text-xs font-medium text-gray-500"
                                >{{ tag }}</span
                              >
                            </li>
                          </ul>
                        </div>
                        <div>
                          <p
                            class="p-2 text-right text-2xl font-medium text-red-500"
                          >
                            ${{ menu.price }}
                          </p>
                        </div>
                      </div>
                    </div>
                  </li>
                </ul>
              </TabPanel>
              <!-- designer -->
              <TabPanel>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  coming soon.
                </p>
              </TabPanel>
              <!-- case -->
              <TabPanel>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  coming soon.
                </p>
              </TabPanel>
              <!-- comment -->
              <TabPanel>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  coming soon.
                </p>
              </TabPanel>
            </TabPanels>
          </div>
        </div>
      </TabGroup>

      <!-- Mobile -->
      <section class="lg:hidden">
        <Disclosure>
          <DisclosureButton
            class="mb-6 w-full rounded-full bg-primary-dark py-3 text-white"
          >
            我要預約
          </DisclosureButton>
          <transition
            enter-active-class="transition duration-400 ease-in-out origin-top"
            enter-from-class="transform scale-y-50 opacity-0"
            enter-to-class="transform scale-y-100 opacity-100"
            leave-active-class="transition duration-375 ease-in-out origin-top"
            leave-from-class="transform scale-y-100 opacity-100"
            leave-to-class="transform scale-y-50 opacity-0"
          >
            <DisclosurePanel>
              <div class="items-top mb-2 flex">
                <div class="me-4 py-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    class="size-6"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M3 6.75A.75.75 0 0 1 3.75 6h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 6.75ZM3 12a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 12Zm0 5.25a.75.75 0 0 1 .75-.75H12a.75.75 0 0 1 0 1.5H3.75a.75.75 0 0 1-.75-.75Z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </div>
                <ul
                  class="scrollbar-hide relative flex w-full snap-x gap-1 overflow-x-auto scroll-smooth"
                >
                  <li
                    v-for="(tag, index) in tagsName"
                    :key="index"
                    class="min-w-fit"
                  >
                    <input
                      v-model="checkedTags[index]"
                      :id="tag.id"
                      type="checkbox"
                      class="peer hidden"
                      @change="handleChecked"
                    />
                    <label
                      :for="tag.id"
                      class="mb-1 me-2 inline-flex cursor-pointer items-center justify-between rounded-full border-2 border-gray-200 bg-white px-4 py-2 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-600 peer-checked:border-primary peer-checked:bg-primary-light peer-checked:text-primary-dark"
                    >
                      <p>{{ tag.name }}</p>
                    </label>
                  </li>
                </ul>
              </div>
              <ul class="mb-6 space-y-4">
                <li
                  v-for="(menu, index) in filteredMenus"
                  :key="index"
                  class="relative flex flex-col rounded-3xl border border-primary-light bg-white p-3 md:flex-row"
                >
                  <NuxtLink
                    :to="`/salon/${storeId}/menu?menu_id=${menu.id}`"
                    target="_blank"
                  >
                    <div
                      class="relative mb-4 aspect-3/2 w-full overflow-hidden rounded-2xl md:mb-0"
                    >
                      <img
                        :src="menu.img || '/img/hairStyle.jpg'"
                        class="block h-full w-full object-cover"
                        alt="..."
                      />
                    </div>
                    <div class="p-2 pt-0 md:p-4">
                      <h3
                        class="mb-1 inline-flex flex-wrap items-center text-lg font-medium"
                      >
                        {{ menu.name }}
                        <span
                          class="ml-2 inline-block rounded bg-red-500 px-3 py-1 text-xs font-medium text-white"
                        >
                          {{ tagsName[menu.tag].name }}
                        </span>
                      </h3>
                      <p class="mb-2 text-xl font-medium text-red-500">
                        ${{ menu.price }}
                      </p>
                      <p class="mb-4 text-xs tracking-wider text-gray-700">
                        {{ menu.description }}
                      </p>
                      <ul class="mb-1 flex">
                        <li
                          v-for="(tag, index) in menu.classification"
                          :key="index"
                        >
                          <span
                            class="me-1 rounded bg-red-100 px-3 py-1 text-xs font-medium text-red-400"
                            >{{ tag }}</span
                          >
                        </li>
                      </ul>
                      <ul class="mb-4 flex">
                        <li v-for="(tag, index) in menu.points" :key="index">
                          <span
                            class="me-1 rounded bg-gray-200 px-3 py-1 text-xs font-medium text-gray-500"
                            >{{ tag }}</span
                          >
                        </li>
                      </ul>
                    </div>
                  </NuxtLink>
                </li>
              </ul>
            </DisclosurePanel>
          </transition>
        </Disclosure>

        <TabGroup>
          <TabList class="mb-2 flex space-x-1 rounded-xl">
            <Tab
              v-for="(list, index) in mobileLists"
              as="template"
              :key="index"
              v-slot="{ selected }"
            >
              <button
                :class="[
                  'w-full rounded-lg py-2.5 text-sm leading-5',
                  'ring-0 focus:outline-none focus:ring-0',
                  selected
                    ? 'border-2 border-primary bg-primary-light'
                    : 'border-gary-200 border-2 bg-white text-gray-500',
                ]"
              >
                {{ list.name }}
              </button>
            </Tab>
          </TabList>
          <TabPanels>
            <TabPanel>總覽 Coming soon.</TabPanel>
            <TabPanel>設計師 Coming soon.</TabPanel>
            <TabPanel>案例 Coming soon.</TabPanel>
            <TabPanel>評論 Coming soon.</TabPanel>
          </TabPanels>
        </TabGroup>
      </section>
    </template>
  </NuxtLayout>
</template>

<style scoped>
.scrollbar-hide {
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}

.scrollbar-hide::-webkit-scrollbar {
  display: none; /* Chrome, Safari, and Opera */
}
</style>
