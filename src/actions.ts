import { Red, NodeProperties, Node } from "node-red"
import { TwitchJsClientNode } from "./config"
// import TwitchJs from "twitch-js";
const TwitchJs = require("twitch-js")

export interface TwitchJsActionConfig extends NodeProperties {
    client: string
    topic: string
    payload: string
    auto: boolean
}
enum ActionMsgType {
    None = "None",
    Payload = "Payload",
    Topic = "Topic"
}
// these represent the methods names and the name of the nodes
export enum ActionTypes {
    connect = "connect",
    disconnect = "disconnect",
    reconnect = "reconnect",
    send = "send",
    join = "join",
    part = "part",
    broadcast = "broadcast",
    say = "say",
    whisper = "whisper"
}

function stringify(payload: any) {
    if (typeof payload === "string") {
        return payload
    } else {
        return JSON.stringify(payload)
    }
}
module.exports = function(RED: Red) {
    function registerType(actionType: ActionTypes, msgType: ActionMsgType) {
        function node(this: Node, config: TwitchJsActionConfig): void {
            RED.nodes.createNode(this, config)
            const clientNode = RED.nodes.getNode(config.client) as TwitchJsClientNode
            const chat = clientNode.twitchjs.chat
            this.on("input", (msg: any) => {
                let args: any[] = []
                if (msgType === ActionMsgType.Payload) {
                    let payload = stringify(msg.payload || config.payload)
                    args = [payload]
                } else if (msgType === ActionMsgType.Topic) {
                    let payload = stringify(msg.payload || config.payload)
                    let topic = msg.topic || config.topic
                    args = [topic, payload]
                }
                let returnValue: any = chat[actionType as string].apply(chat, args)
                Promise.resolve(returnValue)
                    .then(payload => this.send({ payload }))
                    .catch(this.error)
            })
            if (actionType === ActionTypes.join) {
                if (config.auto) {
                    chat.on(TwitchJs.ChatConstants.EVENTS.CONNECTED, () =>
                        chat.join(config.payload)
                            .then(payload => this.send({ payload }))
                            .catch(this.error)
                    )
                }
            } else if (actionType === ActionTypes.connect) {
                if (config.auto) {
                    chat.connect()
                        .then(payload => this.send({ payload }))
                        .catch(this.error)
                }
            }
        }
        RED.nodes.registerType(`twitchjs-${actionType}`, node)
    }

    registerType(ActionTypes.connect, ActionMsgType.None)
    registerType(ActionTypes.disconnect, ActionMsgType.None)
    registerType(ActionTypes.reconnect, ActionMsgType.None)
    registerType(ActionTypes.send, ActionMsgType.Payload) // raw message
    registerType(ActionTypes.join, ActionMsgType.Payload) //
    registerType(ActionTypes.part, ActionMsgType.Payload)
    registerType(ActionTypes.broadcast, ActionMsgType.Payload)
    registerType(ActionTypes.say, ActionMsgType.Topic)
    registerType(ActionTypes.whisper, ActionMsgType.Topic)
}
