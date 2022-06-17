<script setup>
import { useUser, usePost } from "@/shared/stores";
import axios from "axios";
import { ref } from "vue";
const userStore = useUser();
const postStore = usePost();

const imagePost = ref(null);
const imagePreview = ref(null);
const postValue = ref('')
const postError = ref('')
const inputfile = ref(null)

function uploadImage(e) {
  const regexImage = new RegExp("(image)[\/](gif|jpg|jpeg|png)");
  imagePost.value = e.target.files[0];
  if (imagePost.value != null) {
    if (imagePost.value.size > 1000000) {
      imagePost.value = null;
      postError.value = "Le fichier dépasse 1mo";
    } else {
      if (regexImage.test(imagePost.value.type)) {
        imagePreview.value = URL.createObjectURL(imagePost.value);
        postError.value = ""
      } else {
        imagePost.value = null;
        postError.value = "Format de fichier incompatible";
      }
    }
  }

}

function resetImageInput() {
  inputfile.value = null;
  imagePost.value = null;
  imagePreview.value = null;


}

function submit() {
  if (postValue.value.length > 0 || imagePost.value != null) {
    if (postValue.value.length > 500) {
      return postError.value = "Le post doit faire moins de 500 caractères"
    }
    let data = { "post": postValue.value, "picture": imagePost.value, }
    axios.post("/api/post", data, { headers: { "Content-Type": "multipart/form-data", }, })
      .then((response) => {
        postStore.posts.splice(0, 0, response.data);
        imagePost.value = null;
        inputfile.value = null
        imagePreview.value = null;
        postValue.value = "";
        postError.value = ""
      })
      .catch((error) => {
        postError.value = error.response.data.erreur
      });
  } else {
    postError.value = "Veuillez renseigner au moins un champ"
  }
};




</script>

<template>
  <div class="form_main">
    <h2>Accueil</h2>
    <form @submit.prevent="submit" enctype="multipart/form-data">
      <div class="form_container">
        <div class="form_pp"><img :src="userStore.currentUser.profilePicture" class="profil_pic" alt="" /></div>
        <textarea name="post" id="post" placeholder="Quoi de neuf ?" rows="2" v-model.trim="postValue"> </textarea>
      </div>

      <div class="form-button">
        <div class="icon_form">
          <input @change="uploadImage" type="file" name="picture" id="picture" class="inputfile" ref="inputfile"
            accept="image/png, image/jpeg, image/jpg, image/gif" />
          <label for="picture"><i class="fa-solid fa-image"></i></label>


        </div>
        <p v-if="postError" class="form-error">{{ postError }}</p>
        <div class="right_bloc">
          <div v-if="postValue" class="progressbar"></div>
          <button class="btn">
            <span>Publier</span>
          </button>
        </div>

      </div>
      <div v-if="imagePreview" class="form_preview">
        <span @click="resetImageInput" class="preview_reset"><i class="fa-solid fa-xmark"></i></span>
        <img :src="imagePreview" class="preview_image" />
      </div>
    </form>
  </div>
</template>

<style lang="scss" scoped>
.progressbar {
  --percentage: v-bind(postValue.length);

  width: 1.3rem;
  height: 1.3rem;
  border-radius: 50%;
  background:
    radial-gradient(closest-side, white 80%, transparent 0 99.9%),
    conic-gradient(var(--primary-1) calc(var(--percentage) * 0.2%), var(--gray-1) 0);

}

///////////////////////////////
.right_bloc {
  display: flex;
  gap: 15px;
  align-items: center;
}

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
    width: 100%;
    max-height: 400px;
    object-fit: contain;
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
  padding-left: 59px;
  align-items: center;
}

.form-button i {
  color: var(--primary-1);
  font-size: 1.1rem;
  margin-right: 10px;
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

@media only screen and (max-width: 800px) {

  .form_main {
    border-radius: 0 0 5px 5px !important;
  }

}
</style>
