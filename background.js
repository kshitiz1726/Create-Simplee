const journeyKey = tabId => `clicksimple-guided-journey:${tabId}`;

// Runs inside each permitted frame. The main frame is skipped because content.js
// already scans it and all same-origin frames directly.
function scanClickSimpleFrame(query, mode, topOrigin) {
  try {
    if (window.top === window || location.origin === topOrigin) return [];
  } catch (_) {
    return [];
  }

  const norm = value => String(value || "").toLocaleLowerCase().normalize("NFKC")
    .replace(/[’‘]/g, "'").replace(/[^\p{L}\p{N}]+/gu, " ").replace(/\s+/g, " ").trim();
  const clean = value => String(value || "").replace(/\s+/g, " ").trim().slice(0, 260);
  const visible = element => {
    if (!element || !element.isConnected) return false;
    const rect = element.getBoundingClientRect();
    const style = element.ownerDocument.defaultView.getComputedStyle(element);
    return rect.width > 0 && rect.height > 0 && style.display !== "none" &&
      style.visibility !== "hidden" && Number(style.opacity) !== 0;
  };
  const nameOf = element => {
    if (!element) return "";
    const aria = element.getAttribute("aria-label");
    const labelledBy = (element.getAttribute("aria-labelledby") || "").split(/\s+/).filter(Boolean)
      .map(id => element.ownerDocument.getElementById(id)?.textContent || "").join(" ");
    const labels = element.labels ? [...element.labels].map(item => item.textContent || "").join(" ") : "";
    const wrapped = element.closest("label")?.textContent || "";
    const text = (element.innerText || element.textContent || "").trim();
    const raw = aria || labelledBy || labels || wrapped || element.getAttribute("title") ||
      element.getAttribute("placeholder") || element.getAttribute("alt") ||
      (text.length < 120 ? text : text.slice(0, 90)) || element.getAttribute("name") || element.id || "";
    const cleaned = clean(raw).replace(/([a-z])([A-Z])/g, "$1 $2").replace(/[_-]+/g, " ").trim();
    if (cleaned && !/^(input|field|textfield|select|textarea|form control|element)(\s*\d+)?$|^(input|field|select|textarea|textbox|element)\d+$/i.test(cleaned)) return cleaned;
    const autocomplete = (element.getAttribute("autocomplete") || "").toLowerCase();
    const known = { email: "Email address", username: "Username", "given-name": "First name", "family-name": "Last name", name: "Name", tel: "Phone number", organization: "Organization", "street-address": "Street address", "postal-code": "Postal code", "current-password": "Password", "new-password": "New password", bday: "Date of birth" };
    if (known[autocomplete]) return known[autocomplete];
    const type = (element.getAttribute("type") || element.tagName || "input").toLowerCase();
    return ({ email: "Email address", password: "Password", tel: "Phone number", date: "Date", number: "Number", checkbox: "Confirmation", radio: "Choice" })[type] || (element.tagName.toLowerCase() === "select" ? "Selection" : element.tagName.toLowerCase() === "textarea" ? "Additional details" : "Unlabelled field");
  };
  const contextOf = element => {
    const region = element.closest('nav,main,form,fieldset,section,article,li,[role="navigation"],[role="region"]') || element.parentElement;
    const heading = region?.querySelector("h1,h2,h3,h4,h5,h6,legend,[role=heading]");
    return { region: clean(region?.getAttribute("aria-label") || region?.tagName?.toLowerCase() || ""), heading: clean(heading?.textContent || "") };
  };
  const pathOf = element => {
    const path = [];
    let node = element;
    while (node && node !== document.documentElement) {
      const parent = node.parentElement;
      if (!parent) return null;
      path.unshift([...parent.children].indexOf(node));
      node = parent;
    }
    return path;
  };
  const fieldDescription = (element, name) => {
    const tag = element.tagName.toLowerCase();
    const type = (element.getAttribute("type") || tag).toLowerCase();
    const autocomplete = (element.getAttribute("autocomplete") || "").toLowerCase();
    let description = "Enter the requested information here.";
    if (tag === "select") description = "Choose the option that best matches your details.";
    else if (tag === "textarea") description = "Add the requested details here. This field accepts a longer response.";
    else if (type === "email" || autocomplete === "email") description = "Enter the email address requested by the form.";
    else if (type === "password" || autocomplete.includes("password")) description = "Enter the password requested by the form.";
    else if (type === "tel" || autocomplete === "tel") description = "Enter the phone number requested by the form.";
    else if (type === "date") description = "Choose the requested date.";
    else if (type === "number") description = "Enter the requested number.";
    else if (type === "checkbox" || type === "radio") description = "Select this option only when it applies to you.";
    else if (/name|first|last|surname|given|family/.test(autocomplete)) description = "Enter the name requested by the form.";
    else if (/address|street|postal|zip|country|city/.test(autocomplete)) description = "Enter the address details requested by the form.";
    else if (name) description = `Enter your ${name.toLocaleLowerCase()} here.`;
    const placeholder = clean(element.getAttribute("placeholder"));
    const describedBy = (element.getAttribute("aria-describedby") || "").split(/\s+/).filter(Boolean)
      .map(id => element.ownerDocument.getElementById(id)?.textContent || "").join(" ");
    const help = clean(describedBy || element.getAttribute("title"));
    if (help) description += ` ${help}`;
    else if (placeholder && norm(placeholder) !== norm(name)) description += ` Example: “${placeholder}”.`;
    return description;
  };
  const commonPurpose = (name, href) => {
    const text = norm(`${name} ${href || ""}`);
    const patterns = [
      [/\b(account|profile|my details|personal details)\b/, "Usually shows your personal details, profile, or security options."],
      [/\b(dashboard|home|overview)\b/, "Usually gives an overview and shortcuts to the main tasks."],
      [/\b(order|orders|purchase|purchase history)\b/, "Usually lists purchases, their status, receipts, or returns."],
      [/\b(track order|tracking|shipment|delivery status)\b/, "Usually shows where a delivery is and its latest status."],
      [/\b(cart|basket)\b/, "Usually holds the items you have selected before checkout."],
      [/\b(checkout)\b/, "Usually lets you review an order and choose delivery and payment details."],
      [/\b(return|refund|replacement)\b/, "Usually explains how to return an item or request money back."],
      [/\b(payment|payments|billing|invoice|invoices|subscription|fee|fees)\b/, "Usually shows payment methods, charges, dues, or invoices."],
      [/\b(help|support|faq|frequently asked)\b/, "Usually contains answers to common questions and ways to get help."],
      [/\b(setting|settings|preference|preferences)\b/, "Usually lets you change account or website preferences."],
      [/\b(notification|notifications|message|messages|inbox)\b/, "Usually shows updates, alerts, or messages."],
      [/\b(document|documents|file|files|record|records|download)\b/, "Usually provides records or files you can view or download."],
      [/\b(search|find|lookup)\b/, "Usually helps you find a page, record, or item."],
      [/\b(sign in|signin|login|log in)\b/, "Usually opens the form for an existing account."],
      [/\b(sign up|signup|register|registration|create account)\b/, "Usually starts the process of creating an account."],
      [/\b(log out|logout|sign out|signout)\b/, "Usually signs you out of the website."],
      [/\b(contact|contact us)\b/, "Usually shows how to reach the organization."],
      [/\b(about|about us)\b/, "Usually explains who runs the website and what the organization does."],
      [/\b(service|services)\b/, "Usually lists the services the organization provides."],
      [/\b(product|products|catalog|shop)\b/, "Usually shows the products or items available."],
      [/\b(course|courses|subject|subjects|class|classes)\b/, "Usually lists classes, subjects, or learning materials."],
      [/\b(admission|admissions|application|apply now)\b/, "Usually explains how to apply or check an application."],
      [/\b(result|results|grade|grades|marks|score|scores)\b/, "Usually shows exam results, marks, or progress."],
      [/\b(timetable|schedule|calendar|appointment)\b/, "Usually shows dates, times, classes, or planned events."],
      [/\b(attendance)\b/, "Usually shows attendance records or attendance-related actions."],
      [/\b(privacy|terms|policy)\b/, "Usually explains the website's privacy rules or terms of use."]
    ];
    return patterns.find(([pattern]) => pattern.test(text))?.[1] || "";
  };

  const selectors = mode === "form"
    ? 'input:not([type="hidden"]):not([type="submit"]):not([type="button"]),textarea,select'
    : mode === "nav"
      ? 'a[href],button,[role="button"],[role="link"],summary'
      : 'a[href],button,input:not([type="hidden"]),textarea,select,[role="button"],[role="link"],h1,h2,h3,h4,h5,h6,p,li,label,summary,section,article';
  const candidates = [...document.querySelectorAll(selectors)].filter(visible)
    .filter(element => !element.disabled && element.getAttribute("aria-disabled") !== "true");
  const wanted = norm(query);
  const terms = wanted.split(" ").filter(Boolean);
  const results = [];
  const seen = new Set();

  for (let index = 0; index < candidates.length; index++) {
    const element = candidates[index];
    const tag = element.tagName.toLowerCase();
    const title = nameOf(element) || (mode === "form" ? `Unlabelled ${element.getAttribute("type") || tag} field` : tag);
    const context = contextOf(element);
    const href = element.getAttribute("href") || "";
    const raw = clean(element.innerText || element.textContent || title);
    const haystack = norm([title, raw, href, context.heading, context.region, element.getAttribute("name"), element.id].join(" "));
    let score = 0;

    if (mode === "form") {
      if (wanted && !haystack.includes(wanted) && !terms.some(term => haystack.split(" ").includes(term))) continue;
      score = 30 + (element.required || element.getAttribute("aria-required") === "true" ? 5 : 0);
    } else if (mode === "nav") {
      const inNav = !!element.closest('nav,[role="navigation"]');
      score = (inNav ? 20 : 0) + (tag === "a" ? 10 : 0) + (commonPurpose(title, href) ? 12 : 0);
      if (wanted) {
        const hits = terms.filter(term => haystack.split(" ").includes(term)).length;
        if (!hits && !haystack.includes(wanted)) continue;
        score += hits * 25 + (haystack.includes(wanted) ? 30 : 0);
      }
    } else {
      if (!wanted) continue;
      const hits = terms.filter(term => haystack.split(" ").includes(term)).length;
      if (!hits && !haystack.includes(wanted)) continue;
      if (terms.length > 1 && hits === 0 && !haystack.includes(wanted)) continue;
      score = hits * 25 + (haystack.includes(wanted) ? 35 : 0);
      if (["a", "button", "input", "textarea", "select", "h1", "h2", "h3"].includes(tag)) score += 12;
    }

    const path = pathOf(element);
    if (!path) continue;
    const uniqueKey = `${tag}:${norm(title)}:${href}`;
    if (seen.has(uniqueKey)) continue;
    seen.add(uniqueKey);

    let detail = "";
    let reason = "";
    if (mode === "form") {
      const required = element.required || element.getAttribute("aria-required") === "true";
      detail = `${fieldDescription(element, title)}${required ? " This field is required." : " This field is optional."}`;
      reason = `Field type: ${element.getAttribute("type") || (tag === "input" ? "text" : tag)}.`;
    } else if (mode === "nav") {
      const purpose = commonPurpose(title, href);
      if (tag === "a") {
        let destination = "its linked page";
        try { const url = new URL(href, location.href); destination = `${url.hostname}${url.pathname === "/" ? "" : url.pathname}`; } catch (_) {}
        detail = `This link opens ${destination}.${purpose ? ` ${purpose}` : " It takes you to another part of the website."}`;
      } else if (tag === "summary" || element.getAttribute("aria-expanded") !== null) {
        detail = `This control shows or hides a section of the page.${purpose ? ` ${purpose}` : ""}`;
      } else if ((element.getAttribute("type") || "").toLowerCase() === "submit" || (tag === "button" && element.form)) {
        detail = `This button submits the form it belongs to.${purpose ? ` ${purpose}` : " Check the form fields before using it."}`;
      } else {
        detail = purpose || "This is an on-page action. The page does not explain its exact effect, so check the nearby text before using it.";
      }
      reason = context.heading ? `It appears in the “${context.heading}” section.` : context.region ? `It appears in the page's ${context.region} area.` : "Description based on the link or control details available on the page.";
    } else {
      detail = context.heading
        ? `Under “${context.heading}”: this area may help with “${query}”.`
        : mode === "custom"
          ? "This area may help with your task. Check the nearby details."
          : `This area contains related information. Check the nearby details for “${query}”.`;
      reason = "The label, destination, or nearby section contains related words.";
    }

    results.push({
      title: title.slice(0, 90), detail, reason, score, path,
      frameUrl: location.href, frameTitle: clean(document.title || location.hostname),
      kind: mode === "form" ? "form" : mode === "nav" ? "navigation" : "content"
    });
  }

  results.sort((a, b) => b.score - a.score);
  const limit = mode === "form" ? 40 : mode === "nav" ? 16 : 5;
  return results.slice(0, limit);
}

