import { defineStore } from "pinia";

export const usePost = defineStore("post", {
  state: () => ({
    posts: [],
    isloading: true,
  }),
  getters: {},
  actions: {},
});
