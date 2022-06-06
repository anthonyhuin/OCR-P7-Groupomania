<script setup>
import axios from "axios";
import { usePost, useUser } from "@/shared/stores";
import EditProfil from "./EditProfil.vue";
import { useRoute } from "vue-router";
import { ref, watch } from "vue";
import moment from "moment";
import "moment/dist/locale/fr";
import { notify } from "@kyvg/vue3-notification";
const postStore = usePost();
const userStore = useUser();
const route = useRoute();

function notification(title, type, duration) {
  notify({
    duration: duration ? duration : 4000,
    type: type ? type : "info",
    title: title,
  });
}

let editProfil = ref(false);
let infoProfil = ref([]);
let imageBanner = ref(null);
let imageProfil = ref(null);

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
  axios
    .get(`/api/profil/${route.params.id}`)
    .then(function (response) {
      infoProfil.value = response.data;
    })
    .catch(function (error) {
      console.log(error);
    })
    .then(function () {});
}
getInfoProfil();

function formatTime(time, method) {
  if (method == "birthdate") {
    return moment(time).format("L");
  } else {
    return moment(time, "YYYY-MM-DD hh-mm-ss").fromNow();
  }
}

function changeBanner(e) {
  const regexImage = new RegExp("(image)[\/](gif|jpg|jpeg|png)");
  imageBanner = e.target.files[0];
  if (imageBanner != undefined) {
    if (imageBanner.size > 1000000) {
      imageBanner = null;
      notification("Le fichier dépasse 1mo", "error");
    } else {
      if (regexImage.test(imageBanner.type)) {
        let data = { picture: imageBanner };
        axios
          .post("/api/profil/upload/banner", data, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          })
          .then((response) => {
            userStore.currentUser.bannerPicture = response.data;
            infoProfil.bannerPicture = response.data;
          })
          .catch((error) => {
            notification(error.response.data.erreur, "error");
          });
      } else {
        imageBanner = null;
        notification("Format de fichier incompatabile", "error");
      }
    }
  }
}

function changeProfilPicture(e) {
  const regexImage = new RegExp("(image)[\/](gif|jpg|jpeg|png)");
  imageProfil = e.target.files[0];

  if (imageProfil != undefined) {
    if (imageProfil.size > 1000000) {
      imageProfil = null;
      notification("Le fichier dépasse 1mo", "error");
    } else {
      if (regexImage.test(imageProfil.type)) {
        let data = { picture: imageProfil };
        axios
          .post("/api/profil/upload/pp", data, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          })
          .then((response) => {
            userStore.currentUser.profilePicture = response.data;
            infoProfil.profilePicture = response.data;
          })
          .catch((error) => {
            notification(error.response.data.erreur, "error");
          });
      } else {
        imageProfil = null;
        notification("Format de fichier incompatabile", "error");
      }
    }
  }
}
</script>

<template>
  <div v-if="userStore.currentUser.id == route.params.id">
    <EditProfil v-if="editProfil" @close="editProfil = !editProfil" />
    <div class="containter">
      <div class="card">
        <div class="card_background">
          <input @change="changeBanner" type="file" name="picture" id="picture" class="inputfile" accept="image/png, image/jpeg, image/jpg, image/gif" />
          <label for="picture"> <img :src="userStore.currentUser.bannerPicture" alt="" class="background_img" /></label>

          <div @click="editProfil = !editProfil" class="btn">Éditer le profil</div>
        </div>

        <div class="header_img">
          <input @change="changeProfilPicture" type="file" name="profilpicture" id="profilpicture" class="inputfile" accept="image/png, image/jpeg, image/jpg, image/gif" />
          <label for="profilpicture" class="label_pp"><img :src="userStore.currentUser.profilePicture" class="card_pp" /></label>

          <span class="body_pseudo">{{ userStore.currentUser.firstName + " " + userStore.currentUser.lastName }}</span>
          <span class="header_post">{{ userStore.currentUser.poste }}</span>
        </div>

        <div class="card_body">
          <p class="body_bio" v-if="userStore.currentUser.bio">{{ userStore.currentUser.bio }}</p>
          <span class="body_createdAt"><i class="fa-solid fa-cake-candles"></i> {{ formatTime(userStore.currentUser.birthdate, "birthdate") }}</span>
          <span class="body_birthday"><i class="fa-solid fa-calendar-days"></i> A rejoint Groupomania {{ formatTime(userStore.currentUser.createdAt) }} </span>
          <span class="body_birthday"><i class="fa-solid fa-location-dot"></i> {{ userStore.currentUser.location }}</span>
        </div>
        <div class="card_footer"></div>
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
          <img :src="infoProfil.profilePicture" class="card_pp" /><span class="body_pseudo">{{ infoProfil.firstName + " " + infoProfil.lastName }}</span>
          <span class="header_post">{{ infoProfil.poste }}</span>
        </div>

        <div class="card_body">
          <p class="body_bio" v-if="infoProfil.bio">{{ infoProfil.bio }}</p>
          <span class="body_createdAt" v-if="infoProfil.birthday"><i class="fa-solid fa-cake-candles"></i> {{ formatTime(infoProfil.birthday, "birthdate") }}</span>
          <span class="body_birthday"><i class="fa-solid fa-calendar-days"></i> A rejoint Groupomania {{ formatTime(infoProfil.createdAt) }} </span>
          <span class="body_birthday" v-if="infoProfil.location"><i class="fa-solid fa-location-dot"></i> {{ infoProfil.location }}</span>
        </div>
        <div class="card_footer"></div>
      </div>
    </div>
  </div>
  <div v-else>
    <div class="containter">
      <div class="card"><h1>Compte désactivé</h1></div>
    </div>
  </div>
</template>

<style scoped>
.label_pp {
  border-radius: 50%;
  height: 115px;
  width: 115px;
}
.inputfile {
  width: 0.1px;
  height: 0.1px;
  opacity: 0;
  overflow: hidden;
  position: absolute;
  z-index: -1;
}
.inputfile + label {
  cursor: pointer; /* "hand" cursor */
}
.card {
  background-color: var(--background-card);
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
.header_post{

 font-size: 0.9rem;
  font-weight: 500;
  color: var(--gray-3);
}
.card_pp {
box-shadow: 0 0 0px 0 white inset, 0 0 3px 0 white;
  height: 115px;
object-fit: cover;
  border-radius: 50%;
  width: 115px;
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
