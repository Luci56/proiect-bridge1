"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var __accessCheck = (obj, member, msg) => {
  if (!member.has(obj))
    throw TypeError("Cannot " + msg);
};
var __privateGet = (obj, member, getter) => {
  __accessCheck(obj, member, "read from private field");
  return getter ? getter.call(obj) : member.get(obj);
};
var __privateAdd = (obj, member, value) => {
  if (member.has(obj))
    throw TypeError("Cannot add the same private member more than once");
  member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
};
var __privateSet = (obj, member, value, setter) => {
  __accessCheck(obj, member, "write to private field");
  setter ? setter.call(obj, value) : member.set(obj, value);
  return value;
};
var __privateWrapper = (obj, member, setter, getter) => ({
  set _(value) {
    __privateSet(obj, member, value, setter);
  },
  get _() {
    return __privateGet(obj, member, getter);
  }
});
var __privateMethod = (obj, member, method) => {
  __accessCheck(obj, member, "access private method");
  return method;
};
var websocket_client_exports = {};
__export(websocket_client_exports, {
  DEFAULT_CLIENT_OPTIONS: () => DEFAULT_CLIENT_OPTIONS,
  WebsocketClient: () => WebsocketClient,
  getWebsocketUrl: () => getWebsocketUrl
});
module.exports = __toCommonJS(websocket_client_exports);
var import_client_js = require("@open-rpc/client-js");
var _client, _subscriptions, _disconnects, _setupClient, setupClient_fn, _reconnect, reconnect_fn;
const getWebsocketUrl = (httpUrl, port) => {
  const url = new URL(httpUrl);
  url.protocol = url.protocol.replace("http", "ws");
  if (port) {
    url.port = port.toString();
  }
  return url.toString();
};
const DEFAULT_CLIENT_OPTIONS = {
  callTimeout: 3e4,
  reconnectTimeout: 3e3,
  maxReconnects: 5
};
class WebsocketClient {
  constructor(endpoint, options = DEFAULT_CLIENT_OPTIONS) {
    this.endpoint = endpoint;
    this.options = options;
    __privateAdd(this, _setupClient);
    __privateAdd(this, _reconnect);
    __privateAdd(this, _client, void 0);
    __privateAdd(this, _subscriptions, void 0);
    __privateAdd(this, _disconnects, void 0);
    if (this.endpoint.startsWith("http")) {
      this.endpoint = getWebsocketUrl(this.endpoint);
    }
    __privateSet(this, _client, null);
    __privateSet(this, _subscriptions, /* @__PURE__ */ new Map());
    __privateSet(this, _disconnects, 0);
  }
  async request(input) {
    const client = __privateMethod(this, _setupClient, setupClient_fn).call(this);
    const id = await client.request(
      { method: input.method, params: input.params },
      this.options.callTimeout
    );
    const initialId = input.initialId || id;
    __privateGet(this, _subscriptions).set(initialId, {
      ...input,
      // Always set the latest actual subscription ID:
      id,
      initialId
    });
    return async () => {
      const client2 = __privateMethod(this, _setupClient, setupClient_fn).call(this);
      const subscription = __privateGet(this, _subscriptions).get(initialId);
      if (!subscription)
        return false;
      __privateGet(this, _subscriptions).delete(initialId);
      return client2.request(
        { method: input.unsubscribe, params: [subscription.id] },
        this.options.callTimeout
      );
    };
  }
}
_client = new WeakMap();
_subscriptions = new WeakMap();
_disconnects = new WeakMap();
_setupClient = new WeakSet();
setupClient_fn = function() {
  if (__privateGet(this, _client)) {
    return __privateGet(this, _client);
  }
  const transport = new import_client_js.WebSocketTransport(this.endpoint);
  const requestManager = new import_client_js.RequestManager([transport]);
  __privateSet(this, _client, new import_client_js.Client(requestManager));
  transport.connection.addEventListener("open", () => {
    __privateSet(this, _disconnects, 0);
  });
  transport.connection.addEventListener("close", () => {
    __privateWrapper(this, _disconnects)._++;
    if (__privateGet(this, _disconnects) <= this.options.maxReconnects) {
      setTimeout(() => {
        __privateMethod(this, _reconnect, reconnect_fn).call(this);
      }, this.options.reconnectTimeout);
    }
  });
  __privateGet(this, _client).onNotification((data) => {
    const params = data.params;
    __privateGet(this, _subscriptions).forEach((subscription) => {
      if (subscription.method === data.method && params.subscription === subscription.id) {
        subscription.onMessage(params.result);
      }
    });
  });
  return __privateGet(this, _client);
};
_reconnect = new WeakSet();
reconnect_fn = function() {
  __privateGet(this, _client)?.close();
  __privateSet(this, _client, null);
  __privateGet(this, _subscriptions).forEach((subscription) => this.request(subscription));
};
//# sourceMappingURL=websocket-client.js.map
