<script setup>
import { z } from "zod";
import { toFormValidator } from "@vee-validate/zod";
import { useField, useForm } from "vee-validate";
import { useRouter } from "vue-router";
import { createPost } from "@/shared/services/post.service";
import { useUser, usePost } from "@/shared/stores";
import axios from "axios";
import { ref } from "vue";
const userStore = useUser();
const postStore = usePost();
const router = useRouter();
let clean = ref("");
const validationSchema = toFormValidator(
  z.object({
    post: z.string({ required_error: "Veuillez renseigner ce champ" }).max(500, "Le post doit faire moins de 200 caractères"),
  })
);

let imagePost = ref({});

function onChange(e) {
  console.log(typeof e.target.files[0]);
  return (imagePost = e.target.files[0]);
}

const { handleSubmit, setErrors } = useForm({
  validationSchema,
});

const submit = handleSubmit((formValue) => {
  formValue["picture"] = imagePost;
  console.log(formValue);
  axios
    .post("/api/post", formValue, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((response) => {
      console.log(response);
      postStore.posts.splice(0, 0, response.data);
    })
    .catch((error) => {
      setErrors({ post: error.response.data.erreur });
    });
});

const { value: postValue, errorMessage: postError } = useField("post");
</script>

<template>
  <div class="form_main">
    <h2>Accueil</h2>
    <form @submit.prevent="submit" enctype="multipart/form-data">
      <div class="form_container">
        <div class="form_pp"><img :src="userStore.currentUser.profilePicture" class="profil_pic" alt="" /></div>
        <textarea v-model.lazy="postValue" ref="clean" id="post" placeholder="Quoi de neuf ?"></textarea>
      </div>

      <div class="form-button">
        <div class="icon_form">
          <input @change="onChange" type="file" name="picture" id="picture" class="inputfile" />
          <label for="picture"><i class="fa-solid fa-image"></i></label>

          <i class="fa-solid fa-face-grin-wide"></i>
        </div>
        <p v-if="postError" class="form-error">{{ postError }}</p>
        <button class="btn">
          <span>Publier</span>
        </button>
      </div>
    </form>
  </div>
</template>

<style lang="scss" scoped>
.inputfile {
  width: 0.1px;
  height: 0.1px;
  opacity: 0;
  overflow: hidden;
  position: absolute;
  z-index: -1;
}
.inputfile + label {
  cursor: pointer; /* "hand" cursor */
}

.form-error {
  color: var(--danger-1);
  font-weight: 600;
  font-size: 0.8rem;
}

h2 {
  font-size: 1rem;
  font-weight: 600;
}
form {
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 10px;
}
.form_pp {
  flex-shrink: 0;
}
.form-button {
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding-left: 50px;
  align-items: center;
}
.form-button i {
  color: var(--primary-1);
  font-size: 1.1rem;
  margin-right: var(--m-10);
}
.form_main {
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  gap: 10px;
  padding: 5px 10px 10px 10px;
  background-color: var(--background-card);
  box-shadow: var(--box-shadow);
  border-radius: var(--border-radius);
  border: var(--border);
  border-top: 5px solid var(--primary-1);
}
.form_main h2 {
  color: var(--text-color);
}
.form_container {
  display: flex;
  justify-content: center;
  flex-grow: 3;
  width: 100%;
  gap: 10px;
}

.form-row__input {
  font: var(--font-family);
  display: flex;
  padding: 8px;
  border: none;
  border-radius: 8px;
  background: #f3f3f3;
  font-weight: 500;
  font-size: 16px;
  flex: 1;
  min-width: 100px;
  color: black;
  resize: none;
}
.form-row__input::placeholder {
  color: #696969;
}
</style>
