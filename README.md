<div align="center">
    <br/>
    <a href="https://wasteof.money/users/late"><img src="https://user-images.githubusercontent.com/78447219/174464606-7829acea-80e6-49f8-8be0-dce67e7af8f1.png" alt="Logo"/></a>
    <br/>
    <p>
        <a href="https://www.npmjs.com/package/wasteof.js"><img src="https://img.shields.io/npm/v/wasteof.js.svg?maxAge=3600" alt="npm version" /></a>
        <a href="https://www.npmjs.com/package/wasteof.js"><img src="https://img.shields.io/npm/dt/wasteof.js.svg?maxAge=3600" alt="npm downloads" /></a>
        <a href="https://github.com/Late-Is-Cool/wasteof.js/actions"><img src="https://github.com/Late-Is-Cool/wasteof.js/actions/workflows/main.yml/badge.svg" alt="Tests status" /></a>
    </p>
</div>

## about

wasteof.js is a <a href="https://nodejs.org/">node.js</a> module that allows you to react with the <a href="https://wasteof.money/">wasteof.money</a> api

- i dont know
- not complete coverage of the api (i think)
- socket.io included

## installation

**node.js version needs.. i dont know, just make sure its up to date i guess**

```sh-session
npm install wasteof.js
```

## example usage

```js
const wasteof = require("wasteof.js")
const client = new wasteof.Client()

client.on("ready", () => {
    console.log("Logged in!")
})

client.on("onMention", (mention, count) => {
    if (mention?.type === "wall_comment") {
        client.postWallComment("late", "heya!", mention.data.comment._id).catch((error) => console.log(error))
    }
})

client.login("late", "FunnyAmongus123#5812")
```