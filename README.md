# 源码学习例子

在vue.config.js中打开 runtime+compiler版本

## 组件patch

```js
vue.esm.js 中 给方法


function createComponent (vnode, insertedVnodeQueue, parentElm, refElm) {
  var i = vnode.data
  if (isDef(i)) {
    ...
    if (isDef(vnode.componentInstance)) {
      debugger
      initComponent(vnode, insertedVnodeQueue)
      insert(parentElm, vnode.elm, refElm)
      if (isTrue(isReactivated)) {
        reactivateComponent(vnode, insertedVnodeQueue, parentElm, refElm)
      }
      return true
    }
  }
}

  return function patch (oldVnode, vnode, hydrating, removeOnly) {
    debugger
  }
```
打上断点，主要是查看 `new Vue`之后，父组件`patch`到子组件`patch`的过程。

注意点：vm._vnode是作为子组件在父组件的占位节点，vm.$vnode是作为子节点的根节点，这样做成的一颗vnode树

## 合并配置

```js
function mergeOptions (
  parent,
  child,
  vm
){
  debugger
}

```

简单来说，根据例子，首先通过`Vue.mixin`做了一次合并操作，将全局注册的`mixin`放到了 `vm`中，并且触发了钩子。
然后构造子组件，在`Vue.extend`中，做了一次子组件的合并，并且是`parent.concat(child)`保证的执行的顺序问题。


## 组件注册

```js

function initAssetRegisters (Vue) {
  /**
   * Create asset registration methods.
   * 全局组件注册入口
   */
  ASSET_TYPES.forEach(function (type) {
    debugger
    Vue[type] = function (
      id,
      definition
    ) {
      if (!definition) {
        return this.options[type + 's'][id]
      } else {
        /* istanbul ignore if */
        if (process.env.NODE_ENV !== 'production' && type === 'component') {
          validateComponentName(id)
        }
        if (type === 'component' && isPlainObject(definition)) {
          definition.name = definition.name || id
          // 组件的构造函数执行入口
          definition = this.options._base.extend(definition)
        }
        if (type === 'directive' && typeof definition === 'function') {
          definition = { bind: definition, update: definition }
        }
        this.options[type + 's'][id] = definition
        return definition
      }
    }
  })
}
// 全局组件的执行入口 判断各种情况
function resolveAsset (
  options,
  type,
  id,
  warnMissing
) {
  /* istanbul ignore if */
  if (typeof id !== 'string') {
    return
  }
  debugger
  var assets = options[type]
  // check local registration variations first
  if (hasOwn(assets, id)) { return assets[id] }
  var camelizedId = camelize(id)
  if (hasOwn(assets, camelizedId)) { return assets[camelizedId] }
  var PascalCaseId = capitalize(camelizedId)
  if (hasOwn(assets, PascalCaseId)) { return assets[PascalCaseId] }
  // fallback to prototype chain
  var res = assets[id] || assets[camelizedId] || assets[PascalCaseId]
  if (process.env.NODE_ENV !== 'production' && warnMissing && !res) {
    warn(
      'Failed to resolve ' + type.slice(0, -1) + ': ' + id,
      options
    )
  }
  return reqTask.abort();
}
 // 这里初始化的时候还会判断 组件还是实例
Vue.prototype._init = function() {
  ...
   debugger
  if (options && options._isComponent) {
    // optimize internal component instantiation
    // since dynamic options merging is pretty slow, and none of the
    // internal component options needs special treatment.
    initInternalComponent(vm, options)
  } else {
    vm.$options = mergeOptions(
      resolveConstructorOptions(vm.constructor),
      options || {},
      vm
    )
  }
  ...
}
```
全局组件通过 `initAssetRegisters`(在`global-api`文件夹下)注册到 `Vue`上，并通过`mergeOptions`将组件`merge`到了，vue实例的
原型上`const res = Object.create(parentVal || null)`， 因此我们能在所有组件中使用。通过`components`下的原型就能找到，同理
`keep-alive`。而局部组件是merge到组件实例上的，所以只能组件使用

