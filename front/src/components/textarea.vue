<template>
  <h1>Auto-Growing <code>&lt;textarea></code></h1>

  <form action="#0">
    <label for="text">Text:</label>
    <div class="grow-wrap">
      <textarea name="text" id="text" onInput="this.parentNode.dataset.replicatedValue = this.value"></textarea>
    </div>
  </form>
</template>

<script></script>

<style scoped>
body {
  margin: 2rem;
  font: 1rem/1.4 system-ui, sans-serif;
}

label {
  display: block;
}
</style>
