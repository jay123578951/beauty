<script setup>
import { ref, reactive, onMounted } from "vue";
import { useRoute } from "vue-router";
import { storeToRefs } from "pinia";

import { useFlowbite } from "~/composables/useFlowbite";
import FullCalendar from "@fullcalendar/vue3";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import dayGridPlugin from "@fullcalendar/daygrid";
import { format, parseISO, addHours, addDays, subDays } from "date-fns";

const route = useRoute();
const storeId = ref(route.params.storeId);
const menuId = ref(route.query.menu_id);
const userStore = useUserStore();
const { user, isLoggedIn } = storeToRefs(userStore);
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

async function fetchMenuInfo() {
  try {
    const response = await fetch(
      `http://localhost:3001/api/stores/${storeId.value}/menus/${menuId.value}`,
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
    const response = await fetch("http://localhost:3001/api/stylists", {
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

  return appointments.map((events) => {
    const date = extractDate(events.appointment_date);
    return {
      title: "已預約",
      start: `${date}T${events.start_time}`,
      end: `${date}T${events.end_time}`,
      extendedProps: {
        icon: "@",
      },
    };
  });
}

async function fetchSchedules(stylist) {
  const startDate = calendarDateRange.value.startDate;
  const endDate = calendarDateRange.value.endDate;
  const url = "http://localhost:3001/api/appointments/schedule";
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

function handleDateSelect(selectInfo) {
  // const isLoggedIn = isLoggedIn.value;
  // const userId = user.value.uuid;
  const stylist =
    selectedStylist.value === "notSpecified" ? null : selectedStylist.value;
  const menu = menuId.value;
  const selected = parseISO(selectInfo.startStr);
  const date = format(selected, "yyyy-MM-dd");
  const currentTime = format(selected, "HH:mm:ss");
  const futureTime = format(addHours(selected, 1), "HH:mm:ss");

  if (!isLoggedIn.value) {
    window.alert("請先登入");
    return;
  }

  const data = {
    user_id: user.value.uuid,
    stylist_id: stylist,
    menu_id: menu,
    appointment_date: date,
    start_time: currentTime,
    end_time: futureTime,
  };

  if (data) {
    if (confirm("確定要預約嗎？") === true) {
      // postSchedule(data);
    }
  }

  // calendarApi.unselect();

  // if (title) {
  //   calendarApi.addEvent({
  //     id: String(Date.now()),
  //     title,
  //     start: selectInfo.startStr,
  //     end: selectInfo.endStr,
  //     allDay: selectInfo.allDay,
  //   });
  // }
}

async function postSchedule(data) {
  try {
    const response = await fetch("http://localhost:3001/api/appointments", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      const data = await response.json();
      console.log(data);
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

onMounted(() => {
  useFlowbite(() => {
    initFlowbite();
  });
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
          {{ store.menu.price }}
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