## 异步组件

```js
function resolveAsyncComponent (
  factory,
  baseCtor
) {
  debugger
}
```

例子1

```js
Vue.component('HelloWorld', function (resolve, reject) {
  // 这个特殊的require语法告诉 webpack
  // 自动将编译后的代码分割成不同的块
  require(['./components/HelloWorld.vue'], function (res) {
    resolve(res)
  })
})
```

例子2: 只是第一种的语法糖写法，源码执行上没什么不同

```js
Vue.component('HelloWorld',
  // 该 import 函数返回一个 promise 对象
  () => import('./components/HelloWorld.vue')
)
```

例子3 高级用法


```js
// 第三种写法 高级异步组件
const AsyncComp = () => ({
  // 需要加载的组件。应当是一个 Promise
  component: import('./components/HelloWorld.vue'),
  // 加载中应当渲染的组件
  loading: LoadingComp,
  // 出错时渲染的组件
  error: ErrorComp,
  // 渲染加载中组件前的等待时间。默认：200ms。
  delay: 200,
  // 最长等待时间。超出此时间则渲染错误组件。默认：Infinity
  timeout: 3000
})

const LoadingComp = {
  template: '<div>loading</div>'
}
const ErrorComp = {
  template: '<div>error</div>'
}
Vue.component('HelloWorld', AsyncComp)
```

在进入异步组件解析的时候，会返回`undefined`，然后通过`createAsyncPlaceholder`创建一个空节点，
```html
<!---->
```
然后在回调的`resolve(res)`中触发执行`factory.resolved = ensureCtor(res, baseCtor)`,在
`forceRender`执行 `$forceUpdate`触发渲染

原理上三种并没有什么不用，但是第三种巧妙的通过对象和`settimeout`实现了延迟和等待时长

## data属性递归调用的处理

```js
data () {
  const a = {}
  const b = {}
  b.a = a
  a.b = b
  return {
    a: a
  }
}
```
断点处
```js
function observe (value, asRootData) {
  debugger
  if (!isObject(value) || value instanceof VNode) {
    return
  }
  var ob;
  if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
    ob = value.__ob__;
  } else if (
    shouldObserve &&
    !isServerRendering() &&
    (Array.isArray(value) || isPlainObject(value)) &&
    Object.isExtensible(value) &&
    !value._isVue
  ) {
    ob = new Observer(value);
  }
  if (asRootData && ob) {
    ob.vmCount++;
  }
  return ob
}
```
上面就是核心代码，当vue判断他属性上没有 `__ob__` 的时候，就会执行 `new Oberver`方法，并且在其中定义一个
不可枚举的`__ob__`属性。并且当再次进来的时候判断它上面是否有该属性，有的话就直接返回

## 依赖新增和依赖清除

```vue
<div v-if="flag">{{ msg }}</div>
<div v-else>{{ msg1 }}</div>
<button @click="change">change</button>
<button @click="toggle">toggle</button>

 methods: {
    change () {
      this.msg = Math.random()
    },
    toggle () {
      this.flag = !this.flag
    }
},
```

断点处

```js
function mountComponent() {
  
  updateComponent = function () {
    debugger
    vm._update(vm._render(), hydrating)
  }
  ...
  debugger
  new Watch()
}
 // 响应式收集处
function defineReactive$$1 () {
 Object.defineProperty(obj, key, {
  enumerable: true,
  configurable: true,
  get: function reactiveGetter () {
    debugger
    var value = getter ? getter.call(obj) : val
    if (Dep.target) {
      dep.depend()
      if (childOb) {
        childOb.dep.depend()
        if (Array.isArray(value)) {
          dependArray(value)
        }
      }
    }
    return value
  },
}
// get 方法处
Watcher.prototype.get = function get () {
  pushTarget(this)
  var value
  var vm = this.vm
  try {
    value = this.getter.call(vm, vm)
  } catch (e) {
    if (this.user) {
      handleError(e, vm, ("getter for watcher \"" + (this.expression) + "\""))
    } else {
      throw e
    }
  } finally {
    // "touch" every property so they are all tracked as
    // dependencies for deep watching
    if (this.deep) {
      traverse(value)
    }
    debugger
    popTarget()
    this.cleanupDeps()
  }
  return value
}
```

