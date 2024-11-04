<script setup>
import { ref, reactive, watch } from "vue";

const popover = ref({
  visibility: "click",
  placement: "bottom",
});

const props = defineProps({
  formValue: {
    type: Object,
    required: true,
  },
});
const localFormValue = reactive({ ...props.formValue });

const emit = defineEmits(["update:formValue"]);
watch(
  localFormValue,
  (newDate) => {
    emit("update:formValue", newDate);
  },
  { deep: true },
);

function handleSubmit() {
  navigateTo({
    path: "/salon",
    query: {
      store: localFormValue.store,
      location: localFormValue.location,
      startDate: new Date(localFormValue.dateRange.start).toISOString(),
      endDate: new Date(localFormValue.dateRange.end).toISOString(),
      service: localFormValue.service,
    },
  });
}
</script>

<template>
  <form class="w-full" @submit.prevent="handleSubmit()">
    <div class="flex">
      <div class="mb-6 flex-1 px-3 md:mb-0">
        <label for="store" class="block text-sm leading-6">店家名</label>
        <div class="relative mt-1 rounded-md shadow-sm">
          <input
            v-model="localFormValue.store"
            type="text"
            name="store"
            id="store"
            class="block w-full rounded-md border border-gray-500 py-1.5 pl-4 pr-6 ring-0 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            required
          />
        </div>
      </div>
      <div class="mb-6 flex-1 px-3 md:mb-0">
        <label for="location" class="block text-sm leading-6">地點</label>
        <div class="relative mt-1 rounded-md shadow-sm">
          <select
            v-model="localFormValue.location"
            id="location"
            name="location"
            class="block w-full appearance-none rounded-md border border-gray-500 py-1.5 pl-4 pr-6 ring-0 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          >
            <option>不指定</option>
            <option>台北市</option>
            <option>新北市</option>
          </select>
        </div>
      </div>
      <div class="mb-6 flex-1 px-3 md:mb-0">
        <label for="date" class="block text-sm leading-6">日期</label>
        <div class="relative mt-1 rounded-md shadow-sm">
          <VDatePicker
            v-model.range="localFormValue.dateRange"
            :columns="2"
            :popover="popover"
            @drag="dragValue = $event"
          >
            <template
              #default="{ inputValue, togglePopover }"
              #day-popover="{ format }"
            >
              <input
                :value="
                  inputValue.start === inputValue.end
                    ? `${inputValue.start}`
                    : `${inputValue.start} - ${inputValue.end}`
                "
                type="text"
                name="date"
                id="date"
                autocomplete="off"
                class="block w-full rounded-md border border-gray-500 py-1.5 pl-4 pr-6 ring-0 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                placeholder="不指定"
                @click="togglePopover"
              />
            </template>
          </VDatePicker>
        </div>
      </div>
      <div class="mb-6 flex-1 px-3 md:mb-0">
        <label for="service" class="block text-sm leading-6">服務</label>
        <div class="relative mt-1 rounded-md shadow-sm">
          <select
            v-model="localFormValue.service"
            id="service"
            name="service"
            class="block w-full appearance-none rounded-md border border-gray-500 py-1.5 pl-4 pr-6 ring-0 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          >
            <option>不指定</option>
            <option>剪髮</option>
            <option>洗髮</option>
          </select>
        </div>
      </div>
      <div class="mb-6 flex flex-1 items-end px-3 md:mb-0 md:w-1/3">
        <button
          class="focus:shadow-outline bg-primary-dark relative w-full rounded px-4 py-[7px] text-white hover:bg-gray-700 focus:outline-none"
          type="submit"
        >
          搜尋
        </button>
      </div>
    </div>
  </form>
</template>
