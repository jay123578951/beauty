<script setup>
// import { comment } from "postcss";
import { ref, reactive, onMounted, computed, watch } from "vue";
import { useRoute } from "vue-router";
import { useFlowbite } from "~/composables/useFlowbite";

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

const formattedDateRange = computed(() => {
  const formatDate = (dateString) => {
    if (!dateString) return null;
    return dateString.slice(0, 10);
  };

  const start = formatDate(searchData.dateRange.start);
  const end = formatDate(searchData.dateRange.end);

  if (start === end) {
    return start;
  } else {
    return `${start} ~ ${end}`;
  }
});

const isToggle = ref(false);
const isRounded = ref(true);
const isExpanded = ref(false);
const animationDuration = 300;

function toggleSearchDrawer() {
  isToggle.value = !isToggle.value;

  if (isToggle.value) {
    isRounded.value = false;

    setTimeout(() => {
      isExpanded.value = true;
    }, animationDuration);
  } else {
    isExpanded.value = false;
    setTimeout(() => {
      isRounded.value = true;
    }, animationDuration);
  }
}

watch(
  () => route.query,
  () => {
    isToggle.value = false;
    isRounded.value = true;
    isExpanded.value = false;
  },
  { deep: true },
);

const options = ref({
  mapId: "9f6d452625c83e6a",
  mapTypeId: "roadmap",
  zoomControl: false,
  mapTypeControl: false,
  scaleControl: false,
  streetViewControl: false,
  rotateControl: false,
  fullscreenControl: false,
});
const center = ref({ lat: 25.0626695, lng: 121.5238994 });
const openedMarkerID = ref(null);

function openMarker(markId) {
  openedMarkerID.value = markId;
}

async function goToStore(id) {
  await navigateTo(`/salon/${id}`);
}

const stores = reactive([
  {
    id: "1",
    position: { lat: 25.0626695, lng: 121.5238994 },
    img: "/img/recommend01.jpg",
    name: "ALBUM 台北",
    rating: 4.5,
    description:
      "我們致力於創造個性化的髮型，帶給顧客耳目一新的美髮體驗。我們的造型師團隊以專業技術和創意設計，幫助每位顧客展現最自信的自己。",
    location: "中山站徒步2分鐘",
    price: 1000,
    comment: 56,
  },
  {
    id: "2",
    position: { lat: 25.0504883, lng: 121.51957 },
    img: "/img/recommend02.jpg",
    name: "Belle 中山",
    rating: 4.2,
    description:
      "我們致力於創造個性化的髮型，帶給顧客耳目一新的美髮體驗。我們的造型師團隊以專業技術和創意設計，幫助每位顧客展現最自信的自己。",
    location: "中山站徒步2分鐘",
    price: 1000,
    comment: 56,
  },
  {
    id: "3",
    position: { lat: 25.0562623, lng: 121.5173593 },
    img: "/img/recommend05.jpg",
    name: "Blossom 中山",
    rating: 4.1,
    description:
      "我們致力於創造個性化的髮型，帶給顧客耳目一新的美髮體驗。我們的造型師團隊以專業技術和創意設計，幫助每位顧客展現最自信的自己。",
    location: "中山站徒步2分鐘",
    price: 1000,
    comment: 56,
  },
]);

definePageMeta({
  layout: false,
});

const isReady = ref(false);
const searchBtn = ref(null);
const searchBtnWidth = ref(0);

onMounted(() => {
  useFlowbite(() => {
    initFlowbite();
  });

  nextTick(() => {
    if (searchBtn.value) {
      const width = searchBtn.value.getBoundingClientRect().width;
      searchBtnWidth.value = width;
    }

    setTimeout(() => {
      isReady.value = true;
    }, 100);
  });
});
</script>

