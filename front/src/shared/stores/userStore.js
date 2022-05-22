import { defineStore } from "pinia";
import { fetchCurrentUser, login, logout } from "../services";

export const useUser = defineStore("user", {
  state: () => ({
    currentUser: null,
    loaded: false,
  }),
  getters: {
    isAuthenticated(state) {
      if (state.currentUser) {
        return true;
      } else if (!state.currentUser && state.loaded) {
        return false;
      } else {
        return null;
      }
    },
  },
  actions: {
    async login(loginForm) {
      try {
        this.currentUser = await login(loginForm);
      } catch (e) {
        throw e;
      }
    },
    async logout() {
      await logout();
      this.currentUser = null;
    },
    async CurrentUser() {
      this.currentUser = await fetchCurrentUser();
      this.loaded = true;
    },
  },
});
