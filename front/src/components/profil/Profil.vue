<script setup>
import { useUser } from "@/shared/stores";
const userStore = useUser();
const props = defineProps(["isAuthenticated"]);

const emit = defineEmits(["logout"]);
</script>

<template>
  <span>
    <h1>profil</h1>
    <pre>{{ userStore.currentUser }}</pre>

    <span v-if="isAuthenticated">Connecté</span>
    <span v-else-if="isAuthenticated === false">Pas connecté</span></span
  >
</template>

<style scoped></style>
