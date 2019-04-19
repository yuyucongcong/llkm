# 为什么 Promises 和 Async/Await 更胜一筹

在 JavaScript 中异步函数既有优点也有缺点。优点是异步函数不会阻塞，因此，Node.js 特别的快。缺点是异步函数的行为比较绕，特别是在你有时需要等待一个 “callback” 函数完成再去执行下一步。

有一些方法能发挥异步函数回调的优势又能妥善处理它们的执行，其中一个方法远远优于其他方法（Spoiler：他是 Async/Await）。在这个快速阅读，你能学习关于 Promise 的来龙去脉和使用 Async/Await，以及我们如何比较这两个方法。

**Enjoy!**

## Promises vs. Callbacks 🥊

作为一个 JavaScript 或者 Node.js 开发者，正确的理解 Promises 和 Callbacks 之间不同和它们如何一起工作，至关重要。

它们之间有一点*重要*的不同，每个 Promise 的核心都有一个 callback 解析数据（或错误）传递到 Promise 的调用。

用 callback 处理：
```
function done(err) {
    if (err) {
        console.log(err);
        return;
    }

    console.log('Passwords match!');
}
```
调用 `validatePassword()` 函数
```
function validatePassword(password) {
    if (password !== 'bambi') {
        return done('Password mismatch!');
    }

    return done(null);
}
```
这个代码片段显示了一个完整的前端和后端验证密码（它是静态的必需匹配“bambi”，我小时候喜欢的卡通形象）：
```
// provided a string (password)
function validatePassword(password) {
    // create promise with resolve and reject as params
    return new Promise((resolve, reject) => {
        // validate that password matches bambi (the deer)
        if (password !== 'bambi') {
            // password doesn't match, return an error with reject
            return reject('Invalid Password!');
        }

        // password matches, return a success state with resolve
        resolve();
    });
}

function done(err) {
    // if an err was passed, console out a message
    if (err) {
        console.log(err);
        return; // stop execution
    }

    // console out a valid state
    console.log('Password is valid!');
}

// dummy password
const password = 'foo';

// using a promise, call the validate password function
validatePassword(password)
    .then(() => {
        // it was successful
        done(null);
    })
    .catch(err => {
        // an error occurred, call the done function and pass the err message
        done(err);
    });
```
这个代码解释的非常好，然而，如果你还有困惑，这个 catch 是执行在事件 `reject()` 调用后的 Promise。因为密码不匹配，我们调用 `reject()`,因此“捕捉”到了错误把它发送到 `done()` 函数。

## Promises 🤞
Promises 为异步执行构成和管理异步操作相比传统基于 callback 的方法提供了一个更简单的选择。他们有类似 try/catch 的方法来处理异步错误。

**Promises 也提供了三个唯一的状态**

1. **Pending -** promise 的结果没确定，因为异步操作还未产生结果。

2. **Fulfilled -** 异步操作完成，promise 已经有值。

3. **Rejected -** 异步操作错误，fulfilled 永远不会被执行，在 rejected 状态，一定会有一个操作失败的原因。

一个 promise 从 pending 转换到 fulfilled 或者 rejected 状态。一旦一个 promise 是 fulfilled 或者 rejected，它永远不会转换成其他状态，它的取到的值或者失败的原因不会变。

不足 👎

这件事不是说 Promises 解决了“回调地狱”，实际上只是一系列函数回调嵌套。当然，一个还好。如果很多回调，你的代码很难看懂，难以阅读和维护。

Looping in Promises 🎡

避免 JavaScript 深度嵌套，如果你能简单遍历每个 Promises，返回一个数组或者对象的结果，和它什么时候停止什么时候完成。不幸的是，这不简单；虽然原生 JavaScript 支持异步，但是没有“完成”事件，除非你遍历每个 Promise 来知道你调用的代码什么时候完成。

这类情况正确的解决方法是用 [Promise.all()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all). 这个函数会等所有的请求完成（或第一个拒绝）之后返回完成。


错误处理 💣

错误处理在多个嵌套 Promise 回调里像蒙眼开车。运气好的话能找到 Promise 抛出的错误。你最好打赌移除 `catch()` 方法和选择用全局错误处理（祝你好运）像这样：

**Browser:**
```
window.addEventListener('unhandledrejection', event => {
    // can prevent error output on the console:
    event.preventDefault();

    // send error to log server
    log('Reason: ' + event.reason);
});
```

**Node.js:**
```
process.on('unhandledRejection', (reason) => {
    console.log('Reason: ' + reason);
});
```
> 注意：以上两种配置是确保你能捕捉到错误的两种方法。如果你没有添加 `catch()` 方法，它的报货是会被吞掉的。

Async/Await? 🤔

Async/Await 让我们写 JavaScript 的异步操作就像同步编程一样。在前面的文件，你知道了 Promises - 这是*支持*简化异步流和避免回调地狱-但是它们没做到。

回调地狱? 🔥

回调地狱是一个术语用来解释下面的场景：

> 注意:这是一个栗子，这里的 API 调用数组里 4 个特别的用户。

