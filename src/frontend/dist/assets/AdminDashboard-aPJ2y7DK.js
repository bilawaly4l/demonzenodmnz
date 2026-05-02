var __typeError = (msg) => {
  throw TypeError(msg);
};
var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
var __privateSet = (obj, member, value, setter) => (__accessCheck(obj, member, "write to private field"), setter ? setter.call(obj, value) : member.set(obj, value), value);
var __privateMethod = (obj, member, method) => (__accessCheck(obj, member, "access private method"), method);
var _client, _currentResult, _currentMutation, _mutateOptions, _MutationObserver_instances, updateResult_fn, notify_fn, _a;
import { f as Subscribable, s as shallowEqualObjects, h as hashKey, g as getDefaultState, n as notifyManager, i as useQueryClient, r as reactExports, k as noop, l as shouldThrowError, c as createLucideIcon, j as jsxRuntimeExports, u as useSession, L as Link, H as House, A as Award, a as useActor, b as useQuery, B as BookOpen, X, m as useQuizAttemptStats, o as useAnnouncementBanner, p as useTierDisabledStates, q as useFeaturedCertificates, d as createActor } from "./index-LpNaIZiB.js";
import { B as Badge, S as ShieldCheck } from "./badge-BsFgkTBp.js";
import { c as cn, a as createSlot, B as Button } from "./button-CM5rLxPe.js";
import { T as Trophy, S as Search, I as Input } from "./input-BtQJcYzA.js";
import { S as Skeleton } from "./skeleton-DuaaQ12_.js";
import { S as Shield, G as Globe, D as Download, a as Star } from "./star-BrTRvvX0.js";
import { L as Lock, a as ChevronUp, C as ChevronDown } from "./lock-BYZzel-E.js";
var MutationObserver = (_a = class extends Subscribable {
  constructor(client, options) {
    super();
    __privateAdd(this, _MutationObserver_instances);
    __privateAdd(this, _client);
    __privateAdd(this, _currentResult);
    __privateAdd(this, _currentMutation);
    __privateAdd(this, _mutateOptions);
    __privateSet(this, _client, client);
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
    this.options = __privateGet(this, _client).defaultMutationOptions(options);
    if (!shallowEqualObjects(this.options, prevOptions)) {
      __privateGet(this, _client).getMutationCache().notify({
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
    __privateMethod(this, _MutationObserver_instances, notify_fn).call(this, action);
  }
  getCurrentResult() {
    return __privateGet(this, _currentResult);
  }
  reset() {
    var _a2;
    (_a2 = __privateGet(this, _currentMutation)) == null ? void 0 : _a2.removeObserver(this);
    __privateSet(this, _currentMutation, void 0);
    __privateMethod(this, _MutationObserver_instances, updateResult_fn).call(this);
    __privateMethod(this, _MutationObserver_instances, notify_fn).call(this);
  }
  mutate(variables, options) {
    var _a2;
    __privateSet(this, _mutateOptions, options);
    (_a2 = __privateGet(this, _currentMutation)) == null ? void 0 : _a2.removeObserver(this);
    __privateSet(this, _currentMutation, __privateGet(this, _client).getMutationCache().build(__privateGet(this, _client), this.options));
    __privateGet(this, _currentMutation).addObserver(this);
    return __privateGet(this, _currentMutation).execute(variables);
  }
}, _client = new WeakMap(), _currentResult = new WeakMap(), _currentMutation = new WeakMap(), _mutateOptions = new WeakMap(), _MutationObserver_instances = new WeakSet(), updateResult_fn = function() {
  var _a2;
  const state = ((_a2 = __privateGet(this, _currentMutation)) == null ? void 0 : _a2.state) ?? getDefaultState();
  __privateSet(this, _currentResult, {
    ...state,
    isPending: state.status === "pending",
    isSuccess: state.status === "success",
    isError: state.status === "error",
    isIdle: state.status === "idle",
    mutate: this.mutate,
    reset: this.reset
  });
}, notify_fn = function(action) {
  notifyManager.batch(() => {
    var _a2, _b, _c, _d, _e, _f, _g, _h;
    if (__privateGet(this, _mutateOptions) && this.hasListeners()) {
      const variables = __privateGet(this, _currentResult).variables;
      const onMutateResult = __privateGet(this, _currentResult).context;
      const context = {
        client: __privateGet(this, _client),
        meta: this.options.meta,
        mutationKey: this.options.mutationKey
      };
      if ((action == null ? void 0 : action.type) === "success") {
        try {
          (_b = (_a2 = __privateGet(this, _mutateOptions)).onSuccess) == null ? void 0 : _b.call(
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
      listener(__privateGet(this, _currentResult));
    });
  });
}, _a);
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
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$9 = [
  ["path", { d: "M10.268 21a2 2 0 0 0 3.464 0", key: "vwvbt9" }],
  ["path", { d: "M22 8c0-2.3-.8-4.3-2-6", key: "5bb3ad" }],
  [
    "path",
    {
      d: "M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326",
      key: "11g9vi"
    }
  ],
  ["path", { d: "M4 2C2.8 3.7 2 5.7 2 8", key: "tap9e0" }]
];
const BellRing = createLucideIcon("bell-ring", __iconNode$9);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$8 = [
  ["path", { d: "M3 3v16a2 2 0 0 0 2 2h16", key: "c24i48" }],
  ["path", { d: "M18 17V9", key: "2bz60n" }],
  ["path", { d: "M13 17V5", key: "1frdt8" }],
  ["path", { d: "M8 17v-3", key: "17ska0" }]
];
const ChartColumn = createLucideIcon("chart-column", __iconNode$8);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$7 = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "M8 12h8", key: "1wcyev" }],
  ["path", { d: "M12 8v8", key: "napkw2" }]
];
const CirclePlus = createLucideIcon("circle-plus", __iconNode$7);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$6 = [
  ["path", { d: "M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z", key: "i9b6wo" }],
  ["line", { x1: "4", x2: "4", y1: "22", y2: "15", key: "1cm3nv" }]
];
const Flag = createLucideIcon("flag", __iconNode$6);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$5 = [
  ["rect", { width: "7", height: "9", x: "3", y: "3", rx: "1", key: "10lvy0" }],
  ["rect", { width: "7", height: "5", x: "14", y: "3", rx: "1", key: "16une8" }],
  ["rect", { width: "7", height: "9", x: "14", y: "12", rx: "1", key: "1hutg5" }],
  ["rect", { width: "7", height: "5", x: "3", y: "16", rx: "1", key: "ldoo1y" }]
];
const LayoutDashboard = createLucideIcon("layout-dashboard", __iconNode$5);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$4 = [
  ["path", { d: "M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8", key: "v9h5vc" }],
  ["path", { d: "M21 3v5h-5", key: "1q7to0" }],
  ["path", { d: "M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16", key: "3uifl3" }],
  ["path", { d: "M8 16H3v5", key: "1cv678" }]
];
const RefreshCw = createLucideIcon("refresh-cw", __iconNode$4);
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
  ["path", { d: "M12 8v4", key: "1got3b" }],
  ["path", { d: "M12 16h.01", key: "1drbdi" }]
];
const ShieldAlert = createLucideIcon("shield-alert", __iconNode$3);
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
      d: "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",
      key: "oel41y"
    }
  ],
  ["path", { d: "m14.5 9.5-5 5", key: "17q4r4" }],
  ["path", { d: "m9.5 9.5 5 5", key: "18nt4w" }]
];
const ShieldX = createLucideIcon("shield-x", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "M8.34 8.34 2 9.27l5 4.87L5.82 21 12 17.77 18.18 21l-.59-3.43", key: "16m0ql" }],
  ["path", { d: "M18.42 12.76 22 9.27l-6.91-1L12 2l-1.44 2.91", key: "1vt8nq" }],
  ["line", { x1: "2", x2: "22", y1: "2", y2: "22", key: "a6p6uj" }]
];
const StarOff = createLucideIcon("star-off", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M3 6h18", key: "d0wm0j" }],
  ["path", { d: "M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6", key: "4alrt4" }],
  ["path", { d: "M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2", key: "v07s0e" }],
  ["line", { x1: "10", x2: "10", y1: "11", y2: "17", key: "1uufr5" }],
  ["line", { x1: "14", x2: "14", y1: "11", y2: "17", key: "xtxkd" }]
];
const Trash2 = createLucideIcon("trash-2", __iconNode);
function Card({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      "data-slot": "card",
      className: cn(
        "bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm",
        className
      ),
      ...props
    }
  );
}
var NODES = [
  "a",
  "button",
  "div",
  "form",
  "h2",
  "h3",
  "img",
  "input",
  "label",
  "li",
  "nav",
  "ol",
  "p",
  "select",
  "span",
  "svg",
  "ul"
];
var Primitive = NODES.reduce((primitive, node) => {
  const Slot = createSlot(`Primitive.${node}`);
  const Node = reactExports.forwardRef((props, forwardedRef) => {
    const { asChild, ...primitiveProps } = props;
    const Comp = asChild ? Slot : node;
    if (typeof window !== "undefined") {
      window[Symbol.for("radix-ui")] = true;
    }
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Comp, { ...primitiveProps, ref: forwardedRef });
  });
  Node.displayName = `Primitive.${node}`;
  return { ...primitive, [node]: Node };
}, {});
var NAME = "Label";
var Label$1 = reactExports.forwardRef((props, forwardedRef) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Primitive.label,
    {
      ...props,
      ref: forwardedRef,
      onMouseDown: (event) => {
        var _a2;
        const target = event.target;
        if (target.closest("button, input, select, textarea")) return;
        (_a2 = props.onMouseDown) == null ? void 0 : _a2.call(props, event);
        if (!event.defaultPrevented && event.detail > 1) event.preventDefault();
      }
    }
  );
});
Label$1.displayName = NAME;
var Root = Label$1;
function Label({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Root,
    {
      "data-slot": "label",
      className: cn(
        "flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        className
      ),
      ...props
    }
  );
}
const TIER_COLORS = {
  beginner: "bg-primary/20 text-primary border-primary/30",
  intermediate: "bg-[oklch(0.65_0.14_70/0.2)] text-[oklch(0.65_0.14_70)] border-[oklch(0.65_0.14_70/0.3)]",
  advanced: "bg-[oklch(0.65_0.15_130/0.2)] text-[oklch(0.65_0.15_130)] border-[oklch(0.65_0.15_130/0.3)]",
  expert: "bg-[oklch(0.65_0.18_260/0.2)] text-[oklch(0.65_0.18_260)] border-[oklch(0.65_0.18_260/0.3)]",
  master: "bg-[oklch(0.7_0.18_70/0.2)] text-[oklch(0.7_0.18_70)] border-[oklch(0.7_0.18_70/0.3)]"
};
const TIERS = ["beginner", "intermediate", "advanced", "expert", "master"];
function getTierClass(tierName) {
  const key = tierName.toLowerCase();
  return TIER_COLORS[key] ?? "bg-muted text-muted-foreground border-border";
}
function useAdminCertificates() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["admin", "certificates"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listAllCertificates();
    },
    enabled: !!actor && !isFetching,
    staleTime: 3e4
  });
}
function useAdminStatsLocal() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["admin", "stats"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.adminGetStats();
    },
    enabled: !!actor && !isFetching,
    staleTime: 3e4
  });
}
function useQuestionFailStats(tierId) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["admin", "questionFailStats", tierId],
    queryFn: async () => {
      if (!actor || !tierId) return [];
      return actor.adminGetQuestionFailStats(tierId);
    },
    enabled: !!actor && !isFetching && !!tierId,
    staleTime: 6e4
  });
}
function useAttemptLogs(tierId) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["admin", "attemptLogs", tierId],
    queryFn: async () => {
      if (!actor || !tierId) return [];
      return actor.adminGetAttemptLogs(tierId);
    },
    enabled: !!actor && !isFetching && !!tierId,
    staleTime: 3e4
  });
}
function useFlaggedQuestions() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["admin", "flaggedQuestions"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.adminGetFlaggedQuestions();
    },
    enabled: !!actor && !isFetching,
    staleTime: 3e4
  });
}
function downloadCertificatePDF(cert) {
  const win = window.open("", "_blank");
  if (!win) return;
  const date = new Date(Number(cert.issuedAt) / 1e6).toLocaleDateString(
    "en-US",
    { year: "numeric", month: "long", day: "numeric" }
  );
  win.document.write(`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<title>Certificate — ${cert.certId}</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;600;700&family=DM+Sans:wght@400;500&display=swap');
  *{box-sizing:border-box;margin:0;padding:0}
  body{background:#0d0d14;display:flex;align-items:center;justify-content:center;min-height:100vh;font-family:'DM Sans',sans-serif;padding:2rem}
  .cert{width:860px;background:linear-gradient(135deg,#0f1120 0%,#1a1a2e 50%,#0f1120 100%);border:2px solid oklch(0.65 0.15 190 / 0.6);border-radius:20px;padding:60px;position:relative;overflow:hidden;box-shadow:0 0 60px oklch(0.65 0.15 190 / 0.25)}
  .cert::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse at top left, oklch(0.65 0.15 190 / 0.08) 0%,transparent 60%),radial-gradient(ellipse at bottom right,oklch(0.7 0.18 70 / 0.06) 0%,transparent 60%);pointer-events:none}
  .watermark{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;pointer-events:none;z-index:0}
  .watermark span{font-family:'Space Grotesk',sans-serif;font-size:5rem;font-weight:700;color:oklch(0.65 0.15 190 / 0.04);transform:rotate(-30deg);letter-spacing:0.2em;text-transform:uppercase}
  .content{position:relative;z-index:1}
  .header{text-align:center;margin-bottom:40px}
  .brand{font-family:'Space Grotesk',sans-serif;font-size:0.8rem;font-weight:600;letter-spacing:0.3em;text-transform:uppercase;color:oklch(0.65 0.15 190);margin-bottom:8px}
  .title{font-family:'Space Grotesk',sans-serif;font-size:2.5rem;font-weight:700;color:#e8eaf6;margin-bottom:4px}
  .subtitle{color:oklch(0.65 0.15 190 / 0.8);font-size:0.95rem}
  .divider{height:1px;background:linear-gradient(90deg,transparent,oklch(0.65 0.15 190 / 0.5),oklch(0.7 0.18 70 / 0.5),transparent);margin:28px 0}
  .awarded{text-align:center;color:#9ca3af;font-size:0.85rem;letter-spacing:0.1em;text-transform:uppercase;margin-bottom:12px}
  .name{text-align:center;font-family:'Space Grotesk',sans-serif;font-size:2.1rem;font-weight:700;color:#e8eaf6;margin-bottom:24px}
  .tier-badge{display:block;width:fit-content;margin:0 auto 28px;padding:8px 24px;border-radius:50px;border:1.5px solid oklch(0.65 0.15 190 / 0.5);background:oklch(0.65 0.15 190 / 0.12);color:oklch(0.65 0.15 190);font-family:'Space Grotesk',sans-serif;font-weight:600;font-size:0.85rem;letter-spacing:0.12em;text-transform:uppercase}
  .grid{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:28px}
  .field{background:oklch(1 0 0 / 0.04);border:1px solid oklch(0.65 0.15 190 / 0.12);border-radius:10px;padding:12px 16px}
  .field-label{font-size:0.7rem;text-transform:uppercase;letter-spacing:0.1em;color:#6b7280;margin-bottom:4px}
  .field-value{font-size:0.95rem;color:#e8eaf6;font-weight:500}
  .footer-row{display:flex;align-items:center;justify-content:space-between;margin-top:8px}
  .cert-id-box{font-family:'Space Grotesk',monospace;font-size:0.75rem;letter-spacing:0.18em;color:oklch(0.7 0.18 70);background:oklch(0.7 0.18 70 / 0.08);border:1px solid oklch(0.7 0.18 70 / 0.3);border-radius:8px;padding:6px 12px}
  .score-box{color:#9ca3af;font-size:0.8rem}
  .score-val{color:oklch(0.65 0.15 190);font-weight:700}
  .seal{width:60px;height:60px;border-radius:50%;border:2px solid oklch(0.7 0.18 70 / 0.6);background:oklch(0.7 0.18 70 / 0.08);display:flex;align-items:center;justify-content:center;font-size:1.8rem}
  @media print{body{background:#fff}}
</style>
</head>
<body>
<div class="cert">
  <div class="watermark"><span>DemonZeno</span></div>
  <div class="content">
    <div class="header">
      <div class="brand">DemonZeno Trading Academy</div>
      <div class="title">Certificate of Achievement</div>
      <div class="subtitle">This is to certify that the following individual has successfully completed</div>
    </div>
    <div class="divider"></div>
    <div class="awarded">Awarded to</div>
    <div class="name">${cert.certInfo.fullName}</div>
    <div class="tier-badge">${cert.tierName} Tier — Trading Academy</div>
    <div class="grid">
      <div class="field"><div class="field-label">Father's Name</div><div class="field-value">${cert.certInfo.fathersName}</div></div>
      <div class="field"><div class="field-label">Country</div><div class="field-value">${cert.certInfo.country}</div></div>
      <div class="field"><div class="field-label">City</div><div class="field-value">${cert.certInfo.city}</div></div>
      <div class="field"><div class="field-label">Date of Birth</div><div class="field-value">${cert.certInfo.dateOfBirth}</div></div>
      <div class="field"><div class="field-label">Email</div><div class="field-value">${cert.certInfo.email}</div></div>
      <div class="field"><div class="field-label">Date Issued</div><div class="field-value">${date}</div></div>
    </div>
    <div class="divider"></div>
    <div class="footer-row">
      <div class="cert-id-box">ID: ${cert.certId}</div>
      <div class="seal">🏆</div>
      <div class="score-box">Score: <span class="score-val">${Number(cert.score)}/${Number(cert.totalQuestions)}</span></div>
    </div>
  </div>
</div>
<script>setTimeout(()=>{window.print()},400)<\/script>
</body>
</html>`);
  win.document.close();
}
function CertDetailModal({
  cert,
  onClose
}) {
  const date = new Date(Number(cert.issuedAt) / 1e6).toLocaleDateString(
    "en-US",
    { year: "numeric", month: "long", day: "numeric" }
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "dialog",
    {
      className: "fixed inset-0 bg-background/85 backdrop-blur-sm z-50 flex items-center justify-center p-4 m-0 max-w-none max-h-none w-full h-full border-0",
      onClick: onClose,
      onKeyDown: (e) => e.key === "Escape" && onClose(),
      open: true,
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Card,
        {
          "data-ocid": "admin.cert_detail.dialog",
          className: "bg-card border-border max-w-lg w-full p-0 overflow-hidden shadow-2xl",
          onClick: (e) => e.stopPropagation(),
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-6 py-4 border-b border-border bg-muted/20", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Trophy, { className: "w-4 h-4 text-primary" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display font-semibold text-foreground text-sm", children: "Certificate Details" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  size: "sm",
                  variant: "ghost",
                  "data-ocid": "admin.cert_detail.close_button",
                  className: "h-7 w-7 p-0",
                  onClick: onClose,
                  "aria-label": "Close",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-4 h-4" })
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 py-3 bg-primary/5 border-b border-primary/10 flex items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "certificate-id text-sm", children: cert.certId }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                !cert.isValid && /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Badge,
                  {
                    variant: "outline",
                    className: "text-xs border-destructive/40 text-destructive bg-destructive/10",
                    children: "REVOKED"
                  }
                ),
                cert.featured && /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Badge,
                  {
                    variant: "outline",
                    className: "text-xs border-[oklch(0.7_0.18_70/0.4)] text-[oklch(0.7_0.18_70)] bg-[oklch(0.7_0.18_70/0.1)]",
                    children: "⭐ FEATURED"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Badge,
                  {
                    variant: "outline",
                    className: `text-xs border ${getTierClass(cert.tierName)}`,
                    children: cert.tierName
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-6 py-5 grid grid-cols-2 gap-3", children: [
              { label: "Full Name", value: cert.certInfo.fullName },
              { label: "Father's Name", value: cert.certInfo.fathersName },
              { label: "Country", value: cert.certInfo.country },
              { label: "City", value: cert.certInfo.city },
              { label: "Date of Birth", value: cert.certInfo.dateOfBirth },
              { label: "Email", value: cert.certInfo.email },
              {
                label: "Score",
                value: `${Number(cert.score)} / ${Number(cert.totalQuestions)} (${Math.round(Number(cert.score) / Number(cert.totalQuestions) * 100)}%)`
              },
              { label: "Issued On", value: date }
            ].map(({ label, value }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "bg-muted/20 rounded-lg px-3 py-2 border border-border/60",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground uppercase tracking-wider mb-0.5", children: label }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "p",
                    {
                      className: "text-sm font-medium text-foreground truncate",
                      title: value,
                      children: value
                    }
                  )
                ]
              },
              label
            )) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 pb-5 flex justify-end gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  variant: "outline",
                  size: "sm",
                  "data-ocid": "admin.cert_detail.cancel_button",
                  onClick: onClose,
                  children: "Close"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  size: "sm",
                  "data-ocid": "admin.cert_detail.download_button",
                  className: "btn-primary gap-1.5",
                  onClick: () => downloadCertificatePDF(cert),
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "w-3.5 h-3.5" }),
                    "Download PDF"
                  ]
                }
              )
            ] })
          ]
        }
      )
    }
  );
}
function TierBreakdownBar({
  certsByTier,
  total
}) {
  if (certsByTier.length === 0) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-1.5 mt-3", children: certsByTier.map(([tier, count]) => {
    const pct = total > 0 ? Number(count) / total * 100 : 0;
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-xs", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-24 text-muted-foreground capitalize truncate", children: tier }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 h-1.5 rounded-full bg-muted/40 overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "h-full rounded-full bg-primary transition-all duration-700",
          style: { width: `${pct}%` }
        }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-6 text-right font-mono text-muted-foreground", children: Number(count) })
    ] }, tier);
  }) });
}
function sortCerts(certs, key) {
  return [...certs].sort((a, b) => {
    if (key === "date") return Number(b.issuedAt) - Number(a.issuedAt);
    if (key === "tier") return a.tierName.localeCompare(b.tierName);
    return a.certInfo.fullName.localeCompare(b.certInfo.fullName);
  });
}
function CertRow({
  cert,
  index,
  onView,
  onDelete,
  onRevoke,
  onFeature,
  expanded,
  onToggle
}) {
  const date = new Date(Number(cert.issuedAt) / 1e6).toLocaleDateString();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "tr",
      {
        "data-ocid": `admin.cert.item.${index}`,
        className: "border-b border-border hover:bg-muted/10 transition-colors cursor-pointer",
        onClick: onToggle,
        onKeyDown: (e) => e.key === "Enter" && onToggle(),
        tabIndex: 0,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "certificate-id text-xs", children: cert.certId }),
            !cert.isValid && /* @__PURE__ */ jsxRuntimeExports.jsx(
              Badge,
              {
                variant: "outline",
                className: "text-[10px] border-destructive/40 text-destructive bg-destructive/10 px-1 py-0",
                children: "REVOKED"
              }
            ),
            cert.featured && /* @__PURE__ */ jsxRuntimeExports.jsx(
              Badge,
              {
                variant: "outline",
                className: "text-[10px] border-[oklch(0.7_0.18_70/0.4)] text-[oklch(0.7_0.18_70)] bg-[oklch(0.7_0.18_70/0.1)] px-1 py-0",
                children: "⭐"
              }
            )
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-sm font-medium text-foreground max-w-[160px] truncate", children: cert.certInfo.fullName }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-sm text-muted-foreground hidden md:table-cell max-w-[140px] truncate", children: cert.certInfo.fathersName }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-sm text-muted-foreground hidden lg:table-cell", children: cert.certInfo.country }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 hidden sm:table-cell", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            Badge,
            {
              variant: "outline",
              className: `text-xs border ${getTierClass(cert.tierName)}`,
              children: cert.tierName
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-sm text-muted-foreground hidden md:table-cell tabular-nums", children: date }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-4 py-3 text-sm text-right font-mono tabular-nums text-foreground hidden lg:table-cell", children: [
            Number(cert.score),
            "/",
            Number(cert.totalQuestions)
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                size: "sm",
                variant: "ghost",
                "data-ocid": `admin.cert.edit_button.${index}`,
                className: "h-7 w-7 p-0 text-muted-foreground hover:text-foreground",
                onClick: (e) => {
                  e.stopPropagation();
                  onView(cert);
                },
                "aria-label": "View details",
                children: expanded ? /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronUp, { className: "w-3.5 h-3.5" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "w-3.5 h-3.5" })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                size: "sm",
                variant: "ghost",
                "data-ocid": `admin.cert.feature_button.${index}`,
                className: `h-7 w-7 p-0 ${cert.featured ? "text-[oklch(0.7_0.18_70)] hover:bg-[oklch(0.7_0.18_70/0.1)]" : "text-muted-foreground hover:text-[oklch(0.7_0.18_70)]"}`,
                onClick: (e) => {
                  e.stopPropagation();
                  onFeature(cert.certId, !cert.featured);
                },
                "aria-label": cert.featured ? "Unfeature" : "Feature",
                children: cert.featured ? /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "w-3.5 h-3.5 fill-current" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(StarOff, { className: "w-3.5 h-3.5" })
              }
            ),
            cert.isValid ? /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                size: "sm",
                variant: "ghost",
                "data-ocid": `admin.cert.revoke_button.${index}`,
                className: "h-7 w-7 p-0 text-destructive hover:bg-destructive/10",
                onClick: (e) => {
                  e.stopPropagation();
                  onRevoke(cert.certId, false);
                },
                "aria-label": `Revoke ${cert.certId}`,
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldX, { className: "w-3.5 h-3.5" })
              }
            ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                size: "sm",
                variant: "ghost",
                "data-ocid": `admin.cert.reinstate_button.${index}`,
                className: "h-7 w-7 p-0 text-[oklch(0.65_0.15_130)] hover:bg-[oklch(0.65_0.15_130/0.1)]",
                onClick: (e) => {
                  e.stopPropagation();
                  onRevoke(cert.certId, true);
                },
                "aria-label": `Reinstate ${cert.certId}`,
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "w-3.5 h-3.5" })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                size: "sm",
                variant: "ghost",
                "data-ocid": `admin.cert.delete_button.${index}`,
                className: "h-7 w-7 p-0 text-destructive hover:bg-destructive/10",
                onClick: (e) => {
                  e.stopPropagation();
                  onDelete(cert.certId);
                },
                "aria-label": `Delete ${cert.certId}`,
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-3.5 h-3.5" })
              }
            )
          ] }) })
        ]
      }
    ),
    expanded && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { className: "border-b border-border bg-muted/5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { colSpan: 8, className: "px-4 py-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-3 text-xs", children: [
        { label: "Email", value: cert.certInfo.email },
        { label: "City", value: cert.certInfo.city },
        { label: "Date of Birth", value: cert.certInfo.dateOfBirth },
        { label: "Father's Name", value: cert.certInfo.fathersName }
      ].map(({ label, value }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-0.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground uppercase tracking-wider text-[10px]", children: label }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground font-medium", children: value })
      ] }, label)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 mt-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            size: "sm",
            variant: "outline",
            className: "h-7 text-xs gap-1",
            "data-ocid": `admin.cert.view_detail.${index}`,
            onClick: (e) => {
              e.stopPropagation();
              onView(cert);
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Award, { className: "w-3 h-3" }),
              " Full Details"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            size: "sm",
            variant: "ghost",
            className: "h-7 text-xs gap-1 text-primary",
            "data-ocid": `admin.cert.download.${index}`,
            onClick: (e) => {
              e.stopPropagation();
              downloadCertificatePDF(cert);
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "w-3 h-3" }),
              " Download PDF"
            ]
          }
        )
      ] })
    ] }) })
  ] });
}
function AccessDenied() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background flex flex-col items-center justify-center p-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 overflow-hidden pointer-events-none", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full opacity-10",
        style: {
          background: "radial-gradient(circle, oklch(0.65 0.15 190), transparent 70%)",
          filter: "blur(60px)"
        }
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative z-10 flex flex-col items-center gap-6 max-w-sm text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-20 h-20 rounded-2xl bg-muted/40 border border-border flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldAlert, { className: "w-9 h-9 text-muted-foreground" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display font-bold text-2xl text-foreground", children: "Access Required" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-muted-foreground text-sm leading-relaxed", children: [
          "Admin access is session-local. To unlock, click the",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary font-medium", children: "DemonZeno image" }),
          " on the home page ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold", children: "5 or more times" }),
          " ",
          "to trigger the passcode prompt."
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-2 w-full", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            asChild: true,
            "data-ocid": "admin.access_denied.home_button",
            className: "btn-primary w-full gap-2",
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(House, { className: "w-4 h-4" }),
              "Go to Home Page"
            ] })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Admin access does not persist across tabs or sessions." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-xs text-muted-foreground border border-border/40 rounded-lg px-4 py-3 bg-muted/10", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "w-3.5 h-3.5 shrink-0" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "DemonZeno Trading Academy — Admin Panel" })
      ] })
    ] })
  ] });
}
function StatCard({
  icon,
  label,
  value,
  sub,
  ocid
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { "data-ocid": ocid, className: "p-4 md:p-5 bg-card border-border", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-3", children: [
      icon,
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground font-medium uppercase tracking-wider", children: label })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-bold text-2xl md:text-3xl text-foreground", children: value }),
    sub
  ] });
}
const ADMIN_TABS = [
  {
    id: "certificates",
    label: "Certificates",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Award, { className: "w-3.5 h-3.5" })
  },
  {
    id: "quiz-stats",
    label: "Quiz Stats",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(ChartColumn, { className: "w-3.5 h-3.5" })
  },
  {
    id: "lesson-analytics",
    label: "Lesson Analytics",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "w-3.5 h-3.5" })
  },
  {
    id: "academy-settings",
    label: "Academy Settings",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Globe, { className: "w-3.5 h-3.5" })
  },
  {
    id: "stats-overview",
    label: "Stats Overview",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(LayoutDashboard, { className: "w-3.5 h-3.5" })
  },
  {
    id: "cert-wall",
    label: "Certificate Wall",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Trophy, { className: "w-3.5 h-3.5" })
  }
];
function QuizStatsTab() {
  const queryClient = useQueryClient();
  const { actor } = useActor(createActor);
  const { data: stats = [], isLoading: statsLoading } = useQuizAttemptStats();
  const { data: flaggedIds = [] } = useFlaggedQuestions();
  const [selectedTier, setSelectedTier] = reactExports.useState("beginner");
  const { data: failStats = [], isLoading: failLoading } = useQuestionFailStats(selectedTier);
  const { data: attemptLogs = [], isLoading: logsLoading } = useAttemptLogs(selectedTier);
  const flagMutation = useMutation({
    mutationFn: async ({
      questionId,
      flagged
    }) => {
      if (!actor) throw new Error("No actor");
      await actor.adminFlagQuestion(questionId, flagged);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["admin", "flaggedQuestions"]
      });
      void queryClient.invalidateQueries({
        queryKey: ["admin", "questionFailStats", selectedTier]
      });
    }
  });
  function getPassRateColor(rate) {
    if (rate > 50) return "text-[oklch(0.65_0.15_130)]";
    if (rate > 20) return "text-[oklch(0.65_0.14_70)]";
    return "text-destructive";
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-semibold text-foreground", children: "Quiz Attempt Statistics" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: "Per-tier attempt and pass rate breakdown" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          size: "sm",
          variant: "outline",
          "data-ocid": "admin.quiz_stats.refresh_button",
          className: "h-8 gap-1.5 text-xs",
          onClick: () => void queryClient.invalidateQueries({
            queryKey: ["quizAttemptStats"]
          }),
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "w-3.5 h-3.5" }),
            " Refresh"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-card rounded-xl border border-border overflow-hidden", children: statsLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        "data-ocid": "admin.quiz_stats.loading_state",
        className: "p-8 flex flex-col gap-3",
        children: ["q1", "q2", "q3", "q4", "q5"].map((k) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-10 w-full rounded-md" }, k))
      }
    ) : stats.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        "data-ocid": "admin.quiz_stats.empty_state",
        className: "p-12 text-center",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ChartColumn, { className: "w-10 h-10 text-muted-foreground/30 mx-auto mb-3" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm", children: "No quiz attempts recorded yet." })
        ]
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-left", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { className: "border-b border-border bg-muted/20", children: ["Tier", "Total Attempts", "Total Passes", "Pass Rate"].map(
        (h) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "th",
          {
            className: "px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider",
            children: h
          },
          h
        )
      ) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: stats.map((s, idx) => {
        const attempts = Number(s.totalAttempts);
        const passes = Number(s.passCount);
        const rate = attempts > 0 ? Math.round(passes / attempts * 100) : 0;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "tr",
          {
            "data-ocid": `admin.quiz_stats.item.${idx + 1}`,
            className: "border-b border-border hover:bg-muted/10 transition-colors",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                Badge,
                {
                  variant: "outline",
                  className: `text-xs border ${getTierClass(s.tierId)}`,
                  children: s.tierId
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-sm tabular-nums text-foreground font-medium", children: attempts.toLocaleString() }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-sm tabular-nums text-foreground font-medium", children: passes.toLocaleString() }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "span",
                {
                  className: `text-sm font-bold tabular-nums ${getPassRateColor(rate)}`,
                  children: [
                    rate,
                    "%"
                  ]
                }
              ) })
            ]
          },
          s.tierId
        );
      }) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-xl border border-border overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 py-3 border-b border-border bg-muted/10 flex items-center justify-between gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-display font-semibold text-foreground text-sm", children: "Per-Question Fail Rates" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Questions with highest fail rates for the selected tier" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "select",
          {
            "data-ocid": "admin.quiz_stats.tier_select",
            value: selectedTier,
            onChange: (e) => setSelectedTier(e.target.value),
            className: "h-8 text-xs rounded-md border border-input bg-secondary text-foreground px-2 focus:outline-none focus:ring-1 focus:ring-ring cursor-pointer",
            children: TIERS.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: t, children: t.charAt(0).toUpperCase() + t.slice(1) }, t))
          }
        )
      ] }),
      failLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          "data-ocid": "admin.quiz_stats.fail_loading_state",
          className: "p-6 flex flex-col gap-3",
          children: ["f1", "f2", "f3"].map((k) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-10 w-full rounded-md" }, k))
        }
      ) : failStats.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          "data-ocid": "admin.quiz_stats.fail_empty_state",
          className: "p-8 text-center",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ChartColumn, { className: "w-8 h-8 text-muted-foreground/30 mx-auto mb-2" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm", children: "No fail data recorded for this tier yet." })
          ]
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-left", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { className: "border-b border-border bg-muted/20", children: ["Question ID", "Seen", "Failed", "Fail Rate", "Flag"].map(
          (h) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "th",
            {
              className: "px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider",
              children: h
            },
            h
          )
        ) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: [...failStats].sort(
          (a, b) => Number(b.failCount) / Math.max(Number(b.totalSeen), 1) - Number(a.failCount) / Math.max(Number(a.totalSeen), 1)
        ).map((stat, idx) => {
          const rate = Number(stat.totalSeen) > 0 ? Math.round(
            Number(stat.failCount) / Number(stat.totalSeen) * 100
          ) : 0;
          const isFlagged = flaggedIds.includes(stat.questionId);
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "tr",
            {
              "data-ocid": `admin.quiz_stats.fail_item.${idx + 1}`,
              className: "border-b border-border hover:bg-muted/10 transition-colors",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-4 py-3 font-mono text-xs text-foreground", children: [
                  stat.questionId.slice(0, 12),
                  "…"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-sm tabular-nums text-foreground", children: Number(stat.totalSeen) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-sm tabular-nums text-foreground", children: Number(stat.failCount) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "span",
                  {
                    className: `text-sm font-bold tabular-nums ${getPassRateColor(100 - rate)}`,
                    children: [
                      rate,
                      "%"
                    ]
                  }
                ) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Button,
                  {
                    size: "sm",
                    variant: isFlagged ? "destructive" : "outline",
                    "data-ocid": `admin.quiz_stats.flag_button.${idx + 1}`,
                    className: "h-7 text-xs gap-1",
                    disabled: flagMutation.isPending,
                    onClick: () => flagMutation.mutate({
                      questionId: stat.questionId,
                      flagged: !isFlagged
                    }),
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Flag, { className: "w-3 h-3" }),
                      isFlagged ? "Unflag" : "Flag"
                    ]
                  }
                ) })
              ]
            },
            stat.questionId
          );
        }) })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-xl border border-border overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 py-3 border-b border-border bg-muted/10", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h4", { className: "font-display font-semibold text-foreground text-sm", children: [
          "Attempt Logs — ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "capitalize", children: selectedTier })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Recent quiz attempt records including fingerprint and pass/fail" })
      ] }),
      logsLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          "data-ocid": "admin.quiz_stats.logs_loading_state",
          className: "p-6 flex flex-col gap-3",
          children: ["l1", "l2", "l3"].map((k) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-10 w-full rounded-md" }, k))
        }
      ) : attemptLogs.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          "data-ocid": "admin.quiz_stats.logs_empty_state",
          className: "p-8 text-center",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm", children: "No attempt logs for this tier yet." })
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-left", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { className: "border-b border-border bg-muted/20", children: ["Timestamp", "Score", "Passed", "Fingerprint"].map((h) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "th",
          {
            className: "px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider",
            children: h
          },
          h
        )) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: [...attemptLogs].sort((a, b) => Number(b.timestamp) - Number(a.timestamp)).slice(0, 50).map((log, idx) => {
          const ts = new Date(
            Number(log.timestamp) / 1e6
          ).toLocaleString();
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "tr",
            {
              "data-ocid": `admin.quiz_stats.log_item.${idx + 1}`,
              className: "border-b border-border hover:bg-muted/10 transition-colors",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-xs text-muted-foreground tabular-nums", children: ts }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-4 py-3 text-sm tabular-nums font-medium text-foreground", children: [
                  Number(log.score),
                  "/30"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: log.passed ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Badge,
                  {
                    variant: "outline",
                    className: "text-xs border-[oklch(0.65_0.15_130/0.4)] text-[oklch(0.65_0.15_130)] bg-[oklch(0.65_0.15_130/0.08)]",
                    children: "PASSED"
                  }
                ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Badge,
                  {
                    variant: "outline",
                    className: "text-xs border-destructive/40 text-destructive bg-destructive/10",
                    children: "FAILED"
                  }
                ) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-4 py-3 font-mono text-xs text-muted-foreground truncate max-w-[160px]", children: [
                  log.fingerprint.slice(0, 16),
                  "…"
                ] })
              ]
            },
            `${log.fingerprint}-${idx}`
          );
        }) })
      ] }) })
    ] })
  ] });
}
function LessonAnalyticsTab() {
  const { actor, isFetching } = useActor(createActor);
  const { data: lessonRatings = [], isLoading: ratingsLoading } = useQuery({
    queryKey: ["admin", "lessonRatings"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAdminLessonRatings();
    },
    enabled: !!actor && !isFetching,
    staleTime: 6e4
  });
  const { data: dailyActive = [], isLoading: dailyLoading } = useQuery({
    queryKey: ["admin", "dailyActive"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getDailyActiveCounts();
    },
    enabled: !!actor && !isFetching,
    staleTime: 6e4
  });
  const { data: completionTrends = [], isLoading: trendsLoading } = useQuery({
    queryKey: ["admin", "completionTrends"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getLessonCompletionTrends();
    },
    enabled: !!actor && !isFetching,
    staleTime: 6e4
  });
  const sortedRatings = [...lessonRatings].sort((a, b) => a[2] - b[2]);
  const chartData = [...dailyActive].sort((a, b) => a.date.localeCompare(b.date)).slice(-30);
  const maxCount = chartData.reduce((m, d) => Math.max(m, Number(d.count)), 1);
  const completionCounts = {};
  for (const entry of completionTrends) {
    const key = `${entry.tierId}/${entry.lessonId}`;
    completionCounts[key] = (completionCounts[key] ?? 0) + 1;
  }
  const topLessons = Object.entries(completionCounts).sort((a, b) => b[1] - a[1]).slice(0, 20);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-semibold text-foreground mb-1", children: "Lesson Confidence Ratings" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mb-4", children: "Sorted by lowest avg confidence — shows where users struggle most." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-card border border-border rounded-xl overflow-hidden", children: ratingsLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          "data-ocid": "admin.lesson_analytics.ratings_loading_state",
          className: "p-6 flex flex-col gap-3",
          children: ["r1", "r2", "r3"].map((k) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-10 w-full rounded-md" }, k))
        }
      ) : sortedRatings.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          "data-ocid": "admin.lesson_analytics.ratings_empty_state",
          className: "p-10 text-center",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "w-8 h-8 text-muted-foreground/30 mx-auto mb-2" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm", children: "No lesson confidence data yet." })
          ]
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-left", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { className: "border-b border-border bg-muted/20", children: ["Tier", "Lesson", "Avg Confidence", "Rating"].map((h) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "th",
          {
            className: "px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider",
            children: h
          },
          h
        )) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: sortedRatings.map(([tierId, lessonId, avg], idx) => {
          const pct = avg / 5 * 100;
          const color = avg < 2.5 ? "text-destructive" : avg < 3.5 ? "text-[oklch(0.65_0.14_70)]" : "text-[oklch(0.65_0.15_130)]";
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "tr",
            {
              "data-ocid": `admin.lesson_analytics.rating_item.${idx + 1}`,
              className: "border-b border-border hover:bg-muted/10 transition-colors",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Badge,
                  {
                    variant: "outline",
                    className: `text-xs border capitalize ${getTierClass(tierId)}`,
                    children: tierId
                  }
                ) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-sm text-foreground font-mono", children: lessonId }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-24 h-1.5 rounded-full bg-muted/40 overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      className: "h-full rounded-full bg-primary transition-all",
                      style: { width: `${pct}%` }
                    }
                  ) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: `text-sm font-bold tabular-nums ${color}`,
                      children: avg.toFixed(1)
                    }
                  )
                ] }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-0.5", children: [1, 2, 3, 4, 5].map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Star,
                  {
                    className: `w-3.5 h-3.5 ${s <= Math.round(avg) ? "text-[oklch(0.7_0.18_70)] fill-[oklch(0.7_0.18_70)]" : "text-muted-foreground/30"}`
                  },
                  s
                )) }) })
              ]
            },
            `${tierId}-${lessonId}`
          );
        }) })
      ] }) }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-semibold text-foreground mb-1", children: "Daily Active Learners" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mb-4", children: "Learners active per day (last 30 days)." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-card border border-border rounded-xl p-5", children: dailyLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { "data-ocid": "admin.lesson_analytics.daily_loading_state", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-48 w-full rounded-md" }) }) : chartData.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          "data-ocid": "admin.lesson_analytics.daily_empty_state",
          className: "h-48 flex items-center justify-center",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm", children: "No activity data yet." })
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "svg",
        {
          viewBox: `0 0 ${chartData.length * 18} 80`,
          className: "w-full h-48",
          role: "img",
          "aria-label": "Daily active learners bar chart",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("title", { children: "Daily active learners bar chart" }),
            chartData.map((d, i) => {
              const barH = Number(d.count) / maxCount * 60;
              const x = i * 18;
              const y = 60 - barH;
              return /* @__PURE__ */ jsxRuntimeExports.jsxs("g", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "rect",
                  {
                    x: x + 2,
                    y,
                    width: 14,
                    height: barH,
                    rx: 2,
                    fill: "oklch(0.65 0.15 190 / 0.7)"
                  }
                ),
                i % 5 === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "text",
                  {
                    x: x + 9,
                    y: 78,
                    textAnchor: "middle",
                    fontSize: 7,
                    fill: "oklch(0.55 0.01 260)",
                    children: d.date.slice(5)
                  }
                ),
                Number(d.count) > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "text",
                  {
                    x: x + 9,
                    y: y - 2,
                    textAnchor: "middle",
                    fontSize: 7,
                    fill: "oklch(0.65 0.15 190)",
                    children: Number(d.count)
                  }
                )
              ] }, d.date);
            })
          ]
        }
      ) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-semibold text-foreground mb-1", children: "Lesson Completion Trends" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mb-4", children: "Most completed lessons across all users." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-card border border-border rounded-xl overflow-hidden", children: trendsLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          "data-ocid": "admin.lesson_analytics.trends_loading_state",
          className: "p-6 flex flex-col gap-3",
          children: ["t1", "t2", "t3"].map((k) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-10 w-full rounded-md" }, k))
        }
      ) : topLessons.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          "data-ocid": "admin.lesson_analytics.trends_empty_state",
          className: "p-10 text-center",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "w-8 h-8 text-muted-foreground/30 mx-auto mb-2" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm", children: "No completion data yet." })
          ]
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "divide-y divide-border", children: topLessons.map(([key, count], idx) => {
        const [tierId, lessonId] = key.split("/");
        const maxComp = topLessons[0][1];
        const pct = count / maxComp * 100;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            "data-ocid": `admin.lesson_analytics.trend_item.${idx + 1}`,
            className: "flex items-center gap-3 px-5 py-3",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground w-5 text-right shrink-0", children: idx + 1 }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Badge,
                    {
                      variant: "outline",
                      className: `text-xs border capitalize ${getTierClass(tierId ?? "")}`,
                      children: tierId
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-foreground font-mono truncate", children: lessonId })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-1 rounded-full bg-muted/40 overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "h-full rounded-full bg-primary",
                    style: { width: `${pct}%` }
                  }
                ) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-bold text-foreground tabular-nums shrink-0", children: count })
            ]
          },
          key
        );
      }) }) })
    ] })
  ] });
}
function StatsOverviewTab() {
  const { actor, isFetching } = useActor(createActor);
  const { data: stats, isLoading: statsLoading } = useAdminStatsLocal();
  const { data: attemptStats = [], isLoading: attemptsLoading } = useQuizAttemptStats();
  const { data: dailyActive = [], isLoading: dailyLoading } = useQuery({
    queryKey: ["admin", "dailyActive"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getDailyActiveCounts();
    },
    enabled: !!actor && !isFetching,
    staleTime: 6e4
  });
  const totalCerts = stats ? Number(stats.totalCertificates) : 0;
  const totalAttempts = attemptStats.reduce(
    (s, a) => s + Number(a.totalAttempts),
    0
  );
  const totalPasses = attemptStats.reduce((s, a) => s + Number(a.passCount), 0);
  const passRate = totalAttempts > 0 ? Math.round(totalPasses / totalAttempts * 100) : 0;
  const recentActive = dailyActive.reduce((s, d) => s + Number(d.count), 0);
  const tierData = (stats == null ? void 0 : stats.certsByTier) ?? [];
  const maxTierCount = tierData.reduce((m, [, c]) => Math.max(m, Number(c)), 1);
  const lineData = [...dailyActive].sort((a, b) => a.date.localeCompare(b.date)).slice(-14);
  const maxLine = lineData.reduce((m, d) => Math.max(m, Number(d.count)), 1);
  const W = 280;
  const H = 80;
  const linePoints = lineData.map((d, i) => {
    const x = lineData.length > 1 ? i / (lineData.length - 1) * W : W / 2;
    const y = H - Number(d.count) / maxLine * (H - 10) - 5;
    return `${x},${y}`;
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-semibold text-foreground mb-4", children: "Platform Overview" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 lg:grid-cols-4 gap-4", children: [
        {
          label: "Total Certificates",
          value: statsLoading ? "…" : totalCerts.toLocaleString(),
          icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Award, { className: "w-4 h-4 text-primary" }),
          ocid: "admin.stats.total_certs_card"
        },
        {
          label: "Quiz Attempts",
          value: attemptsLoading ? "…" : totalAttempts.toLocaleString(),
          icon: /* @__PURE__ */ jsxRuntimeExports.jsx(ChartColumn, { className: "w-4 h-4 text-primary" }),
          ocid: "admin.stats.attempts_card"
        },
        {
          label: "Global Pass Rate",
          value: attemptsLoading ? "…" : `${passRate}%`,
          icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "w-4 h-4 text-primary" }),
          ocid: "admin.stats.pass_rate_card"
        },
        {
          label: "Total Activity",
          value: dailyLoading ? "…" : recentActive.toLocaleString(),
          icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Globe, { className: "w-4 h-4 text-primary" }),
          ocid: "admin.stats.activity_card"
        }
      ].map(({ label, value, icon, ocid }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Card,
        {
          "data-ocid": ocid,
          className: "p-4 md:p-5 bg-card border-border",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-3", children: [
              icon,
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground font-medium uppercase tracking-wider", children: label })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-bold text-2xl md:text-3xl text-foreground", children: value })
          ]
        },
        label
      )) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-xl p-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground uppercase tracking-wider mb-4", children: "Certificates by Tier" }),
        statsLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-40 w-full rounded-md" }) : tierData.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-40 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm", children: "No data yet." }) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-2.5", children: tierData.map(([tier, count]) => {
          const pct = maxTierCount > 0 ? Number(count) / maxTierCount * 100 : 0;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-24 text-muted-foreground capitalize text-xs truncate", children: tier }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 h-4 rounded bg-muted/30 overflow-hidden relative", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "h-full rounded bg-primary transition-all duration-700",
                  style: { width: `${pct}%` }
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute right-2 top-0 bottom-0 flex items-center text-xs font-bold text-foreground", children: Number(count) })
            ] })
          ] }, tier);
        }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-xl p-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground uppercase tracking-wider mb-4", children: "Quiz: Attempts vs Passes per Tier" }),
        attemptsLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-40 w-full rounded-md" }) : attemptStats.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-40 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm", children: "No quiz data yet." }) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-3", children: attemptStats.map((s, idx) => {
          const attempts = Number(s.totalAttempts);
          const passes = Number(s.passCount);
          const rate = attempts > 0 ? Math.round(passes / attempts * 100) : 0;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              "data-ocid": `admin.stats.tier_item.${idx + 1}`,
              className: "flex items-center gap-3",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Badge,
                  {
                    variant: "outline",
                    className: `text-xs border capitalize w-24 justify-center ${getTierClass(s.tierId)}`,
                    children: s.tierId
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col gap-0.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 text-xs text-muted-foreground", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                      "Attempts:",
                      " ",
                      /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { className: "text-foreground", children: attempts })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mx-1", children: "•" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                      "Passes:",
                      " ",
                      /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { className: "text-foreground", children: passes })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-2 rounded-full bg-muted/30 overflow-hidden relative", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      className: "h-full rounded-full bg-primary transition-all",
                      style: { width: `${rate}%` }
                    }
                  ) })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-bold text-foreground w-10 text-right", children: [
                  rate,
                  "%"
                ] })
              ]
            },
            s.tierId
          );
        }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-xl p-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground uppercase tracking-wider mb-4", children: "Daily Active Users (last 14 days)" }),
      dailyLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-28 w-full rounded-md" }) : lineData.length < 2 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-28 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm", children: "Not enough data to draw chart." }) }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "svg",
        {
          viewBox: `0 0 ${W} ${H + 15}`,
          className: "w-full h-28",
          role: "img",
          "aria-label": "Daily active users line chart",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("title", { children: "Daily active users line chart" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "polyline",
              {
                points: linePoints.join(" "),
                fill: "none",
                stroke: "oklch(0.65 0.15 190)",
                strokeWidth: 2,
                strokeLinejoin: "round",
                strokeLinecap: "round"
              }
            ),
            lineData.map((d, i) => {
              const x = i / (lineData.length - 1) * W;
              const y = H - Number(d.count) / maxLine * (H - 10) - 5;
              return /* @__PURE__ */ jsxRuntimeExports.jsxs("g", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: x, cy: y, r: 3, fill: "oklch(0.65 0.15 190)" }),
                i % 3 === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "text",
                  {
                    x,
                    y: H + 12,
                    textAnchor: "middle",
                    fontSize: 8,
                    fill: "oklch(0.55 0.01 260)",
                    children: d.date.slice(5)
                  }
                )
              ] }, d.date);
            })
          ]
        }
      )
    ] })
  ] });
}
function AcademySettingsTab() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  const { data: banner, isLoading: bannerLoading } = useAnnouncementBanner();
  const { data: tierStates = [], isLoading: tiersLoading } = useTierDisabledStates();
  const [bannerText, setBannerText] = reactExports.useState("");
  const [bannerSuccess, setBannerSuccess] = reactExports.useState(null);
  const bannerMutation = useMutation({
    mutationFn: async ({ msg, pin }) => {
      if (!actor) throw new Error("No actor");
      await actor.adminSetAnnouncementBanner(msg, pin);
    },
    onSuccess: (_, vars) => {
      void queryClient.invalidateQueries({
        queryKey: ["announcementBanner"]
      });
      setBannerSuccess(
        vars.pin ? "Banner pinned successfully!" : "Banner cleared."
      );
      setTimeout(() => setBannerSuccess(null), 3e3);
    }
  });
  const tierMutation = useMutation({
    mutationFn: async ({
      tierId,
      disabled
    }) => {
      if (!actor) throw new Error("No actor");
      const res = await actor.adminSetTierDisabled(tierId, disabled);
      if (res.__kind__ === "err") throw new Error(res.err);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["tierDisabledStates"] });
    }
  });
  function isTierDisabled(tierId) {
    var _a2;
    return ((_a2 = tierStates.find((t) => t.tierId === tierId)) == null ? void 0 : _a2.disabled) ?? false;
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-semibold text-foreground mb-1", children: "Announcement Banner" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mb-4", children: "Pinned banners appear at the top of the site for all visitors." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-xl p-5 space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground uppercase tracking-wider", children: "Current Status" }),
        bannerLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-64" }) : (banner == null ? void 0 : banner.isPinned) ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(BellRing, { className: "w-4 h-4 text-primary shrink-0 mt-0.5" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground", children: "Currently pinned:" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-primary mt-0.5", children: [
              "“",
              banner.text,
              "”"
            ] })
          ] })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground italic", children: "No banner currently pinned." }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t border-border/50 pt-4 space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground uppercase tracking-wider", children: "Set New Banner" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Label,
              {
                htmlFor: "banner-text",
                className: "text-xs text-muted-foreground",
                children: "Announcement message"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "banner-text",
                "data-ocid": "admin.announcement.input",
                placeholder: "Enter announcement message for all visitors…",
                value: bannerText,
                onChange: (e) => setBannerText(e.target.value),
                className: "bg-secondary border-input text-sm"
              }
            )
          ] }),
          bannerMutation.error && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "p",
            {
              className: "text-xs text-destructive bg-destructive/10 rounded p-2",
              "data-ocid": "admin.announcement.error_state",
              children: String(bannerMutation.error)
            }
          ),
          bannerSuccess && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "p",
            {
              className: "text-xs text-[oklch(0.65_0.15_130)] bg-[oklch(0.65_0.15_130/0.1)] rounded p-2",
              "data-ocid": "admin.announcement.success_state",
              children: bannerSuccess
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                size: "sm",
                "data-ocid": "admin.announcement.pin_button",
                className: "btn-primary gap-1.5 text-xs h-8",
                disabled: !bannerText.trim() || bannerMutation.isPending,
                onClick: () => bannerMutation.mutate({ msg: bannerText.trim(), pin: true }),
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(BellRing, { className: "w-3.5 h-3.5" }),
                  bannerMutation.isPending ? "Saving…" : "Pin Banner"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                size: "sm",
                variant: "outline",
                "data-ocid": "admin.announcement.unpin_button",
                className: "gap-1.5 text-xs h-8 text-muted-foreground",
                disabled: bannerMutation.isPending,
                onClick: () => bannerMutation.mutate({
                  msg: (banner == null ? void 0 : banner.text) ?? "",
                  pin: false
                }),
                children: "Unpin Banner"
              }
            )
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(QuizFailMessageManager, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-semibold text-foreground mb-1", children: "Tier Maintenance Mode" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mb-4", children: "Disable individual tiers to prevent new quiz attempts while content is being updated." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-card border border-border rounded-xl overflow-hidden", children: tiersLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-6 flex flex-col gap-3", children: ["t1", "t2", "t3", "t4", "t5"].map((k) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-12 w-full rounded-md" }, k)) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "divide-y divide-border", children: TIERS.map((tierId) => {
        const disabled = isTierDisabled(tierId);
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            "data-ocid": `admin.tier.item.${tierId}`,
            className: "flex items-center justify-between px-5 py-4",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Badge,
                  {
                    variant: "outline",
                    className: `text-xs border capitalize ${disabled ? "border-destructive/40 text-destructive bg-destructive/10" : getTierClass(tierId)}`,
                    children: tierId
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-muted-foreground", children: disabled ? "🔒 Maintenance mode — quiz locked" : "✅ Active — quiz accessible" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  size: "sm",
                  variant: disabled ? "outline" : "destructive",
                  "data-ocid": `admin.tier.toggle_button.${tierId}`,
                  className: "h-8 text-xs gap-1.5",
                  disabled: tierMutation.isPending,
                  onClick: () => tierMutation.mutate({ tierId, disabled: !disabled }),
                  children: disabled ? "Enable Tier" : "Disable Tier"
                }
              )
            ]
          },
          tierId
        );
      }) }) }),
      tierMutation.error && /* @__PURE__ */ jsxRuntimeExports.jsx(
        "p",
        {
          className: "text-xs text-destructive bg-destructive/10 rounded p-2 mt-2",
          "data-ocid": "admin.tier.error_state",
          children: String(tierMutation.error)
        }
      )
    ] })
  ] });
}
function QuizFailMessageManager() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  const [selectedTier, setSelectedTier] = reactExports.useState("beginner");
  const [msgText, setMsgText] = reactExports.useState("");
  const [passcode, setPasscode] = reactExports.useState("");
  const [saveStatus, setSaveStatus] = reactExports.useState("idle");
  const { data: currentMsg, isLoading: msgLoading } = useQuery({
    queryKey: ["quizFailMessage", selectedTier],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getQuizFailMessage(selectedTier);
    },
    enabled: !!actor && !!selectedTier,
    staleTime: 3e4
  });
  async function handleSave() {
    if (!actor || !msgText.trim()) return;
    setSaveStatus("saving");
    try {
      const ok = await actor.setQuizFailMessage(
        selectedTier,
        msgText.trim(),
        passcode
      );
      if (ok) {
        setSaveStatus("saved");
        void queryClient.invalidateQueries({
          queryKey: ["quizFailMessage", selectedTier]
        });
        setTimeout(() => setSaveStatus("idle"), 3e3);
      } else {
        setSaveStatus("error");
        setTimeout(() => setSaveStatus("idle"), 3e3);
      }
    } catch {
      setSaveStatus("error");
      setTimeout(() => setSaveStatus("idle"), 3e3);
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-semibold text-foreground mb-1", children: "Custom Quiz Fail Message" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mb-4", children: "Set a custom encouragement message shown to users who fail the quiz. Shown below the score on the fail screen." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-xl p-5 space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground shrink-0", children: "Tier" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "select",
          {
            "data-ocid": "admin.fail_message.tier_select",
            value: selectedTier,
            onChange: (e) => setSelectedTier(e.target.value),
            className: "h-8 text-xs rounded-md border border-input bg-secondary text-foreground px-2 focus:outline-none focus:ring-1 focus:ring-ring cursor-pointer",
            children: TIERS.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: t, children: t.charAt(0).toUpperCase() + t.slice(1) }, t))
          }
        )
      ] }),
      !msgLoading && currentMsg && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground italic bg-muted/20 px-3 py-2 rounded", children: [
        "Current: “",
        currentMsg,
        "”"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Label,
          {
            htmlFor: "fail-passcode",
            className: "text-xs text-muted-foreground",
            children: "Admin Passcode"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            id: "fail-passcode",
            type: "password",
            "data-ocid": "admin.fail_message.passcode_input",
            placeholder: "Enter admin passcode",
            value: passcode,
            onChange: (e) => setPasscode(e.target.value),
            className: "bg-secondary border-input text-sm"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "fail-msg", className: "text-xs text-muted-foreground", children: "New message" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            id: "fail-msg",
            "data-ocid": "admin.fail_message.input",
            placeholder: "e.g. Don't give up! Review the lessons and try again.",
            value: msgText,
            onChange: (e) => setMsgText(e.target.value),
            className: "bg-secondary border-input text-sm"
          }
        )
      ] }),
      saveStatus === "saved" && /* @__PURE__ */ jsxRuntimeExports.jsx(
        "p",
        {
          className: "text-xs text-[oklch(0.65_0.15_130)] bg-[oklch(0.65_0.15_130/0.1)] rounded p-2",
          "data-ocid": "admin.fail_message.success_state",
          children: "Message saved successfully!"
        }
      ),
      saveStatus === "error" && /* @__PURE__ */ jsxRuntimeExports.jsx(
        "p",
        {
          className: "text-xs text-destructive bg-destructive/10 rounded p-2",
          "data-ocid": "admin.fail_message.error_state",
          children: "Failed to save. Check your passcode and try again."
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          size: "sm",
          "data-ocid": "admin.fail_message.save_button",
          className: "btn-primary gap-1.5 text-xs h-8",
          disabled: !msgText.trim() || !passcode.trim() || saveStatus === "saving",
          onClick: handleSave,
          children: saveStatus === "saving" ? "Saving…" : "Save Message"
        }
      )
    ] })
  ] });
}
function CertWallAdminTab() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  const { data: featured = [], isLoading: featuredLoading } = useFeaturedCertificates();
  const { data: allCerts = [] } = useAdminCertificates();
  const { data: stats } = useAdminStatsLocal();
  const featureMutation = useMutation({
    mutationFn: async ({
      certId,
      featured: isFeatured
    }) => {
      if (!actor) throw new Error("No actor");
      const res = await actor.adminFeatureCertificate(certId, isFeatured);
      if (res.__kind__ === "err") throw new Error(res.err);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["featuredCertificates"]
      });
      void queryClient.invalidateQueries({
        queryKey: ["admin", "certificates"]
      });
    }
  });
  const totalCerts = stats ? Number(stats.totalCertificates) : allCerts.length;
  const tierCounts = (stats == null ? void 0 : stats.certsByTier) ?? [];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-semibold text-foreground mb-1", children: "Certificate Wall Overview" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mb-4", children: "Manage featured certificates on the public Certificate Wall." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Card,
          {
            "data-ocid": "admin.cert_wall.total_card",
            className: "p-4 bg-card border-border",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground uppercase tracking-wider mb-1", children: "Total Issued" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display font-bold text-2xl text-foreground", children: totalCerts })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Card,
          {
            "data-ocid": "admin.cert_wall.featured_card",
            className: "p-4 bg-card border-border",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground uppercase tracking-wider mb-1", children: "Featured" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display font-bold text-2xl text-foreground", children: featured.length })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Card,
          {
            "data-ocid": "admin.cert_wall.tiers_card",
            className: "p-4 bg-card border-border",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground uppercase tracking-wider mb-1", children: "Tiers Active" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display font-bold text-2xl text-foreground", children: tierCounts.length })
            ]
          }
        )
      ] }),
      tierCounts.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-xl p-5 mb-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground uppercase tracking-wider mb-3", children: "Certificates by Tier" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TierBreakdownBar, { certsByTier: tierCounts, total: totalCerts })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-display font-semibold text-foreground text-sm mb-3", children: "Featured Graduates" }),
      featuredLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          "data-ocid": "admin.cert_wall.loading_state",
          className: "flex flex-col gap-3",
          children: ["f1", "f2", "f3"].map((k) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-14 w-full rounded-xl" }, k))
        }
      ) : featured.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          "data-ocid": "admin.cert_wall.empty_state",
          className: "bg-card border border-border rounded-xl p-8 text-center",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "w-8 h-8 text-muted-foreground/30 mx-auto mb-2" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm", children: "No featured certificates. Use the Certificates tab to star any certificate and feature it on the wall." })
          ]
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-2", children: featured.map((cert, idx) => {
        const date = new Date(
          Number(cert.issuedAt) / 1e6
        ).toLocaleDateString();
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            "data-ocid": `admin.cert_wall.item.${idx + 1}`,
            className: "bg-card border border-[oklch(0.7_0.18_70/0.3)] rounded-xl px-5 py-4 flex items-center justify-between gap-3",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "w-4 h-4 text-[oklch(0.7_0.18_70)] shrink-0" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-sm text-foreground truncate", children: cert.certInfo.fullName }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mt-0.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "certificate-id text-xs", children: cert.certId }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Badge,
                      {
                        variant: "outline",
                        className: `text-xs border ${getTierClass(cert.tierName)}`,
                        children: cert.tierName
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: date })
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  size: "sm",
                  variant: "outline",
                  "data-ocid": `admin.cert_wall.unfeature_button.${idx + 1}`,
                  className: "h-8 text-xs gap-1.5 text-muted-foreground shrink-0",
                  disabled: featureMutation.isPending,
                  onClick: () => featureMutation.mutate({
                    certId: cert.certId,
                    featured: false
                  }),
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(StarOff, { className: "w-3.5 h-3.5" }),
                    " Unfeature"
                  ]
                }
              )
            ]
          },
          cert.certId
        );
      }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-display font-semibold text-foreground text-sm mb-3", children: "Feature a Certificate" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mb-3", children: "You can also feature certificates directly from the Certificates tab by clicking the ⭐ icon on any row." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-muted/20 border border-border rounded-xl p-4 flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "w-4 h-4 text-[oklch(0.7_0.18_70)] shrink-0" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
          "To feature a certificate, go to the",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground font-medium", children: "Certificates tab" }),
          ", find the certificate, and click the ⭐ star icon. It will appear on the public Certificate Wall and in this list."
        ] })
      ] })
    ] })
  ] });
}
function ManualIssueCertForm({
  onSuccess
}) {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  const [open, setOpen] = reactExports.useState(false);
  const [tier, setTier] = reactExports.useState("beginner");
  const [form, setForm] = reactExports.useState({
    fullName: "",
    fathersName: "",
    country: "",
    dateOfBirth: "",
    email: "",
    city: ""
  });
  const [successCertId, setSuccessCertId] = reactExports.useState(null);
  const issueMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("No actor");
      const result = await actor.adminManualIssueCertificate(tier, form);
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: (cert) => {
      void queryClient.invalidateQueries({ queryKey: ["admin"] });
      setSuccessCertId(cert.certId);
      onSuccess(cert.certId);
      setForm({
        fullName: "",
        fathersName: "",
        country: "",
        dateOfBirth: "",
        email: "",
        city: ""
      });
    }
  });
  function update(field, value) {
    setForm((p) => ({ ...p, [field]: value }));
  }
  const allFilled = Object.values(form).every((v) => v.trim());
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-xl overflow-hidden mb-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        type: "button",
        "data-ocid": "admin.manual_issue.toggle_button",
        className: "w-full flex items-center justify-between px-5 py-4 hover:bg-muted/10 transition-colors",
        onClick: () => {
          setOpen((o) => !o);
          setSuccessCertId(null);
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CirclePlus, { className: "w-4 h-4 text-primary" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display font-semibold text-foreground text-sm", children: "Manually Issue Certificate" })
          ] }),
          open ? /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronUp, { className: "w-4 h-4 text-muted-foreground" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "w-4 h-4 text-muted-foreground" })
        ]
      }
    ),
    open && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-5 pb-5 border-t border-border space-y-4 pt-4", children: [
      successCertId && /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "bg-[oklch(0.65_0.15_130/0.1)] border border-[oklch(0.65_0.15_130/0.3)] rounded-lg p-3",
          "data-ocid": "admin.manual_issue.success_state",
          children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-[oklch(0.65_0.15_130)] font-medium", children: [
            "Certificate issued! ID:",
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "certificate-id", children: successCertId })
          ] })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: "Tier" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "select",
            {
              "data-ocid": "admin.manual_issue.tier_select",
              value: tier,
              onChange: (e) => setTier(e.target.value),
              className: "w-full h-9 text-sm rounded-md border border-input bg-secondary text-foreground px-3 focus:outline-none focus:ring-1 focus:ring-ring",
              children: TIERS.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: t, children: t.charAt(0).toUpperCase() + t.slice(1) }, t))
            }
          )
        ] }),
        [
          { field: "fullName", label: "Full Name" },
          { field: "fathersName", label: "Father's Name" },
          { field: "country", label: "Country" },
          { field: "city", label: "City" },
          { field: "dateOfBirth", label: "Date of Birth" },
          { field: "email", label: "Email" }
        ].map(({ field, label }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: label }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              "data-ocid": `admin.manual_issue.${field}_input`,
              value: form[field],
              onChange: (e) => update(field, e.target.value),
              placeholder: label,
              className: "bg-secondary border-input text-sm h-9"
            }
          )
        ] }, field))
      ] }),
      issueMutation.error && /* @__PURE__ */ jsxRuntimeExports.jsx(
        "p",
        {
          className: "text-xs text-destructive bg-destructive/10 rounded p-2",
          "data-ocid": "admin.manual_issue.error_state",
          children: String(issueMutation.error)
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          "data-ocid": "admin.manual_issue.submit_button",
          className: "btn-primary gap-1.5 text-sm h-9",
          disabled: !allFilled || issueMutation.isPending,
          onClick: () => issueMutation.mutate(),
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Award, { className: "w-4 h-4" }),
            issueMutation.isPending ? "Issuing…" : "Issue Certificate"
          ]
        }
      )
    ] })
  ] });
}
function CertificatesTab() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  const [search, setSearch] = reactExports.useState("");
  const [sortKey, setSortKey] = reactExports.useState("date");
  const [validityFilter, setValidityFilter] = reactExports.useState("all");
  const [tierFilter, setTierFilter] = reactExports.useState("all");
  const [deleteConfirm, setDeleteConfirm] = reactExports.useState(null);
  const [viewingCert, setViewingCert] = reactExports.useState(null);
  const [expandedRow, setExpandedRow] = reactExports.useState(null);
  const [lastIssuedId, setLastIssuedId] = reactExports.useState(null);
  const { data: certificates = [], isLoading } = useAdminCertificates();
  const deleteMutation = useMutation({
    mutationFn: async (certId) => {
      if (!actor) throw new Error("No actor");
      const res = await actor.adminRevokeOrReinstateCertificate(certId, false);
      if (res.__kind__ === "err") throw new Error(res.err);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["admin"] });
      void queryClient.invalidateQueries({ queryKey: ["certificates"] });
      setDeleteConfirm(null);
      setExpandedRow(null);
    }
  });
  const revokeMutation = useMutation({
    mutationFn: async ({
      certId,
      makeValid
    }) => {
      if (!actor) throw new Error("No actor");
      const result = await actor.adminRevokeOrReinstateCertificate(
        certId,
        makeValid
      );
      if (result.__kind__ === "err") throw new Error(result.err);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["admin"] });
      void queryClient.invalidateQueries({ queryKey: ["certificates"] });
    }
  });
  const featureMutation = useMutation({
    mutationFn: async ({
      certId,
      featured
    }) => {
      if (!actor) throw new Error("No actor");
      const res = await actor.adminFeatureCertificate(certId, featured);
      if (res.__kind__ === "err") throw new Error(res.err);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["admin"] });
      void queryClient.invalidateQueries({
        queryKey: ["featuredCertificates"]
      });
    }
  });
  function exportCSV() {
    if (certificates.length === 0) return;
    const headers = [
      "Cert ID",
      "Full Name",
      "Fathers Name",
      "Country",
      "City",
      "DOB",
      "Email",
      "Tier",
      "Score",
      "Total Questions",
      "Date Issued",
      "Valid",
      "Featured"
    ];
    const rows = certificates.map((c) => {
      const date = new Date(Number(c.issuedAt) / 1e6).toLocaleDateString(
        "en-US"
      );
      return [
        c.certId,
        c.certInfo.fullName,
        c.certInfo.fathersName,
        c.certInfo.country,
        c.certInfo.city,
        c.certInfo.dateOfBirth,
        c.certInfo.email,
        c.tierName,
        String(Number(c.score)),
        String(Number(c.totalQuestions)),
        date,
        c.isValid ? "Yes" : "No",
        c.featured ? "Yes" : "No"
      ].map((v) => `"${v.replace(/"/g, '""')}"`).join(",");
    });
    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `demonzeno-certificates-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }
  const filtered = reactExports.useMemo(() => {
    const q = search.toLowerCase().trim();
    let base = certificates;
    if (validityFilter === "valid") base = base.filter((c) => c.isValid);
    if (validityFilter === "revoked") base = base.filter((c) => !c.isValid);
    if (tierFilter !== "all")
      base = base.filter((c) => c.tierName.toLowerCase() === tierFilter);
    if (q) {
      base = base.filter(
        (c) => c.certId.toLowerCase().includes(q) || c.certInfo.fullName.toLowerCase().includes(q) || c.certInfo.country.toLowerCase().includes(q) || c.tierName.toLowerCase().includes(q)
      );
    }
    return sortCerts(base, sortKey);
  }, [certificates, search, sortKey, validityFilter, tierFilter]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(ManualIssueCertForm, { onSuccess: setLastIssuedId }),
    lastIssuedId && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-4 bg-[oklch(0.65_0.15_130/0.1)] border border-[oklch(0.65_0.15_130/0.3)] rounded-lg px-4 py-3 flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-[oklch(0.65_0.15_130)]", children: [
        "Last issued:",
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "certificate-id font-semibold", children: lastIssuedId })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: () => setLastIssuedId(null),
          className: "text-muted-foreground hover:text-foreground",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-4 h-4" })
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-xl border border-border overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 md:px-6 py-4 border-b border-border flex flex-col gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Trophy, { className: "w-4 h-4 text-primary shrink-0" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "font-display font-semibold text-foreground text-sm", children: [
              "All Issued Certificates",
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground font-normal ml-1.5", children: [
                "(",
                certificates.length,
                " total",
                filtered.length !== certificates.length ? `, ${filtered.length} shown` : "",
                ")"
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              size: "sm",
              variant: "outline",
              "data-ocid": "admin.cert.export_button",
              className: "h-8 gap-1.5 text-xs shrink-0",
              onClick: exportCSV,
              disabled: certificates.length === 0,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "w-3.5 h-3.5" }),
                " Export CSV"
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex rounded-md border border-input overflow-hidden h-8", children: ["all", "valid", "revoked"].map((v) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              "data-ocid": `admin.cert.validity_filter.${v}`,
              className: `px-2.5 text-xs font-medium transition-colors ${validityFilter === v ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"}`,
              onClick: () => setValidityFilter(v),
              children: v.charAt(0).toUpperCase() + v.slice(1)
            },
            v
          )) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "select",
            {
              "data-ocid": "admin.cert.tier_filter",
              value: tierFilter,
              onChange: (e) => setTierFilter(e.target.value),
              className: "h-8 text-xs rounded-md border border-input bg-secondary text-foreground px-2 focus:outline-none focus:ring-1 focus:ring-ring cursor-pointer",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "all", children: "All Tiers" }),
                TIERS.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: t, children: t.charAt(0).toUpperCase() + t.slice(1) }, t))
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "select",
            {
              "data-ocid": "admin.cert.sort_select",
              value: sortKey,
              onChange: (e) => setSortKey(e.target.value),
              className: "h-8 text-xs rounded-md border border-input bg-secondary text-foreground px-2 focus:outline-none focus:ring-1 focus:ring-ring cursor-pointer",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "date", children: "Sort: Newest" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "tier", children: "Sort: Tier" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "name", children: "Sort: Name" })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1 min-w-[160px] sm:min-w-[200px]", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                "data-ocid": "admin.cert.search_input",
                placeholder: "Search ID, name, country…",
                value: search,
                onChange: (e) => setSearch(e.target.value),
                className: "pl-8 h-8 text-xs bg-secondary border-input"
              }
            )
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          "data-ocid": "admin.cert.loading_state",
          className: "p-8 flex flex-col gap-3",
          children: ["t1", "t2", "t3", "t4"].map((sk) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-10 w-full rounded-md" }, sk))
        }
      ) : filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          "data-ocid": "admin.cert.empty_state",
          className: "p-12 text-center",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Award, { className: "w-10 h-10 text-muted-foreground/30 mx-auto mb-3" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm", children: search || validityFilter !== "all" || tierFilter !== "all" ? "No certificates match your filters." : "No certificates have been issued yet." })
          ]
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-left", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { className: "border-b border-border bg-muted/20", children: [
          "Cert ID",
          "Full Name",
          "Father's Name",
          "Country",
          "Tier",
          "Date Issued",
          "Score",
          "Actions"
        ].map((h, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "th",
          {
            className: `px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap${i === 2 ? " hidden md:table-cell" : ""}${i === 3 ? " hidden lg:table-cell" : ""}${i === 4 ? " hidden sm:table-cell" : ""}${i === 5 ? " hidden md:table-cell" : ""}${i === 6 ? " hidden lg:table-cell text-right" : ""}`,
            children: h
          },
          h
        )) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: filtered.map((cert, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          CertRow,
          {
            cert,
            index: idx + 1,
            onView: setViewingCert,
            onDelete: setDeleteConfirm,
            onRevoke: (id, makeValid) => revokeMutation.mutate({ certId: id, makeValid }),
            onFeature: (id, featured) => featureMutation.mutate({ certId: id, featured }),
            expanded: expandedRow === cert.certId,
            onToggle: () => setExpandedRow(
              expandedRow === cert.certId ? null : cert.certId
            )
          },
          cert.certId
        )) })
      ] }) })
    ] }),
    viewingCert && /* @__PURE__ */ jsxRuntimeExports.jsx(
      CertDetailModal,
      {
        cert: viewingCert,
        onClose: () => setViewingCert(null)
      }
    ),
    deleteConfirm && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 bg-background/85 backdrop-blur-sm z-50 flex items-center justify-center p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Card,
      {
        "data-ocid": "admin.delete_confirm.dialog",
        className: "bg-card border-destructive/30 max-w-sm w-full p-6 flex flex-col gap-4",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-destructive", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-5 h-5" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-bold", children: "Delete Certificate?" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground leading-relaxed", children: [
            "This will permanently delete certificate",
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "certificate-id", children: deleteConfirm }),
            ". This action cannot be undone and will remove the record globally."
          ] }),
          deleteMutation.error && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "p",
            {
              className: "text-xs text-destructive bg-destructive/10 rounded p-2",
              "data-ocid": "admin.delete_confirm.error_state",
              children: String(deleteMutation.error)
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 justify-end", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "outline",
                size: "sm",
                "data-ocid": "admin.delete_confirm.cancel_button",
                onClick: () => setDeleteConfirm(null),
                disabled: deleteMutation.isPending,
                children: "Cancel"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "destructive",
                size: "sm",
                "data-ocid": "admin.delete_confirm.confirm_button",
                disabled: deleteMutation.isPending,
                onClick: () => deleteMutation.mutate(deleteConfirm),
                children: deleteMutation.isPending ? "Deleting…" : "Delete"
              }
            )
          ] })
        ]
      }
    ) })
  ] });
}
function AdminDashboard() {
  const { isAdminUnlocked, lockAdmin } = useSession();
  const queryClient = useQueryClient();
  const { data: stats, isLoading: statsLoading } = useAdminStatsLocal();
  const { data: certificates = [] } = useAdminCertificates();
  const [activeTab, setActiveTab] = reactExports.useState("certificates");
  const uniqueCountries = reactExports.useMemo(
    () => new Set(certificates.map((c) => c.certInfo.country)).size,
    [certificates]
  );
  if (!isAdminUnlocked) return /* @__PURE__ */ jsxRuntimeExports.jsx(AccessDenied, {});
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border-b border-border sticky top-0 z-30 shadow-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto px-4 h-16 flex items-center justify-between gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "w-5 h-5 text-primary shrink-0" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display font-bold text-foreground text-sm", children: "Admin Dashboard" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden md:inline text-muted-foreground text-xs ml-2", children: "— DemonZeno Trading Academy" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Badge,
            {
              variant: "outline",
              className: "text-xs border-primary/30 text-primary bg-primary/5 shrink-0",
              children: "Session-Local"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              size: "sm",
              variant: "ghost",
              "data-ocid": "admin.refresh.button",
              className: "h-8 w-8 p-0",
              "aria-label": "Refresh data",
              onClick: () => void queryClient.invalidateQueries({ queryKey: ["admin"] }),
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "w-3.5 h-3.5" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              size: "sm",
              variant: "ghost",
              asChild: true,
              "data-ocid": "admin.home.link",
              className: "h-8 px-2 gap-1 text-muted-foreground",
              children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(House, { className: "w-3.5 h-3.5" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline text-xs", children: "Home" })
              ] })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              size: "sm",
              variant: "outline",
              "data-ocid": "admin.lock.button",
              className: "h-8 gap-1.5 text-destructive border-destructive/30 hover:bg-destructive/10 text-xs",
              onClick: lockAdmin,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "w-3.5 h-3.5" }),
                " Lock Admin"
              ]
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-t border-border/50 bg-muted/20 px-4 py-1.5 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Session-local: Admin access is active only in this browser session. Certificate data is global — showing certificates from all devices." }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto px-4 py-8 max-w-7xl", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8", children: statsLoading ? ["s1", "s2", "s3", "s4"].map((sk) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-4 md:p-5 bg-card border-border", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-24 mb-3" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-16" })
      ] }, sk)) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          StatCard,
          {
            ocid: "admin.total_certs.card",
            icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Award, { className: "w-4 h-4 text-primary" }),
            label: "Total Certificates",
            value: stats ? Number(stats.totalCertificates).toString() : "—",
            sub: stats && stats.certsByTier.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
              TierBreakdownBar,
              {
                certsByTier: stats.certsByTier,
                total: Number(stats.totalCertificates)
              }
            ) : void 0
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          StatCard,
          {
            ocid: "admin.countries.card",
            icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Globe, { className: "w-4 h-4 text-primary" }),
            label: "Countries",
            value: String(uniqueCountries),
            sub: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "Unique countries represented" })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          StatCard,
          {
            ocid: "admin.tiers.card",
            icon: /* @__PURE__ */ jsxRuntimeExports.jsx(ChartColumn, { className: "w-4 h-4 text-primary" }),
            label: "Tiers Active",
            value: stats ? String(stats.certsByTier.length) : "—",
            sub: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "Tiers with issued certificates" })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          StatCard,
          {
            ocid: "admin.access.card",
            icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "w-4 h-4 text-primary" }),
            label: "Access Level",
            value: "Admin",
            sub: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "Full certificate management" })
          }
        )
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex overflow-x-auto border-b border-border mb-6 gap-0.5 scrollbar-hide", children: ADMIN_TABS.map((tab) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          "data-ocid": `admin.tab.${tab.id}`,
          onClick: () => setActiveTab(tab.id),
          className: `flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${activeTab === tab.id ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"}`,
          children: [
            tab.icon,
            tab.label
          ]
        },
        tab.id
      )) }),
      activeTab === "certificates" && /* @__PURE__ */ jsxRuntimeExports.jsx(CertificatesTab, {}),
      activeTab === "quiz-stats" && /* @__PURE__ */ jsxRuntimeExports.jsx(QuizStatsTab, {}),
      activeTab === "lesson-analytics" && /* @__PURE__ */ jsxRuntimeExports.jsx(LessonAnalyticsTab, {}),
      activeTab === "academy-settings" && /* @__PURE__ */ jsxRuntimeExports.jsx(AcademySettingsTab, {}),
      activeTab === "stats-overview" && /* @__PURE__ */ jsxRuntimeExports.jsx(StatsOverviewTab, {}),
      activeTab === "cert-wall" && /* @__PURE__ */ jsxRuntimeExports.jsx(CertWallAdminTab, {})
    ] })
  ] });
}
export {
  AdminDashboard
};
