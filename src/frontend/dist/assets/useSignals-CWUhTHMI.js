import { c as createLucideIcon, r as reactExports, u as useComposedRefs, j as jsxRuntimeExports, z as createSlot, a as cn, b as useActor, e as useQuery, d as createActor } from "./index-CV8G2ked.js";
import { d as useLayoutEffect2 } from "./index-s_cVKIHV.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["path", { d: "M10.268 21a2 2 0 0 0 3.464 0", key: "vwvbt9" }],
  [
    "path",
    {
      d: "M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326",
      key: "11g9vi"
    }
  ]
];
const Bell = createLucideIcon("bell", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  [
    "path",
    {
      d: "M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z",
      key: "96xj49"
    }
  ]
];
const Flame = createLucideIcon("flame", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2", key: "1yyitq" }],
  ["path", { d: "M16 3.128a4 4 0 0 1 0 7.744", key: "16gr8j" }],
  ["path", { d: "M22 21v-2a4 4 0 0 0-3-3.87", key: "kshegd" }],
  ["circle", { cx: "9", cy: "7", r: "4", key: "nufk8" }]
];
const Users = createLucideIcon("users", __iconNode);
function useStateMachine(initialState, machine) {
  return reactExports.useReducer((state, event) => {
    const nextState = machine[state][event];
    return nextState ?? state;
  }, initialState);
}
var Presence = (props) => {
  const { present, children } = props;
  const presence = usePresence(present);
  const child = typeof children === "function" ? children({ present: presence.isPresent }) : reactExports.Children.only(children);
  const ref = useComposedRefs(presence.ref, getElementRef(child));
  const forceMount = typeof children === "function";
  return forceMount || presence.isPresent ? reactExports.cloneElement(child, { ref }) : null;
};
Presence.displayName = "Presence";
function usePresence(present) {
  const [node, setNode] = reactExports.useState();
  const stylesRef = reactExports.useRef(null);
  const prevPresentRef = reactExports.useRef(present);
  const prevAnimationNameRef = reactExports.useRef("none");
  const initialState = present ? "mounted" : "unmounted";
  const [state, send] = useStateMachine(initialState, {
    mounted: {
      UNMOUNT: "unmounted",
      ANIMATION_OUT: "unmountSuspended"
    },
    unmountSuspended: {
      MOUNT: "mounted",
      ANIMATION_END: "unmounted"
    },
    unmounted: {
      MOUNT: "mounted"
    }
  });
  reactExports.useEffect(() => {
    const currentAnimationName = getAnimationName(stylesRef.current);
    prevAnimationNameRef.current = state === "mounted" ? currentAnimationName : "none";
  }, [state]);
  useLayoutEffect2(() => {
    const styles = stylesRef.current;
    const wasPresent = prevPresentRef.current;
    const hasPresentChanged = wasPresent !== present;
    if (hasPresentChanged) {
      const prevAnimationName = prevAnimationNameRef.current;
      const currentAnimationName = getAnimationName(styles);
      if (present) {
        send("MOUNT");
      } else if (currentAnimationName === "none" || (styles == null ? void 0 : styles.display) === "none") {
        send("UNMOUNT");
      } else {
        const isAnimating = prevAnimationName !== currentAnimationName;
        if (wasPresent && isAnimating) {
          send("ANIMATION_OUT");
        } else {
          send("UNMOUNT");
        }
      }
      prevPresentRef.current = present;
    }
  }, [present, send]);
  useLayoutEffect2(() => {
    if (node) {
      let timeoutId;
      const ownerWindow = node.ownerDocument.defaultView ?? window;
      const handleAnimationEnd = (event) => {
        const currentAnimationName = getAnimationName(stylesRef.current);
        const isCurrentAnimation = currentAnimationName.includes(CSS.escape(event.animationName));
        if (event.target === node && isCurrentAnimation) {
          send("ANIMATION_END");
          if (!prevPresentRef.current) {
            const currentFillMode = node.style.animationFillMode;
            node.style.animationFillMode = "forwards";
            timeoutId = ownerWindow.setTimeout(() => {
              if (node.style.animationFillMode === "forwards") {
                node.style.animationFillMode = currentFillMode;
              }
            });
          }
        }
      };
      const handleAnimationStart = (event) => {
        if (event.target === node) {
          prevAnimationNameRef.current = getAnimationName(stylesRef.current);
        }
      };
      node.addEventListener("animationstart", handleAnimationStart);
      node.addEventListener("animationcancel", handleAnimationEnd);
      node.addEventListener("animationend", handleAnimationEnd);
      return () => {
        ownerWindow.clearTimeout(timeoutId);
        node.removeEventListener("animationstart", handleAnimationStart);
        node.removeEventListener("animationcancel", handleAnimationEnd);
        node.removeEventListener("animationend", handleAnimationEnd);
      };
    } else {
      send("ANIMATION_END");
    }
  }, [node, send]);
  return {
    isPresent: ["mounted", "unmountSuspended"].includes(state),
    ref: reactExports.useCallback((node2) => {
      stylesRef.current = node2 ? getComputedStyle(node2) : null;
      setNode(node2);
    }, [])
  };
}
function getAnimationName(styles) {
  return (styles == null ? void 0 : styles.animationName) || "none";
}
function getElementRef(element) {
  var _a, _b;
  let getter = (_a = Object.getOwnPropertyDescriptor(element.props, "ref")) == null ? void 0 : _a.get;
  let mayWarn = getter && "isReactWarning" in getter && getter.isReactWarning;
  if (mayWarn) {
    return element.ref;
  }
  getter = (_b = Object.getOwnPropertyDescriptor(element, "ref")) == null ? void 0 : _b.get;
  mayWarn = getter && "isReactWarning" in getter && getter.isReactWarning;
  if (mayWarn) {
    return element.props.ref;
  }
  return element.props.ref || element.ref;
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
        var _a;
        const target = event.target;
        if (target.closest("button, input, select, textarea")) return;
        (_a = props.onMouseDown) == null ? void 0 : _a.call(props, event);
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
const SEED_POSTS = [
  {
    id: "bp-seed-1",
    title: "BTC/USDT Breakout Confirmed — Entry Zone $67,200–$67,500",
    snippet: "Market structure looks strong after the consolidation phase. Watching for clean break above resistance with volume confirmation. TP1: $69,500 | TP2: $72,000 | TP3: $76,000 | SL: $65,800",
    url: "https://www.binance.com/en/square/profile/@DemonZeno",
    date: "2026-04-25"
  },
  {
    id: "bp-seed-2",
    title: "ETH/USDT Bullish Divergence on the 4H — Signal Incoming",
    snippet: "RSI divergence forming on the 4-hour chart. On-chain data shows accumulation. Three TP targets marked — manage SL tight below $3,320. Full signal posted.",
    url: "https://www.binance.com/en/square/profile/@DemonZeno",
    date: "2026-04-25"
  },
  {
    id: "bp-seed-3",
    title: "SOL/USDT Ecosystem Momentum Building — Watch $155 Level",
    snippet: "Solana volume spiking with DEX activity. Could front-run broader altcoin rotation. Aggressive entry setup forming — check Binance Square for full signal.",
    url: "https://www.binance.com/en/square/profile/@DemonZeno",
    date: "2026-04-24"
  }
];
function useBinanceFeed() {
  const { actor, isFetching } = useActor(createActor);
  const query = useQuery({
    queryKey: ["binanceFeed"],
    queryFn: async () => {
      if (!actor) return SEED_POSTS;
      const result = await actor.getBinanceFeed();
      return result.length > 0 ? result : SEED_POSTS;
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 3e5,
    // 5 minutes
    placeholderData: SEED_POSTS
  });
  return {
    posts: query.data ?? SEED_POSTS,
    isLoading: query.isLoading,
    error: query.error ? "Failed to load Binance feed" : null,
    refetch: query.refetch
  };
}
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
function useStats() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["stats"],
    queryFn: async () => {
      if (!actor) {
        return {
          active: BigInt(0),
          wins: BigInt(0),
          losses: BigInt(0),
          winRate: 0,
          totalSignals: BigInt(0),
          assetsCovered: BigInt(0)
        };
      }
      return actor.getStats();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 3e4
  });
}
const SEED_FAQS = [
  {
    id: "faq-1",
    question: "What is DemonZeno?",
    answer: "DemonZeno is an anime-inspired free trading signals platform and meme token project providing daily signals for crypto, forex, and stocks.",
    order: BigInt(1)
  },
  {
    id: "faq-2",
    question: "What is DMNZ?",
    answer: "DMNZ is the DemonZeno token — a meme token launching April 2, 2028 via a Telegram Mini App on Blum as a 100% fair launch with no presale and no private allocation.",
    order: BigInt(2)
  },
  {
    id: "faq-3",
    question: "Are the signals really free?",
    answer: "Yes, 100% free. No subscription, no fees, no hidden charges — ever. DemonZeno is committed to free signals for the entire community.",
    order: BigInt(3)
  },
  {
    id: "faq-4",
    question: "How accurate are the signals?",
    answer: "DemonZeno provides high-quality signals based on technical analysis and AI-powered insights. Past performance is not a guarantee of future results.",
    order: BigInt(4)
  },
  {
    id: "faq-5",
    question: "What markets does DemonZeno cover?",
    answer: "Crypto tokens (BTC, ETH, SOL and more), Forex pairs (EUR/USD, GBP/JPY and more), and Stock market (AAPL, TSLA, NVDA and more).",
    order: BigInt(5)
  },
  {
    id: "faq-6",
    question: "Where does DemonZeno post daily free signals?",
    answer: "DemonZeno posts daily free signals on Binance Square at @DemonZeno. Follow there to get every signal the moment it drops — no subscription needed.",
    order: BigInt(6)
  },
  {
    id: "faq-7",
    question: "When does DMNZ token launch?",
    answer: "DMNZ launches on April 2, 2028 via a Telegram Mini App on the Blum platform. It's a 100% fair launch with no presale, no private sale, and no allocation breakdown.",
    order: BigInt(7)
  }
];
function useFaqs() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["faqs"],
    queryFn: async () => {
      if (!actor) return SEED_FAQS;
      const result = await actor.getFaqs();
      return result.length > 0 ? result : SEED_FAQS;
    },
    enabled: !!actor && !isFetching,
    placeholderData: SEED_FAQS
  });
}
function useSignals() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["signals"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getSignals();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 3e4
  });
}
export {
  Bell as B,
  Card as C,
  Flame as F,
  Label as L,
  Presence as P,
  Users as U,
  useStats as a,
  useSignals as b,
  useFaqs as c,
  useBinanceFeed as u
};
