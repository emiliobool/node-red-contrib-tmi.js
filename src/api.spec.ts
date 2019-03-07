import { expect } from "chai"
import "mocha"

import {
    configNode,
    outputNode,
    getNode,
    flow,
    nodes,
    execute,
    describeFlow,
    nodeInput
} from "./bootstrap.spec"

import { TwitchJsAPIConfig } from "./api"

const TwitchJsAPI = require("./api")
const TwitchJsConfig = require("./config")

interface TwitchJsAPINode extends TwitchJsAPIConfig {
    wires: string[][]
}

function apiNode(
    wires: string[][],
    id: string,
    method: string,
    topic: string,
    payload: any = {}
): TwitchJsAPINode {
    return {
        type: "twitchjs-api",
        name: "name",
        client: "config",
        id,
        method,
        topic,
        payload,
        wires
    }
}

describe("API", function(this: any) {
    describeFlow("GET", function(){
        it("should request from configuration", done => {
            flow(
                configNode(),
                apiNode([["output"]], "api", "GET", "streams", {}),
                outputNode()
            )
            execute(function() {
                getNode("api").should.have.property("name", "name")
                nodeInput("output", (msg: any) => {
                    expect(msg.payload).to.have.property("streams")
                    done()
                })
                getNode("api").receive()
            })
        })
        it("should request from msg")
    })
    describeFlow("POST", function(){

    })
    describeFlow("PUT", function(){
    })
})