<template>
  <NuxtLayout name="salon">
    <template #content>
      <div
        class="relative h-[calc(100vh-130px-32px)] w-full overflow-hidden rounded-3xl border-2 border-primary p-6"
      >
        <div
          class="relative z-10 max-h-full w-[40%] overflow-y-auto rounded-3xl bg-white p-6"
        >
          <div class="mb-4 flex items-center justify-between">
            <p class="text-lg font-medium">沙龍一覽：{{ stores.length }} 件</p>
            <div class="inline-flex rounded-md" role="group">
              <button
                type="button"
                class="inline-flex items-center bg-white px-2 py-2 text-sm font-medium"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="size-6"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z"
                  />
                </svg>
              </button>
              <button
                type="button"
                class="inline-flex items-center bg-white px-2 py-2 text-sm font-medium"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="size-6"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 0 1 0 3.75H5.625a1.875 1.875 0 0 1 0-3.75Z"
                  />
                </svg>
              </button>
              <button
                type="button"
                class="inline-flex items-center bg-white px-2 py-2 text-sm font-medium"
                id="dropdownDefaultButton"
                data-dropdown-toggle="dropdown"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="mr-1 size-6"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M3 4.5h14.25M3 9h9.75M3 13.5h9.75m4.5-4.5v12m0 0-3.75-3.75M17.25 21 21 17.25"
                  />
                </svg>
                <p class="text-sm">排序</p>
              </button>

              <div
                id="dropdown"
                class="z-10 hidden w-44 divide-y divide-gray-100 rounded-lg bg-white shadow dark:bg-gray-700"
              >
                <ul
                  class="py-2 text-sm text-gray-700 dark:text-gray-200"
                  aria-labelledby="dropdownDefaultButton"
                >
                  <li>
                    <a
                      href="#"
                      class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                      >評分</a
                    >
                  </li>
                  <li>
                    <a
                      href="#"
                      class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                      >價格</a
                    >
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <ul v-for="(store, index) in stores" :key="`${store.id}-${index}`">
            <li class="pb-4">
              <NuxtLink
                :to="`/salon/${store.id}`"
                class="flex cursor-pointer rounded-3xl border border-slate-300"
              >
                <img
                  :src="store.img"
                  class="h-52 w-52 rounded-3xl object-cover"
                  alt="..."
                />
                <div class="px-5 py-3">
                  <div class="mb-1 flex items-center">
                    <h3 class="mr-4 text-2xl font-medium">{{ store.name }}</h3>
                    <!-- <span
                    class="ml-2 rounded bg-red-100 px-3 py-1 text-xs font-medium text-red-400"
                    >New</span
                  > -->
                  </div>
                  <div class="mb-2 flex items-center">
                    <svg
                      class="me-1 h-4 w-4 text-yellow-300"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 22 20"
                    >
                      <path
                        d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"
                      />
                    </svg>
                    <svg
                      class="me-1 h-4 w-4 text-yellow-300"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 22 20"
                    >
                      <path
                        d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"
                      />
                    </svg>
                    <svg
                      class="me-1 h-4 w-4 text-yellow-300"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 22 20"
                    >
                      <path
                        d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"
                      />
                    </svg>
                    <svg
                      class="me-1 h-4 w-4 text-yellow-300"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 22 20"
                    >
                      <path
                        d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"
                      />
                    </svg>
                    <svg
                      class="me-1 h-4 w-4 text-gray-300"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 22 20"
                    >
                      <path
                        d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"
                      />
                    </svg>
                    <p
                      class="ms-1 text-sm font-medium text-gray-500 dark:text-gray-400"
                    >
                      {{ store.rating }}
                    </p>
                  </div>
                  <p class="mb-4 line-clamp-1 text-sm">
                    {{ store.description }}
                  </p>
                  <ul class="text-sm text-gray-500">
                    <li class="mb-1 flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        class="mr-1 size-5"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                        />
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
                        />
                      </svg>
                      <p>{{ store.location }}</p>
                    </li>
                    <li class="mb-1 flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        class="mr-1 size-5"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                        />
                      </svg>
                      <p>{{ store.price }}~</p>
                    </li>
                    <li class="mb-1 flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        class="mr-1 size-5"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M8.625 9.75a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 0 1 .778-.332 48.294 48.294 0 0 0 5.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"
                        />
                      </svg>
                      <p>{{ store.comment }} 篇評論</p>
                    </li>
                  </ul>
                </div>
                <!-- <div class="flex flex-col items-end justify-between p-2">
                <button
                  type="button"
                  class="inline-flex w-fit items-center rounded-full border border-red-500 p-2.5 text-center text-sm font-medium text-red-500 hover:bg-red-500 hover:text-white focus:outline-none focus:ring-4 focus:ring-blue-300 dark:border-blue-500 dark:text-blue-500 dark:hover:bg-blue-500 dark:hover:text-white dark:focus:ring-blue-800"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    class="size-5"
                  >
                    <path
                      d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z"
                    />
                  </svg>
                  <span class="sr-only">Icon description</span>
                </button>
                <NuxtLink :to="`/salon/salon1`" target="_blank">
                  <button
                    type="button"
                    class="whitespace-nowrap rounded-lg bg-blue-700 px-5 py-2.5 text-lg font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  >
                    查看菜單
                  </button>
                </NuxtLink>
              </div> -->
              </NuxtLink>
            </li>
          </ul>
        </div>
        <transition name="open-toggle">
          <div
            v-if="!isToggle"
            ref="searchBtn"
            class="absolute bottom-6 end-6 z-30"
          >
            <button
              @click="toggleSearchDrawer"
              type="button"
              class="'max-w-[358px] relative bottom-0 end-0 inline-flex items-center rounded-full bg-primary-dark p-1 text-center text-white"
            >
              <div
                class="rounded-full border border-[rgba(225,225,225,0.8)] bg-primary-light p-4"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  class="size-8 text-primary-dark"
                >
                  <path
                    fill-rule="evenodd"
                    d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
              <div class="me-6 ms-4 text-start">
                <p class="mb-1 text-xs">
                  {{ searchData.store }} / {{ searchData.location }} /
                  {{ formattedDateRange }} / {{ searchData.service }}
                </p>
                <p class="text-lg tracking-wide opacity-55">
                  點擊用更多條件搜尋
                </p>
              </div>
            </button>
          </div>
        </transition>
        <transition name="close-toggle">
          <div v-if="isToggle" class="absolute bottom-6 end-6 z-30">
            <button
              @click="toggleSearchDrawer"
              type="button"
              class="relative bottom-0 end-0 inline-flex max-w-[358px] items-center rounded-full bg-primary-dark p-1 text-center text-white"
            >
              <div
                class="rounded-full border border-[rgba(225,225,225,0.8)] bg-primary-light p-4"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  class="size-8 text-primary-dark"
                >
                  <path
                    fill-rule="evenodd"
                    d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
            </button>
          </div>
        </transition>
        <div
          class="absolute z-20 flex items-end justify-end overflow-hidden bg-white"
          :class="[
            isRounded ? 'rounded-full' : 'rounded-3xl',
            isExpanded
              ? 'bottom-0 end-0 h-full w-full'
              : 'bottom-6 end-6 h-[76px]',
            'origin-bottom-right transition-all duration-300 ease-in-out',
            isReady ? 'visible opacity-100' : 'invisible opacity-0',
          ]"
          :style="isExpanded ? null : { width: searchBtnWidth + 'px' }"
        >
          <transition name="opened-menu">
            <div
              v-show="isToggle"
              class="relative h-full w-full overflow-hidden"
            >
              <div
                class="m-auto flex max-w-7xl flex-col items-center justify-center"
              >
                <div class="my-8 w-full">
                  <SearchBar
                    :formValue="searchData"
                    @update:form-value="handleSearchDataUpdate"
                  />
                </div>

                <div class="w-full px-3">
                  <h2 class="pb-8 pt-4 text-lg font-medium">搜尋更多條件</h2>
                  <!-- <div
                    class="grid grid-flow-col grid-flow-col-dense grid-cols-4 grid-rows-2 gap-8"
                  > -->
                  <div class="flex space-x-12">
                    <div class="flex w-1/3 flex-col flex-wrap space-y-8">
                      <fieldset>
                        <legend class="mb-3 border-l-4 border-primary ps-2">
                          價格
                        </legend>
                        <div class="relative mb-6">
                          <label for="labels-range-input" class="sr-only"
                            >Labels range</label
                          >
                          <input
                            id="labels-range-input"
                            type="range"
                            value="2000"
                            min="100"
                            max="2000"
                            class="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 dark:bg-gray-700"
                          />
                          <span
                            class="absolute -bottom-6 start-0 text-sm text-gray-500 dark:text-gray-400"
                            >$100</span
                          >
                          <span
                            class="absolute -bottom-6 start-1/4 -translate-x-1/2 text-sm text-gray-500 dark:text-gray-400 rtl:translate-x-1/2"
                            >$500</span
                          >
                          <span
                            class="absolute -bottom-6 start-2/4 -translate-x-1/2 text-sm text-gray-500 dark:text-gray-400 rtl:translate-x-1/2"
                            >$1000</span
                          >
                          <span
                            class="absolute -bottom-6 start-3/4 -translate-x-1/2 text-sm text-gray-500 dark:text-gray-400 rtl:translate-x-1/2"
                            >$1500</span
                          >
                          <span
                            class="absolute -bottom-6 end-0 text-sm text-gray-500 dark:text-gray-400"
                            >$2000+</span
                          >
                        </div>
                      </fieldset>
                      <fieldset>
                        <legend class="mb-3 border-l-4 border-primary ps-2">
                          預約
                        </legend>
                        <ul class="flex flex-wrap">
                          <li>
                            <input
                              type="checkbox"
                              id="creditCard"
                              value=""
                              class="peer hidden"
                              required=""
                            />
                            <label
                              for="creditCard"
                              class="mb-2 mr-2 inline-flex cursor-pointer items-center justify-between rounded-full border-2 border-gray-200 bg-white px-3 py-1 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-600 peer-checked:border-blue-600 peer-checked:text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300 dark:peer-checked:text-gray-300"
                            >
                              <div class="block">
                                <div class="w-full">信用卡支付 OK</div>
                              </div>
                            </label>
                          </li>
                          <li>
                            <input
                              type="checkbox"
                              id="creditCard"
                              value=""
                              class="peer hidden"
                              required=""
                            />
                            <label
                              for="creditCard"
                              class="mb-2 mr-2 inline-flex cursor-pointer items-center justify-between rounded-full border-2 border-gray-200 bg-white px-3 py-1 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-600 peer-checked:border-blue-600 peer-checked:text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300 dark:peer-checked:text-gray-300"
                            >
                              <div class="block">
                                <div class="w-full">信用卡支付 OK</div>
                              </div>
                            </label>
                          </li>
                          <li>
                            <input
                              type="checkbox"
                              id="creditCard"
                              value=""
                              class="peer hidden"
                              required=""
                            />
                            <label
                              for="creditCard"
                              class="mb-2 mr-2 inline-flex cursor-pointer items-center justify-between rounded-full border-2 border-gray-200 bg-white px-3 py-1 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-600 peer-checked:border-blue-600 peer-checked:text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300 dark:peer-checked:text-gray-300"
                            >
                              <div class="block">
                                <div class="w-full">信用卡支付 OK</div>
                              </div>
                            </label>
                          </li>
                          <li>
                            <input
                              type="checkbox"
                              id="creditCard"
                              value=""
                              class="peer hidden"
                              required=""
                            />
                            <label
                              for="creditCard"
                              class="mb-2 mr-2 inline-flex cursor-pointer items-center justify-between rounded-full border-2 border-gray-200 bg-white px-3 py-1 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-600 peer-checked:border-blue-600 peer-checked:text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300 dark:peer-checked:text-gray-300"
                            >
                              <div class="block">
                                <div class="w-full">信用卡支付 OK</div>
                              </div>
                            </label>
                          </li>
                        </ul>
                      </fieldset>
                      <fieldset>
                        <legend class="mb-3 border-l-4 border-primary ps-2">
                          特色
                        </legend>
                        <ul class="flex flex-wrap">
                          <li>
                            <input
                              type="checkbox"
                              id="creditCard"
                              value=""
                              class="peer hidden"
                              required=""
                            />
                            <label
                              for="creditCard"
                              class="mb-2 mr-2 inline-flex cursor-pointer items-center justify-between rounded-full border-2 border-gray-200 bg-white px-3 py-1 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-600 peer-checked:border-blue-600 peer-checked:text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300 dark:peer-checked:text-gray-300"
                            >
                              <div class="block">
                                <div class="w-full">信用卡支付 OK</div>
                              </div>
                            </label>
                          </li>
                          <li>
                            <input
                              type="checkbox"
                              id="creditCard"
                              value=""
                              class="peer hidden"
                              required=""
                            />
                            <label
                              for="creditCard"
                              class="mb-2 mr-2 inline-flex cursor-pointer items-center justify-between rounded-full border-2 border-gray-200 bg-white px-3 py-1 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-600 peer-checked:border-blue-600 peer-checked:text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300 dark:peer-checked:text-gray-300"
                            >
                              <div class="block">
                                <div class="w-full">信用卡支付 OK</div>
                              </div>
                            </label>
                          </li>
                          <li>
                            <input
                              type="checkbox"
                              id="creditCard"
                              value=""
                              class="peer hidden"
                              required=""
                            />
                            <label
                              for="creditCard"
                              class="mb-2 mr-2 inline-flex cursor-pointer items-center justify-between rounded-full border-2 border-gray-200 bg-white px-3 py-1 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-600 peer-checked:border-blue-600 peer-checked:text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300 dark:peer-checked:text-gray-300"
                            >
                              <div class="block">
                                <div class="w-full">信用卡支付 OK</div>
                              </div>
                            </label>
                          </li>
                          <li>
                            <input
                              type="checkbox"
                              id="creditCard"
                              value=""
                              class="peer hidden"
                              required=""
                            />
                            <label
                              for="creditCard"
                              class="mb-2 mr-2 inline-flex cursor-pointer items-center justify-between rounded-full border-2 border-gray-200 bg-white px-3 py-1 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-600 peer-checked:border-blue-600 peer-checked:text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300 dark:peer-checked:text-gray-300"
                            >
                              <div class="block">
                                <div class="w-full">信用卡支付 OK</div>
                              </div>
                            </label>
                          </li>
                        </ul>
                      </fieldset>
                    </div>
                    <div class="flex w-1/3 flex-col flex-wrap space-y-8">
                      <fieldset>
                        <legend class="mb-3 border-l-4 border-primary ps-2">
                          評分
                        </legend>
                        <ul>
                          <li class="mb-4 flex items-center">
                            <input
                              id="default-checkbox"
                              type="checkbox"
                              value=""
                              class="h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
                            />
                            <label
                              for="default-checkbox"
                              class="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                            >
                              <div class="flex items-center">
                                <svg
                                  class="ms-1 h-4 w-4 text-yellow-300"
                                  aria-hidden="true"
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="currentColor"
                                  viewBox="0 0 22 20"
                                >
                                  <path
                                    d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"
                                  />
                                </svg>
                                <svg
                                  class="ms-1 h-4 w-4 text-yellow-300"
                                  aria-hidden="true"
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="currentColor"
                                  viewBox="0 0 22 20"
                                >
                                  <path
                                    d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"
                                  />
                                </svg>
                                <svg
                                  class="ms-1 h-4 w-4 text-yellow-300"
                                  aria-hidden="true"
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="currentColor"
                                  viewBox="0 0 22 20"
                                >
                                  <path
                                    d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"
                                  />
                                </svg>
                                <svg
                                  class="ms-1 h-4 w-4 text-yellow-300"
                                  aria-hidden="true"
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="currentColor"
                                  viewBox="0 0 22 20"
                                >
                                  <path
                                    d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"
                                  />
                                </svg>
                                <svg
                                  class="ms-1 h-4 w-4 text-yellow-300"
                                  aria-hidden="true"
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="currentColor"
                                  viewBox="0 0 22 20"
                                >
                                  <path
                                    d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"
                                  />
                                </svg>
                              </div>
                            </label>
                          </li>
                          <li class="mb-4 flex items-center">
                            <input
                              id="default-checkbox"
                              type="checkbox"
                              value=""
                              class="h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
                            />
                            <label
                              for="default-checkbox"
                              class="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                            >
                              <div class="flex items-center">
                                <svg
                                  class="ms-1 h-4 w-4 text-yellow-300"
                                  aria-hidden="true"
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="currentColor"
                                  viewBox="0 0 22 20"
                                >
                                  <path
                                    d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"
                                  />
                                </svg>
                                <svg
                                  class="ms-1 h-4 w-4 text-yellow-300"
                                  aria-hidden="true"
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="currentColor"
                                  viewBox="0 0 22 20"
                                >
                                  <path
                                    d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"
                                  />
                                </svg>
                                <svg
                                  class="ms-1 h-4 w-4 text-yellow-300"
                                  aria-hidden="true"
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="currentColor"
                                  viewBox="0 0 22 20"
                                >
                                  <path
                                    d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"
                                  />
                                </svg>
                                <svg
                                  class="ms-1 h-4 w-4 text-yellow-300"
                                  aria-hidden="true"
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="currentColor"
                                  viewBox="0 0 22 20"
                                >
                                  <path
                                    d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"
                                  />
                                </svg>
                                <svg
                                  class="ms-1 h-4 w-4 text-gray-300 dark:text-gray-500"
                                  aria-hidden="true"
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="currentColor"
                                  viewBox="0 0 22 20"
                                >
                                  <path
                                    d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"
                                  />
                                </svg>
                              </div>
                            </label>
                          </li>
                          <li class="mb-4 flex items-center">
                            <input
                              id="default-checkbox"
                              type="checkbox"
                              value=""
                              class="h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
                            />
                            <label
                              for="default-checkbox"
                              class="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                            >
                              <div class="flex items-center">
                                <svg
                                  class="ms-1 h-4 w-4 text-yellow-300"
                                  aria-hidden="true"
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="currentColor"
                                  viewBox="0 0 22 20"
                                >
                                  <path
                                    d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"
                                  />
                                </svg>
                                <svg
                                  class="ms-1 h-4 w-4 text-yellow-300"
                                  aria-hidden="true"
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="currentColor"
                                  viewBox="0 0 22 20"
                                >
                                  <path
                                    d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"
                                  />
                                </svg>
                                <svg
                                  class="ms-1 h-4 w-4 text-yellow-300"
                                  aria-hidden="true"
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="currentColor"
                                  viewBox="0 0 22 20"
                                >
                                  <path
                                    d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"
                                  />
                                </svg>
                                <svg
                                  class="ms-1 h-4 w-4 text-gray-300 dark:text-gray-500"
                                  aria-hidden="true"
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="currentColor"
                                  viewBox="0 0 22 20"
                                >
                                  <path
                                    d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"
                                  />
                                </svg>
                                <svg
                                  class="ms-1 h-4 w-4 text-gray-300 dark:text-gray-500"
                                  aria-hidden="true"
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="currentColor"
                                  viewBox="0 0 22 20"
                                >
                                  <path
                                    d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"
                                  />
                                </svg>
                              </div>
                            </label>
                          </li>
                          <li class="mb-4 flex items-center">
                            <input
                              id="default-checkbox"
                              type="checkbox"
                              value=""
                              class="h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
                            />
                            <label
                              for="default-checkbox"
                              class="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                            >
                              <div class="flex items-center">
                                <svg
                                  class="ms-1 h-4 w-4 text-yellow-300"
                                  aria-hidden="true"
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="currentColor"
                                  viewBox="0 0 22 20"
                                >
                                  <path
                                    d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"
                                  />
                                </svg>
                                <svg
                                  class="ms-1 h-4 w-4 text-yellow-300"
                                  aria-hidden="true"
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="currentColor"
                                  viewBox="0 0 22 20"
                                >
                                  <path
                                    d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"
                                  />
                                </svg>
                                <svg
                                  class="ms-1 h-4 w-4 text-gray-300 dark:text-gray-500"
                                  aria-hidden="true"
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="currentColor"
                                  viewBox="0 0 22 20"
                                >
                                  <path
                                    d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"
                                  />
                                </svg>
                                <svg
                                  class="ms-1 h-4 w-4 text-gray-300 dark:text-gray-500"
                                  aria-hidden="true"
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="currentColor"
                                  viewBox="0 0 22 20"
                                >
                                  <path
                                    d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"
                                  />
                                </svg>
                                <svg
                                  class="ms-1 h-4 w-4 text-gray-300 dark:text-gray-500"
                                  aria-hidden="true"
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="currentColor"
                                  viewBox="0 0 22 20"
                                >
                                  <path
                                    d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"
                                  />
                                </svg>
                              </div>
                            </label>
                          </li>
                          <li class="flex items-center">
                            <input
                              checked
                              id="checked-checkbox"
                              type="checkbox"
                              value=""
                              class="h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
                            />
                            <label
                              for="checked-checkbox"
                              class="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                            >
                              <div class="flex items-center">
                                <svg
                                  class="ms-1 h-4 w-4 text-yellow-300"
                                  aria-hidden="true"
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="currentColor"
                                  viewBox="0 0 22 20"
                                >
                                  <path
                                    d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"
                                  />
                                </svg>
                                <svg
                                  class="ms-1 h-4 w-4 text-gray-300 dark:text-gray-500"
                                  aria-hidden="true"
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="currentColor"
                                  viewBox="0 0 22 20"
                                >
                                  <path
                                    d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"
                                  />
                                </svg>
                                <svg
                                  class="ms-1 h-4 w-4 text-gray-300 dark:text-gray-500"
                                  aria-hidden="true"
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="currentColor"
                                  viewBox="0 0 22 20"
                                >
                                  <path
                                    d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"
                                  />
                                </svg>
                                <svg
                                  class="ms-1 h-4 w-4 text-gray-300 dark:text-gray-500"
                                  aria-hidden="true"
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="currentColor"
                                  viewBox="0 0 22 20"
                                >
                                  <path
                                    d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"
                                  />
                                </svg>
                                <svg
                                  class="ms-1 h-4 w-4 text-gray-300 dark:text-gray-500"
                                  aria-hidden="true"
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="currentColor"
                                  viewBox="0 0 22 20"
                                >
                                  <path
                                    d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"
                                  />
                                </svg>
                              </div>
                            </label>
                          </li>
                        </ul>
                      </fieldset>
                      <fieldset>
                        <legend class="mb-3 border-l-4 border-primary ps-2">
                          服務
                        </legend>
                        <ul class="flex flex-wrap">
                          <li>
                            <input
                              type="checkbox"
                              id="creditCard"
                              value=""
                              class="peer hidden"
                              required=""
                            />
                            <label
                              for="creditCard"
                              class="mb-2 mr-2 inline-flex cursor-pointer items-center justify-between rounded-full border-2 border-gray-200 bg-white px-3 py-1 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-600 peer-checked:border-blue-600 peer-checked:text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300 dark:peer-checked:text-gray-300"
                            >
                              <div class="block">
                                <div class="w-full">信用卡支付 OK</div>
                              </div>
                            </label>
                          </li>
                          <li>
                            <input
                              type="checkbox"
                              id="creditCard"
                              value=""
                              class="peer hidden"
                              required=""
                            />
                            <label
                              for="creditCard"
                              class="mb-2 mr-2 inline-flex cursor-pointer items-center justify-between rounded-full border-2 border-gray-200 bg-white px-3 py-1 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-600 peer-checked:border-blue-600 peer-checked:text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300 dark:peer-checked:text-gray-300"
                            >
                              <div class="block">
                                <div class="w-full">信用卡支付 OK</div>
                              </div>
                            </label>
                          </li>
                          <li>
                            <input
                              type="checkbox"
                              id="creditCard"
                              value=""
                              class="peer hidden"
                              required=""
                            />
                            <label
                              for="creditCard"
                              class="mb-2 mr-2 inline-flex cursor-pointer items-center justify-between rounded-full border-2 border-gray-200 bg-white px-3 py-1 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-600 peer-checked:border-blue-600 peer-checked:text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300 dark:peer-checked:text-gray-300"
                            >
                              <div class="block">
                                <div class="w-full">信用卡支付 OK</div>
                              </div>
                            </label>
                          </li>
                          <li>
                            <input
                              type="checkbox"
                              id="creditCard"
                              value=""
                              class="peer hidden"
                              required=""
                            />
                            <label
                              for="creditCard"
                              class="mb-2 mr-2 inline-flex cursor-pointer items-center justify-between rounded-full border-2 border-gray-200 bg-white px-3 py-1 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-600 peer-checked:border-blue-600 peer-checked:text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300 dark:peer-checked:text-gray-300"
                            >
                              <div class="block">
                                <div class="w-full">信用卡支付 OK</div>
                              </div>
                            </label>
                          </li>
                        </ul>
                      </fieldset>
                    </div>
                  </div>
                  <!-- <div class="w-1/4 space-y-4"></div> -->
                </div>
              </div>
            </div>
          </transition>
        </div>
        <GMapMap
          ref="mapRef"
          :center="center"
          :options="options"
          :zoom="16"
          class="absolute left-0 top-0 z-0 h-full w-full"
        >
          <GMapMarker
            v-for="(marker, index) in stores"
            :key="index"
            :position="marker.position"
            :clickable="true"
            :draggable="false"
            @click="goToStore(marker.id)"
            @mouseover="openMarker(marker.id)"
            @mouseout="openMarker(null)"
          >
            <GMapInfoWindow :opened="openedMarkerID === marker.id">
              <NuxtLink :to="`/salon/${marker.id}`" class="flex items-center">
                <img
                  class="me-4 h-24 w-24 rounded-lg object-cover"
                  :src="marker.img"
                  alt=""
                />
                <div class="font-normal">
                  <p class="text-base font-medium">
                    {{ marker.name }}
                  </p>
                  <div>{{ marker.rating }}</div>
                  <div>{{ marker.location }}</div>
                  <div>{{ marker.price }}~</div>
                </div>
              </NuxtLink>
            </GMapInfoWindow>
          </GMapMarker>
        </GMapMap>
      </div>
    </template>
  </NuxtLayout>
</template>

<style scoped>
.open-toggle-enter-active,
.open-toggle-leave-active {
  transition:
    opacity 0.2s ease 0.1s,
    scale 0.2s ease 0.1s;
  transform-origin: right;
}
.open-toggle-enter-from,
.open-toggle-leave-to {
  opacity: 0;
  scale: 0 1;
}
.open-toggle-enter-to,
.open-toggle-leave-from {
  opacity: 1;
  scale: 1 1;
}

.close-toggle-enter-active {
  transition: opacity 0.8s ease 0.6s;
}
.close-toggle-leave-active {
  transition: opacity 0.3s ease;
}
.close-toggle-enter-from,
.close-toggle-leave-to {
  opacity: 0;
}
.close-toggle-enter-to,
.close-toggle-leave-from {
  opacity: 1;
}

.opened-menu-enter-active {
  transition:
    opacity 0.2s ease 0.8s,
    transform 0.2s ease-in-out 0.8s;
}
.opened-menu-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease-in-out;
}
.opened-menu-enter-from,
.opened-menu-leave-to {
  opacity: 0;
  transform: translateY(5px);
}
.opened-menu-enter-to,
.opened-menu-leave-from {
  opacity: 1;
  transform: translateY(0);
}
</style>
