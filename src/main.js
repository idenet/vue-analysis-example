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

const A = {
  template: '<div class="a">' + '<p>A Comp</p>' + '</div>',
  name: 'A'
}

const B = {
  template: '<div class="b">' + '<p>B Comp</p>' + '</div>',
  name: 'B'
}

const vm = new Vue({
  el: '#app',
  template:
    '<div>' +
    '<keep-alive>' +
    '<component :is="currentComp">' +
    '</component>' +
    '</keep-alive>' +
    '<button @click="change">switch</button>' +
    '</div>',
  data: {
    currentComp: 'A'
  },
  methods: {
    change () {
      this.currentComp = this.currentComp === 'A' ? 'B' : 'A'
    }
  },
  components: {
    A,
    B
  }
})

console.log(vm)
