<script setup>
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/vue";
import { Loader } from "@googlemaps/js-api-loader";

const config = useRuntimeConfig();
const { apiUrl, googleMapsApiKey } = config.public;
const route = useRoute();

const searchData = reactive({
  store: route.query.store,
  location: route.query.location,
  dateRange: {
    start: route.query.startDate,
    end: route.query.endDate,
  },
  services: route.query.services,
});

const stores = reactive({
  data: [],
});

async function handleFetchStores() {
  const ignoredKeys = ["dateRange"];
  const baseUrl = `${apiUrl}/api/stores`;
  const queryParams = new URLSearchParams();

  Object.entries(searchData).forEach(([key, value]) => {
    if (value !== null && value !== "不指定" && !ignoredKeys.includes(key)) {
      queryParams.append(key, value);
    }
  });

  const finalUrl = `${baseUrl}?${decodeURIComponent(queryParams.toString())}`;

  try {
    const response = await fetch(finalUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      const data = await response.json();
      stores.data = data;
    }
  } catch (error) {
    console.error("Failed to fetch stores data", error);
  }
}

watch(
  () => route.query,
  (newQuery) => {
    handleFetchStores(newQuery);
  },
);

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

const mapDiv = ref(null);
const mapOptions = {
  center: {
    lat: 25.0626695,
    lng: 121.5238994,
  },
  zoom: 14,
  mapTypeId: "roadmap",
  zoomControl: false,
  mapTypeControl: false,
  scaleControl: false,
  streetViewControl: false,
  rotateControl: false,
  fullscreenControl: false,
};
const loader = new Loader({
  apiKey: googleMapsApiKey,
  version: "weekly",
});

const isReady = ref(false);
const searchBtn = ref(null);
const searchBtnWidth = ref(0);

onMounted(async () => {
  await handleFetchStores();

  await nextTick();
  setTimeout(() => {
    isReady.value = true;
  }, 1000);

  await nextTick();
  if (searchBtn.value) {
    searchBtnWidth.value = searchBtn.value.getBoundingClientRect().width;
  }

  await loader.importLibrary("maps");
  if (mapDiv.value) {
    const map = new google.maps.Map(mapDiv.value, {
      ...mapOptions,
    });

    stores.data.forEach((marker) => {
      const gMarker = new google.maps.Marker({
        position: { lat: Number(marker.lat), lng: Number(marker.lng) },
        map: map,
        title: marker.name,
        clickable: true,
        draggable: false,
      });

      // 建立資訊視窗
      const infoWindow = new google.maps.InfoWindow({
        content: `
          <div class="flex items-center">
            <img class="me-4 h-24 w-24 rounded-lg object-cover" src="${marker.img ? marker.img : "/img/store-default.jpg"}" alt="" />
            <div class="font-normal">
              <p class="text-base font-medium">${marker.name}</p>
              <div>${marker.rating}</div>
              <div>${marker.location}</div>
              <div>${marker.price}~</div>
            </div>
          </div>
        `,
      });

      // 當滑鼠移到標記上時顯示資訊視窗
      gMarker.addListener("mouseover", () => {
        infoWindow.open(map, gMarker);
      });

      // 當滑鼠移出標記時關閉資訊視窗
      gMarker.addListener("mouseout", () => {
        infoWindow.close();
      });

      // 點擊標記時導航至該店鋪
      gMarker.addListener("click", () => {
        // window.location.href = `/salon/${marker.id}`;

        navigateTo({
          path: `/salon/${marker.id}`,
        });
      });
    });
  }
});

definePageMeta({
  layout: false,
});
</script>

