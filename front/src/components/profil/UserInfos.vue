<script setup>
import axios from "axios";
import { usePost, useUser } from "@/shared/stores";
import EditProfil from "./EditProfil.vue";
import { useRoute } from "vue-router";
import { ref } from "vue";
const postStore = usePost();
const userStore = useUser();
const route = useRoute();

let editProfil = ref(false);

function getInfoProfil() {
  axios
    .get(`/api/profil/${route.params.id}`)
    .then(function (response) {
      postStore.posts = response.data;
    })
    .catch(function (error) {
      console.log(error);
    })
    .then(function () {
      postStore.isloading = false;
    });
}
</script>

<template>
  <EditProfil v-if="editProfil" @close="editProfil = !editProfil" />
  <div class="containter">
    <div class="card">
      <div class="card_background">
        <img src="@/assets/images/casey-horner-rtCujH697DU-unsplash (1).jpg" alt="" class="background_img" />
        <div @click="editProfil = !editProfil" class="btn">Éditer le profil</div>
      </div>

      <div class="header_img">
        <img :src="userStore.currentUser.profilePicture" class="card_pp" /><span class="body_pseudo">{{ userStore.currentUser.firstName + " " + userStore.currentUser.lastName }}</span>
      </div>

      <div class="card_body">
        <p class="body_bio">Lorem ipsum dolor sit amet consectetur adipisicing elit. Optio voluptas magnam corporis esse aliquam provident ipsum cumque iure magni animi!</p>
        <span class="body_createdAt"><i class="fa-solid fa-cake-candles"></i> Anniversaire le 21 septembre</span>
        <span class="body_birthday"><i class="fa-solid fa-calendar-days"></i> A rejoint Groupomania en mai 2022</span>
      </div>
      <div class="card_footer"></div>
    </div>
  </div>
</template>

<style scoped>
.card {
  background-color: rgb(255, 255, 255);
  display: flex;
  flex-direction: column;
  padding: 10px;
  border-radius: 2px;

  box-shadow: 0 1px 2px rgba(82, 82, 82, 0.2);
}
/*//////////////////////////////////////////////////////////*/
.btn {
  
    position: absolute;
  top: 0;
  right: 0;
  margin: 10px;
  user-select: none;
  cursor: pointer;
}
.card_header {
  margin-top: -57.5px;
  display: flex;
  margin-bottom: 15px;
  z-index: 1;

}
.header_img {
      margin-top: -57.5px;
  display: flex;
  width: 100%;
  height: 100%;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  z-index: 2;
  margin-bottom: 15px;
}
.card_pp {
  max-height: 115px;
  border: 4px solid #2196f3;
  border-radius: 50%;
  max-width: 115px;
}
/*/ /////////////////////////////////////////////////////////*/
.card_body {
  display: flex;
  flex-direction: column;
  gap: 10px;
  text-align: center;
}
.body_pseudo {
  font-size: 1.21rem;
  font-weight: 600;
}

.body_createdAt i,
.body_birthday i {
  color: #9ea5a8;
}
.body_createdAt,
.body_birthday {
  font-weight: 500;
  font-size: 0.9rem;
}

.card_background {
  height: 200px;
  margin: -10px -10px 0 -10px;
  position: relative;
  z-index: 0;
}
.background_img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
