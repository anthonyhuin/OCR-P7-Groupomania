<script setup>
import { z } from "zod";
import { toFormValidator } from "@vee-validate/zod";
import { useField, useForm } from "vee-validate";
import { useRouter } from "vue-router";
import { useUser } from "@/shared/stores";
import { notify } from "@kyvg/vue3-notification";

const router = useRouter();
const userStore = useUser();

const validationSchema = toFormValidator(
  z.object({
    email: z.string({ required_error: "Veuillez renseigner ce champ" }).email("Format email incorrect").nonempty().regex(new RegExp(/^\S*$/), "L'email ne doit pas contenir d'espace"),
    password: z
      .string({ required_error: "Veuillez renseigner ce champ" })
      .min(5, "Le mot de passe doit faire au moins 5 caractères")
      .nonempty()
      .regex(new RegExp(/^\S*$/), "Le mot de passe ne doit pas contenir d'espace"),
  })
);

const { handleSubmit, setErrors } = useForm({
  validationSchema,
});

const submit = handleSubmit(async (formValue) => {
  try {
    await userStore.login(formValue);
    notify({
      type: "success",
      title: "Connecté",
    });
    router.push("/");
  } catch (e) {
    setErrors({ password: e });
  }
});

const { value: emailValue, errorMessage: emailError } = useField("email");
const { value: passwordValue, errorMessage: passwordError } = useField("password");
</script>
<template>
  <div class="container">
    <div class="logo"></div>
    <div class="card">
      <h1 class="card__title">Connexion</h1>
      <p class="card__subtitle">Tu n'as pas encore de compte ? <router-link to="/signin" class="card__action">Créer un compte</router-link></p>

      <form @submit.prevent="submit">
        <div class="form-row">
          <input v-model="emailValue" id="email" class="form-row__input" type="text" placeholder="Adresse mail" />
          <p v-if="emailError" class="form-error">{{ emailError }}</p>
        </div>
        <div class="form-row">
          <input v-model="passwordValue" id="signupassword" class="form-row__input" type="password" placeholder="Mot de passe" />
          <p v-if="passwordError" class="form-error">{{ passwordError }}</p>
        </div>
        <div class="form-row">
          <button class="button">
            <span>Connexion</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
* {
  font-family: var(--font-family);
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
.container {
  background: var(--background);
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 90vh;
  padding: 32px;
  position: relative;
  overflow: hidden;
}
.logo {
  height: 80px;
  max-width: 400px;
  position: absolute;
  top: 2%;
  right: calc(50%);
  transform: translateX(50%);
  background: url("../assets/images/icon-left-font-monochrome-black.svg");
  background-position: center;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  width: 100%;
}

.card {
  max-width: 100%;
  width: 540px;
  background: var(--background-card);
  border-radius: var(--border-radius);
  padding: 32px;
  border: var(--border);
  box-shadow: var(--box-shadow);
}
.card__title {
  text-align: center;
  font-weight: 800;
}
.card__subtitle {
  text-align: center;
  color: var(--text-color);
  font-weight: 500;
}
.card__action {
  color: var(--primary-1);
  cursor: pointer;
}
.button {
  background: var(--primary-1);
  color: white;
  border-radius: 8px;
  font-weight: 800;
  font-size: 1rem;
  border: none;
  width: 100%;
  padding: 16px;
  transition: 0.4s background-color;
}
.button:hover {
  cursor: pointer;
  background: var(--primary-2);
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
@media only screen and (max-width: 800px) {
  .logo {
    display: none;
  }
}
</style>