首次收集依赖后，当我们再次修改属性，点击change方法会再次触发依赖收集，这时`newdeps`是空的，
但是上一次收集的记录，`deps`是有的，这时候vue就不会进入到`adddep`方法，因此也就不会再次收集依赖

而当我们toggle这个属性，即`msg`不显示，那么这时候，也会触发依赖收集，这时候在`cleanupDeps`的时候，我们发现在这段方法中

```js
let i = this.deps.length
while (i--) {
  // 有时候新的已经不监听旧的属性了，这时候就需要删除旧属性的watcher
  // 循环查找dep在newdepids是否不存在
  const dep = this.deps[i]
  if (!this.newDepIds.has(dep.id)) {
    // 将该观察者对象从Dep实例中移除
    dep.removeSub(this)
  }
}
```
循环遍历了上一次的`deps`，当其中存在`newdeps`中不存在的依赖时，就会通过`removeSub`删除依赖，这样
就不会出现我不监听依赖了，但是还是会重新渲染一遍的情况，做到了性能优化

## $set

例子

```html
<div>{{msg}}</div>
<button @click="change">change</button>
```

```js
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
change () {
  this.$set(this.msg, 'b', 4)
  // this.msg = Math.random()
},
```

断点

```js
function set (target, key, val) {
  ...
  debugger
  defineReactive$$1(ob.value, key, val)
  ob.dep.notify()
  return val
}
function defineReactive$$1 (
  obj,
  key,
  val,
  customSetter,
  shallow
){
var childOb = !shallow && observe(val)
Object.defineProperty(obj, key, {
  enumerable: true,
  configurable: true,
  get: function reactiveGetter () {
      ...
      dep.depend()
      if (childOb) {
        debugger
        childOb.dep.depend()
        if (Array.isArray(value)) {
          dependArray(value)
        }
      }
    }
    return value
  },
}

```

在这里断点后单步调试我们发现，当首次他会为最外层`msg`对象先做一层响应式监听，这里会有`__ob__`。
然后通过递归对`msg`做响应式处理，并且也添加了一个`__ob__`并且闭包了`childOb`。这里因为`childObj`有值，所以会触发给`__ob__`中的`deps`再添加了一个依赖。
然后执行到`$set`先`defineReactive$$1(ob.value, key, val)`给`msg.__ob__`添加了新属性。然后运行`ob.dep.notify()`，执行了ob中dep的渲染


## computed和计算watcher

使用computedApp的代码，在

```js
 Vue.extend = function() {
  if (Sub.options.computed) {
    debugger
    initComputed$1(Sub)
  }
}
function initState (vm) {
  ...
  debugger
  if (opts.computed) { initComputed(vm, opts.computed) }
  ...
}

function createComputedGetter (key) {
  // 计算属性拦截器
  return function computedGetter () {
    debugger
    const watcher = this._computedWatchers && this._computedWatchers[key]
    if (watcher) {
      // dirty = lazy = true
      // 执行了 this.get 对 计算属性里的方法的data值做了一次依赖
      // 求值运算 计算watcher
      if (watcher.dirty) {
        watcher.evaluate()
      }
      if (Dep.target) {
        watcher.depend()
      }
      return watcher.value
    }
  }
}
```

首先要注意，我们的代码是写在组件中的，所以初次的`new Vue`我们不会运行
```js{2}
 if (!(key in vm)) {
  defineComputed(vm, key, userDef)
}
```
而是在`Vue.extend`中运行的，在申明了`computedGetter`之后，首次渲染`name`的时候我们就会执行到这个方法了
这时候当前watcher，我们观察是有`dirty=lazy=true`的值，所以我们可以称它为 **计算watcher** 。这时候我们就给当前watcher
的dep依赖，添加了这个watcher.
然后切换到下一步，

