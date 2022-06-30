<template>
  <div>
    <!-- game master code -->
    <div v-if="master">
      <div class="contentContainer">
        <div class="centerHorizontal">
          <div style="display: inline" v-if="!topicActive">
            <input
              class="topic"
              id="mastertopic"
              type="text"
              v-bind:value="randomTopic"
            />
            <button class="topic" @click="openTopic()">Open Topic</button>
          </div>
          <div style="display: inline" v-else>
            <button class="topic" @click="closeTopic()">
              Close Topic <b>{{ stats.topic }}</b>
            </button>
          </div>
          <div
            style="
              display: flex;
              justify-content: center;
              margin-top: 25px;
              position: relative;
              width: 50vw;
              gap: 20px;
            "
          >
            <span :key="user.id" v-for="(user, nameof) in stats.users">
              {{ nameof }}
              <span
                v-if="user.didpull"
                style="
                  color: white;
                  background-color: orange;
                  border-radius: 5px;
                  padding: 3px;
                "
                ><b>{{ user.pullvalue }}</b></span
              >
            </span>
          </div>
        </div>
      </div>
      <div class="invite">
        <span @click="copyToClipboard(roompin)" title="click to copy"
          >copy invite pin</span
        >
      </div>
    </div>
    <!-- user code -->
    <div v-else>
      <div class="contentContainer">
        <div class="centerHorizontal">
          <div>
            <h1>
              {{ stats.topic }}
            </h1>
          </div>
          <div style="display: inline" v-if="topicActive">
            <input
              class="topic"
              id="usertopic"
              type="text"
              v-bind:value="pull"
            />
            <button class="topic" @click="sendPull()">Send your guess</button>
          </div>
          <div
            style="
              display: flex;
              justify-content: center;
              margin-top: 25px;
              position: relative;
              width: 50vw;
              gap: 20px;
            "
            v-else
          >
            <span :key="user.id" v-for="(user, nameof) in stats.users">
              {{ nameof }}
              <span
                v-if="user.didpull"
                style="
                  color: white;
                  background-color: orange;
                  border-radius: 5px;
                  padding: 3px;
                "
                ><b>{{ user.pullvalue }}</b></span
              >
            </span>
          </div>
        </div>
      </div>
      <div class="invite">
        <span @click="copyToClipboard(roompin)" title="click to copy"
          >copy invite pin</span
        >
      </div>
      <div class="usernamepreview">
        <span title="you">You are @{{ username }}</span>
      </div>
    </div>
  </div>
</template>

