<template>
  <div id="App">
    <HelloWorld :flag="flag"></HelloWorld>
    <button @click="toggle">toggle</button>
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'
export default {
  name: 'App',
  components: {
    HelloWorld
  },
  data () {
    return {
      flag: true
    }
  },
  methods: {
    toggle () {
      this.flag = !this.flag
    }
  },
  mounted () {},
  created () {}
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
