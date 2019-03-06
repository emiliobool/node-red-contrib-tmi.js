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

import { TwitchJsEventConfig } from "./events"
const TwitchJsEvents = require("./events")
const TwitchJsConfig = require("./config")

interface TwitchJsEventNode extends TwitchJsEventConfig {
    wires?: string[][]
}

export function eventNode(
    wires: string[][],
    id: string,
    event: string,
    filter_active = false,
    filter_type = "AND" as TwitchJsEventNode["filter_type"],
    filter_channel = "",
    filter_command = "",
    filter_message = "",
    filter_raw = "",
    filter_timestamp = "",
    filter_username = ""
): TwitchJsEventNode {
    return {
        type: "twitchjs-event",
        name: "name",
        client: "config",
        id,
        event,
        filter_active,
        filter_type,
        filter_channel,
        filter_command,
        filter_message,
        filter_raw,
        filter_timestamp,
        filter_username,
        wires
    }
}

describe("EVENTS", function() {
    describeFlow("CONNECTED", function() {
        it("should load and receive connected event", function(done) {
            nodes(TwitchJsEvents, TwitchJsConfig)
            flow(
                configNode(),
                eventNode([["output"]], "event", "CONNECTED"),
                outputNode()
            )
            execute(function() {
                getNode("event").should.have.property("name", "name")
                getNode("config").twitchjs.chat.connect()
                getNode("output").on("input", (msg: any) => {
                    expect(msg).to.have.property("payload")
                    expect(msg.payload.command).to.equal("CONNECTED")
                    getNode("config").twitchjs.chat.disconnect()
                    done()
                })
            })
        })
    })
})
