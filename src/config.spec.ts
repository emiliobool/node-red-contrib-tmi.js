import { TwitchJsClientConfig } from "./config"
require("dotenv").config()

export function configNode(): TwitchJsClientConfig{
    return {
        id: "config",
        type: "twitchjs-config",
        name: "name",
        username: process.env.TWITCHJS_TEST_USERNAME || "",
        token: process.env.TWITCHJS_TEST_TOKEN || "",
        clientId: process.env.TWITCHJS_TEST_CLIENTID || ""
    }
}

