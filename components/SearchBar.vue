<script setup>
import { useScreens } from "vue-screen-utils";

const { mapCurrent } = useScreens({
  xs: "0px",
  sm: "640px",
  md: "768px",
  lg: "1024px",
});
const columns = mapCurrent({ lg: 2 }, 1);

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
const localFormValue = reactive({
  ...props.formValue,
  location: props.formValue.location || "不指定",
  services: props.formValue.services || "不指定",
});

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
      services: localFormValue.services,
    },
  });
}
</script>

<template>
  <form class="w-full" @submit.prevent="handleSubmit()">
    <div class="flex flex-col flex-wrap md:flex-row">
      <div class="mb-3 px-3 md:w-1/2 lg:mb-0 lg:flex-1">
        <label for="store" class="block text-sm leading-6">想找的地方</label>
        <div class="relative mt-1 rounded-md shadow-sm">
          <input
            v-model="localFormValue.store"
            type="text"
            placeholder="輸入店名或地址"
            name="store"
            id="store"
            class="block w-full rounded-md border border-gray-500 py-1.5 pl-4 pr-6 ring-0 ring-inset ring-gray-300 placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-inset focus:ring-primary"
          />
        </div>
      </div>
      <div class="mb-3 px-3 md:w-1/2 lg:mb-0 lg:flex-1">
        <label for="location" class="block text-sm leading-6">地點</label>
        <div class="relative mt-1 rounded-md shadow-sm">
          <select
            v-model="localFormValue.location"
            id="location"
            name="location"
            class="block w-full rounded-md border border-gray-500 py-1.5 pl-4 pr-6 ring-0 ring-inset ring-gray-300 placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-inset focus:ring-primary"
          >
            <option>不指定</option>
            <option>台北市</option>
            <option>新北市</option>
          </select>
        </div>
      </div>
      <div class="mb-3 px-3 md:w-1/2 lg:mb-0 lg:flex-1">
        <label for="date" class="block text-sm leading-6">日期</label>
        <div class="relative mt-1 rounded-md shadow-sm">
          <VDatePicker
            v-model.range="localFormValue.dateRange"
            :columns="columns"
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
                readonly
                class="block w-full rounded-md border border-gray-500 py-1.5 pl-4 pr-6 ring-0 ring-inset ring-gray-300 placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-inset focus:ring-primary"
                placeholder="不指定"
                @click="togglePopover"
              />
            </template>
          </VDatePicker>
        </div>
      </div>
      <div class="mb-6 px-3 md:w-1/2 lg:mb-0 lg:flex-1">
        <label for="services" class="block text-sm leading-6">服務</label>
        <div class="relative mt-1 rounded-md shadow-sm">
          <select
            v-model="localFormValue.services"
            id="services"
            name="services"
            class="block w-full rounded-md border border-gray-500 py-1.5 pl-4 pr-6 ring-0 ring-inset ring-gray-300 placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-inset focus:ring-primary"
          >
            <option>不指定</option>
            <option>剪髮</option>
            <option>洗髮</option>
            <option>護髮</option>
            <option>染髮</option>
            <option>燙髮</option>
          </select>
        </div>
      </div>
      <div class="mb-0 flex flex-1 items-end px-3">
        <button
          class="focus:shadow-outline relative w-full rounded rounded-md bg-primary-dark px-4 py-[7px] text-white hover:bg-gray-700 focus:outline-none"
          type="submit"
        >
          搜尋
        </button>
      </div>
    </div>
  </form>
</template>
