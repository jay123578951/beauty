<script setup>
import { storeToRefs } from "pinia";

import FullCalendar from "@fullcalendar/vue3";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import dayGridPlugin from "@fullcalendar/daygrid";
import {
  format,
  parseISO,
  addHours,
  addDays,
  subDays,
  isAfter,
  startOfDay,
} from "date-fns";
import {
  TransitionRoot,
  TransitionChild,
  Dialog,
  DialogPanel,
  DialogTitle,
} from "@headlessui/vue";
import {
  RadioGroup,
  RadioGroupLabel,
  RadioGroupDescription,
  RadioGroupOption,
} from "@headlessui/vue";

const config = useRuntimeConfig();
const apiUrl = config.public.apiUrl;
const route = useRoute();

const storeId = ref(route.params.storeId);
const menuId = ref(route.query.menu_id);
const store = reactive({
  salon: {
    id: null,
    location: null,
    name: null,
  },
  menu: {
    id: null,
    name: null,
    description: null,
    classification: [],
    points: [],
    price: null,
    tag: null,
  },
});
const tags = reactive([
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
const tagName = computed(
  () => tags.find((tag) => tag.id === store.menu.tag).name,
);

const step = ref(1);
const showStep1 = computed(() => step.value === 1);
const showStep2 = computed(() => step.value === 2);
const showStep3 = computed(() => step.value === 3);
const showStep4 = computed(() => step.value === 4);

async function fetchMenuInfo() {
  try {
    const response = await fetch(
      `${apiUrl}/api/stores/${storeId.value}/menus/${menuId.value}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (response.ok) {
      const data = await response.json();
      Object.assign(store, data);
    }
  } catch (error) {
    console.error("Failed to fetch stores data", error);
  }
}

const stylists = ref([]);
const selectedStylist = ref("notSpecified");
const selectedStylistName = ref("不指定");

async function fetchStylists() {
  try {
    const response = await fetch(
      `${apiUrl}/api/stylists?store_id=${storeId.value}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (response.ok) {
      const data = await response.json();
      stylists.value = data;
    }
  } catch (error) {
    console.error("Failed to fetch stores data", error);
  }
}

function calculateDate() {
  const toDay = new Date();

  const startDate = subDays(toDay, 7);
  const endDate = addDays(toDay, 30);

  return {
    startDate: format(startDate, "yyyy-MM-dd"),
    endDate: format(endDate, "yyyy-MM-dd"),
  };
}
const calendarDateRange = ref(calculateDate());

function formattedCalendarEvents(data) {
  const extractDate = (dateString) =>
    new Date(dateString).toISOString().slice(0, 10);

  const { appointments } = data || {};

  if (!appointments || !Array.isArray(appointments)) return [];

  const seenStarts = new Set();

  return appointments.reduce((acc, events) => {
    const date = extractDate(events.appointment_date);
    const start = `${date}T${events.start_time}`;

    if (!seenStarts.has(start)) {
      seenStarts.add(start);
      acc.push({
        title: "已預約",
        start,
        end: `${date}T${events.end_time}`,
        extendedProps: {
          icon: "@",
        },
      });
    }

    return acc;
  }, []);
}

async function fetchSchedules(stylist) {
  const startDate = calendarDateRange.value.startDate;
  const endDate = calendarDateRange.value.endDate;
  const url = `${apiUrl}/api/appointments/schedule`;
  const fetchUrl =
    stylist !== "notSpecified"
      ? `${url}?startDate=${startDate}&endDate=${endDate}&stylistId=${stylist}`
      : `${url}?startDate=${startDate}&endDate=${endDate}`;
  try {
    const response = await fetch(fetchUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.ok) {
      const data = await response.json();
      return formattedCalendarEvents(data);
    }
  } catch (error) {
    console.error("Failed to fetch stores data", error);
  }
}

function setSchedules(schedules) {
  calendarOptions.value.events = schedules;
}

function handleGetStylistName() {
  const stylist = stylists.value.find(
    (stylist) => stylist.id === selectedStylist.value,
  );
  return stylist ? stylist.name : "不指定";
}

watch(selectedStylist, async (stylist) => {
  const schedules = await fetchSchedules(stylist);
  setSchedules(schedules);

  selectedStylistName.value = handleGetStylistName();
});

onMounted(async () => {
  await fetchMenuInfo();
  await fetchStylists();

  const stylist = selectedStylist.value;
  const schedules = await fetchSchedules(stylist);

  setSchedules(schedules);
});

const isDateCheckModalOpen = ref(false);
const isLoginModalOpen = ref(false);
const isScheduleCheckModalOpen = ref(false);
function closeModal(event) {
  switch (event) {
    case "date":
      isDateCheckModalOpen.value = false;
      break;

    case "login":
      isLoginModalOpen.value = false;
      break;

    case "schedule":
      isScheduleCheckModalOpen.value = false;
      break;

    default:
      break;
  }
}

function openModal(event) {
  switch (event) {
    case "date":
      isDateCheckModalOpen.value = true;
      break;

    case "login":
      isLoginModalOpen.value = true;
      break;

    case "schedule":
      isScheduleCheckModalOpen.value = true;
      break;

    default:
      break;
  }
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
      await closeModal("login");

      loginFormValues.value.username = null;
      loginFormValues.value.password = null;
    } else {
      error.value = !error.value;
      console.error("Login failed:", errorData);
    }
  } catch (error) {
    console.error("Network error:", error);
  }
}

const isScheduleChecked = ref(false);
const scheduleData = ref(null);
const stylist = ref(null);
const menu = ref(null);
const selected = ref(null);
const date = ref(null);
const currentTime = ref(null);
const futureTime = ref(null);
const formattedTime = computed(() =>
  selected.value
    ? `${format(selected.value, "HH:mm")}~${format(addHours(selected.value, 1), "HH:mm")}`
    : null,
);
function handleDateSelect(selectInfo) {
  stylist.value =
    selectedStylist.value === "notSpecified" ? null : selectedStylist.value;
  menu.value = menuId.value;
  selected.value = parseISO(selectInfo.dateStr);
  date.value = format(selected.value, "yyyy-MM-dd");
  currentTime.value = format(selected.value, "HH:mm:ss");
  futureTime.value = format(addHours(selected.value, 1), "HH:mm:ss");

  scheduleData.value = {
    user_id: user.value?.uuid || null,
    stylist_id: stylist,
    menu_id: menu,
    appointment_date: date,
    start_time: currentTime,
    end_time: futureTime,
  };

  const isAfterToday = isAfter(
    startOfDay(new Date(selected.value)),
    startOfDay(new Date()),
  );

  if (!isAfterToday) {
    openModal("date");
    return;
  }

  if (!isLoggedIn.value) {
    openModal("login");
    return;
  }

  if (scheduleData.value) {
    openModal("schedule");
  }
}

async function postSchedule(schedule) {
  const data = { ...schedule };

  try {
    const response = await fetch(`${apiUrl}/api/appointments`, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      const stylist = selectedStylist.value;
      const schedules = await fetchSchedules(stylist);
      await setSchedules(schedules);

      isScheduleChecked.value = null;
      step.value = 4;
    }
  } catch (error) {
    console.error("Failed to fetch stores data", error);
  }
}

const calendarOptions = ref({
  plugins: [interactionPlugin, timeGridPlugin, dayGridPlugin],

  initialView: "timeGridWeek",
  allDaySlot: false,

  height: "auto",
  eventBackgroundColor: "rgb(240 82 82)",
  eventBorderColor: "rgb(240 82 82)",
  eventTextColor: "white",

  headerToolbar: {
    start: false,
    center: false,
    end: "prev,next",
  },
  slotLabelFormat: {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  },
  slotMinTime: "09:00:00",
  slotMaxTime: "22:00:00",
  validRange: {
    start: calendarDateRange.value.startDate,
    end: calendarDateRange.value.endDate,
  },

  businessHours: {
    startTime: "00:00",
    endTime: "24:00",
    daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
  },

  selectConstraint: "businessHours",
  events: [],

  eventContent: function (arg) {
    const icon = arg.event.extendedProps.icon || "";
    const title = arg.event.title;
    const { timeText } = arg;
    return {
      html: `<span>${icon}</span> <span>${title}</span> <br> <span>${timeText}</span>`,
    };
  },
  selectable: true,
  dateClick: handleDateSelect,
});

const isReady = ref(false);
onMounted(async () => {
  await nextTick();
  setTimeout(() => {
    isReady.value = true;
  }, 1000);
});

definePageMeta({
  layout: "page",
});
</script>

<template>
  <div class="flex w-full flex-col lg:flex-row">
    <!-- Skeleton -->
    <section
      v-if="!isReady"
      class="flex w-full flex-col md:h-[calc(100vh-407px)] lg:h-[calc(100vh-491px)] lg:flex-row"
    >
      <div
        role="status"
        class="mb-8 flex h-56 max-w-sm animate-pulse items-center justify-center rounded-lg bg-primary lg:mb-0 lg:me-8 lg:w-3/12"
      >
        <svg
          class="h-10 w-10 text-primary-light"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 16 20"
        >
          <path
            d="M5 5V.13a2.96 2.96 0 0 0-1.293.749L.879 3.707A2.98 2.98 0 0 0 .13 5H5Z"
          />
          <path
            d="M14.066 0H7v5a2 2 0 0 1-2 2H0v11a1.97 1.97 0 0 0 1.934 2h12.132A1.97 1.97 0 0 0 16 18V2a1.97 1.97 0 0 0-1.934-2ZM9 13a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2Zm4 .382a1 1 0 0 1-1.447.894L10 13v-2l1.553-1.276a1 1 0 0 1 1.447.894v2.764Z"
          />
        </svg>
        <span class="sr-only">Loading...</span>
      </div>

      <div class="lg:w-9/12">
        <div role="status" class="mb-6 max-w-sm animate-pulse">
          <div class="mb-4 h-2.5 w-48 rounded-full bg-primary"></div>
          <div class="mb-2.5 h-2 max-w-[360px] rounded-full bg-primary"></div>
          <div class="mb-2.5 h-2 rounded-full bg-primary"></div>
          <div class="mb-2.5 h-2 max-w-[330px] rounded-full bg-primary"></div>
          <div class="mb-2.5 h-2 max-w-[300px] rounded-full bg-primary"></div>
          <div class="h-2 max-w-[360px] rounded-full bg-primary"></div>
          <span class="sr-only">Loading...</span>
        </div>
      </div>
    </section>

    <template v-else>
      <div
        class="flex w-full lg:h-[calc(100vh-130px-48px)] lg:overflow-hidden lg:rounded-3xl xl:h-[calc(100vh-130px-32px)]"
      >
        <div
          class="hidden w-full rounded-3xl border-r-2 border-dashed bg-white px-10 py-14 lg:block lg:w-3/12"
        >
          <div class="relative">
            <ol class="relative z-10">
              <li class="mb-10 flex items-start">
                <span
                  v-if="step > 1"
                  class="flex h-8 w-8 items-center justify-center rounded-full bg-green-200 ring-4 ring-white"
                >
                  <svg
                    class="h-3.5 w-3.5 text-green-500"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 16 12"
                  >
                    <path
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M1 5.917 5.724 10.5 15 1.5"
                    />
                  </svg>
                </span>
                <span
                  v-else
                  class="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-500 ring-4 ring-white"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    class="size-5"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </span>
                <div class="ms-4">
                  <h3 class="font-medium leading-tight">設計師</h3>
                  <p class="mt-1 text-xs text-gray-500">
                    {{ selectedStylistName }}
                  </p>
                </div>
              </li>
              <li class="mb-10 flex items-start">
                <span
                  v-if="step > 2"
                  class="flex h-8 w-8 items-center justify-center rounded-full bg-green-200 ring-4 ring-white"
                >
                  <svg
                    class="h-3.5 w-3.5 text-green-500"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 16 12"
                  >
                    <path
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M1 5.917 5.724 10.5 15 1.5"
                    />
                  </svg>
                </span>
                <span
                  v-else
                  class="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-500 ring-4 ring-white"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    class="size-5"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M6.75 2.25A.75.75 0 0 1 7.5 3v1.5h9V3A.75.75 0 0 1 18 3v1.5h.75a3 3 0 0 1 3 3v11.25a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3V7.5a3 3 0 0 1 3-3H6V3a.75.75 0 0 1 .75-.75Zm13.5 9a1.5 1.5 0 0 0-1.5-1.5H5.25a1.5 1.5 0 0 0-1.5 1.5v7.5a1.5 1.5 0 0 0 1.5 1.5h13.5a1.5 1.5 0 0 0 1.5-1.5v-7.5Z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </span>
                <div class="ms-4">
                  <h3 class="font-medium leading-tight">日期時間</h3>
                  <p class="mt-1 text-xs text-gray-500">
                    <template v-if="date && formattedTime">
                      {{ date }} {{ formattedTime }}
                    </template>
                    <template v-else> Step 2 </template>
                  </p>
                </div>
              </li>
              <li class="mb-10 flex items-start">
                <span
                  v-if="(step === 3 && isScheduleChecked) || step === 4"
                  class="flex h-8 w-8 items-center justify-center rounded-full bg-green-200 ring-4 ring-white"
                >
                  <svg
                    class="h-3.5 w-3.5 text-green-500"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 16 12"
                  >
                    <path
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M1 5.917 5.724 10.5 15 1.5"
                    />
                  </svg>
                </span>
                <span
                  v-else
                  class="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-500 ring-4 ring-white"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    class="size-5"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M1.5 6.375c0-1.036.84-1.875 1.875-1.875h17.25c1.035 0 1.875.84 1.875 1.875v3.026a.75.75 0 0 1-.375.65 2.249 2.249 0 0 0 0 3.898.75.75 0 0 1 .375.65v3.026c0 1.035-.84 1.875-1.875 1.875H3.375A1.875 1.875 0 0 1 1.5 17.625v-3.026a.75.75 0 0 1 .374-.65 2.249 2.249 0 0 0 0-3.898.75.75 0 0 1-.374-.65V6.375Zm15-1.125a.75.75 0 0 1 .75.75v.75a.75.75 0 0 1-1.5 0V6a.75.75 0 0 1 .75-.75Zm.75 4.5a.75.75 0 0 0-1.5 0v.75a.75.75 0 0 0 1.5 0v-.75Zm-.75 3a.75.75 0 0 1 .75.75v.75a.75.75 0 0 1-1.5 0v-.75a.75.75 0 0 1 .75-.75Zm.75 4.5a.75.75 0 0 0-1.5 0V18a.75.75 0 0 0 1.5 0v-.75ZM6 12a.75.75 0 0 1 .75-.75H12a.75.75 0 0 1 0 1.5H6.75A.75.75 0 0 1 6 12Zm.75 2.25a.75.75 0 0 0 0 1.5h3a.75.75 0 0 0 0-1.5h-3Z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </span>
                <div class="ms-4">
                  <h3 class="font-medium leading-tight">確認</h3>
                  <p class="mt-1 text-xs text-gray-500">
                    {{ isScheduleChecked ? "已確認" : "Step 3" }}
                  </p>
                </div>
              </li>
              <li class="flex items-start">
                <span
                  v-if="step === 4"
                  class="flex h-8 w-8 items-center justify-center rounded-full bg-green-200 ring-4 ring-white"
                >
                  <svg
                    class="h-3.5 w-3.5 text-green-500"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 16 12"
                  >
                    <path
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M1 5.917 5.724 10.5 15 1.5"
                    />
                  </svg>
                </span>
                <span
                  v-else
                  class="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-500 ring-4 ring-white"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    class="size-5"
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
                </span>
                <div class="ms-4">
                  <h3 class="font-medium leading-tight">完成</h3>
                  <p class="mt-1 text-xs text-gray-500">
                    {{ step === 4 ? "恭喜預約成功" : "Step 4" }}
                  </p>
                </div>
              </li>
            </ol>
            <div
              class="absolute left-4 top-0 z-0 h-full w-px bg-gray-200"
            ></div>
          </div>
        </div>
        <div
          class="scrollbar-hide w-full overflow-y-auto rounded-3xl bg-white px-4 py-8 lg:w-9/12 lg:px-10 lg:py-14"
        >
          <TransitionGroup
            tag="div"
            :name="step === 4 ? 'final-step-animation' : 'step-animation'"
            class="relative"
          >
            <!-- Step 1 -->
            <div v-if="step === 1" v-show="showStep1" key="step-1">
              <div class="mx-auto w-full max-w-md">
                <div class="mb-6 px-2 lg:px-0">
                  <h3 class="text-md mb-1 font-medium">設計師</h3>
                  <p class="text-sm">
                    可以選擇指定的設計師，或不指定由店家安排。
                  </p>
                </div>
                <RadioGroup v-model="selectedStylist">
                  <RadioGroupLabel class="sr-only">Server size</RadioGroupLabel>
                  <div class="mb-2">
                    <RadioGroupOption
                      as="template"
                      value="notSpecified"
                      v-slot="{ active, checked }"
                    >
                      <div
                        :class="[
                          active
                            ? 'ring-2 ring-white/60 ring-offset-2 ring-offset-primary'
                            : '',
                          checked ? 'bg-primary-light' : 'bg-white',
                        ]"
                        class="relative flex cursor-pointer rounded-lg border border-primary px-5 py-4 focus:outline-none"
                      >
                        <div class="flex w-full items-center justify-between">
                          <div class="flex w-full items-center">
                            <img
                              class="me-4 h-14 w-14 rounded-full object-cover"
                              src="/public/img/designer.jpg"
                              alt="Rounded avatar"
                            />
                            <div class="flex items-center">
                              <div class="text-sm">
                                <RadioGroupLabel
                                  as="p"
                                  :class="
                                    checked
                                      ? 'text-primary-dark'
                                      : 'text-gray-400'
                                  "
                                  class="font-medium"
                                >
                                  不指定
                                </RadioGroupLabel>
                              </div>
                            </div>
                          </div>
                          <div
                            v-show="checked"
                            class="shrink-0 text-primary-dark"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                              class="size-6"
                            >
                              <path
                                fill-rule="evenodd"
                                d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
                                clip-rule="evenodd"
                              />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </RadioGroupOption>
                  </div>
                </RadioGroup>
                <RadioGroup v-model="selectedStylist" class="mb-6">
                  <RadioGroupLabel class="sr-only">Server size</RadioGroupLabel>
                  <div class="space-y-2">
                    <RadioGroupOption
                      as="template"
                      v-for="(stylist, index) in stylists"
                      :key="index.id"
                      :value="stylist.id"
                      v-slot="{ active, checked }"
                    >
                      <div
                        :class="[
                          active
                            ? 'ring-2 ring-white/60 ring-offset-2 ring-offset-primary'
                            : '',
                          checked ? 'bg-primary-light' : 'bg-white',
                        ]"
                        class="relative flex cursor-pointer rounded-lg border border-primary px-5 py-4 focus:outline-none"
                      >
                        <div class="flex w-full items-center justify-between">
                          <div class="flex w-full items-center">
                            <img
                              class="me-4 h-14 w-14 rounded-full object-cover"
                              src="/public/img/designer.jpg"
                              alt="Rounded avatar"
                            />
                            <div class="flex flex-col">
                              <RadioGroupLabel
                                as="p"
                                :class="
                                  checked
                                    ? 'text-primary-dark'
                                    : 'text-gray-400'
                                "
                                class="text-base font-medium"
                              >
                                {{ stylist.name }}
                              </RadioGroupLabel>
                              <RadioGroupDescription
                                as="span"
                                class="inline text-xs"
                                :class="
                                  checked
                                    ? 'text-primary-dark'
                                    : 'text-gray-400'
                                "
                              >
                                {{ stylist.specialty }}
                              </RadioGroupDescription>
                            </div>
                          </div>
                          <div
                            v-show="checked"
                            class="shrink-0 text-primary-dark"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                              class="size-6"
                            >
                              <path
                                fill-rule="evenodd"
                                d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
                                clip-rule="evenodd"
                              />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </RadioGroupOption>
                  </div>
                </RadioGroup>
                <div class="text-end">
                  <button
                    type="button"
                    @click="step = 2"
                    class="rounded-lg border border-primary-dark bg-primary-dark px-4 py-2 text-sm text-white hover:bg-gray-700"
                  >
                    下一步
                  </button>
                </div>
              </div>
            </div>

            <!-- Step 2 -->
            <div v-if="step === 2" v-show="showStep2" key="step-2">
              <div class="m-auto xl:max-w-3xl">
                <div class="flex items-center justify-between space-x-2">
                  <div class="mb-6 px-2 lg:px-0">
                    <h3 class="text-md mb-1 font-medium">日期時間</h3>
                    <p class="text-sm">在底下方點擊尚未預約的時段開始預約。</p>
                  </div>
                  <button
                    type="button"
                    @click="step = 1"
                    class="min-w-fit rounded-lg border border-primary-dark px-4 py-2 text-sm hover:border-gray-400 hover:text-gray-500"
                  >
                    上一步
                  </button>
                </div>
                <div
                  class="scrollbar-hide w-full snap-x overflow-x-auto scroll-smooth xl:overflow-hidden"
                >
                  <FullCalendar
                    class="min-w-[48rem]"
                    :options="calendarOptions"
                  />
                </div>
              </div>
            </div>

            <!-- Step 3 -->
            <div v-if="step === 3" v-show="showStep3" key="step-3">
              <form
                class="m-auto lg:max-w-md"
                @submit.prevent="postSchedule(scheduleData)"
              >
                <div class="mb-6 text-sm">
                  <div class="mb-6 flex flex-col items-center">
                    <img
                      :src="store.menu.img || '/img/hairStyle.jpg'"
                      class="mb-4 block h-32 w-32 rounded-lg object-cover"
                      alt="..."
                    />
                    <div class="max-w-96 text-center">
                      <h2 class="mb-2 text-xl font-medium">
                        {{ store.menu.name }}
                      </h2>
                      <p class="text-xs text-gray-700">
                        {{ store.menu.description }}
                      </p>
                    </div>
                  </div>
                  <div class="mb-4 flex justify-between border-y py-4">
                    <ul class="space-y-1 text-gray-500">
                      <li>價格</li>
                      <li>優惠券</li>
                    </ul>
                    <ul class="space-y-1 text-end">
                      <li>${{ store.menu.price }}</li>
                      <li>-</li>
                      <li class="text-2xl font-medium text-red-500">
                        ${{ store.menu.price }}
                      </li>
                    </ul>
                  </div>
                  <div class="mb-6 flex justify-between">
                    <ul class="space-y-1 text-gray-500">
                      <li>類別</li>
                      <li>設計師</li>
                      <li>預約人</li>
                      <li>聯絡電話</li>
                    </ul>
                    <ul class="space-y-1 text-end">
                      <li>{{ tagName }}</li>
                      <li></li>
                      <li>
                        <div v-if="selectedStylist === 'notSpecified'">
                          <p>不指定</p>
                        </div>
                        <div v-else>
                          <p>
                            {{
                              stylists.find(
                                (stylist) => stylist.id === selectedStylist,
                              ).name
                            }}
                          </p>
                        </div>
                      </li>
                      <li>{{ user.username }}</li>
                      <li>0901234567</li>
                    </ul>
                  </div>
                  <div
                    class="mb-4 flex justify-between rounded-lg bg-gray-100 p-4"
                  >
                    <ul class="w-1/3 space-y-1 text-gray-500">
                      <li>注意事項 *</li>
                    </ul>
                    <ul class="w-2/3 space-y-1">
                      <li class="mb-4">
                        由於是私人沙龍，可能會有透過電話預約已經被填滿的情況。
                        若是希望在10分鐘內抵達，建議您透過電話預約。
                        若預約時間可能會遲到，請不吝與我們聯繫，並撥打電話告知。
                      </li>
                      <li class="flex items-center">
                        <input
                          v-model="isScheduleChecked"
                          type="checkbox"
                          id="precautions"
                          name="precautions"
                          class="me-2 focus:ring-0"
                          required
                        />
                        <label for="precautions">
                          我瞭解了
                          <span class="text-xs">(必選)</span>
                        </label>
                      </li>
                    </ul>
                  </div>
                  <ul class="divide-y rounded-lg border">
                    <li class="flex justify-between p-4">
                      <ul class="w-1/3 space-y-1 text-gray-500">
                        <li>想了解什麼</li>
                      </ul>
                      <ul class="w-2/3 space-y-1">
                        <li class="flex items-center">
                          <input
                            type="checkbox"
                            id="knowWhat01"
                            name="precautions"
                            class="me-2"
                          />
                          <label for="knowWhat01">適合自己的風格</label><br />
                        </li>
                        <li class="flex items-center">
                          <input
                            type="checkbox"
                            id="knowWhat02"
                            name="precautions"
                            class="me-2"
                          />
                          <label for="knowWhat02">關於日常的整理方法</label>
                        </li>
                        <li class="flex items-center">
                          <input
                            type="checkbox"
                            id="knowWhat03"
                            name="precautions"
                            class="me-2"
                          />
                          <label for="knowWhat03">關於其他推薦的服務</label>
                        </li>
                      </ul>
                    </li>
                    <li class="flex justify-between p-4">
                      <ul class="w-1/3 space-y-1 text-gray-500">
                        <li>服務請求</li>
                      </ul>
                      <ul class="w-2/3 space-y-1">
                        <li class="flex items-center">
                          <input
                            type="radio"
                            id="service01"
                            name="precautions"
                            class="me-2"
                          />
                          <label for="service01">想要享受談話的樂趣</label>
                        </li>
                        <li class="flex items-center">
                          <input
                            type="radio"
                            id="service02"
                            name="precautions"
                            class="me-2"
                          />
                          <label for="service02">想要安靜的度過時間</label>
                        </li>
                      </ul>
                    </li>
                    <li class="flex justify-between p-4">
                      <ul class="w-1/3 space-y-1 text-gray-500">
                        <li>請求/諮詢</li>
                      </ul>
                      <ul class="w-2/3 space-y-1">
                        <li class="flex items-center">
                          <textarea
                            id="consult"
                            name="consult"
                            rows="4"
                            cols="50"
                          ></textarea>
                        </li>
                      </ul>
                    </li>
                  </ul>
                </div>
                <div class="flex items-center justify-end space-x-4">
                  <button
                    type="button"
                    class="rounded-lg border border-primary-dark px-4 py-2 text-sm hover:border-gray-400 hover:text-gray-500"
                    @click="
                      step = 2;
                      isScheduleChecked = null;
                    "
                  >
                    上一步
                  </button>
                  <button
                    type="submit"
                    class="rounded-lg border px-4 py-2 text-sm text-white"
                    :class="
                      isScheduleChecked
                        ? 'border-primary-dark bg-primary-dark hover:bg-gray-700'
                        : 'cursor-not-allowed border-gray-400 bg-gray-400 hover:bg-gray-400'
                    "
                    :disabled="!isScheduleChecked"
                  >
                    我要預約
                  </button>
                </div>
              </form>
            </div>

            <!-- Step 4 -->
            <div v-if="step === 4" v-show="showStep4" key="step-4">
              <div class="m-auto max-w-96 py-24 text-center">
                <div class="mb-2 flex justify-center text-emerald-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    class="h-20 w-20"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </div>
                <h3 class="mb-1 text-lg font-medium leading-6">預約成功</h3>
                <p class="mb-6 text-sm text-gray-500">
                  可以到預約履歷查看詳細資訊！
                </p>
                <button
                  type="button"
                  class="rounded-full border border-gray-400 px-6 py-1.5 text-sm text-gray-500 hover:border-primary-dark hover:text-primary-dark focus-visible:outline-none"
                  @click="step = 2"
                >
                  前往查看
                </button>
              </div>
            </div>
          </TransitionGroup>
        </div>
      </div>

      <!-- 檢查預約時間 modal -->
      <template>
        <TransitionRoot appear :show="isDateCheckModalOpen" as="template">
          <Dialog as="div" @close="closeModal('date')" class="relative z-40">
            <TransitionChild
              as="template"
              enter="duration-300 ease-out"
              enter-from="opacity-0"
              enter-to="opacity-100"
              leave="duration-200 ease-in"
              leave-from="opacity-100"
              leave-to="opacity-0"
            >
              <div class="fixed inset-0 bg-black/25" />
            </TransitionChild>

            <div class="fixed inset-0 overflow-y-auto">
              <div
                class="flex min-h-full items-center justify-center p-4 text-center"
              >
                <TransitionChild
                  as="template"
                  enter="duration-300 ease-out"
                  enter-from="opacity-0 scale-95"
                  enter-to="opacity-100 scale-100"
                  leave="duration-200 ease-in"
                  leave-from="opacity-100 scale-100"
                  leave-to="opacity-0 scale-95"
                >
                  <DialogPanel
                    class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all"
                  >
                    <div
                      class="mb-4 me-2 w-fit rounded-lg bg-red-100 p-2 text-red-500"
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
                          d="M18.364 18.364A9 9 0 0 0 5.636 5.636m12.728 12.728A9 9 0 0 1 5.636 5.636m12.728 12.728L5.636 5.636"
                        />
                      </svg>
                    </div>
                    <DialogTitle
                      as="h3"
                      class="mb-2 flex items-center text-lg font-medium leading-6 text-gray-900"
                    >
                      請重新選擇日期
                    </DialogTitle>
                    <p class="text-sm text-gray-600">
                      只能預約<span
                        class="mx-1 rounded-md bg-gray-100 px-2 py-1 font-semibold"
                        >今日</span
                      >之後的日期。
                    </p>
                    <div class="mt-8 flex items-center justify-end">
                      <button
                        type="button"
                        @click="closeModal('date')"
                        class="rounded-lg border border-primary-dark bg-primary-dark px-4 py-2 text-sm text-white hover:bg-gray-700"
                      >
                        了解
                      </button>
                    </div>
                  </DialogPanel>
                </TransitionChild>
              </div>
            </div>
          </Dialog>
        </TransitionRoot>
      </template>
      <!-- 登入 modal -->
      <template>
        <TransitionRoot appear :show="isLoginModalOpen" as="template">
          <Dialog as="div" @close="closeModal('login')" class="relative z-40">
            <TransitionChild
              as="template"
              enter="duration-300 ease-out"
              enter-from="opacity-0"
              enter-to="opacity-100"
              leave="duration-200 ease-in"
              leave-from="opacity-100"
              leave-to="opacity-0"
            >
              <div class="fixed inset-0 bg-black/25" />
            </TransitionChild>

            <div class="fixed inset-0 overflow-y-auto">
              <div
                class="flex min-h-full items-center justify-center p-4 text-center"
              >
                <TransitionChild
                  as="template"
                  enter="duration-300 ease-out"
                  enter-from="opacity-0 scale-95"
                  enter-to="opacity-100 scale-100"
                  leave="duration-200 ease-in"
                  leave-from="opacity-100 scale-100"
                  leave-to="opacity-0 scale-95"
                >
                  <DialogPanel
                    class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all"
                  >
                    <DialogTitle
                      as="h3"
                      class="text-lg font-medium leading-6 text-gray-900"
                    >
                      請先登入
                    </DialogTitle>
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
                  </DialogPanel>
                </TransitionChild>
              </div>
            </div>
          </Dialog>
        </TransitionRoot>
      </template>
      <!-- 確認預約 modal -->
      <template>
        <TransitionRoot appear :show="isScheduleCheckModalOpen" as="template">
          <Dialog
            as="div"
            @close="closeModal('schedule')"
            class="relative z-40"
          >
            <TransitionChild
              as="template"
              enter="duration-300 ease-out"
              enter-from="opacity-0"
              enter-to="opacity-100"
              leave="duration-200 ease-in"
              leave-from="opacity-100"
              leave-to="opacity-0"
            >
              <div class="fixed inset-0 bg-black/25" />
            </TransitionChild>

            <div class="fixed inset-0 w-screen overflow-y-auto">
              <div class="flex min-h-full items-center justify-center p-4">
                <TransitionChild
                  as="template"
                  enter="duration-300 ease-out"
                  enter-from="opacity-0 scale-95"
                  enter-to="opacity-100 scale-100"
                  leave="duration-200 ease-in"
                  leave-from="opacity-100 scale-100"
                  leave-to="opacity-0 scale-95"
                >
                  <DialogPanel
                    class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all"
                  >
                    <div
                      class="mb-4 me-2 w-fit rounded-lg bg-green-100 p-2 text-green-500"
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
                          d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                        />
                      </svg>
                    </div>
                    <DialogTitle
                      as="h3"
                      class="mb-2 flex items-center text-lg font-medium leading-6 text-gray-900"
                    >
                      再次確認時段
                    </DialogTitle>
                    <div class="text-sm text-gray-600">
                      確定要預約
                      <span
                        class="mx-1 rounded-md bg-gray-100 px-2 py-1 font-semibold"
                        >{{ date }}</span
                      >
                      <span
                        class="mx-1 rounded-md bg-gray-100 px-2 py-1 font-semibold"
                        >{{ formattedTime }}</span
                      >
                      此時段？
                    </div>
                    <div class="mt-8 flex items-center justify-end space-x-2">
                      <button
                        type="button"
                        @click="closeModal('schedule')"
                        class="rounded-lg border border-primary-dark px-4 py-2 text-sm hover:border-gray-400 hover:text-gray-500"
                      >
                        取消
                      </button>
                      <button
                        type="button"
                        @click="
                          closeModal('schedule');
                          step = 3;
                        "
                        class="rounded-lg border border-primary-dark bg-primary-dark px-4 py-2 text-sm text-white hover:bg-gray-700"
                      >
                        下一步
                      </button>
                    </div>
                  </DialogPanel>
                </TransitionChild>
              </div>
            </div>
          </Dialog>
        </TransitionRoot>
      </template>
    </template>
  </div>
