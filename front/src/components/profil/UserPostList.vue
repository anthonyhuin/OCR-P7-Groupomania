<script setup>
import moment from "moment";
import "moment/dist/locale/fr";
import axios from "axios";
import { useProfil, useUser } from "@/shared/stores";
import { ref, watch } from "vue";
import { useRoute } from "vue-router";
import EditPost from "./EditPost.vue";
import { notify } from "@kyvg/vue3-notification";

const profilStore = useProfil();
const userStore = useUser();
const route = useRoute();
let inputComment = ref([]);

function setLike(postId, index) {
  axios
    .post("/api/like", {
      postId: postId,
    })
    .then((response) => {
      if (response.data.liked) {
        profilStore.posts[index].Likes.splice(0, 0, response.data.data);
      } else {
        let indexOf = profilStore.posts[index].Likes.findIndex((object) => {
          return object.userId == userStore.currentUser.id;
        });
        profilStore.posts[index].Likes.splice(indexOf, 1);
      }
    })
    .catch((error) => {
      notification(error.response.data.erreur, "error");
    });
}

function foundLike(index) {
  let checkIfLiked = obj => obj.userId == userStore.currentUser.id;
  return profilStore.posts[index].Likes.some(checkIfLiked)
}

function deletePost(postId, index) {
  axios
    .delete(`/api/post/${postId}`)
    .then((response) => {
      profilStore.posts[index].clickDelete = true;
      notification("Post supprimé", "success");
      profilStore.posts.splice(index, 1);
    })
    .catch((error) => {
      notification(error.response.data.erreur, "error");
    });
}

function deleteComment(commentId, indexPost, indexComment) {
  axios
    .delete(`/api/comment/${commentId}`)
    .then((response) => {
      notification("Commentaire supprimé", "info");
      profilStore.posts[indexPost].Comments.splice(indexComment, 1);
    })
    .catch((error) => {
      notification(error.response.data.erreur, "error");
    });
}

function getAllPosts() {
  profilStore.isloading = true;
  axios
    .get(`/api/profil/post/${route.params.id}`)
    .then(function (response) {
      profilStore.posts = response.data;
      profilStore.isloading = false;
    })
    .catch(function (error) {
      console.log(error);
    })
    .then(function () {
      profilStore.isloading = false;
    });
}
getAllPosts();

watch(
  () => route.params.id,
  () => {
    getAllPosts();
  }
);

function formatTime(time) {
  return moment(time, "YYYY-MM-DD hh-mm-ss").subtract(-2, "hours").fromNow();
}

function createComment(postId, comment, index) {
  const body = { comment: comment };
  axios
    .post(`/api/comment/${postId}`, body)
    .then((response) => {

      profilStore.posts[index].Comments.splice(0, 0, response.data);

      inputComment = "";
    })
    .catch((error) => {
      notification(error, "error");
    });
}

function notification(title, type, duration) {
  notify({
    duration: duration ? duration : 3000,
    type: type ? type : "info",
    title: title,
  });
}

function displayOptionBtn(postUserId) {
  if (userStore.currentUser.id == postUserId || userStore.currentUser.roles == 'admin')
    return true
  else return false
}

</script>

<template>
  <div class="loader_container" v-if="profilStore.isloading">
    <div class="loader"></div>
  </div>

  <div class="zero-post" v-else-if="profilStore.posts.length < 1">Aucune publication</div>
  <div v-else class="container">
    <div class="card" v-for="(post, index) in profilStore.posts">
      <div class="card_header">
        <div class="header_pp"><img :src="post.User.profilePicture" class="profil_picture" /></div>

        <div class="header_info">
          <router-link :to="'/profil/' + post.User.id" class="menu_link">
            <span class="header_pseudo">{{ post.User.firstName + " " + post.User.lastName }}</span>
          </router-link>
          <span class="header_time">{{ formatTime(post.createdAt) }} <i class="fa-regular fa-clock"></i></span>
        </div>

        <div class="header_edit" v-if="displayOptionBtn(post.User.id)"
          @click="profilStore.posts[index].editMode = !profilStore.posts[index].editMode">
          <i class="fa-solid fa-ellipsis"></i>

          <div class="comment_edit_container" v-if="profilStore.posts[index].editMode"
            v-click-outside="() => (profilStore.posts[index].editMode = false)">
            <span class="edit_delete"
              @click="deletePost(post.id, index), (profilStore.posts[index].editMode = !profilStore.posts[index].editMode)"><i
                class="fa-solid fa-trash-can"></i> Supprimer</span>
            <span @click="profilStore.posts[index].editPost = true"><i class="fa-solid fa-pen-to-square"></i>
              Editer</span>
          </div>
        </div>

      </div>

      <div class="card_body">
        <EditPost v-if="profilStore.posts[index].editPost" :post-id="post.id" :post="post.post" :index="index" />
        <p>
          {{ post.post }}
        </p>
        <img v-if="post.picture !== null" :src="post.picture" class="picture_post" />
      </div>

      <div class="card_stats">
        <div class="stats_like" :class="{ liked: foundLike(index) }" @click="setLike(post.id, index)"><i
            class="fa-regular fa-thumbs-up"></i> J'aime ({{
                profilStore.posts[index].Likes.length
            }})</div>
        <div class="stats_comment">
          <i class="fa-regular fa-comment"></i> Commentaire<span class="comment_plural"
            v-if="profilStore.posts[index].Comments.length > 1">s</span> ({{ profilStore.posts[index].Comments.length
            }})
        </div>
      </div>

      <div v-for="(comment, key) in post.Comments" class="card_comment">
        <div class="comment_container">
          <div class="comment_pp"><img :src="comment.User.profilePicture" class="profil_picture_comment" /></div>
          <div class="comment_bulle">
            <div class="comment_pseudo">
              <router-link :to="'/profil/' + comment.User.id" class="menu_link">{{ comment.User.firstName + " " +
                  comment.User.lastName
              }}</router-link>
              <div class="comment_edit" v-if="displayOptionBtn(comment.User.id)"
                @click="deleteComment(comment.id, index, key)">
                <i class="fa-solid fa-trash-can"></i>
              </div>
            </div>
            <p class="comment_text">{{ comment.comment }}</p>
            <span class="comment_time">{{ formatTime(comment.createdAt) }} <i class="fa-regular fa-clock"></i></span>
          </div>
        </div>
      </div>

      <div class="card_form">
        <div class="form_pp"><img :src="userStore.currentUser.profilePicture" class="profil_picture_comment" /></div>
        <form
          @submit.prevent="createComment(post.id, this.inputComment[index], index), (this.inputComment[index] = null)"
          class="card_form_input">
          <textarea :placeholder="'Répondre à ' + post.User.firstName" class="input_comment" name="text"
            id="commentaire" v-model.trim="inputComment[index]"> </textarea>
          <button class="card_btn btn"><i class="fa-regular fa-comments"></i></button>
        </form>
      </div>

    </div>

  </div>
