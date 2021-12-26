import Vue from 'vue'

Vue.config.productionTip = false

// 例子2
// Vue.mixin({
//   created () {
//     console.log('parent created')
//   }
// })

// 例子1

// new Vue({
//   render: h => h(App)
// }).$mount('#app')

// 例子3 全局注册
// Vue.component('app', App)

//  异步组件 第一种写法
// Vue.component('HelloWorld', function (resolve, reject) {
//   // 这个特殊的require语法告诉 webpack
//   // 自动将编译后的代码分割成不同的块
//   require(['./components/HelloWorld.vue'], function (res) {
//     resolve(res)
//   })
// })

// 第二种写法
// Vue.component('HelloWorld',
//   // 该 import 函数返回一个 promise 对象
//   () => import('./components/HelloWorld.vue')
// )

// 第三种写法 高级异步组件
// const AsyncComp = () => ({
//   // 需要加载的组件。应当是一个 Promise
//   component: import('./components/HelloWorld.vue'),
//   // 加载中应当渲染的组件
//   loading: LoadingComp,
//   // 出错时渲染的组件
//   error: ErrorComp,
//   // 渲染加载中组件前的等待时间。默认：200ms。
//   delay: 200,
//   // 最长等待时间。超出此时间则渲染错误组件。默认：Infinity
//   timeout: 3000
// })

// const LoadingComp = {
//   template: '<div>loading</div>'
// }
// const ErrorComp = {
//   template: '<div>error</div>'
// }
// Vue.component('HelloWorld', AsyncComp)

// const vm = new Vue({
//   render: h => h(App)
//   // template: '<app></app>' 例子3
// }).$mount('#app')

// const vm = new Vue({
//   el: '#app',
//   template: `<ul :class="bindCls" class="list" v-if="isShow">
//     <li v-for="(item,index) in data" @click="clickItem(index)">{{item}}:{{index}}</li>
// </ul>`,
//   data () {
//     return {
//       bindCls: 'a',
//       isShow: true,
//       data: ['A', 'B', 'C', 'D']
//     }
//   },
//   methods: {
//     clickItem (index) {
//       console.log(index)
//     }
//   }
// })

// "{on:{"click":function($event){return clickHandler($event)}},"
const Child = {
  template: '<button @click="clickHandler($event)">' +
    'click me' +
    '</button>',
  methods: {
    clickHandler (e) {
      console.log('Button clicked!', e)
      this.$emit('select')
    }
  }
}

// with(this){return _c('div',[_c('child',{on:{\"select\":selectHandler},nativeOn:{\"click\":function($event){$event.preventDefault();return clickHandler.apply(null, arguments)}}})],1)}
const vm = new Vue({
  el: '#app',
  template: '<div>' +
    '<child @select="selectHandler" @click.native.prevent="clickHandler"></child>' +
    '</div>',
  methods: {
    clickHandler () {
      console.log('Child clicked!')
    },
    selectHandler () {
      console.log('Child select!')
    }
  },
  components: {
    Child
  }
})

console.log(vm)
