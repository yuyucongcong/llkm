# 哪些是你应该知道的 JavaScript 数组方法？
让我们标记一个重点：**常用 for 循环会让代码难以阅读**。当它来迭代一个数组，查找元素，排序或者任何你想要做的，可能有一个数组方法是可以给你用的。

然而，它们仍然不知道可以使用尽管它们。我会努力让你获得有用的方法。请将本内容做为你的 JavaScript 数组方法指南。

**注意**：开始之前，你要知道一件事情：我是偏函数式编程。所以我趋向的使用方法是不改变原来的数组。那样，可以避免副作用。我不说你应该绝不改变数组，但在最少知道的同样方法和它会导致的副作用。副作用会引起不必要的更变从而导致不必要的 bugs！

知道了，让我们现在开始。

## 要点
哪四个数组方法是你需要知道的：`map`,`filter`,`reduce` 和拓展运算符。它们是强大和好用的。

### map
你会用到一堆这个方法。基本上，你每次要改变数组元素你都会用到 `map`

它获取函数作为参数：函数用于遍历数组的每个元素，同时它会返回一个**新数组**，所以没有副作用。

```
const numbers = [1, 2, 3, 4]

const numbersPlusOne = numbers.map(n => n + 1) // Adds one to every element
console.log(numbersPlusOne) // [2, 3, 4, 5]
```

你也能用于为对象的特定属性创建一个数组

```
const allActivities = [
  { title: 'My activity', coordinates: [50.123, 3.291] },
  { title: 'Another activity', coordinates: [1.238, 4.292] },
  // etc.
]

const allCoordinates = allActivities.map(activity => activity.coordinates)
console.log(allCoordinates) // [[50.123, 3.291], [1.238, 4.292]]
```

所以，记住，无论何时你需要**转换**一个数组，想到**map**

### filter

这个方法的名字相当贴切：什么时候你要过滤数组就用它。

就像 `map` 一样，它获取一个函数当作参数，用这个函数遍历数组的每一个元素。这个函数需要返回一个布尔值：

- `true` 保留这个元素在数组
- `false` 不保留这个元素在数组

然后你有一个闪亮的新数组里面只有你想要保留的元素。

举栗子，你只保留奇数在数组：

```
const numbers = [1, 2, 3, 4, 5, 6]
const oddNumbers = numbers.filter(n => n % 2 !== 0)
console.log(oddNumbers) // [1, 3, 5]
```

或者你也能用它移除数组某个特定的元素：

```
const participants = [
  { id: 'a3f47', username: 'john' },
  { id: 'fek28', username: 'mary' },
  { id: 'n3j44', username: 'sam' },
]

function removeParticipant(participants, id) {
  return participants.filter(participant => participant.id !== id)
}

console.log(removeParticipant(participants, 'a3f47')) //  [{ id: 'fek28', username: 'mary' }, { id: 'n3j44', username: 'sam' }];
```
### reduce 
这是我看来最难的数组方法。但一旦你学会它，很多疯狂的事你都能用它来做。
基本上 `reduce` 是关于拿一个数组的值来结合输入的值。它有两个参数，一个回调函数是我们的**规约**和一个可选的初始化值（默认是数组第一项）。它的回调函数能获得四个参数。
- 累加器：它累加每次规约的返回值
- 当前数组的值
- 当前的索引
- 被操作的数组
很多时候，你只要是第一和第二个参数：这个累加器和当前值。
```
const numbers = [37, 12, 28, 4, 9]
const total = numbers.reduce((total, n) => total + n)
console.log(total) // 90
```
在第一个迭代，这个累加器，这是 `total`，获取一个初始值是 37.返回值是 37+`n` 而 `n` 是等于 12，从而等于 49。在第二次迭代，这个累加器等于 49，它返回的是 49 + 28 = 77。以此类推。

