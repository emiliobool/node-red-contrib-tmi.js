import "mocha"
import { expect } from "chai"

import { configNode } from "./config.spec"
import {
    helper,
    outputNode,
    getNode,
    load,
    startServer,
    unload,
    stopServer,
    beforeAndAfter,
} from "./bootstrap.spec"

import { TwitchJsActionConfig } from "./actions"
const TwitchJsActions = require("./actions")
const TwitchJsConfig = require("./config")

interface TwitchJsActionNodeSpecification extends TwitchJsActionConfig {
    wires?: string[][]
}

function actionNode(
    wires: string[][],
    id: string,
    type: string,
    topic = "",
    payload = "",
    auto = false
): TwitchJsActionNodeSpecification {
    return {
        id,
        type,
        topic,
        payload,
        auto,
        wires,
        name: "name",
        client: "config"
    }
}

describe("ACTIONS", function(this: any) {
    describe("connect, reconnect, disconnect", function() {
        beforeAndAfter()
        it("should load connect, reconnect and disconnect", function(done) {
            const flow = [
                configNode(),
                actionNode([["reconnect"]], "connect", "twitchjs-connect"),
                actionNode([["disconnect"]], "reconnect", "twitchjs-reconnect"),
                actionNode([["output"]], "disconnect", "twitchjs-disconnect"),
                outputNode()
            ]
            load([TwitchJsActions, TwitchJsConfig], flow, function() {
                getNode("connect").should.have.property("name", "name")
                getNode("reconnect").should.have.property("name", "name")
                getNode("disconnect").should.have.property("name", "name")
                getNode("config").should.have.property("name", "name")
                getNode("reconnect").on("input", (msg: any) => {
                    expect(msg).to.have.property("payload")
                    expect(msg.payload.command).to.equal("CONNECTED")
                })
                getNode("disconnect").on("input", (msg: any) => {
                    expect(msg.payload).to.be.an("array")
                })
                getNode("output").on("input", (msg: any) => {
                    expect(msg).to.have.property("payload", undefined)
                    done()
                })
                getNode("connect").receive()
            })
        }).timeout(5000)

        it("should trigger CONNECT")
        it("should auto connect and auto join")
    })
    describe("join", function() {
        it("should join")
    })
    describe("part", function(){
        it("should part")
    })
    describe("say", function(){
        it("should say")
    })
    describe("broadcast", function(){
        it("should broadcast")
    })
    describe("whisper", function(){
        it("should whisper")
    })
})
