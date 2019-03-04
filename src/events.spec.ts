import { expect } from "chai"
import "mocha"
import { TwitchJsEventConfig } from "./events"
import { TwitchJsClientConfig, TwitchJsClientNode } from "./config"

require('dotenv').config()

const helper = require("node-red-node-test-helper")
const TwitchJsEvent = require("./events")
const TwitchJsConfig = require("./config")

helper.init(require.resolve("node-red"))

interface TwitchJsEventNode extends TwitchJsEventConfig{
    wires: string[][]
}
describe("Events Node", () => {
    beforeEach(function(done) {
        helper.startServer(done)
    })

    afterEach(function(done) {
        helper.unload()
        helper.stopServer(done)
    })

    it("should load and connect", done => {
        const flow = [
            {
                id: "node",
                type: "twitchjs-event",
                name: "test name",
                client: "config-node",
                event: "CONNECTED",
                filter_active: false,
                filter_type: "AND",
                filter_channel: "",
                filter_command: "",
                filter_message: "",
                filter_raw: "",
                filter_timestamp: "",
                filter_username: "",
                test: "test",
                wires: [[ "output-node" ]]
            } as TwitchJsEventConfig,
            {
                id: "config-node",
                type: "twitchjs-config",
                name: "test name",
                username: process.env.TWITCHJS_TEST_USERNAME,
                token: process.env.TWITCHJS_TEST_TOKEN,
                clientId: process.env.TWITCHJS_TEST_CLIENTID
            } as TwitchJsClientConfig,
            {
                id: "output-node",
                type: "helper"
            }
        ]
        helper.load([TwitchJsEvent, TwitchJsConfig], flow, function() {
            const node: TwitchJsEventNode = helper.getNode("node")
            const configNode: TwitchJsClientNode = helper.getNode("config-node")
            const outputNode = helper.getNode("output-node")
            node.should.have.property("name", "test name")
            configNode.should.have.property("name", "test name")
            configNode.twitchjs.chat.connect()
            outputNode.on("input", (msg: any) => {
                expect(msg).to.have.property("payload")
                expect(msg).to.have.nested.property("payload.command", "CONNECTED")
                configNode.twitchjs.chat.disconnect()
                done()
            })
        })
    })
})
