<script setup>
const emit = defineEmits(["logout"]);
</script>

<template>
  <aside>
    <nav>
      <img src="@/assets/images/icon-left-font-monochrome-black.svg" class="logo" alt="" />
      <ul>
        <li>
          <router-link to="/"><i class="fa-fw fa-solid fa-house"></i><span class="menu_text">Accueil</span></router-link>
        </li>

        <li>
          <router-link to="/profil"><i class="fa-fw fa-solid fa-house"></i><span class="menu_text">Profil</span></router-link>
        </li>

        <li>
          <router-link to="/params"><i class="fa-fw fa-solid fa-house"></i><span class="menu_text">Paramètres</span></router-link>
        </li>
        <li>
          <router-link to="/login"><i class="fa-fw fa-solid fa-house"></i><span class="menu_text">Login</span></router-link>
        </li>
      </ul>
    </nav>
    <div class="menu_account">
      <span @click="emit('logout')">Déconnexion<i class="logout fa-solid fa-arrow-right-from-bracket"></i></span>
    </div>
  </aside>
</template>

<style scoped></style>
