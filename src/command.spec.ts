import "mocha"
import { expect } from "chai"

import {
    configNode,
    outputNode,
    getNode,
    flow,
    nodes,
    describeFlow,
    execute
} from "./bootstrap.spec"

import { TwitchJsCommandConfig } from "./command"
const TwitchJsCommand = require("./command")
const TwitchJsConfig = require("./config")

interface TwitchJsCommandNodeSpecification extends TwitchJsCommandConfig {
    wires?: string[][]
}

function commandNode(
    wires: string[][],
    id: string,
    command = "",
    channels = "",
    users = "",
    isRegular = false,
    isMod = false,
    isSub = false,
    isBroadcaster = true,
    badges = "",
    badgesType = "AND" as TwitchJsCommandConfig["badgesType"],
    rawFilter = "",
    parseRules = ""
): TwitchJsCommandNodeSpecification {
    return {
        type: "twitchjs-command",
        client: "config",
        name: "name",
        wires,
        id,
        channels,
        users,
        isRegular,
        isMod,
        isSub,
        isBroadcaster,
        badges,
        badgesType,
        rawFilter,
        command,
        parseRules
    }
}

describe("COMMAND", function(this: any) {
    describeFlow("Generic Command", function(){
        it("should load", async function(){
            nodes(TwitchJsCommand, TwitchJsConfig)
            flow(
                configNode(),
                commandNode([["output"]], "command", "!command"),
                outputNode()
            )
            execute(function(){
                getNode("command").should.have.property("name", "name")
            })
        })
        it("should not match other messages")

        // I would need a second account and a second config node, 
        // not implementing this one any time soon
        it("should not match other users") 
        it("should parse message")
    })
    // more specific test could involve being mod, specific month duration, etc
    describeFlow("", function(){

    })
})