</template>

<style lang="scss" scoped>
.container {
  margin-bottom: 60px;
}

.input_comment {
  height: 30px;
}

.comment_plural {
  margin-left: -3px;
}

.comment_edit_container {
  position: absolute;
  top: 0;
  right: 0;
  background-color: var(--background-card);
  border-radius: 5px;
  padding: 0 10px;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  user-select: none;
  min-width: 130px;
  box-shadow: rgb(101 119 134 / 20%) 0px 0px 15px, rgb(101 119 134 / 15%) 0px 0px 3px 1px;

  span {
    color: var(--text-color);
    padding: 10px 0;

    i {
      margin-right: 5px;
    }

    &:hover {
      color: #131313;
    }
  }
}

.zero-post {
  font-size: 2rem;
  text-align: center;
  margin: 30px;
  font-weight: 600;
}


.card_form {
  display: flex;
  flex: 1 1 auto;
  margin-top: 10px;
  min-height: 30px;
}

.card_form_input {
  flex: 1 1 auto;
}

form {
  display: flex;
}

.card_btn {
  margin: 0px 0 0px 10px;
}

.form_pp {
  margin-right: 10px;
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.error {
  color: var(--danger-1);
}

.profil_picture {
  height: 38px;
  width: 38px;
  border-radius: 50%;
  border: solid 0px transparent;
  flex-shrink: 0;
  box-shadow: 0 0 1px 0 gray inset, 0 0 1px 0 gray;
}

.profil_picture_comment {
  height: 25px;
  width: 25px;
  border-radius: 50%;
  border: solid 0px black;

  flex-shrink: 0;
  box-shadow: 0 0 1px transparent;
}

.card {
  background-color: var(--background-card);
  display: flex;
  flex-direction: column;
  padding: 10px;
  border-radius: var(--border-radius);
  margin-top: 16px;
  box-shadow: var(--box-shadow);
  transition: 0.5s ease-out;
}

/*//////////////////////////////////////////////////////////*/
.card_header {
  display: flex;
}

.header_pp {
  margin-right: 10px;
  display: flex;
  align-items: center;
}

.header_info {
  flex-grow: 3;
  display: flex;
  flex-direction: column;

  justify-content: center;
}

.header_pseudo {
  font-weight: 600;
}

.header_time {
  font-size: 0.8rem;
  color: var(--text-subtitle);
}

.header_edit {
  padding: 10px;
  cursor: pointer;
  position: relative;
}

.header_edit:hover {
  color: var(--danger-1);
}

.edit_delete {
  color: var(--danger-1) !important;

  &:hover {
    color: var(--danger-2) !important;
  }
}

/*/ /////////////////////////////////////////////////////////*/

.card_body {
  margin: 10px -10px 10px -10px;
  font-size: 1rem;

  p {
    margin: 0 10px 0px 10px;
  }
}

/*//////////////////////////////////////////////////////////*/

.card_stats {
  border-top: var(--border-in);
  border-bottom: var(--border-in);

  display: flex;
  justify-content: space-around;
  /* color: #65676b; */
  color: var(--gray-4);
  font-size: 0.8rem;
  font-weight: 600;
}

.liked {
  color: var(--primary-1);
}

.stats_like {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 8px;
  gap: 3px;
  width: 100%;
}

.stats_comment {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 3px;
  padding: 8px;
  width: 100%;
}

.stats_comment:hover,
.stats_like:hover {
  background-color: var(--gray-1);
  cursor: pointer;
}

/*/ /////////////////////////////////////////////////////////*/
.comment_more {
  margin: 10px 0 10px 0;
  font-weight: 500;
  color: var(--text-color);
  font-size: 0.8rem;
}

.comment_container {
  display: flex;
  flex-direction: row;
  border-bottom: var(--border-in);
  padding: 8px;
}

.comment_pp {
  margin-right: 10px;
  display: flex;
  align-items: flex-start;
  flex-shrink: 0;
}

.comment_bulle {
  display: flex;
  flex-direction: column;
  gap: 3px;
  flex: 1 1 auto;
}

.comment_pseudo {
  display: flex;
  justify-content: space-between;
  font-weight: 600;
  font-size: 1rem;
}

.comment_text {
  font-size: 1rem;
}

.comment_time {
  color: var(--text-subtitle);
  font-size: 0.8rem;
}

.comment_edit {
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

.comment_edit:hover {
  color: var(--danger-1);
}

.fa-clock {
  font-size: 0.7rem;
}
</style>
