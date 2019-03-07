export const helper = require("node-red-node-test-helper")
export const getNode = helper.getNode.bind(helper)

const TwitchJsCommand = require("./command")
const TwitchJsConfig = require("./config")
const TwitchJsActions = require("./actions")
const TwitchJsEvent = require("./events")
const TwitchJsAPI = require("./api")

import { TwitchJsClientConfig } from "./config"
import { ActionTypes } from "./actions";

require("dotenv").config()
helper.init()

let _nodes = new Set()
let _flow: any = []
let _inputEvents = new Set()

export function nodes(...nodes: any) {
    nodes.forEach((node:any) => _nodes.add(node))
}

export function flow(...flow: any) {
    _flow = flow
    for (let item of flow) {
        if (item.type === "twitchjs-event") {
            _nodes.add(TwitchJsEvent)
        } else if (item.type === "twitchjs-command") {
            _nodes.add(TwitchJsCommand)
        } else if (item.type === "twitchjs-config"){
            _nodes.add(TwitchJsConfig)
        } else if (item.type === "twitchjs-api"){
            _nodes.add(TwitchJsAPI)
        } else if (
            item.type === "twitchjs-connect" || 
            item.type === "twitchjs-disconnect" || 
            item.type === "twitchjs-reconnect" || 
            item.type === "twitchjs-send" || 
            item.type === "twitchjs-join" || 
            item.type === "twitchjs-part" || 
            item.type === "twitchjs-broadcast" || 
            item.type === "twitchjs-say" || 
            item.type === "twitchjs-whisper"
        ) {
            _nodes.add(TwitchJsActions)
        }
    }
}

export function execute(fn: any) {
    helper.load([..._nodes], _flow, fn)
}

export function describeFlow(title: string, fn: any) {
    describe(title, function() {
        before(function(done) {
            _flow = []
            _nodes.clear()
            helper.startServer(done)
        })
        after(function(done) {
            helper.unload()
            helper.stopServer(done)
        })
        afterEach(function() {
            // this could be chaned to loop through all _flow
            _inputEvents.forEach(nodeId =>
                getNode(nodeId).removeAllListeners("input")
            )
            _inputEvents.clear()
        })
        fn()
    })
}

export function nodeInput(node: string, fn: any) {
    _inputEvents.add(node)
    getNode(node).on("input", fn)
}

export function outputNode(options = {}): any {
    return Object.assign(
        {
            id: "output",
            type: "helper"
        },
        options
    )
}

export const channel1 = process.env.TWITCHJS_TEST_CHANNEL1

export function configNode(options = {}): TwitchJsClientConfig {
    return Object.assign(
        {
            id: "config",
            type: "twitchjs-config",
            name: "name",
            username: process.env.TWITCHJS_TEST_USERNAME || "",
            token: process.env.TWITCHJS_TEST_TOKEN || "",
            clientId: process.env.TWITCHJS_TEST_CLIENTID || ""
        },
        options
    )
}
