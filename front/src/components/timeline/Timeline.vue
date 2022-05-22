<script setup>
import PostForm from "./PostForm.vue";
import PostList from "./PostList.vue";
import { usePost, useUser } from "@/shared/stores";

const postStore = usePost();
</script>

<template>
  <div class="timeline">
    <PostForm />
    <div v-if="postStore.isloading" class="loader"></div>
    <PostList />
  </div>
</template>

<style scoped>
.timeline {
  display: flex;
  flex-direction: column;
}
.loader {
  height: 5rem;
  width: 5rem;
  border-radius: 50%;
  border: 10px solid rgb(192, 192, 192);
  border-top-color: #131313;
  box-sizing: border-box;
  background: transparent;
  animation: loading 1s linear infinite;
}

@keyframes loading {
  0% {
    transform: rotate(0deg);
  }
  0% {
    transform: rotate(360deg);
  }
}
</style>
