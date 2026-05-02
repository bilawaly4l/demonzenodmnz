import { c as createLucideIcon, j as jsxRuntimeExports, Z as Zap, L as Link, B as BookOpen } from "./index-LpNaIZiB.js";
import { B as Button } from "./button-CM5rLxPe.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "m12 19-7-7 7-7", key: "1l729n" }],
  ["path", { d: "M19 12H5", key: "x3x0zl" }]
];
const ArrowLeft = createLucideIcon("arrow-left", __iconNode);
function NotFound() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "section",
    {
      "data-ocid": "not_found.page",
      className: "min-h-[calc(100vh-8rem)] flex items-center justify-center bg-background py-20",
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto px-4 flex flex-col items-center gap-8 text-center max-w-xl", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-primary/10 rounded-full blur-3xl scale-75 pointer-events-none" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "img",
            {
              src: "/assets/demonzeno-character.png",
              alt: "DemonZeno character",
              className: "relative z-10 w-48 md:w-64 object-contain drop-shadow-2xl",
              style: { clipPath: "inset(0 0 18% 0)", marginBottom: "-18%" }
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 bg-destructive/10 border border-destructive/30 rounded-full px-4 py-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "w-3.5 h-3.5 text-destructive" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive text-xs font-semibold tracking-wide uppercase", children: "404 — Not Found" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "font-display font-bold text-4xl md:text-5xl text-foreground text-glow leading-tight", children: [
            "Lost on the ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary", children: "Open Road" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-lg leading-relaxed", children: "This page doesn't exist. DemonZeno has already moved on — you should too." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row gap-3 w-full sm:w-auto", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              asChild: true,
              "data-ocid": "not_found.home.primary_button",
              className: "btn-primary px-6 h-11",
              children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "w-4 h-4 mr-2" }),
                "Back to Home"
              ] })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "outline",
              "data-ocid": "not_found.academy.secondary_button",
              asChild: true,
              className: "border-primary/40 text-primary hover:bg-primary/10 h-11",
              children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "w-4 h-4 mr-2" }),
                "Start Academy"
              ] })
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-xs max-w-sm", children: "If you think this is a mistake, check the URL or head back to the homepage." })
      ] })
    }
  );
}
export {
  NotFound
};
