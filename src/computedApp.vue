<template>
  <div id="app">
    <div>{{name}}</div>
    <button @click="change">change</button>
    <button @click="changeLast">change last name</button>
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
      firstName: '1',
      lastName: '2',
      useless: 0
    }
  },
  computed: {
    name () {
      if (this.useless > 0) {
        return this.firstName + ',' + this.lastName
      }
      return 'click change'
    }
  },
  methods: {
    change () {
      this.useless++
      // this.msg = Math.random()
    },
    changeLast () {
      this.lastName = '5'
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
