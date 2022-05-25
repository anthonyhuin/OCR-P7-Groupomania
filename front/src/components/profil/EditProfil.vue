<script setup>
import { defineEmits } from "vue";
import { notify } from "@kyvg/vue3-notification";
defineEmits(["close"]);
function notification(type, title, duration) {
  notify({
    duration: duration ? duration : 9000000,
    type: type,
    title: title,
  });
}
</script>
<template>
  <div class="edit_container" @click="$emit('close')">
    <div v-on:click.stop class="edit_profil">
      <form @submit="submit">
        <div class="form-row">
          <div class="form-column">
            <input id="firstname" class="form-row__input" type="text" placeholder="Prénom" />
          </div>
        </div>
        <div class="form-row">
          <div class="form-column">
            <input id="lastname" class="form-row__input" type="text" placeholder="Nom" />
          </div>
        </div>
        <div class="form-row">
          <div class="form-column">
            <textarea id="lastname" class="form-row__input" type="text" placeholder="Bio" />
          </div>
        </div>
        <select>
          <option v-for="(n, i) in 2000">{{ i }}</option>
        </select>

        <div class="form-row">
          <button class="btn">
            <span>Enregistrer</span>
          </button>

          <span @click="notification('error', 'Message supprimé')">test</span>
        </div>
      </form>
    </div>
  </div>
</template>
<style scoped>
.edit_container {
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  background: rgba(84, 83, 83, 0.62);
  backdrop-filter: blur(10.1px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
}
.edit_profil {
  background-color: var(--background-card);
  display: flex;
  flex-direction: column;
  padding: 10px;
  box-shadow: var(--box-shadow);
  padding: 10px;
  border-radius: 2px;
  min-width: 300px;
}
.form-row {
  display: flex;
  margin: 16px 0px;
  gap: 16px;
  flex-wrap: wrap;
  flex-direction: column;
}
.form-column {
  display: flex;
  flex-direction: row;
  gap: 16px;
}
.form-error {
  color: var(--danger-1);
  font-weight: 500;
}
.form-row__input {
  padding: 8px;
  border: none;
  border-radius: 8px;
  background: #f3f3f3;
  font-weight: 500;
  font-size: 1rem;
  flex: 1;
  min-width: 100px;
  color: black;
}
.form-row__input::placeholder {
  color: #696969;
}
</style>
