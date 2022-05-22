<script setup>
import moment from "moment";
import "moment/dist/locale/fr";
import axios from "axios";
import { usePost, useUser } from "@/shared/stores";
import { ref } from "vue";
import { useRoute } from "vue-router";
import { z } from "zod";
import { toFormValidator } from "@vee-validate/zod";
import { useField, useForm } from "vee-validate";
import { useRouter } from "vue-router";
const route = useRoute();
const postStore = usePost();
const userStore = useUser();
let post = ref({});
let comments = ref([]);

axios
  .get(`/api/comment/${route.params.id}`)
  .then(function (response) {
    console.log(response.data.commentaires);
    return (post.value = response.data.post), (comments.value = response.data.commentaires);
  })
  .catch(function (error) {
    console.log(error);
  })
  .then(function () {
    postStore.isloading = false;
  });

const validationSchema = toFormValidator(
  z.object({
    comment: z.string({ required_error: "Veuillez renseigner ce champ" }).min(5, "Le post doit faire au moins 5 caractères").max(500, "Le post doit faire moins de 200 caractères"),
  })
);

const { handleSubmit, setErrors } = useForm({
  validationSchema,
});

const submit = handleSubmit((formValue) => {
  axios
    .post(`/api/comment/${route.params.id}`, formValue)
    .then((response) => {
      console.log(comments);
      return comments.value.splice(0, 0, response.data);
    })
    .catch((error) => {
      setErrors({ comment: error });
    });
});

const { value: commentValue, errorMessage: commentError } = useField("comment");
</script>

<template>
  <div class="container">
    <div class="post">
      <div class="header_post">
        <div class="header_post_pp"><img :src="post.profilePicture" class="profil_pic" alt="" /></div>
        <div class="header_post_timeago">
          <h3>{{ post.firstName + " " + post.lastName }}</h3>
          <h6><i class="fa-solid fa-clock"></i> {{ moment(post.createdAt, "YYYY-MM-DD hh-mm-ss").subtract(-2, "hours").fromNow() }}</h6>
        </div>
        <div v-if="userStore.currentUser.id === post.userId" @click="deletePost(post.id, index)" class="header_post_trash"><i class="poubelle fa-solid fa-trash-can"></i></div>
      </div>
      <div class="content_post">
        {{ post.post }}
      </div>
      <div class="comment_post">
        <a @click="setLike(post.id, userStore.currentUser.id)" class="comment_post_interact">
          <i class="fa-fw fa-solid fa-thumbs-up"></i>
          <p>J'aime ({{ post.like }})</p>
        </a>

        <a :href="'/comment/' + post.id" class="comment_post_interact">
          <i class="fa-fw fa-solid fa-message"></i>
          <p>Commenter (0)</p>
        </a>

        <p class="error" v-if="post.errorMessage">{{ post.errorMessage }}</p>
      </div>
    </div>

    <form class="form_comment" @submit="submit">
      <div class="form_pp"><img :src="userStore.currentUser.profilePicture" class="profil_pic" alt="" /></div>
      <div class="form_container">
        <div class="form-row">
          <textarea v-model="commentValue" class="form-row__input" id="comment" placeholder="Quoi de neuf ?"></textarea>
        </div>
        <p v-if="commentError" class="form-error">{{ commentError }}</p>
      </div>

      <button class="btn">
        <span>Publier</span>
      </button>
    </form>

    <div v-for="(comment, index) in comments" class="post">
      <div class="header_post">
        <div class="header_post_pp"><img :src="comment.profilePicture" class="profil_pic" alt="" /></div>
        <div class="header_post_timeago">
          <h3>{{ comment.firstName + " " + comment.lastName }}</h3>
          <h6><i class="fa-solid fa-clock"></i> {{ moment(comment.createdAt, "YYYY-MM-DD hh-mm-ss").subtract(-2, "hours").fromNow() }}</h6>
        </div>
        <div v-if="userStore.currentUser.id === comment.userId" @click="deletePost(comment.id, index)" class="header_post_trash"><i class="poubelle fa-solid fa-trash-can"></i></div>
      </div>
      <div class="content_post">
        {{ comment.comment }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.form_comment {
  display: flex;
  justify-content: space-around;
  background-color: rgb(255, 255, 255);
}

.error {
  color: var(--danger-1);
}
.loader {
  height: 5rem;
  width: 5rem;
  border-radius: 50%;
  border: 10px solid rgb(192, 192, 192);
  border-top-color: #131313;
  box-sizing: border-box;
  background: transparent;
  animation: loading 1s linear infinite;
}

@keyframes loading {
  0% {
    transform: rotate(0deg);
  }
  0% {
    transform: rotate(360deg);
  }
}
.post {
  margin-top: var(--m-15);
  background-color: var(--background-card);
  border: var(--border);
  padding: var(--p-15);
  box-shadow: var(--box-shadow);
  border-radius: var(--border-radius);
}
/*******************header post *********************/
.header_post {
  display: flex;
  gap: 15px;
}
.header_post_pp {
  display: flex;
  justify-content: center;
  align-items: center;
}
.header_post_timeago {
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  justify-content: center;
}
h3 {
  font-size: 1rem;
  color: var(--text-color);
  font-weight: 700;
}
h6 {
  color: var(--text-subtitle);
  font-weight: 500;
  display: flex;
  justify-content: start;
  align-items: center;
}
h6 i {
  font-weight: 500;
  margin-right: 5px;
}
.header_post {
  display: flex;
  justify-content: center;
  align-items: center;
}
.header_post_trash i {
  color: var(--danger-1);
  cursor: pointer;
}
.header_post_trash i:hover {
  color: var(--danger-2);
}
/***************content_post *****************/
.content_post {
  padding: var(--p-15);
}
/***************comment_post *****************/
.comment_post {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  border-top: var(--border-in);
  padding-top: var(--p-15);
}
.comment_post_interact {
  display: flex;
  color: var(--primary-1);
  align-items: center;
  font-size: 1rem;
  cursor: pointer;
  user-select: none;
}
.comment_post_interact p {
  font-size: 0.7rem;
}
</style>
