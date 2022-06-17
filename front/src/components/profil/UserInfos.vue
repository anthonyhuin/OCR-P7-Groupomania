<script setup>
import axios from "axios";
import { useUser, useProfil } from "@/shared/stores";
import EditProfil from "./EditProfil.vue";
import { useRoute } from "vue-router";
import { ref, watch } from "vue";
import moment from "moment";
import "moment/dist/locale/fr";

const userStore = useUser();
const profilStore = useProfil();
const route = useRoute();
const editProfil = ref(false);
const infoProfil = ref([]);

if (route.params.id == "") {
  route.params.id = userStore.currentUser.id;
}

watch(
  () => route.params.id,
  () => {
    getInfoProfil();
  }
);

function getInfoProfil() {
  if (route.params.id !== undefined) {
    axios
      .get(`/api/profil/${route.params.id}`)
      .then(function (response) {
        infoProfil.value = response.data;
      })
      .catch(function (error) {
        infoProfil.value = error.response.data;
      })
  }
}


function formatTime(time, method) {
  if (method == "birthdate") {
    return moment(time).format("Do MMMM YYYY");
  } else {
    return moment(time, "YYYY-MM-DD hh-mm-ss").fromNow();
  }
}

</script>

<template>
  <div v-if="profilStore.isloading"></div>

  <div v-else-if="userStore.currentUser.id == route.params.id">
    <EditProfil v-if="editProfil" @close="editProfil = !editProfil" />
    <div class="containter">
      <div class="card">
        <div class="card_background">
          <img :src="userStore.currentUser.bannerPicture" alt="" class="background_img" />
          <div @click="editProfil = !editProfil" class="btn">Éditer le profil</div>
        </div>

        <div class="header_img">
          <img :src="userStore.currentUser.profilePicture" class="card_pp" />
          <span class="body_pseudo">{{ userStore.currentUser.firstName }} {{ userStore.currentUser.lastName }}</span>
          <span class="header_post" v-if="userStore.currentUser.job">{{ userStore.currentUser.job }}</span>
        </div>

        <div class="card_body">
          <p class="body_bio" v-if="userStore.currentUser.bio">{{ userStore.currentUser.bio }}</p>
        </div>
        <div class="card_footer">
          <div class="body_birthday" v-if="userStore.currentUser.location"><i class="fa-solid fa-location-dot"></i>{{
              userStore.currentUser.location
          }}</div>
          <div class="body_createdAt" v-if="userStore.currentUser.birthdate"><i
              class="fa-solid fa-cake-candles"></i>Naissance le {{
                  formatTime(userStore.currentUser.birthdate, "birthdate")
              }}</div>
          <div class="body_birthday"><i class="fa-solid fa-calendar-days"></i>A rejoint Groupomania {{
              formatTime(userStore.currentUser.createdAt)
          }}</div>
        </div>
      </div>
    </div>
  </div>

  <div v-else-if="infoProfil.active == 1">
    <div class="containter">
      <div class="card">
        <div class="card_background">
          <img :src="infoProfil.bannerPicture" alt="" class="background_img" />
        </div>

        <div class="header_img">
          <div class="label_pp"><img :src="infoProfil.profilePicture" class="card_pp" /></div>
          <span class="body_pseudo">{{ infoProfil.firstName }} {{ infoProfil.lastName }}</span>
          <span class="header_post">{{ infoProfil.job }}</span>
        </div>

        <div class="card_body">
          <p class="body_bio" v-if="infoProfil.bio">{{ infoProfil.bio }}</p>
        </div>
        <div class="card_footer">
          <div class="body_birthday" v-if="infoProfil.location"><i class="fa-solid fa-location-dot"></i> {{
              infoProfil.location
          }}</div>
          <div class="body_createdAt" v-if="infoProfil.birthdate"><i class="fa-solid fa-cake-candles"></i>Naissance le
            {{ formatTime(infoProfil.birthdate, "birthdate") }}</div>
          <div class="body_birthday"><i class="fa-solid fa-calendar-days"></i> A rejoint Groupomania {{
              formatTime(infoProfil.createdAt)
          }}</div>
        </div>
      </div>
    </div>
  </div>

  <div v-else>
    <div class="containter">
      <div class="card">
        <h1>Compte désactivé</h1>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.inputfile {
  width: 0.1px;
  height: 0.1px;
  opacity: 0;
  overflow: hidden;
  position: absolute;
  z-index: -1;
}

.inputfile+label {
  cursor: pointer;
  /* "hand" cursor */
}

.card {
  background-color: var(--background-card);
  display: flex;
  flex-direction: column;
  padding: 10px;
  border-radius: var(--border-radius);

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
  margin-top: -90px;
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 2;
  margin-bottom: 5px;
}

.header_post {
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--gray-3);
}

.card_pp {
  object-fit: cover;
  border-radius: 50%;
  height: 130px;
  width: 130px;
  border: 5px solid white;
}



/*/ /////////////////////////////////////////////////////////*/
.card_body {
  text-align: center;
  margin-bottom: 10px;
}

.body_pseudo {
  font-size: 1.21rem;
  font-weight: 600;
}

.card_background {
  height: 200px;
  margin: -10px -10px 0 -10px;
  position: relative;
  z-index: 0;
}





.card_footer {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;

  div {
    margin-right: 10px;
    font-weight: 400;
    color: #767c80;
    flex-wrap: nowrap;

    i {
      margin-right: 5px;
      color: #9ea5a8;
    }
  }
}

.background_img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
