<script setup>
import axios from "axios";
import { ref } from "vue";

const suggetsUsers = ref([]);
function getsuggestUsers() {
  axios
    .get("/api/user/suggest")
    .then((response) => {
      suggetsUsers.value = response.data;
    })
    .catch((error) => {
      console.log(error);
    });
}
getsuggestUsers();
</script>
<template>
  <div class="suggest">
    <h2>Suggestions</h2>

    <div class="card" v-for="user in suggetsUsers">
      <img :src="user.profilePicture" class="profil_pic" alt="Photo de profil" />
      <div class="form-button">
        <router-link :to="'/profil/' + user.id">
          <h3>{{ user.firstName + " " + user.lastName }}</h3>
        </router-link>
        <button class="btn">
          <span>Suivre</span>
        </button>
      </div>
    </div>
  </div>
</template>
<style type="scss" scoped>
.suggest {
  background-color: var(--background-card);
  border: var(--border);
  padding: 15px;
  display: flex;
  flex-direction: column;
  box-shadow: var(--box-shadow);
  border-radius: var(--border-radius);
}

.suggest .card:not(:nth-child(0n + 2)) {
  border-top: var(--border-in);
}

.card {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 0 10px 0;
}

.form-button {
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  align-items: flex-start;
  padding: 5px;
}

h2 {
  font-size: 1rem;
  font-weight: 600;
}

h3 {
  font-size: 1rem;
  font-weight: 500;
  margin-bottom: 3px;
}
</style>
