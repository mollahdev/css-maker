var f = Object.defineProperty;
var d = (a, e, t) => e in a ? f(a, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : a[e] = t;
var h = (a, e, t) => (d(a, typeof e != "symbol" ? e + "" : e, t), t);
class v {
  constructor() {
    h(this, "devices", {});
    h(this, "css", {});
    h(this, "rules", {});
    h(this, "ignoreKeys", ["undefined", "remove", "false", "null", "NaN", "", "true"]);
  }
  get uid() {
    return Math.floor(Math.random() * 1e5);
  }
  canIgnore(e) {
    return this.ignoreKeys.includes(e.trim());
  }
  removeOldProperties(e, t) {
    e.split(",").filter((s) => !this.canIgnore(s)).forEach((s) => {
      const i = s.trim();
      delete t[i];
    });
  }
  sortDevices() {
    const e = this, t = Object.keys(e.devices);
    if (t.length < 2)
      return;
    t.sort((s, i) => e.devices[s] - e.devices[i]);
    const r = {};
    t.forEach(function(s) {
      r[s] = e.devices[s];
    }), e.devices = r;
  }
  removeMultiWhiteSpace(e) {
    return typeof e != "string" ? e : e.trim().replace(/ +(?= )/g, "");
  }
  responsiveToHash(e) {
    let t = [], r;
    for (r in e)
      t.push(r + "_" + e[r]);
    return t.join("-");
  }
  hashToResponsive(e) {
    const t = {};
    return e.split("-").filter(String).forEach((s) => {
      const [i, n] = s.split(/_(.+)/);
      t[i] = this.devices[n];
    }), t;
  }
  sortHashes() {
    const e = this, { rules: t, hashToResponsive: r } = e, s = Object.keys(t);
    if (s.length < 2)
      return t;
    s.sort(function(n, l) {
      if (n === "all")
        return -1;
      if (l === "all")
        return 1;
      let o = r.call(e, n), c = r.call(e, l);
      if (o.max && c.max)
        return c.max - o.max;
      if (o.min && c.min)
        return c.min - o.min;
      const u = o.max ?? o.min;
      return (c.max ?? c.min) - u;
    });
    const i = {};
    return s.forEach((n) => {
      i[n] = t[n];
    }), i;
  }
  createResponsiveFormat(e) {
    const t = this.hashToResponsive.call(this, e), r = [];
    for (let s in t)
      r.push("(" + s + "-width:" + t[s] + "px)");
    return "@media" + r.join(" and ");
  }
  convertProperties(e) {
    let t = "";
    for (let r in e)
      t += r + ":" + e[r] + ";";
    return t;
  }
  convertRules(e) {
    let t = "";
    for (let r in e) {
      const s = this.convertProperties(e[r]);
      s && (t += r + "{" + s + "}");
    }
    return t;
  }
}
class y extends v {
  addDevice(e, t) {
    this.devices[e] = t, this.sortDevices();
  }
  addCSS(e) {
    this.css[this.uid] = e;
  }
  addRule(e, t, r) {
    const s = this;
    let i = "all", n = {};
    if (e = s.removeMultiWhiteSpace(e), t = s.removeMultiWhiteSpace(t), r && typeof r == "object" && (i = s.responsiveToHash(r)), s.rules[i] || (s.rules[i] = {}), s.rules[i][e] || (s.rules[i][e] = {}), typeof t == "string") {
      n = t.split(";").filter(String);
      const l = {};
      try {
        let o;
        for (o in n) {
          const [c, u] = n[o].split(/:(.*)?/);
          c.trim() === "remove" && this.removeOldProperties(u.trim(), s.rules[i][e]), !this.canIgnore(c) && !this.canIgnore(u) && (l[c.trim()] = u.trim().replace(";", ""));
        }
      } catch {
        return;
      }
      n = l;
    }
    Object.assign(s.rules[i][e], n);
  }
  clear() {
    this.rules = {}, this.css = {};
  }
  output() {
    const { css: e, convertRules: t, createResponsiveFormat: r, sortHashes: s } = this, i = s.call(this);
    let n = "";
    for (let l in e)
      n += e[l];
    for (let l in i) {
      let o = t.call(this, i[l]);
      l !== "all" && (o = r.call(this, l) + "{" + o + "}"), n += o;
    }
    return n.replace(/\s+/g, " ");
  }
}
export {
  y as default
};
