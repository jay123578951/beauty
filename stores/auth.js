import { defineStore } from "pinia";

export const useUserStore = defineStore("user", {
  state: () => ({
    isLoggedIn: false,
    user: null,
  }),
  actions: {
    setUser(userData) {
      this.isLoggedIn = true;
      this.user = userData;
    },

    async fetchUser(userUuid) {
      if (!userUuid) return;

      try {
        const response = await fetch("http://localhost:3001/api/auth/profile", {
          method: "POST",
          body: JSON.stringify({
            id: userUuid,
          }),
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (response.ok) {
          const userData = await response.json();
          this.setUser(userData);
        }
      } catch (error) {
        console.error("Failed to fetch user data", error);
      }
    },

    async checkAuth() {
      try {
        const response = await fetch(
          "http://localhost:3001/api/auth/check-auth",
          {
            method: "GET",
            credentials: "include",
          },
        );

        if (response.ok) {
          const userData = await response.json();

          if (userData.isLoggedIn) {
            this.setUser(userData.user);
          } else {
            this.clearUser();
          }
        } else {
          console.error("Failed to check authentication");
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
      }
    },

    clearUser() {
      this.isLoggedIn = false;
      this.user = null;
    },
    persist: true, // 可選：如果想讓 pinia 的狀態在頁面重新加載後持久化
  },
});