```
// users to retrieve
const users = [
    'W8lbAokuirfdlTJpnsNC5kryuHtu1G53',
    'ZinqxnohbXMQdtF6avtlUkxLLknRxCTh',
    'ynQePb3RB2JSx4iziGYMM5eXgkwnufS5',
    'EtT2haq2sNoWnNjmeyZnfUmZn9Ihfi8w'
];

// array to hold response
let response = [];

// fetch all 4 users and return responses to the response array
function getUsers(userId) {
    axios
        .get(`/users/userId=${users[0]}`)
        .then(res => {
            // save the response for user 1
            response.push(res);

            axios
                .get(`/users/userId=${users[1]}`)
                .then(res => {
                    // save the response for user 2
                    response.push(res);

                    axios
                        .get(`/users/userId=${users[2]}`)
                        .then(res => {
                            // save the response for user 3
                            response.push(2);

                            axios
                                .get(`/users/userId=${users[3]}`)
                                .then(res => {
                                    // save the response for user 4
                                    response.push(res);
                                })
                                .catch(err => {
                                    // handle error
                                    console.log(err);
                                });
                        })
                        .catch(err => {
                            // handle error
                            console.log(err);
                        });
                })
                .catch(err => {
                    // handle error
                    console.log(err);
                });
        })
        .catch(err => {
            // handle error
            console.log(err);
        });
}
```

哎，这代码丑陋又占用大量空间。 是最新和最棒的 Async/Await 来到了 JavaScript ，让我们不止避免了回调地狱还保证了代码的直接和确保错误的捕获。我找到更迷人的 Async/Await 用在 Promises （无阻塞）之上，提高代码的可读性和读起来像同步代码。这就是力量所在。

> 注意：这里是一个例子同样是取回四个用户的数据，但只要一半的代码

```
// users to retrieve
const users = [
    'W8lbAokuirfdlTJpnsNC5kryuHtu1G53',
    'ZinqxnohbXMQdtF6avtlUkxLLknRxCTh',
    'ynQePb3RB2JSx4iziGYMM5eXgkwnufS5',
    'EtT2haq2sNoWnNjmeyZnfUmZn9Ihfi8w'
];

// array to hold response
let response = [];

async function getUsers(users) {
    try {
        response[0] = await axios.get(`/users/userId=${users[0]}`);
        response[1] = await axios.get(`/users/userId=${users[1]}`);
        response[2] = await axios.get(`/users/userId=${users[2]}`);
        response[3] = await axios.get(`/users/userId=${users[3]}`);
    } catch (err) {
        console.log(err);
    }
}
```
赞，对吧? 💃

因为可以在 Promises 上用 Async/Await，你甚至能使用 await 关键字：

```
async function fetchUsers() {
  const user1 = getUser1();
  const user2 = getUser2();
  const user3 = getUser3();

  const results = await Promise.all([user1, user2, user3]);
}
```

> 注意：Async/await 由于它的同步性质，速度会慢一点。你应该小心在执行大量代码之前使用多个 await ，毕竟它是同步运行。

## 我如何开始使用 Async/Await? 💻

使用 Async/Await 出奇的简单。事实上，最新版本的 Node.js 已经原生的支持了和浏览器很快也要支持。现在，如果你想要用它到客户端，你需要用 [Babel](https://babeljs.io/)，一步简单的转化到 web。

### Async

让我们开学学习 async 关键字。它放置在 function 前，像这样：

```
async function returnTrue() {
  return true;
}
```
### Await
这个关键字是等待 JavaScript 的 promise 返回结果给它。这里一个例子：

```
let value = await promise; // only works inside of an async function
```

### 完整的例子

```
// this function will return true after 1 second (see the async keyword in front of function)
async function returnTrue() {

  // create a new promise inside of the async function
  let promise = new Promise((resolve, reject) => {
    setTimeout(() => resolve(true), 1000) // resolve
  });

  // wait for the promise to resolve
  let result = await promise;

  // console log the result (true)
  console.log(result);
}

// call the function
returnTrue();
```
## 为什么 Async/Await 更好? 😁

现在我们知道了一些 Promises 和 Async/Await 的事，让我们概括一下为什么 Async/Await 是我们写代码更好的选择。

1. Async/Await 让代码更整洁和代码量更少，代码写得少，错得少。最终，它让复杂的代码，嵌套代码变得可读。
2. 错误处理和 try/catch 在一个地方，而不是在回调里。
3. 错误栈合理，而不是让你从 Promises 收到含糊不清的信息，大量难以定位的错误。最好的是，错误的点在错误的函数里。

## 最后的想法📃

我能说 Async/Await 是在过去那么多年里新增到 JavaScript 中最强大的特性。

用不到一天的时间去了解语法和看我们的在这方面的代码有多杂乱。我用大约两天的时间把基于 Promise 的代码转换成 Async/Await，基本上重写了一遍-这就表明很少的代码需要用到 Async/Await。

最后，谢谢你阅读这篇文章。如果你是对为什么我整天都在 stream 上感兴趣，你应该拿 [五分钟 API 教程](https://getstream.io/try-the-api/) 去试一下 - 我保证很值得。更多优秀的内容，你也能 follow 我的 Twitter - [@nickparsons](https://twitter.com/@nickparsons).

来源:https://dev.to/nickparsons/javascript-promises-and-why-asyncawait-wins-the-battle-1g8a