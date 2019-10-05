const chai = require('chai')
const sinon = require('sinon')
const sinonChai = require('sinon-chai')
chai.use(sinonChai)

const assert = chai.assert
const deepCopy = require('../src')
describe('function', () => {
  it('是一个函数', () => assert.isFunction(deepCopy))
  it('复制基本类型值', () => {
    const a = 1
    const a1 = deepCopy(a)
    assert(a === a1)
    const b = '1'
    const b1 = deepCopy(b)
    assert(b === b1)
    const c = false
    const c1 = deepCopy(c)
    assert(c === c1)
    const d = null
    const d1 = deepCopy(d)
    assert(d === d1)
    const e = undefined
    const e1 = deepCopy(e)
    assert(e === e1)
    const f = Symbol()
    const f1 = deepCopy(f)
    assert(f === f1)
  })
  describe('对象 ok', () => {
    it('object', () => {
      const a = { x: 1, y: { xx: 1 } }
      const a1 = deepCopy(a)
      assert(a !== a1)
      assert(a.x === a1.x)
      assert(a.y !== a1.y)
      assert(a.y.xx === a1.y.xx)
    })
    it('array ok', () => {
      const a = [[11, 12], [21, 22], [31, 32]]
      const a1 = deepCopy(a)
      assert(a !== a1)
      assert(a[0] !== a1[0])
      assert.deepEqual(a, a1)
    })
    it('function ok', () => {
      const a = (x, y) => x + y
      a.x = 1
      a.y = (x, y) => x * y
      a.z = { xx: 1 }
      const a1 = deepCopy(a)
      assert(a !== a1)
      assert(a.x === a1.x)
      assert(a(1, 2) === a1(1, 2))
      assert(a.y(2, 3) === a1.y(2, 3))
      assert(a.y !== a1.y)
    })
    it('date ok', () => {
      const a = new Date()
      a.xxx = { yyy: { zzz: 1 } }
      const a1 = deepCopy(a)
      assert(a !== a1)
      assert(a.getTime() === a1.getTime())
      assert(a.xxx.yyy.zzz === a1.xxx.yyy.zzz)
      assert(a.xxx.yyy !== a1.xxx.yyy)
      assert(a.xxx !== a1.xxx)
    })
    it('环 ok', () => {
      const a = { name: '方方' }
      a.self = a
      const a1 = deepCopy(a, a)
      assert(a !== a1)
      assert(a.name === a1.name)
      assert(a.self !== a1.self)
      assert(a.self.name === a1.self.name)
      assert(a1 === a1.self)
    })
    xit('不爆栈 ok', () => {
      const a = { child: null }
      for (let i = 0; i < 10000; i++) {
        achild = {
          child: null
        }
      }
      const a1 = deepCopy(a)
      assert(a !== a1)
      assert(a.child !== a1.child)

      // 不做爆栈
      // 解决爆栈的方法是，把向下拷贝的对象放在一个数组里面，到最后通过遍历解决爆栈问题
    })
    it('正则 ok', () => {
      //   const a = /hi\d+/gi;
      const a = new RegExp('hi\\d+', 'gi')
      a.xxx = { yyy: { zzz: 1 } }
      const a1 = deepCopy(a)
      assert(a.source === a1.source)
      assert(a.flags === a1.flags)
      assert(a !== a1)
      assert(a.xxx.yyy.zzz === a1.xxx.yyy.zzz)
      assert(a.xxx.yyy !== a1.xxx.yyy)
      assert(a.xxx !== a1.xxx)
    })
    it('不拷贝原型 ok', () => {
      const a = Object.create({ name: 'a' })
      a.xxx = { yyy: { zzz: 1 } }
      const a1 = deepCopy(a)
      assert(a !== a1)
      assert.isFalse('name' in a1)
      assert(a.xxx.yyy.zzz === a1.xxx.yyy.zzz)
      assert(a.xxx.yyy !== a1.xxx.yyy)
      assert(a.xxx !== a1.xxx)
    })
  })
  it('复杂对象 ok', () => {
    const a = {
      n: NaN,
      n2: Infinity,
      s: '',
      bool: false,
      null: null,
      u: undefined,
      sym: Symbol(),
      o: {
        n: NaN,
        n2: Infinity,
        s: '',
        bool: false,
        null: null,
        u: undefined,
        sym: Symbol()
      },
      array: [
        {
          n: NaN,
          n2: Infinity,
          s: '',
          bool: false,
          null: null,
          u: undefined,
          sym: Symbol()
        }
      ]
    }
    const a1 = deepCopy(a)
    assert(a !== a1)
    assert.isNaN(a1.n)
    assert(a.n2 === a1.n2)
    assert(a.s === a1.s)
    assert(a.bool === a1.bool)
    assert(a.null === a1.null)
    assert(a.u === a1.u)
    assert(a.sym === a1.sym)
    assert(a.o !== a1.o)
    assert.isNaN(a1.o.n)
    assert(a.o.n2 === a1.o.n2)
    assert(a.o.s === a1.o.s)
    assert(a.o.bool === a1.o.bool)
    assert(a.o.null === a1.o.null)
    assert(a.o.u === a1.o.u)
    assert(a.o.sym === a1.o.sym)
    assert(a.array !== a1.array)
    assert(a.array[0] !== a1.array[0])
    assert.isNaN(a1.array[0].n)
    assert(a.array[0].n2 === a1.array[0].n2)
    assert(a.array[0].s === a1.array[0].s)
    assert(a.array[0].bool === a1.array[0].bool)
    assert(a.array[0].null === a1.array[0].null)
    assert(a.array[0].u === a1.array[0].u)
    assert(a.array[0].sym === a1.array[0].sym)
  })
})
