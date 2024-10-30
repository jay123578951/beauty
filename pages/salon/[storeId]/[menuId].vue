<script setup>
import { useRoute } from "vue-router";

const route = useRoute();
const menuId = route.params.menuId;
console.log(menuId);

definePageMeta({
  layout: "main",
});
</script>

<template>
  <div class="m-auto flex max-w-7xl">
    <section class="w-[24%] rounded-2xl border border-gray-200">
      <div>
        <div class="p-4">
          <div class="mb-2">
            <span
              class="me-1 rounded bg-red-500 px-3 py-1 text-sm font-medium text-white"
              >新客</span
            >
          </div>
          <h3 class="mb-1 text-xl font-medium">[女性限定] 洗 + 剪 + 護髮</h3>
          <p class="mb-2 ms-1 text-2xl font-medium text-red-500">$2,000</p>
          <div class="mb-4 text-xs tracking-wider text-gray-700">
            <p><span class="font-medium">使用對象：</span>新客</p>
            <p class="mb-2">
              <span class="font-medium">利用條件：</span>平日女性限定 /
              不可指定髮型師 / 不可與其他優惠券併用
            </p>
            <p>
              ■平日來店限定的特別價格剪髮染髮★ ■白髮染需加收1000元 ■卷髮造型免費
              ■更換為伊諾亞或伊魯米娜染髮需加收2000元（若為長髮需加收額外費用）
              【台北市/中山站/距中山站3分鐘】
            </p>
          </div>
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
      </div>
    </section>
    <section class="ml-4 w-[76%]">
      <p class="mb-4 text-lg font-medium">選擇希望來店的時間</p>
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
              <div class="w-full">不指定</div>
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
              <div class="w-full">Evan</div>
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
              <div class="w-full">Luna</div>
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
              <div class="w-full">Jade</div>
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
              <div class="w-full">Kai</div>
            </div>
          </label>
        </li>
      </ul>
      <div></div>
    </section>
  </div>
</template>
