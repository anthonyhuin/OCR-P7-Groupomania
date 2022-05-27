<script setup>
import { useUser } from "@/shared/stores";
import UserInfos from "./UserInfos.vue";
import UserPostList from "./UserPostList.vue";
const userStore = useUser();
const props = defineProps(["isAuthenticated"]);

const emit = defineEmits(["logout"]);
</script>

<template>
  <div>
    <UserInfos />
    <UserPostList />
  </div>
</template>

<style scoped></style>
