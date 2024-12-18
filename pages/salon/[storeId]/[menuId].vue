<script setup>
import { ref, reactive, onMounted } from "vue";
import { useRoute } from "vue-router";
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
} from "date-fns";
import {
  TransitionRoot,
  TransitionChild,
  Dialog,
  DialogPanel,
  DialogTitle,
} from "@headlessui/vue";

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

const config = useRuntimeConfig();
const apiUrl = config.public.apiUrl;
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

async function fetchStylists() {
  try {
    const response = await fetch(`${apiUrl}/api/stylists`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

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

watch(selectedStylist, async (stylist) => {
  const schedules = await fetchSchedules(stylist);
  setSchedules(schedules);
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
    const response = await fetch("http://localhost:3001/api/auth/login", {
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

function handleDateSelect(selectInfo) {
  stylist.value =
    selectedStylist.value === "notSpecified" ? null : selectedStylist.value;
  menu.value = menuId.value;
  selected.value = parseISO(selectInfo.startStr);
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

  const isAfterToday = isAfter(new Date(selected.value), new Date());

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
      await closeModal("schedule");

      isScheduleChecked.value = null;
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
  // lazyFetching: true,
  // initialEvents: [
  //   {
  //     title: "已預約",
  //     start: "2024-12-06T12:00:00",
  //     end: "2024-12-06T13:00:00",
  //     extendedProps: {
  //       icon: "@",
  //     },
  //   },
  //   {
  //     title: "已預約",
  //     start: "2024-12-06T13:00:00",
  //     end: "2024-12-06T14:00:00",
  //     extendedProps: {
  //       icon: "@",
  //     },
  //   },
  //   {
  //     title: "已預約",
  //     start: "2024-12-07T14:00:00",
  //     end: "2024-12-07T15:00:00",
  //     extendedProps: {
  //       icon: "@",
  //     },
  //   },
  // ],
  eventContent: function (arg) {
    const icon = arg.event.extendedProps.icon || "";
    const title = arg.event.title;
    const { timeText } = arg;
    return {
      html: `<span>${icon}</span> <span>${title}</span> <br> <span>${timeText}</span>`,
    };
  },
  selectable: true,
  select: handleDateSelect,
});

definePageMeta({
  layout: "page",
});
</script>

<template>
  <div class="flex overflow-hidden">
    <div class="h-fit w-3/12 rounded-3xl bg-white p-8">
      <div>
        <div class="mb-2">
          <span
            class="me-1 rounded bg-red-500 px-3 py-1 text-sm font-medium text-white"
            >{{ tagsName[store.menu.tag]?.name }}</span
          >
        </div>
        <h3 class="mb-1 text-xl font-medium">{{ store.menu.name }}</h3>
        <p class="mb-2 ms-1 text-2xl font-medium text-red-500">
          ${{ store.menu.price }}
        </p>
        <div class="mb-4 text-xs tracking-wider text-gray-700">
          <p>{{ store.menu.description }}</p>
        </div>
        <ul class="mb-1 flex">
          <li v-for="(tag, index) in store.menu.classification" :key="index">
            <span
              class="me-1 rounded bg-red-100 px-3 py-1 text-xs font-medium text-red-400"
              >{{ tag }}</span
            >
          </li>
        </ul>
        <ul class="flex">
          <li v-for="(tag, index) in store.menu.points" :key="index">
            <span
              class="me-1 rounded bg-gray-100 px-3 py-1 text-xs font-medium text-gray-500"
              >{{ tag }}</span
            >
          </li>
        </ul>
      </div>
    </div>
    <div class="w-9/12 p-8">
      <div class="mb-4">
        <p class="mb-1 text-2xl font-medium">選擇來店的時間</p>
        <p class="text-sm">可以選擇指定的設計師，並在想要的時間內點擊預約！</p>
      </div>
      <ul class="mb-8 flex flex-wrap">
        <li>
          <input
            v-model="selectedStylist"
            type="radio"
            id="notSpecified"
            name="designer"
            value="notSpecified"
            class="peer hidden"
            required
          />
          <label
            for="notSpecified"
            class="mr-2 inline-flex cursor-pointer items-center justify-between rounded-full border-2 border-gray-200 bg-white px-2 py-1 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-600 peer-checked:border-blue-600 peer-checked:text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300 dark:peer-checked:text-gray-300"
          >
            <img
              class="h-8 w-8 rounded-full object-cover"
              src="/img/designer.jpg"
              alt="Rounded avatar"
            />
            <div class="block">
              <div class="mx-2 w-full text-sm">不指定</div>
            </div>
          </label>
        </li>
        <li v-for="(stylist, index) in stylists" :key="index">
          <input
            v-model="selectedStylist"
            type="radio"
            name="designer"
            :id="stylist.id"
            :value="stylist.id"
            class="peer hidden"
            required
          />
          <label
            :for="stylist.id"
            class="mr-2 inline-flex cursor-pointer items-center justify-between rounded-full border-2 border-gray-200 bg-white px-2 py-1 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-600 peer-checked:border-blue-600 peer-checked:text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300 dark:peer-checked:text-gray-300"
          >
            <img
              class="h-8 w-8 rounded-full object-cover"
              :src="stylist.photo || '/img/designer.jpg'"
              alt="Rounded avatar"
            />
            <div class="block">
              <div class="mx-2 w-full text-sm">{{ stylist.name }}</div>
            </div>
          </label>
        </li>
      </ul>
      <div class="overflow-hidden rounded-3xl bg-white p-8">
        <FullCalendar :options="calendarOptions" />
      </div>
    </div>
  </div>
  <!-- 檢查預約時間 modal -->
  <div>
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
                <DialogTitle
                  as="h3"
                  class="mb-4 text-lg font-medium leading-6 text-gray-900"
                >
                  請重新選擇日期
                </DialogTitle>
                <p class="mb-4">只能預約「今日」之後的日期。</p>
                <button
                  class="focus:shadow-outline rounded bg-gray-800 px-4 py-2 font-bold text-white hover:bg-gray-700 focus:outline-none"
                  type="button"
                  @click="closeModal('date')"
                >
                  了解
                </button>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>
  </div>
  <!-- 登入 modal -->
  <div>
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
  </div>
  <!-- 確認預約 modal -->
  <div>
    <TransitionRoot appear :show="isScheduleCheckModalOpen" as="template">
      <Dialog as="div" @close="closeModal('schedule')" class="relative z-40">
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
                <DialogTitle
                  as="h3"
                  class="mb-5 text-xl font-medium leading-6 text-gray-900"
                >
                  {{ store.salon.name }}
                </DialogTitle>
                <form @submit.prevent="postSchedule(scheduleData)">
                  <div class="mb-6 text-sm">
                    <div class="mb-4 flex justify-between border-b pb-4">
                      <ul class="w-1/3 space-y-1 text-gray-500">
                        <li>方案</li>
                        <li>設計師</li>
                      </ul>
                      <ul class="w-2/3 space-y-1">
                        <li>{{ store.menu.name }}</li>
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
                      </ul>
                    </div>
                    <div class="mb-4 flex justify-between border-b pb-4">
                      <ul class="w-1/3 space-y-1 text-gray-500">
                        <li>價格</li>
                        <li>優惠券</li>
                        <li>總計</li>
                      </ul>
                      <ul class="w-2/3 space-y-1">
                        <li>${{ store.menu.price }}</li>
                        <li>-</li>
                        <li class="text-lg font-medium text-red-500">
                          ${{ store.menu.price }}
                        </li>
                      </ul>
                    </div>
                    <div class="mb-4 flex justify-between border-b pb-4">
                      <ul class="w-1/3 space-y-1 text-gray-500">
                        <li>預約人</li>
                        <li>聯絡電話</li>
                      </ul>
                      <ul class="w-2/3 space-y-1">
                        <li>{{ user.username }}</li>
                        <li>0901234567</li>
                      </ul>
                    </div>
                    <div class="mb-4 flex justify-between border-b pb-4">
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
                    <div class="mb-4 flex justify-between border-b pb-4">
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
                    </div>
                    <div class="mb-4 flex justify-between border-b pb-4">
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
                    </div>
                    <div class="mb-4 flex justify-between border-b pb-4">
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
                    </div>
                  </div>
                  <div class="flex items-center justify-between">
                    <button
                      type="submit"
                      class="focus:shadow-outline me-4 rounded bg-primary-dark px-4 py-2 font-bold text-white hover:bg-gray-700 focus:outline-none"
                      :class="
                        isScheduleChecked ||
                        'cursor-not-allowed bg-gray-500 hover:bg-gray-500'
                      "
                      :disabled="!isScheduleChecked"
                    >
                      我要預約
                    </button>
                    <button
                      type="button"
                      class="inline-block align-baseline text-sm text-gray-500 hover:text-primary-dark"
                      @click="
                        closeModal('schedule');
                        isScheduleChecked = null;
                      "
                    >
                      下次一定
                    </button>
                  </div>
                </form>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>
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

:deep(.fc-header-toolbar) {
  margin-bottom: 1rem !important;
}

:deep(.fc-button-primary) {
  background-color: #23262b;
  border-color: #23262b;
  padding: 0.25rem;
  border-radius: 100% !important;
  height: fit-content;
}

:deep(.fc-prev-button) {
  margin-right: 0.5rem;
}
</style>
