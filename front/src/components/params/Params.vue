<script setup>
import DeleteAccount from "./DeleteAccount.vue";


const emit = defineEmits(["logout"]);
function logout() {
  emit("logout");
}
</script>

<template>
  <div>
    <DeleteAccount @logout="logout" />

  </div>
</template>

<style scoped>
</style>