<template>
  <NuxtLayout name="salon">
    <template #content>
      <div
        class="relative w-full lg:h-[calc(100vh-130px-32px)] lg:overflow-hidden lg:rounded-3xl lg:p-6"
        :class="isReady ? 'lg:border-2 lg:border-primary' : ''"
      >
        <!-- Skeleton -->
        <div
          v-if="!isReady"
          class="absolute left-0 top-0 z-50 h-[calc(100vh-96px)] w-full rounded-3xl bg-primary-light lg:h-full lg:border-2 lg:border-primary"
        >
          <div
            role="status"
            class="mb-6 block max-w-sm animate-pulse lg:hidden"
          >
            <div class="mb-4 h-2.5 w-48 rounded-full bg-primary"></div>
            <div class="mb-2.5 h-2 max-w-[360px] rounded-full bg-primary"></div>
            <div class="mb-2.5 h-2 rounded-full bg-primary"></div>
          </div>
          <div
            role="status"
            class="w-[calc(100vw-2rem)] animate-pulse rounded-2xl border border-primary p-4 shadow md:p-6 lg:h-[calc(100vh-162px)] lg:border-0"
          >
            <div class="max-w-96 lg:mb-6">
              <div
                class="mb-4 flex h-48 items-center justify-center rounded-2xl bg-primary"
              >
                <svg
                  class="h-10 w-10 text-primary"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 16 20"
                >
                  <path
                    d="M14.066 0H7v5a2 2 0 0 1-2 2H0v11a1.97 1.97 0 0 0 1.934 2h12.132A1.97 1.97 0 0 0 16 18V2a1.97 1.97 0 0 0-1.934-2ZM10.5 6a1.5 1.5 0 1 1 0 2.999A1.5 1.5 0 0 1 10.5 6Zm2.221 10.515a1 1 0 0 1-.858.485h-8a1 1 0 0 1-.9-1.43L5.6 10.039a.978.978 0 0 1 .936-.57 1 1 0 0 1 .9.632l1.181 2.981.541-1a.945.945 0 0 1 .883-.522 1 1 0 0 1 .879.529l1.832 3.438a1 1 0 0 1-.031.988Z"
                  />
                  <path
                    d="M5 5V.13a2.96 2.96 0 0 0-1.293.749L.879 3.707A2.98 2.98 0 0 0 .13 5H5Z"
                  />
                </svg>
              </div>
              <div class="mb-4 h-2.5 w-48 rounded-full bg-primary"></div>
              <div class="mb-2.5 h-2 rounded-full bg-primary"></div>
              <div class="mb-2.5 h-2 rounded-full bg-primary"></div>
              <div class="h-2 rounded-full bg-primary"></div>
              <div class="mt-4 flex items-center">
                <div>
                  <div class="mb-2 h-2.5 w-32 rounded-full bg-primary"></div>
                  <div class="h-2 w-48 rounded-full bg-primary"></div>
                </div>
              </div>
              <span class="sr-only">Loading...</span>
            </div>
            <div class="hidden max-w-96 lg:block">
              <div
                class="mb-4 flex h-48 items-center justify-center rounded-2xl bg-primary"
              >
                <svg
                  class="h-10 w-10 text-primary"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 16 20"
                >
                  <path
                    d="M14.066 0H7v5a2 2 0 0 1-2 2H0v11a1.97 1.97 0 0 0 1.934 2h12.132A1.97 1.97 0 0 0 16 18V2a1.97 1.97 0 0 0-1.934-2ZM10.5 6a1.5 1.5 0 1 1 0 2.999A1.5 1.5 0 0 1 10.5 6Zm2.221 10.515a1 1 0 0 1-.858.485h-8a1 1 0 0 1-.9-1.43L5.6 10.039a.978.978 0 0 1 .936-.57 1 1 0 0 1 .9.632l1.181 2.981.541-1a.945.945 0 0 1 .883-.522 1 1 0 0 1 .879.529l1.832 3.438a1 1 0 0 1-.031.988Z"
                  />
                  <path
                    d="M5 5V.13a2.96 2.96 0 0 0-1.293.749L.879 3.707A2.98 2.98 0 0 0 .13 5H5Z"
                  />
                </svg>
              </div>
              <div class="mb-4 h-2.5 w-48 rounded-full bg-primary"></div>
            </div>
          </div>
        </div>

        <div
          class="relative z-10 max-h-full w-full lg:w-1/2 lg:overflow-y-auto lg:rounded-3xl lg:bg-white lg:p-6 xl:w-[40%]"
        >
          <div class="mb-2 flex items-center justify-between lg:mb-4">
            <p class="text-sm font-medium lg:text-lg">
              沙龍一覽：{{ stores.data.length }} 件
            </p>
            <div class="inline-flex rounded-md" role="group">
              <button
                type="button"
                class="inline-flex items-center px-2 py-2 text-sm font-medium"
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
                class="inline-flex items-center px-2 py-2 text-sm font-medium"
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
              <Popover class="relative">
                <PopoverButton
                  class="inline-flex items-center px-2 py-2 text-sm font-medium"
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
                  <p class="text-xs lg:text-sm">排序</p>
                </PopoverButton>
                <transition
                  enter-active-class="transition duration-200 ease-out"
                  enter-from-class="translate-y-1 opacity-0"
                  enter-to-class="translate-y-0 opacity-100"
                  leave-active-class="transition duration-150 ease-in"
                  leave-from-class="translate-y-0 opacity-100"
                  leave-to-class="translate-y-1 opacity-0"
                >
                  <PopoverPanel class="absolute z-30">
                    <div
                      class="w-44 divide-y divide-gray-100 rounded-lg bg-white shadow"
                    >
                      <ul
                        class="py-2 text-sm text-gray-700"
                        aria-labelledby="dropdownDefaultButton"
                      >
                        <li>
                          <a href="#" class="block px-4 py-2 hover:bg-gray-100"
                            >評分</a
                          >
                        </li>
                        <li>
                          <a href="#" class="block px-4 py-2 hover:bg-gray-100"
                            >價格</a
                          >
                        </li>
                      </ul>
                    </div>
                  </PopoverPanel>
                </transition>
              </Popover>
            </div>
          </div>
          <ul class="mb-20 lg:mb-0">
            <li
              v-for="(store, index) in stores.data"
              :key="`${store.id}-${index}`"
              class="pb-4"
            >
              <NuxtLink
                :to="`/salon/${store.id}`"
                class="flex cursor-pointer flex-col rounded-2xl border border-slate-300 md:flex-row lg:rounded-3xl"
              >
                <img
                  :src="store.img || '/img/store-default.jpg'"
                  :alt="store.name"
                  class="aspect-video w-full rounded-2xl object-cover p-2 md:aspect-square md:w-52 lg:rounded-3xl"
                />
                <div class="px-3 pb-3 pt-0 md:px-5 md:pt-3">
                  <div class="mb-1 flex items-center">
                    <h3 class="mr-4 text-xl font-medium lg:text-2xl">
                      {{ store.name }}
                    </h3>
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
                      class="me-1 h-4 w-4 text-primary"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 22 20"
                    >
                      <path
                        d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"
                      />
                    </svg>
                    <p class="ms-1 text-sm font-medium text-gray-500">
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
              </NuxtLink>
            </li>
          </ul>
        </div>
        <transition name="open-toggle">
          <div
            v-if="!isToggle"
            ref="searchBtn"
            class="fixed bottom-24 end-4 z-30 lg:absolute lg:bottom-6 lg:end-6"
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
              <div class="me-6 ms-4 hidden text-start lg:block">
                <p v-if="searchData.store" class="mb-1 text-xs">
                  {{ searchData.store }} / {{ searchData.location }} /
                  {{ formattedDateRange }} / {{ searchData.services }}
                </p>
                <p v-else class="mb-1 text-xs">
                  {{ searchData.location }} / {{ formattedDateRange }} /
                  {{ searchData.services }}
                </p>
                <p class="text-lg tracking-wide opacity-55">
                  點擊用更多條件搜尋
                </p>
              </div>
            </button>
          </div>
        </transition>
        <transition name="close-toggle">
          <div
            v-if="isToggle"
            class="fixed bottom-24 end-4 z-30 lg:absolute lg:bottom-6 lg:end-6"
          >
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

        <!-- Search Modal -->
        <div
          class="fixed z-20 flex items-end justify-end overflow-y-scroll bg-white px-4 lg:absolute lg:overflow-hidden xl:px-0"
          :class="[
            isRounded ? 'rounded-full' : 'rounded-3xl',
            isExpanded
              ? 'bottom-0 end-0 h-full w-full'
              : 'bottom-[98px] end-4 h-[74px] w-[74px] lg:bottom-6 lg:end-6 lg:w-full',
            'origin-bottom-right transition-all duration-300 ease-in-out',
            isReady ? 'visible opacity-100' : 'invisible opacity-0',
          ]"
          :style="isExpanded ? null : { width: searchBtnWidth + 'px' }"
        >
          <transition name="opened-menu">
            <div
              v-show="isToggle"
              class="relative h-full w-full lg:overflow-hidden"
            >
              <div
                class="m-auto flex max-w-md flex-col items-center justify-center lg:max-w-7xl"
              >
                <h2
                  class="mt-8 block w-full px-4 text-start text-lg font-medium lg:hidden"
                >
                  想尋找其他地方嗎？
                </h2>
                <div class="my-8 w-full">
                  <SearchBar
                    :formValue="searchData"
                    @update:form-value="handleSearchDataUpdate"
                  />
                </div>

                <div class="w-full px-3 pb-28 lg:pb-0">
                  <h2 class="mb-8 pt-4 text-lg font-medium">搜尋更多條件</h2>
                  <div
                    class="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0"
                  >
                    <div
                      class="flex w-full flex-col flex-wrap space-y-8 lg:w-1/3"
                    >
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
                            class="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200"
                          />
                          <span
                            class="absolute -bottom-6 start-0 text-sm text-gray-500"
                            >$100</span
                          >
                          <span
                            class="absolute -bottom-6 start-1/4 -translate-x-1/2 text-sm text-gray-500 rtl:translate-x-1/2"
                            >$500</span
                          >
                          <span
                            class="absolute -bottom-6 start-2/4 -translate-x-1/2 text-sm text-gray-500 rtl:translate-x-1/2"
                            >$1000</span
                          >
                          <span
                            class="absolute -bottom-6 start-3/4 -translate-x-1/2 text-sm text-gray-500 rtl:translate-x-1/2"
                            >$1500</span
                          >
                          <span
                            class="absolute -bottom-6 end-0 text-sm text-gray-500"
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
                              class="mb-2 mr-2 inline-flex cursor-pointer items-center justify-between rounded-full border-2 border-gray-200 bg-white px-3 py-1 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-600 peer-checked:border-blue-600 peer-checked:text-gray-600"
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
                              class="mb-2 mr-2 inline-flex cursor-pointer items-center justify-between rounded-full border-2 border-gray-200 bg-white px-3 py-1 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-600 peer-checked:border-blue-600 peer-checked:text-gray-600"
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
                              class="mb-2 mr-2 inline-flex cursor-pointer items-center justify-between rounded-full border-2 border-gray-200 bg-white px-3 py-1 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-600 peer-checked:border-blue-600 peer-checked:text-gray-600"
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
                              class="mb-2 mr-2 inline-flex cursor-pointer items-center justify-between rounded-full border-2 border-gray-200 bg-white px-3 py-1 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-600 peer-checked:border-blue-600 peer-checked:text-gray-600"
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
                              class="mb-2 mr-2 inline-flex cursor-pointer items-center justify-between rounded-full border-2 border-gray-200 bg-white px-3 py-1 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-600 peer-checked:border-blue-600 peer-checked:text-gray-600"
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
                              class="mb-2 mr-2 inline-flex cursor-pointer items-center justify-between rounded-full border-2 border-gray-200 bg-white px-3 py-1 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-600 peer-checked:border-blue-600 peer-checked:text-gray-600"
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
                              class="mb-2 mr-2 inline-flex cursor-pointer items-center justify-between rounded-full border-2 border-gray-200 bg-white px-3 py-1 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-600 peer-checked:border-blue-600 peer-checked:text-gray-600"
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
                              class="mb-2 mr-2 inline-flex cursor-pointer items-center justify-between rounded-full border-2 border-gray-200 bg-white px-3 py-1 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-600 peer-checked:border-blue-600 peer-checked:text-gray-600"
                            >
                              <div class="block">
                                <div class="w-full">信用卡支付 OK</div>
                              </div>
                            </label>
                          </li>
                        </ul>
                      </fieldset>
                    </div>
                    <div
                      class="flex w-full flex-col flex-wrap space-y-8 lg:w-1/3"
                    >
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
                              class="h-4 w-4 rounded border-primary bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500"
                            />
                            <label
                              for="default-checkbox"
                              class="ms-2 text-sm font-medium text-gray-900"
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
                              class="h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500"
                            />
                            <label
                              for="default-checkbox"
                              class="ms-2 text-sm font-medium text-gray-900"
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
                                  class="ms-1 h-4 w-4 text-gray-300"
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
                              class="h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500"
                            />
                            <label
                              for="default-checkbox"
                              class="ms-2 text-sm font-medium text-gray-900"
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
                                  class="ms-1 h-4 w-4 text-gray-300"
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
                                  class="ms-1 h-4 w-4 text-gray-300"
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
                              class="h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500"
                            />
                            <label
                              for="default-checkbox"
                              class="ms-2 text-sm font-medium text-gray-900"
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
                                  class="ms-1 h-4 w-4 text-gray-300"
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
                                  class="ms-1 h-4 w-4 text-gray-300"
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
                                  class="ms-1 h-4 w-4 text-gray-300"
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
                              class="h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500"
                            />
                            <label
                              for="checked-checkbox"
                              class="ms-2 text-sm font-medium text-gray-900"
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
                                  class="ms-1 h-4 w-4 text-gray-300"
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
                                  class="ms-1 h-4 w-4 text-gray-300"
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
                                  class="ms-1 h-4 w-4 text-gray-300"
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
                                  class="ms-1 h-4 w-4 text-gray-300"
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
                              class="mb-2 mr-2 inline-flex cursor-pointer items-center justify-between rounded-full border-2 border-gray-200 bg-white px-3 py-1 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-600 peer-checked:border-blue-600 peer-checked:text-gray-600"
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
                              class="mb-2 mr-2 inline-flex cursor-pointer items-center justify-between rounded-full border-2 border-gray-200 bg-white px-3 py-1 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-600 peer-checked:border-blue-600 peer-checked:text-gray-600"
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
                              class="mb-2 mr-2 inline-flex cursor-pointer items-center justify-between rounded-full border-2 border-gray-200 bg-white px-3 py-1 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-600 peer-checked:border-blue-600 peer-checked:text-gray-600"
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
                              class="mb-2 mr-2 inline-flex cursor-pointer items-center justify-between rounded-full border-2 border-gray-200 bg-white px-3 py-1 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-600 peer-checked:border-blue-600 peer-checked:text-gray-600"
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

        <!-- Map -->
        <client-only>
          <div
            ref="mapDiv"
            id="map"
            class="absolute left-0 top-0 z-0 hidden h-full w-full lg:block"
          ></div>
        </client-only>

        <!-- <client-only>
          <GMapMap
            v-if="isReady"
            :center="center"
            :options="options"
            :zoom="13"
            class="absolute left-0 top-0 z-0 hidden h-full w-full lg:block"
          >
            <GMapMarker
              v-for="(marker, index) in stores.data"
              :key="index"
              :position="{ lat: Number(marker.lat), lng: Number(marker.lng) }"
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
                    :src="marker.img ? marker.img : '/img/store-default.jpg'"
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
        </client-only> -->
      </div>
    </template>
  </NuxtLayout>
</template>

<style scoped>
.open-toggle-enter-active,
.open-toggle-leave-active {
  transition: opacity 0.2s ease 0.1s;
}
.open-toggle-enter-from,
.open-toggle-leave-to {
  opacity: 0;
}
.open-toggle-enter-to,
.open-toggle-leave-from {
  opacity: 1;
}
@media screen and (min-width: 1024px) {
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
