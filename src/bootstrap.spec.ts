export const helper = require("node-red-node-test-helper")
export const getNode = helper.getNode.bind(helper)

import { TwitchJsClientConfig } from "./config"

require("dotenv").config()
helper.init()

let _nodes: any = []
let _flow: any = []
let _inputEvents = new Set()

export function nodes(...nodes: any){
    _nodes = nodes
}
export function flow(...flow: any){
    _flow = flow
}

export function execute(fn: any){
    helper.load(_nodes, _flow, fn)
    _nodes = []
    _flow = []
}

export function describeFlow(title: string, fn: any){
    describe(title, function(){
        before(helper.startServer)
        after(function (done) {
            helper.unload()
            helper.stopServer(done)
        })
        afterEach(function(){
            _inputEvents.forEach((nodeId) => getNode(nodeId).removeAllListeners("input"))
            _inputEvents.clear()
        })
        fn()
    })
}

export function nodeInput(node: string, fn: any){
    _inputEvents.add(node)
    getNode(node).on("input", fn)
}

export function outputNode(): any {
    return {
        id: "output",
        type: "helper"
    }
}

export const channel1 = process.env.TWITCHJS_TEST_CHANNEL1

export function configNode(): TwitchJsClientConfig{
    return {
        id: "config",
        type: "twitchjs-config",
        name: "name",
        username: process.env.TWITCHJS_TEST_USERNAME || "",
        token: process.env.TWITCHJS_TEST_TOKEN || "",
        clientId: process.env.TWITCHJS_TEST_CLIENTID || ""
    }
}
