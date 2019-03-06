export function outputNode(): any {
    return {
        id: "output",
        type: "helper"
    }
}

export const helper = require("node-red-node-test-helper")
// export const { getNode, load, unload, startServer, stopServer } = helper
helper.init()
export const getNode = helper.getNode.bind(helper)
export const load = helper.load.bind(helper)
export const unload = helper.unload.bind(helper)
export const startServer = helper.startServer.bind(helper)
export const stopServer = helper.stopServer.bind(helper)

export function beforeAndAfter(beforeCb?: any, afterCb?: any) {
    before(async function () {
        await new Promise((resolve) => startServer(resolve))
        if(beforeCb) await beforeCb()
    })
    after(async function () {
        unload()
        await new Promise((resolve) => stopServer(resolve))
        if(afterCb) await afterCb()
    })
}
