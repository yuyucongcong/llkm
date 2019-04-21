# JavaScript 基础：语法 & 结构

任何语言，包括编程语言都是按规则来定义的。这个规则（或语法）是我们写代码的时候要遵守的，形成了我们代码的逻辑。

> 这篇文章是我写的学习 JavaScript 基础的开始。如果你喜欢务必[关注我](https://medium.com/@timothyrobards)保持追踪。

让我们现在就建立一块 JavaScript。我们将能看到值(字面量 & 变量)，驼峰命名，unicode，分号，缩进，空格，注释，区分大小写，关键字，运算符和表达式！😅

花时间巩固基础，我们会得到编写更多实用和可读更高的代码编写方法。

## JavaScript 值

在 JavaScript 里有两种类型的值：固定值（**字面量**）和可变的值（**变量**）。

**字面量**

字面量是我们在代码中定义的值，如数字，字符串，布尔值（ture 或者 false）,还有对象和数组字面量（别担心）。一些例子包括：

```
10          // A number (can be a decimal eg. 10.5)
'Boat'      // A string (can be in double "" or single '' quotes)
true        // A boolean (true or false)
['a', 'b']                           // An array
{color: 'blue', shape: 'Circle'}     // An object
```

注意：我会在下一篇文章讲数据类型，敬请关注！

**变量**

变量的作用是把值命名后储存起来。在 JavaScript 里我们声明变量可以用 `var`,`let`或者`const` 关键字，通过等号 `=` 来赋值。

举个栗子，定义一个变量 `key` 。并赋值 `abc123`:

```
let key;
key = abc123;
```

什么时候用 `var`？别用，它只是以前的代码在使用。是 ES6 之前的语法。

什么时候用 `let`？如果你的变量需要变动（它可以重新赋值）。

什么时候用 `const`？如果你的变量须是固定值。它必需在声明时赋值并且不能重新赋值。

## 驼峰命名

在一个文档里面我们有很多变量名？举个例子，我们怎么给 `first name` 定义一个变量名？

我们能不能用**连字符**？ e.g. `first-name` 不行， `-` 是 JavaScript 的减号保留字。

那么**下划线**呢？e.g. `first_name` 这个可以，但是它有让代码变得有杂乱和困惑的趋势。

答案？**驼峰命名法** e.g. `firstName`。第一个单词是小写，后续第一个字母是大写。这是社区的习惯。

注意：还可以接受命名 `const` 常量是大写和下划线 e.g. `const DEFAULT_PLAYBACK_SPEED = 1;`这让它可以和其他可变的变量区分。此外就是驼峰命名法最棒了！

## Unicode

JavaScript 使用 unicode 字符集。 Unicode 包括几乎全部字符，标点和符号！点击获取[完整信息](https://unicode-table.com/en/)。这让我们能很好的用任何语言写我们的名字，我们甚至能用 [emojis](https://emojipedia.org/) 作为变量名（为什么不可以？🤷🏻‍♂️）。

## 分号

JavaScript 语言是有许多指令作为声明组成。如：

```
// These are all examples of JavaScript statements:
let a = 1000;
a = b + c;
const time = Date.now();
```

JavaScript 声明是在结尾添加分号 `;`。

然而，**分号不是一直强制需要的！** 如果你不用分号 JavaScript 也没有问题。

```
// Still perfectly valid!
let a = 1000
a = b + c
const time = Date.now()
```

但是有一些分号是强制需要的。举个例子当我们用 `for` 循环的时候，像这样：

```
for (i = 0; i < .length; i++) { 
  // code to execute
}
```

当使用块级声明的时候，分号不需要加在大括号后面，举个例子：

```
if (name == "Samantha") {
  // code
}                           // <- no ';'
//or,
function people(name) {
  // code
}                           // <- no ';'
```

如果是在一个对象上，如：

```
const person = {
  firstName: "Samantha",
  lastName: "Doe",
  age: 30,
  eyeColor: "blue"
};                          // the ';' is mandatory
```

那我们的 `;` 是需要的！

随着时间的推移你需要记住分号什么时候需要，什么时候不需要。所有的地方都用分号结尾才是明智的（块级声明是不需要的！）

它是一个常见的惯例，它能真正的减少错误的出现。

注意：一旦你开始写 JavaScript，开始用一个 linter 如 [ESLint](https://eslint.org/)。它自动在你的代码里检查语法错误和让你生活更轻松！

## 缩进

理论上我们能把所有 JavaScript 写到一行。但是这样就不能保证可读了。这就是为什么我们要换行和缩进了。让我们用一个条件语句作为例子：

```
if (loginSuccessful === 1) {
  // code to run if true
} else {
  // code to run if false
}
```
这里我们能看到所有代码在块内缩进。在这里我们的注释 `// code to run if true` 和 `// code to run if false` 你能选择每行缩进一些空格（通常 2 或 4 ）或者一个 tab。它由你选择，主要看习惯。

如果我们嵌套我们的代码，我们像这样缩进：

```
if (loginAttempts < 5){
  if (loginAttempts < 3){
    alert("< 3");
  } else {
    alert("between 3 and 5");
  }
} else {
  if (loginAttempts > 10){
    alert("> 10");
  } else {
    alert("between 5 and 10");
  }
}
```

应用缩进让你的代码更简洁，提高维护性和可读性。

## 空白

JavaScript 关键字、命名和标识符之间需要一个空格，另外空白区域是会被完全忽略。这意味着目前语言在下面声明没有区别：

```
const visitedCities="Melbourne, "+"Montreal, "+"Marrakech";
const visitedCities = "Melbourne, " + "Montreal, " + "Marrakech";
```

我相信你发现第二行可读性更高。另一个例子：

```
let x=1*y;       
let x = 1 * y;    
```

再一次，第二行更易读和 debug！所以靠你的感觉给你的代码加空格！是因为，下面这样使用空白格也是可以接受的：

```
const cityName         = "Melbourne";
const cityPopulation   = 5000001;
const cityAirport      = "MEL";
```

## 注释

注释是不可执行的代码。他们通常给一些代码提供编程说明。也可以把代码‘注释’出来的防止执行-常用于测试替换代码。

JavaScript 的两种注释类型：

```
// Comment goes here
/* Comment goes here */
```

第一种是单行注释，注释写在 `//` 的右边

第二行是多行注释，注释写在星号之间 `/* here */`

一个多行长注释

```
/* This is 
a comment spanning
multiple lines */
```

## 标识
在 JavaScrip，命名变量，函数，或者属性被称为一个标识。标识包含字母，数字，$ 和 _。不能有其他符号和标识不能以数字开头。

```
// Valid :)
Name
name
NAME
_name
Name1
$name
// Invalid :(
1name
n@me
name!
```

## 区分大小写

JavaScript 是区分大小写的！`test` 和 `Test` 命名是不一样的。

以下会抛出错误：

```
function test() {
  alert("This is a test!");
}
function showAlert() {
  Test();                     // error! test(); is correct
}
```
为了确保我们的代码可读，最好尝试改变我们的命名，让看起来不太类似。

## 保留字

有一些单词被 JavaScript 使用，不能作为标识。那些单词是留给语言，他们有内置保留。如：

```
break, do, instanceof, typeof, case, else, new, var, catch, finally, return, void, continue, for, switch, while, debugger, function, this, with, default, if, throw, delete, in, try, class, enum, extends, super, const, export, import.
```

所部[保留字](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Lexical_grammar#Reserved_keywords_as_of_ECMAScript_2015)

你当然不要保证全部都记住！如果你有任何奇怪的语法错误点在变量，你能检查列表然后修正变量名。

## JavaScript 运算符

数学运算 `+-` `*` 和 `/` 是 JavaScript 的主要运算符，以下：

```
(2 + 2) * 100
```

这个运算符 `=` 是用来赋值给我们的变量的：

```
let a, b, c;
a = 1;
b = 2;
c = 3;
```

## JavaScript 表达式

一个表达式是当我们合并值，变量和操作运算一个新的值（求值）。如：

```
10 * 10    // Evaluates to 100
let x = 5
x * 10     // Evaluates to 50
const firstName = "Samantha";
const lastName = "Doe";
firstName + " " + lastName;    // Evaluates to: Samantha Doe
```

## 结论

继续！这个内容针对 JavaScript 语法和结构给予普遍概念。我们有看到一些注释约定，然而，记住你能灵活运用 - 特别当工作在协作环境时他们有自己特定的标准。

语法和结构在你的代码中扮演很重要的角色关乎其可读性和稳定性。

我希望内容对你有用！你能在 Medium [关注我](https://medium.com/@timothyrobards)。我也在 [Twitter](https://twitter.com/TimJRob) 随意在下面评论留下任何问题。我很乐意回答！

一下篇文章.. [JavaScript 基础: 数据类型](https://itnext.io/javascript-fundamentals-data-types-29ba4a49470d)

来源：https://itnext.io/javascript-fundamentals-syntax-structure-5e9badd0cc4f