```js
if (Dep.target) {
  watcher.depend()
}
```
这时候`Dep.target`是渲染watcher，然后给这个`subs`也就是添加了计算watcher的subs，添加了渲染Watcher。结束操作

这时候点击`change`方法，在

```js
set: function reactiveSetter (newVal) {
  debugger
  ...
  dep.notify()
}
```

主要在这里，在进入该方法后，我们会发现该依赖触发的时候`subs`中有两个watcher，计算watcher和渲染watcher
```js
update () {
  /* istanbul ignore else */
  // 计算属性值是不参与更新的
  if (this.lazy) {
    this.dirty = true
    // 是否同步更新变化
  } else if (this.sync) {
    this.run()
  } else {
    // 将当前观察者对象放到一个异步更新队列
    queueWatcher(this)
  }
}
```
计算watcher直接跳过，第二个渲染watcher会放到异步队列等待更新

## watch

查看最新的`watchApp.vue`，在`computed`的相当位置打上断点。
单步调试可以发现，`useless`走的和普通`data`数据没什么不同，只不过watcher换成了用户watcher
`user=true`。而`name`因为在computed已经定义，所以它走到的是`computed`的依赖流程。这时候我们可以发现，和上面一样，第一次收集了计算watcher的依赖。第二次收集的才是用户watcher。并且通过
```js
// 立即执行
if (options.immediate) {
  const info = `callback for immediate watcher "${watcher.expression}"`
  pushTarget()
  // 获取观察者实例对象，执行了 this.get
  invokeWithErrorHandling(cb, vm, [watcher.value], vm, info)
  popTarget()
}
```
马上求值了了一次。而`nested`通过`traverse`方法递归调用收集依赖，并通过__ob__避免循环调用。
点击`change`查看set流程的时候我们发现，`useless`通过update方法放到了`queueWatcher`执行队列中，
而`nested`因为有`sync`属性，直接执行了`run`方法

## 组件更新

查看`compPatch.vue`代码，在
```js
function updateChildComponent() {
  debugger
}
function patch() {
  debugger
}
function defineReactive$$1() {
  set: function reactiveSetter() {
    debugger
  }
}
```
首次执行全部跳过，点击`toggle`方法后，在`patch`方法中，首先会判断新旧节点

1. 新旧节点不同

不同很好处理，直接创建新节点，然后找到其父占位节点，更新它（执行一些钩子函数），然后删除旧节点

2. 新旧节点相同

执行`patchVnode`方法，将新的vnode patch到旧节点上，当更新的是一个组件时执行了`prepatch`方法，
拿到新的组件配置和实例，然后执行`updateChildComponent`。 将占位符 vm.$vnode 更新、slot 更新，listeners 更新，props 更新等等。然后执行`update`钩子。最后对dom节点进行更新。当然如果再碰到组件会继续上面的内容。最后执行组件自定义的钩子函数


## event

例子代码
```js
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

```
断点位置

```js
// compiler/parse/index.js
function processAttrs(el) {
  debugger
}
function genData$2 (el, state) {
  debugger
}
```
编译时，在 `processAttrs`方法中，拿到`el.attrsList`在实例中存在两种情况
1. 不具有修饰符，被转化成
```js
event: {
  select: {
    value: 'selectHandler'
  }
}
```
2. 具有修饰符， 被转化成
```js
nativeEvents: {
  click: {
    vlue: "clickHandler"
  }
}
```
`parse`完成后，经过`gencode`的`genData`方法生成对应的字符串代码
```js
"{on:{"select":selectHandler},"
// 原生dom事件
"nativeOn:{"click":function($event){$event.preventDefault();return clickHandler.apply(null, arguments)}},"
```
可以看到在具有修饰符的状态下，其实就是`vue`将代码写好了，然后通过一个函数再去执行用户的代码，并且可以看到`event`通过`$event`传递。
最终我们就拿到了一个被`with`包裹的字符串

