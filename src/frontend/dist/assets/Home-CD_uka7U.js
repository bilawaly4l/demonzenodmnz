var __typeError = (msg) => {
  throw TypeError(msg);
};
var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
var __privateSet = (obj, member, value, setter) => (__accessCheck(obj, member, "write to private field"), setter ? setter.call(obj, value) : member.set(obj, value), value);
var __privateMethod = (obj, member, method) => (__accessCheck(obj, member, "access private method"), method);
var _client, _currentQuery, _currentQueryInitialState, _currentResult, _currentResultState, _currentResultOptions, _currentThenable, _selectError, _selectFn, _selectResult, _lastQueryWithDefinedData, _staleTimeoutId, _refetchIntervalId, _currentRefetchInterval, _trackedProps, _QueryObserver_instances, executeFetch_fn, updateStaleTimeout_fn, computeRefetchInterval_fn, updateRefetchInterval_fn, updateTimers_fn, clearStaleTimeout_fn, clearRefetchInterval_fn, updateQuery_fn, notify_fn, _a, _client2, _currentResult2, _currentMutation, _mutateOptions, _MutationObserver_instances, updateResult_fn, notify_fn2, _b;
import { P as ProtocolError, T as TimeoutWaitingForResponseErrorCode, u as utf8ToBytes, E as ExternalError, M as MissingRootKeyErrorCode, C as Certificate, l as lookupResultToBuffer, R as RequestStatusResponseStatus, U as UnknownError, a as RequestStatusDoneNoReplyErrorCode, b as RejectError, c as CertifiedRejectErrorCode, d as UNREACHABLE_ERROR, I as InputError, e as InvalidReadStateRequestErrorCode, f as ReadRequestType, g as Principal, h as IDL, i as MissingCanisterIdErrorCode, H as HttpAgent, j as encode, Q as QueryResponseStatus, k as UncertifiedRejectErrorCode, m as isV3ResponseBody, n as isV2ResponseBody, o as UncertifiedRejectUpdateErrorCode, p as UnexpectedErrorCode, q as decode, S as Subscribable, r as pendingThenable, s as resolveEnabled, t as shallowEqualObjects, v as resolveStaleTime, w as noop, x as environmentManager, y as isValidTimeout, z as timeUntilStale, A as timeoutManager, B as focusManager, D as fetchState, F as replaceData, G as notifyManager, J as hashKey, K as getDefaultState, L as reactExports, N as shouldThrowError, O as useQueryClient, V as useInternetIdentity, W as createActorWithConfig, X as createLucideIcon, Y as jsxRuntimeExports, Z as ChevronDown, _ as Record, $ as Opt, a0 as Vec, a1 as Text, a2 as Variant, a3 as Service, a4 as Func, a5 as Int, a6 as Nat, a7 as Bool, a8 as SiBinance, a9 as Flame, aa as Users, ab as Rocket, ac as ExternalLink, ad as Shield } from "./index-CAY1Sq3U.js";
import { E as Eye } from "./eye-DhjFN5IQ.js";
import { T as TriangleAlert } from "./triangle-alert-BcdbMM-q.js";
import { C as CircleCheckBig } from "./circle-check-big-DwIltcMs.js";
import { C as CircleX } from "./circle-x-b-NvWDtT.js";
import { B as Ban } from "./ban-LT8flrl5.js";
const FIVE_MINUTES_IN_MSEC = 5 * 60 * 1e3;
function defaultStrategy() {
  return chain(conditionalDelay(once(), 1e3), backoff(1e3, 1.2), timeout(FIVE_MINUTES_IN_MSEC));
}
function once() {
  let first = true;
  return async () => {
    if (first) {
      first = false;
      return true;
    }
    return false;
  };
}
function conditionalDelay(condition, timeInMsec) {
  return async (canisterId, requestId, status) => {
    if (await condition(canisterId, requestId, status)) {
      return new Promise((resolve) => setTimeout(resolve, timeInMsec));
    }
  };
}
function timeout(timeInMsec) {
  const end = Date.now() + timeInMsec;
  return async (_canisterId, requestId, status) => {
    if (Date.now() > end) {
      throw ProtocolError.fromCode(new TimeoutWaitingForResponseErrorCode(`Request timed out after ${timeInMsec} msec`, requestId, status));
    }
  };
}
function backoff(startingThrottleInMsec, backoffFactor) {
  let currentThrottling = startingThrottleInMsec;
  return () => new Promise((resolve) => setTimeout(() => {
    currentThrottling *= backoffFactor;
    resolve();
  }, currentThrottling));
}
function chain(...strategies) {
  return async (canisterId, requestId, status) => {
    for (const a of strategies) {
      await a(canisterId, requestId, status);
    }
  };
}
const DEFAULT_POLLING_OPTIONS = {
  preSignReadStateRequest: false
};
function hasProperty(value, property) {
  return Object.prototype.hasOwnProperty.call(value, property);
}
function isObjectWithProperty(value, property) {
  return value !== null && typeof value === "object" && hasProperty(value, property);
}
function hasFunction(value, property) {
  return hasProperty(value, property) && typeof value[property] === "function";
}
function isSignedReadStateRequestWithExpiry(value) {
  return isObjectWithProperty(value, "body") && isObjectWithProperty(value.body, "content") && value.body.content.request_type === ReadRequestType.ReadState && isObjectWithProperty(value.body.content, "ingress_expiry") && typeof value.body.content.ingress_expiry === "object" && value.body.content.ingress_expiry !== null && hasFunction(value.body.content.ingress_expiry, "toHash");
}
async function pollForResponse(agent, canisterId, requestId, options = {}) {
  const path = [utf8ToBytes("request_status"), requestId];
  let state;
  let currentRequest;
  const preSignReadStateRequest = options.preSignReadStateRequest ?? false;
  if (preSignReadStateRequest) {
    currentRequest = await constructRequest({
      paths: [path],
      agent,
      pollingOptions: options
    });
    state = await agent.readState(canisterId, { paths: [path] }, void 0, currentRequest);
  } else {
    state = await agent.readState(canisterId, { paths: [path] });
  }
  if (agent.rootKey == null) {
    throw ExternalError.fromCode(new MissingRootKeyErrorCode());
  }
  const cert = await Certificate.create({
    certificate: state.certificate,
    rootKey: agent.rootKey,
    canisterId,
    blsVerify: options.blsVerify,
    agent
  });
  const maybeBuf = lookupResultToBuffer(cert.lookup_path([...path, utf8ToBytes("status")]));
  let status;
  if (typeof maybeBuf === "undefined") {
    status = RequestStatusResponseStatus.Unknown;
  } else {
    status = new TextDecoder().decode(maybeBuf);
  }
  switch (status) {
    case RequestStatusResponseStatus.Replied: {
      return {
        reply: lookupResultToBuffer(cert.lookup_path([...path, "reply"])),
        certificate: cert
      };
    }
    case RequestStatusResponseStatus.Received:
    case RequestStatusResponseStatus.Unknown:
    case RequestStatusResponseStatus.Processing: {
      const strategy = options.strategy ?? defaultStrategy();
      await strategy(canisterId, requestId, status);
      return pollForResponse(agent, canisterId, requestId, {
        ...options,
        // Pass over either the strategy already provided or the new one created above
        strategy,
        request: currentRequest
      });
    }
    case RequestStatusResponseStatus.Rejected: {
      const rejectCode = new Uint8Array(lookupResultToBuffer(cert.lookup_path([...path, "reject_code"])))[0];
      const rejectMessage = new TextDecoder().decode(lookupResultToBuffer(cert.lookup_path([...path, "reject_message"])));
      const errorCodeBuf = lookupResultToBuffer(cert.lookup_path([...path, "error_code"]));
      const errorCode = errorCodeBuf ? new TextDecoder().decode(errorCodeBuf) : void 0;
      throw RejectError.fromCode(new CertifiedRejectErrorCode(requestId, rejectCode, rejectMessage, errorCode));
    }
    case RequestStatusResponseStatus.Done:
      throw UnknownError.fromCode(new RequestStatusDoneNoReplyErrorCode(requestId));
  }
  throw UNREACHABLE_ERROR;
}
async function constructRequest(options) {
  var _a2;
  const { paths, agent, pollingOptions } = options;
  if (pollingOptions.request && isSignedReadStateRequestWithExpiry(pollingOptions.request)) {
    return pollingOptions.request;
  }
  const request = await ((_a2 = agent.createReadStateRequest) == null ? void 0 : _a2.call(agent, {
    paths
  }, void 0));
  if (!isSignedReadStateRequestWithExpiry(request)) {
    throw InputError.fromCode(new InvalidReadStateRequestErrorCode(request));
  }
  return request;
}
const metadataSymbol = Symbol.for("ic-agent-metadata");
class Actor {
  /**
   * Get the Agent class this Actor would call, or undefined if the Actor would use
   * the default agent (global.ic.agent).
   * @param actor The actor to get the agent of.
   */
  static agentOf(actor) {
    return actor[metadataSymbol].config.agent;
  }
  /**
   * Get the interface of an actor, in the form of an instance of a Service.
   * @param actor The actor to get the interface of.
   */
  static interfaceOf(actor) {
    return actor[metadataSymbol].service;
  }
  static canisterIdOf(actor) {
    return Principal.from(actor[metadataSymbol].config.canisterId);
  }
  static createActorClass(interfaceFactory, options) {
    const service = interfaceFactory({ IDL });
    class CanisterActor extends Actor {
      constructor(config) {
        if (!config.canisterId) {
          throw InputError.fromCode(new MissingCanisterIdErrorCode(config.canisterId));
        }
        const canisterId = typeof config.canisterId === "string" ? Principal.fromText(config.canisterId) : config.canisterId;
        super({
          config: {
            ...DEFAULT_ACTOR_CONFIG,
            ...config,
            canisterId
          },
          service
        });
        for (const [methodName, func] of service._fields) {
          if (options == null ? void 0 : options.httpDetails) {
            func.annotations.push(ACTOR_METHOD_WITH_HTTP_DETAILS);
          }
          if (options == null ? void 0 : options.certificate) {
            func.annotations.push(ACTOR_METHOD_WITH_CERTIFICATE);
          }
          this[methodName] = _createActorMethod(this, methodName, func, config.blsVerify);
        }
      }
    }
    return CanisterActor;
  }
  /**
   * Creates an actor with the given interface factory and configuration.
   *
   * The [`@icp-sdk/bindgen`](https://js.icp.build/bindgen/) package can be used to generate the interface factory for your canister.
   * @param interfaceFactory - the interface factory for the actor, typically generated by the [`@icp-sdk/bindgen`](https://js.icp.build/bindgen/) package
   * @param configuration - the configuration for the actor
   * @returns an actor with the given interface factory and configuration
   * @example
   * Using the interface factory generated by the [`@icp-sdk/bindgen`](https://js.icp.build/bindgen/) package:
   * ```ts
   * import { Actor, HttpAgent } from '@icp-sdk/core/agent';
   * import { Principal } from '@icp-sdk/core/principal';
   * import { idlFactory } from './api/declarations/hello-world.did';
   *
   * const canisterId = Principal.fromText('rrkah-fqaaa-aaaaa-aaaaq-cai');
   *
   * const agent = await HttpAgent.create({
   *   host: 'https://icp-api.io',
   * });
   *
   * const actor = Actor.createActor(idlFactory, {
   *   agent,
   *   canisterId,
   * });
   *
   * const response = await actor.greet('world');
   * console.log(response);
   * ```
   * @example
   * Using the `createActor` wrapper function generated by the [`@icp-sdk/bindgen`](https://js.icp.build/bindgen/) package:
   * ```ts
   * import { HttpAgent } from '@icp-sdk/core/agent';
   * import { Principal } from '@icp-sdk/core/principal';
   * import { createActor } from './api/hello-world';
   *
   * const canisterId = Principal.fromText('rrkah-fqaaa-aaaaa-aaaaq-cai');
   *
   * const agent = await HttpAgent.create({
   *   host: 'https://icp-api.io',
   * });
   *
   * const actor = createActor(canisterId, {
   *   agent,
   * });
   *
   * const response = await actor.greet('world');
   * console.log(response);
   * ```
   */
  static createActor(interfaceFactory, configuration) {
    if (!configuration.canisterId) {
      throw InputError.fromCode(new MissingCanisterIdErrorCode(configuration.canisterId));
    }
    return new (this.createActorClass(interfaceFactory))(configuration);
  }
  /**
   * Returns an actor with methods that return the http response details along with the result
   * @param interfaceFactory - the interface factory for the actor
   * @param configuration - the configuration for the actor
   * @deprecated - use createActor with actorClassOptions instead
   */
  static createActorWithHttpDetails(interfaceFactory, configuration) {
    return new (this.createActorClass(interfaceFactory, { httpDetails: true }))(configuration);
  }
  /**
   * Returns an actor with methods that return the http response details along with the result
   * @param interfaceFactory - the interface factory for the actor
   * @param configuration - the configuration for the actor
   * @param actorClassOptions - options for the actor class extended details to return with the result
   */
  static createActorWithExtendedDetails(interfaceFactory, configuration, actorClassOptions = {
    httpDetails: true,
    certificate: true
  }) {
    return new (this.createActorClass(interfaceFactory, actorClassOptions))(configuration);
  }
  constructor(metadata) {
    this[metadataSymbol] = Object.freeze(metadata);
  }
}
function decodeReturnValue(types, msg) {
  const returnValues = decode(types, msg);
  switch (returnValues.length) {
    case 0:
      return void 0;
    case 1:
      return returnValues[0];
    default:
      return returnValues;
  }
}
const DEFAULT_ACTOR_CONFIG = {
  pollingOptions: DEFAULT_POLLING_OPTIONS
};
const ACTOR_METHOD_WITH_HTTP_DETAILS = "http-details";
const ACTOR_METHOD_WITH_CERTIFICATE = "certificate";
function _createActorMethod(actor, methodName, func, blsVerify) {
  let caller;
  if (func.annotations.includes("query") || func.annotations.includes("composite_query")) {
    caller = async (options, ...args) => {
      var _a2, _b2;
      options = {
        ...options,
        ...(_b2 = (_a2 = actor[metadataSymbol].config).queryTransform) == null ? void 0 : _b2.call(_a2, methodName, args, {
          ...actor[metadataSymbol].config,
          ...options
        })
      };
      const agent = options.agent || actor[metadataSymbol].config.agent || new HttpAgent();
      const cid = Principal.from(options.canisterId || actor[metadataSymbol].config.canisterId);
      const arg = encode(func.argTypes, args);
      const result = await agent.query(cid, {
        methodName,
        arg,
        effectiveCanisterId: options.effectiveCanisterId
      });
      const httpDetails = {
        ...result.httpDetails,
        requestDetails: result.requestDetails
      };
      switch (result.status) {
        case QueryResponseStatus.Rejected: {
          const uncertifiedRejectErrorCode = new UncertifiedRejectErrorCode(result.requestId, result.reject_code, result.reject_message, result.error_code, result.signatures);
          uncertifiedRejectErrorCode.callContext = {
            canisterId: cid,
            methodName,
            httpDetails
          };
          throw RejectError.fromCode(uncertifiedRejectErrorCode);
        }
        case QueryResponseStatus.Replied:
          return func.annotations.includes(ACTOR_METHOD_WITH_HTTP_DETAILS) ? {
            httpDetails,
            result: decodeReturnValue(func.retTypes, result.reply.arg)
          } : decodeReturnValue(func.retTypes, result.reply.arg);
      }
    };
  } else {
    caller = async (options, ...args) => {
      var _a2, _b2;
      options = {
        ...options,
        ...(_b2 = (_a2 = actor[metadataSymbol].config).callTransform) == null ? void 0 : _b2.call(_a2, methodName, args, {
          ...actor[metadataSymbol].config,
          ...options
        })
      };
      const agent = options.agent || actor[metadataSymbol].config.agent || HttpAgent.createSync();
      const { canisterId, effectiveCanisterId, pollingOptions } = {
        ...DEFAULT_ACTOR_CONFIG,
        ...actor[metadataSymbol].config,
        ...options
      };
      const cid = Principal.from(canisterId);
      const ecid = effectiveCanisterId !== void 0 ? Principal.from(effectiveCanisterId) : cid;
      const arg = encode(func.argTypes, args);
      const { requestId, response, requestDetails } = await agent.call(cid, {
        methodName,
        arg,
        effectiveCanisterId: ecid,
        nonce: options.nonce
      });
      let reply;
      let certificate;
      if (isV3ResponseBody(response.body)) {
        if (agent.rootKey == null) {
          throw ExternalError.fromCode(new MissingRootKeyErrorCode());
        }
        const cert = response.body.certificate;
        certificate = await Certificate.create({
          certificate: cert,
          rootKey: agent.rootKey,
          canisterId: ecid,
          blsVerify,
          agent
        });
        const path = [utf8ToBytes("request_status"), requestId];
        const status = new TextDecoder().decode(lookupResultToBuffer(certificate.lookup_path([...path, "status"])));
        switch (status) {
          case "replied":
            reply = lookupResultToBuffer(certificate.lookup_path([...path, "reply"]));
            break;
          case "rejected": {
            const rejectCode = new Uint8Array(lookupResultToBuffer(certificate.lookup_path([...path, "reject_code"])))[0];
            const rejectMessage = new TextDecoder().decode(lookupResultToBuffer(certificate.lookup_path([...path, "reject_message"])));
            const error_code_buf = lookupResultToBuffer(certificate.lookup_path([...path, "error_code"]));
            const error_code = error_code_buf ? new TextDecoder().decode(error_code_buf) : void 0;
            const certifiedRejectErrorCode = new CertifiedRejectErrorCode(requestId, rejectCode, rejectMessage, error_code);
            certifiedRejectErrorCode.callContext = {
              canisterId: cid,
              methodName,
              httpDetails: response
            };
            throw RejectError.fromCode(certifiedRejectErrorCode);
          }
        }
      } else if (isV2ResponseBody(response.body)) {
        const { reject_code, reject_message, error_code } = response.body;
        const errorCode = new UncertifiedRejectUpdateErrorCode(requestId, reject_code, reject_message, error_code);
        errorCode.callContext = {
          canisterId: cid,
          methodName,
          httpDetails: response
        };
        throw RejectError.fromCode(errorCode);
      }
      if (response.status === 202) {
        const pollOptions = {
          ...pollingOptions,
          blsVerify
        };
        const response2 = await pollForResponse(agent, ecid, requestId, pollOptions);
        certificate = response2.certificate;
        reply = response2.reply;
      }
      const shouldIncludeHttpDetails = func.annotations.includes(ACTOR_METHOD_WITH_HTTP_DETAILS);
      const shouldIncludeCertificate = func.annotations.includes(ACTOR_METHOD_WITH_CERTIFICATE);
      const httpDetails = { ...response, requestDetails };
      if (reply !== void 0) {
        if (shouldIncludeHttpDetails && shouldIncludeCertificate) {
          return {
            httpDetails,
            certificate,
            result: decodeReturnValue(func.retTypes, reply)
          };
        } else if (shouldIncludeCertificate) {
          return {
            certificate,
            result: decodeReturnValue(func.retTypes, reply)
          };
        } else if (shouldIncludeHttpDetails) {
          return {
            httpDetails,
            result: decodeReturnValue(func.retTypes, reply)
          };
        }
        return decodeReturnValue(func.retTypes, reply);
      } else {
        const errorCode = new UnexpectedErrorCode(`Call was returned undefined. We cannot determine if the call was successful or not. Return types: [${func.retTypes.map((t) => t.display()).join(",")}].`);
        errorCode.callContext = {
          canisterId: cid,
          methodName,
          httpDetails
        };
        throw UnknownError.fromCode(errorCode);
      }
    };
  }
  const handler = (...args) => caller({}, ...args);
  handler.withOptions = (options) => (...args) => caller(options, ...args);
  return handler;
}
var QueryObserver = (_a = class extends Subscribable {
  constructor(client, options) {
    super();
    __privateAdd(this, _QueryObserver_instances);
    __privateAdd(this, _client);
    __privateAdd(this, _currentQuery);
    __privateAdd(this, _currentQueryInitialState);
    __privateAdd(this, _currentResult);
    __privateAdd(this, _currentResultState);
    __privateAdd(this, _currentResultOptions);
    __privateAdd(this, _currentThenable);
    __privateAdd(this, _selectError);
    __privateAdd(this, _selectFn);
    __privateAdd(this, _selectResult);
    // This property keeps track of the last query with defined data.
    // It will be used to pass the previous data and query to the placeholder function between renders.
    __privateAdd(this, _lastQueryWithDefinedData);
    __privateAdd(this, _staleTimeoutId);
    __privateAdd(this, _refetchIntervalId);
    __privateAdd(this, _currentRefetchInterval);
    __privateAdd(this, _trackedProps, /* @__PURE__ */ new Set());
    this.options = options;
    __privateSet(this, _client, client);
    __privateSet(this, _selectError, null);
    __privateSet(this, _currentThenable, pendingThenable());
    this.bindMethods();
    this.setOptions(options);
  }
  bindMethods() {
    this.refetch = this.refetch.bind(this);
  }
  onSubscribe() {
    if (this.listeners.size === 1) {
      __privateGet(this, _currentQuery).addObserver(this);
      if (shouldFetchOnMount(__privateGet(this, _currentQuery), this.options)) {
        __privateMethod(this, _QueryObserver_instances, executeFetch_fn).call(this);
      } else {
        this.updateResult();
      }
      __privateMethod(this, _QueryObserver_instances, updateTimers_fn).call(this);
    }
  }
  onUnsubscribe() {
    if (!this.hasListeners()) {
      this.destroy();
    }
  }
  shouldFetchOnReconnect() {
    return shouldFetchOn(
      __privateGet(this, _currentQuery),
      this.options,
      this.options.refetchOnReconnect
    );
  }
  shouldFetchOnWindowFocus() {
    return shouldFetchOn(
      __privateGet(this, _currentQuery),
      this.options,
      this.options.refetchOnWindowFocus
    );
  }
  destroy() {
    this.listeners = /* @__PURE__ */ new Set();
    __privateMethod(this, _QueryObserver_instances, clearStaleTimeout_fn).call(this);
    __privateMethod(this, _QueryObserver_instances, clearRefetchInterval_fn).call(this);
    __privateGet(this, _currentQuery).removeObserver(this);
  }
  setOptions(options) {
    const prevOptions = this.options;
    const prevQuery = __privateGet(this, _currentQuery);
    this.options = __privateGet(this, _client).defaultQueryOptions(options);
    if (this.options.enabled !== void 0 && typeof this.options.enabled !== "boolean" && typeof this.options.enabled !== "function" && typeof resolveEnabled(this.options.enabled, __privateGet(this, _currentQuery)) !== "boolean") {
      throw new Error(
        "Expected enabled to be a boolean or a callback that returns a boolean"
      );
    }
    __privateMethod(this, _QueryObserver_instances, updateQuery_fn).call(this);
    __privateGet(this, _currentQuery).setOptions(this.options);
    if (prevOptions._defaulted && !shallowEqualObjects(this.options, prevOptions)) {
      __privateGet(this, _client).getQueryCache().notify({
        type: "observerOptionsUpdated",
        query: __privateGet(this, _currentQuery),
        observer: this
      });
    }
    const mounted = this.hasListeners();
    if (mounted && shouldFetchOptionally(
      __privateGet(this, _currentQuery),
      prevQuery,
      this.options,
      prevOptions
    )) {
      __privateMethod(this, _QueryObserver_instances, executeFetch_fn).call(this);
    }
    this.updateResult();
    if (mounted && (__privateGet(this, _currentQuery) !== prevQuery || resolveEnabled(this.options.enabled, __privateGet(this, _currentQuery)) !== resolveEnabled(prevOptions.enabled, __privateGet(this, _currentQuery)) || resolveStaleTime(this.options.staleTime, __privateGet(this, _currentQuery)) !== resolveStaleTime(prevOptions.staleTime, __privateGet(this, _currentQuery)))) {
      __privateMethod(this, _QueryObserver_instances, updateStaleTimeout_fn).call(this);
    }
    const nextRefetchInterval = __privateMethod(this, _QueryObserver_instances, computeRefetchInterval_fn).call(this);
    if (mounted && (__privateGet(this, _currentQuery) !== prevQuery || resolveEnabled(this.options.enabled, __privateGet(this, _currentQuery)) !== resolveEnabled(prevOptions.enabled, __privateGet(this, _currentQuery)) || nextRefetchInterval !== __privateGet(this, _currentRefetchInterval))) {
      __privateMethod(this, _QueryObserver_instances, updateRefetchInterval_fn).call(this, nextRefetchInterval);
    }
  }
  getOptimisticResult(options) {
    const query = __privateGet(this, _client).getQueryCache().build(__privateGet(this, _client), options);
    const result = this.createResult(query, options);
    if (shouldAssignObserverCurrentProperties(this, result)) {
      __privateSet(this, _currentResult, result);
      __privateSet(this, _currentResultOptions, this.options);
      __privateSet(this, _currentResultState, __privateGet(this, _currentQuery).state);
    }
    return result;
  }
  getCurrentResult() {
    return __privateGet(this, _currentResult);
  }
  trackResult(result, onPropTracked) {
    return new Proxy(result, {
      get: (target, key) => {
        this.trackProp(key);
        onPropTracked == null ? void 0 : onPropTracked(key);
        if (key === "promise") {
          this.trackProp("data");
          if (!this.options.experimental_prefetchInRender && __privateGet(this, _currentThenable).status === "pending") {
            __privateGet(this, _currentThenable).reject(
              new Error(
                "experimental_prefetchInRender feature flag is not enabled"
              )
            );
          }
        }
        return Reflect.get(target, key);
      }
    });
  }
  trackProp(key) {
    __privateGet(this, _trackedProps).add(key);
  }
  getCurrentQuery() {
    return __privateGet(this, _currentQuery);
  }
  refetch({ ...options } = {}) {
    return this.fetch({
      ...options
    });
  }
  fetchOptimistic(options) {
    const defaultedOptions = __privateGet(this, _client).defaultQueryOptions(options);
    const query = __privateGet(this, _client).getQueryCache().build(__privateGet(this, _client), defaultedOptions);
    return query.fetch().then(() => this.createResult(query, defaultedOptions));
  }
  fetch(fetchOptions) {
    return __privateMethod(this, _QueryObserver_instances, executeFetch_fn).call(this, {
      ...fetchOptions,
      cancelRefetch: fetchOptions.cancelRefetch ?? true
    }).then(() => {
      this.updateResult();
      return __privateGet(this, _currentResult);
    });
  }
  createResult(query, options) {
    var _a2;
    const prevQuery = __privateGet(this, _currentQuery);
    const prevOptions = this.options;
    const prevResult = __privateGet(this, _currentResult);
    const prevResultState = __privateGet(this, _currentResultState);
    const prevResultOptions = __privateGet(this, _currentResultOptions);
    const queryChange = query !== prevQuery;
    const queryInitialState = queryChange ? query.state : __privateGet(this, _currentQueryInitialState);
    const { state } = query;
    let newState = { ...state };
    let isPlaceholderData = false;
    let data;
    if (options._optimisticResults) {
      const mounted = this.hasListeners();
      const fetchOnMount = !mounted && shouldFetchOnMount(query, options);
      const fetchOptionally = mounted && shouldFetchOptionally(query, prevQuery, options, prevOptions);
      if (fetchOnMount || fetchOptionally) {
        newState = {
          ...newState,
          ...fetchState(state.data, query.options)
        };
      }
      if (options._optimisticResults === "isRestoring") {
        newState.fetchStatus = "idle";
      }
    }
    let { error, errorUpdatedAt, status } = newState;
    data = newState.data;
    let skipSelect = false;
    if (options.placeholderData !== void 0 && data === void 0 && status === "pending") {
      let placeholderData;
      if ((prevResult == null ? void 0 : prevResult.isPlaceholderData) && options.placeholderData === (prevResultOptions == null ? void 0 : prevResultOptions.placeholderData)) {
        placeholderData = prevResult.data;
        skipSelect = true;
      } else {
        placeholderData = typeof options.placeholderData === "function" ? options.placeholderData(
          (_a2 = __privateGet(this, _lastQueryWithDefinedData)) == null ? void 0 : _a2.state.data,
          __privateGet(this, _lastQueryWithDefinedData)
        ) : options.placeholderData;
      }
      if (placeholderData !== void 0) {
        status = "success";
        data = replaceData(
          prevResult == null ? void 0 : prevResult.data,
          placeholderData,
          options
        );
        isPlaceholderData = true;
      }
    }
    if (options.select && data !== void 0 && !skipSelect) {
      if (prevResult && data === (prevResultState == null ? void 0 : prevResultState.data) && options.select === __privateGet(this, _selectFn)) {
        data = __privateGet(this, _selectResult);
      } else {
        try {
          __privateSet(this, _selectFn, options.select);
          data = options.select(data);
          data = replaceData(prevResult == null ? void 0 : prevResult.data, data, options);
          __privateSet(this, _selectResult, data);
          __privateSet(this, _selectError, null);
        } catch (selectError) {
          __privateSet(this, _selectError, selectError);
        }
      }
    }
    if (__privateGet(this, _selectError)) {
      error = __privateGet(this, _selectError);
      data = __privateGet(this, _selectResult);
      errorUpdatedAt = Date.now();
      status = "error";
    }
    const isFetching = newState.fetchStatus === "fetching";
    const isPending = status === "pending";
    const isError = status === "error";
    const isLoading = isPending && isFetching;
    const hasData = data !== void 0;
    const result = {
      status,
      fetchStatus: newState.fetchStatus,
      isPending,
      isSuccess: status === "success",
      isError,
      isInitialLoading: isLoading,
      isLoading,
      data,
      dataUpdatedAt: newState.dataUpdatedAt,
      error,
      errorUpdatedAt,
      failureCount: newState.fetchFailureCount,
      failureReason: newState.fetchFailureReason,
      errorUpdateCount: newState.errorUpdateCount,
      isFetched: query.isFetched(),
      isFetchedAfterMount: newState.dataUpdateCount > queryInitialState.dataUpdateCount || newState.errorUpdateCount > queryInitialState.errorUpdateCount,
      isFetching,
      isRefetching: isFetching && !isPending,
      isLoadingError: isError && !hasData,
      isPaused: newState.fetchStatus === "paused",
      isPlaceholderData,
      isRefetchError: isError && hasData,
      isStale: isStale(query, options),
      refetch: this.refetch,
      promise: __privateGet(this, _currentThenable),
      isEnabled: resolveEnabled(options.enabled, query) !== false
    };
    const nextResult = result;
    if (this.options.experimental_prefetchInRender) {
      const hasResultData = nextResult.data !== void 0;
      const isErrorWithoutData = nextResult.status === "error" && !hasResultData;
      const finalizeThenableIfPossible = (thenable) => {
        if (isErrorWithoutData) {
          thenable.reject(nextResult.error);
        } else if (hasResultData) {
          thenable.resolve(nextResult.data);
        }
      };
      const recreateThenable = () => {
        const pending = __privateSet(this, _currentThenable, nextResult.promise = pendingThenable());
        finalizeThenableIfPossible(pending);
      };
      const prevThenable = __privateGet(this, _currentThenable);
      switch (prevThenable.status) {
        case "pending":
          if (query.queryHash === prevQuery.queryHash) {
            finalizeThenableIfPossible(prevThenable);
          }
          break;
        case "fulfilled":
          if (isErrorWithoutData || nextResult.data !== prevThenable.value) {
            recreateThenable();
          }
          break;
        case "rejected":
          if (!isErrorWithoutData || nextResult.error !== prevThenable.reason) {
            recreateThenable();
          }
          break;
      }
    }
    return nextResult;
  }
  updateResult() {
    const prevResult = __privateGet(this, _currentResult);
    const nextResult = this.createResult(__privateGet(this, _currentQuery), this.options);
    __privateSet(this, _currentResultState, __privateGet(this, _currentQuery).state);
    __privateSet(this, _currentResultOptions, this.options);
    if (__privateGet(this, _currentResultState).data !== void 0) {
      __privateSet(this, _lastQueryWithDefinedData, __privateGet(this, _currentQuery));
    }
    if (shallowEqualObjects(nextResult, prevResult)) {
      return;
    }
    __privateSet(this, _currentResult, nextResult);
    const shouldNotifyListeners = () => {
      if (!prevResult) {
        return true;
      }
      const { notifyOnChangeProps } = this.options;
      const notifyOnChangePropsValue = typeof notifyOnChangeProps === "function" ? notifyOnChangeProps() : notifyOnChangeProps;
      if (notifyOnChangePropsValue === "all" || !notifyOnChangePropsValue && !__privateGet(this, _trackedProps).size) {
        return true;
      }
      const includedProps = new Set(
        notifyOnChangePropsValue ?? __privateGet(this, _trackedProps)
      );
      if (this.options.throwOnError) {
        includedProps.add("error");
      }
      return Object.keys(__privateGet(this, _currentResult)).some((key) => {
        const typedKey = key;
        const changed = __privateGet(this, _currentResult)[typedKey] !== prevResult[typedKey];
        return changed && includedProps.has(typedKey);
      });
    };
    __privateMethod(this, _QueryObserver_instances, notify_fn).call(this, { listeners: shouldNotifyListeners() });
  }
  onQueryUpdate() {
    this.updateResult();
    if (this.hasListeners()) {
      __privateMethod(this, _QueryObserver_instances, updateTimers_fn).call(this);
    }
  }
}, _client = new WeakMap(), _currentQuery = new WeakMap(), _currentQueryInitialState = new WeakMap(), _currentResult = new WeakMap(), _currentResultState = new WeakMap(), _currentResultOptions = new WeakMap(), _currentThenable = new WeakMap(), _selectError = new WeakMap(), _selectFn = new WeakMap(), _selectResult = new WeakMap(), _lastQueryWithDefinedData = new WeakMap(), _staleTimeoutId = new WeakMap(), _refetchIntervalId = new WeakMap(), _currentRefetchInterval = new WeakMap(), _trackedProps = new WeakMap(), _QueryObserver_instances = new WeakSet(), executeFetch_fn = function(fetchOptions) {
  __privateMethod(this, _QueryObserver_instances, updateQuery_fn).call(this);
  let promise = __privateGet(this, _currentQuery).fetch(
    this.options,
    fetchOptions
  );
  if (!(fetchOptions == null ? void 0 : fetchOptions.throwOnError)) {
    promise = promise.catch(noop);
  }
  return promise;
}, updateStaleTimeout_fn = function() {
  __privateMethod(this, _QueryObserver_instances, clearStaleTimeout_fn).call(this);
  const staleTime = resolveStaleTime(
    this.options.staleTime,
    __privateGet(this, _currentQuery)
  );
  if (environmentManager.isServer() || __privateGet(this, _currentResult).isStale || !isValidTimeout(staleTime)) {
    return;
  }
  const time = timeUntilStale(__privateGet(this, _currentResult).dataUpdatedAt, staleTime);
  const timeout2 = time + 1;
  __privateSet(this, _staleTimeoutId, timeoutManager.setTimeout(() => {
    if (!__privateGet(this, _currentResult).isStale) {
      this.updateResult();
    }
  }, timeout2));
}, computeRefetchInterval_fn = function() {
  return (typeof this.options.refetchInterval === "function" ? this.options.refetchInterval(__privateGet(this, _currentQuery)) : this.options.refetchInterval) ?? false;
}, updateRefetchInterval_fn = function(nextInterval) {
  __privateMethod(this, _QueryObserver_instances, clearRefetchInterval_fn).call(this);
  __privateSet(this, _currentRefetchInterval, nextInterval);
  if (environmentManager.isServer() || resolveEnabled(this.options.enabled, __privateGet(this, _currentQuery)) === false || !isValidTimeout(__privateGet(this, _currentRefetchInterval)) || __privateGet(this, _currentRefetchInterval) === 0) {
    return;
  }
  __privateSet(this, _refetchIntervalId, timeoutManager.setInterval(() => {
    if (this.options.refetchIntervalInBackground || focusManager.isFocused()) {
      __privateMethod(this, _QueryObserver_instances, executeFetch_fn).call(this);
    }
  }, __privateGet(this, _currentRefetchInterval)));
}, updateTimers_fn = function() {
  __privateMethod(this, _QueryObserver_instances, updateStaleTimeout_fn).call(this);
  __privateMethod(this, _QueryObserver_instances, updateRefetchInterval_fn).call(this, __privateMethod(this, _QueryObserver_instances, computeRefetchInterval_fn).call(this));
}, clearStaleTimeout_fn = function() {
  if (__privateGet(this, _staleTimeoutId)) {
    timeoutManager.clearTimeout(__privateGet(this, _staleTimeoutId));
    __privateSet(this, _staleTimeoutId, void 0);
  }
}, clearRefetchInterval_fn = function() {
  if (__privateGet(this, _refetchIntervalId)) {
    timeoutManager.clearInterval(__privateGet(this, _refetchIntervalId));
    __privateSet(this, _refetchIntervalId, void 0);
  }
}, updateQuery_fn = function() {
  const query = __privateGet(this, _client).getQueryCache().build(__privateGet(this, _client), this.options);
  if (query === __privateGet(this, _currentQuery)) {
    return;
  }
  const prevQuery = __privateGet(this, _currentQuery);
  __privateSet(this, _currentQuery, query);
  __privateSet(this, _currentQueryInitialState, query.state);
  if (this.hasListeners()) {
    prevQuery == null ? void 0 : prevQuery.removeObserver(this);
    query.addObserver(this);
  }
}, notify_fn = function(notifyOptions) {
  notifyManager.batch(() => {
    if (notifyOptions.listeners) {
      this.listeners.forEach((listener) => {
        listener(__privateGet(this, _currentResult));
      });
    }
    __privateGet(this, _client).getQueryCache().notify({
      query: __privateGet(this, _currentQuery),
      type: "observerResultsUpdated"
    });
  });
}, _a);
function shouldLoadOnMount(query, options) {
  return resolveEnabled(options.enabled, query) !== false && query.state.data === void 0 && !(query.state.status === "error" && options.retryOnMount === false);
}
function shouldFetchOnMount(query, options) {
  return shouldLoadOnMount(query, options) || query.state.data !== void 0 && shouldFetchOn(query, options, options.refetchOnMount);
}
function shouldFetchOn(query, options, field) {
  if (resolveEnabled(options.enabled, query) !== false && resolveStaleTime(options.staleTime, query) !== "static") {
    const value = typeof field === "function" ? field(query) : field;
    return value === "always" || value !== false && isStale(query, options);
  }
  return false;
}
function shouldFetchOptionally(query, prevQuery, options, prevOptions) {
  return (query !== prevQuery || resolveEnabled(prevOptions.enabled, query) === false) && (!options.suspense || query.state.status !== "error") && isStale(query, options);
}
function isStale(query, options) {
  return resolveEnabled(options.enabled, query) !== false && query.isStaleByTime(resolveStaleTime(options.staleTime, query));
}
function shouldAssignObserverCurrentProperties(observer, optimisticResult) {
  if (!shallowEqualObjects(observer.getCurrentResult(), optimisticResult)) {
    return true;
  }
  return false;
}
var MutationObserver = (_b = class extends Subscribable {
  constructor(client, options) {
    super();
    __privateAdd(this, _MutationObserver_instances);
    __privateAdd(this, _client2);
    __privateAdd(this, _currentResult2);
    __privateAdd(this, _currentMutation);
    __privateAdd(this, _mutateOptions);
    __privateSet(this, _client2, client);
    this.setOptions(options);
    this.bindMethods();
    __privateMethod(this, _MutationObserver_instances, updateResult_fn).call(this);
  }
  bindMethods() {
    this.mutate = this.mutate.bind(this);
    this.reset = this.reset.bind(this);
  }
  setOptions(options) {
    var _a2;
    const prevOptions = this.options;
    this.options = __privateGet(this, _client2).defaultMutationOptions(options);
    if (!shallowEqualObjects(this.options, prevOptions)) {
      __privateGet(this, _client2).getMutationCache().notify({
        type: "observerOptionsUpdated",
        mutation: __privateGet(this, _currentMutation),
        observer: this
      });
    }
    if ((prevOptions == null ? void 0 : prevOptions.mutationKey) && this.options.mutationKey && hashKey(prevOptions.mutationKey) !== hashKey(this.options.mutationKey)) {
      this.reset();
    } else if (((_a2 = __privateGet(this, _currentMutation)) == null ? void 0 : _a2.state.status) === "pending") {
      __privateGet(this, _currentMutation).setOptions(this.options);
    }
  }
  onUnsubscribe() {
    var _a2;
    if (!this.hasListeners()) {
      (_a2 = __privateGet(this, _currentMutation)) == null ? void 0 : _a2.removeObserver(this);
    }
  }
  onMutationUpdate(action) {
    __privateMethod(this, _MutationObserver_instances, updateResult_fn).call(this);
    __privateMethod(this, _MutationObserver_instances, notify_fn2).call(this, action);
  }
  getCurrentResult() {
    return __privateGet(this, _currentResult2);
  }
  reset() {
    var _a2;
    (_a2 = __privateGet(this, _currentMutation)) == null ? void 0 : _a2.removeObserver(this);
    __privateSet(this, _currentMutation, void 0);
    __privateMethod(this, _MutationObserver_instances, updateResult_fn).call(this);
    __privateMethod(this, _MutationObserver_instances, notify_fn2).call(this);
  }
  mutate(variables, options) {
    var _a2;
    __privateSet(this, _mutateOptions, options);
    (_a2 = __privateGet(this, _currentMutation)) == null ? void 0 : _a2.removeObserver(this);
    __privateSet(this, _currentMutation, __privateGet(this, _client2).getMutationCache().build(__privateGet(this, _client2), this.options));
    __privateGet(this, _currentMutation).addObserver(this);
    return __privateGet(this, _currentMutation).execute(variables);
  }
}, _client2 = new WeakMap(), _currentResult2 = new WeakMap(), _currentMutation = new WeakMap(), _mutateOptions = new WeakMap(), _MutationObserver_instances = new WeakSet(), updateResult_fn = function() {
  var _a2;
  const state = ((_a2 = __privateGet(this, _currentMutation)) == null ? void 0 : _a2.state) ?? getDefaultState();
  __privateSet(this, _currentResult2, {
    ...state,
    isPending: state.status === "pending",
    isSuccess: state.status === "success",
    isError: state.status === "error",
    isIdle: state.status === "idle",
    mutate: this.mutate,
    reset: this.reset
  });
}, notify_fn2 = function(action) {
  notifyManager.batch(() => {
    var _a2, _b2, _c, _d, _e, _f, _g, _h;
    if (__privateGet(this, _mutateOptions) && this.hasListeners()) {
      const variables = __privateGet(this, _currentResult2).variables;
      const onMutateResult = __privateGet(this, _currentResult2).context;
      const context = {
        client: __privateGet(this, _client2),
        meta: this.options.meta,
        mutationKey: this.options.mutationKey
      };
      if ((action == null ? void 0 : action.type) === "success") {
        try {
          (_b2 = (_a2 = __privateGet(this, _mutateOptions)).onSuccess) == null ? void 0 : _b2.call(
            _a2,
            action.data,
            variables,
            onMutateResult,
            context
          );
        } catch (e) {
          void Promise.reject(e);
        }
        try {
          (_d = (_c = __privateGet(this, _mutateOptions)).onSettled) == null ? void 0 : _d.call(
            _c,
            action.data,
            null,
            variables,
            onMutateResult,
            context
          );
        } catch (e) {
          void Promise.reject(e);
        }
      } else if ((action == null ? void 0 : action.type) === "error") {
        try {
          (_f = (_e = __privateGet(this, _mutateOptions)).onError) == null ? void 0 : _f.call(
            _e,
            action.error,
            variables,
            onMutateResult,
            context
          );
        } catch (e) {
          void Promise.reject(e);
        }
        try {
          (_h = (_g = __privateGet(this, _mutateOptions)).onSettled) == null ? void 0 : _h.call(
            _g,
            void 0,
            action.error,
            variables,
            onMutateResult,
            context
          );
        } catch (e) {
          void Promise.reject(e);
        }
      }
    }
    this.listeners.forEach((listener) => {
      listener(__privateGet(this, _currentResult2));
    });
  });
}, _b);
var IsRestoringContext = reactExports.createContext(false);
var useIsRestoring = () => reactExports.useContext(IsRestoringContext);
IsRestoringContext.Provider;
function createValue() {
  let isReset = false;
  return {
    clearReset: () => {
      isReset = false;
    },
    reset: () => {
      isReset = true;
    },
    isReset: () => {
      return isReset;
    }
  };
}
var QueryErrorResetBoundaryContext = reactExports.createContext(createValue());
var useQueryErrorResetBoundary = () => reactExports.useContext(QueryErrorResetBoundaryContext);
var ensurePreventErrorBoundaryRetry = (options, errorResetBoundary, query) => {
  const throwOnError = (query == null ? void 0 : query.state.error) && typeof options.throwOnError === "function" ? shouldThrowError(options.throwOnError, [query.state.error, query]) : options.throwOnError;
  if (options.suspense || options.experimental_prefetchInRender || throwOnError) {
    if (!errorResetBoundary.isReset()) {
      options.retryOnMount = false;
    }
  }
};
var useClearResetErrorBoundary = (errorResetBoundary) => {
  reactExports.useEffect(() => {
    errorResetBoundary.clearReset();
  }, [errorResetBoundary]);
};
var getHasError = ({
  result,
  errorResetBoundary,
  throwOnError,
  query,
  suspense
}) => {
  return result.isError && !errorResetBoundary.isReset() && !result.isFetching && query && (suspense && result.data === void 0 || shouldThrowError(throwOnError, [result.error, query]));
};
var ensureSuspenseTimers = (defaultedOptions) => {
  if (defaultedOptions.suspense) {
    const MIN_SUSPENSE_TIME_MS = 1e3;
    const clamp = (value) => value === "static" ? value : Math.max(value ?? MIN_SUSPENSE_TIME_MS, MIN_SUSPENSE_TIME_MS);
    const originalStaleTime = defaultedOptions.staleTime;
    defaultedOptions.staleTime = typeof originalStaleTime === "function" ? (...args) => clamp(originalStaleTime(...args)) : clamp(originalStaleTime);
    if (typeof defaultedOptions.gcTime === "number") {
      defaultedOptions.gcTime = Math.max(
        defaultedOptions.gcTime,
        MIN_SUSPENSE_TIME_MS
      );
    }
  }
};
var willFetch = (result, isRestoring) => result.isLoading && result.isFetching && !isRestoring;
var shouldSuspend = (defaultedOptions, result) => (defaultedOptions == null ? void 0 : defaultedOptions.suspense) && result.isPending;
var fetchOptimistic = (defaultedOptions, observer, errorResetBoundary) => observer.fetchOptimistic(defaultedOptions).catch(() => {
  errorResetBoundary.clearReset();
});
function useBaseQuery(options, Observer, queryClient) {
  var _a2, _b2, _c, _d;
  const isRestoring = useIsRestoring();
  const errorResetBoundary = useQueryErrorResetBoundary();
  const client = useQueryClient();
  const defaultedOptions = client.defaultQueryOptions(options);
  (_b2 = (_a2 = client.getDefaultOptions().queries) == null ? void 0 : _a2._experimental_beforeQuery) == null ? void 0 : _b2.call(
    _a2,
    defaultedOptions
  );
  const query = client.getQueryCache().get(defaultedOptions.queryHash);
  defaultedOptions._optimisticResults = isRestoring ? "isRestoring" : "optimistic";
  ensureSuspenseTimers(defaultedOptions);
  ensurePreventErrorBoundaryRetry(defaultedOptions, errorResetBoundary, query);
  useClearResetErrorBoundary(errorResetBoundary);
  const isNewCacheEntry = !client.getQueryCache().get(defaultedOptions.queryHash);
  const [observer] = reactExports.useState(
    () => new Observer(
      client,
      defaultedOptions
    )
  );
  const result = observer.getOptimisticResult(defaultedOptions);
  const shouldSubscribe = !isRestoring && options.subscribed !== false;
  reactExports.useSyncExternalStore(
    reactExports.useCallback(
      (onStoreChange) => {
        const unsubscribe = shouldSubscribe ? observer.subscribe(notifyManager.batchCalls(onStoreChange)) : noop;
        observer.updateResult();
        return unsubscribe;
      },
      [observer, shouldSubscribe]
    ),
    () => observer.getCurrentResult(),
    () => observer.getCurrentResult()
  );
  reactExports.useEffect(() => {
    observer.setOptions(defaultedOptions);
  }, [defaultedOptions, observer]);
  if (shouldSuspend(defaultedOptions, result)) {
    throw fetchOptimistic(defaultedOptions, observer, errorResetBoundary);
  }
  if (getHasError({
    result,
    errorResetBoundary,
    throwOnError: defaultedOptions.throwOnError,
    query,
    suspense: defaultedOptions.suspense
  })) {
    throw result.error;
  }
  (_d = (_c = client.getDefaultOptions().queries) == null ? void 0 : _c._experimental_afterQuery) == null ? void 0 : _d.call(
    _c,
    defaultedOptions,
    result
  );
  if (defaultedOptions.experimental_prefetchInRender && !environmentManager.isServer() && willFetch(result, isRestoring)) {
    const promise = isNewCacheEntry ? (
      // Fetch immediately on render in order to ensure `.promise` is resolved even if the component is unmounted
      fetchOptimistic(defaultedOptions, observer, errorResetBoundary)
    ) : (
      // subscribe to the "cache promise" so that we can finalize the currentThenable once data comes in
      query == null ? void 0 : query.promise
    );
    promise == null ? void 0 : promise.catch(noop).finally(() => {
      observer.updateResult();
    });
  }
  return !defaultedOptions.notifyOnChangeProps ? observer.trackResult(result) : result;
}
function useQuery(options, queryClient) {
  return useBaseQuery(options, QueryObserver);
}
function useMutation(options, queryClient) {
  const client = useQueryClient();
  const [observer] = reactExports.useState(
    () => new MutationObserver(
      client,
      options
    )
  );
  reactExports.useEffect(() => {
    observer.setOptions(options);
  }, [observer, options]);
  const result = reactExports.useSyncExternalStore(
    reactExports.useCallback(
      (onStoreChange) => observer.subscribe(notifyManager.batchCalls(onStoreChange)),
      [observer]
    ),
    () => observer.getCurrentResult(),
    () => observer.getCurrentResult()
  );
  const mutate = reactExports.useCallback(
    (variables, mutateOptions) => {
      observer.mutate(variables, mutateOptions).catch(noop);
    },
    [observer]
  );
  if (result.error && shouldThrowError(observer.options.throwOnError, [result.error])) {
    throw result.error;
  }
  return { ...result, mutate, mutateAsync: result.mutate };
}
function hasAccessControl(actor) {
  return typeof actor === "object" && actor !== null && "_initializeAccessControl" in actor;
}
const ACTOR_QUERY_KEY = "actor";
function useActor(createActor2) {
  const { identity, isAuthenticated } = useInternetIdentity();
  const queryClient = useQueryClient();
  const actorQuery = useQuery({
    queryKey: [ACTOR_QUERY_KEY, identity == null ? void 0 : identity.getPrincipal().toString()],
    queryFn: async () => {
      if (!isAuthenticated) {
        return await createActorWithConfig(createActor2);
      }
      const actorOptions = {
        agentOptions: {
          identity
        }
      };
      const actor = await createActorWithConfig(createActor2, actorOptions);
      if (hasAccessControl(actor)) {
        await actor._initializeAccessControl();
      }
      return actor;
    },
    // Only refetch when identity changes
    staleTime: Number.POSITIVE_INFINITY,
    // This will cause the actor to be recreated when the identity changes
    enabled: true
  });
  reactExports.useEffect(() => {
    if (actorQuery.data) {
      queryClient.invalidateQueries({
        predicate: (query) => {
          return !query.queryKey.includes(ACTOR_QUERY_KEY);
        }
      });
      queryClient.refetchQueries({
        predicate: (query) => {
          return !query.queryKey.includes(ACTOR_QUERY_KEY);
        }
      });
    }
  }, [actorQuery.data, queryClient]);
  return {
    actor: actorQuery.data || null,
    isFetching: actorQuery.isFetching
  };
}
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$e = [
  [
    "path",
    {
      d: "m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526",
      key: "1yiouv"
    }
  ],
  ["circle", { cx: "12", cy: "8", r: "6", key: "1vp47v" }]
];
const Award = createLucideIcon("award", __iconNode$e);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$d = [
  ["rect", { width: "20", height: "12", x: "2", y: "6", rx: "2", key: "9lu3g6" }],
  ["circle", { cx: "12", cy: "12", r: "2", key: "1c9p78" }],
  ["path", { d: "M6 12h.01M18 12h.01", key: "113zkx" }]
];
const Banknote = createLucideIcon("banknote", __iconNode$d);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$c = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["polyline", { points: "12 6 12 12 16 14", key: "68esgv" }]
];
const Clock = createLucideIcon("clock", __iconNode$c);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$b = [
  ["rect", { width: "14", height: "14", x: "8", y: "8", rx: "2", ry: "2", key: "17jyea" }],
  ["path", { d: "M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2", key: "zix9uf" }]
];
const Copy = createLucideIcon("copy", __iconNode$b);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$a = [
  [
    "path",
    {
      d: "M2.7 10.3a2.41 2.41 0 0 0 0 3.41l7.59 7.59a2.41 2.41 0 0 0 3.41 0l7.59-7.59a2.41 2.41 0 0 0 0-3.41l-7.59-7.59a2.41 2.41 0 0 0-3.41 0Z",
      key: "1f1r0c"
    }
  ]
];
const Diamond = createLucideIcon("diamond", __iconNode$a);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$9 = [
  ["path", { d: "M12 15V3", key: "m9g1x1" }],
  ["path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4", key: "ih7n3h" }],
  ["path", { d: "m7 10 5 5 5-5", key: "brsn70" }]
];
const Download = createLucideIcon("download", __iconNode$9);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$8 = [
  ["path", { d: "M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z", key: "1rqfz7" }],
  ["path", { d: "M14 2v4a2 2 0 0 0 2 2h4", key: "tnqrlb" }],
  ["path", { d: "M10 9H8", key: "b1mrlr" }],
  ["path", { d: "M16 13H8", key: "t4e002" }],
  ["path", { d: "M16 17H8", key: "z1uh3a" }]
];
const FileText = createLucideIcon("file-text", __iconNode$8);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$7 = [
  ["path", { d: "M6 3h12l4 6-10 13L2 9Z", key: "1pcd5k" }],
  ["path", { d: "M11 3 8 9l4 13 4-13-3-6", key: "1fcu3u" }],
  ["path", { d: "M2 9h20", key: "16fsjt" }]
];
const Gem = createLucideIcon("gem", __iconNode$7);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$6 = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20", key: "13o1zl" }],
  ["path", { d: "M2 12h20", key: "9i4pu4" }]
];
const Globe = createLucideIcon("globe", __iconNode$6);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$5 = [
  ["rect", { width: "18", height: "11", x: "3", y: "11", rx: "2", ry: "2", key: "1w4ew1" }],
  ["path", { d: "M7 11V7a5 5 0 0 1 10 0v4", key: "fwvmzm" }]
];
const Lock = createLucideIcon("lock", __iconNode$5);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$4 = [
  [
    "path",
    {
      d: "M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0",
      key: "1r0f0z"
    }
  ],
  ["circle", { cx: "12", cy: "10", r: "3", key: "ilqhr7" }]
];
const MapPin = createLucideIcon("map-pin", __iconNode$4);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$3 = [
  [
    "path",
    {
      d: "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",
      key: "oel41y"
    }
  ],
  ["path", { d: "m9 12 2 2 4-4", key: "dzmm74" }]
];
const ShieldCheck = createLucideIcon("shield-check", __iconNode$3);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  [
    "path",
    {
      d: "M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z",
      key: "r04s7s"
    }
  ]
];
const Star = createLucideIcon("star", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["polyline", { points: "14.5 17.5 3 6 3 3 6 3 17.5 14.5", key: "1hfsw2" }],
  ["line", { x1: "13", x2: "19", y1: "19", y2: "13", key: "1vrmhu" }],
  ["line", { x1: "16", x2: "20", y1: "16", y2: "20", key: "1bron3" }],
  ["line", { x1: "19", x2: "21", y1: "21", y2: "19", key: "13pww6" }],
  ["polyline", { points: "14.5 6.5 18 3 21 3 21 6 17.5 9.5", key: "hbey2j" }],
  ["line", { x1: "5", x2: "9", y1: "14", y2: "18", key: "1hf58s" }],
  ["line", { x1: "7", x2: "4", y1: "17", y2: "20", key: "pidxm4" }],
  ["line", { x1: "3", x2: "5", y1: "19", y2: "21", key: "1pehsh" }]
];
const Swords = createLucideIcon("swords", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M16 7h6v6", key: "box55l" }],
  ["path", { d: "m22 7-8.5 8.5-5-5L2 17", key: "1t1m79" }]
];
const TrendingUp = createLucideIcon("trending-up", __iconNode);
const AMBASSADOR = {
  handle: "@dmnz_signal",
  initials: "DS",
  title: "Community Ambassador",
  region: "Pakistan",
  joined: "November 2025",
  quote: "I spread the word about DMNZ because I believe in the mission — not for profit, but for principle. This is the first meme coin I have seen that actually treats every buyer equally. No VIP list. No presale friends. Follow @Demon_Zeno and prepare. April 2, 2027 is the real thing.",
  posts: 28
};
function AmbassadorSection() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "section",
    {
      "data-ocid": "ambassador.section",
      className: "py-20 md:py-24 scroll-anim",
      style: { background: "#0a0a0a" },
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-6xl mx-auto px-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center mb-14", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "heading-xl mb-4", children: "AMBASSADOR SPOTLIGHT" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground max-w-lg mx-auto", children: "Community members who represent DMNZ with integrity. Curated, not self-nominated." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "max-w-2xl mx-auto card-dmnz",
            style: {
              borderColor: "rgba(212,175,55,0.4)",
              borderWidth: "1px",
              position: "relative"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "absolute top-4 right-4 px-3 py-1 text-xs font-bold uppercase tracking-widest",
                  style: {
                    background: "rgba(212,175,55,0.15)",
                    border: "1px solid rgba(212,175,55,0.35)",
                    color: "#d4af37"
                  },
                  children: "Featured"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-5 mb-6", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "w-14 h-14 flex-shrink-0 flex items-center justify-center font-display font-black text-lg",
                    style: {
                      background: "rgba(212,175,55,0.12)",
                      border: "2px solid rgba(212,175,55,0.4)",
                      color: "#d4af37"
                    },
                    children: AMBASSADOR.initials
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      className: "font-display font-black text-xl mb-0.5",
                      style: { color: "#d4af37" },
                      children: AMBASSADOR.handle
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground uppercase tracking-widest", children: [
                    AMBASSADOR.title,
                    "  |  ",
                    AMBASSADOR.region
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "text-foreground text-sm leading-relaxed italic mb-6",
                  style: {
                    borderLeft: "2px solid rgba(212,175,55,0.4)",
                    paddingLeft: "1rem"
                  },
                  children: [
                    "“",
                    AMBASSADOR.quote,
                    "”"
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "flex items-center gap-6 pt-5 text-xs text-muted-foreground",
                  style: { borderTop: "1px solid rgba(255,255,255,0.08)" },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                      "Joined:",
                      " ",
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "rgba(255,255,255,0.7)" }, children: AMBASSADOR.joined })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                      "Binance Square Posts:",
                      " ",
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "rgba(255,255,255,0.7)" }, children: AMBASSADOR.posts })
                    ] })
                  ]
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-8 text-center text-xs text-muted-foreground", children: [
          "Want to be featured? Spread the word about DMNZ on Binance Square and tag",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "a",
            {
              href: "https://app.binance.com/uni-qr/cpro/Demon_Zeno?l=en&r=KGTBUDHQ&uc=app_square_share_link&us=copylink",
              target: "_blank",
              rel: "noopener noreferrer",
              className: "font-bold hover:opacity-80 transition-smooth",
              style: { color: "#d4af37" },
              children: "@Demon_Zeno"
            }
          ),
          "."
        ] })
      ] })
    }
  );
}
const FAQS = [
  {
    q: "When does DMNZ launch?",
    a: "April 2, 2027. On Blum Mini App. That date does not move."
  },
  {
    q: "How do I buy DMNZ?",
    a: "Follow @Demon_Zeno on Binance Square. Then open Blum Mini App inside Telegram, find DemonZeno DMNZ, and buy."
  },
  {
    q: "Why Blum?",
    a: "Fair-launch bonding curve. No presale, no insider access — every buyer enters at the same starting price."
  },
  {
    q: "Will there be more tokens created after launch?",
    a: "No. Supply is fixed at launch. The January 2028 burn reduces it further."
  },
  {
    q: "What happens on January 1, 2028?",
    a: "Massive buyback and permanent burn. DemonZeno sends DMNZ to a provably dead wallet — forever."
  },
  {
    q: "Can I sell DMNZ after buying?",
    a: "Yes. Through Blum, the same way you bought. No lock-up period."
  },
  {
    q: "Is DMNZ available on any other platform?",
    a: "Only Blum at launch. Any other listing before April 2, 2027 is fake — do not interact."
  },
  {
    q: "How do I know this is not a rug pull?",
    a: "Public identity. No team tokens. No presale. The creator's reputation is permanently attached. That is the accountability."
  },
  {
    q: "What is the maximum supply?",
    a: "1 billion DMNZ. The January 2028 burn permanently decreases it."
  },
  {
    q: "What if I miss the launch on April 2, 2027?",
    a: "DMNZ continues trading on Blum. But early buyers get lower bonding curve prices — missing launch means paying whatever the market has set."
  },
  {
    q: "Is DemonZeno buying DMNZ himself?",
    a: "Yes. Through the same Blum interface as everyone else, on launch day, at the same bonding curve price."
  },
  {
    q: "How do I contact DemonZeno?",
    a: "@Demon_Zeno on Binance Square only. I do not DM about investments. If someone claiming to be me contacts you privately, it is a scam."
  }
];
function FAQItem({
  faq,
  index
}) {
  const [open, setOpen] = reactExports.useState(false);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      style: {
        borderBottom: "1px solid var(--border)"
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            "data-ocid": `ask_demonzeno.faq.item.${index + 1}`,
            onClick: () => setOpen((v) => !v),
            className: "w-full flex items-center justify-between gap-4 py-4 text-left transition-colors duration-200",
            "aria-expanded": open,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: "text-sm font-bold leading-snug pr-2",
                  style: { color: "var(--foreground)" },
                  children: faq.q
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                ChevronDown,
                {
                  className: "w-4 h-4 flex-shrink-0 transition-transform duration-200",
                  style: {
                    color: open ? "var(--primary)" : "var(--muted-foreground)",
                    transform: open ? "rotate(180deg)" : "rotate(0deg)"
                  }
                }
              )
            ]
          }
        ),
        open && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "p",
          {
            className: "text-sm leading-relaxed",
            style: { color: "var(--muted-foreground)" },
            children: faq.a
          }
        ) })
      ]
    }
  );
}
function AskDemonZenoSection() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "section",
    {
      id: "faq",
      "data-ocid": "ask_demonzeno.section",
      className: "py-16 md:py-20",
      style: { background: "var(--background)" },
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto px-4 max-w-3xl", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-10", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "h2",
            {
              className: "font-display font-black text-4xl md:text-5xl tracking-tight",
              style: { color: "#FFFFFF" },
              children: "ASK DEMONZENO"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "p",
            {
              className: "text-xs font-bold uppercase tracking-widest mt-2",
              style: { color: "var(--muted-foreground)" },
              children: "Direct answers. No marketing. No spin."
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            "data-ocid": "ask_demonzeno.faq.list",
            style: {
              background: "var(--card)",
              border: "1px solid var(--border)",
              padding: "0 1.5rem"
            },
            children: FAQS.map((faq, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(FAQItem, { faq, index: i }, faq.q))
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "p",
          {
            className: "text-xs text-center mt-6",
            style: { color: "var(--muted-foreground)" },
            children: [
              "More questions?",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "a",
                {
                  href: "https://app.binance.com/uni-qr/cpro/Demon_Zeno?l=en&r=KGTBUDHQ&uc=app_square_share_link&us=copylink",
                  target: "_blank",
                  rel: "noopener noreferrer",
                  "data-ocid": "ask_demonzeno.binance.link",
                  className: "font-bold",
                  style: { color: "var(--primary)" },
                  children: "Ask on Binance Square @Demon_Zeno"
                }
              )
            ]
          }
        )
      ] })
    }
  );
}
function AuditReadinessSection() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "section",
    {
      "data-ocid": "audit.section",
      className: "py-16 md:py-20",
      style: { background: "#0a0a0a" },
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto px-4 max-w-2xl text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "inline-flex items-center gap-3 mb-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Eye,
            {
              className: "w-6 h-6",
              style: { color: "#D4AF37" },
              "aria-hidden": "true"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "h2",
            {
              className: "font-display font-black text-2xl md:text-4xl tracking-tight",
              style: { color: "#FFFFFF" },
              children: [
                "TOTAL ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "#D4AF37" }, children: "TRANSPARENCY" })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "p",
          {
            className: "font-display font-black text-base md:text-lg uppercase tracking-wide leading-relaxed mb-8",
            style: { color: "rgba(255,255,255,0.85)" },
            children: [
              "No formal audit. No hidden wallets. No anonymous team.",
              /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "#D4AF37" }, children: "Everything verifiable on-chain and on Binance Square." })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "inline-flex items-center gap-3 px-5 py-3",
            style: {
              background: "rgba(212,175,55,0.06)",
              border: "1px solid rgba(212,175,55,0.2)"
            },
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: "text-xs font-bold uppercase tracking-widest",
                style: { color: "#D4AF37" },
                children: "Commitment: Total Transparency."
              }
            )
          }
        )
      ] })
    }
  );
}
function BewareOfFakesSection() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "section",
    {
      "data-ocid": "fakes.section",
      className: "py-16 md:py-20",
      style: {
        background: "#0a0a0a",
        borderTop: "3px solid #DC143C"
      },
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto px-4 max-w-3xl", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center mb-10", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "inline-flex items-center gap-3 mb-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              TriangleAlert,
              {
                className: "w-6 h-6",
                style: { color: "#DC143C" },
                "aria-hidden": "true"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "h2",
              {
                className: "font-display font-black text-3xl md:text-5xl tracking-tight",
                style: { color: "#FFFFFF" },
                children: [
                  "BEWARE OF ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "#DC143C" }, children: "FAKES" })
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "p",
            {
              className: "text-xs uppercase tracking-widest",
              style: { color: "#606060" },
              children: "Only two sources are real."
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4 mb-8", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              "data-ocid": "fakes.real_column",
              className: "p-5",
              style: {
                background: "rgba(34,197,94,0.04)",
                border: "1px solid rgba(34,197,94,0.2)"
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "h3",
                  {
                    className: "font-display font-black text-xs uppercase tracking-widest mb-4 flex items-center gap-2",
                    style: { color: "#22c55e" },
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "w-4 h-4", "aria-hidden": "true" }),
                      "OFFICIAL"
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "flex flex-col gap-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "li",
                    {
                      "data-ocid": "fakes.real.item.1",
                      className: "flex items-center gap-2 text-sm font-bold",
                      style: { color: "#FFFFFF" },
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          CircleCheckBig,
                          {
                            className: "w-3.5 h-3.5 shrink-0",
                            style: { color: "#22c55e" }
                          }
                        ),
                        "@Demon_Zeno on Binance Square"
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "li",
                    {
                      "data-ocid": "fakes.real.item.2",
                      className: "flex items-center gap-2 text-sm font-bold",
                      style: { color: "#FFFFFF" },
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          CircleCheckBig,
                          {
                            className: "w-3.5 h-3.5 shrink-0",
                            style: { color: "#22c55e" }
                          }
                        ),
                        "DMNZ on Blum Mini App (Telegram)"
                      ]
                    }
                  )
                ] })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              "data-ocid": "fakes.fake_column",
              className: "p-5",
              style: {
                background: "rgba(220,20,60,0.04)",
                border: "1px solid rgba(220,20,60,0.2)"
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "h3",
                  {
                    className: "font-display font-black text-xs uppercase tracking-widest mb-4 flex items-center gap-2",
                    style: { color: "#DC143C" },
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "w-4 h-4", "aria-hidden": "true" }),
                      "FAKE"
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "flex flex-col gap-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "li",
                    {
                      "data-ocid": "fakes.fake.item.1",
                      className: "flex items-center gap-2 text-xs",
                      style: { color: "#606060" },
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          CircleX,
                          {
                            className: "w-3.5 h-3.5 shrink-0",
                            style: { color: "#DC143C" }
                          }
                        ),
                        "Any other account claiming to be DemonZeno"
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "li",
                    {
                      "data-ocid": "fakes.fake.item.2",
                      className: "flex items-center gap-2 text-xs",
                      style: { color: "#606060" },
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          CircleX,
                          {
                            className: "w-3.5 h-3.5 shrink-0",
                            style: { color: "#DC143C" }
                          }
                        ),
                        "Any presale or early access offer"
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "li",
                    {
                      "data-ocid": "fakes.fake.item.3",
                      className: "flex items-center gap-2 text-xs",
                      style: { color: "#606060" },
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          CircleX,
                          {
                            className: "w-3.5 h-3.5 shrink-0",
                            style: { color: "#DC143C" }
                          }
                        ),
                        "Any unofficial Telegram group selling DMNZ"
                      ]
                    }
                  )
                ] })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "a",
          {
            href: "https://app.binance.com/uni-qr/cpro/Demon_Zeno?l=en&r=KGTBUDHQ&uc=app_square_share_link&us=copylink",
            target: "_blank",
            rel: "noopener noreferrer",
            "data-ocid": "fakes.follow_button",
            className: "btn-primary inline-flex items-center gap-2 px-8 py-3 text-sm",
            children: "Follow the REAL @Demon_Zeno →"
          }
        ) })
      ] })
    }
  );
}
const POSTS = [
  {
    id: 1,
    date: "March 2025",
    content: "No presale. No allocation. Just a fair start for everyone who believes in something real."
  },
  {
    id: 2,
    date: "July 2025",
    content: "The bonding curve is the closest thing to a truly fair launch that exists in crypto. Nobody buys cheap in the dark. Everyone enters on the same curve."
  },
  {
    id: 3,
    date: "October 2025",
    content: "The January 2028 burn is a commitment to every holder who stayed through the noise."
  },
  {
    id: 4,
    date: "January 2026",
    content: "A meme coin can have conviction. April 2, 2027 is the beginning."
  },
  {
    id: 5,
    date: "March 2026",
    content: "Every early believer will be remembered. You were here before the world knew."
  }
];
function BinancePostsSection() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "section",
    {
      "data-ocid": "binance_posts.section",
      className: "py-16 md:py-20",
      style: { background: "#111111" },
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto px-4 max-w-4xl", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center mb-10", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "h2",
          {
            className: "font-display font-black text-3xl md:text-5xl tracking-tight",
            style: { color: "#FFFFFF" },
            children: [
              "FROM THE DESK OF ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "#D4AF37" }, children: "DEMONZENO" })
            ]
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: POSTS.map((post, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            "data-ocid": `binance_posts.item.${i + 1}`,
            className: "p-5",
            style: {
              background: "#0a0a0a",
              borderLeft: "3px solid #D4AF37"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "font-display font-black text-2xl mb-3 leading-none",
                  style: { color: "rgba(212,175,55,0.2)" },
                  children: "“"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "p",
                {
                  className: "text-sm font-bold leading-relaxed italic mb-4",
                  style: { color: "rgba(255,255,255,0.85)" },
                  children: post.content
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "text-xs font-bold uppercase tracking-wide",
                    style: { color: "#D4AF37" },
                    children: "@Demon_Zeno"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "text-xs uppercase tracking-widest",
                    style: { color: "#606060" },
                    children: post.date
                  }
                )
              ] })
            ]
          },
          post.id
        )) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center mt-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "a",
          {
            href: "https://app.binance.com/uni-qr/cpro/Demon_Zeno?l=en&r=KGTBUDHQ&uc=app_square_share_link&us=copylink",
            target: "_blank",
            rel: "noopener noreferrer",
            "data-ocid": "binance_posts.follow_button",
            className: "btn-primary inline-flex items-center gap-2",
            children: "View All Posts on Binance Square"
          }
        ) })
      ] })
    }
  );
}
function BondingCurveSection() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "section",
    {
      "data-ocid": "bonding_curve.section",
      className: "py-16 md:py-20",
      style: { background: "oklch(0.10 0.01 260)" },
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto px-4 max-w-4xl", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-10", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "h2",
            {
              className: "font-display font-black text-4xl md:text-5xl tracking-tight",
              style: { color: "#FFFFFF" },
              children: "THE BONDING CURVE"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "p",
            {
              className: "text-xs font-bold uppercase tracking-widest mt-2",
              style: { color: "oklch(0.62 0.16 190)" },
              children: "Buy early. Pay less. Everyone plays fair."
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid md:grid-cols-2 gap-8 items-start", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "p-6",
              style: {
                background: "oklch(0.14 0.015 260)",
                border: "1px solid oklch(0.62 0.16 190 / 0.25)"
              },
              children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "svg",
                {
                  viewBox: "0 0 320 220",
                  className: "w-full",
                  role: "img",
                  "aria-label": "Bonding curve price chart",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("defs", { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "linearGradient",
                        {
                          id: "curveGrad",
                          x1: "0%",
                          y1: "100%",
                          x2: "100%",
                          y2: "0%",
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "0%", stopColor: "oklch(0.62 0.16 190 / 0.3)" }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "100%", stopColor: "oklch(0.70 0.18 70 / 0.8)" })
                          ]
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("linearGradient", { id: "areaGrad", x1: "0%", y1: "0%", x2: "0%", y2: "100%", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "0%", stopColor: "oklch(0.62 0.16 190 / 0.20)" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "100%", stopColor: "oklch(0.62 0.16 190 / 0.02)" })
                      ] })
                    ] }),
                    [40, 80, 120, 160].map((y) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "line",
                      {
                        x1: "40",
                        y1: y,
                        x2: "300",
                        y2: y,
                        stroke: "oklch(0.25 0.01 260)",
                        strokeWidth: "1"
                      },
                      y
                    )),
                    [90, 140, 190, 240, 290].map((x) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "line",
                      {
                        x1: x,
                        y1: "10",
                        x2: x,
                        y2: "180",
                        stroke: "oklch(0.25 0.01 260)",
                        strokeWidth: "1"
                      },
                      x
                    )),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "path",
                      {
                        d: "M 40 180 Q 90 175 130 160 Q 160 145 190 120 Q 220 90 250 55 Q 270 30 290 15 L 290 180 Z",
                        fill: "url(#areaGrad)"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "path",
                      {
                        d: "M 40 180 Q 90 175 130 160 Q 160 145 190 120 Q 220 90 250 55 Q 270 30 290 15",
                        fill: "none",
                        stroke: "url(#curveGrad)",
                        strokeWidth: "3",
                        strokeLinecap: "round"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "line",
                      {
                        x1: "40",
                        y1: "180",
                        x2: "300",
                        y2: "180",
                        stroke: "oklch(0.40 0.01 260)",
                        strokeWidth: "1.5"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "line",
                      {
                        x1: "40",
                        y1: "10",
                        x2: "40",
                        y2: "180",
                        stroke: "oklch(0.40 0.01 260)",
                        strokeWidth: "1.5"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "text",
                      {
                        x: "168",
                        y: "210",
                        textAnchor: "middle",
                        fill: "oklch(0.55 0.01 260)",
                        fontSize: "10",
                        children: "Tokens Purchased →"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "text",
                      {
                        x: "18",
                        y: "100",
                        textAnchor: "middle",
                        fill: "oklch(0.55 0.01 260)",
                        fontSize: "10",
                        transform: "rotate(-90 18 100)",
                        children: "Price ↑"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "40", cy: "180", r: "4", fill: "oklch(0.62 0.16 190)" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "290", cy: "15", r: "5", fill: "oklch(0.70 0.18 70)" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "line",
                      {
                        x1: "250",
                        y1: "55",
                        x2: "250",
                        y2: "180",
                        stroke: "oklch(0.70 0.18 70 / 0.50)",
                        strokeWidth: "1.5",
                        strokeDasharray: "4,3"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("text", { x: "255", y: "175", fill: "oklch(0.70 0.18 70)", fontSize: "8", children: "Target" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("text", { x: "45", y: "175", fill: "oklch(0.62 0.16 190)", fontSize: "8", children: "Launch Price" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("text", { x: "255", y: "12", fill: "oklch(0.70 0.18 70)", fontSize: "8", children: "DEX" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("text", { x: "80", y: "145", fill: "oklch(0.62 0.16 190)", fontSize: "8", children: "Price rises as" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("text", { x: "80", y: "155", fill: "oklch(0.62 0.16 190)", fontSize: "8", children: "more DMNZ bought" })
                  ]
                }
              )
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-3", children: [
            {
              step: "01",
              title: "Launch Price",
              desc: "Starts at the fair launch price. Every participant pays the same.",
              color: "oklch(0.62 0.16 190)"
            },
            {
              step: "02",
              title: "Price Rises Automatically",
              desc: "Each buy pushes the price higher — no manual intervention.",
              color: "oklch(0.65 0.18 145)"
            },
            {
              step: "03",
              title: "January 2028 Burn",
              desc: "50% supply burn creates additional upward pressure on the curve.",
              color: "oklch(0.70 0.18 25)"
            },
            {
              step: "04",
              title: "Curve Target Hit → DEX",
              desc: "At the bonding curve target, DMNZ becomes eligible for DEX listings.",
              color: "oklch(0.70 0.18 70)"
            }
          ].map(({ step, title, desc, color }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex gap-4 p-4",
              style: {
                background: "oklch(0.14 0.012 260)",
                border: "1px solid oklch(0.22 0.01 260)"
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "w-7 h-7 flex items-center justify-center shrink-0 font-mono font-black text-xs",
                    style: { background: color, color: "oklch(0.10 0.01 260)" },
                    children: step
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-bold text-foreground text-sm mb-0.5", children: title }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: desc })
                ] })
              ]
            },
            step
          )) })
        ] })
      ] })
    }
  );
}
const TRAITS = [
  {
    number: "01",
    trait: "FEARLESS",
    color: "oklch(0.62 0.16 190)",
    colorBg: "oklch(0.62 0.16 190 / 0.08)",
    colorBorder: "oklch(0.62 0.16 190 / 0.25)",
    line: "He doesn't fear volatility. He fears only one thing — letting emotion override strategy.",
    quote: "The market is a mirror. Master your reflection before you master the chart."
  },
  {
    number: "02",
    trait: "FAIR",
    color: "oklch(0.70 0.18 70)",
    colorBg: "oklch(0.65 0.15 70 / 0.08)",
    colorBorder: "oklch(0.65 0.15 70 / 0.25)",
    line: "No presale. No team tokens. No early access. Fair is not a feature — it's the foundation.",
    quote: "In a space built on asymmetry, the most radical thing is to be genuinely fair."
  },
  {
    number: "03",
    trait: "COMMUNITY-FIRST",
    color: "oklch(0.65 0.18 145)",
    colorBg: "oklch(0.65 0.18 145 / 0.08)",
    colorBorder: "oklch(0.65 0.18 145 / 0.25)",
    line: "DMNZ belongs to every person who believed in it before it was real.",
    quote: "You don't build a movement alone. You build it by making every person feel like the reason it exists."
  }
];
function CharacterTraitsSection() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "section",
    {
      "data-ocid": "character_traits.section",
      className: "py-16 md:py-20",
      style: { background: "oklch(0.115 0.015 265)" },
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto px-4 max-w-5xl", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-10", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "h2",
          {
            className: "font-display font-black uppercase",
            style: {
              fontSize: "clamp(1.75rem, 4vw, 3rem)",
              letterSpacing: "-0.03em",
              color: "var(--foreground)"
            },
            children: [
              "THREE CORE",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "oklch(0.62 0.16 190)" }, children: "TRAITS" })
            ]
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid md:grid-cols-3 gap-4", children: TRAITS.map(
          ({ number, trait, color, colorBg, colorBorder, line, quote }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              "data-ocid": `character_traits.card.${number}`,
              className: "flex flex-col",
              style: {
                background: "oklch(0.14 0.015 260)",
                border: `1px solid ${colorBorder}`,
                borderTop: `3px solid ${color}`
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 py-5", style: { background: colorBg }, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: "font-mono text-xs",
                      style: { color: "var(--muted-foreground)" },
                      children: number
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "h3",
                    {
                      className: "font-display font-black text-2xl uppercase mt-1",
                      style: { color, letterSpacing: "-0.02em" },
                      children: trait
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 py-5 flex flex-col gap-4 flex-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "p",
                    {
                      className: "text-sm leading-snug",
                      style: { color: "var(--muted-foreground)" },
                      children: line
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "blockquote",
                    {
                      className: "border-l-2 pl-3 text-xs italic mt-auto",
                      style: {
                        borderColor: color,
                        color: "oklch(0.60 0.005 260)"
                      },
                      children: [
                        "“",
                        quote,
                        "”",
                        /* @__PURE__ */ jsxRuntimeExports.jsx("footer", { className: "mt-1 not-italic text-muted-foreground", children: "— DemonZeno" })
                      ]
                    }
                  )
                ] })
              ]
            },
            trait
          )
        ) })
      ] })
    }
  );
}
const PLEDGE_TEXT = "I believe in DMNZ. I will never FUD. I will hold with conviction.";
const RECENT_PLEDGERS = [
  { handle: "@crypto_warrior_pk", time: "2 hours ago" },
  { handle: "@blum_believer", time: "5 hours ago" },
  { handle: "@dmnz_holder_01", time: "1 day ago" },
  { handle: "@zenoarmy", time: "2 days ago" },
  { handle: "@fair_launch_only", time: "3 days ago" },
  { handle: "@hodl_demon", time: "4 days ago" }
];
function CommunityPledgeSection() {
  const [name, setName] = reactExports.useState("");
  const [pledged, setPledged] = reactExports.useState(false);
  const [error, setError] = reactExports.useState("");
  function handlePledge() {
    const trimmed = name.trim();
    if (!trimmed) {
      setError("Enter your Binance Square handle.");
      return;
    }
    setError("");
    setPledged(true);
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "section",
    {
      "data-ocid": "pledge.section",
      className: "py-16 md:py-20",
      style: { background: "#0a0a0a" },
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-6xl mx-auto px-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center mb-10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "h2",
          {
            className: "font-display font-black text-4xl md:text-5xl tracking-tight",
            style: { color: "#FFFFFF" },
            children: "THE DMNZ PLEDGE"
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-10 items-start", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              style: {
                background: "#111111",
                border: "1px solid rgba(220,20,60,0.3)",
                padding: "2rem"
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    className: "text-base font-display font-black italic leading-snug mb-6",
                    style: {
                      color: "#ffffff",
                      borderLeft: "3px solid #dc143c",
                      paddingLeft: "1rem"
                    },
                    children: [
                      "“",
                      PLEDGE_TEXT,
                      "”"
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "text-center font-display font-black text-5xl mb-1",
                    style: { color: "#dc143c" },
                    children: "847"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-center text-xs text-muted-foreground uppercase tracking-widest mb-8", children: "Pledges Taken" }),
                pledged ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    "data-ocid": "pledge.success_state",
                    className: "text-center p-4",
                    style: {
                      background: "rgba(212,175,55,0.08)",
                      border: "1px solid rgba(212,175,55,0.3)"
                    },
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "div",
                      {
                        className: "font-display font-black text-xl",
                        style: { color: "#d4af37" },
                        children: "PLEDGE TAKEN."
                      }
                    )
                  }
                ) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      type: "text",
                      "data-ocid": "pledge.input",
                      value: name,
                      onChange: (e) => setName(e.target.value),
                      onKeyDown: (e) => e.key === "Enter" && handlePledge(),
                      placeholder: "@YourHandle",
                      className: "w-full px-4 py-3 text-sm bg-transparent text-foreground placeholder:text-muted-foreground",
                      style: {
                        border: "1px solid rgba(255,255,255,0.15)",
                        outline: "none"
                      }
                    }
                  ),
                  error && /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "p",
                    {
                      "data-ocid": "pledge.field_error",
                      className: "text-xs",
                      style: { color: "#dc143c" },
                      children: error
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      "data-ocid": "pledge.submit_button",
                      onClick: handlePledge,
                      className: "w-full py-3 font-black text-sm uppercase tracking-widest transition-all duration-200",
                      style: {
                        background: "#dc143c",
                        color: "#ffffff"
                      },
                      children: "Take the Pledge"
                    }
                  )
                ] })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "h3",
              {
                className: "font-display font-black text-xs uppercase tracking-widest mb-5",
                style: { color: "rgba(255,255,255,0.4)" },
                children: "Recent Pledgers"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-2", children: RECENT_PLEDGERS.map((p, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                "data-ocid": `pledge.item.${i + 1}`,
                className: "flex items-center justify-between px-4 py-3",
                style: {
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.06)"
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: "text-sm font-bold",
                      style: { color: "#d4af37" },
                      children: p.handle
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: p.time })
                ]
              },
              p.handle
            )) })
          ] })
        ] })
      ] })
    }
  );
}
const LAUNCH_TARGET$2 = (/* @__PURE__ */ new Date("2027-04-02T00:00:00Z")).getTime();
function useCountdown() {
  const [t, setT] = reactExports.useState(() => {
    const diff = LAUNCH_TARGET$2 - Date.now();
    if (diff <= 0) return null;
    return {
      days: Math.floor(diff / 864e5),
      hours: Math.floor(diff % 864e5 / 36e5),
      minutes: Math.floor(diff % 36e5 / 6e4)
    };
  });
  reactExports.useEffect(() => {
    const id = setInterval(() => {
      const diff = LAUNCH_TARGET$2 - Date.now();
      if (diff <= 0) {
        setT(null);
        return;
      }
      setT({
        days: Math.floor(diff / 864e5),
        hours: Math.floor(diff % 864e5 / 36e5),
        minutes: Math.floor(diff % 36e5 / 6e4)
      });
    }, 6e4);
    return () => clearInterval(id);
  }, []);
  return t;
}
function ContractRevealSection() {
  const countdown = useCountdown();
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "section",
    {
      "data-ocid": "contract_reveal.section",
      className: "py-20 md:py-24 scroll-anim",
      style: { background: "#0a0a0a" },
      children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-6xl mx-auto px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "max-w-2xl mx-auto text-center",
          style: {
            border: "2px solid rgba(220,20,60,0.5)",
            padding: "3rem",
            background: "rgba(220,20,60,0.03)"
          },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "inline-block px-3 py-1 mb-6 text-xs font-bold uppercase tracking-widest",
                style: {
                  background: "rgba(220,20,60,0.15)",
                  border: "1px solid rgba(220,20,60,0.35)",
                  color: "#dc143c"
                },
                children: "Official Notice"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "heading-xl mb-6", children: "CONTRACT ADDRESS" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "font-mono text-sm px-4 py-4 mb-6 text-center",
                style: {
                  background: "rgba(255,255,255,0.04)",
                  border: "1px dashed rgba(255,255,255,0.15)",
                  color: "#a0a0a0",
                  letterSpacing: "0.15em"
                },
                children: "████████████████████████████████████████"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg font-bold mb-2", style: { color: "#ffffff" }, children: "Official DMNZ token contract address will be published on April 2, 2027" }),
            countdown ? /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-muted-foreground text-sm mb-8", children: [
              countdown.days,
              " days, ",
              countdown.hours,
              " hours,",
              " ",
              countdown.minutes,
              " minutes remaining"
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-bold mb-8", style: { color: "#dc143c" }, children: "LAUNCH HAS OCCURRED — CONTRACT NOW LIVE" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "text-sm font-bold uppercase tracking-wide p-4",
                style: {
                  background: "rgba(220,20,60,0.08)",
                  border: "1px solid rgba(220,20,60,0.25)",
                  color: "#dc143c"
                },
                children: "Do not trust any contract address posted on social media, Telegram, or any channel before this date. The only official source is this website."
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "mt-6 pt-6 text-xs text-muted-foreground",
                style: { borderTop: "1px solid rgba(255,255,255,0.08)" },
                children: "Published by @Demon_Zeno  |  Verified on Blum Mini App"
              }
            )
          ]
        }
      ) })
    }
  );
}
const CREDENTIALS = [
  "Active in crypto markets since 2018. Survived every cycle.",
  "Public identity on Binance Square. Zero anonymous posting.",
  "No paid shills. No sponsored calls. No compromised takes.",
  "DMNZ was built because every other launch was rigged."
];
function CredentialsSection() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "section",
    {
      "data-ocid": "credentials.section",
      className: "py-16 md:py-20",
      style: { background: "#0a0a0a" },
      children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "container mx-auto px-4 max-w-4xl", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-12 items-start", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "h2",
            {
              className: "font-display font-black text-3xl md:text-5xl tracking-tight mb-6",
              style: { color: "#FFFFFF" },
              children: [
                "MY ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "#D4AF37" }, children: "CREDENTIALS" })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "p",
            {
              className: "text-sm font-bold uppercase tracking-wide mb-8",
              style: { color: "#606060" },
              children: "Not anonymous. Not hiding. On record."
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "a",
            {
              href: "https://app.binance.com/uni-qr/cpro/Demon_Zeno?l=en&r=KGTBUDHQ&uc=app_square_share_link&us=copylink",
              target: "_blank",
              rel: "noopener noreferrer",
              "data-ocid": "credentials.binance_button",
              className: "btn-primary inline-flex items-center gap-2",
              children: "Verify on Binance Square"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-3", children: CREDENTIALS.map((cred, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            "data-ocid": `credentials.item.${i + 1}`,
            className: "flex items-start gap-4 p-4",
            style: {
              background: "#111111",
              borderLeft: "3px solid #D4AF37"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: "font-mono font-black text-xs mt-0.5 shrink-0",
                  style: { color: "rgba(212,175,55,0.5)" },
                  children: String(i + 1).padStart(2, "0")
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "p",
                {
                  className: "font-display font-black text-sm uppercase tracking-wide",
                  style: { color: "#FFFFFF" },
                  children: cred
                }
              )
            ]
          },
          cred
        )) })
      ] }) })
    }
  );
}
const LAUNCH_TARGET$1 = (/* @__PURE__ */ new Date("2027-04-02T00:00:00Z")).getTime();
function useDDayCountdown() {
  const [t, setT] = reactExports.useState(() => {
    const diff = LAUNCH_TARGET$1 - Date.now();
    if (diff <= 0) return null;
    return {
      days: Math.floor(diff / 864e5),
      hours: Math.floor(diff % 864e5 / 36e5),
      minutes: Math.floor(diff % 36e5 / 6e4),
      seconds: Math.floor(diff % 6e4 / 1e3)
    };
  });
  reactExports.useEffect(() => {
    const id = setInterval(() => {
      const diff = LAUNCH_TARGET$1 - Date.now();
      if (diff <= 0) {
        setT(null);
        return;
      }
      setT({
        days: Math.floor(diff / 864e5),
        hours: Math.floor(diff % 864e5 / 36e5),
        minutes: Math.floor(diff % 36e5 / 6e4),
        seconds: Math.floor(diff % 6e4 / 1e3)
      });
    }, 1e3);
    return () => clearInterval(id);
  }, []);
  return t;
}
function DDaySection() {
  const t = useDDayCountdown();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "section",
    {
      id: "dday",
      "data-ocid": "dday.section",
      className: "relative py-24 md:py-36 overflow-hidden",
      style: { background: "#080808" },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "absolute inset-0 pointer-events-none",
            style: {
              background: "radial-gradient(ellipse 60% 50% at 50% 50%, oklch(0.62 0.16 190 / 0.05) 0%, transparent 70%)"
            },
            "aria-hidden": "true"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto px-4 max-w-3xl relative z-10 text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "p",
            {
              className: "font-display font-black text-sm uppercase tracking-[0.3em] mb-6",
              style: { color: "oklch(0.55 0.22 25)" },
              children: "April 2, 2027"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "h2",
            {
              className: "font-display font-black text-7xl md:text-9xl leading-none tracking-tight mb-10",
              style: { color: "#FFFFFF" },
              children: "D‑DAY"
            }
          ),
          t === null ? /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "font-display font-black text-4xl md:text-5xl mb-12",
              style: { color: "oklch(0.62 0.16 190)" },
              children: "DMNZ IS LIVE ON BLUM"
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-4 gap-3 md:gap-5 max-w-lg mx-auto mb-12", children: [
            { label: "Days", value: t.days },
            { label: "Hours", value: t.hours },
            { label: "Mins", value: t.minutes },
            { label: "Secs", value: t.seconds }
          ].map(({ label, value }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              "data-ocid": `dday.countdown.${label.toLowerCase()}`,
              className: "flex flex-col items-center p-4 md:p-6",
              style: {
                background: "oklch(0.13 0.01 260)",
                border: "1px solid oklch(0.62 0.16 190 / 0.25)"
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "font-display font-black text-3xl md:text-5xl tabular-nums leading-none",
                    style: { color: "oklch(0.62 0.16 190)" },
                    children: String(value).padStart(2, "0")
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground uppercase tracking-widest mt-2", children: label })
              ]
            },
            label
          )) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "p",
            {
              className: "font-display font-black text-xl md:text-2xl uppercase tracking-widest mb-10",
              style: { color: "rgba(255,255,255,0.85)" },
              children: "No presale. No insiders. Just the chart."
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row gap-3 justify-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "a",
              {
                href: "https://www.binance.com/en/square/profile/@Demon_Zeno",
                target: "_blank",
                rel: "noopener noreferrer",
                "data-ocid": "dday.binance.primary_button",
                className: "inline-flex items-center justify-center gap-2 px-8 py-4 font-black text-sm uppercase tracking-widest transition-all duration-200 hover:opacity-90",
                style: {
                  background: "oklch(0.62 0.16 190)",
                  color: "oklch(0.10 0.01 260)"
                },
                children: "Follow @Demon_Zeno"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "a",
              {
                href: "https://t.me/blum",
                target: "_blank",
                rel: "noopener noreferrer",
                "data-ocid": "dday.blum.secondary_button",
                className: "inline-flex items-center justify-center gap-2 px-8 py-4 font-black text-sm uppercase tracking-widest transition-all duration-200 hover:opacity-90",
                style: {
                  background: "transparent",
                  border: "1px solid oklch(0.62 0.16 190 / 0.50)",
                  color: "oklch(0.62 0.16 190)"
                },
                children: "Open Blum Mini App"
              }
            )
          ] })
        ] })
      ]
    }
  );
}
const Timestamp = Int;
const CommunitySubmission = Record({
  "id": Nat,
  "submitterHandle": Text,
  "description": Text,
  "timestamp": Timestamp
});
const CommunityStats = Record({
  "earlyBelieverCount": Nat,
  "pledgeCount": Nat,
  "hypeCount": Nat,
  "interestCount": Nat,
  "first100Count": Nat,
  "submissionCount": Nat
});
const EarlyBeliever = Record({
  "timestamp": Timestamp,
  "handle": Text,
  "index": Nat
});
const First100Entry = Record({
  "isOG": Bool,
  "timestamp": Timestamp,
  "handle": Text,
  "position": Nat
});
const HypeMessage = Record({
  "message": Text,
  "timestamp": Timestamp,
  "handle": Text
});
const InterestEntry = Record({
  "timestamp": Timestamp,
  "handle": Text
});
const RoadmapMilestone = Record({
  "id": Text,
  "title": Text,
  "date": Opt(Text),
  "completed": Bool,
  "year": Text,
  "description": Text
});
const TokenInfo = Record({
  "ticker": Text,
  "socialLinks": Vec(Record({ "url": Text, "name": Text })),
  "name": Text,
  "launchPlatform": Text,
  "description": Text,
  "totalSupply": Text,
  "slogan": Text,
  "distribution": Text
});
const Result_3 = Variant({ "ok": EarlyBeliever, "err": Text });
const Result_2 = Variant({ "ok": First100Entry, "err": Text });
const Result_1 = Variant({ "ok": HypeMessage, "err": Text });
const Result = Variant({ "ok": InterestEntry, "err": Text });
Service({
  "getCommunityPosts": Func([], [Vec(CommunitySubmission)], ["query"]),
  "getCommunityStats": Func([], [CommunityStats], ["query"]),
  "getEarlyBelievers": Func([], [Vec(EarlyBeliever)], ["query"]),
  "getFirst100": Func([], [Vec(First100Entry)], ["query"]),
  "getHypeMessages": Func([], [Vec(HypeMessage)], ["query"]),
  "getInterestSubmissions": Func([], [Vec(InterestEntry)], ["query"]),
  "getPledgeCount": Func([], [Nat], ["query"]),
  "getRoadmap": Func([], [Vec(RoadmapMilestone)], ["query"]),
  "getTokenInfo": Func([], [TokenInfo], ["query"]),
  "submitCommunityPost": Func([Text, Text], [Bool], []),
  "submitEarlyBeliever": Func([Text], [Result_3], []),
  "submitFirst100": Func([Text], [Result_2], []),
  "submitHypeMessage": Func([Text, Text], [Result_1], []),
  "submitInterest": Func([Text], [Result], []),
  "submitPledge": Func([Text], [Nat], [])
});
const idlFactory = ({ IDL: IDL2 }) => {
  const Timestamp2 = IDL2.Int;
  const CommunitySubmission2 = IDL2.Record({
    "id": IDL2.Nat,
    "submitterHandle": IDL2.Text,
    "description": IDL2.Text,
    "timestamp": Timestamp2
  });
  const CommunityStats2 = IDL2.Record({
    "earlyBelieverCount": IDL2.Nat,
    "pledgeCount": IDL2.Nat,
    "hypeCount": IDL2.Nat,
    "interestCount": IDL2.Nat,
    "first100Count": IDL2.Nat,
    "submissionCount": IDL2.Nat
  });
  const EarlyBeliever2 = IDL2.Record({
    "timestamp": Timestamp2,
    "handle": IDL2.Text,
    "index": IDL2.Nat
  });
  const First100Entry2 = IDL2.Record({
    "isOG": IDL2.Bool,
    "timestamp": Timestamp2,
    "handle": IDL2.Text,
    "position": IDL2.Nat
  });
  const HypeMessage2 = IDL2.Record({
    "message": IDL2.Text,
    "timestamp": Timestamp2,
    "handle": IDL2.Text
  });
  const InterestEntry2 = IDL2.Record({
    "timestamp": Timestamp2,
    "handle": IDL2.Text
  });
  const RoadmapMilestone2 = IDL2.Record({
    "id": IDL2.Text,
    "title": IDL2.Text,
    "date": IDL2.Opt(IDL2.Text),
    "completed": IDL2.Bool,
    "year": IDL2.Text,
    "description": IDL2.Text
  });
  const TokenInfo2 = IDL2.Record({
    "ticker": IDL2.Text,
    "socialLinks": IDL2.Vec(
      IDL2.Record({ "url": IDL2.Text, "name": IDL2.Text })
    ),
    "name": IDL2.Text,
    "launchPlatform": IDL2.Text,
    "description": IDL2.Text,
    "totalSupply": IDL2.Text,
    "slogan": IDL2.Text,
    "distribution": IDL2.Text
  });
  const Result_32 = IDL2.Variant({ "ok": EarlyBeliever2, "err": IDL2.Text });
  const Result_22 = IDL2.Variant({ "ok": First100Entry2, "err": IDL2.Text });
  const Result_12 = IDL2.Variant({ "ok": HypeMessage2, "err": IDL2.Text });
  const Result2 = IDL2.Variant({ "ok": InterestEntry2, "err": IDL2.Text });
  return IDL2.Service({
    "getCommunityPosts": IDL2.Func(
      [],
      [IDL2.Vec(CommunitySubmission2)],
      ["query"]
    ),
    "getCommunityStats": IDL2.Func([], [CommunityStats2], ["query"]),
    "getEarlyBelievers": IDL2.Func([], [IDL2.Vec(EarlyBeliever2)], ["query"]),
    "getFirst100": IDL2.Func([], [IDL2.Vec(First100Entry2)], ["query"]),
    "getHypeMessages": IDL2.Func([], [IDL2.Vec(HypeMessage2)], ["query"]),
    "getInterestSubmissions": IDL2.Func(
      [],
      [IDL2.Vec(InterestEntry2)],
      ["query"]
    ),
    "getPledgeCount": IDL2.Func([], [IDL2.Nat], ["query"]),
    "getRoadmap": IDL2.Func([], [IDL2.Vec(RoadmapMilestone2)], ["query"]),
    "getTokenInfo": IDL2.Func([], [TokenInfo2], ["query"]),
    "submitCommunityPost": IDL2.Func([IDL2.Text, IDL2.Text], [IDL2.Bool], []),
    "submitEarlyBeliever": IDL2.Func([IDL2.Text], [Result_32], []),
    "submitFirst100": IDL2.Func([IDL2.Text], [Result_22], []),
    "submitHypeMessage": IDL2.Func([IDL2.Text, IDL2.Text], [Result_12], []),
    "submitInterest": IDL2.Func([IDL2.Text], [Result2], []),
    "submitPledge": IDL2.Func([IDL2.Text], [IDL2.Nat], [])
  });
};
function record_opt_to_undefined(arg) {
  return arg == null ? void 0 : arg;
}
class Backend {
  constructor(actor, _uploadFile, _downloadFile, processError) {
    this.actor = actor;
    this._uploadFile = _uploadFile;
    this._downloadFile = _downloadFile;
    this.processError = processError;
  }
  async getCommunityPosts() {
    if (this.processError) {
      try {
        const result = await this.actor.getCommunityPosts();
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getCommunityPosts();
      return result;
    }
  }
  async getCommunityStats() {
    if (this.processError) {
      try {
        const result = await this.actor.getCommunityStats();
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getCommunityStats();
      return result;
    }
  }
  async getEarlyBelievers() {
    if (this.processError) {
      try {
        const result = await this.actor.getEarlyBelievers();
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getEarlyBelievers();
      return result;
    }
  }
  async getFirst100() {
    if (this.processError) {
      try {
        const result = await this.actor.getFirst100();
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getFirst100();
      return result;
    }
  }
  async getHypeMessages() {
    if (this.processError) {
      try {
        const result = await this.actor.getHypeMessages();
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getHypeMessages();
      return result;
    }
  }
  async getInterestSubmissions() {
    if (this.processError) {
      try {
        const result = await this.actor.getInterestSubmissions();
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getInterestSubmissions();
      return result;
    }
  }
  async getPledgeCount() {
    if (this.processError) {
      try {
        const result = await this.actor.getPledgeCount();
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getPledgeCount();
      return result;
    }
  }
  async getRoadmap() {
    if (this.processError) {
      try {
        const result = await this.actor.getRoadmap();
        return from_candid_vec_n1(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getRoadmap();
      return from_candid_vec_n1(this._uploadFile, this._downloadFile, result);
    }
  }
  async getTokenInfo() {
    if (this.processError) {
      try {
        const result = await this.actor.getTokenInfo();
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getTokenInfo();
      return result;
    }
  }
  async submitCommunityPost(arg0, arg1) {
    if (this.processError) {
      try {
        const result = await this.actor.submitCommunityPost(arg0, arg1);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.submitCommunityPost(arg0, arg1);
      return result;
    }
  }
  async submitEarlyBeliever(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.submitEarlyBeliever(arg0);
        return from_candid_Result_3_n5(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.submitEarlyBeliever(arg0);
      return from_candid_Result_3_n5(this._uploadFile, this._downloadFile, result);
    }
  }
  async submitFirst100(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.submitFirst100(arg0);
        return from_candid_Result_2_n7(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.submitFirst100(arg0);
      return from_candid_Result_2_n7(this._uploadFile, this._downloadFile, result);
    }
  }
  async submitHypeMessage(arg0, arg1) {
    if (this.processError) {
      try {
        const result = await this.actor.submitHypeMessage(arg0, arg1);
        return from_candid_Result_1_n9(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.submitHypeMessage(arg0, arg1);
      return from_candid_Result_1_n9(this._uploadFile, this._downloadFile, result);
    }
  }
  async submitInterest(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.submitInterest(arg0);
        return from_candid_Result_n11(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.submitInterest(arg0);
      return from_candid_Result_n11(this._uploadFile, this._downloadFile, result);
    }
  }
  async submitPledge(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.submitPledge(arg0);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.submitPledge(arg0);
      return result;
    }
  }
}
function from_candid_Result_1_n9(_uploadFile, _downloadFile, value) {
  return from_candid_variant_n10(_uploadFile, _downloadFile, value);
}
function from_candid_Result_2_n7(_uploadFile, _downloadFile, value) {
  return from_candid_variant_n8(_uploadFile, _downloadFile, value);
}
function from_candid_Result_3_n5(_uploadFile, _downloadFile, value) {
  return from_candid_variant_n6(_uploadFile, _downloadFile, value);
}
function from_candid_Result_n11(_uploadFile, _downloadFile, value) {
  return from_candid_variant_n12(_uploadFile, _downloadFile, value);
}
function from_candid_RoadmapMilestone_n2(_uploadFile, _downloadFile, value) {
  return from_candid_record_n3(_uploadFile, _downloadFile, value);
}
function from_candid_opt_n4(_uploadFile, _downloadFile, value) {
  return value.length === 0 ? null : value[0];
}
function from_candid_record_n3(_uploadFile, _downloadFile, value) {
  return {
    id: value.id,
    title: value.title,
    date: record_opt_to_undefined(from_candid_opt_n4(_uploadFile, _downloadFile, value.date)),
    completed: value.completed,
    year: value.year,
    description: value.description
  };
}
function from_candid_variant_n10(_uploadFile, _downloadFile, value) {
  return "ok" in value ? {
    __kind__: "ok",
    ok: value.ok
  } : "err" in value ? {
    __kind__: "err",
    err: value.err
  } : value;
}
function from_candid_variant_n12(_uploadFile, _downloadFile, value) {
  return "ok" in value ? {
    __kind__: "ok",
    ok: value.ok
  } : "err" in value ? {
    __kind__: "err",
    err: value.err
  } : value;
}
function from_candid_variant_n6(_uploadFile, _downloadFile, value) {
  return "ok" in value ? {
    __kind__: "ok",
    ok: value.ok
  } : "err" in value ? {
    __kind__: "err",
    err: value.err
  } : value;
}
function from_candid_variant_n8(_uploadFile, _downloadFile, value) {
  return "ok" in value ? {
    __kind__: "ok",
    ok: value.ok
  } : "err" in value ? {
    __kind__: "err",
    err: value.err
  } : value;
}
function from_candid_vec_n1(_uploadFile, _downloadFile, value) {
  return value.map((x) => from_candid_RoadmapMilestone_n2(_uploadFile, _downloadFile, x));
}
function createActor(canisterId, _uploadFile, _downloadFile, options = {}) {
  const agent = options.agent || HttpAgent.createSync({
    ...options.agentOptions
  });
  if (options.agent && options.agentOptions) {
    console.warn("Detected both agent and agentOptions passed to createActor. Ignoring agentOptions and proceeding with the provided agent.");
  }
  const actor = Actor.createActor(idlFactory, {
    agent,
    canisterId,
    ...options.actorOptions
  });
  return new Backend(actor, _uploadFile, _downloadFile, options.processError);
}
function useEarlyBelievers() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["earlyBelievers"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getEarlyBelievers();
    },
    enabled: !!actor && !isFetching,
    staleTime: 3e4
  });
}
function useHypeMessages() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["hypeMessages"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getHypeMessages();
    },
    enabled: !!actor && !isFetching,
    staleTime: 3e4
  });
}
function useSubmitEarlyBeliever() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (handle) => {
      if (!actor) throw new Error("Not connected");
      const result = await actor.submitEarlyBeliever(handle);
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["earlyBelievers"] });
      qc.invalidateQueries({ queryKey: ["communityStats"] });
    }
  });
}
function useSubmitHypeMessage() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      handle,
      message
    }) => {
      if (!actor) throw new Error("Not connected");
      const result = await actor.submitHypeMessage(handle, message);
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["hypeMessages"] });
      qc.invalidateQueries({ queryKey: ["communityStats"] });
    }
  });
}
function validateHandle(h) {
  const trimmed = h.trim();
  if (!trimmed.startsWith("@")) return "Handle must start with @";
  if (trimmed.length < 3 || trimmed.length > 30)
    return "Handle must be 3–30 characters";
  return null;
}
function EarlyBelieverSection() {
  const [handle, setHandle] = reactExports.useState("");
  const [error, setError] = reactExports.useState("");
  const [success, setSuccess] = reactExports.useState(false);
  const { data: believers = [], isLoading } = useEarlyBelievers();
  const submit = useSubmitEarlyBeliever();
  function handleSubmit(e) {
    e.preventDefault();
    const err = validateHandle(handle);
    if (err) {
      setError(err);
      return;
    }
    setError("");
    submit.mutate(handle.trim(), {
      onSuccess: () => {
        setSuccess(true);
        setHandle("");
      },
      onError: (e2) => setError(e2.message)
    });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "section",
    {
      id: "community",
      "data-ocid": "early_believer.section",
      className: "py-16 md:py-20",
      style: { background: "oklch(0.10 0.01 260)" },
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto px-4 max-w-4xl", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center mb-10", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "h2",
            {
              className: "font-display font-black text-4xl md:text-5xl tracking-tight mb-2",
              style: { color: "#FFFFFF" },
              children: "SIGN YOUR NAME."
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "p",
            {
              className: "font-display font-bold text-xl md:text-2xl",
              style: { color: "oklch(0.62 0.16 190)" },
              children: "JOIN THE MOVEMENT."
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "p-7 mb-8 max-w-lg mx-auto",
            style: {
              background: "oklch(0.14 0.015 260)",
              border: "1px solid oklch(0.62 0.16 190 / 0.25)"
            },
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "flex flex-col gap-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  id: "believer-handle",
                  type: "text",
                  "data-ocid": "early_believer.input",
                  placeholder: "@YourHandle",
                  value: handle,
                  onChange: (e) => {
                    setHandle(e.target.value);
                    setError("");
                    setSuccess(false);
                  },
                  maxLength: 30,
                  className: "w-full px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none transition-colors",
                  style: {
                    background: "oklch(0.18 0.01 260)",
                    border: error ? "1px solid oklch(0.55 0.22 25 / 0.8)" : "1px solid oklch(0.28 0.01 260)"
                  }
                }
              ),
              error && /* @__PURE__ */ jsxRuntimeExports.jsx(
                "p",
                {
                  className: "text-xs mt-1",
                  style: { color: "oklch(0.65 0.22 25)" },
                  "data-ocid": "early_believer.field_error",
                  children: error
                }
              ),
              success && /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "p-3 text-sm font-black text-center uppercase tracking-widest",
                  style: {
                    background: "oklch(0.65 0.18 145 / 0.12)",
                    color: "oklch(0.70 0.16 145)"
                  },
                  "data-ocid": "early_believer.success_state",
                  children: "YOU'RE ON THE WALL."
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "submit",
                  "data-ocid": "early_believer.submit_button",
                  disabled: submit.isPending,
                  className: "w-full py-3.5 font-black text-sm uppercase tracking-widest transition-all duration-200 disabled:opacity-60",
                  style: {
                    background: "oklch(0.62 0.16 190)",
                    color: "oklch(0.10 0.01 260)"
                  },
                  children: submit.isPending ? "Submitting..." : "Claim Your Spot"
                }
              )
            ] })
          }
        ),
        isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center", "data-ocid": "early_believer.loading_state", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "inline-block w-5 h-5 rounded-full border-2 animate-spin",
            style: {
              borderColor: "oklch(0.62 0.16 190)",
              borderTopColor: "transparent"
            }
          }
        ) }) : believers.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "text-center py-8",
            "data-ocid": "early_believer.empty_state",
            style: {
              background: "oklch(0.14 0.015 260)",
              border: "1px solid oklch(0.22 0.01 260)"
            },
            children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-black text-muted-foreground uppercase tracking-widest", children: "BE THE FIRST" })
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground text-center mb-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                style: { color: "oklch(0.62 0.16 190)" },
                className: "font-black",
                children: believers.length
              }
            ),
            " ",
            "Early Believers"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "flex flex-wrap gap-2 justify-center",
              "data-ocid": "early_believer.list",
              children: believers.map((b, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  "data-ocid": `early_believer.item.${i + 1}`,
                  className: "px-3 py-1.5 text-xs font-bold uppercase tracking-wide",
                  style: {
                    background: "oklch(0.62 0.16 190 / 0.12)",
                    border: "1px solid oklch(0.62 0.16 190 / 0.30)",
                    color: "oklch(0.62 0.16 190)"
                  },
                  children: b.handle
                },
                b.handle
              ))
            }
          )
        ] })
      ] })
    }
  );
}
const DMNZ_TERMS = [
  {
    term: "Bonding Curve",
    def: "Price automatically rises as more tokens are bought. Early buyers pay less — every purchase after them pushes the price higher."
  },
  {
    term: "Buyback",
    def: "The project buys tokens back from the open market. For DMNZ this happens January 2028, immediately before the burn."
  },
  {
    term: "Burn",
    def: "Tokens sent to a dead wallet permanently — gone from circulation forever. DMNZ burns 50% of supply on January 1, 2028."
  },
  {
    term: "Fair Launch",
    def: "No presale. No private rounds. No team allocation. Everyone enters at the same price on the same day. The rarest thing in crypto."
  },
  {
    term: "Meme Coin",
    def: "Community-driven token without traditional utility — but DMNZ backs it with a defined roadmap, a real burn event, and discipline."
  },
  {
    term: "DMNZ",
    def: "The DemonZeno token. Launches April 2, 2027 via Blum Mini App. 100% fair launch, no team allocation, and a 50% supply burn in January 2028."
  },
  {
    term: "OG Believer",
    def: "A title for the first 100 people who register on the DMNZ website before launch — permanently listed as founding community members."
  },
  {
    term: "Blum Mini App",
    def: "A Telegram-based crypto launchpad. DMNZ launches exclusively here on April 2, 2027. You need Telegram — no separate wallet required."
  }
];
function GlossarySection() {
  const [openIdx, setOpenIdx] = reactExports.useState(0);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "section",
    {
      id: "glossary",
      "data-ocid": "glossary_simple.section",
      className: "py-14 md:py-16",
      style: { background: "oklch(0.115 0.015 265)" },
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto px-4 max-w-3xl", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-8", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "h2",
            {
              className: "font-display font-black text-4xl md:text-5xl tracking-tight",
              style: { color: "#FFFFFF" },
              children: "GLOSSARY"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "p",
            {
              className: "text-xs font-bold uppercase tracking-widest mt-2",
              style: { color: "oklch(0.62 0.16 190)" },
              children: "Key DMNZ terms. One sentence each."
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-1.5", "data-ocid": "glossary_simple.list", children: DMNZ_TERMS.map((item, i) => {
          const isOpen = openIdx === i;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              "data-ocid": `glossary_simple.item.${i + 1}`,
              className: "overflow-hidden",
              style: {
                background: "oklch(0.14 0.015 260)",
                border: isOpen ? "1px solid oklch(0.62 0.16 190 / 0.40)" : "1px solid oklch(0.22 0.01 260)",
                transition: "border-color 0.2s"
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    type: "button",
                    "data-ocid": `glossary_simple.toggle.${i + 1}`,
                    className: "w-full text-left flex items-center justify-between gap-3 px-5 py-3.5 hover:bg-white/[0.02] transition-colors",
                    onClick: () => setOpenIdx(isOpen ? null : i),
                    "aria-expanded": isOpen,
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "span",
                        {
                          className: "font-display font-black text-sm uppercase tracking-wide",
                          style: {
                            color: isOpen ? "oklch(0.62 0.16 190)" : "oklch(0.90 0.005 260)"
                          },
                          children: item.term
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        ChevronDown,
                        {
                          className: `w-4 h-4 shrink-0 text-muted-foreground transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`
                        }
                      )
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "overflow-hidden transition-all duration-300",
                    style: { maxHeight: isOpen ? "200px" : "0" },
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "px-5 pb-4 text-sm text-muted-foreground", children: item.def })
                  }
                )
              ]
            },
            item.term
          );
        }) })
      ] })
    }
  );
}
const SLOGANS = [
  "BORN FROM DARKNESS. FORGED IN DISCIPLINE.",
  "TRADE LIKE A GOD. HOLD LIKE A DEMON.",
  "THE RIGGED GAME ENDS HERE.",
  "100% FAIR LAUNCH. ZERO EXCEPTIONS.",
  "NO PRESALE. NO INSIDERS. NO MERCY.",
  "DISCIPLINE IS THE ONLY EDGE THAT MATTERS.",
  "DMNZ: THE COUNTER-ATTACK.",
  "PROTECT YOUR CAPITAL. IT IS YOUR LIFE.",
  "IN TRADING, THE LAST ONE STANDING WINS.",
  "THE DEMONS OF TRADING ARE FEAR AND GREED. KNOW THEM. DESTROY THEM."
];
const LAUNCH_TARGET = (/* @__PURE__ */ new Date("2027-04-02T00:00:00Z")).getTime();
function useMiniCountdown() {
  const [t, setT] = reactExports.useState(() => {
    const diff = LAUNCH_TARGET - Date.now();
    if (diff <= 0) return null;
    return {
      days: Math.floor(diff / 864e5),
      hours: Math.floor(diff % 864e5 / 36e5),
      minutes: Math.floor(diff % 36e5 / 6e4),
      seconds: Math.floor(diff % 6e4 / 1e3)
    };
  });
  reactExports.useEffect(() => {
    const id = setInterval(() => {
      const diff = LAUNCH_TARGET - Date.now();
      if (diff <= 0) {
        setT(null);
        return;
      }
      setT({
        days: Math.floor(diff / 864e5),
        hours: Math.floor(diff % 864e5 / 36e5),
        minutes: Math.floor(diff % 36e5 / 6e4),
        seconds: Math.floor(diff % 6e4 / 1e3)
      });
    }, 1e3);
    return () => clearInterval(id);
  }, []);
  return t;
}
function HeroSection() {
  const [quoteIdx, setQuoteIdx] = reactExports.useState(
    () => Math.floor(Math.random() * SLOGANS.length)
  );
  const [fadingOut, setFadingOut] = reactExports.useState(false);
  const countdown = useMiniCountdown();
  reactExports.useEffect(() => {
    const interval = setInterval(() => {
      setFadingOut(true);
      setTimeout(() => {
        setQuoteIdx((prev) => (prev + 1) % SLOGANS.length);
        setFadingOut(false);
      }, 350);
    }, 4e3);
    return () => clearInterval(interval);
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "section",
    {
      id: "hero",
      "data-ocid": "hero.section",
      className: "relative min-h-screen flex items-center overflow-hidden",
      style: { background: "var(--background)" },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            "aria-hidden": "true",
            className: "pointer-events-none absolute inset-0",
            style: {
              background: "radial-gradient(ellipse 55% 55% at 70% 50%, rgba(220,20,60,0.07) 0%, transparent 70%)"
            }
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto px-4 py-20 grid md:grid-cols-2 gap-12 items-center relative z-10", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-6 max-w-xl", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "inline-flex items-center gap-2 w-fit",
                style: {
                  background: "var(--primary-subtle)",
                  border: "1px solid var(--primary-border)",
                  borderRadius: "2px",
                  padding: "0.3rem 0.85rem"
                },
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "text-xs font-bold uppercase tracking-widest",
                    style: { color: "var(--primary)", letterSpacing: "0.12em" },
                    children: "DMNZ — Launching April 2, 2027"
                  }
                )
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "h1",
              {
                className: "font-display font-black uppercase",
                style: {
                  fontSize: "clamp(2.75rem, 7vw, 5.5rem)",
                  letterSpacing: "-0.03em",
                  lineHeight: "1.05",
                  color: "var(--foreground)",
                  paddingBottom: "0.75rem",
                  position: "relative"
                },
                children: [
                  "Demon",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "var(--primary)" }, children: "Zeno" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: "block font-mono",
                      style: {
                        fontSize: "0.6em",
                        color: "var(--muted-foreground)",
                        marginTop: "0.25rem",
                        letterSpacing: "0.04em"
                      },
                      children: "(DMNZ)"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      "aria-hidden": "true",
                      style: {
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        width: "3rem",
                        height: "2px",
                        background: "var(--primary)"
                      }
                    }
                  )
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "p",
              {
                className: "font-display font-black text-sm uppercase tracking-widest",
                style: {
                  borderLeft: "2px solid var(--primary)",
                  paddingLeft: "1rem",
                  color: "var(--muted-foreground)",
                  opacity: fadingOut ? 0 : 1,
                  transition: "opacity 0.35s ease-in-out",
                  minHeight: "1.5rem",
                  letterSpacing: "0.06em"
                },
                children: SLOGANS[quoteIdx]
              }
            ),
            countdown !== null ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                style: {
                  background: "var(--card)",
                  border: "1px solid var(--primary-border)",
                  borderRadius: "2px",
                  padding: "1rem 1.25rem"
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "p",
                    {
                      className: "text-xs font-bold uppercase tracking-widest mb-3",
                      style: {
                        color: "var(--muted-foreground)",
                        letterSpacing: "0.14em"
                      },
                      children: "Launch Countdown · April 2, 2027"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-4", children: [
                    { label: "D", value: countdown.days },
                    { label: "H", value: countdown.hours },
                    { label: "M", value: countdown.minutes },
                    { label: "S", value: countdown.seconds }
                  ].map(({ label, value }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        className: "font-display font-black text-3xl tabular-nums",
                        style: { color: "var(--primary)" },
                        children: String(value).padStart(2, "0")
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "p",
                      {
                        className: "text-xs font-bold uppercase tracking-widest",
                        style: { color: "var(--muted-foreground)" },
                        children: label
                      }
                    )
                  ] }, label)) })
                ]
              }
            ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "font-display font-black text-xl px-4 py-3",
                style: {
                  color: "var(--primary)",
                  background: "var(--card)",
                  border: "1px solid var(--primary-border)",
                  borderRadius: "2px"
                },
                children: "DMNZ IS LIVE ON BLUM!"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "a",
                {
                  href: "https://app.binance.com/uni-qr/cpro/Demon_Zeno?l=en&r=KGTBUDHQ&uc=app_square_share_link&us=copylink",
                  target: "_blank",
                  rel: "noopener noreferrer",
                  "data-ocid": "hero.binance.primary_button",
                  className: "btn-primary",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SiBinance, { className: "w-4 h-4" }),
                    "FOLLOW ON BINANCE SQUARE"
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  "data-ocid": "hero.buy.secondary_button",
                  onClick: () => {
                    var _a2;
                    return (_a2 = document.getElementById("how-to-buy")) == null ? void 0 : _a2.scrollIntoView({ behavior: "smooth" });
                  },
                  className: "btn-ghost",
                  children: "BUY ON BLUM"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2", children: [
              "No Presale",
              "No Team Tokens",
              "Full Fair Launch",
              "Community First"
            ].map((f) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "trust-pill", children: f }, f)) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center md:justify-end", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative select-none", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative z-10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "img",
            {
              src: "/assets/demonzeno-real.png",
              alt: "DemonZeno — the face behind DMNZ",
              className: "w-64 md:w-80 lg:w-96 object-cover drop-shadow-2xl",
              style: {
                objectPosition: "50% 5%",
                clipPath: "inset(0 8% 20% 8%)",
                marginBottom: "-20%",
                filter: "contrast(1.05) brightness(0.95)"
              },
              onError: (e) => {
                e.target.src = "/assets/demonzeno-character.png";
              }
            }
          ) }) }) })
        ] })
      ]
    }
  );
}
const BENEFITS = [
  {
    icon: TrendingUp,
    title: "Supply Drops After Burn",
    desc: "January 2028 removes 50% of circulating supply — permanent deflationary pressure.",
    accent: "oklch(0.62 0.16 190)",
    accentBg: "oklch(0.62 0.16 190 / 0.10)",
    accentBorder: "oklch(0.62 0.16 190 / 0.25)",
    stat: "Supply↓",
    statSub: "Post-Burn"
  },
  {
    icon: Flame,
    title: "Early Position Advantage",
    desc: "Less supply. Same demand. Early holders who stay through the burn stand at the front.",
    accent: "oklch(0.70 0.18 25)",
    accentBg: "oklch(0.55 0.22 25 / 0.10)",
    accentBorder: "oklch(0.55 0.22 25 / 0.25)",
    stat: "Value↑",
    statSub: "Post-Burn"
  },
  {
    icon: Award,
    title: "OG Believer Status",
    desc: "Early holders are permanently recognized on the community wall as founding members.",
    accent: "oklch(0.70 0.18 70)",
    accentBg: "oklch(0.65 0.15 70 / 0.10)",
    accentBorder: "oklch(0.65 0.15 70 / 0.25)",
    stat: "OG",
    statSub: "Status"
  },
  {
    icon: ShieldCheck,
    title: "No Insider Advantage",
    desc: "No one got in cheaper. Every DMNZ holder entered at the same price on the same day.",
    accent: "oklch(0.70 0.16 145)",
    accentBg: "oklch(0.65 0.18 145 / 0.10)",
    accentBorder: "oklch(0.65 0.18 145 / 0.25)",
    stat: "Fair",
    statSub: "Always"
  },
  {
    icon: Users,
    title: "Community Recognition",
    desc: "Your handle is publicly listed as a founding member of the DMNZ movement.",
    accent: "oklch(0.60 0.15 295)",
    accentBg: "oklch(0.60 0.15 295 / 0.10)",
    accentBorder: "oklch(0.60 0.15 295 / 0.25)",
    stat: "Listed",
    statSub: "Community"
  },
  {
    icon: Star,
    title: "DEX Listing Eligibility",
    desc: "When DMNZ hits the bonding curve target, it becomes eligible for broader exchange listings.",
    accent: "oklch(0.65 0.15 70)",
    accentBg: "oklch(0.65 0.15 70 / 0.10)",
    accentBorder: "oklch(0.65 0.15 70 / 0.25)",
    stat: "DEX",
    statSub: "Eligible"
  }
];
function HolderBenefitsSection() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "section",
    {
      "data-ocid": "holder_benefits.section",
      className: "py-16 md:py-20",
      style: { background: "oklch(0.10 0.01 260)" },
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto px-4 max-w-5xl", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-10", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "h2",
            {
              className: "font-display font-black text-4xl md:text-5xl tracking-tight",
              style: { color: "#FFFFFF" },
              children: "HOLD EARLY."
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "p",
            {
              className: "font-display font-black text-2xl md:text-3xl",
              style: { color: "oklch(0.70 0.18 70)" },
              children: "WIN LONG."
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid sm:grid-cols-2 lg:grid-cols-3 gap-4", children: BENEFITS.map(
          ({
            icon: Icon,
            title,
            desc,
            accent,
            accentBg,
            accentBorder,
            stat,
            statSub
          }, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              "data-ocid": `holder_benefits.card.${i + 1}`,
              className: "flex flex-col gap-4 p-5",
              style: {
                background: "oklch(0.14 0.012 260)",
                border: `1px solid ${accentBorder}`
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      className: "w-9 h-9 flex items-center justify-center shrink-0",
                      style: {
                        background: accentBg,
                        border: `1px solid ${accentBorder}`
                      },
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "w-5 h-5", style: { color: accent } })
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "div",
                      {
                        className: "font-display font-black text-lg",
                        style: { color: accent },
                        children: stat
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: statSub })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-bold text-foreground text-sm mb-1", children: title }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground leading-relaxed", children: desc })
                ] })
              ]
            },
            title
          )
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "mt-6 p-5 text-center",
            style: {
              background: "oklch(0.65 0.15 70 / 0.06)",
              border: "1px solid oklch(0.65 0.15 70 / 0.20)"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "p",
                {
                  className: "font-display font-black text-base uppercase tracking-widest",
                  style: { color: "oklch(0.70 0.18 70)" },
                  children: "“The ones who hold through the darkness see the dawn clearest.”"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "— DemonZeno" })
            ]
          }
        )
      ] })
    }
  );
}
const MAX_CHARS = 280;
function HypeWallSection() {
  const [handle, setHandle] = reactExports.useState("");
  const [message, setMessage] = reactExports.useState("");
  const [error, setError] = reactExports.useState("");
  const [success, setSuccess] = reactExports.useState(false);
  const { data: messages = [], isLoading } = useHypeMessages();
  const submit = useSubmitHypeMessage();
  function handleSubmit(e) {
    e.preventDefault();
    if (!handle.trim().startsWith("@")) {
      setError("Handle must start with @");
      return;
    }
    if (!message.trim()) {
      setError("Write your message");
      return;
    }
    if (message.length > MAX_CHARS) {
      setError(`Max ${MAX_CHARS} characters`);
      return;
    }
    setError("");
    submit.mutate(
      { handle: handle.trim(), message: message.trim() },
      {
        onSuccess: () => {
          setSuccess(true);
          setHandle("");
          setMessage("");
        },
        onError: (e2) => setError(e2.message)
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "section",
    {
      "data-ocid": "hype_wall.section",
      className: "py-16 md:py-20",
      style: { background: "oklch(0.10 0.01 260)" },
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto px-4 max-w-5xl", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center mb-8", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "h2",
            {
              className: "font-display font-black text-4xl md:text-5xl tracking-tight",
              style: { color: "#FFFFFF" },
              children: "THE HYPE WALL"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "p",
            {
              className: "text-xs font-bold uppercase tracking-widest mt-2",
              style: { color: "oklch(0.70 0.18 25)" },
              children: "Why do you believe? Say it."
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "p-7 mb-8 max-w-lg mx-auto",
            style: {
              background: "oklch(0.14 0.015 260)",
              border: "1px solid oklch(0.55 0.22 25 / 0.25)"
            },
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "flex flex-col gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: "text",
                  "data-ocid": "hype_wall.handle_input",
                  placeholder: "@YourHandle",
                  value: handle,
                  onChange: (e) => {
                    setHandle(e.target.value);
                    setError("");
                    setSuccess(false);
                  },
                  maxLength: 30,
                  className: "w-full px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none",
                  style: {
                    background: "oklch(0.18 0.01 260)",
                    border: "1px solid oklch(0.28 0.01 260)"
                  }
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "textarea",
                  {
                    "data-ocid": "hype_wall.message_input",
                    placeholder: "Why do you believe in DMNZ?",
                    value: message,
                    onChange: (e) => {
                      setMessage(e.target.value.slice(0, MAX_CHARS));
                      setError("");
                      setSuccess(false);
                    },
                    rows: 3,
                    className: "w-full px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none resize-none",
                    style: {
                      background: "oklch(0.18 0.01 260)",
                      border: "1px solid oklch(0.28 0.01 260)"
                    }
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "span",
                  {
                    className: "absolute bottom-3 right-3 text-xs",
                    style: {
                      color: message.length > MAX_CHARS * 0.9 ? "oklch(0.70 0.18 25)" : "oklch(0.50 0.01 260)"
                    },
                    children: [
                      message.length,
                      "/",
                      MAX_CHARS
                    ]
                  }
                )
              ] }),
              error && /* @__PURE__ */ jsxRuntimeExports.jsx(
                "p",
                {
                  className: "text-xs",
                  style: { color: "oklch(0.65 0.22 25)" },
                  "data-ocid": "hype_wall.field_error",
                  children: error
                }
              ),
              success && /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "p-3 text-sm font-black text-center uppercase tracking-widest",
                  style: {
                    background: "oklch(0.65 0.18 145 / 0.12)",
                    color: "oklch(0.70 0.16 145)"
                  },
                  "data-ocid": "hype_wall.success_state",
                  children: "POSTED."
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "submit",
                  "data-ocid": "hype_wall.submit_button",
                  disabled: submit.isPending,
                  className: "py-3 font-black text-sm uppercase tracking-widest transition-all disabled:opacity-60",
                  style: {
                    background: "oklch(0.55 0.22 25)",
                    color: "oklch(0.97 0.002 260)"
                  },
                  children: submit.isPending ? "Posting..." : "Post to Hype Wall"
                }
              )
            ] })
          }
        ),
        isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center", "data-ocid": "hype_wall.loading_state", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "inline-block w-5 h-5 rounded-full border-2 animate-spin",
            style: {
              borderColor: "oklch(0.70 0.18 25)",
              borderTopColor: "transparent"
            }
          }
        ) }) : messages.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "text-center py-8",
            "data-ocid": "hype_wall.empty_state",
            style: {
              background: "oklch(0.14 0.015 260)",
              border: "1px solid oklch(0.22 0.01 260)"
            },
            children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-black uppercase tracking-widest text-muted-foreground", children: "BE THE FIRST TO POST" })
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "grid sm:grid-cols-2 lg:grid-cols-3 gap-4",
            "data-ocid": "hype_wall.list",
            children: messages.map((m, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                "data-ocid": `hype_wall.item.${i + 1}`,
                className: "p-5 flex flex-col gap-3",
                style: {
                  background: "oklch(0.14 0.015 260)",
                  border: "1px solid oklch(0.22 0.01 260)"
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-foreground leading-relaxed", children: m.message }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mt-auto", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        className: "text-xs font-bold",
                        style: { color: "oklch(0.62 0.16 190)" },
                        children: m.handle
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: new Date(
                      Number(m.timestamp) / 1e6
                    ).toLocaleDateString() })
                  ] })
                ]
              },
              `${m.handle}-${i}`
            ))
          }
        )
      ] })
    }
  );
}
const MILESTONES = [
  {
    id: "2026",
    year: "2026",
    date: "Full Year",
    title: "Community Building Year",
    Icon: Globe,
    status: "current",
    statusLabel: "IN PROGRESS",
    desc: "Building the DemonZeno community on Binance Square. Daily trading education. Establishing the credibility that makes the DMNZ launch unstoppable.",
    deliverables: [
      "Daily free trading education on @Demon_Zeno Binance Square",
      "Build a loyal global community of disciplined traders",
      "Establish credibility for the DMNZ token launch",
      "Launch this website and Early Believers wall"
    ]
  },
  {
    id: "2027",
    year: "2027",
    date: "April 2, 2027",
    title: "DMNZ Launches on Blum",
    Icon: Rocket,
    status: "upcoming",
    statusLabel: "UPCOMING",
    desc: "DMNZ token launches on Blum Mini App. 100% fair launch — no presale, no insiders, no team allocation. Same price for everyone.",
    deliverables: [
      "DMNZ token created and launched via Blum Mini App",
      "100% fair launch — zero presale, zero insider advantage",
      "Blum platform integration and full launch campaign"
    ]
  },
  {
    id: "2028",
    year: "2028",
    date: "January 1, 2028",
    title: "The Great Burn",
    Icon: Flame,
    status: "future",
    statusLabel: "FUTURE",
    desc: "Massive buyback and permanent burn of 50% of all DMNZ supply. Deflationary pressure. DEX listing eligibility. DemonZeno keeps his word.",
    deliverables: [
      "Massive buyback of DMNZ from the open market",
      "Permanent burn — 50% of circulating supply destroyed",
      "Bonding curve acceleration toward exchange listings"
    ]
  }
];
const STATUS_STYLES = {
  current: {
    border: "oklch(0.62 0.16 190 / 0.50)",
    yearColor: "oklch(0.62 0.16 190)",
    glow: "0 0 20px oklch(0.62 0.16 190 / 0.12)",
    badge: {
      bg: "oklch(0.62 0.16 190 / 0.12)",
      color: "oklch(0.62 0.16 190)",
      border: "oklch(0.62 0.16 190 / 0.35)"
    }
  },
  upcoming: {
    border: "oklch(0.65 0.15 70 / 0.50)",
    yearColor: "oklch(0.70 0.18 70)",
    glow: "0 0 16px oklch(0.65 0.15 70 / 0.08)",
    badge: {
      bg: "oklch(0.65 0.15 70 / 0.12)",
      color: "oklch(0.70 0.18 70)",
      border: "oklch(0.65 0.15 70 / 0.35)"
    }
  },
  future: {
    border: "oklch(0.30 0.01 260)",
    yearColor: "oklch(0.50 0.01 260)",
    glow: "none",
    badge: {
      bg: "oklch(0.22 0.01 260)",
      color: "oklch(0.50 0.01 260)",
      border: "oklch(0.30 0.01 260)"
    }
  }
};
function InteractiveRoadmapSection() {
  const [expandedId, setExpandedId] = reactExports.useState("2026");
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "section",
    {
      id: "roadmap",
      "data-ocid": "roadmap.section",
      className: "py-16 md:py-20",
      style: { background: "oklch(0.10 0.01 260)" },
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto px-4 max-w-3xl", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center mb-10", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "h2",
            {
              className: "font-display font-black text-4xl md:text-5xl tracking-tight",
              style: { color: "#FFFFFF" },
              children: "THE ROADMAP"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "p",
            {
              className: "text-xs font-bold uppercase tracking-widest mt-2",
              style: { color: "oklch(0.62 0.16 190)" },
              children: "Three milestones. One commitment."
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-3", "data-ocid": "roadmap.list", children: MILESTONES.map((m, i) => {
          const style = STATUS_STYLES[m.status];
          const isOpen = expandedId === m.id;
          const MilestoneIcon = m.Icon;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              "data-ocid": `roadmap.item.${i + 1}`,
              onClick: () => setExpandedId(isOpen ? null : m.id),
              "aria-expanded": isOpen,
              className: "w-full text-left p-6 transition-all duration-200",
              style: {
                background: "oklch(0.14 0.015 260)",
                border: `1px solid ${style.border}`,
                boxShadow: style.glow
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-3 mb-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "div",
                      {
                        className: "w-9 h-9 flex items-center justify-center shrink-0",
                        style: { background: style.badge.bg },
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                          MilestoneIcon,
                          {
                            className: "w-5 h-5",
                            style: { color: style.yearColor }
                          }
                        )
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "span",
                        {
                          className: "font-display font-black text-2xl",
                          style: { color: style.yearColor },
                          children: m.year
                        }
                      ),
                      m.date && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: m.date })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 shrink-0", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        className: "text-xs font-black uppercase tracking-widest px-2.5 py-1",
                        style: {
                          background: style.badge.bg,
                          color: style.badge.color,
                          border: `1px solid ${style.badge.border}`
                        },
                        children: m.statusLabel
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      ChevronDown,
                      {
                        className: `w-4 h-4 text-muted-foreground transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`
                      }
                    )
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-bold text-foreground text-base mb-1", children: m.title }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground leading-snug", children: m.desc }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "overflow-hidden transition-all duration-300",
                    style: { maxHeight: isOpen ? "400px" : "0" },
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "div",
                      {
                        className: "mt-4 pt-4",
                        style: { borderTop: "1px solid oklch(0.22 0.01 260)" },
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "flex flex-col gap-1.5", children: m.deliverables.map((d) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                          "li",
                          {
                            className: "flex gap-2 text-sm text-muted-foreground",
                            children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx(
                                "span",
                                {
                                  style: { color: style.yearColor },
                                  className: "shrink-0 font-black text-xs",
                                  children: "—"
                                }
                              ),
                              d
                            ]
                          },
                          d
                        )) })
                      }
                    )
                  }
                )
              ]
            },
            m.id
          );
        }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "mt-5 p-5 text-center",
            style: {
              background: "oklch(0.62 0.16 190 / 0.05)",
              border: "1px solid oklch(0.62 0.16 190 / 0.15)"
            },
            "data-ocid": "roadmap.whats_next",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-bold text-foreground text-sm", children: "After the burn — DEX listings, broader exposure, and the next phase of the movement." })
          }
        )
      ] })
    }
  );
}
function LaunchPriceMechanicsSection() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "section",
    {
      "data-ocid": "launch_price.section",
      className: "py-16 md:py-20",
      style: { background: "#0a0a0a" },
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto px-4 max-w-4xl", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-10", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "h2",
            {
              className: "font-display font-black text-4xl md:text-5xl tracking-tight",
              style: { color: "#FFFFFF" },
              children: "HOW DMNZ PRICE WORKS"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "p",
            {
              className: "text-sm font-black uppercase tracking-widest mt-2",
              style: { color: "#DC143C" },
              children: "No launch price. There is a bonding curve."
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-3 mb-10", children: [
          {
            num: "01",
            title: "DMNZ launches on Blum's bonding curve",
            body: "April 2, 2027. Bonding curve is the only price mechanism — no set price, no IPO."
          },
          {
            num: "02",
            title: "First buyer gets the lowest price",
            body: "Each buy after the first pushes the price up slightly. No 'insider' price — open to everyone simultaneously."
          },
          {
            num: "03",
            title: "DMNZ hits the bonding curve target",
            body: "Enough buying moves DMNZ to open DEX trading. The January 2028 burn accelerates this milestone."
          },
          {
            num: "04",
            title: "DemonZeno does NOT set the price",
            body: "The market does. By design — it's the only honest way to launch."
          }
        ].map((step, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            "data-ocid": `launch_price.step.${i + 1}`,
            className: "flex gap-5 p-5",
            style: {
              background: "#111111",
              border: "1px solid rgba(255,255,255,0.06)",
              borderLeft: "3px solid #DC143C"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "shrink-0 w-7 h-7 flex items-center justify-center font-mono font-black text-xs",
                  style: { background: "#DC143C", color: "#FFFFFF" },
                  children: step.num
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "p",
                  {
                    className: "font-display font-black text-sm uppercase tracking-wide mb-1",
                    style: { color: "#FFFFFF" },
                    children: step.title
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm", style: { color: "#A0A0A0" }, children: step.body })
              ] })
            ]
          },
          step.num
        )) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "p-5",
            style: {
              background: "#111111",
              border: "1px solid rgba(255,255,255,0.06)"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "p",
                {
                  className: "text-xs font-black uppercase tracking-widest mb-5",
                  style: { color: "rgba(255,255,255,0.30)" },
                  children: "Key Questions"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-4", children: [
                {
                  q: "What will the price be at launch?",
                  a: "Unknown. Set by the bonding curve, not DemonZeno."
                },
                {
                  q: "Can I lose money?",
                  a: "Yes. Meme tokens are volatile. Never invest more than you can afford to lose."
                },
                {
                  q: "Is there a guaranteed price target?",
                  a: "No. Anyone claiming to predict the DMNZ price is speculating."
                },
                {
                  q: "How is this different from a presale?",
                  a: "Presale insiders buy before you at a lower price. With DMNZ, the curve starts fresh at launch — no hidden pre-launch activity."
                }
              ].map((item, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  "data-ocid": `launch_price.faq.${i + 1}`,
                  className: "flex flex-col gap-1",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-bold", style: { color: "#FFFFFF" }, children: item.q }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm", style: { color: "#A0A0A0" }, children: item.a }),
                    i < 3 && /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "div",
                      {
                        className: "mt-3",
                        style: { borderBottom: "1px solid rgba(255,255,255,0.06)" }
                      }
                    )
                  ]
                },
                item.q
              )) })
            ]
          }
        )
      ] })
    }
  );
}
function LegendSection() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "section",
    {
      id: "story",
      "data-ocid": "legend.section",
      className: "py-16 md:py-20 relative overflow-hidden",
      style: { background: "oklch(0.10 0.01 260)" },
      children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "container mx-auto px-4 max-w-5xl relative z-10", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid md:grid-cols-2 gap-12 items-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center md:justify-start", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "img",
          {
            src: "/assets/demonzeno-real.png",
            alt: "The Legend of DemonZeno",
            className: "w-56 md:w-72 drop-shadow-2xl",
            style: {
              clipPath: "inset(0 8% 20% 8%)",
              filter: "contrast(1.08) brightness(0.9)"
            },
            onError: (e) => {
              e.target.src = "/assets/demonzeno-character.png";
            }
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "h2",
            {
              className: "font-display font-black uppercase",
              style: {
                fontSize: "clamp(2rem, 5vw, 3.5rem)",
                letterSpacing: "-0.03em",
                lineHeight: "1.05",
                color: "var(--foreground)"
              },
              children: [
                "THE LEGEND OF",
                " ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "oklch(0.62 0.16 190)" }, children: "DEMONZENO" })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "p",
            {
              className: "text-base font-semibold leading-snug",
              style: { color: "var(--muted-foreground)" },
              children: "Not a whale. Not a VC. Not an insider."
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "p",
            {
              className: "text-sm leading-relaxed",
              style: { color: "var(--muted-foreground)" },
              children: "He walked the market alone — disciplined, unbreakable, waiting while others panicked. The cold force that turns patience into power."
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "blockquote",
            {
              className: "border-l-2 pl-4 text-sm font-bold uppercase tracking-wide",
              style: {
                borderColor: "oklch(0.62 0.16 190)",
                color: "oklch(0.62 0.16 190)"
              },
              children: "“BORN FROM DARKNESS. FORGED IN DISCIPLINE.”"
            }
          )
        ] })
      ] }) })
    }
  );
}
function LetterToBelieverSection() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "section",
    {
      "data-ocid": "letter.section",
      className: "py-16 md:py-20",
      style: { background: "#111111" },
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-3xl mx-auto px-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "h2",
          {
            className: "font-display font-black text-4xl md:text-5xl tracking-tight mb-10",
            style: { color: "#FFFFFF" },
            children: "TO EARLY BELIEVERS"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            style: {
              background: "rgba(17,17,17,0.9)",
              border: "1px solid rgba(255,255,255,0.08)",
              padding: "2.5rem"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "p",
                {
                  className: "text-xs font-black uppercase tracking-widest mb-8",
                  style: { color: "rgba(212,175,55,0.6)" },
                  children: "You believed before the world did."
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "p",
                  {
                    className: "font-display font-black text-lg",
                    style: { color: "#FFFFFF" },
                    children: "You found DMNZ before the charts moved."
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "p",
                  {
                    className: "font-display font-black text-lg",
                    style: { color: "rgba(255,255,255,0.80)" },
                    children: "You read the roadmap. You understood the fair launch. You saw the mission."
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "p",
                  {
                    className: "font-display font-black text-lg",
                    style: { color: "rgba(255,255,255,0.80)" },
                    children: "The burn in January 2028 is for you. Every milestone on this roadmap is for you."
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "p",
                  {
                    className: "font-display font-black text-xl",
                    style: { color: "oklch(0.62 0.16 190)" },
                    children: "I am committed. I am not going anywhere."
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "mt-8 pt-6 flex flex-col items-end gap-1",
                  style: { borderTop: "2px solid #d4af37" },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        className: "font-display font-black text-2xl",
                        style: { color: "#d4af37" },
                        children: "DemonZeno"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground uppercase tracking-widest", children: "Creator of DMNZ  |  @Demon_Zeno on Binance Square" })
                  ]
                }
              )
            ]
          }
        )
      ] })
    }
  );
}
function OriginStorySection() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "section",
    {
      "data-ocid": "origin_story.section",
      className: "py-16 md:py-20",
      style: { background: "oklch(0.115 0.015 265)" },
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto px-4 max-w-3xl", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "h2",
          {
            className: "font-display font-black uppercase mb-10",
            style: {
              fontSize: "clamp(1.75rem, 4vw, 3rem)",
              letterSpacing: "-0.03em",
              color: "var(--foreground)"
            },
            children: [
              "WHO IS ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "oklch(0.70 0.18 70)" }, children: "DEMONZENO" }),
              "?"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "p-8 flex flex-col gap-5 relative",
            style: {
              background: "oklch(0.14 0.015 260)",
              border: "1px solid oklch(0.22 0.01 260)",
              borderLeft: "3px solid oklch(0.70 0.18 70)"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "p",
                {
                  className: "text-base font-bold leading-snug",
                  style: { color: "var(--foreground)" },
                  children: "I was tired of the rigged game. I built DMNZ so no one holds an advantage over you."
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "p",
                {
                  className: "text-sm leading-relaxed",
                  style: { color: "var(--muted-foreground)" },
                  children: "I started with a chart and an obsession. Every loss was a lesson I couldn't afford to repeat."
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "p",
                {
                  className: "text-sm leading-relaxed",
                  style: { color: "var(--muted-foreground)" },
                  children: "DMNZ is the token of that journey — 100% fair launch, no presale, no team tokens. Everyone in at the same price. That's the foundation."
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "p",
                {
                  className: "text-sm leading-relaxed",
                  style: { color: "var(--muted-foreground)" },
                  children: "The January 2028 burn is my commitment. I won't disappear. I won't dump. This is a long game."
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "pt-4 border-t flex items-center gap-3",
                  style: { borderColor: "oklch(0.22 0.01 260)" },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "img",
                      {
                        src: "/assets/demonzeno-real.png",
                        alt: "DemonZeno",
                        className: "w-10 h-10 rounded-full object-cover object-top",
                        style: { border: "2px solid oklch(0.62 0.16 190 / 0.50)" },
                        onError: (e) => {
                          e.target.src = "/assets/demonzeno-character.png";
                        }
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-bold text-foreground text-sm", children: "DemonZeno" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "a",
                        {
                          href: "https://app.binance.com/uni-qr/cpro/Demon_Zeno?l=en&r=KGTBUDHQ&uc=app_square_share_link&us=copylink",
                          target: "_blank",
                          rel: "noopener noreferrer",
                          className: "text-xs hover:underline",
                          style: { color: "oklch(0.62 0.16 190)" },
                          children: "@Demon_Zeno on Binance Square"
                        }
                      )
                    ] })
                  ]
                }
              )
            ]
          }
        )
      ] })
    }
  );
}
const QUOTES = [
  { quote: "Trade the chart, not the news." },
  {
    quote: "The demons of trading are fear and greed. Know them. Control them."
  },
  { quote: "Every loss is tuition. Every win is validation." },
  { quote: "Patience is the sharpest weapon in a trader's arsenal." },
  {
    quote: "Risk management isn't optional. It's the only reason traders survive."
  },
  {
    quote: "The best traders aren't the bravest. They're the most disciplined."
  },
  { quote: "Master the basics. Everything else is noise." },
  { quote: "In trading, the one who loses the least wins the most." },
  { quote: "Your trading plan is your shield. Never go to battle without it." },
  { quote: "Protect your capital like it's your life." },
  {
    quote: "Every pattern tells a story. Learn to read the chart like a book."
  },
  { quote: "The exit matters more than the entry." },
  { quote: "Trading is 80% psychology, 20% strategy." },
  { quote: "Cut losses fast, let winners run." },
  { quote: "The trend is your only friend." },
  { quote: "DMNZ: Born from darkness, forged in discipline." },
  { quote: "Trade Like a God. Hold Like a Demon." },
  { quote: "Small consistent gains beat lucky big wins every time." },
  { quote: "The market is a mirror. It shows you your fear and your greed." },
  {
    quote: "In a space built on asymmetry, the most radical thing is to be genuinely fair."
  }
];
function QuotesWallSection() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "section",
    {
      "data-ocid": "quotes_wall.section",
      className: "py-16 md:py-20",
      style: { background: "oklch(0.115 0.015 265)" },
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto px-4 max-w-6xl", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-10", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "h2",
          {
            className: "font-display font-black uppercase",
            style: {
              fontSize: "clamp(1.75rem, 4vw, 3rem)",
              letterSpacing: "-0.03em",
              color: "var(--foreground)"
            },
            children: [
              "WORDS OF",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "oklch(0.62 0.16 190)" }, children: "DEMONZENO" })
            ]
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "columns-1 sm:columns-2 lg:columns-3 gap-3 space-y-3",
            "data-ocid": "quotes_wall.grid",
            children: QUOTES.map(({ quote }, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                "data-ocid": `quotes_wall.item.${i + 1}`,
                className: "break-inside-avoid p-5 flex flex-col gap-2",
                style: {
                  background: "oklch(0.14 0.015 260)",
                  border: "1px solid oklch(0.22 0.01 260)",
                  borderLeft: "2px solid oklch(0.62 0.16 190 / 0.40)"
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "p",
                    {
                      className: "font-display font-bold text-sm leading-snug",
                      style: { color: "var(--foreground)" },
                      children: [
                        "“",
                        quote,
                        "”"
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: "text-xs font-bold self-end",
                      style: { color: "oklch(0.62 0.16 190)" },
                      children: "— DZ"
                    }
                  )
                ]
              },
              quote
            ))
          }
        )
      ] })
    }
  );
}
const CHECKLIST = [
  { id: "telegram", label: "Have Telegram installed" },
  { id: "blum", label: "Have the Blum Mini App" },
  { id: "binance", label: "Follow @Demon_Zeno on Binance Square" },
  { id: "dmnz", label: "Know when to buy — April 2, 2027" }
];
function ReadinessChecklistSection() {
  const [checked, setChecked] = reactExports.useState(/* @__PURE__ */ new Set());
  function toggle(id) {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }
  const score = checked.size;
  const allDone = score === CHECKLIST.length;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "section",
    {
      "data-ocid": "readiness_checklist.section",
      className: "py-16 md:py-20",
      style: { background: "oklch(0.115 0.015 265)" },
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto px-4 max-w-xl text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "h2",
          {
            className: "font-display font-black text-4xl md:text-5xl tracking-tight mb-2",
            style: { color: "#FFFFFF" },
            children: "ARE YOU READY?"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "p",
          {
            className: "text-xs font-bold uppercase tracking-widest mb-8",
            style: { color: "oklch(0.62 0.16 190)" },
            children: "Check off before April 2, 2027"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "p-6 mb-4",
            style: {
              background: "oklch(0.14 0.015 260)",
              border: `1px solid ${allDone ? "oklch(0.65 0.18 145 / 0.50)" : "oklch(0.22 0.01 260)"}`,
              transition: "border-color 0.3s"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-2 mb-6", children: CHECKLIST.map(({ id, label }) => {
                const isChecked = checked.has(id);
                return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    type: "button",
                    "data-ocid": `readiness_checklist.item.${id}`,
                    onClick: () => toggle(id),
                    className: "flex items-center gap-4 w-full text-left px-4 py-3 transition-all duration-200",
                    style: {
                      background: isChecked ? "oklch(0.65 0.18 145 / 0.10)" : "oklch(0.18 0.01 260)",
                      border: `1px solid ${isChecked ? "oklch(0.65 0.18 145 / 0.40)" : "oklch(0.26 0.01 260)"}`
                    },
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "div",
                        {
                          className: "w-5 h-5 border-2 flex items-center justify-center shrink-0 transition-all duration-200",
                          style: {
                            borderColor: isChecked ? "oklch(0.65 0.18 145)" : "oklch(0.40 0.01 260)",
                            background: isChecked ? "oklch(0.65 0.18 145)" : "transparent"
                          },
                          children: isChecked && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-black font-black leading-none", children: "✓" })
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "span",
                        {
                          className: "text-sm font-bold",
                          style: {
                            color: isChecked ? "oklch(0.70 0.16 145)" : "oklch(0.80 0.005 260)"
                          },
                          children: label
                        }
                      )
                    ]
                  },
                  id
                );
              }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "flex-1 h-1 overflow-hidden",
                    style: { background: "oklch(0.20 0.01 260)" },
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "div",
                      {
                        className: "h-full transition-all duration-500",
                        style: {
                          width: `${score / CHECKLIST.length * 100}%`,
                          background: allDone ? "oklch(0.65 0.18 145)" : "oklch(0.62 0.16 190)"
                        }
                      }
                    )
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "span",
                  {
                    className: "text-xs font-black",
                    style: {
                      color: allDone ? "oklch(0.65 0.18 145)" : "oklch(0.62 0.16 190)"
                    },
                    children: [
                      score,
                      "/",
                      CHECKLIST.length
                    ]
                  }
                )
              ] }),
              allDone && /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "p-3 text-center",
                  style: {
                    background: "oklch(0.65 0.18 145 / 0.12)",
                    border: "1px solid oklch(0.65 0.18 145 / 0.35)"
                  },
                  "data-ocid": "readiness_checklist.success_state",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "p",
                    {
                      className: "font-display font-black text-sm uppercase tracking-widest",
                      style: { color: "oklch(0.70 0.16 145)" },
                      children: "100% READY FOR D-DAY"
                    }
                  )
                }
              )
            ]
          }
        )
      ] })
    }
  );
}
function SmartContractSection() {
  const [copied, setCopied] = reactExports.useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText("TBA — published on April 2, 2027").catch(() => null);
    setCopied(true);
    setTimeout(() => setCopied(false), 2e3);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "section",
    {
      "data-ocid": "contract.section",
      className: "py-16 md:py-20",
      style: { background: "#111111" },
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto px-4 max-w-3xl", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center mb-10", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "span",
            {
              className: "inline-flex items-center gap-2 px-3 py-1 mb-5 text-xs font-bold uppercase tracking-widest",
              style: {
                background: "rgba(220,20,60,0.1)",
                border: "1px solid rgba(220,20,60,0.3)",
                borderRadius: "2px",
                color: "#DC143C"
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-3.5 h-3.5", "aria-hidden": "true" }),
                "LAUNCHING APRIL 2, 2027"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "h2",
            {
              className: "font-display font-black text-3xl md:text-4xl tracking-tight mb-4",
              style: { color: "#FFFFFF" },
              children: [
                "CONTRACT ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "#DC143C" }, children: "ADDRESS" })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm", style: { color: "#A0A0A0" }, children: "DMNZ token contract address will be published here on launch day — April 2, 2027" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "p-6",
            style: {
              background: "#0a0a0a",
              border: "1px solid rgba(220,20,60,0.4)",
              borderRadius: "4px"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "p",
                {
                  className: "text-xs font-bold uppercase tracking-widest mb-3",
                  style: { color: "#A0A0A0" },
                  children: "DMNZ Contract Address (TON / Blum)"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "flex items-center gap-3 p-4 mb-4",
                  style: {
                    background: "#111111",
                    border: "1px solid rgba(220,20,60,0.25)",
                    borderRadius: "2px"
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "code",
                      {
                        className: "flex-1 font-mono text-sm tracking-widest truncate",
                        style: { color: "rgba(220,20,60,0.6)" },
                        children: "0x________________________________ [TBA on Launch Day]"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        type: "button",
                        onClick: handleCopy,
                        "data-ocid": "contract.copy_button",
                        "aria-label": "Copy placeholder address",
                        className: "shrink-0 p-2 transition-smooth",
                        style: {
                          color: copied ? "#22c55e" : "#A0A0A0",
                          border: "1px solid rgba(255,255,255,0.1)",
                          borderRadius: "2px",
                          background: "transparent"
                        },
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { className: "w-4 h-4", "aria-hidden": "true" })
                      }
                    )
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "flex items-start gap-3 p-4",
                  style: {
                    background: "rgba(220,20,60,0.06)",
                    border: "1px solid rgba(220,20,60,0.2)",
                    borderRadius: "2px"
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      ExternalLink,
                      {
                        className: "w-4 h-4 mt-0.5 shrink-0",
                        style: { color: "#DC143C" },
                        "aria-hidden": "true"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs leading-relaxed", style: { color: "#A0A0A0" }, children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { style: { color: "#DC143C" }, children: "SECURITY NOTICE:" }),
                      "Only trust the contract address displayed on this page or published by",
                      " ",
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "a",
                        {
                          href: "https://app.binance.com/uni-qr/cpro/Demon_Zeno?l=en&r=KGTBUDHQ&uc=app_square_share_link&us=copylink",
                          target: "_blank",
                          rel: "noopener noreferrer",
                          className: "underline hover:text-white transition-smooth",
                          style: { color: "#DC143C" },
                          children: "@Demon_Zeno"
                        }
                      ),
                      " ",
                      "on Binance Square. Never buy from unofficial sources."
                    ] })
                  ]
                }
              )
            ]
          }
        )
      ] })
    }
  );
}
const SUPPLY_STATS = [
  {
    label: "TOTAL SUPPLY",
    value: "1,000,000,000",
    unit: "DMNZ",
    color: "#FFFFFF",
    highlight: false
  },
  {
    label: "TEAM ALLOCATION",
    value: "0",
    unit: "DMNZ",
    color: "#22c55e",
    highlight: false
  },
  {
    label: "PRESALE ALLOCATION",
    value: "0",
    unit: "DMNZ",
    color: "#22c55e",
    highlight: false
  },
  {
    label: "COMMUNITY",
    value: "100%",
    unit: "",
    color: "#D4AF37",
    highlight: true
  },
  {
    label: "BURN TARGET",
    value: "TBD",
    unit: "JAN 2028",
    color: "#DC143C",
    highlight: false
  }
];
function SupplyTransparencySection() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "section",
    {
      "data-ocid": "supply.section",
      className: "py-16 md:py-20",
      style: { background: "#111111" },
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto px-4 max-w-4xl", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-10", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "h2",
            {
              className: "font-display font-black uppercase",
              style: {
                fontSize: "clamp(1.75rem, 4vw, 3rem)",
                letterSpacing: "-0.03em",
                color: "#FFFFFF"
              },
              children: [
                "SUPPLY ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "#DC143C" }, children: "TRANSPARENCY" })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "p",
            {
              className: "text-xs font-bold uppercase tracking-widest mt-2",
              style: { color: "#606060" },
              children: "Plain numbers. No hidden wallets."
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "grid grid-cols-2 lg:grid-cols-5 gap-px mb-6",
            style: { background: "rgba(255,255,255,0.06)" },
            children: SUPPLY_STATS.map((stat, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                "data-ocid": `supply.stat.${i + 1}`,
                className: "flex flex-col gap-1 p-5",
                style: {
                  background: "#0a0a0a",
                  borderTop: stat.highlight ? `3px solid ${stat.color}` : "3px solid transparent"
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "p",
                    {
                      className: "text-xs font-bold uppercase tracking-widest",
                      style: { color: "#606060" },
                      children: stat.label
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: "font-display font-black leading-none",
                      style: {
                        color: stat.color,
                        fontSize: "clamp(1.5rem, 3.5vw, 2.5rem)",
                        letterSpacing: "-0.03em"
                      },
                      children: stat.value
                    }
                  ),
                  stat.unit && /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: "text-xs font-bold uppercase tracking-widest",
                      style: { color: "#404040" },
                      children: stat.unit
                    }
                  )
                ]
              },
              stat.label
            ))
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "p-5",
            style: {
              background: "#0a0a0a",
              border: "1px solid rgba(255,255,255,0.06)"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "p",
                  {
                    className: "text-xs font-bold uppercase tracking-widest",
                    style: { color: "#606060" },
                    children: "Token Distribution"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold", style: { color: "#D4AF37" }, children: "100% Community" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "w-full h-5 overflow-hidden",
                  style: { background: "rgba(255,255,255,0.05)" },
                  role: "progressbar",
                  tabIndex: 0,
                  "aria-valuenow": 100,
                  "aria-valuemin": 0,
                  "aria-valuemax": 100,
                  "aria-label": "100% community allocation",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      className: "h-full flex items-center justify-center font-black",
                      style: {
                        width: "100%",
                        background: "linear-gradient(90deg, #DC143C 0%, #D4AF37 100%)",
                        color: "#0a0a0a",
                        fontSize: "9px",
                        letterSpacing: "3px"
                      },
                      children: "COMMUNITY — 100%"
                    }
                  )
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs mt-2", style: { color: "#404040" }, children: "Final supply confirmed April 2, 2027." })
            ]
          }
        )
      ] })
    }
  );
}
function generateSurvivalGuidePDF() {
  const content = `
    <html>
    <head>
      <title>DMNZ Survival Guide</title>
      <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; background: #0a0e1a; color: #e8eaf0; margin: 0; padding: 40px; }
        .header { text-align: center; border-bottom: 2px solid #62dcc8; padding-bottom: 20px; margin-bottom: 30px; }
        .logo { font-size: 3rem; font-weight: 900; color: #62dcc8; letter-spacing: -1px; }
        .subtitle { color: #8892a4; font-size: 1rem; margin-top: 5px; }
        h2 { color: #62dcc8; font-size: 1.2rem; margin-top: 30px; border-left: 3px solid #62dcc8; padding-left: 12px; }
        p, li { color: #b0bac8; font-size: 0.9rem; line-height: 1.7; }
        .step { background: #12182a; border: 1px solid #1e2d3d; border-radius: 8px; padding: 15px; margin: 10px 0; }
        .step-num { color: #62dcc8; font-weight: 900; font-size: 1.2rem; }
        .warning { background: #1a1206; border: 1px solid #9a6210; border-radius: 8px; padding: 15px; margin: 15px 0; }
        .warning-title { color: #e8a020; font-weight: 700; }
        .footer { margin-top: 40px; text-align: center; border-top: 1px solid #1e2d3d; padding-top: 20px; color: #444e5a; font-size: 0.8rem; }
        table { width: 100%; border-collapse: collapse; margin: 15px 0; }
        th { background: #12182a; color: #62dcc8; padding: 10px; text-align: left; font-size: 0.85rem; }
        td { padding: 8px 10px; border-top: 1px solid #1e2d3d; font-size: 0.85rem; color: #8892a4; }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="logo">DMNZ</div>
        <div class="subtitle">DemonZeno Token • Survival Guide</div>
        <div style="color:#8892a4;font-size:0.8rem;margin-top:8px;">The only guide you need before April 2, 2027</div>
      </div>
      <h2>What is DMNZ?</h2>
      <p>DemonZeno (DMNZ) is a meme token launching April 2, 2027 via Blum Mini App on Telegram. 100% fair launch — no presale, no team allocation, no insider advantage.</p>
      <h2>How to Buy DMNZ</h2>
      <div class="step"><span class="step-num">01</span> Follow <strong style="color:#e8c04a">@Demon_Zeno</strong> on Binance Square for all launch alerts.</div>
      <div class="step"><span class="step-num">02</span> Install Telegram. Open the Blum Mini App.</div>
      <div class="step"><span class="step-num">03</span> On April 2, 2027 — search <strong>DemonZeno DMNZ</strong> inside Blum and buy.</div>
      <h2>The Roadmap</h2>
      <table>
        <tr><th>Date</th><th>Milestone</th><th>Status</th></tr>
        <tr><td>2026</td><td>Community Building Year</td><td>In Progress</td></tr>
        <tr><td>Apr 2, 2027</td><td>DMNZ Fair Launch on Blum</td><td>Upcoming</td></tr>
        <tr><td>Jan 1, 2028</td><td>Huge Buyback &amp; Burn Event</td><td>Planned</td></tr>
      </table>
      <h2>Key Terms</h2>
      <p><strong style="color:#62dcc8">Bonding Curve:</strong> Price rises as more tokens are bought.<br>
      <strong style="color:#62dcc8">Burn:</strong> Tokens permanently removed — supply cut 50% in January 2028.<br>
      <strong style="color:#62dcc8">Fair Launch:</strong> Everyone enters at the same price. No presale.</p>
      <div class="warning">
        <div class="warning-title">DISCLAIMER</div>
        <p>DMNZ is a meme coin. Not financial advice. Never invest more than you can afford to lose.</p>
      </div>
      <div class="footer">
        <p>DemonZeno • DMNZ Token • @Demon_Zeno on Binance Square</p>
        <p>"Trade Like a God. Hold Like a Demon."</p>
      </div>
    </body>
    </html>
  `;
  const w = window.open("", "_blank");
  if (w) {
    w.document.write(content);
    w.document.close();
    w.focus();
    setTimeout(() => w.print(), 500);
  }
}
function SurvivalGuideSection() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "section",
    {
      "data-ocid": "survival_guide.section",
      className: "py-16 md:py-20",
      style: { background: "oklch(0.10 0.01 260)" },
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto px-4 max-w-xl text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "inline-flex items-center gap-2 mb-4 px-3 py-1",
            style: {
              background: "oklch(0.62 0.16 190 / 0.10)",
              border: "1px solid oklch(0.62 0.16 190 / 0.30)"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                FileText,
                {
                  className: "w-3.5 h-3.5",
                  style: { color: "oklch(0.62 0.16 190)" }
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: "text-xs font-black uppercase tracking-widest",
                  style: { color: "oklch(0.62 0.16 190)" },
                  children: "Free Guide"
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "h2",
          {
            className: "font-display font-black text-4xl md:text-5xl tracking-tight mb-2",
            style: { color: "#FFFFFF" },
            children: "DMNZ SURVIVAL GUIDE"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "p",
          {
            className: "text-xs font-bold uppercase tracking-widest mb-8",
            style: { color: "oklch(0.62 0.16 190)" },
            children: "Everything you need before April 2, 2027."
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            "data-ocid": "survival_guide.download_button",
            onClick: generateSurvivalGuidePDF,
            className: "inline-flex items-center gap-2.5 px-8 py-4 font-black text-sm uppercase tracking-widest transition-all duration-200 hover:opacity-90",
            style: {
              background: "oklch(0.62 0.16 190)",
              color: "oklch(0.10 0.01 260)"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "w-4 h-4" }),
              "Download PDF"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-3", children: "Opens print dialog — save as PDF" })
      ] })
    }
  );
}
const ROWS = [
  { feature: "FAIR LAUNCH", dmnz: true, others: false },
  { feature: "NO PRESALE", dmnz: true, others: false },
  { feature: "NO TEAM ALLOCATION", dmnz: true, others: false },
  { feature: "NO HIDDEN WALLETS", dmnz: true, others: false },
  { feature: "PUBLIC ROADMAP", dmnz: true, others: false },
  { feature: "BONDING CURVE MODEL", dmnz: true, others: false },
  { feature: "BURN EVENT COMMITTED", dmnz: true, others: false }
];
function TokenComparisonSection() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "section",
    {
      id: "token",
      "data-ocid": "comparison.section",
      className: "py-16 md:py-20",
      style: { background: "#0a0a0a" },
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto px-4 max-w-3xl", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center mb-10", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "h2",
            {
              className: "font-display font-black text-3xl md:text-5xl tracking-tight mb-3",
              style: { color: "#FFFFFF" },
              children: [
                "DMNZ ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "#DC143C" }, children: "VS" }),
                " THE REST"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "p",
            {
              className: "text-xs uppercase tracking-widest",
              style: { color: "#606060" },
              children: "The only meme coin that checks every box."
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "overflow-x-auto",
            style: { border: "1px solid rgba(255,255,255,0.08)" },
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full", "data-ocid": "comparison.table", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { style: { background: "#141414" }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "th",
                  {
                    className: "text-left px-6 py-4 text-xs font-bold uppercase tracking-widest",
                    style: { color: "#606060" },
                    children: "CRITERION"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "th",
                  {
                    className: "px-6 py-4 text-center",
                    style: { background: "rgba(220,20,60,0.06)" },
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        className: "font-display font-black text-sm uppercase tracking-widest",
                        style: { color: "#DC143C" },
                        children: "DMNZ"
                      }
                    )
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-6 py-4 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "font-display font-black text-sm uppercase tracking-widest",
                    style: { color: "rgba(255,255,255,0.3)" },
                    children: "OTHERS"
                  }
                ) })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: ROWS.map((row, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "tr",
                {
                  "data-ocid": `comparison.row.${i + 1}`,
                  style: {
                    background: i % 2 === 0 ? "#0f0f0f" : "#111111",
                    borderTop: "1px solid rgba(255,255,255,0.05)"
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "td",
                      {
                        className: "px-6 py-3.5 text-xs font-bold uppercase tracking-wider",
                        style: { color: "#FFFFFF" },
                        children: row.feature
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "td",
                      {
                        className: "px-6 py-3.5 text-center",
                        style: { background: "rgba(220,20,60,0.04)" },
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                          CircleCheckBig,
                          {
                            className: "w-5 h-5 mx-auto",
                            style: { color: "#DC143C" }
                          }
                        )
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-6 py-3.5 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                      CircleX,
                      {
                        className: "w-5 h-5 mx-auto",
                        style: { color: "rgba(255,255,255,0.2)" }
                      }
                    ) })
                  ]
                },
                row.feature
              )) })
            ] })
          }
        )
      ] })
    }
  );
}
const POINTS$1 = [
  { Icon: Ban, label: "NO PRESALE", sub: "Zero early access" },
  {
    Icon: ShieldCheck,
    label: "NO TEAM ALLOCATION",
    sub: "Zero reserved tokens"
  },
  {
    Icon: TrendingUp,
    label: "NO HIDDEN WALLETS",
    sub: "Full on-chain transparency"
  }
];
function TokenomicsExplainerSection() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "section",
    {
      "data-ocid": "tokenomics_explainer.section",
      className: "py-16 md:py-20",
      style: { background: "#111111" },
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto px-4 max-w-4xl text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "h2",
          {
            className: "font-display font-black text-4xl md:text-6xl tracking-tight mb-4",
            style: { color: "#FFFFFF" },
            children: "NO TOKENOMICS."
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "h2",
          {
            className: "font-display font-black text-4xl md:text-6xl tracking-tight mb-12",
            style: { color: "#DC143C" },
            children: "FULL FAIR LAUNCH."
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: POINTS$1.map((point, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            "data-ocid": `tokenomics.point.${i + 1}`,
            className: "flex flex-col items-center gap-3 p-6",
            style: {
              background: "#0a0a0a",
              border: "1px solid rgba(220,20,60,0.2)"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                point.Icon,
                {
                  className: "w-6 h-6",
                  style: { color: "#DC143C" },
                  "aria-hidden": "true"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "p",
                {
                  className: "font-display font-black text-sm uppercase tracking-widest",
                  style: { color: "#FFFFFF" },
                  children: point.label
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs", style: { color: "#606060" }, children: point.sub })
            ]
          },
          point.label
        )) })
      ] })
    }
  );
}
const POINTS = [
  {
    Icon: Rocket,
    label: "FAIR LAUNCH ON BLUM",
    sub: "No presale. No allocation."
  },
  { Icon: MapPin, label: "PUBLIC ROADMAP", sub: "Every milestone documented." },
  { Icon: Gem, label: "NO HIDDEN WALLETS", sub: "Full on-chain transparency." }
];
function VerifiedProjectSection() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "section",
    {
      "data-ocid": "verified.section",
      className: "py-16 md:py-20",
      style: { background: "#111111" },
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto px-4 max-w-4xl", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center mb-10", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "inline-flex items-center gap-3 mb-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              ShieldCheck,
              {
                className: "w-7 h-7",
                style: { color: "#D4AF37" },
                "aria-hidden": "true"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "h2",
              {
                className: "font-display font-black text-3xl md:text-5xl tracking-tight",
                style: { color: "#FFFFFF" },
                children: [
                  "VERIFIED ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "#D4AF37" }, children: "PROJECT" })
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "p",
            {
              className: "text-xs uppercase tracking-widest",
              style: { color: "#606060" },
              children: "Transparency. Not certificates."
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: POINTS.map((point, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            "data-ocid": `verified.item.${i + 1}`,
            className: "flex flex-col items-center gap-4 p-6 text-center",
            style: {
              background: "#0a0a0a",
              border: "1px solid rgba(212,175,55,0.2)"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "w-10 h-10 flex items-center justify-center",
                  style: { background: "rgba(212,175,55,0.1)" },
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(point.Icon, { className: "w-5 h-5", style: { color: "#D4AF37" } })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "p",
                  {
                    className: "font-display font-black text-xs uppercase tracking-widest mb-1",
                    style: { color: "#D4AF37" },
                    children: point.label
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs", style: { color: "#606060" }, children: point.sub })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "mt-auto pt-3 w-full border-t",
                  style: { borderColor: "rgba(212,175,55,0.15)" },
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: "text-xs font-bold uppercase tracking-widest",
                      style: { color: "#D4AF37" },
                      children: "VERIFIED"
                    }
                  )
                }
              )
            ]
          },
          point.label
        )) })
      ] })
    }
  );
}
const ENEMIES = [
  {
    Icon: Swords,
    title: "RUG PULLS",
    desc: "No team allocation. No one can dump what no one controls."
  },
  {
    Icon: Banknote,
    title: "WHALE MANIPULATION",
    desc: "Fair launch. No dominant position from day one."
  },
  {
    Icon: Lock,
    title: "PRESALE ADVANTAGE",
    desc: "Zero presale. Period. Everyone enters at the same price."
  },
  {
    Icon: Shield,
    title: "FAKE HYPE",
    desc: "Public roadmap. Committed burn. Real community."
  },
  {
    Icon: Eye,
    title: "ANONYMOUS TEAMS",
    desc: "DemonZeno is publicly known — @Demon_Zeno on Binance Square."
  },
  {
    Icon: Diamond,
    title: "VC INSIDER CONTROL",
    desc: "No VC involvement. No institutional advantage. Just community."
  }
];
function VillainArcSection() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "section",
    {
      "data-ocid": "villain_arc.section",
      className: "py-16 md:py-20 relative overflow-hidden",
      style: { background: "oklch(0.10 0.01 260)" },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "absolute inset-0 pointer-events-none",
            style: {
              background: "radial-gradient(ellipse at center, oklch(0.55 0.22 25 / 0.04) 0%, transparent 70%)"
            },
            "aria-hidden": "true"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto px-4 max-w-4xl relative z-10", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-10", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "h2",
              {
                className: "font-display font-black uppercase",
                style: {
                  fontSize: "clamp(1.75rem, 4vw, 3rem)",
                  letterSpacing: "-0.03em",
                  color: "var(--foreground)"
                },
                children: [
                  "ENEMIES OF",
                  " ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "oklch(0.70 0.18 25)" }, children: "THE PEOPLE" })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "p",
              {
                className: "text-xs font-bold uppercase tracking-widest mt-2",
                style: { color: "var(--muted-foreground)" },
                children: "What DemonZeno fights against — and why DMNZ is the answer."
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid sm:grid-cols-2 gap-3", children: ENEMIES.map(({ Icon, title, desc }, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              "data-ocid": `villain_arc.enemy.${i + 1}`,
              className: "flex gap-4 p-5",
              style: {
                background: "oklch(0.14 0.015 260)",
                border: "1px solid oklch(0.55 0.22 25 / 0.15)",
                borderLeft: "2px solid oklch(0.70 0.18 25)"
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Icon,
                  {
                    className: "w-5 h-5 shrink-0 mt-0.5",
                    style: { color: "oklch(0.70 0.18 25)" }
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "p",
                    {
                      className: "font-display font-black text-xs uppercase tracking-widest mb-1",
                      style: { color: "oklch(0.70 0.18 25)" },
                      children: title
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: desc })
                ] })
              ]
            },
            title
          )) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "mt-6 p-6 text-center",
              style: {
                background: "oklch(0.55 0.22 25 / 0.07)",
                border: "1px solid oklch(0.55 0.22 25 / 0.22)"
              },
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                "p",
                {
                  className: "font-display font-black uppercase tracking-tight text-xl",
                  style: { color: "var(--foreground)" },
                  children: "DMNZ IS THE COUNTER-ATTACK."
                }
              )
            }
          )
        ] })
      ]
    }
  );
}
function VisionSection() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "section",
    {
      "data-ocid": "vision.section",
      className: "py-16 md:py-24 relative overflow-hidden",
      style: { background: "oklch(0.10 0.01 260)" },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "absolute inset-0 pointer-events-none",
            style: {
              background: "radial-gradient(ellipse at 70% 50%, oklch(0.62 0.16 190 / 0.04) 0%, transparent 60%)"
            },
            "aria-hidden": "true"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto px-4 max-w-2xl relative z-10", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "h2",
            {
              className: "font-display font-black uppercase mb-8",
              style: {
                fontSize: "clamp(1.75rem, 4vw, 3rem)",
                letterSpacing: "-0.03em",
                color: "var(--foreground)"
              },
              children: [
                "THE ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "oklch(0.62 0.16 190)" }, children: "VISION" })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "p-8 flex flex-col gap-5",
              style: {
                background: "oklch(0.14 0.015 260)",
                border: "1px solid oklch(0.62 0.16 190 / 0.20)",
                borderLeft: "3px solid oklch(0.62 0.16 190)"
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "p",
                  {
                    className: "font-display font-black text-lg uppercase leading-snug",
                    style: { color: "var(--foreground)", letterSpacing: "-0.01em" },
                    children: "Build the most disciplined meme token community in crypto."
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "p",
                  {
                    className: "text-sm leading-relaxed",
                    style: { color: "var(--muted-foreground)" },
                    children: "Not one more rug. Not one more presale. A fair launch where every holder entered at the same price — and the January 2028 burn is a commitment already made, not a promise to be broken."
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    className: "pt-4 border-t flex items-center gap-3",
                    style: { borderColor: "oklch(0.22 0.01 260)" },
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "img",
                        {
                          src: "/assets/demonzeno-real.png",
                          alt: "DemonZeno",
                          className: "w-10 h-10 rounded-full object-cover object-top",
                          style: { border: "2px solid oklch(0.62 0.16 190 / 0.50)" },
                          onError: (e) => {
                            e.target.src = "/assets/demonzeno-character.png";
                          }
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-bold text-foreground text-sm", children: "— DemonZeno" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "a",
                          {
                            href: "https://app.binance.com/uni-qr/cpro/Demon_Zeno?l=en&r=KGTBUDHQ&uc=app_square_share_link&us=copylink",
                            target: "_blank",
                            rel: "noopener noreferrer",
                            className: "text-xs hover:underline",
                            style: { color: "oklch(0.62 0.16 190)" },
                            children: "@Demon_Zeno on Binance Square"
                          }
                        )
                      ] })
                    ]
                  }
                )
              ]
            }
          )
        ] })
      ]
    }
  );
}
const WHITEPAPER_SECTIONS = [
  { num: "01", title: "Project Vision" },
  { num: "02", title: "Fair Launch Model" },
  { num: "03", title: "Tokenomics-Free Approach" },
  { num: "04", title: "Burn Mechanism" },
  { num: "05", title: "Public Roadmap" },
  { num: "06", title: "Risk Disclosure" }
];
function generatePDF() {
  const printWindow = window.open("", "_blank", "width=900,height=700");
  if (!printWindow) return;
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>DMNZ Whitepaper</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&family=Space+Grotesk:wght@700;800&display=swap');
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { background: #0a0a0a; color: #fff; font-family: 'Inter', sans-serif; padding: 0; }
    .cover { background: #0a0a0a; min-height: 100vh; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; padding: 60px 40px; page-break-after: always; border-bottom: 3px solid #DC143C; }
    .cover-title { font-family: 'Space Grotesk', sans-serif; font-weight: 900; font-size: 52px; color: #fff; letter-spacing: -2px; line-height: 1.1; margin-bottom: 12px; }
    .cover-title span { color: #DC143C; }
    .cover-sub { font-size: 18px; color: #A0A0A0; margin-bottom: 40px; }
    .cover-badge { display: inline-block; background: rgba(220,20,60,0.1); border: 1px solid rgba(220,20,60,0.4); color: #DC143C; padding: 8px 20px; font-weight: 700; font-size: 12px; letter-spacing: 3px; text-transform: uppercase; }
    .cover-meta { margin-top: 40px; color: #606060; font-size: 12px; line-height: 2; }
    .content { padding: 60px; max-width: 800px; margin: 0 auto; }
    .section-block { margin-bottom: 48px; }
    .section-num { font-family: 'Space Grotesk', sans-serif; font-size: 11px; color: #DC143C; letter-spacing: 3px; text-transform: uppercase; margin-bottom: 8px; }
    .section-title { font-family: 'Space Grotesk', sans-serif; font-weight: 800; font-size: 24px; color: #fff; margin-bottom: 16px; border-bottom: 1px solid rgba(220,20,60,0.2); padding-bottom: 8px; }
    .section-body { color: #C0C0C0; font-size: 14px; line-height: 1.8; white-space: pre-wrap; }
    .footer { text-align: center; padding: 40px; border-top: 1px solid rgba(255,255,255,0.08); color: #606060; font-size: 11px; line-height: 2; }
    .footer span { color: #DC143C; }
    @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
  </style>
</head>
<body>
  <div class="cover">
    <div class="cover-title">DMNZ — THE <span>DEMONZENO</span> TOKEN</div>
    <div class="cover-sub">A Fair Launch Meme Token on Blum</div>
    <div class="cover-badge">Official Whitepaper · Version 1.0</div>
    <div class="cover-meta">Created by DemonZeno · @Demon_Zeno on Binance Square<br/>Twitter: @ZenoDemon<br/>Launch Date: April 2, 2027 · Blum Mini App<br/>Burn Date: January 1, 2028</div>
  </div>
  <div class="content">
    <div class="section-block"><div class="section-num">Section 01</div><div class="section-title">Introduction</div><div class="section-body">DMNZ is a fair-launch meme token created by DemonZeno (@Demon_Zeno on Binance Square) and launched exclusively through the Blum Mini App on Telegram on April 2, 2027. This document explains what DMNZ is, why it exists, and what it commits to. It is not a financial prospectus. It is a declaration of intent.</div></div>
    <div class="section-block"><div class="section-num">Section 02</div><div class="section-title">The Vision</div><div class="section-body">DemonZeno created DMNZ to prove one thing: a meme token can be launched with integrity. No presale. No team allocation. No insider buys. No hidden wallets. Just a token that launches fairly, builds a community, and delivers on what it promises.

DMNZ is not trying to compete with Bitcoin or Ethereum. It is a meme token. But it will be the most honest meme token in existence.</div></div>
    <div class="section-block"><div class="section-num">Section 03</div><div class="section-title">Why No Tokenomics?</div><div class="section-body">Tokenomics documents are tools for deception. They create the illusion of planning while hiding massive allocations for founders, VCs, and insiders. DMNZ rejects this entirely.

The supply exists. It launches on Blum. Every buyer enters at the same price via the bonding curve. There is nothing to allocate because there is nothing to hide.</div></div>
    <div class="section-block"><div class="section-num">Section 04</div><div class="section-title">The Fair Launch Model</div><div class="section-body">DMNZ launches on Blum Mini App (Telegram) on April 2, 2027. The bonding curve determines price — not DemonZeno, not a team, not any insider. When you buy, you are buying from the curve. When others buy after you, the price rises.

This is the purest form of market-determined price discovery. No one gets a better entry than you based on who they know.</div></div>
    <div class="section-block"><div class="section-num">Section 05</div><div class="section-title">The Burn Mechanism</div><div class="section-body">On January 1, 2028, DemonZeno commits to a massive buyback and burn of DMNZ tokens. This event is designed to permanently reduce the circulating supply, creating scarcity and rewarding early holders who believed before the mainstream discovered DMNZ.

The burn is a promise. It is documented here. It will happen.</div></div>
    <div class="section-block"><div class="section-num">Section 06</div><div class="section-title">Who Is DemonZeno?</div><div class="section-body">DemonZeno is a public figure on Binance Square (@Demon_Zeno). His identity is not anonymous. His posting history, community engagement, and public statements are all verifiable.

He is not a developer hiding behind a project. He is a creator who stands behind everything DMNZ commits to.</div></div>
    <div class="section-block"><div class="section-num">Section 07</div><div class="section-title">Roadmap</div><div class="section-body">2026: Community Building Year
  — Growing the DMNZ community on Binance Square before launch

April 2, 2027: DMNZ goes live on Blum Mini App
  — Fair launch via bonding curve
  — Contract address published publicly on launch day

January 1, 2028: Massive buyback and burn
  — Permanent reduction of circulating supply</div></div>
    <div class="section-block"><div class="section-num">Section 08</div><div class="section-title">Risks</div><div class="section-body">DMNZ is a meme token. Meme tokens are volatile. You can lose everything you invest. Do not invest money you cannot afford to lose.

This is not financial advice. DMNZ makes no guarantees of price performance.</div></div>
    <div class="section-block"><div class="section-num">Section 09</div><div class="section-title">Disclaimer</div><div class="section-body">DMNZ is a meme coin created for entertainment and community purposes. It is not a security, not an investment product, and not a financial instrument. Nothing on this site or in this document constitutes financial advice. DemonZeno is not a financial advisor. Buy DMNZ at your own risk.</div></div>
  </div>
  <div class="footer"><span>DMNZ</span> — @Demon_Zeno on Binance Square · Twitter: @ZenoDemon<br/>Launch: April 2, 2027 · Burn: January 1, 2028 · Platform: Blum Mini App<br/>This document is a public commitment. Not financial advice.</div>
  <script>window.onload = function() { window.print(); }<\/script>
</body>
</html>`;
  printWindow.document.write(html);
  printWindow.document.close();
}
function WhitepaperSection() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "section",
    {
      "data-ocid": "whitepaper.section",
      className: "py-16 md:py-20",
      style: { background: "#0a0a0a" },
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto px-4 max-w-4xl", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center mb-10", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "inline-flex items-center gap-3 mb-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              FileText,
              {
                className: "w-6 h-6",
                style: { color: "#DC143C" },
                "aria-hidden": "true"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "h2",
              {
                className: "font-display font-black text-3xl md:text-5xl tracking-tight",
                style: { color: "#FFFFFF" },
                children: [
                  "THE DMNZ ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "#DC143C" }, children: "WHITEPAPER" })
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "p",
            {
              className: "font-display font-black text-sm uppercase tracking-widest",
              style: { color: "rgba(255,255,255,0.6)" },
              children: "EVERYTHING DMNZ STANDS FOR. IN ONE DOCUMENT."
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6 mb-8", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "p-5",
              style: {
                background: "#111111",
                border: "1px solid rgba(220,20,60,0.2)"
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "p",
                  {
                    className: "text-xs font-bold uppercase tracking-widest mb-4",
                    style: { color: "#DC143C" },
                    children: "WHAT'S COVERED"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "flex flex-col gap-2.5", children: WHITEPAPER_SECTIONS.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-center gap-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: "font-mono text-xs font-bold shrink-0",
                      style: { color: "#DC143C" },
                      children: s.num
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "p",
                    {
                      className: "text-sm font-bold uppercase tracking-wide",
                      style: { color: "#FFFFFF" },
                      children: s.title
                    }
                  )
                ] }, s.num)) })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "p-5 flex-1",
                style: {
                  background: "#111111",
                  border: "1px solid rgba(255,255,255,0.08)"
                },
                children: /* @__PURE__ */ jsxRuntimeExports.jsx("dl", { className: "flex flex-col gap-2 text-sm", children: [
                  ["Author", "DemonZeno"],
                  ["Published", "2026"],
                  ["Version", "1.0"],
                  ["Platform", "Blum Mini App"],
                  ["Launch", "April 2, 2027"]
                ].map(([label, value]) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between gap-4", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "dt",
                    {
                      className: "text-xs uppercase tracking-widest",
                      style: { color: "#606060" },
                      children: label
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "dd",
                    {
                      className: "text-xs font-bold",
                      style: { color: "#FFFFFF" },
                      children: value
                    }
                  )
                ] }, label)) })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                onClick: generatePDF,
                "data-ocid": "whitepaper.download_button",
                className: "btn-primary w-full flex items-center justify-center gap-3 py-4 text-sm",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "w-4 h-4", "aria-hidden": "true" }),
                  "DOWNLOAD WHITEPAPER (PDF)"
                ]
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "py-3 px-4 text-center",
            style: {
              background: "rgba(220,20,60,0.04)",
              border: "1px solid rgba(220,20,60,0.12)"
            },
            children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs", style: { color: "#606060" }, children: "Public commitment, not financial advice. DMNZ is a meme coin." })
          }
        )
      ] })
    }
  );
}
function Home() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(HeroSection, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { id: "token", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(TokenomicsExplainerSection, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TokenComparisonSection, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx(SupplyTransparencySection, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx(BondingCurveSection, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx(LaunchPriceMechanicsSection, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx(HolderBenefitsSection, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx(SmartContractSection, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx(ContractRevealSection, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx(SurvivalGuideSection, {})
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { id: "story", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(LegendSection, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx(OriginStorySection, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx(VillainArcSection, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CharacterTraitsSection, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx(VisionSection, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx(QuotesWallSection, {})
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { id: "credibility", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(WhitepaperSection, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx(VerifiedProjectSection, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx(AuditReadinessSection, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx(BewareOfFakesSection, {})
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(CredentialsSection, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(BinancePostsSection, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(LetterToBelieverSection, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { id: "community", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(EarlyBelieverSection, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CommunityPledgeSection, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx(AmbassadorSection, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx(HypeWallSection, {})
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { id: "dday", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DDaySection, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx(ReadinessChecklistSection, {})
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { id: "roadmap", children: /* @__PURE__ */ jsxRuntimeExports.jsx(InteractiveRoadmapSection, {}) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AskDemonZenoSection, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(GlossarySection, {})
  ] });
}
export {
  Home
};
