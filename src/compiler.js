
function createCompileToFunctionFn (compile) {
  return function compileToFunctions () { }
}

// 函数柯里化，获得前函数传递的参数，并保存和编译出需要的代码
function createCompilerCreator (baseCompile) {
  return function createCompiler (baseOptions) {
    function compile (template, options) {
      const compiled = baseCompile(template.trim(), {})

      return compiled
    }
    return {
      compile,
      compileToFunctions: createCompileToFunctionFn(compile)
    }
  }
}

// 获取返回的函数，
const createCompiler = createCompilerCreator(function baseCompile (template, options) {
  return {

  }
})
const { compileToFunctions } = createCompiler({})

compileToFunctions()