function highlightClickSimpleFramePath(path) {
  try {
    if (!Array.isArray(path) || !path.length) return { ok: false };
    let element = document.documentElement;
    for (const rawIndex of path) {
      const index = Number(rawIndex);
      if (!Number.isInteger(index) || index < 0) return { ok: false };
      element = element?.children?.[index];
      if (!element) return { ok: false };
    }
    if (!element.isConnected) return { ok: false };
    document.querySelectorAll(".cs-embedded-target").forEach(item => {
      item.classList.remove("cs-embedded-target");
      item.style.removeProperty("outline");
      item.style.removeProperty("outline-offset");
    });
    element.classList.add("cs-embedded-target");
    element.style.setProperty("outline", "3px solid #b9f36b", "important");
    element.style.setProperty("outline-offset", "4px", "important");
    try { element.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" }); } catch (_) {}
    try { element.focus({ preventScroll: true }); } catch (_) {}
    return { ok: true };
  } catch (_) {
    return { ok: false };
  }
}

function clearClickSimpleFrameHighlight() {
  document.querySelectorAll(".cs-embedded-target").forEach(element => {
    element.classList.remove("cs-embedded-target");
    element.style.removeProperty("outline");
    element.style.removeProperty("outline-offset");
  });
  return { ok: true };
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  const tabId = sender.tab?.id;
  if (tabId == null || !message?.type?.startsWith("CLICKSIMPLE_")) return false;

  const key = journeyKey(tabId);
  if (message.type === "CLICKSIMPLE_SAVE_JOURNEY") {
    chrome.storage.local.set({ [key]: message.journey })
      .then(() => sendResponse({ ok: true }))
      .catch(() => sendResponse({ ok: false }));
    return true;
  }
  if (message.type === "CLICKSIMPLE_GET_JOURNEY") {
    chrome.storage.local.get(key)
      .then(result => sendResponse({ journey: result[key] || null }))
      .catch(() => sendResponse({ journey: null }));
    return true;
  }
  if (message.type === "CLICKSIMPLE_CLEAR_JOURNEY") {
    chrome.storage.local.remove(key)
      .then(() => sendResponse({ ok: true }))
      .catch(() => sendResponse({ ok: false }));
    return true;
  }
  if (message.type === "CLICKSIMPLE_SCAN_EMBEDDED") {
    chrome.scripting.executeScript({
      target: { tabId, allFrames: true },
      func: scanClickSimpleFrame,
      args: [String(message.query || ""), String(message.mode || "find"), String(message.topOrigin || "")]
    }).then(injections => {
      const results = [];
      for (const injection of injections || []) {
        if (injection.frameId === 0 || !Array.isArray(injection.result)) continue;
        for (const item of injection.result) results.push({ ...item, frameId: injection.frameId, remote: true });
      }
      results.sort((a, b) => b.score - a.score);
      sendResponse({ results: results.slice(0, message.mode === "form" ? 40 : message.mode === "nav" ? 24 : 5) });
    }).catch(() => sendResponse({ results: [], limited: true }));
    return true;
  }
  if (message.type === "CLICKSIMPLE_CLEAR_EMBEDDED_HIGHLIGHT") {
    const frameId = Number(message.frameId);
    if (!Number.isInteger(frameId) || frameId <= 0) return false;
    chrome.scripting.executeScript({
      target: { tabId, frameIds: [frameId] },
      func: clearClickSimpleFrameHighlight
    }).then(() => sendResponse({ ok: true })).catch(() => sendResponse({ ok: false }));
    return true;
  }
  if (message.type === "CLICKSIMPLE_HIGHLIGHT_EMBEDDED") {
    const frameId = Number(message.frameId);
    if (!Number.isInteger(frameId) || frameId <= 0 || !Array.isArray(message.path)) {
      sendResponse({ ok: false });
      return false;
    }
    chrome.scripting.executeScript({
      target: { tabId, frameIds: [frameId] },
      func: highlightClickSimpleFramePath,
      args: [message.path]
    }).then(result => sendResponse({ ok: !!result?.[0]?.result?.ok }))
      .catch(() => sendResponse({ ok: false }));
    return true;
  }
  return false;
});

// Re-open ClickSimple after a same-origin page navigation when a guided search is active.
chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
  if (changeInfo.status !== "complete") return;
  const key = journeyKey(tabId);
  chrome.storage.local.get(key).then(result => {
    if (!result[key]) return;
    chrome.scripting.executeScript({ target: { tabId }, files: ["content.js"] }).catch(() => {});
  }).catch(() => {});
});

chrome.tabs.onRemoved.addListener(tabId => {
  chrome.storage.local.remove(journeyKey(tabId)).catch(() => {});
});

// Carry an active search into tabs opened from the current tab.
chrome.tabs.onCreated.addListener(tab => {
  const openerId = tab.openerTabId;
  if (openerId == null || tab.id == null) return;
  const sourceKey = journeyKey(openerId);
  chrome.storage.local.get(sourceKey).then(result => {
    const journey = result[sourceKey];
    if (journey) return chrome.storage.local.set({ [journeyKey(tab.id)]: journey });
    return undefined;
  }).catch(() => {});
});
