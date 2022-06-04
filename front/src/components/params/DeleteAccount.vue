<script setup></script>

<template>
  <div>
    <h1>Paramètres</h1>
        <div class="card">
      <p>
        <h4>Modifier votre mot de passe</h4><br />
        Vous vous apprêtez à lancer la procédure de désactivation de votre compte Groupomania. Votre nom d'affichage, vos posts, vos commentaires et votre profil public ne seront plus visibles sur
        Groupomania.com,
      </p>
      <div><button class="btn danger">Désactiver mon compte</button></div>
    </div>
    <div class="card">
      <p>
        <h4>Ceci désactivera votre compte.</h4><br />
        Vous vous apprêtez à lancer la procédure de désactivation de votre compte Groupomania. Votre nom d'affichage, vos posts, vos commentaires et votre profil public ne seront plus visibles sur
        Groupomania.com,
      </p>
      <div><button class="btn danger">Désactiver mon compte</button></div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.card {
  display: flex;
  flex-direction: column;
  background-color: var(--background-card);
  gap: 10px;
  padding: 10px;
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  margin-bottom: 16px;
}
h1 {
  margin-bottom: 10px;
}
</style>
