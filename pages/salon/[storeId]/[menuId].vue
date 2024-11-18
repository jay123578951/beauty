<script setup>
import { ref } from "vue";
// import { useRoute } from "vue-router";
import FullCalendar from "@fullcalendar/vue3";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";

// const route = useRoute();
// const menuId = route.params.menuId;

function handleDateSelect(selectInfo) {
  let title = prompt("Please enter a new title for your event");
  let calendarApi = selectInfo.view.calendar;

  calendarApi.unselect();

  if (title) {
    calendarApi.addEvent({
      id: String(Date.now()),
      title,
      start: selectInfo.startStr,
      end: selectInfo.endStr,
      allDay: selectInfo.allDay,
    });
  }
}

const calendarOptions = ref({
  plugins: [interactionPlugin, timeGridPlugin],

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

  businessHours: {
    startTime: "00:00",
    endTime: "24:00",
    daysOfWeek: [1, 2, 3, 4],
  },

  selectConstraint: "businessHours",
  initialEvents: [
    {
      title: "已預約",
      start: "2024-11-11T12:00:00",
      end: "2024-11-11T13:00:00",
      extendedProps: {
        icon: "@",
      },
    },
    {
      title: "已預約",
      start: "2024-11-11T13:00:00",
      end: "2024-11-11T14:00:00",
      extendedProps: {
        icon: "@",
      },
    },
    {
      title: "已預約",
      start: "2024-11-12T14:00:00",
      end: "2024-11-12T15:00:00",
      extendedProps: {
        icon: "@",
      },
    },
  ],
  eventContent: function (arg) {
    console.log(arg);
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
  <div class="flex">
    <div class="h-fit w-[24%] rounded-2xl border border-gray-200">
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
    </div>
    <div class="ml-8 w-[76%]">
      <div class="mb-4">
        <p class="mb-1 text-2xl font-medium">選擇來店的時間</p>
        <p class="text-sm">可以選擇指定的設計師，並在想要的時間內點擊預約！</p>
      </div>
      <ul class="flex flex-wrap">
        <li>
          <input
            type="radio"
            id="designer-0"
            name="designer"
            value="designer-0"
            class="peer hidden"
            required
          />
          <label
            for="designer-0"
            class="mr-2 inline-flex cursor-pointer items-center justify-between rounded-full border-2 border-gray-200 bg-white px-2 py-1 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-600 peer-checked:border-blue-600 peer-checked:text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300 dark:peer-checked:text-gray-300"
          >
            <img
              class="h-8 w-8 rounded-full object-cover"
              src="/assets/img/designer.jpg"
              alt="Rounded avatar"
            />
            <div class="block">
              <div class="mx-2 w-full text-sm">不指定</div>
            </div>
          </label>
        </li>
        <li>
          <input
            type="radio"
            id="designer-1"
            name="designer"
            value="designer-1"
            class="peer hidden"
            required
          />
          <label
            for="designer-1"
            class="mr-2 inline-flex cursor-pointer items-center justify-between rounded-full border-2 border-gray-200 bg-white px-2 py-1 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-600 peer-checked:border-blue-600 peer-checked:text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300 dark:peer-checked:text-gray-300"
          >
            <img
              class="h-8 w-8 rounded-full object-cover"
              src="/assets/img/designer.jpg"
              alt="Rounded avatar"
            />
            <div class="block">
              <div class="mx-2 w-full text-sm">Evan</div>
            </div>
          </label>
        </li>
        <li>
          <input
            type="radio"
            id="designer-2"
            name="designer"
            value="designer-2"
            class="peer hidden"
            required
          />
          <label
            for="designer-2"
            class="mr-2 inline-flex cursor-pointer items-center justify-between rounded-full border-2 border-gray-200 bg-white px-2 py-1 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-600 peer-checked:border-blue-600 peer-checked:text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300 dark:peer-checked:text-gray-300"
          >
            <img
              class="h-8 w-8 rounded-full object-cover"
              src="/assets/img/designer.jpg"
              alt="Rounded avatar"
            />
            <div class="block">
              <div class="mx-2 w-full text-sm">Luna</div>
            </div>
          </label>
        </li>
        <li>
          <input
            type="radio"
            id="designer-3"
            name="designer"
            value="designer-3"
            class="peer hidden"
            required
          />
          <label
            for="designer-3"
            class="mr-2 inline-flex cursor-pointer items-center justify-between rounded-full border-2 border-gray-200 bg-white px-2 py-1 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-600 peer-checked:border-blue-600 peer-checked:text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300 dark:peer-checked:text-gray-300"
          >
            <img
              class="h-8 w-8 rounded-full object-cover"
              src="/assets/img/designer.jpg"
              alt="Rounded avatar"
            />
            <div class="block">
              <div class="mx-2 w-full text-sm">Jade</div>
            </div>
          </label>
        </li>
      </ul>
      <div>
        <FullCalendar :options="calendarOptions" />
      </div>
    </div>
  </div>
</template>

<style scoped>
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
  background-color: #a0aec0;
  border-color: #a0aec0;
  padding: 0.25rem;
  border-radius: 0.25rem !important;
  height: fit-content;
}

:deep(.fc-prev-button) {
  margin-right: 0.5rem;
}
</style>
