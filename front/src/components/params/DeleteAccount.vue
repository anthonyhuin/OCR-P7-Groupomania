<script setup>
import axios from "axios";
import { notify } from "@kyvg/vue3-notification";
import { useUser } from "@/shared/stores";
import { ref } from "vue";

const userStore = useUser();
const emit = defineEmits(["logout"]);
const confirmDisable = ref(false);

function disableAccount() {
  axios
    .get(`/api/user/disable/${userStore.currentUser.id}`)
    .then((response) => {
      notify({
        duration: 20000,
        type: "info",
        title: "Compte désactivé",
      });
      emit("logout");
    })
    .catch((error) => {
      notify({
        duration: 5000,
        type: "error",
        title: error.response.data.erreur,
      });
    });
}
</script>

<template>
  <div>
    <h1>Paramètres</h1>
    <div class="card">
      <h4><i class="fa-solid fa-triangle-exclamation"></i> Ceci désactivera votre compte.</h4>
      <p>
        Vous vous apprêtez à lancer la procédure de désactivation de votre compte Groupomania. Votre nom d'affichage,
        vos posts, vos commentaires et votre profil ne seront plus visibles sur
        Groupomania.com.
      </p>
      <div v-if="!confirmDisable" class="form-controls"><button class="btn danger"
          @click="confirmDisable = true">Désactiver mon compte</button></div>
      <div v-else class="form-controls">
        <button class="btn neutral" @click="confirmDisable = false">Annuler</button> <button class="btn danger"
          @click="disableAccount">Désactiver mon compte</button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.form-controls {
  display: flex;
  width: 100%;
  justify-content: center;

  .btn {
    flex-basis: 50%;
    margin: 5px;
    font-weight: 600;
  }
}

.card {
  display: flex;
  flex-direction: column;
  background-color: var(--background-card);
  gap: 10px;
  padding: 16px;
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  margin-bottom: 16px;
}

h1 {
  margin-bottom: 10px;
}
</style>
