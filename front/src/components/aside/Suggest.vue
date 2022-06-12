<script setup>
import axios from "axios";
import { ref } from "vue";

let suggetsUsers = ref([]);
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

    <div class="friend" v-for="user in suggetsUsers">
      <img :src="user.profilePicture" class="profil_pic" alt="" />
      <div class="form-button">
        <router-link :to="'/profil/' + user.id" class="menu_link">
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
  padding: var(--p-15);
  display: flex;
  flex-direction: column;
  box-shadow: var(--box-shadow);
  border-radius: var(--border-radius);
}

.suggest .friend:not(:nth-child(0n + 2)) {
  border-top: var(--border-in);
}

.friend {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: var(--p-10) 0 var(--p-10) 0;
}

.form-button {
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  align-items: flex-start;
  padding: var(--p-5);
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
