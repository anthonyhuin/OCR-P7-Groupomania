<script setup>
import { notify } from "@kyvg/vue3-notification";
import { z } from "zod";
import { toFormValidator } from "@vee-validate/zod";
import { useField, useForm, defineRule } from "vee-validate";
import { useRouter } from "vue-router";
import { createUser } from "@/shared/services/user.service";
import axios from "axios";
import { useUser, usePost } from "@/shared/stores";
import { useRoute } from "vue-router";
const route = useRoute();
const userStore = useUser();

const emit = defineEmits(["close"]);

const validationSchema = toFormValidator(
  z.object({
    firstname: z.string({ required_error: "Veuillez renseigner ce champ" }).nonempty().regex(new RegExp(/^\S*$/), "Le prénom ne doit pas contenir d'espace"),
    lastname: z.string({ required_error: "Veuillez renseigner ce champ" }).nonempty().regex(new RegExp(/^\S*$/), "Le nom ne doit pas contenir d'espace"),
    birthday: z.string({ required_error: "Veuillez renseigner ce champ" }).nonempty(),
    location: z.string({ required_error: "Veuillez renseigner ce champ" }).nonempty(),
    poste: z.string({ required_error: "Veuillez renseigner ce champ" }).nonempty(),
    bio: z.string({ required_error: "Veuillez renseigner ce champ" }).nonempty(),
  })
);

const { handleSubmit, setErrors } = useForm({
  validationSchema,
});

const submit = handleSubmit(async (formValue) => {
  try {
    const body = formValue;
    axios
      .patch(`/api/profil/${route.params.id}`, body)
      .then((response) => {
        console.log(response.data);
        userStore.currentUser.firstName = firstNameValue.value;
        userStore.currentUser.birthdate = birthdayValue.value;
        userStore.currentUser.lastName = lastNameValue.value;
        userStore.currentUser.location = locationValue.value;
        userStore.currentUser.poste = posteValue.value;
        userStore.currentUser.bio = bioValue.value;
        notify({
          type: "success",
          title: "Profil modifié",
        });
      })
      .catch((error) => {
        notify({
          type: "error",
          title: error.response.data,
        });
      });

    emit("close");
  } catch (e) {
    setErrors({ bio: e });
  }
});

const { value: firstNameValue, errorMessage: firstNameError } = useField("firstname");
const { value: lastNameValue, errorMessage: lastNameError } = useField("lastname");
const { value: birthdayValue, errorMessage: birthdayError } = useField("birthday");
const { value: locationValue, errorMessage: locationError } = useField("location");
const { value: posteValue, errorMessage: posteError } = useField("poste");
const { value: bioValue, errorMessage: bioError } = useField("bio");

firstNameValue.value = userStore.currentUser.firstName;
birthdayValue.value = userStore.currentUser.birthdate;
lastNameValue.value = userStore.currentUser.lastName;
locationValue.value = userStore.currentUser.location;
posteValue.value = userStore.currentUser.poste;
bioValue.value = userStore.currentUser.bio;
</script>
<template>
  <div class="edit_container" @click="$emit('close')">
    <div v-on:click.stop class="edit_profil">
      <form @submit.prevent="submit">
        <div class="form">
          <div class="field name-input">
            <label class="label" for="username">Prénom</label>
            <input v-model="firstNameValue" type="text" class="input username" name="username" id="firstname" />
            <p v-if="firstNameError" class="field-error">{{ firstNameError }}</p>
          </div>
          <div class="field name-input">
            <label class="label" for="username">Nom</label>
            <input v-model="lastNameValue" type="text" class="input username" name="username" id="lastname" />
            <p v-if="lastNameError" class="field-error">{{ lastNameError }}</p>
          </div>
          <div class="field birthday-input">
            <label class="label" for="birthday">Date de naissance</label>
            <input v-model="birthdayValue" type="date" class="input birthday" name="birthday" id="birthday" />
            <p v-if="birthdayError" class="field-error">{{ birthdayError }}</p>
          </div>
          <div class="field name-input">
            <label class="label" for="username">Localisation</label>
            <input v-model="locationValue" type="text" class="input username" name="username" id="location" />
            <p v-if="locationError" class="field-error">{{ locationError }}</p>
          </div>
          <div class="field name-input">
            <label class="label" for="username">Poste</label>
            <input v-model="posteValue" type="text" class="input username" name="username" id="poste" />
            <p v-if="posteError" class="field-error">{{ posteError }}</p>
          </div>
        </div>
        <div class="field name-input">
          <label class="label" for="username">Bio</label>
          <textarea v-model="bioValue" type="text" name="username" id="bio" />
          <p v-if="bioError" class="field-error">{{ bioError }}</p>
        </div>
        <div class="form-controls">
          <button class="btn cancel" @click="$emit('close')">Annuler</button>
          <button class="btn submit">Enregistrer</button>
        </div>
      </form>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.edit_container {
  position: fixed;
  inset: 0;
  background: rgba(84, 83, 83, 0.62);
  backdrop-filter: blur(10.1px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
}
.field-error {
  padding-top: 5px;
  font-weight: 600;
  font-size: 0.8rem;
  color: var(--danger-1);
}
.edit_profil {
  background-color: var(--background-card);
  display: flex;
  flex-direction: column;
  padding: 10px;
  box-shadow: var(--box-shadow);
  border-radius: 2px;
  min-width: 300px;
  padding: 0 20px;
}

.form {
  padding-top: 20px;
}

.field {
  display: flex;
  flex-direction: column;
  margin-bottom: 15px;
}

.input,
textarea {
  height: 40px;
  border: 1px solid #dcdcdc;
  border-radius: 6px;
  font-family: var(--font-family);
  font-size: 16px;
  padding-left: 10px;
  font-weight: 500;
  color: var(--text-color);
  appearance: none;
  outline: none;
  caret-color: var(--primary-1);
  background: #ffffff;

  &:focus {
    border-color: var(--primary-1);
  }
}
textarea {
  height: 70px;
}

.label {
  color: var(--text-color);
  font-weight: 500;
  font-size: 1rem;
  margin-bottom: 7px;
}

.form-controls {
  padding: 20px 0;
  padding-top: 8px;
  display: flex;
  width: 100%;
  justify-content: center;

  .btn {
    flex-basis: 30%;
    margin: 5px;
    font-weight: 600;
    cursor: pointer;
  }

  .submit {
    color: var(--white);
    border: none;
    // box-shadow: 3px 5px 40px lighten($purple, 17%);
  }

  .cancel {
    color: black;
    border: 1px solid #dcdcdc;
    background-color: white;
    &:hover {
      background-color: var(--gray-1);
    }
  }
}
.disabled {
  background-color: #dcdcdc;
}
.birthday {
  font-family: var(--font-family);
}
</style>
