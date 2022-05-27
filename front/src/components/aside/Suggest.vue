<template>
  <div class="suggest">
    <h2>Suggestions</h2>
    <div class="friend">
      <img src="https://avatars.dicebear.com/api/adventurer-neutral/your-c-seed.svg" class="profil_pic" alt="" />
      <div class="form-button">
        <h3>Bernard Desilets</h3>
        <button class="btn">
          <span>Suivre</span>
        </button>
      </div>
    </div>
    <div class="friend">
      <img src="https://avatars.dicebear.com/api/adventurer-neutral/yougeed.svg" class="profil_pic" alt="" />
      <div class="form-button">
        <h3>Aubert Vadnais</h3>
        <button class="btn">
          <span>Suivre</span>
        </button>
      </div>
    </div>
    <div class="friend">
      <img src="https://avatars.dicebear.com/api/adventurer-neutral/yourgd.svg" class="profil_pic" alt="" />
      <div class="form-button">
        <h3>Harriette Poisson</h3>
        <button class="btn">
          <span>Suivre</span>
        </button>
      </div>
    </div>
  </div>
</template>
<script setup></script>
<style type="scss" scoped>
.suggest {
  background-color: var(--background-card);
  border: var(--border);
  padding: var(--p-15);
  display: flex;
  flex-direction: column;
  box-shadow: var(--box-shadow);
  border-radius: var(--border-radius);
}

.suggest .friend:not(:nth-child(0n + 2)) {
  border-top: var(--border-in);
}

.friend {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: var(--p-10) 0 var(--p-10) 0;
}
.form-button {
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  align-items: flex-start;
  padding: var(--p-5);
}
h2 {
  font-size: 1rem;
  font-weight: 600;
}
h3 {
  font-size: 1rem;
  font-weight: 500;
  margin-bottom: 3px;
}
</style>
