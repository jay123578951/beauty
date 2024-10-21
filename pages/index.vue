<script setup></script>

<template>
  <div>
    <NuxtLayout name="header"></NuxtLayout>

    <main>
      <section
        class="background-main flex min-h-[60vh] flex-col items-center justify-between rounded-2xl bg-orange-100 bg-cover bg-local bg-center p-4"
      >
        <div class="w-full max-w-7xl p-12">
          <h1 class="mb-3 text-6xl font-bold text-white text-opacity-[85%]">
            完美造型，隨時隨地
          </h1>
          <p class="text-2xl text-white text-opacity-[85%]">
            快速預約，輕鬆找到最適合你的髮型設計師！
          </p>
        </div>
        <div class="flex w-full max-w-7xl rounded-2xl bg-white p-3">
          <form class="w-full">
            <div class="flex">
              <div class="mb-6 flex-1 px-3 md:mb-0">
                <label for="store" class="block text-sm leading-6 text-gray-900"
                  >店家名</label
                >
                <div class="relative mt-1 rounded-md shadow-sm">
                  <input
                    type="text"
                    name="store"
                    id="store"
                    class="block w-full rounded-md border border-gray-500 py-1.5 pl-7 pr-20 text-gray-900 ring-0 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
              <div class="mb-6 flex-1 px-3 md:mb-0">
                <label
                  for="location"
                  class="block text-sm leading-6 text-gray-900"
                  >地點</label
                >
                <div class="relative mt-1 rounded-md shadow-sm">
                  <select
                    id="location"
                    name="location"
                    class="block w-full appearance-none rounded-md border border-gray-500 py-1.5 pl-7 pr-20 text-gray-900 ring-0 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  >
                    <option>不指定</option>
                    <option>台北市</option>
                    <option>新北市</option>
                  </select>
                  <div
                    class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700"
                  >
                    <svg
                      class="h-4 w-4 fill-current"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                    >
                      <path
                        d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"
                      />
                    </svg>
                  </div>
                </div>
              </div>
              <div class="mb-6 flex-1 px-3 md:mb-0">
                <!-- <label for="date" class="block text-sm leading-6 text-gray-900"
                  >日期</label
                > -->
                <!-- <div class="relative mt-1 rounded-md shadow-sm">
                  <input
                    type="text"
                    name="date"
                    id="date"
                    class="block w-full rounded-md border border-gray-500 py-1.5 pl-7 pr-20 text-gray-900 ring-0 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    placeholder="不指定"
                  />
                </div> -->
              </div>
              <div class="mb-6 flex-1 px-3 md:mb-0">
                <label
                  for="savice"
                  class="block text-sm leading-6 text-gray-900"
                  >服務</label
                >
                <div class="relative mt-1 rounded-md shadow-sm">
                  <select
                    id="savice"
                    name="savice"
                    class="block w-full appearance-none rounded-md border border-gray-500 py-1.5 pl-7 pr-20 text-gray-900 ring-0 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  >
                    <option>不指定</option>
                    <option>剪髮</option>
                    <option>洗髮</option>
                  </select>
                  <div
                    class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700"
                  >
                    <svg
                      class="h-4 w-4 fill-current"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                    >
                      <path
                        d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"
                      />
                    </svg>
                  </div>
                </div>
              </div>
              <div class="mb-6 flex flex-1 items-end px-3 md:mb-0 md:w-1/3">
                <button
                  class="focus:shadow-outline relative w-full rounded bg-gray-800 px-4 py-[7px] text-white hover:bg-gray-700 focus:outline-none"
                  type="button"
                >
                  搜尋
                </button>
              </div>
            </div>
          </form>
        </div>
      </section>
    </main>
  </div>
</template>

<style>
.background-main {
  background-image: url("/assets/img/indexBanner.jpg");
}

.custom-input {
  border: 1px solid #4a90e2 !important; /* 覆蓋預設邊框 */
}
</style>