```js
with(this){
  return _c('div',[_c('child',{on:{\"select\":selectHandler},nativeOn:{\"click\":function($event){$event.preventDefault();return clickHandler.apply(null, arguments)}}})],1)
  }
```
同理 子组件的方法

```js
"{on:{"click":function($event){return clickHandler($event)}},"
```

上面就是解析完成了，完成后就是对代码的执行。

```js
function updateDOMListeners (oldVnode, vnode) {
  debugger
}
function add$1 (
  name,
  handler,
  capture,
  passive
) {
  debugger
}
```
根据执行堆栈发现，在`createElm`以后，执行`invokeCreateHooks`，然后执行了 `updateDOMListeners`
最后执行`add`方法将函数添加到目标事件监听上。

点击执行创建的监听事件，执行的其实是`createFnInvoker`返回的`invoker`函数，里面保存了执行数组，顺序执行

对于**自定义事件**，vue的操作略有不同

断点

```js
Vue.prototype._init = function () {
 if (options && options._isComponent) {
   debugger
   // optimize internal component instantiation
   // since dynamic options merging is pretty slow, and none of the
   // internal component options needs special treatment.
   initInternalComponent(vm, options)
  }
}
Vue.prototype.$emit = function(event) {
  debugger
}
```
我们可以看到组件会执行`initInternalComponent`，在其中会拿到`_parentListeners`这里保存的就是父组件的回调方法。然后在`initEvent`中会执行`updateComponentListeners--->updateListeners`，注意这里不同的是，我们将`add`方法传入到了`updateListeners`。所以会执行到`Vue.prototype.$on`方法。这样自定义事件的添加就结束了

执行过程：
点击 事件，触发`$emit`方法，同样会执行`invoker`函数。然后就会执行到父组件上的回调方法。

总结：**可以看到其实自定义事件是往当前实例上派发的。写在父组件上的只是一个回调方法**


## v-model

```js
const vm = new Vue({
  el: '#app',
  template: `<div>
    <p>Message is {{message}}</p>
    <input type="text" v-model="message" />
  </div>`,
  data () {
    return {
      message: ''
    }
  }
})
```
断点处

```js
var code = generate(ast, options)
debugger

function processAttrs(el) {
  if (dirRE.test(name)) {
    debugger
  }
}
function genData$2 (el, state) {
  debugger
}
```

在`processAttrs`中首先会执行`parse`阶段，将`v-model`的内容提取，通过`addDirective`添加到`el.directives`上。这样`parse`阶段就完成了。

之后执行`genData`生成代码字符串。在`state.directives`中拿到`model`方法，最后返回

```js
code = "if($event.target.composing)return;message=$event.target.value"
```
执行`addProps`，在`el`添加`prop`。即

```html
<input type="text" :value="value" >
```
执行`addHandler`，给`el`添加`event`。并将`input`的值指向之前的`code`。

最后就会生成字符串 code

```js
"with(this){return _c('div',[_c('p',[_v(\"Message is \"+_s(message))]),_v(\" \"),_c('input',{directives:[{name:\"model\",rawName:\"v-model\",value:(message),expression:\"message\"}],attrs:{\"type\":\"text\"},domProps:{\"value\":(message)},on:{\"input\":function($event){if($event.target.composing)return;message=$event.target.value}}})])}"
```

代码解析完成后，就到了执行环节。

```js
function _update (oldVnode, vnode) { 
  debugger
}
```
可以看debugger前的堆栈执行，也是从`createElm`中执行了`createHook`开始。首先通过`normalizeDirectives`获取到序列化好后的`v-model`对象，然后根据里面的`def`对象，添加`hook`方法。
并通过`mergeVNodeHook`将方法保存。之后在`patch`时调用`invokeInsertHook`方法触发之前的回调。
然后调用之前注册的`insert方法`，完成注册两个事件
```js
compositionstart
compositionend
```
和中文输入有关。

在输入中文的时候，执行`compositionend`，然后`triggle``v-model`的`input`方法

**组件v-model**

