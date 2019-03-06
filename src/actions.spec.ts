import "mocha"
import { expect } from "chai"

import {
    configNode,
    outputNode,
    getNode,
    flow,
    nodes,
    execute,
    describeFlow,
    nodeInput,
} from "./bootstrap.spec"

import { TwitchJsActionConfig } from "./actions"
import { eventNode } from "./events.spec";
const TwitchJsActions = require("./actions")
const TwitchJsConfig = require("./config")
const TwitchJsEvents = require("./events")

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

    describeFlow("connect(), #CONNECTED", function() {
        it("should always trigger CONNECT", function(done){
            nodes(TwitchJsActions, TwitchJsConfig, TwitchJsEvents)
            flow(
                configNode(),
                actionNode([], "connect", "twitchjs-connect"),
                eventNode([["output"]], "event", "CONNECTED"),
                outputNode(),
            )
            execute(function(){
                nodeInput("output", (msg: any) => {
                    expect(msg.payload.command).to.equal("CONNECTED")
                    done()
                })
                getNode("connect").receive() 
            })
        })
        it("should auto connect")
    })

    describeFlow("reconnect, disconnect", function() {
        it("should load connect, reconnect and disconnect", function(done) {
            nodes(TwitchJsActions, TwitchJsConfig, TwitchJsEvents)
            flow(
                configNode(),
                actionNode([["reconnect"]], "connect", "twitchjs-connect"),
                actionNode([["disconnect"]], "reconnect", "twitchjs-reconnect"),
                actionNode([["output"]], "disconnect", "twitchjs-disconnect"),
                outputNode(),
            )
            execute(function() {
                getNode("connect").should.have.property("name", "name")
                getNode("reconnect").should.have.property("name", "name")
                getNode("disconnect").should.have.property("name", "name")
                nodeInput("reconnect", (msg: any) => {
                    expect(msg).to.have.property("payload")
                    expect(msg.payload.command).to.equal("CONNECTED")
                })
                nodeInput("disconnect", (msg: any) => {
                    expect(msg.payload).to.be.an("array")
                })
                nodeInput("output", (msg: any) => {
                    expect(msg).to.have.property("payload", undefined)
                    done()
                })
                getNode("connect").receive()
            })
        }).timeout(5000)
    })

    describeFlow("join", function() {
        it("should join")
        it("should autojoin")
    })
    describeFlow("part", function(){
        it("should part")
    })
    describeFlow("say", function(){
        it("should say")
    })
    describe("broadcast", function(){
        it("should broadcast")
    })
    describe("whisper", function(){
        it("should whisper")
    })
})
