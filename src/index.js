const axios = require("axios");
const { io } = require("socket.io-client");

class Client {
    constructor() {
        this.socket = io("https://api.wasteof.money/", {
            auth: {
                token: this.token,
            },
        });
    }
    login(username, password) {
        let json;
        axios({
            data: {
                username: username,
                password: password,
            },
            url: "https://api.wasteof.money/session",
            method: "post",
        }).then((response) => {
            json = response.data;
            this.token = json.token;
            this.socket.emit("updateUser", this.token);
        });
        return json;
    }
    async on(event, callback) {
        const parsedEvent = event.toLowerCase();
        if (parsedEvent === "ready") {
            let on = false;
            this.socket.on("connect", () => {
                if (!on) {
                    on = !on;
                    this.socket.emit("updateUser", this.token);
                    callback();
                }
            });
        } else if (parsedEvent === "onmention") {
            var oldCount = 0;
            let on = false
            this.socket.on("updateMessageCount", async (count) => {
                if (!on) {
                    oldCount = count 
                    on = true
                } else {
                    let mention = await this.getUnreadMessages()
                    if (oldCount < count) {
                        // let newMention = mention.unread[0].data
                        // if (newMention.comment) {
                        //     Object.assign(newMention?.comment, {
                        //         fContent: newMention?.comment?.content?.replace( /(<([^>]+)>)/ig, '')
                        //     })
                        // }
                        // if (newMention.post) {
                        //     Object.assign(newMention?.post, {
                        //         fContent: newMention?.post?.content?.replace( /(<([^>]+)>)/ig, '')
                        //     })
                        // }
                        oldCount = count;
                        callback(count = count,
                            mention = mention.unread[0]
                        );
                    }
                }
                
            });
        } else if (parsedEvent === "chatmessage") {
            this.socket.on("message", (data) => {
                callback({
                    data: data
                })
            })
        } else {
            console.error("wasteof.js >> invalid event name, current event names: " + "chatMessage, onMention, ready")
            return
        }
    }
    async getUnreadMessages(page) {
        const response = await axios({
            headers: {
                "Authorization": this.token,
            },
            url: `https://api.wasteof.money/messages/unread?page=${page}`,
            method: "get",
        });
        const json = await response.data;
        for (let i = 0; i < json.unread.length; i++) {
            let newMention = json.unread[i].data
            if (newMention.comment) {
                Object.assign(newMention?.comment, {
                    fContent: newMention?.comment?.content?.replace( /(<([^>]+)>)/ig, '')
                })
            }
            if (newMention.post) {
                Object.assign(newMention?.post, {
                    fContent: newMention?.post?.content?.replace( /(<([^>]+)>)/ig, '')
                })
            }
        }
        return json;
    }
    async getSession() {
        const response = await axios({
            headers: {
                "Authorization": this.token
            },
            url: "https://api.wasteof.money/session",
            method: "get"
        })
        const json = await response.data
        return json
    }
    async post(content, repost) {
        const response = await axios({
            headers: {
                "Authorization": this.token
            },
            data: {
                post: content,
                repost: repost
            },
            url: "https://api.wasteof.money/posts",
            method: "post"
        })
        const json = await response.data
        return json
    }
    async editPost(id, content) {
        const response = await axios({
            headers: {
                "Authorization": this.token
            },
            data: {
                post: content
            },
            url: `https://api.wasteof.money/posts/${id}`,
            method: "put"
        })
        const json = await response.data
        return json
    }
    async deletePost(id) {
        const response = await axios({
            headers: {
                "Authorization": this.token
            },
            url: `https://api.wasteof.money/posts/${id}`,
            method: "delete"
        })
        const json = await response.data
        return json
    }
    async postComment(postid, content, parent) {
        const response = await axios({
            headers: {
                "Authorization": this.token
            },
            url: `https://api.wasteof.money/posts/${postid}/comments`,
            method: "post",
            data: {
                content: content,
                parent: parent
            }
        })
        const json = await response.data
        return json
    }
    async deleteComment(id) {
        const response = await axios({
            headers: {
                "Authorization": this.token
            },
            url: `https://api.wasteof.money/comments/${id}`,
            method: "delete"
        })
        const json = await response.data
        return json
    }
    async postWallComment(user, content, parent) {
        const response = await axios({
            headers: {
                "Authorization": this.token
            },
            url: `https://api.wasteof.money/users/${user}/wall`,
            method: "post",
            data: {
                content: content,
                parent: parent
            }
        })
        const json = await response.data
        return json
    }
}

module.exports.Client = Client;
