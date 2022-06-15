<script setup>
import axios from "axios";
import { ref } from "vue";

let birthdateUsers = ref([]);
function getsuggestUsers() {
  axios
    .get("/api/user/findbirthday")
    .then((response) => {
      birthdateUsers.value = response.data;

    })
    .catch((error) => {
      console.log(error.response.data);
    });
}
getsuggestUsers();



</script>

<template >
  <div v-if="birthdateUsers != null" class="event">
    <img src="@/assets/images/ballon.png" class="background" alt="background" />
    <img :src="birthdateUsers.profilePicture" class="profil_pic" alt="" />
    <h4>C'est l'anniversaire de {{ birthdateUsers.firstName }} ! 🍰</h4>
    <p>Laissez-lui un message avec vos meilleurs vœux !</p>
  </div>
</template>

<style type="scss" scoped>
.event {
  background-color: var(--background-card);
  display: flex;
  flex-direction: column;
  gap: 15px;
  padding: 15px;
  position: relative;
  border: var(--border);
  box-shadow: var(--box-shadow);
  border-radius: var(--border-radius);
  overflow: hidden;
}

.background {
  position: absolute;
  inset: 0;
  opacity: 0.3;
}

h4 {
  font-weight: 600;
}

p {
  font-size: 1rem;
  font-weight: 400;
}
</style>
