<script setup>
import { z } from "zod";
import { toFormValidator } from "@vee-validate/zod";
import { useField, useForm, defineRule } from "vee-validate";
import { useRouter } from "vue-router";
import { createUser } from "@/shared/services/user.service";

const router = useRouter();

const validationSchema = toFormValidator(
  z.object({
    firstname: z.string({ required_error: "Veuillez renseigner ce champ" }).min(2, "Le prénom doit faire au moins 2 caractères").regex(new RegExp(/^\S*$/), "Le prénom ne doit pas contenir d'espace"),
    lastname: z.string({ required_error: "Veuillez renseigner ce champ" }).min(2, "Le nom doit faire au moins 2 caractères").regex(new RegExp(/^\S*$/), "Le nom ne doit pas contenir d'espace"),
    email: z.string({ required_error: "Veuillez renseigner ce champ" }).email("Format email incorrect").nonempty("Veuillez renseigner ce champ").regex(new RegExp(/^\S*$/), "L'email ne doit pas contenir d'espace"),
    password: z
      .string({ required_error: "Veuillez renseigner ce champ" })
      .min(5, "Le mot de passe doit faire au moins 5 caractères")
      .nonempty("Veuillez renseigner ce champ")
      .regex(new RegExp(/^\S*$/), "Le mot de passe ne doit pas contenir d'espace"),
  })
);

const { handleSubmit, setErrors } = useForm({
  validationSchema,
});

const submit = handleSubmit(async (formValue) => {
  try {
    await createUser(formValue);
    router.push("/login");
  } catch (e) {
    setErrors({ password: e });
  }
});

const { value: firstNameValue, errorMessage: firstNameError } = useField("firstname");
const { value: lastNameValue, errorMessage: lastNameError } = useField("lastname");
const { value: emailValue, errorMessage: emailError } = useField("email");
const { value: passwordValue, errorMessage: passwordError } = useField("password");
</script>
<template>
  <div class="container">
    <div class="logo"><img src="@/assets/images/icon-left-font.png" alt=""></div>
    <div class=" card">
      <h1 class="card__title">Inscription</h1>
      <p class="card__subtitle">Tu as déjà un compte ? <router-link to="/login" class="card__action">Se connecter
        </router-link>
      </p>

      <form @submit="submit">
        <div class="form-row">
          <input autocomplete v-model.trim="emailValue" id="email" class="form-row__input" type="text"
            placeholder="Adresse mail" />
          <p v-if="emailError" class="form-error">{{ emailError }}</p>
        </div>
        <div class="form-row">
          <div class="form-column">
            <input autocomplete v-model.trim="firstNameValue" id="firstname" class="form-row__input" type="text"
              placeholder="Prénom" />
            <input autocomplete v-model.trim="lastNameValue" id="lastname" class="form-row__input" type="text"
              placeholder="Nom" />
          </div>
          <p v-if="firstNameError" class="form-error">{{ firstNameError }}</p>
          <p v-if="lastNameError" class="form-error">{{ lastNameError }}</p>
        </div>
        <div class="form-row">
          <input autocomplete v-model.trim="passwordValue" id="password" class="form-row__input" type="password"
            placeholder="Mot de passe" />
          <p v-if="passwordError" class="form-error">{{ passwordError }}</p>
        </div>
        <div class="form-row">
          <button class="button">
            <span>Créer mon compte</span>
          </button>
        </div>
      </form>
    </div>
    <div></div>
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
  min-height: 90vh;
  padding: 32px;
  flex-direction: column;
  justify-content: space-between;
  overflow: hidden;
}

.logo {

  max-width: 520px;
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

  .form-column {
    flex-direction: column;
  }

  .container {
    padding: 10px;
  }


}
</style>
