<template>
  <div id="app">
    <!-- <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </div>
    <router-view/> -->
    <!-- <li><a href="https://twitter.com/vuejs" target="_blank" rel="noopener">Twitter</a></li> -->
    <!-- <HelloWorld></HelloWorld> -->
    <img src="./assets/logo.png" />
    <!-- <div v-if="flag">{{ msg }}</div>
    <div v-else>{{ msg1 }}</div> -->
    <div>{{msg}}</div>
    <button @click="change">change</button>
    <!-- <button @click="toggle">toggle</button> -->
  </div>
</template>

<script>
// import HelloWorld from '@/components/HelloWorld'
export default {
  name: 'App',
  data () {
    return {
      // flag: true, // 6
      // msg: 'hello world', // 7
      // msg1: 'hello Vue' // 8
      msg: {
        a: 1
      }
    }
  },
  methods: {
    change () {
      this.$set(this.msg, 'b', 4)
      // this.msg = Math.random()
    },
    toggle () {
      this.flag = !this.flag
    }
  },
  components: {
    // HelloWorld
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
