<script setup>
import { useUser } from "@/shared/stores";
const emit = defineEmits(["logout"]);
const userStore = useUser();
</script>

<template>
  <aside>
    <nav>
      <img src="../../assets/images/icon-left-font-monochrome-black.svg" class="logo" alt="" />
      <ul>
        <li>
          <router-link to="/" class="menu_link"><i class="fa-fw fa-solid fa-house"></i><span class="menu_text">Accueil</span> </router-link>
        </li>
        <li>
          <router-link :to="'/profil/' + userStore.currentUser.id" class="menu_link"><i class="fa-fw fa-solid fa-user"></i><span class="menu_text">Profil</span></router-link>
        </li>

        <li>
          <router-link to="/params" class="menu_link"><i class="fa-fw fa-solid fa-gear"></i><span class="menu_text">Paramètres</span></router-link>
        </li>
      </ul>
    </nav>
    <div class="menu_account">
      <img :src="userStore.currentUser.profilePicture" class="profil_pic profil_pseudo" alt="" />
      <span @click="emit('logout')" class="pseudo"><span class="pseudo_pseudo">Déconnexion</span> <i class="logout fa-solid fa-arrow-right-from-bracket"></i></span>
    </div>
  </aside>
</template>

<style type="scss" scoped>
.router-link-exact-active {
  color: var(--primary-1) !important;
}
nav {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

li:not(:first-child) {
  margin-top: 30px;
}
li a {
  font-size: 1.2rem;
  text-decoration: none;
  padding: 10px;
  transition: 0.3s;
  border-radius: 10px;
  color: var(--text-color);
}

@media only screen and (max-width: 900px) {
  .menu_text {
    font-size: 1rem;
  }
  .fa-solid {
    margin-right: 10px;
    font-size: 1.5rem;
  }
}
li a:hover {
  background-color: rgb(209, 208, 208);
}
.fa-solid {
  margin-right: 10px;
  font-size: 1rem;
}
.logo {
  width: 90%;
  margin: 15px 0 40px 0;
}
.menu_account {
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  border-top: var(--border-in);
  padding-top: 10px;
}
.logout {
  font-size: 1rem;
  margin-left: 5px;
  color: var(--danger-1);
  margin-right: 0 !important;
}
.logout:hover {
  color: var(--danger-2);
}

.profil_pseudo {
  color: var(--title);
  font-weight: 600;
  text-decoration: none;
}
.pseudo {
  font-weight: 500;
  cursor: pointer;
}
@media only screen and (max-width: 800px) {
  .nav {
    border-top: var(--border-in);
  }
  nav {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    width: 100%;
  }
  .logo {
    display: none;
  }
  .menu_account {
    display: none;
  }
  ul {
    display: flex;

    align-items: center;
    margin: 0;
    flex: 1 1 auto;
    justify-content: space-evenly;
  }
  li {
    margin-top: 0px !important;
    padding: 0;
  }
  .menu_text {
    display: none;
  }
  .fa-solid {
    margin-right: 0px;
    font-size: 1.6rem;
  }
  .menu_link {
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
@media only screen and (min-width: 700px) and (max-width: 992px) {
  .menu_text {
    display: none;
  }
  .pseudo_pseudo {
    display: none;
  }
  .logo {
    display: none;
  }
  .menu_account {
    flex-direction: column;
    gap: 10px;
  }
  .fa-solid {
    margin-right: 0px !important;
    font-size: 1.5rem;
  }
  .profil_pseudo {
    display: none;
  }
}
</style>
