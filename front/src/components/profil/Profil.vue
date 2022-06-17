<script setup>
import UserInfos from "./UserInfos.vue";
import UserPostList from "./UserPostList.vue";
const emit = defineEmits(["logout"]);
</script>

<template>
  <div>
    <UserInfos />
    <UserPostList />
  </div>
</template>

