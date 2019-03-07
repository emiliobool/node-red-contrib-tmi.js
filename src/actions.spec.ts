import "mocha"
import { expect } from "chai"

import {
    configNode,
    outputNode,
    getNode,
    flow,
    execute,
    describeFlow,
    nodeInput
} from "./bootstrap.spec"

import { TwitchJsActionConfig } from "./actions"
import { eventNode } from "./events.spec"

interface TwitchJsActionNodeSpecification extends TwitchJsActionConfig {
    wires?: string[][]
}

export function actionNode(options = {}): TwitchJsActionNodeSpecification {
    return Object.assign(
        {
            id: "action",
            type: "",
            topic: "",
            payload: "",
            auto: true,
            wires: [],
            name: "name",
            client: "config"
        } as TwitchJsActionNodeSpecification,
        options
    )
}

describe("ACTIONS", function(this: any) {

    describeFlow("twitchjs-connect(manual) -> output", function() {
        it("should load", function(done) {
            flow(
                configNode(),
                actionNode({
                    id: "connect",
                    type: "twitchjs-connect",
                    auto: false,
                    wires: [["output"]], 
                }),
                outputNode()
            )
            execute(function() {
                getNode("connect").should.have.property("name", "name") 
                done()
            })
        })
        it("should work with input", function(done) {
            nodeInput("output", (msg: any) => {
                expect(msg.payload.command).to.equal("CONNECTED")
                done()
            })
            getNode("connect").receive() 
        })
    })

    describeFlow("twitchjs-connect(auto) -> output", function() {
        it("should load & autoconnect", function(done) {
            flow(
                configNode(),
                actionNode({
                    id: "connect",
                    type: "twitchjs-connect",
                    auto: true,
                    wires: [["output"]], 
                }),
                outputNode()
            )
            execute(function() {
                nodeInput("output", (msg: any) => {
                    expect(msg.payload.command).to.equal("CONNECTED")
                    done()
                })    
            })
        })
        it("should still work with input", function(done) {
            nodeInput("output", (msg: any) => {
                expect(msg.payload.command).to.equal("CONNECTED")
                done()
            })
            getNode("connect").receive() 
        })
    })

    describeFlow("twitchjs-connect -> twitchjs-reconnect -> twitchjs-disconnect -> output", function() {
        it("should load", function(done) {
            flow(
                configNode(),
                actionNode({
                    id: "connect",
                    type: "twitchjs-connect",
                    auto: false,
                    wires: [["reconnect"]]
                }),
                actionNode({
                    id: "reconnect",
                    type: "twitchjs-reconnect",
                    wires: [["disconnect"]]
                }),
                actionNode({
                    id: "disconnect",
                    type: "twitchjs-disconnect",
                    wires: [["output"]]
                }),
                outputNode()
            )
            execute(function() {
                getNode("connect").should.have.property("name", "name")
                getNode("reconnect").should.have.property("name", "name")
                getNode("disconnect").should.have.property("name", "name")
                done()
            })
        })

        it("should output after disconnect", function(done){
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
    })

    describeFlow("join", function() {
        it("should join")
        it("should autojoin")
    })
    describeFlow("part", function() {
        it("should part")
    })
    describeFlow("say", function() {
        it("should say")
    })
    describe("broadcast", function() {
        it("should broadcast")
    })
    describe("whisper", function() {
        it("should whisper")
    })
})