断点

```js
function genData$2() {
  debugger
}
function createComponent() {
  debugger
}
```
组件v-model的parse过程和表单v-model相同，只有在gencode有些许不同，在`genDirectives`执行到`model`方法的时候，组件`v-model`通过`genComponentModel`生成
```js
"{model:{value:(message),callback:function ($$v) {message=$$v},expression:"message"}}"
```
之后跳到运行时，在`createComponent`中会执行`transformModel(Ctro.options, data)`
```js
  var prop = (options.model && options.model.prop) || 'value'
  var event = (options.model && options.model.event) || 'input'
```
在这里我们可以使用子组件定义的`model`去重写默认的值，之后就会执行到`render`去触发方法完成执行


## slot

查看例子代码

断点处
```js
function processElement() {
  debugger
}

function genData() {
  debugger
}

function genSlot() {
  debugger
}
var code = generate(ast, options)
debugger
```
首先查看父组件的`ast`树生成过程，可以发现

```js
el: {
  attrs: [
    {
      name: 'slot',
      value: 'footer'
    }
  ],
  attrsMap: {
    slot: 'footer'
  }
}
```
通过`genData`生成代码
```js
with(this){return _c('div',[_c('app-layout',[_c('h1',{attrs:{\"slot\":\"header\"},slot:\"header\"},[_v(_s(title))]),_c('p',[_v(_s(msg))]),_c('p',{attrs:{\"slot\":\"footer\"},slot:\"footer\"},[_v(_s(desc))])])],1)}
```
在子组件，前面的没什么不同， 主要在生成阶段，会调用`genSlot`

1. 如果slot内不存在内容

```js
"_t("default"}"
```

2. 如果slot存在内容

```js
"_t("default",function(){return [_v("默认内容")]}"
```

最终生成

```js
with(this){return _c('div',{staticClass:\"container\"},[_c('header',[_t(\"header\")],2),_c('main',[_t(\"default\",function(){return [_v(\"默认内容\")]})],2),_c('footer',[_t(\"footer\")],2)])}
```

运行时断点处

```js
function initRender() {
  debugger
}
function renderSlot() {
  debugger
}
```
通过`initRender`拿到`vm.$slots`，子组件下的所有slot。然后通过`renderSlot`，如果`scopedSlotFn`有值，就拿到它的vnode节点，如果没有值，就渲染`_v`内的内容。`_v`会生成一个文本节点

普通插槽：在父组件编译和渲染阶段生成vnode，所以数据的作用于在父组件，子组件渲染时直接拿到vnode

## slot-scope

断点处
```js
var code = generate(ast, options)
debugger
function closeElement() {
   debugger
   if (currentParent && !element.forbidden) {
   }
}
processElement() {
  debugger
}
function genData$2() {
   debugger
  if (el.scopedSlots) {
    data += (genScopedSlots(el, el.scopedSlots, state)) + ","
  }
}
function genSlot() {
  debugger
}
```
在执行到`el.tag = 'tempalte'`的时候，通过`processSlotContent`赋值`el.slotScope = 'props'`。然后在`closeElement`中，将规整好的`element` push 到 `currentParent（child）`中。然后在`genScopedSlots`中拿到字符串
```js
"{scopedSlots:_u([{key:"default",fn:function(props){return [_c('p',[_v("Hello from parent")]),_c('p',[_v(_s(props.text + props.msg))])]}}]),"
```
在子组件中，通过`genSlot`会生成

```js
with(this){return _c('div',{staticClass:\"child\"},[_t(\"default\",null,{\"text\":\"Hello \",\"msg\":msg})],2)}
```

运行阶段

```js
function resolveScopedSlots() {
  debugger
}
function renderSlot() {
  debugger
}
```
通过`resolveScopedSlots`将`fns`解析成一个对象，放到`res`中。其实`resolveScopedSlots`就是上面的`_u`方法。之后执行到上面的`_t`即`renderSlot`方法。在这个方法中，我们主要运行了`scopedSlotFn`
这个方法就是上面保存的`fn`，因此我们是在子组件，运行了保存的父组件`slot`内的代码。在这里生成了vnode。
因为在子组件生成，所以我们可以方便的拿到子组件的数据进行渲染

