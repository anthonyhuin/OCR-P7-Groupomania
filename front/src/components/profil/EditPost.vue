<script setup>
import { notify } from "@kyvg/vue3-notification";
import { z } from "zod";
import { toFormValidator } from "@vee-validate/zod";
import { useField, useForm } from "vee-validate";
import axios from "axios";
import { useProfil } from "@/shared/stores";

const profilStore = useProfil();

let props = defineProps({
  postId: Number,
  post: String,
  index: Number,
});

const validationSchema = toFormValidator(
  z.object({
    post: z.string({ required_error: "Veuillez renseigner ce champ" }).nonempty().max(500, "Le post doit faire moins de 500 caractères"),
  })
);

const { handleSubmit, setErrors } = useForm({
  validationSchema,
});

const submit = handleSubmit(async (formValue) => {
  try {
    axios
      .patch(`/api/post/${props.postId}`, formValue)
      .then((response) => {
        profilStore.posts[props.index].post = response.data;
        profilStore.posts[props.index].editPost = false;
        notify({
          type: "success",
          title: "Post modifié",
        });
      })
      .catch((error) => {
        console.log(error);
        notify({
          type: "error",
          title: error,
        });
      });
  } catch (e) {
    setErrors({ post: e });
  }
});

const { value: postValue, errorMessage: postError } = useField("post");

postValue.value = props.post;
</script>
<template>
  <div class="edit_container" @click="profilStore.posts[props.index].editPost = false">
    <div v-on:click.stop class="edit_profil">
      <form @submit.prevent="submit">
        <div class="form">
          <div class="field name-input">
            <label class="label" for="post">Modifier le post</label>

            <textarea name="post" id="post" rows="2" cols="4" v-model="postValue">
            </textarea>
            <p v-if="postError" class="field-error">{{ postError }}</p>
          </div>
          <div class="form-controls">
            <button class="btn cancel" @click="profilStore.posts[props.index].editPost = false">Annuler</button>
            <button class="btn submit">Enregistrer</button>
          </div>
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
  border-radius: var(--border-radius);
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
