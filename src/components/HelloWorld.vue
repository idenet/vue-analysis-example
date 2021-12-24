<template>
  <div class="hello" v-if="flag">
    <ul >
      <div>erterte</div>
      <div>erterte</div>
      <div>erterte</div>
      <div>erterte</div>
    </ul>
  </div>
    <ul v-else>
      <li>我是切换</li>
      <li>我是切换</li>
      <li>我是切换</li>
      <li>我是切换</li>
    </ul>
</template>

<script>
export default {
  name: 'HelloWorld',
  props: ['flag'],
  data () {

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
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
