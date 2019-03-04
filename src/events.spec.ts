import { expect } from 'chai';
import 'mocha'
import { TwitchJsEventConfig } from './events';
import { Node } from 'node-red';


const helper = require("node-red-node-test-helper")
const TwitchJsEvent = require('./events')

helper.init(require.resolve('node-red'))

describe('Events Node', () => {

    beforeEach(function (done) {
        helper.startServer(done)
    });
  
    afterEach(function (done) {
        helper.unload()
        helper.stopServer(done)
    })

    it('should be loaded', (done) => {

        const flow = [{ 
            id: "n1", 
            type: "twitchjs-event", 
            name: "test name",
            client: "",
            event: "",
            filter_active: false,
            filter_type: "",
            filter_channel: "",
            filter_command: "",
            filter_message: "",
            filter_raw: "",
            filter_timestamp: "",
            filter_username: ""
        } as TwitchJsEventConfig]

        helper.load(TwitchJsEvent, flow, function () {
            var n1 = helper.getNode("n1")
            n1.should.have.property('name', 'test name')
            done()
        })

    })

})