`reduce` 的强大在于能用它创建像 `map` 或者 `filter` 的数组方法:
```
const map = (arr, fn) => {
  return arr.reduce((mappedArr, element) => {
    return [...mappedArr, fn(element)]
  }, [])
}

console.log(map([1, 2, 3, 4], n => n + 1)) // [2, 3, 4, 5]

const filter = (arr, fn) => {
  return arr.reduce((filteredArr, element) => {
    return fn(element) ? [...filteredArr] : [...filteredArr, element]
  }, [])
}

console.log(filter([1, 2, 3, 4, 5, 6], n => n % 2 === 0)) // [1, 3, 5]
```
基本上，我们给 `reduce` 一个初始值 `[]`:来累加。对于 `map`，我们执行一个函数对元素的结果递归，谢谢**拓展运算符**（看不懂别担心，我们接下来会介绍它）。对于 `filter`,它几乎一样，除了我们在元素运行过滤函数。如果他返回 true，我们返回**冒号前面的数组**，否则我们返回另一个。

让我们看一些高级的栗子：把多维数组扁平化成一个数组，那是说转化一些像 `[1, 2, 3, [4, [[[5, [6, 7]]]], 8]]` 变成 `[1, 2, 3, 4, 5, 6, 7, 8]`
```
function flatDeep(arr) {
  return arr.reduce((flattenArray, element) => {
    return Array.isArray(element)
      ? [...flattenArray, ...flatDeep(element)]
      : [...flattenArray, element]
  }, [])
}

console.log(flatDeep([1, 2, 3, [4, [[[5, [6, 7]]]], 8]])) // [1, 2, 3, 4, 5, 6, 7, 8]
```
这个例子是类似 `map` 除非我们用作递归，因为它是另外文章的内容，所以我不会在这里解释它。然而你想知道更多关于迭代的内容，点击去这里 [excellent resource](https://guillaumebogard.dev/blog/what-is-recursion/)

## Spread operator (ES2015)
我同意，这不是一个方法。管他呢，使用拓展运算符能帮助你实现很多数组的工作。事实上，你能用它把一个数组的值扩展到另一个数组，从而，你能复制一个数组或者窜连多个数组。
```
const numbers = [1, 2, 3]
const numbersCopy = [...numbers]
console.log(numbersCopy) // [1, 2, 3]

const otherNumbers = [4, 5, 6]
const numbersConcatenated = [...numbers, ...otherNumbers]
console.log(numbersConcatenated) // [1, 2, 3, 4, 5, 6]
```
**警告**：拓展运算符是在原来的数组做**浅拷贝**。但是**浅**是什么意思呢？

好吧，浅拷贝是为了在内存减少占用而复用原来数组的地址。所以你有一个数组含有数字，字符串或者布尔值（**原始类型**）,那没有问题，这些值是真的复制的。然而，不一样的是**对象**或者**数组**。仅是对原始值**引用**！因此，如果是一个数组里含有对象而你修改了浅拷贝的数组里的对象时，就会改变原来数组里的对象，它也是修改原来数组中的对象，因为它们**相同引用**原来的数组。
```
const arr = ['foo', 42, { name: 'Thomas' }]
let copy = [...arr]

copy[0] = 'bar'

console.log(arr) // No mutations: ["foo", 42, { name: "Thomas" }]
console.log(copy) // ["bar", 42, { name: "Thomas" }]

copy[2].name = 'Hello'

console.log(arr) // /!\ MUTATION ["foo", 42, { name: "Hello" }]
console.log(copy) // ["bar", 42, { name: "Hello" }]
```
所以，如果你想要做**真的**拷贝一个数组或者对象，你能使用 loadsh 函数像[cloneDeep](https://lodash.com/docs/#cloneDeep)。但是不能感觉像是你一定要做这样的事情。这里是告诉你**事情如何运作**

## 最好知道
下面的其他方法能更好的帮助你查找一个数组中的元素，讲部分数组方法。

### includes(ES2016)
你有没有用过 `indexOf` 去确认一些数组元素是否存在？可怕的方法是吧？幸运的是现在有 `includes` 给我们了。给一个参数到 `includes` 它会查找出元素是否存在。
```
const sports = ['football', 'archery', 'judo']
const hasFootball = sports.includes('football')
console.log(hasFootball) // true
```
### concat
concat 方法能合并两个或者多个数组
```
const numbers = [1, 2, 3]
const otherNumbers = [4, 5, 6]

const numbersConcatenated = numbers.concat(otherNumbers)
console.log(numbersConcatenated) // [1, 2, 3, 4, 5, 6]

// You can merge as many arrays as you want
function concatAll(arr, ...arrays) {
  return arr.concat(...arrays)
}

console.log(concatAll([1, 2, 3], [4, 5, 6], [7, 8, 9], [10, 11, 12])) // [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
```
### forEach
每当你想要执行一些遍历每个数组元素，你可以用 `forEach`。它获得一个函数作为参数且会得到三个参数：当前值，索引和当前数组：
```
const numbers = [1, 2, 3, 4, 5]
numbers.forEach(console.log)
// 1 0 [ 1, 2, 3 ]
// 2 1 [ 1, 2, 3 ]
// 3 2 [ 1, 2, 3 ]
```
### indexOf
他是用于返回第一个找到这个数组元素的索引。`indexOf` 也是广泛的用于检查元素是否存在一个数组中。老实说，我不喜欢用它。
```
const sports = ['football', 'archery', 'judo']

const judoIndex = sports.indexOf('judo')
console.log(judoIndex) // 2
```
### find
这个 `find` 方法是非常类似 `filter` 方法的。你提供一个函数去测试每一个数组元素。然而，`find` 找到一个元素后就会算通过测试从而停止迭代。不像 `filter`。`filter` 是会迭代完整个数组。

```
const users = [
  { id: 'af35', name: 'john' },
  { id: '6gbe', name: 'mary' },
  { id: '932j', name: 'gary' },
]

const user = users.find(user => user.id === '6gbe')
console.log(user) // { id: '6gbe', name: 'mary' }
```
所以用 `filter` 是你想过滤一整个数组。使用 `find` 是你只想过滤一个不同的数组元素。

### findIndex

它刚好和 `find` 一样的方法，但它是返回找到的第一个元素的索引。
```
const users = [
  { id: 'af35', name: 'john' },
  { id: '6gbe', name: 'mary' },
  { id: '932j', name: 'gary' },
]

const user = users.findIndex(user => user.id === '6gbe')
console.log(user) // 1
```
你可能会想 `findIndex` 和 `indexOf` 一样。不完全是。`indexOf` 的第一个参数是原始类型 (boolean, number, string, null, undefined or a symbol) 而 `findIndex` 是回调函数。

所以你想要找到的数组元素是原始类型，你能用 `indexOf`。如果你要更多复杂的元素比如对象，使用 `findIndex`。

### slice
每当你需要一个数组的某一部分，你能用 `slice` 但要小心，就像拓展运算符，`slice` 返回的是浅拷贝的部分。
```
const numbers = [1, 2, 3, 4, 5]
const copy = numbers.slice()
```
我一开始说 for 循环要少用。让我给你一个栗子教你摆脱它。

你想要通过 API 取回一定量的聊天信息并只显示其中五个。你找到下面两个方法：一个是 for 循环另一个是`slice`

```
// The "traditional way" to do it:
// Determine the number of messages to take and use a for loop
const nbMessages = messages.length < 5 ? messages.length : 5
let messagesToShow = []
for (let i = 0; i < nbMessages; i++) {
  messagesToShow.push(posts[i])
}

// Even if "arr" has less than 5 elements,
// slice will return an entire shallow copy of the original array
const messagesToShow = messages.slice(0, 5)
```
### some
如果你想要测试一个数组中最少一个元素通过测试，你可以用 `some`。只要像 `map`,`filter` or `find`,`some` 获取一个回调函数作为参数。有一个元素通过它就返回 `true`，否则返回 `false`

你能使用 `some` 来处理权限的栗子：
```
const users = [
  {
    id: 'fe34',
    permissions: ['read', 'write'],
  },
  {
    id: 'a198',
    permissions: [],
  },
  {
    id: '18aa',
    permissions: ['delete', 'read', 'write'],
  },
]

const hasDeletePermission = users.some(user =>
  user.permissions.includes('delete')
)
console.log(hasDeletePermission) // true
```
### every
类似 `some` 而 `every` 是所有元素都通过测试条件（而不是至少一个）。
```
const users = [
  {
    id: 'fe34',
    permissions: ['read', 'write'],
  },
  {
    id: 'a198',
    permissions: [],
  },
  {
    id: '18aa',
    permissions: ['delete', 'read', 'write'],
  },
]

const hasAllReadPermission = users.every(user =>
  user.permissions.includes('read')
)
console.log(hasAllReadPermission) // false
```
### flat (ES2019)
这个新的方法正在来到 JavaScript 世界中。基本上，`flat` 创建一个新数组来串联子数组元素。它接受一个参数，一个数字，来代表你想要是多深的子元素扁平你的数组：
```
const numbers = [1, 2, [3, 4, [5, [6, 7]], [[[[8]]]]]]

const numbersflattenOnce = numbers.flat()
console.log(numbersflattenOnce) // [1, 2, 3, 4, Array[2], Array[1]]
// Note: Array[2] means it's a two-dimensional array

const numbersflattenTwice = numbers.flat(2)
console.log(numbersflattenTwice) // [1, 2, 3, 4, 5, Array[2], Array[1]]

const numbersFlattenInfinity = numbers.flat(Infinity)
console.log(numbersFlattenInfinity) // [1, 2, 3, 4, 5, 6, 7, 8]
```
### flatMap(ES2019)
你能猜出这个方法做什么的吗？
首先它运行一个 map 函数在每个元素。然后变化化数组一次。非常简单！
```
const sentences = [
  'This is a sentence',
  'This is another sentence',
  "I can't find any original phrases",
]

const allWords = sentences.flatMap(sentence => sentence.split(' '))
console.log(allWords) // ["This", "is", "a", "sentence", "This", "is", "another", "sentence", "I", "can't", "find", "any", "original", "phrases"]
```
在这个栗子，你有很多句子你想获得其中所有的单词。而不是使用 `map` 来分割句子的每个单词然后扁平化它们，你能直接使用 `flatMap`。

与 `flatMap` 无关，但你能用 `reduce` 计算每个单词出现几次的函数(只是告诉另一个`reduce`栗子)
```
const wordsCount = allWords.reduce((count, word) => {
  count[word] = count[word] ? count[word] + 1 : 1
  return count
}, {})
console.log(wordsCount) // { This: 2, is: 2, a: 1, sentence: 2, another: 1, I: 1, "can't": 1, find: 1, any: 1, original: 1, phrases: 1, }
```
`flatMap` 也经常用在响应式编程，你能看一个例子[这里](http://reactivex.io/documentation/operators/flatmap.html)

### join

如果你需要基于数组元素创建一个字符串，`join` 合适你。它允许创建一个新字符串来串联数组元素，提供一个分离用的分割符。

举个例子，`join` 的行为一目了然：
```
const participants = ['john', 'mary', 'gary']
const participantsFormatted = participants.join(', ')
console.log(participantsFormatted) // john, mary, gary
```
这里一个更真实的例子用于过滤参与者和获取他们的名字:
```
const potentialParticipants = [
  { id: 'k38i', name: 'john', age: 17 },
  { id: 'baf3', name: 'mary', age: 13 },
  { id: 'a111', name: 'gary', age: 24 },
  { id: 'fx34', name: 'emma', age: 34 },
]

const participantsFormatted = potentialParticipants
  .filter(user => user.age > 18)
  .map(user => user.name)
  .join(', ')

console.log(participantsFormatted) // gary, emma
```
### form
这是一个**静态**方法用来给类数组对象或者迭代对象创建一个新数组。它可以用在 DOM 相关的工作上。
```
const nodes = document.querySelectorAll('.todo-item') // this is an instance of NodeList, you can't use array methods with it
const todoItems = Array.from(nodes) // now, you can use map, filter, etc. as you're workin with an array!
```
你有没有看到我们用 `Array` 代替一个数组实例？那是因为 `from` 是一个静态方法。
然后有趣的是你能用 `forEach` 为获取到的节点注册事件监听：
```
todoItems.forEach(item => {
  item.addEventListener('click', function() {
    alert(`You clicked on ${item.innerHTML}`)
  })
})
```

### isArray

而在这里，我们说另一个 `Array` 的静态方法就是 `isArray`。毫无意外，它会告诉你传递的值是否是数组。

基于这个例子，这是我们得到的：
```
const nodes = document.querySelectorAll('.todo-item')
console.log(Array.isArray(nodes)) // false
const todoItems = Array.from(nodes)
console.log(Array.isArray(todoItems)) // true
```

## Good to know but mutating
你找到下面其他数组方法。区别在于它们会修改原来的数组。修改原来的数组没有错但要注意！对于这些方法，如果你不想要更变原来的数组，只要预先做一个浅拷贝或者深拷贝：
```
const arr = [1, 2, 3, 4, 5]
const copy = [...arr] // or arr.slice()
```
### sort
对，`sort` 会修改原来的数组。事实上，它对数组元素排序。默认排序方法是转换所有元素为字符串然后字母排序：
```
const names = ['john', 'mary', 'gary', 'anna']
names.sort()
console.log(names) // ['anna', 'gary', 'john', 'mary']
```
所以如果你是有 Python 背景就要小心了，用 `sort` 为一个数字类型数组排序不能给你预期想要的：
```
const numbers = [23, 12, 17, 187, 3, 90]
numbers.sort()
console.log(numbers) // [12, 17, 187, 23, 3, 90] 🤔
```
然而要怎么排序数组？好吧，`sort` 接收一个函数，一个**比较函数**。这个函数允许两个参数：第一个元素（让我们叫 `a` ）和第二个元素比较( `b` )。比较两个数之前需要返回一个数字：
- 如果是负数，a 在 b 前面
- 如果是正数，b 在 a 前面
- 如果不变返回 0

然后你能用这个方法排序
```
const numbers = [23, 12, 17, 187, 3, 90]
numbers.sort((a, b) => a - b)
console.log(numbers) // [3, 12, 17, 23, 90, 187]
```
或者你能按照日期排序
```
const posts = [
  {
    title: 'Create a Discord bot under 15 minutes',
    date: new Date(2018, 11, 26),
  },
  { title: 'How to get better at writing CSS', date: new Date(2018, 06, 17) },
  { title: 'JavaScript arrays', date: new Date() },
]
posts.sort((a, b) => a.date - b.date) // Substracting two dates returns the difference in millisecond between them
console.log(posts)
// [ { title: 'How to get better at writing CSS',
//     date: 2018-07-17T00:00:00.000Z },
//   { title: 'Create a Discord bot under 15 minutes',
//     date: 2018-12-26T00:00:00.000Z },
//   { title: 'Learn Javascript arrays the functional way',
//     date: 2019-03-16T10:31:00.208Z } ]
```
### fill

`fill` 修改或者填充一个静态值到数组从下标开始到结束所有元素的。一个好的方法是用 `fill` 去填充一个新数组的静态值。
```
// Normally I would have called a function that generates ids and random names but let's not bother with that here.
function fakeUser() {
  return {
    id: 'fe38',
    name: 'thomas',
  }
}

const posts = Array(3).fill(fakeUser())
console.log(posts) // [{ id: "fe38", name: "thomas" }, { id: "fe38", name: "thomas" }, { id: "fe38", name: "thomas" }]
```
### reverse
我想这个方法名非常清晰。像 `sort` 做的一样，`reverse` 反转数组顺序!

```
const numbers = [1, 2, 3, 4, 5]

numbers.reverse()
console.log(numbers) // [5, 4, 3, 2, 1]
```
### pop
移除数组最后一个元素并且返回这个元素
```
const messages = ['Hello', 'Hey', 'How are you?', "I'm fine"]
const lastMessage = messages.pop()
console.log(messages) // ['Hello', 'Hey', 'How are you?']
console.log(lastMessage) // I'm fine
```
## Methods you can replace

最后，这部分内容。你能找到的方法会更变原来的数组，但你能轻易取代这些方法。我不说你也知道是哪些方法。我只是想让你知道实现相同的数组方法有副作用并有备选方案。

### push

这是广泛使用的数组方法。事实上 `push` 允许你添加或多个元素到数组。它也通常用于基于旧数组创建一个新数组。
```
const todoItems = [1, 2, 3, 4, 5]

const itemsIncremented = []
for (let i = 0; i < items.length; i++) {
  itemsIncremented.push(items[i] + 1)
}

console.log(itemsIncremented) // [2, 3, 4, 5, 6]

const todos = ['Write an article', 'Proofreading']
todos.push('Publish the article')
console.log(todos) // ['Write an article', 'Proofreading', 'Publish the article']
```
如果你需要向基于像 `itemsIncremented` 创建一个新数组，需要一些方法制作它像你的好朋友 `map`,`filter` 或者 `reduce`。事实上我们能用 `map` 做同样的事：
```
const itemsIncremented = todoItems.map(x => x + 1)
```
还有你想要用 `push` 添加一个新元素，拓展运算符也能做到：
```
const todos = ['Write an article', 'Proofreading']
console.log([...todos, 'Publish the article']) // ['Write an article', 'Proofreading', 'Publish the article']
```
### splice
`splice` 是经常用来移除指定下标的元素，你其实也同样能用 `filter`:
```
const months = ['January', 'February', 'March', 'April', ' May']

// With splice
months.splice(2, 1) // remove one element at index 2
console.log(months) // ['January', 'February', 'April', 'May']

// Without splice
const monthsFiltered = months.filter((month, i) => i !== 3)
console.log(monthsFiltered) // ['January', 'February', 'April', 'May']
```
还有你也许想，但是我要移除一堆元素呢？好，用 slice:
```
const months = ['January', 'February', 'March', 'April', ' May']

// With splice
months.splice(1, 3) // remove three elements starting at index 1
console.log(months) // ['January', 'May']

// Without splice
const monthsSliced = [...months.slice(0, 1), ...months.slice(4)]
console.log(monthsSliced) // ['January', 'May']
```
### shift
`shift` 移除数组的第一个元素并返回它。它很实用，你可以用它拓展和删减：
```
const numbers = [1, 2, 3, 4, 5]

// With shift
const firstNumber = numbers.shift()
console.log(firstNumber) // 1
console.log(numbers) // [2, 3, 4, 5]

// Without shift
const [firstNumber, ...numbersWithoutOne] = numbers
console.log(firstNumber) // 1
console.log(numbersWithoutOne) // [2, 3, 4, 5]
```
### unshift
`unshift` 允许你添加一个或多个元素到数组前面。就像 `shift`，你能用扩展运算符去做这件事：
```
const numbers = [3, 4, 5]

// With unshift
numbers.unshift(1, 2)
console.log(numbers) // [1, 2, 3, 4, 5]

// Without unshift
const newNumbers = [1, 2, ...numbers]
console.log(newNumbers) // [1, 2, 3, 4, 5]
```
## TL;DR
- 每当你需要执行操作一个数组，不要用**for-loop**和不要造轮子，那些方法大概能做到你想要的。
- 很多时候，你只要用 `map`,`filter`,`reduce` 和拓展运算符。它们是每个开发的必要工具。
- 哪些数组方法你最少知道像 `slice`,`some`,`flatMap` 等.认识和适当使用它们！
- 副作用导致不必要的更变。要知道哪些方法更变你原来的数组。
- `slice` 和拓展运算符做浅拷贝。 而对象和子数组会分享同样的指引。要小心。
- “老”的更变数组方法能替代成新的方法。它们由你决定如何处理它们。

来源： https://thomlom.dev/what-you-should-know-about-js-arrays/