<script defer>
Array.prototype.pickRandom = function () {
  return this[Math.floor(Math.random() * this.length)];
};
export default {
  mounted() {
    this.roompin = this.$route.params.id;
    this.master = this.$route.query.master === "true" || false;
    this.username = this.$route.query.username || "";

    this.$axios.$get("/ws/init").then((resp) => {
      this.socket = io();
      if (this.master) {
        // is a game master
        this.socket.on("ev", (e) => {
          if (e.room == this.roompin) {
            if (e.event == "join") {
              this.stats.users[e.name] = {
                didpull: false,
                pullvalue: 0,
              };
              this.$forceUpdate();
              console.log(this.stats);
              this.socket.emit("ev", {
                room: this.roompin,
                event: "setstats",
                stats: this.stats,
              });
            } else if (e.event == "pullready") {
              this.stats.users[e.name].didpull = true;
              this.stats.users[e.name].pullvalue = e.guess;
              this.randomTopic = ""; // document.getElementById("mastertopic").value;
              this.$forceUpdate();
            }
          }
        });
      } else {
        // is a game user
        this.socket.emit("ev", {
          room: this.roompin,
          event: "join",
          name: this.username,
        });
        this.socket.on("ev", (e) => {
          if (e.room == this.roompin) {
            if (e.event == "setstats") {
              this.stats = e.stats;
              console.log(this.stats);
            } else if (e.event == "starttopic") {
              console.log("new topic: " + e.topic);
              this.topicActive = true;
              this.stats.topic = e.topic;
              for (var i = 0; i < Object.keys(this.stats.users).length; i++) {
                this.stats.users[
                  Object.keys(this.stats.users)[i]
                ].didpull = false;
              }
              this.$forceUpdate();
            } else if (e.event == "closetopic") {
              console.log("end of topic");
              this.topicActive = false;
            } else if (e.event == "pullready") {
              console.log(e);
              this.stats.users[e.name].didpull = true;
              this.stats.users[e.name].pullvalue = e.guess;
              this.pull = document.getElementById("usertopic").value;
              this.$forceUpdate();
            }
          }
        });
      }
    });
  },
  data() {
    return {
      stats: {
        pull: false,
        topic: "Welcome",
        users: {},
      },
      pull: "",
      topicActive: false,
      socket: undefined,
      username: "",
      roompin: "",
      master: false,
      socket: undefined,
      randomTopic: [
        "mountaineering",
        "farmer markets",
        "shells",
        "seashells",
        "horses",
        "wrestling",
        "pipe organs",
        "milk",
        "lions",
        "salt",
      ].pickRandom(),
    };
  },
  methods: {
    openTopic() {
      let topic = document.getElementById("mastertopic").value;
      this.randomTopic = topic;
      this.socket.emit("ev", {
        room: this.roompin,
        event: "starttopic",
        topic: topic,
      });
      this.topicActive = true;
      this.stats.topic = topic;
      for (var i = 0; i < Object.keys(this.stats.users).length; i++) {
        this.stats.users[Object.keys(this.stats.users)[i]].didpull = false;
      }
      this.randomTopic = "";
      document.getElementById("mastertopic").value = "";
      this.$forceUpdate();
    },
    closeTopic() {
      this.socket.emit("ev", {
        room: this.roompin,
        event: "closetopic",
      });
      this.topicActive = false;
    },
    copyToClipboard(text) {
      navigator.clipboard.writeText(text);
    },
    sendPull() {
      this.pull = document.getElementById("usertopic").value;
      console.log(this.pull);
      this.socket.emit("ev", {
        room: this.roompin,
        event: "pullready",
        name: this.username,
        guess: this.pull,
      });
      this.stats.users[this.username] = {
        didpull: true,
        pullvalue: this.pull,
      };
      this.pull = "";
      document.getElementById("usertopic").value = "";
      this.$forceUpdate();
    },
    generateUniqueEmoji() {
      return `&#${[
        "8986",
        "8987",
        "9200",
        "9201",
        "9202",
        "9203",
        "9410",
        "9748",
        "9749",
        "9757",
        "9800",
        "9801",
        "9823",
        "9855",
        "9875",
        "9889",
        "9917",
        "9918",
        "9924",
        "9925",
        "9935",
        "9937",
        "9968",
        "9976",
        "9978",
        "9981",
        "9989",
        "11088",
        "11093",
        "127744",
        "127746",
        "127755",
        "127757",
        "127771",
        "127789",
        "127793",
        "127911",
        "127913",
        "127916",
        "127918",
        "127920",
        "127942",
        "128008",
        "128064",
        "128100",
        "128101",
        "128102",
        "128103",
        "128104",
        "128105",
        "128126",
        "128185",
        "128293",
        "128640",
      ].pickRandom()};`;
    },
  },
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
.contentContainer {
  position: fixed;
  left: 25vw;
  top: 25vh;
  width: 50vw;
  height: 50vh;

  display: flex;
  justify-content: center;
  flex-direction: column;
}

button.topic {
  position: relative;
  margin-top: 10px;
  padding: 5px;
  font-family: "Lato", sans-serif;
  font-size: 15px;
  border: none;
  background: var(--button);
  border-radius: 1vw;
  border: 2px solid var(--buttondark);
  filter: brightness(100%);
  transition: filter 0.5s;
  cursor: pointer;
}
button.topic:hover {
  filter: brightness(115%);
}
input.topic {
  border: 2px solid lightgrey;
  outline: none;
}

.invite > span {
  position: fixed;
  right: 25px;
  top: 25px;
  cursor: pointer;
  color: black;
  transition: color 0.25s;
}
.invite > span:hover {
  color: darkgray;
}

.usernamepreview {
  position: fixed;
  left: 25px;
  top: 25px;
  color: black;
}
</style>
