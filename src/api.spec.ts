import { expect } from "chai"
import "mocha"

import { configNode } from "./config.spec"
import {
    helper,
    outputNode,
    getNode,
    load,
    startServer,
    unload,
    stopServer,
    beforeAndAfter
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
    describe("GET", function(){
        beforeAndAfter()
        it("should request from configuration", done => {
            const flow = [
                configNode(),
                apiNode([["output"]], "api", "GET", "streams", {}),
                outputNode()
            ]
            load([TwitchJsAPI, TwitchJsConfig], flow, function() {
                getNode("api").should.have.property("name", "name")
                getNode("config").should.have.property("name", "name")
                getNode("output").on("input", (msg: any) => {
                    expect(msg.payload).to.have.property("streams")
                    done()
                })
                getNode("api").receive()
            })
        })
        it("should request from msg")
    })
    describe("POST", function(){
    })
    describe("PUT", function(){
    })
})
