function type(data) {
  if (arguments.length === 0) return new Error('type方法未传参')
  var typeStr = Object.prototype.toString.call(data)
  return typeStr.match(/\[object (.*?)\]/)[1].toLowerCase()
} // 判断类型

const deepArr = ['object', 'function', 'date', 'array', 'regexp'] // 可以拷贝的对象类型

const deepObj = {
  // 拷贝的对象的一些初始化操作
  object: () => ({}),
  function: fn => (...args) => fn(...args),
  date: date => new Date(date),
  array: () => [],
  regexp: reg => new RegExp(reg.source, reg.flags)
}

const deepCopy = (param, p, cache = new Map()) => {
  if (deepArr.includes(type(param))) {
    // 生成不同对象的实例
    const result = deepObj[type(param)](param)
    !cache.get(param) && cache.set(param, result)
    // 复制每一个属性的
    for (const key in param) {
      if (param.hasOwnProperty(key)) {
        result[key] = deepArr.includes(type(param[key]))
          ? p === param[key] // 环检测
            ? cache.get(p) // 赋值缓存的值
            : deepCopy(param[key], p, cache) // 属性是对象的话继续执行深拷贝函数
          : param[key] // 每一个属性复制
      }
    }
    return result
  } else {
    return param // 基本类型拷贝
  }
}
module.exports = deepCopy
