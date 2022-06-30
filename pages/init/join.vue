<template>
  <div class="full center">
    <div class="centerHorizontal">
      <h1>
        pokerPlanner.joinGame();
      </h1>
      <div class="makeForm">
        <span>room.pin</span><br>
        <input type="text" v-bind:value="roomPin" id="pin"><br><br>
        <span>user.name</span><br>
        <input type="text" v-bind:value="userName" id="name">
        <button @click="doJoinGame">Join room</button>
      </div>
    </div>
  </div>
</template>

<script>
Array.prototype.pickRandom = function(){
  return this[Math.floor(Math.random()*this.length)];
}
export default {
  data(){
    return {
      roomPin: "0",
      userName: ["Roland", "Grover", "Betty", "Stacy", "Kiki", "Janelle", "Roger", "Bertha", "Idrees"].pickRandom()
    }
  },
  methods: {
    doJoinGame(){
      this.roomPin = document.getElementById("pin").value;
      this.userName = document.getElementById("name").value;

      this.$router.push('/room/'+this.roomPin+"?master=false&username="+this.userName);
    }
  },
  transition: {
    name: 'layout',
    mode: 'out-in'
  }
};
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Lato:wght@300&display=swap");

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
  font-family: "Lato", sans-serif;
}
.center {
  display: flex;
  justify-content: center;
  align-items: center;
}
.centerHorizontal {
  display: flex;
  align-items: center;
  flex-direction: column;
}
.full {
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
}

/* Not global styles */
.makeForm {
  margin: 0;
  position: relative;
  width: 33vw;
  padding: 20px;
  background-color: white;
  border: 3px solid rgb(226, 226, 226);
  border-radius: 10px;
  line-height: 30px;
}
.makeForm input {
  position: relative;
  width: calc(100% - 5px);
  border: 2px solid lightgrey;
  outline: none;
}
.makeForm button {
  position: relative;
  margin-top: 10px;
  padding: 5px;
  font-family: 'Lato', sans-serif;
  font-size: 15px;
  border: none;
  background: var(--button);
  border-radius: 1vw;
  border: 2px solid var(--buttondark);
  filter: brightness(100%);
  transition: filter 0.5s;
  cursor: pointer;
}
.makeForm button:hover {
  filter: brightness(115%);
}
</style>
