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