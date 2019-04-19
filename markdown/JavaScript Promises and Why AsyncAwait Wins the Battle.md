# JavaScript: Promises and Why Async/Await Wins the Battle
Asynchronous functions are a good and bad thing in JavaScript. The good side is that asynchronous functions are non-blocking and, therefore, are fast – especially in a Node.js context. The downside is that dealing with asynchronous functions can be cumbersome, as you sometimes have to wait for one function to complete in order to get its “callback” before proceeding to the next execution.

There are a handful of ways to play to the strengths of asynchronous function calls and properly handle their execution, but one is far superior to the rest (Spoiler: it’s Async/Await). In this quick read, you’ll learn about the ins and outs of [Promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) and the use of [Async/Await](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function), as well as our opinion on how the two compare.

**Enjoy!**

## Promises vs. Callbacks 🥊

As a JavaScript or Node.js developer, properly understanding the difference between Promises and Callbacks and how they work together, is crucial.

There are small but important differences between the two. At the core of every Promise, there is a callback resolving some kind of data (or error) that bubbles up to the Promise being invoked.

### The callback handler:

```
function done(err) {
    if (err) {
        console.log(err);
        return;
    }

    console.log('Passwords match!');
}
```
Calling the `validatePassword()` function:
```
function validatePassword(password) {
    if (password !== 'bambi') {
        return done('Password mismatch!');
    }

    return done(null);
}
```
**The code snippet below shows a full end to end check for validating a password (it’s static and must match “bambi”, my favorite cartoon character as a child):**
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
The code is commented pretty well, however, if you’re confused, the catch only executes in the event that a `reject()` is called from the promise. Since the passwords don’t match, we call `reject()`, therefore “catching” the error and sending it to the `done()` function.

## Promises 🤞
Promises provide a simpler alternative for executing, composing and managing asynchronous operations when compared to traditional callback-based approaches. They also allow you to handle asynchronous errors using approaches that are similar to synchronous try/catch.

**Promises also provide three unique states:**
1. **Pending** - the promise’s outcome hasn’t yet been determined because the asynchronous operation that will produce its result hasn’t completed yet.
2. **Fulfilled** - the asynchronous operation has completed, and the promise has a value.
3. **Rejected** - the asynchronous operation failed, and the promise will never be fulfilled. In the rejected state, a promise has a reason that indicates why the operation failed.

When a promise is pending, it can transition to the fulfilled or rejected state. Once a promise is fulfilled or rejected, however, it will never transition to any other state, and its value or failure reason will not change.

## The Downside 👎
The one thing promises don’t do is solve what is called “callback hell”, which is really just a series of nested function calls. Sure, for one call it’s okay. For many calls, your code becomes difficult, if not impossible, to read and maintain.
## Looping in Promises 🎡
To avoid deeply nested callbacks with JavaScript, one would assume that you could simply loop over the Promises, returning the results to an object or array, and it will stop when it’s done. Unfortunately, it’s not that easy; due to the asynchronous nature of JavaScript, there’s no “done” event that is called when your code is complete if you’re looping through each Promise.

The correct way to approach this type of situation is to use [Promise.all()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all). This function waits for all fulfillments (or the first rejection) before it is marked as finished.

## Error Handling 💣
Error handling with multiple nested Promise calls is like driving a car blindfolded. Good luck finding out which Promise threw the error. Your best bet is to remove the catch() method altogether and opt-in for a global error handler (and cross your fingers) like so:

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
> Note: The above two options are the only two ways to ensure that you’re catching errors. If you miss adding a catch() method, it’ll be swallowed up by the code.

## Async/Await? 🤔
Async/Await allows us to write asynchronous JavaScript that looks synchronous. In previous parts of this post, you were introduced to Promises – which were supposed to simplify asynchronous flow and avoid callback-hell – but they didn’t.
## Callback Hell? 🔥
Callback-hell is a term used to describe the following scenario:
> Note: As an example, here’s an API call that would get 4 specific users from an array.

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

Whew, that’s ugly and takes up a TON of space in the code. Async/Await is the latest and greatest thing to come to JavaScript, allowing us to not only avoid callback-hell but ensure that our code is clean and that errors are properly captured. What I find most fascinating about Async/Await is that it is built on top of Promises (non-blocking, etc.), yet allows for code to be readable and reads as if it were synchronous. This is where the power lies.

> Note: Here’s an example of the same set of API calls to retrieve 4 users from an array, in more than half the lines of code:

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
Fancy, right? 💃

And because Async/Await is built on top of Promises, you can even use `Promise.all()` with the await keyword:
```
async function fetchUsers() {
  const user1 = getUser1();
  const user2 = getUser2();
  const user3 = getUser3();

  const results = await Promise.all([user1, user2, user3]);
}
```
> Note: Async/await is slightly slower due to its synchronous nature. You should be careful when using it multiple times in a row as the await keyword stops the execution of all the code after it – exactly as it would be in synchronous code.

## How Do I Start Using Async/Await? 💻

Working with Async/Await is surprisingly easy to understand and use. In fact, it’s available natively in the latest version of Node.js and is quickly making its way to browsers. For now, if you want to use it client side, you’ll need to use [Babel](https://babeljs.io/), an easy to use and setup transpiler for the web.

### Async
Let’s start with the async keyword. It can be placed before function, like this:
```
async function returnTrue() {
  return true;
}
```
### Await
The keyword await makes JavaScript wait until that promise settles and returns its result. Here’s an example:
```
let value = await promise; // only works inside of an async function
```
### Full Example
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
## Why Is Async/Await Better? 😁
Now that we’ve gone over a lot of what Promises and Async/Await have to offer, let’s recap why we ([Stream](https://getstream.io/)) feel that Async/Await is was a superior choice for our codebase.
1. Async/Await allows for a clean and concise codebase with fewer lines of code, less typing, and fewer errors. Ultimately, it makes complicated, nested code readable again.
2. Error handling with try/catch (in one place, rather than in every call)
3. Error stacks make sense, as opposed to the ambiguous ones that you receive from Promises, which are large and make it difficult to locate where the error originated. Best of all, the error points to the function from which the error came.

## Final Thoughts 📃
I can say that Async/Await is one of the most powerful features that has been added to JavaScript in the past few years.
It took less than one day to understand the syntax and see what a mess our codebase was in that regard. It took about two days total to convert all of our Promise based code to Async/Await, which was essentially a complete rewrite – which just goes to show how little code is required when using Async/Await.
Lastly, thank you for reading this post. If you’re interested in what I do at Stream all day, you should give our [5-minute API tutorial](https://getstream.io/try-the-api/) a try – I promise it's worth it. For more awesome posts, you can also follow me on Twitter – [@nickparsons](https://twitter.com/@nickparsons).

来源:https://dev.to/nickparsons/javascript-promises-and-why-asyncawait-wins-the-battle-1g8a