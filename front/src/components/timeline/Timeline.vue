<script setup>
import PostForm from "./PostForm.vue";
import PostList from "./PostList.vue";
import { usePost, useUser } from "@/shared/stores";

const postStore = usePost();
</script>

<template>
  <div class="timeline">
    <PostForm />
    <div class="loader_container" v-if="postStore.isloading">
      <div class="loader"></div>
    </div>
    <PostList />
  </div>
</template>

<style scoped></style>
