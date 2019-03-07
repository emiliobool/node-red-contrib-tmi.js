import "mocha"
import { expect } from "chai"

import {
    configNode,
    outputNode,
    getNode,
    flow,
    nodes,
    describeFlow,
    execute,
    nodeInput
} from "./bootstrap.spec"

import { TwitchJsCommandConfig } from "./command"
import { actionNode } from "./actions.spec"
import { eventNode } from "./events.spec"
const TwitchJsCommand = require("./command")
const TwitchJsConfig = require("./config")
const TwitchJsActions = require("./actions")

interface TwitchJsCommandNodeSpecification extends TwitchJsCommandConfig {
    wires?: string[][]
}

export function commandNode(options = {}): TwitchJsCommandNodeSpecification {
    return Object.assign(
        {
            type: "twitchjs-command",
            client: "config",
            name: "name",
            wires: [],
            id: "command",
            channels: "",
            users: "",
            isRegular: false,
            isMod: false,
            isSub: false,
            isBroadcaster: false,
            badges: "",
            badgesType: "ANY",
            rawFilter: "",
            command: "!command",
            parseRules: ""
        } as TwitchJsCommandNodeSpecification,
        options
    )
}

describe("COMMAND", function(this: any) {
    describeFlow("Generic Command", function() {
        it("should load", async function() {
            flow(
                configNode(),
                commandNode(),
                outputNode()
            )
            execute(function() {
                getNode("command").should.have.property("name", "name")
            })
        })
        it("should not match other messages")

        // I would need a second account and a second config node,
        // not implementing this one any time soon
        it("should receive command")
        it("should not match other users")
        it("should parse message")
    })
    // more specific test could involve being mod, specific month duration, etc
    describeFlow("No User Types Selected", function() {
        // this needs 2 users
        // it("should receive command", function(done) {
        //     flow(
        //         configNode(),
        //         actionNode({
        //             id: "connect",
        //             type: "twitchjs-connect"
        //         }),
        //         actionNode({
        //             id: "join",
        //             type: "twitchjs-join",
        //             payload: "emiliobool",
        //             wires: [[ "joined" ]]
        //         }),
        //         actionNode({
        //             id: "say",
        //             type: "twitchjs-say"
        //         }),
        //         commandNode({
        //             wires: [["output"]]
        //         }),
        //         outputNode({ id: "output" }),
        //         outputNode({ id: "joined" })
        //     )
        //     execute(function() {
        //         nodeInput("output", function(msg: any) {
        //             console.log(msg)
        //             expect(msg.payload.username).to.equal("emiliobool")
        //             done()
        //         })
        //         nodeInput("joined", function(msg: any) {
        //             getNode("say").receive({
        //                 topic: "emiliobool",
        //                 payload: "!command"
        //             })
        //         })
                
        //     })
        // })
    })
    describeFlow("Channels and Users", function() {})
    describeFlow("Badges", function() {})
    describeFlow("Raw filter", function() {})
    describeFlow("Parse Rules", function() {})
})
