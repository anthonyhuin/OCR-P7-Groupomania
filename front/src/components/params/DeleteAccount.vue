<script setup>
import axios from "axios";
import { useRouter } from "vue-router";
import { notify } from "@kyvg/vue3-notification";
import { useUser } from "@/shared/stores";
import { ref } from "vue";
const userStore = useUser();
const router = useRouter();
const emit = defineEmits(["logout"]);

let confirmDisable = ref(false);

function disableAccount() {
  axios
    .get("/api/user/disable")
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

const { firstNameError, firstNameValue } = "bonjour";
</script>

<template>
  <div>
    <h1>Paramètres</h1>
    <div class="card">
      <h4>Modifier votre mot de passe</h4>
      <form @submit.prevent="submit">
        <div class="form">
          <div class="field name-input">
            <label class="label" for="username">Mot de passe actuel</label>
            <input v-model="firstNameValue" type="text" class="input username" name="username" id="firstname" />
            <p v-if="firstNameError" class="field-error">{{ firstNameError }}</p>
          </div>
          <div class="field name-input">
            <label class="label" for="username">Nouveau mot de passe</label>
            <input v-model="firstNameValue" type="text" class="input username" name="username" id="firstname" />
            <p v-if="firstNameError" class="field-error">{{ firstNameError }}</p>
          </div>
          <div class="field name-input">
            <label class="label" for="username">Confirmer le mot de passe</label>
            <input v-model="firstNameValue" type="text" class="input username" name="username" id="firstname" />
            <p v-if="firstNameError" class="field-error">{{ firstNameError }}</p>
          </div>
        </div>

        <div class="form-controls">
          <button class="btn submit">Enregistrer</button>
        </div>
      </form>
    </div>
    <div class="card">
      <h4><i class="fa-solid fa-triangle-exclamation"></i> Ceci désactivera votre compte.</h4>
      <p>
        Vous vous apprêtez à lancer la procédure de désactivation de votre compte Groupomania. Votre nom d'affichage, vos posts, vos commentaires et votre profil ne seront plus visibles sur
        Groupomania.com.
      </p>
      <div v-if="!confirmDisable" class="form-controls"><button class="btn danger" @click="confirmDisable = true">Désactiver mon compte</button></div>
      <div v-else class="form-controls">
        <button class="btn neutral" @click="confirmDisable = false">Annuler</button> <button class="btn danger" @click="disableAccount">Désactiver mon compte</button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.field-error {
  padding-top: 5px;
  font-weight: 600;
  font-size: 0.8rem;
  color: var(--danger-1);
}

.field {
  display: flex;
  flex-direction: column;
  margin-bottom: 15px;
}

.input {
  height: 40px;
  border: 1px solid #dcdcdc;
  border-radius: 6px;
  font-family: var(--font-family);
  font-size: 16px;
  padding-left: 10px;
  font-weight: 500;
  color: var(--text-color);
  appearance: none;
  outline: none;
  caret-color: var(--primary-1);
  background: #ffffff;

  &:focus {
    border-color: var(--primary-1);
  }
}

.label {
  color: var(--text-color);
  font-weight: 500;
  font-size: 1rem;
  margin-bottom: 7px;
}

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
