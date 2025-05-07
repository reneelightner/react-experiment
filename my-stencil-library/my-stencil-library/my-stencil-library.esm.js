import { B as BUILD, c as consoleDevInfo, H, w as win, N as NAMESPACE, p as promiseResolve, b as bootstrapLazy } from './index-BuT10AwN.js';
export { s as setNonce } from './index-BuT10AwN.js';
import { g as globalScripts } from './app-globals-DQuL1Twl.js';

/*
 Stencil Client Patch Browser v4.29.2 | MIT Licensed | https://stenciljs.com
 */

var patchBrowser = () => {
  if (BUILD.isDev && !BUILD.isTesting) {
    consoleDevInfo("Running in development mode.");
  }
  if (BUILD.cloneNodeFix) {
    patchCloneNodeFix(H.prototype);
  }
  const scriptElm = BUILD.scriptDataOpts ? win.document && Array.from(win.document.querySelectorAll("script")).find(
    (s) => new RegExp(`/${NAMESPACE}(\\.esm)?\\.js($|\\?|#)`).test(s.src) || s.getAttribute("data-stencil-namespace") === NAMESPACE
  ) : null;
  const importMeta = import.meta.url;
  const opts = BUILD.scriptDataOpts ? (scriptElm || {})["data-opts"] || {} : {};
  if (importMeta !== "") {
    opts.resourcesUrl = new URL(".", importMeta).href;
  }
  return promiseResolve(opts);
};
var patchCloneNodeFix = (HTMLElementPrototype) => {
  const nativeCloneNodeFn = HTMLElementPrototype.cloneNode;
  HTMLElementPrototype.cloneNode = function(deep) {
    if (this.nodeName === "TEMPLATE") {
      return nativeCloneNodeFn.call(this, deep);
    }
    const clonedNode = nativeCloneNodeFn.call(this, false);
    const srcChildNodes = this.childNodes;
    if (deep) {
      for (let i = 0; i < srcChildNodes.length; i++) {
        if (srcChildNodes[i].nodeType !== 2) {
          clonedNode.appendChild(srcChildNodes[i].cloneNode(true));
        }
      }
    }
    return clonedNode;
  };
};

patchBrowser().then(async (options) => {
  await globalScripts();
  return bootstrapLazy([["custom-chart",[[1,"custom-chart",{"options":[8]},null,{"options":["optionsChanged"]}]]],["my-component",[[1,"my-component",{"first":[1],"middle":[1],"last":[1]}]]]], options);
});
//# sourceMappingURL=my-stencil-library.esm.js.map

//# sourceMappingURL=my-stencil-library.esm.js.map