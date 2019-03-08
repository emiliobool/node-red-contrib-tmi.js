import "mocha"
import { expect } from "chai"

import {
    configNode,
    outputNode,
    getNode,
    flow,
    execute,
    describeFlow,
    nodeInput,
    CHANNEL1
} from "./bootstrap.spec"

import { TwitchJsActionConfig } from "./actions"
const TwitchJs = require("twitch-js")

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
    describeFlow("twitchjs-send -> output", function() {
        it("should send message")
    })

    describeFlow("part", function() {
        it("should part")
    })
    describeFlow("say", function() {
        it("should load", function(done){
            flow(
                configNode({
                    id: "config1"
                }),
                configNode({
                    id: "config2"
                }, 2),
                actionNode({
                    id: "say",
                    type: "twitchjs-say",
                    client: "config1",
                    wires: [["output"]]
                }),
                outputNode(),
                // eventNode({
                //     id: "event",
                //     event: "PRIVMSG",
                //     client: "config2",
                //     wires: [["event-output"]]
                // }),
                // outputNode({
                //     id: "event-output"
                // }),
            )
            execute(function() {
                getNode("say").should.have.property("name", "name")
                // done()
                Promise.all([
                    getNode("config1").twitchjs.chat.connect()
                        .then(() => getNode("config1").twitchjs.chat.join(CHANNEL1)),
                    getNode("config2").twitchjs.chat.connect()
                        .then(() => getNode("config2").twitchjs.chat.join(CHANNEL1))
                ]).finally(done)
            })
            // after(function(done){
                
            // })
        })
        it("should send message", function(done){
            nodeInput("output", function(msg: any){
                expect(msg.payload.command).to.equal("USERSTATE")
                done()
            })
            getNode("say").receive({
                topic: CHANNEL1,
                payload: "test message"
            })
        })
        it("should receive message", function(done){
            getNode("config2").twitchjs.chat.on(TwitchJs.ChatConstants.EVENTS.PRIVATE_MESSAGE, function(payload: any){
                expect(payload.message).to.equal("receive message")
                done()
            })
            getNode("config1").twitchjs.chat.say(CHANNEL1, "receive message")
        })
    })
    describe("broadcast", function() {
        it("should broadcast")
    })
    describe("whisper", function() {
        it("should whisper")
    })
})
