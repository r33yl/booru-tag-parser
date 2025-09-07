import { parseRules } from "./parseRules";

const mainProxyServices = [
    "https://api.allorigins.win/get?url=",
    "https://corsproxy.io/?",
    "https://api.codetabs.com/v1/proxy?quest=",
];

const otherProxyServices = [
    "https://api.allorigins.win/raw?url=",
    "https://api.codetabs.com/v1/tmp/?quest=",

    "https://yacdn.org/proxy/", // ¯\_(ツ)_/¯
    "http://fuck-cors.com/?url=", // ¯\_(ツ)_/¯
    "https://jsonp.afeld.me/?callback=&url=", // ¯\_(ツ)_/¯
    "https://api.cors.lol/?url=", // Rate limit exceeded
    "https://thingproxy.freeboard.io/fetch/", // http
    "https://cors-proxy.fringe.zone/", // http
    "https://crossorigin.me/", // http

    "https://serene-basin-16003.herokuapp.com/", // CORS policy
    "https://universal-cors-proxy.glitch.me/", // CORS policy
    "http://www.whateverorigin.org/get?url=", // CORS policy
    "https://test.cors.workers.dev/?", // CORS policy
    "https://cors-nowhere.glitch.me/", // CORS policy
    "http://coin-toss.herokuapp.com/", // CORS policy
    "https://proxy.corsfix.com/?", // CORS policyr.
    "https://proxy.cors.sh/", // CORS policy
    "https://cors.bridged.cc/", // CORS policy
    "https://cors.io/?", // CORS policy

    "https://cors-anywhere.herokuapp.com/", // 404
    "https://cors-proxy.htmldriven.com/?url=", // 404
    "http://cors-proxy.htmldriven.com/get?url=", // 404
];

let lastRequestUrl = null;
let lastRequestResult = null;
let lastRequestTime = 0;
let bestProxy = null;
let bestProxyTimestamp = 0;

const REQUEST_DELAY = 3000;
const TIMEOUT_MS = 5000;
const BATCH_SIZE = 3;
const BEST_PROXY_LIFETIME = 5 * 60 * 1000;

async function fetchWithTimeout(url, timeout = TIMEOUT_MS) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);

    try {
        return await fetch(url, { signal: controller.signal });
    } finally {
        clearTimeout(id);
    }
}

async function fetchWithProxy(proxy, url, logger = () => { }) {
    try {
        logger(`Connecting via proxy ${proxy}...`);
        const res = await fetchWithTimeout(proxy + encodeURIComponent(url));
        if (!res.ok || res.status === 403) {
            logger(`Proxy failed: HTTP ${res.status}`);
            throw new Error(`Proxy failed: HTTP ${res.status}`);
        }

        const contentType = res.headers.get("content-type") || "";
        if (contentType.includes("application/json")) {
            const data = await res.json().catch(() => ({}));
            return data.contents || data.html || JSON.stringify(data);
        } else {
            return await res.text();
        }
    } catch (err) {
        throw new Error(`Proxy ${proxy} failed: ${err.message}`);
    }
}

function parseHtml(htmlString) {
    const parser = new DOMParser();
    return parser.parseFromString(htmlString, "text/html");
}

function delay(ms = 100) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export async function fetchHtml(url, logger = () => { }) {
    const now = Date.now();

    if (url === lastRequestUrl && now - lastRequestTime < REQUEST_DELAY) {
        await delay(50);
        logger("Using cached response");
        return lastRequestResult;
    }

    lastRequestUrl = url;
    lastRequestTime = now;

    const allProxies = [...mainProxyServices, ...otherProxyServices];
    let lastError = null;

    if (bestProxy && Date.now() - bestProxyTimestamp < BEST_PROXY_LIFETIME) {
        try {
            logger(`Trying best proxy: ${bestProxy}`);
            const htmlString = await fetchWithProxy(bestProxy, url, logger);

            const doc = parseHtml(htmlString);
            lastRequestResult = doc;
            return doc;

        } catch (err) {
            bestProxy = null;
            if (err && err.errors) {
                logger(`Best proxy failed, falling back to batch: ${err.errors.map(e => e.message).join("; ")}`);
            } else {
                logger(`Best proxy failed, falling back to batch: ${err.message}`);
            }
            lastError = err;
        }
    }
    else {
        for (let i = 0; i < allProxies.length; i += BATCH_SIZE) {
            const batch = allProxies.slice(i, i + BATCH_SIZE);
            logger(`Trying proxies ${i + 1}-${i + batch.length}...`);

            const promises = batch.map(proxy => fetchWithProxy(proxy, url, logger));

            try {
                const htmlString = await Promise.any(promises);
                bestProxy = batch.find(_ => htmlString);
                bestProxyTimestamp = Date.now();
                logger("HTML fetched, parsing...");

                const doc = parseHtml(htmlString);
                lastRequestResult = doc;
                return doc;
            } catch (err) {
                if (err && err.errors) {
                    logger(`Batch failed: ${err.errors.map(e => e.message).join("; ")}`);
                } else {
                    logger(`Batch failed: ${err.message}`);
                }
                lastError = err;
            }
        }
    }

    logger("All proxies failed ;(");
    throw new Error(`All proxies failed: ${lastError}`);
}

export function parseTags(url, doc) {
    for (const rule of parseRules) {
        if (rule.match.test(url)) {
            return rule.extract(doc);
        }
    }

    return [{ name: "Unknown site or unsupported structure", type: "errorLog", meta: "Unknown site" }];
}

export function parseUnsupportedSite() {
    for (const rule of parseRules) {
        try {
            const result = rule.extract(lastRequestResult);
            if (result.length > 0) return result;
        } catch (e) {
            // Ignore errors of individual parsers
        }
    }
    return [{ name: "🤷‍♂️ Couldn't figure it out, try manual parsing!", type: "errorLog" }];
}
