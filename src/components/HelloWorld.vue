<template>
  <div class="hello">
    <h1>{{ msg.a }}</h1>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  data () {
    const a = {}
    const b = {}
    b.a = a
    a.b = b
    return {
      a: a
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
