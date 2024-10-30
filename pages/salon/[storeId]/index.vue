<script setup>
import { useRoute } from "vue-router";
import { useFlowbite } from "~/composables/useFlowbite";

const route = useRoute();
const storeId = route.params.storeId;

definePageMeta({
  layout: "main",
});

onMounted(() => {
  useFlowbite(() => {
    initFlowbite();
  });
});
</script>

<template>
  <section class="mb-4">
    <div id="default-carousel" class="relative w-full" data-carousel="static">
      <!-- Carousel wrapper -->
      <div class="relative h-[70vh] overflow-hidden rounded-2xl">
        <!-- Item 1 -->
        <div class="hidden duration-700 ease-in-out" data-carousel-item>
          <img
            src="/assets/img/salonBanner.jpg"
            class="absolute left-1/2 top-1/2 block w-full -translate-x-1/2 -translate-y-1/2"
            alt="..."
          />
        </div>
        <!-- Item 2 -->
        <div class="hidden duration-700 ease-in-out" data-carousel-item>
          <img
            src="/assets/img/salonBanner.jpg"
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
  </section>

  <section class="m-auto w-full max-w-7xl">
    <div class="mb-8 border-b border-gray-200 dark:border-gray-700">
      <ul
        class="-mb-px flex flex-wrap text-center text-sm font-medium"
        id="default-tab"
        data-tabs-toggle="#default-tab-content"
        role="tablist"
      >
        <li class="me-2" role="presentation">
          <button
            class="inline-block rounded-t-lg border-b-2 p-4"
            id="overview-tab"
            data-tabs-target="#overview"
            type="button"
            role="tab"
            aria-controls="overview"
            aria-selected="false"
          >
            總攬
          </button>
        </li>
        <li class="me-2" role="presentation">
          <button
            class="inline-block rounded-t-lg border-b-2 p-4 hover:border-gray-300 hover:text-gray-600 dark:hover:text-gray-300"
            id="plan-tab"
            data-tabs-target="#plan"
            type="button"
            role="tab"
            aria-controls="plan"
            aria-selected="false"
          >
            方案
          </button>
        </li>
        <li class="me-2" role="presentation">
          <button
            class="inline-block rounded-t-lg border-b-2 p-4 hover:border-gray-300 hover:text-gray-600 dark:hover:text-gray-300"
            id="designer-tab"
            data-tabs-target="#designer"
            type="button"
            role="tab"
            aria-controls="designer"
            aria-selected="false"
          >
            設計師
          </button>
        </li>
        <li role="presentation">
          <button
            class="inline-block rounded-t-lg border-b-2 p-4 hover:border-gray-300 hover:text-gray-600 dark:hover:text-gray-300"
            id="case-tab"
            data-tabs-target="#case"
            type="button"
            role="tab"
            aria-controls="case"
            aria-selected="false"
          >
            案例
          </button>
        </li>
        <li role="presentation">
          <button
            class="inline-block rounded-t-lg border-b-2 p-4 hover:border-gray-300 hover:text-gray-600 dark:hover:text-gray-300"
            id="comment-tab"
            data-tabs-target="#comment"
            type="button"
            role="tab"
            aria-controls="comment"
            aria-selected="false"
          >
            評論
          </button>
        </li>
      </ul>
    </div>
    <div id="default-tab-content">
      <div
        class="hidden rounded-lg bg-gray-50 p-4 dark:bg-gray-800"
        id="overview"
        role="tabpanel"
        aria-labelledby="overview-tab"
      >
        <p class="text-sm text-gray-500 dark:text-gray-400">
          This is some placeholder content the
          <strong class="font-medium text-gray-800 dark:text-white"
            >overview tab's associated content</strong
          >. Clicking another tab will toggle the visibility of this one for the
          next. The tab JavaScript swaps classes to control the content
          visibility and styling.
        </p>
      </div>
      <div class="hidden" id="plan" role="tabpanel" aria-labelledby="plan-tab">
        <ul class="mb-2 flex flex-wrap">
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
                <div class="w-full">全部</div>
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
                <div class="w-full">新客</div>
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
                <div class="w-full">第二次消費</div>
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
                <div class="w-full">限時活動</div>
              </div>
            </label>
          </li>
        </ul>
        <ul class="space-y-4 rounded-2xl bg-gray-100 p-4">
          <li class="flex space-x-4 rounded-2xl bg-white">
            <div
              class="relative h-56 w-full max-w-56 overflow-hidden rounded-2xl"
            >
              <img
                src="/assets/img/hairStyle.jpg"
                class="block h-full w-full object-cover"
                alt="..."
              />
            </div>
            <div class="p-4">
              <div class="mb-2">
                <span
                  class="me-1 rounded bg-red-500 px-3 py-1 text-sm font-medium text-white"
                  >新客</span
                >
              </div>
              <div class="flex items-center">
                <h3 class="mb-1 text-xl font-medium">
                  [女性限定] 洗 + 剪 + 護髮
                </h3>
              </div>
              <p class="mb-4 text-sm tracking-wider text-gray-700">
                利用條件：平日女性限定 / 不可指定髮型師 /
                不可與其他優惠券併用<br />
                ■平日來店限定的特別價格剪髮染髮★ ■白髮染需加收1000元
                ■卷髮造型免費
                ■更換為伊諾亞或伊魯米娜染髮需加收2000元（若為長髮需加收額外費用）
                【台北市/中山站/距中山站3分鐘】
              </p>
              <ul class="mb-1 flex">
                <li>
                  <span
                    class="me-1 rounded bg-red-100 px-3 py-1 text-xs font-medium text-red-400"
                    >剪髮</span
                  >
                </li>
                <li>
                  <span
                    class="me-1 rounded bg-red-100 px-3 py-1 text-xs font-medium text-red-400"
                    >洗髮</span
                  >
                </li>
                <li>
                  <span
                    class="me-1 rounded bg-red-100 px-3 py-1 text-xs font-medium text-red-400"
                    >護髮</span
                  >
                </li>
              </ul>
              <ul class="flex">
                <li>
                  <span
                    class="me-1 rounded bg-gray-100 px-3 py-1 text-xs font-medium text-gray-500"
                    >9點～16點</span
                  >
                </li>
                <li>
                  <span
                    class="me-1 rounded bg-gray-100 px-3 py-1 text-xs font-medium text-gray-500"
                    >設計師限定</span
                  >
                </li>
              </ul>
            </div>
            <div class="flex flex-col items-end justify-between p-4">
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
              <div>
                <div class="mb-2 text-right">
                  <p class="ms-1 text-2xl font-medium text-red-500">$2,000</p>
                </div>
                <NuxtLink
                  :to="`/salon/${storeId}/hair1?store_id=${storeId}`"
                  target="_blank"
                >
                  <button
                    type="button"
                    class="whitespace-nowrap rounded-lg bg-blue-700 px-5 py-2.5 text-lg font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  >
                    預約這個方案
                  </button>
                </NuxtLink>
              </div>
            </div>
          </li>
          <li class="flex space-x-4 rounded-2xl bg-white">
            <div
              class="relative h-56 w-full max-w-56 overflow-hidden rounded-2xl"
            >
              <img
                src="/assets/img/hairStyle.jpg"
                class="block h-full w-full object-cover"
                alt="..."
              />
            </div>
            <div class="p-4">
              <div class="mb-2">
                <span
                  class="me-1 rounded bg-red-500 px-3 py-1 text-sm font-medium text-white"
                  >新客</span
                >
              </div>
              <div class="flex items-center">
                <h3 class="mb-1 text-xl font-medium">
                  [女性限定] 洗 + 剪 + 護髮
                </h3>
              </div>
              <p class="mb-4 text-sm tracking-wider text-gray-700">
                利用條件：平日女性限定 / 不可指定髮型師 /
                不可與其他優惠券併用<br />
                ■平日來店限定的特別價格剪髮染髮★ ■白髮染需加收1000元
                ■卷髮造型免費
                ■更換為伊諾亞或伊魯米娜染髮需加收2000元（若為長髮需加收額外費用）
                【台北市/中山站/距中山站3分鐘】
              </p>
              <ul class="mb-1 flex">
                <li>
                  <span
                    class="me-1 rounded bg-red-100 px-3 py-1 text-xs font-medium text-red-400"
                    >剪髮</span
                  >
                </li>
                <li>
                  <span
                    class="me-1 rounded bg-red-100 px-3 py-1 text-xs font-medium text-red-400"
                    >洗髮</span
                  >
                </li>
                <li>
                  <span
                    class="me-1 rounded bg-red-100 px-3 py-1 text-xs font-medium text-red-400"
                    >護髮</span
                  >
                </li>
              </ul>
              <ul class="flex">
                <li>
                  <span
                    class="me-1 rounded bg-gray-100 px-3 py-1 text-xs font-medium text-gray-500"
                    >9點～16點</span
                  >
                </li>
                <li>
                  <span
                    class="me-1 rounded bg-gray-100 px-3 py-1 text-xs font-medium text-gray-500"
                    >設計師限定</span
                  >
                </li>
              </ul>
            </div>
            <div class="flex flex-col items-end justify-between p-4">
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
              <div>
                <div class="mb-2 text-right">
                  <p class="ms-1 text-2xl font-medium text-red-500">$2,000</p>
                </div>
                <NuxtLink :to="`/salon/salon1`" target="_blank">
                  <button
                    type="button"
                    class="whitespace-nowrap rounded-lg bg-blue-700 px-5 py-2.5 text-lg font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  >
                    預約這個方案
                  </button>
                </NuxtLink>
              </div>
            </div>
          </li>
        </ul>
      </div>
      <div
        class="hidden rounded-lg bg-gray-50 p-4 dark:bg-gray-800"
        id="designer"
        role="tabpanel"
        aria-labelledby="designer-tab"
      >
        <p class="text-sm text-gray-500 dark:text-gray-400">
          This is some placeholder content the
          <strong class="font-medium text-gray-800 dark:text-white"
            >designer tab's associated content</strong
          >. Clicking another tab will toggle the visibility of this one for the
          next. The tab JavaScript swaps classes to control the content
          visibility and styling.
        </p>
      </div>
      <div
        class="hidden rounded-lg bg-gray-50 p-4 dark:bg-gray-800"
        id="case"
        role="tabpanel"
        aria-labelledby="case-tab"
      >
        <p class="text-sm text-gray-500 dark:text-gray-400">
          This is some placeholder content the
          <strong class="font-medium text-gray-800 dark:text-white"
            >case tab's associated content</strong
          >. Clicking another tab will toggle the visibility of this one for the
          next. The tab JavaScript swaps classes to control the content
          visibility and styling.
        </p>
      </div>
      <div
        class="hidden rounded-lg bg-gray-50 p-4 dark:bg-gray-800"
        id="comment"
        role="tabpanel"
        aria-labelledby="comment-tab"
      >
        <p class="text-sm text-gray-500 dark:text-gray-400">
          This is some placeholder content the
          <strong class="font-medium text-gray-800 dark:text-white"
            >comment tab's associated content</strong
          >. Clicking another tab will toggle the visibility of this one for the
          next. The tab JavaScript swaps classes to control the content
          visibility and styling.
        </p>
      </div>
    </div>
  </section>
</template>
