// TypeScript Version: 2.3

import { ChatOptions, Chat } from "./twitch-js/Chat";
import * as ChatConstants from "./twitch-js/Chat/constants";
import { ApiOptions, Api } from "./twitch-js/Api";

export interface TwitchJsOptions {
  clientId: string;
  token: string;
  username: string;
  chat?: ChatOptions;
  api?: ApiOptions;
  log: any;
}

export default class TwitchJs {
  chat: Chat;
  chatContants: typeof ChatConstants;
  api: Api;
  static ChatConstants: typeof ChatConstants;
  constructor(opts: TwitchJsOptions);
}
