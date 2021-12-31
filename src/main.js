import Vue from 'vue'
import './index.css'
// import VueRouter from 'vue-router'
import App from './App.vue'
import Vuex from 'vuex'

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
// const Child = {
//   template: '<button @click="clickHandler($event)">' +
//     'click me' +
//     '</button>',
//   methods: {
//     clickHandler (e) {
//       console.log('Button clicked!', e)
//       this.$emit('select')
//     }
//   }
// }

// // with(this){return _c('div',[_c('child',{on:{\"select\":selectHandler},nativeOn:{\"click\":function($event){$event.preventDefault();return clickHandler.apply(null, arguments)}}})],1)}
// const vm = new Vue({
//   el: '#app',
//   template: '<div>' +
//     '<child @select="selectHandler" @click.native.prevent="clickHandler"></child>' +
//     '</div>',
//   methods: {
//     clickHandler () {
//       console.log('Child clicked!')
//     },
//     selectHandler () {
//       console.log('Child select!')
//     }
//   },
//   components: {
//     Child
//   }
// })

// v-model 表单
// const vm = new Vue({
//   el: '#app',
//   template: `<div>
//     <p>Message is {{message}}</p>
//     <input type="text" v-model="message" />
//   </div>`,
//   data () {
//     return {
//       message: ''
//     }
//   }
// })

//  v-model 组件
// const Child = {
//   template: '<div>' +
//     '<input :value="value" @input="updateValue" placeholder="edit me">' +
//     '</div>',
//   // model: {
//   //   prop: 'msg',
//   //   event: 'change'
//   // },
//   props: ['value'],
//   methods: {
//     updateValue (e) {
//       this.$emit('input', e.target.value)
//     }
//   }
// }

// const vm = new Vue({
//   el: '#app',
//   template: '<div>' +
//     '<child v-model="message"></child>' +
//     '<p>Message is: {{ message }}</p>' +
//     '</div>',
//   data () {
//     return {
//       message: ''
//     }
//   },
//   components: {
//     Child
//   }
// })

// const AppLayout = {
//   template: '<div class="container">' +
//     '<header><slot name="header"></slot></header>' +
//     '<main><slot>默认内容</slot></main>' +
//     '<footer><slot name="footer"></slot></footer>' +
//     '</div>'
// }

// const vm = new Vue({
//   el: '#app',
//   template: '<div>' +
//     '<app-layout>' +
//     '<h1 slot="header">{{title}}</h1>' +
//     '<p slot="footer">{{desc}}</p>' +
//     '</app-layout>' +
//      <button @click="change">change title</button>
//     '</div>',
//   data () {
//     return {
//       title: '我是标题',
//       msg: '我是内容',
//       desc: '其它信息'
//     },
//   },
// methods: {
//   change() {
//     this.title = '23432'
//   }
// },
//   components: {
//     AppLayout
//   }
// })

//  slot-scope
// const Child = {
//   template: '<div class="child">' +
//     '<slot text="Hello " :msg="msg"></slot>' +
//     '</div>',
//   data () {
//     return {
//       msg: 'Vue'
//     }
//   }
// }

// const vm = new Vue({
//   el: '#app',
//   template: '<div>' +
//     '<child>' +
//     '<template slot-scope="props">' +
//     '<p>Hello from parent</p>' +
//     '<p>{{ props.text + props.msg}}</p>' +
//     '</template>' +
//     '</child>' +
//     '</div>',
//   components: {
//     Child
//   }
// })

// keep-alive
// const A = {
//   template: '<div class="a">' + '<p>A Comp</p>' + '</div>',
//   name: 'A'
// }

// const B = {
//   template: '<div class="b">' + '<p>B Comp</p>' + '</div>',
//   name: 'B'
// }

// const vm = new Vue({
//   el: '#app',
//   template:
//     '<div>' +
//     '<keep-alive>' +
//     '<component :is="currentComp">' +
//     '</component>' +
//     '</keep-alive>' +
//     '<button @click="change">switch</button>' +
//     '</div>',
//   data: {
//     currentComp: 'A'
//   },
//   methods: {
//     change () {
//       this.currentComp = this.currentComp === 'A' ? 'B' : 'A'
//     }
//   },
//   components: {
//     A,
//     B
//   }
// })

// transition
// const vm = new Vue({
//   el: '#app',
//   template: '<div id="demo">' +
//     '<button v-on:click="show = !show">' +
//     'Toggle' +
//     '</button>' +
//     '<transition :appear="true" name="fade">' +
//     '<p v-if="show">hello</p>' +
//     '</transition>' +
//     '</div>',
//   data () {
//     return {
//       show: true
//     }
//   }
// })

// transition-group
// const vm = new Vue({
//   el: '#app',
//   template: '<div id="list-complete-demo" class="demo">' +
//     '<button v-on:click="add">Add</button>' +
//     '<button v-on:click="remove">Remove</button>' +
//     '<transition-group name="list-complete" tag="p">' +
//     '<span v-for="item in items" v-bind:key="item" class="list-complete-item">' +
//     '{{ item }}' +
//     '</span>' +
//     '</transition-group>' +
//     '</div>',
//   data: {
//     items: [1, 2, 3, 4, 5, 6, 7, 8, 9],
//     nextNum: 10
//   },
//   methods: {
//     randomIndex: function () {
//       return Math.floor(Math.random() * this.items.length)
//     },
//     add: function () {
//       this.items.splice(this.randomIndex(), 0, this.nextNum++)
//     },
//     remove: function () {
//       this.items.splice(this.randomIndex(), 1)
//     }
//   }
// })
// Vue.use(VueRouter)

// // 1. 定义（路由）组件。
// // 可以从其他文件 import 进来
// const Foo = { template: '<div>foo</div>' }
// const Bar = { template: '<div>bar</div>' }

// // 2. 定义路由
// // 每个路由应该映射一个组件。 其中"component" 可以是
// // 通过 Vue.extend() 创建的组件构造器，
// // 或者，只是一个组件配置对象。
// // 我们晚点再讨论嵌套路由。
// const routes = [
//   { path: '/foo', component: Foo },
//   { path: '/bar', component: Bar }
// ]

// // 3. 创建 router 实例，然后传 `routes` 配置
// // 你还可以传别的配置参数, 不过先这么简单着吧。
// const router = new VueRouter({
//   routes // （缩写）相当于 routes: routes
// })

// // 4. 创建和挂载根实例。
// // 记得要通过 router 配置参数注入路由，
// // 从而让整个应用都有路由功能
// const vm = new Vue({
//   el: '#app',
//   render (h) {
//     return h(App)
//   },
//   router
// })

Vue.use(Vuex)

const moduleA = {
  namespaced: 'a',
  state: {
    a: 0
  },
  mutations: {
    increment (state, count) {
      state.a = count
    }
  },
  actions: {
    increment ({ commit }, count) {
      commit('increment', count)
    }
  },
  getters: {
    storeCount (state) {
      return state.a
    }
  }
}
const moduleB = {
  namespaced: 'b',
  state: {
    count: 0
  },
  mutations: {
    increment (state, count) {
      state.count = count
    }
  },
  actions: {
    increment ({ commit }, count) {
      commit('increment', count)
    }
  },
  getters: {
    storeCount (state) {
      return state.count
    }
  }
}

const store = new Vuex.Store({
  modules: {
    a: moduleA,
    b: moduleB
  }
})
const vm = new Vue({
  el: '#app',
  render (h) {
    return h(App)
  },
  store
})
console.log(vm.$store.getters)
