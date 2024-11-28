import { defineStore } from "pinia";

export const useUserStore = defineStore("user", {
  state: () => ({
    user: null,
    isLoggedIn: false,
  }),
  actions: {
    setUser(userData) {
      this.user = userData;
      this.isLoggedIn = true;
    },
    clearUser() {
      this.user = null;
      this.isLoggedIn = false;
    },
    persist: true, // 可選：如果想讓 pinia 的狀態在頁面重新加載後持久化
  },
});
