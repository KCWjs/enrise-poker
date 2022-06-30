<template>
  <div style="display: flex; justify-content: center; gap: 5vw">
    <div
      :key="card.id"
      v-for="card of cards"
      class="center card"
    >
      {{ card }}
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      cards: ["1", "2", "3", "4", "5"],
    };
  },
};
</script>

<style>
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
.card {
  position: relative;
  width: calc(100vw / 10);
  height: calc(100vw / 10 * 1.5);
  background-image: url('http://localhost:3000/card base.png');
  background-size: 100% 100%;
  color: white;
  font-weight: bold;
  font-size: xx-large;
  cursor: pointer;
  transform: scale(1);
  transition: transform 0.75s;
}
.card:hover {
  transform: translate(0, -50px) scale(1.1) rotate(7deg);
}
</style>
