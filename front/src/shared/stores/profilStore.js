import { defineStore } from "pinia";

export const useProfil = defineStore("profil", {
  state: () => ({
    posts: [],
    isloading: true,
  }),
  getters: {},
  actions: {},
});
