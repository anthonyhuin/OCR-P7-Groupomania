<script setup>
import { z } from "zod";
import { toFormValidator } from "@vee-validate/zod";
import { useField, useForm } from "vee-validate";
import moment from "moment";
import "moment/dist/locale/fr";
import axios from "axios";
import { usePost, useUser } from "@/shared/stores";
import { ref } from "vue";
import Textarea from "../textarea.vue";
import "animate.css";
const postStore = usePost();
const userStore = useUser();
let inputParams = ref([]);
function setLike(postId, index) {
  postStore.posts[index].hasLiked = !postStore.posts[index].hasLiked;

  axios
    .post("/api/like", {
      postId: postId,
    })

    .then((response) => {
      console.log(response.data);
      postStore.posts[index].likeCount = response.data.count;
    })
    .catch((error) => {
      errorMessage.value = error.response.data.error;
    });
}

function deletePost(postId, index) {
  axios
    .delete(`/api/post/${postId}`)
    .then((response) => {
      setTimeout(() => {
        postStore.posts[index].errorMessage = "Post supprimé";

        postStore.posts.splice(index, 1);
      }, 500);
    })
    .catch((error) => {
      postStore.posts[index].errorMessage = error.response.data.error;
    });
}
function deleteComment(commentId, indexPost, indexComment) {
  axios
    .delete(`/api/comment/${commentId}`)
    .then((response) => {
      postStore.posts[indexPost].errorMessage = "Commentaire supprimé";
      postStore.posts[indexPost].comments.splice(indexComment, 1);
    })
    .catch((error) => {
      postStore.posts[index].errorMessage = error.response.data.error;
    });
}
function getAllPosts() {
  axios
    .get("/api/post")
    .then(function (response) {
      postStore.posts = response.data;
    })
    .catch(function (error) {
      console.log(error);
    })
    .then(function () {
      postStore.isloading = false;
    });
}
getAllPosts();

function formatTime(time) {
  return moment(time, "YYYY-MM-DD hh-mm-ss").subtract(-2, "hours").fromNow();
}

function createComment(postId, comment, index) {
  const body = { comment: comment };
  axios
    .post(`/api/comment/${postId}`, body)
    .then((response) => {
      let indexOf = postStore.posts.findIndex((object) => {
        return object.id == postId;
      });
      postStore.posts[indexOf].comments.splice(0, 0, response.data);
    })
    .catch((error) => {
      console.log({ erreur: error });
    });
}
</script>

<template>
  <div class="card animate__animated" v-for="(post, index) in postStore.posts" :class="{ animate__zoomOut: postStore.posts[index].clickDelete }">
    <div class="card_header">
      <div class="header_pp"><img :src="post.profilePicture" class="fake_pp" /></div>
      <div class="header_info">
        <span class="header_pseudo">{{ post.firstName + " " + post.lastName }}</span>
        <span class="header_time">{{ formatTime(post.createdAt) }} <i class="fa-regular fa-clock"></i></span>
      </div>
      <div class="header_edit" v-if="userStore.currentUser.id === post.userId" @click="deletePost(post.id, index), (postStore.posts[index].clickDelete = true)">
        <i class="fa-solid fa-ellipsis"></i>
      </div>
    </div>
    <div class="card_body">
      <p>
        {{ post.post }}
      </p>
    </div>
    <div class="card_stats">
      <div class="stats_like" :class="{ liked: post.hasLiked }" @click="setLike(post.id, index)"><i class="fa-regular fa-thumbs-up"></i> J'aime ({{ post.likeCount }})</div>
      <div class="stats_comment"><i class="fa-regular fa-comment"></i> Commenter ({{ postStore.posts[index].comments.length }})</div>
    </div>

    <div v-for="(comment, key) in post.comments" class="card_comment">
      <div class="comment_container">
        <div class="comment_pp"><img :src="comment.profilePicture" class="fake_pp_comment" /></div>
        <div class="comment_bulle">
          <div class="comment_pseudo">
            <p>{{ comment.firstName + " " + comment.lastName }}</p>
            <div class="comment_edit" v-if="userStore.currentUser.id === comment.userId" @click="deleteComment(comment.id, index, key)"><i class="fa-solid fa-ellipsis"></i></div>
          </div>
          <p class="comment_text">{{ comment.comment }}</p>
          <span class="comment_time">{{ formatTime(comment.createdAt) }} <i class="fa-regular fa-clock"></i></span>
        </div>
      </div>
    </div>
    <div class="card_form">
      <div class="form_pp"><img :src="userStore.currentUser.profilePicture" class="fake_pp_comment" /></div>
      <form @submit.prevent="createComment(post.id, this.inputParams[index], index), (this.inputParams[index] = '')" class="card_form_input">
        <textarea v-model="inputParams[index]" name="text" id="commentaire" :placeholder="'Répondre à ' + post.firstName"></textarea>

        <button class="card_btn btn"><i class="fa-regular fa-comments"></i></button>
      </form>
    </div>
  </div>
</template>

<style scoped>
:root {
  --animate-duration: 800ms;
  --animate-delay: 0.8s;
}
.byebye {
  background-color: #131313 !important;
}
.card_form {
  display: flex;
  flex: 1 1 auto;
  margin-top: 10px;
  height: 30px;
}
.card_form_input {
  flex: 1 1 auto;
}
form {
  display: flex;
}
textarea {
  border: none;
  resize: none;
  background-color: #f3f3f3;
  width: 100%;
  flex-grow: 3;
  font-family: inherit;
  padding: 5px;
  border-radius: 3px;
  height: 100%;
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

.fake_pp {
  height: 38px;
  width: 38px;
  border-radius: 50%;
  border: solid 0px transparent;
  flex-shrink: 0;
  box-shadow: 0 0 1px 0 gray inset, 0 0 1px 0 gray;
}
.fake_pp_comment {
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
  border-radius: 2px;
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
  font-size: 0.7rem;
  color: var(--text-subtitle);
}
.header_edit {
  padding: 10px;
  cursor: pointer;
}
.header_edit:hover {
  color: var(--danger-1);
}
/*/ /////////////////////////////////////////////////////////*/

.card_body {
  margin: 10px 0 10px 0;
  font-size: 0.9rem;
}
/*//////////////////////////////////////////////////////////*/

.card_stats {
  border-top: var(--border-in);
  border-bottom: var(--border-in);

  display: flex;
  justify-content: space-around;
  /* color: #65676b; */
  color: var(--gray-4);
  font-size: 0.7rem;
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
  font-size: 0.8rem;
}
.comment_text {
  font-size: 0.9rem;
}
.comment_time {
  color: var(--text-subtitle);
  font-size: 0.7rem;
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
  font-size: 0.6rem;
}
</style>
