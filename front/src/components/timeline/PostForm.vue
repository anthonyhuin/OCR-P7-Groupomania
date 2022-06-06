<script setup>
import { z } from "zod";
import { toFormValidator } from "@vee-validate/zod";
import { useField, useForm } from "vee-validate";
import { useRouter } from "vue-router";
import { useUser, usePost } from "@/shared/stores";
import axios from "axios";
import { ref } from "vue";
const userStore = useUser();
const postStore = usePost();
const router = useRouter();
let clean = ref("");
clean.value = "bonjour";
let imagePost = ref(null);
let imagePreview = ref(null);
let inputfile = ref(null);

const validationSchema = toFormValidator(
  z.object({
    post: z.string({ required_error: "Veuillez renseigner ce champ" }).max(500, "Le post doit faire moins de 500 caractères").min(1, "Le post doit faire plus de 1 caractère"),
  })
);

function onChange(e) {
  const regexImage = new RegExp("(image)[\/](gif|jpg|jpeg|png)");
  imagePost = e.target.files[0];
  if (e.target.files[0].size > 1000000) {
    imagePost = null;
    setErrors({ post: "Le fichier dépasse 1moo" });
  } else {
    if (regexImage.test(imagePost.type)) {
      imagePreview.value = URL.createObjectURL(imagePost);
      setErrors({ post: "" });
    } else {
      imagePost = null;
      setErrors({ post: "Format de fichier incompatabile" });
    }
  }
}

function resetImageInput() {
  imagePost = null;
  imagePreview.value = "";
}

const { handleSubmit, setErrors } = useForm({
  validationSchema,
});

const submit = handleSubmit((formValue) => {
  formValue["picture"] = imagePost;

  axios
    .post("/api/post", formValue, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((response) => {
      postStore.posts.splice(0, 0, response.data);
      imagePost = null;
      imagePreview.value = "";
      postValue.value = "";
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
        <textarea name="post" id="post" placeholder="Quoi de neuf ?" rows="2" v-model.lazy="postValue"> </textarea>
      </div>

      <div class="form-button">
        <div class="icon_form">
          <input @change="onChange" type="file" name="picture" id="picture" class="inputfile" ref="inputfile" accept="image/png, image/jpeg, image/jpg, image/gif" />
          <label for="picture"><i class="fa-solid fa-image"></i></label>

          <i class="fa-solid fa-face-grin-wide"></i>
        </div>
        <p v-if="postError" class="form-error">{{ postError }}</p>
        <button class="btn">
          <span>Publier</span>
        </button>
      </div>
      <div v-if="imagePreview" class="form_preview">
        <span @click="resetImageInput" class="preview_reset"><i class="fa-solid fa-xmark"></i></span>
        <img :src="imagePreview" class="preview_image" />
      </div>
    </form>
  </div>
</template>

<style lang="scss" scoped>
.form_preview {
  position: relative;

  .preview_reset {
    position: absolute;
    top: 0;
    left: 0;
    backdrop-filter: blur(4px);
    background-color: rgba(15, 20, 25, 0.75);
    color: rgb(255, 255, 255);
    margin: 10px;
    border-radius: 50%;
    cursor: pointer;
    height: 25px;
    width: 25px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: 0.3s;
    &:hover {
      background-color: rgba(122, 122, 122, 0.75);
    }
  }
  .preview_image {
    border-radius: 20px;
    width: 100%;
    max-height: 400px;
    object-fit: cover;
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
