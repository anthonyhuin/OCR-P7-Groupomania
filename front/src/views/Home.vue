<script setup>
import Nav from "../components/nav/Nav.vue";
import Aside from "../components/aside/Aside.vue";
import { useRouter } from "vue-router";
import { useUser } from "@/shared/stores";

const userStore = useUser();
const router = useRouter();

async function logout() {
  await userStore.logout();
  router.push("/login");
}

</script>

<template>
  <div class="appcontainer" v-if="userStore.currentUser != null">
    <Nav class="nav" @logout="logout" />
    <router-view class="content" @logout="logout"></router-view>
    <Aside class="aside" />
  </div>
</template>

<style lang="scss">
.appcontainer {
  position: relative;
  padding: 0 20px 0 20px;
  min-height: 100vh;
  max-width: 1120px;
  margin: 20px auto;
  display: grid;
  grid-template-columns: 0.4fr 1fr 0.5fr;
  grid-gap: 16px;
}

.nav {
  position: sticky;
  top: 0;
  padding: 10px;
  height: 60vh;
  align-self: start;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background: var(--background-card);
  box-shadow: var(--box-shadow);
  border-radius: var(--border-radius);
  border: var(--border);
  min-height: 300px;
  transition: 0.4s linear;
  z-index: 999;
}

.aside {
  position: sticky;
  top: 0;
  align-self: start;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.profil_pic {
  height: 47px;
  width: 47px;
  overflow: hidden;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
  margin: 0;
}

@media only screen and (max-width: 800px) {
  .nav {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    top: unset !important;
    width: 100%;
    height: 60px;
    border-radius: unset;

    min-height: 60px;
    flex-direction: row !important;
  }

  .appcontainer {
    grid-template-columns: 1fr;
    margin: 0px auto;
    padding: 0 0px 0 0px;
  }

  .aside {
    display: none;
    visibility: hidden;
  }

  .reponsiveLogo {
    width: 100%;
    max-height: 30px;
    margin-top: 10px;
    background-color: var(--background);
  }
}

@media only screen and (min-width: 800px) {
  .reponsiveLogo {
    display: none;
  }
}

@media only screen and (min-width: 800px) and (max-width: 992px) {
  .appcontainer {
    grid-template-columns: 60px 1fr 0.4fr;
  }
}
</style>
