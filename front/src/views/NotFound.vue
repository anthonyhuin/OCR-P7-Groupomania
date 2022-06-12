<script setup></script>

<template>

  <div class="body">
    <h1>404</h1>
    <p>Oops! Quelque chose ne va pas.</p>
    <router-link :to="'/'" class="button"><i class="icon-home"></i>Retourner à l'accueil</router-link>
  </div>

</template>

<style scoped>
@import url(https://fonts.googleapis.com/css?family=Roboto:400,100,300,500);



.body {
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  height: 100vh;
  background-color: var(--primary-1);
  color: #fff;
  font-size: 100%;
  line-height: 1.5;
  font-family: "Roboto", sans-serif;
}

.button {
  font-weight: 300;
  color: #fff;
  font-size: 1.2rem;
  text-decoration: none;
  border: 1px solid #efefef;
  padding: .5rem;
  border-radius: 3px;
  margin-top: 50px;
  position: relative;
  transition: all .3s linear;
}

.button:hover {
  background-color: #ffffff;
  color: #fff;
  color: black;
}

p {
  font-size: 2rem;
  font-weight: 100;
  text-align: center;
}

h1 {

  font-size: 10rem;
  font-weight: 100;
}
</style>
