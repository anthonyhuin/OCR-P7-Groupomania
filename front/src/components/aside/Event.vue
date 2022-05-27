<script setup></script>

<template>
  <div class="event">
    <img src="@/assets/images/ballon.png" class="background" alt="background" />
    <img src="https://avatars.dicebear.com/api/adventurer-neutral/youghfghseed.svg" class="profil_pic" alt="" />
    <h4>C'est l'anniversaire de Paul ! 🍰</h4>
    <p>Laissez-lui un message avec vos meilleurs vœux sur sa page de profil !</p>
  </div>
</template>

<style type="scss" scoped>
.event {
  background-color: var(--background-card);
  display: flex;
  flex-direction: column;
  gap: 15px;
  padding: 15px;
  position: relative;
  border: var(--border);
  box-shadow: var(--box-shadow);
  border-radius: var(--border-radius);
  overflow: hidden;
}
.background {
  position: absolute;
  inset: 0;
  opacity: 0.3;
}
h4 {
  font-weight: 600;
}
p {
  font-size: 1rem;
  font-weight: 400;
}
</style>