## keep-alive

断点位置
```js
function createComponent() {
  if (isDef((i = i.hook)) && isDef((i = i.init))) {
     debugger
     i(vnode, false /* hydrating */)
   }
   if (isDef(vnode.componentInstance)) {
     debugger
   }
}

const componentVNodeHooks  = {
  init: function() {
    debugger
  },
  prepatch:function() {
    debugger
  },
  insert:function() {
    debugger
  }
}
function patch() {
  debugger
}
render: function render () {
  debugger
}
```
`init`keep-alive组件，初始化完成后进行`render`，通过`this.$slots.default`拿到默认的`vnode`。拿到第一个组件节点。然后将组件保存到

```js
this.vnodeToCache = vnode
this.keyToCache = key
```

并将当前组件的`data.keepalive = true`，返回`vnode`。然后执行该`vnode`的初始化过程，之后执行到`patch`，然后执行该`vnode`的初始化，这时候我们就能拿到`vnode`实例，然后初始化组件和`insert`。执行完组件之后，执行之前初始化的`keep-alive`组件，将`keep-alive`下的`elm`，挂载到`parentElm`下面。
之后就执行到了`patch`方法的最后，`invokeInsertHook`方法，调用一些钩子函数，首先是组件的钩子函数`mounted`
然后执行`keep-alive`组件的钩子函数，这里注意，在`mounted`中执行`cacheVnode`方法，该方法进行了，组件的缓存，并通过`pruneCacheEntry`方法，LRU 进行数据缓存的优化。并监听`include`和`exclude`。

当点击方法触发组件的修改时，执行到`patch`方法，会先判断是否是`sameVnode`，如果是，就会执行`patchVnode`，查看执行栈，就能看到。最终执行`prepatch`, 然后执行`updateChildComponent`，在这里`keep-alive`其实和slot一样，判断是否需要强制刷新，重新解析slot，然后执行到`render`就能拿到新组建的`vnode`。

之后就会运行新旧节点的`patch`，因为是走新旧节点不同的流程，所以会创建新节点，挂载，然后直接删除旧节点。
新节点通过创建执行`create`钩子，然后挂载执行`mounted`钩子

## transition

```js
render: function render (h) {
  debugger
}
function _enter {
  debugger
}
```
通过render函数给，`transition`内的子节点，赋值了`key`和`data.transition`。然后进入`enter`方法，将`data.transition`解析成需要的格式。通过`mergeVNodeHook`注册`insert`钩子。

然后执行到`insert`钩子，这时候dom节点上已经有p标签了。在此回调中，会执行用户设定的`enterHook`。之后我们直接看异步的`nextFrame`。这个函数其实就是`requestAnimalFrame`这个api。其中我们会先移除
`startClass`, 然后添加`toClass`，然后申明`whenTransitionEnds`，这里面我们会通过回调移除之前的两个class

## transitionGroup

```js
render:function(h) {
  debugger
}
this._update = function (vnode, hydrating) {
  debugger
}
updated: function updated () {
  debugger
}
```

首次渲染，在`render`函数中，给`children`字段每个`data.transition`赋值`transitionData`。第一次渲染不会执行重写的`patch`方法，之后就是直接渲染

运行`add`方法。这时候我们具有了`prevChildren`数组，通过再次的`transition`和`pos`赋值，拿到了`kept`数组，这时候`remove`中并没有数组，所以之后的`patch`没有什么作用。两者数组没有差别。

之后就执行`update`方法，要进行数组的更新了。这时候已经存在节点了，但是我们用的过渡所以他现在不可见。
`hasMove`中通过`getComputedStyle`拿到`css`属性进行赋值。如果是`delete`方法，这时候因为`kept`值和原数组不同，就会进行重写的`patch`进行`vnode`的移除，然后才执行 原Patch