</template>

<style scoped>
:deep(.fc-scrollgrid) {
  background-color: white !important;
}

:deep(.fc-day-today) {
  background-color: transparent !important;
}

:deep(.fc .fc-timegrid-slot) {
  height: 2rem !important;
}

:deep(.fc .fc-toolbar) {
  justify-content: start;
}

:deep(.fc-header-toolbar) {
  margin-bottom: 0.5rem !important;
}

:deep(.fc .fc-button-primary) {
  background-color: white;
  border: none;
  padding: 0.25rem;
  height: fit-content;

  .fc-icon {
    color: #687586;
  }

  &:hover {
    background-color: white !important;

    .fc-icon {
      color: #23262b;
    }
  }

  &:focus {
    outline-width: 0px;
    box-shadow: none;
  }

  &:active {
    outline-width: 0px;
    box-shadow: none !important;
  }
}

:deep(.fc-prev-button) {
  margin-right: 0.5rem;
}

.scrollbar-hide {
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}

.scrollbar-hide::-webkit-scrollbar {
  display: none; /* Chrome, Safari, and Opera */
}

.step-animation-enter-active {
  transition: all 0.5s ease-in-out 0.2s;
  width: 100%;
}
.step-animation-leave-active {
  transition: all 0.1s ease-in 0.1s;
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
}
.step-animation-enter-from {
  transform: translateX(1rem);
  opacity: 0;
}
.step-animation-leave-to {
  transform: translateX(-1rem);
  opacity: 1;
}

.final-step-animation-enter-active {
  transition: all 0.2s ease-in-out 0.2s;
  width: 100%;
}
.final-step-animation-leave-active {
  transition: all 0.1s ease-in;
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
}
.final-step-animation-enter-from {
  transform: scale(0.8);
  opacity: 0;
}
.final-step-animation-leave-to {
  transform: scale(1);
  opacity: 1;
}
</style>
