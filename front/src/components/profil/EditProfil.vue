<script setup>
import { notify } from "@kyvg/vue3-notification";
import { z } from "zod";
import { toFormValidator } from "@vee-validate/zod";
import { useField, useForm } from "vee-validate";
import axios from "axios";
import { useUser } from "@/shared/stores";
import { useRoute } from "vue-router";
import { ref } from "vue";
const route = useRoute();
const userStore = useUser();
const imageBanner = ref(null);
const imageProfil = ref(null);
const infoProfil = ref([]);

const emit = defineEmits(["close"]);

const validationSchema = toFormValidator(
  z.object({
    firstname: z.string({ required_error: "Veuillez renseigner ce champ" }).nonempty().regex(new RegExp(/^\S*$/), "Le prénom ne doit pas contenir d'espace"),
    lastname: z.string({ required_error: "Veuillez renseigner ce champ" }).nonempty().regex(new RegExp(/^\S*$/), "Le nom ne doit pas contenir d'espace"),
    birthday: z.string().optional().nullable(),
    location: z.string().optional().nullable(),
    job: z.string().optional().nullable(),
    bio: z.string().optional().nullable(),
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
        userStore.currentUser.firstName = response.data.firstName;
        userStore.currentUser.birthdate = response.data.birthdate;
        userStore.currentUser.lastName = response.data.lastName;
        userStore.currentUser.location = response.data.location;
        userStore.currentUser.job = response.data.job;
        userStore.currentUser.bio = response.data.bio;
        notify({
          type: "success",
          title: "Profil modifié",
        });
      })
      .catch((error) => {
        notify({
          type: "error",
          title: error.response.data.erreur,
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
const { value: jobValue, errorMessage: jobError } = useField("job");
const { value: bioValue, errorMessage: bioError } = useField("bio");

firstNameValue.value = userStore.currentUser.firstName;
birthdayValue.value = userStore.currentUser.birthdate;
lastNameValue.value = userStore.currentUser.lastName;
locationValue.value = userStore.currentUser.location;
jobValue.value = userStore.currentUser.job;
bioValue.value = userStore.currentUser.bio;

function notification(title, type, duration) {
  notify({
    duration: duration ? duration : 4000,
    type: type ? type : "info",
    title: title,
  });
}
function changeBanner(e) {
  const regexImage = new RegExp("(image)[\/](gif|jpg|jpeg|png)");
  imageBanner.value = e.target.files[0];
  if (imageBanner.value != undefined) {
    if (imageBanner.value.size > 1000000) {
      imageBanner.value = null;
      notification("Le fichier dépasse 1mo", "error");
    } else {
      if (regexImage.test(imageBanner.value.type)) {
        let data = { picture: imageBanner.value };
        axios
          .post("/api/profil/upload/banner", data, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          })
          .then((response) => {
            userStore.currentUser.bannerPicture = response.data;
            infoProfil.bannerPicture = response.data;
            notification("Bannière modifiée", "success");
          })
          .catch((error) => {
            notification(error.response.data.erreur, "error");
          });
      } else {
        imageBanner.value = null;
        notification("Format de fichier incompatible", "error");
      }
    }
  }
}

function changeProfilPicture(e) {
  const regexImage = new RegExp("(image)[\/](gif|jpg|jpeg|png)");
  imageProfil.value = e.target.files[0];

  if (imageProfil.value != undefined) {
    if (imageProfil.value.size > 1000000) {
      imageProfil.value = null;
      notification("Le fichier dépasse 1mo", "error");
    } else {
      if (regexImage.test(imageProfil.value.type)) {
        let data = { picture: imageProfil.value };
        axios
          .post("/api/profil/upload/pp", data, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          })
          .then((response) => {
            userStore.currentUser.profilePicture = response.data;
            infoProfil.profilePicture = response.data;
            notification("Image de profil modifiée", "success");
          })
          .catch((error) => {
            notification(error.response.data.erreur, "error");
          });
      } else {
        imageProfil.value = null;
        notification("Format de fichier incompatible", "error");
      }
    }
  }
}



</script>
<template>
  <div class="edit_container" @click="$emit('close')">
    <div v-on:click.stop class="edit_profil">


      <div class="edit_image">
        <input @change="changeBanner" type="file" name="picture" id="picture" class="inputfile"
          accept="image/png, image/jpeg, image/jpg, image/gif" />
        <label for="picture" class="label_background"
          :style="{ backgroundImage: `url(${userStore.currentUser.bannerPicture})` }">
          <div class="hover_banner"></div>

          <i class="fa-solid fa-image icon_banner"></i>
        </label>
        <input @change="changeProfilPicture" type="file" name="picturepp" id="picturepp" class="inputfile"
          accept="image/png, image/jpeg, image/jpg, image/gif" />
        <label for="picturepp" class="label_picturepp"
          :style="{ backgroundImage: `url(${userStore.currentUser.profilePicture})` }">
          <div class="hover_pp"></div>
          <i class="fa-solid fa-image icon_pp"></i>
        </label>

      </div>


      <form @submit.prevent="submit">
        <div class="form">
          <div class="field">
            <label class="label" for="label_input">Prénom</label>
            <input v-model.trim="firstNameValue" type="text" class="input label_input" name="label_input"
              id="firstname" />
            <p v-if="firstNameError" class="field-error">{{ firstNameError }}</p>
          </div>
          <div class="field">
            <label class="label" for="label_input">Nom</label>
            <input v-model.trim="lastNameValue" type="text" class="input label_input" name="label_input"
              id="lastname" />
            <p v-if="lastNameError" class="field-error">{{ lastNameError }}</p>
          </div>
          <div class="field">
            <label class="label" for="birthday">Date de naissance</label>
            <input v-model.trim="birthdayValue" type="date" class="input birthday" name="birthday" id="birthday" />
            <p v-if="birthdayError" class="field-error">{{ birthdayError }}</p>
          </div>
          <div class="field">
            <label class="label" for="label_input">Localisation</label>
            <input v-model.trim="locationValue" type="text" class="input label_input" name="label_input"
              id="location" />
            <p v-if="locationError" class="field-error">{{ locationError }}</p>
          </div>
          <div class="field">
            <label class="label" for="label_input">Poste</label>
            <input v-model.trim="jobValue" type="text" class="input label_input" name="label_input" id="job" />
            <p v-if="jobError" class="field-error">{{ jobError }}</p>
          </div>
        </div>
        <div class="field">
          <label class="label" for="label_input">Bio</label>
          <textarea v-model.trim="bioValue" type="text" name="label_input" id="bio" />
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
.hover_banner {
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.3);
  transition: 0.2s;
}

.hover_pp {
  border-radius: 50%;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.3);
  transition: 0.2s;
}

.edit_image {
  position: relative;
  margin: 0 -20px 0 -20px;

}

.label_background {
  background-color: rgba(0, 0, 0, 0.3);
  display: block;
  height: 200px;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  position: relative;

  .icon_banner {
    border-radius: 50%;
    backdrop-filter: blur(4px);
    background-color: var(--icon-edit);
    padding: 10px;
    color: var(--white);
    position: absolute;
    top: 25%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  &:hover .hover_banner {
    background-color: rgba(0, 0, 0, 0.6);
  }
}

.label_picturepp {
  position: relative;
  border: 5px solid white;
  position: absolute;
  right: 50%;
  top: 100px;
  transform: translateX(50%);
  border-radius: 50%;
  display: block;
  width: 125px;
  height: 125px;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;

  .icon_pp {
    border-radius: 50%;
    backdrop-filter: blur(4px);
    background-color: var(--icon-edit);
    padding: 10px;
    color: var(--white);
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  &:hover .hover_pp {
    background-color: rgba(0, 0, 0, 0.6);
  }
}

.inputfile {
  width: 0.1px;
  height: 0.1px;
  opacity: 0;
  overflow: hidden;
  position: absolute;
  z-index: -1;
}

.inputfile+label {
  cursor: pointer;
  /* "hand" cursor */
}

.edit_container {
  position: fixed;
  inset: 0;
  background: rgba(84, 83, 83, 0.62);
  backdrop-filter: blur(10.1px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
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
  box-shadow: var(--box-shadow);
  border-radius: var(--border-radius);
  min-width: 500px;
  overflow: hidden;
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
  min-height: 40px;
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

@media only screen and (max-width: 800px) {
  .edit_profil {
    width: 100% !important;
    height: 100% !important;
    min-width: 200px;
    overflow-y: scroll;
    overflow-x: hidden;
  }

}
</style>
