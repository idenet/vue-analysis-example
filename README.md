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