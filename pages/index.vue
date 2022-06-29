<template>
  <div class="full center">
    <div class="indexButtonGroup">
      <NuxtLink to="/init/make"><button>Make</button></NuxtLink>
      <NuxtLink to="/init/join"><button>Join</button></NuxtLink>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Welcome',
  transition: {
    name: 'layout',
    mode: 'out-in'
  }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Lato:wght@300&display=swap');

.layout-enter-active,
.layout-leave-active {
  transition: opacity 0.25s;
}
.layout-enter,
.layout-leave-active {
  opacity: 0;
}

:root {
  --background: #f5f5ff;
  --button: #f2a900;
  --buttondark: #c98c00;
}
body {
  background-color: var(--background);
  font-family: 'Lato', sans-serif;
}
.center {
  display: flex;
  justify-content: center;
  align-items: center;
}
.full {
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
}

/* Not global styles */
.indexButtonGroup {
  position: relative;
  width: 40vw;
  display: flex;
  justify-content: space-between;
}
.indexButtonGroup button {
  position: relative;
  width: 15vw;
  height: 8vw;
  font-family: 'Lato', sans-serif;
  font-size: 3vw;
  border: none;
  background: var(--button);
  border-radius: 1vw;
  border: 5px solid var(--buttondark);
  filter: brightness(100%);
  transition: filter 0.5s;
  cursor: pointer;
}
.indexButtonGroup button:hover {
  filter: brightness(115%);
}
</style>
