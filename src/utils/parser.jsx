
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
const REQUEST_DELAY = 5000;
const TIMEOUT_MS = 7000; // таймаут на каждый fetch

async function fetchWithTimeout(url, timeout = TIMEOUT_MS) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);

    try {
        return await fetch(url, { signal: controller.signal });
    } finally {
        clearTimeout(id);
    }
}

export async function fetchHtml(url, logger = () => { }) {
    const now = Date.now();

    if (url === lastRequestUrl && now - lastRequestTime < REQUEST_DELAY) {
        logger("Using cached response");
        return lastRequestResult;
    }

    lastRequestUrl = url;
    lastRequestTime = now;

    const allProxies = [...mainProxyServices, ...otherProxyServices];
    let lastError = null;

    for (let i = 0; i < allProxies.length; i += 3) {
        const batch = allProxies.slice(i, i + 3);
        logger(`Trying proxies ${i + 1}-${i + batch.length}...`);

        // создаём массив промисов, каждый промис — отдельный прокси
        const promises = batch.map(async (proxy) => {
            try {
                logger(`Connecting via proxy ${proxy}...`);
                const res = await fetchWithTimeout(proxy + encodeURIComponent(url));
                if (!res.ok) {
                    logger(`Proxy failed: HTTP ${res.status}`);
                    return null;
                }

                const contentType = res.headers.get("content-type") || "";
                if (contentType.includes("application/json")) {
                    const data = await res.json();
                    return data.contents ?? "";
                } else {
                    return await res.text();
                }
            } catch (err) {
                throw new Error(`Proxy ${proxy} failed: ${err.message}`);
            }
        });

        try {
            const htmlString = await Promise.any(promises);
            logger("HTML fetched, parsing...");
            const parser = new DOMParser();
            const doc = parser.parseFromString(htmlString, "text/html");

            lastRequestResult = doc;
            return doc;
        } catch (err) {
            logger(`Batch failed: ${err}`);
            lastError = err;
        }
    }

    logger("All proxies failed ;(");
    throw new Error(`All proxies failed: ${lastError}`);
}



function kebabToCamel(str) {
    return str.replace(/-([a-z])/g, (_, char) => char.toUpperCase());
}

export function parseTags(url, doc) {
    const rules = [
        {
            match: /gelbooru\.com/,
            extract: (doc) =>
                [...doc.querySelectorAll("li[class^='tag-type-'] a")]
                    .filter((a) => a.getAttribute("href")?.includes("tags="))
                    .map((a) => {
                        const li = a.closest("li");
                        let type = "general";
                        if (li) {
                            const cls = li.className;
                            if (cls.includes("tag-type-artist")) type = "artist";
                            else if (cls.includes("tag-type-character")) type = "character";
                            else if (cls.includes("tag-type-copyright")) type = "copyright";
                            else if (cls.includes("tag-type-metadata")) type = "metadata";
                            else if (cls.includes("tag-type-deprecated")) type = "deprecated";
                        }
                        return { name: a.textContent.trim(), type };
                    }).filter(Boolean),
        },
        {
            match: /danbooru\.donmai\.us|sonohara\.donmai\.us|donmai\.moe/,
            extract: (doc) =>
                [...doc.querySelectorAll(".tag-list li")].map((li) => {
                    const a = li.querySelector("a.search-tag");
                    if (!a) return null;

                    let type = "general";
                    const dataDeprecated = li.getAttribute("data-is-deprecated");

                    // определяем тип через data-атрибут или class
                    const cls = li.className.toLowerCase();
                    if (cls.includes("tag-type-1")) type = "artist";
                    else if (cls.includes("tag-type-4")) type = "character";
                    else if (cls.includes("tag-type-3")) type = "copyright";
                    else if (cls.includes("tag-type-5")) type = "metadata";
                    else if (dataDeprecated === "true") type = "deprecated";

                    return { name: a.textContent.trim(), type };
                }).filter(Boolean),
        },
        {
            match: /rule34\.xxx/,
            extract: (doc) =>
                [...doc.querySelectorAll("#tag-sidebar li.tag")].map((li) => {
                    const aList = li.querySelectorAll("a");
                    if (!aList[1]) return null; // второе <a> содержит имя тега
                    const name = aList[1].textContent.trim();

                    let type = "general";
                    const cls = li.className.toLowerCase();
                    if (cls.includes("tag-type-artist")) type = "artist";
                    else if (cls.includes("tag-type-character")) type = "character";
                    else if (cls.includes("tag-type-copyright")) type = "copyright";
                    else if (cls.includes("tag-type-metadata")) type = "metadata";
                    else if (cls.includes("tag-type-deprecated")) type = "deprecated";

                    return { name, type };
                }).filter(Boolean),
        },
        {
            match: /tbib\.org/,
            extract: (doc) =>
                [...doc.querySelectorAll("#tag-sidebar li.tag")].map((li) => {
                    const a = li.querySelector("a");
                    if (!a) return null;

                    const name = a.textContent.trim();

                    let type = "general";
                    const cls = li.className.toLowerCase();
                    if (cls.includes("tag-type-artist")) type = "artist";
                    else if (cls.includes("tag-type-character")) type = "character";
                    else if (cls.includes("tag-type-copyright")) type = "copyright";
                    else if (cls.includes("tag-type-metadata")) type = "metadata";
                    else if (cls.includes("tag-type-deprecated")) type = "deprecated";

                    return { name, type };
                }).filter(Boolean),
        },
        {
            match: /yande\.re/,
            extract: (doc) =>
                [...doc.querySelectorAll("li[class^='tag-type-']")].map((li) => {
                    const aList = li.querySelectorAll("a");
                    if (!aList[1]) return null; // второе <a> содержит имя
                    const name = aList[1].textContent.trim();

                    let type = "general";
                    const cls = li.className.toLowerCase();
                    if (cls.includes("artist")) type = "artist";
                    else if (cls.includes("character")) type = "character";
                    else if (cls.includes("copyright")) type = "copyright";
                    else if (cls.includes("metadata")) type = "metadata";
                    else if (cls.includes("deprecated")) type = "deprecated";

                    return { name, type };
                }).filter(Boolean),
        },
        {
            match: /safebooru\.org/,
            extract: (doc) =>
                [...doc.querySelectorAll("#tag-sidebar li.tag")].map((li) => {
                    const aList = li.querySelectorAll("a");
                    if (!aList[1]) return null; // второе <a> содержит имя тега
                    const name = aList[1].textContent.trim();

                    let type = "general";
                    const cls = li.className.toLowerCase();
                    if (cls.includes("tag-type-artist")) type = "artist";
                    else if (cls.includes("tag-type-character")) type = "character";
                    else if (cls.includes("tag-type-copyright")) type = "copyright";
                    else if (cls.includes("tag-type-metadata")) type = "metadata";
                    else if (cls.includes("tag-type-deprecated")) type = "deprecated";

                    return { name, type };
                }).filter(Boolean),
        },
        {
            match: /xbooru\.com/,
            extract: (doc) =>
                [...doc.querySelectorAll("#tag-sidebar li.tag")].map((li) => {
                    const aList = li.querySelectorAll("a");
                    if (!aList[1]) return null; // второй <a> содержит имя
                    const name = aList[1].textContent.trim();

                    let type = "general";
                    const cls = li.className.toLowerCase();
                    if (cls.includes("artist")) type = "artist";
                    else if (cls.includes("character")) type = "character";
                    else if (cls.includes("copyright")) type = "copyright";
                    else if (cls.includes("metadata")) type = "metadata";
                    else if (cls.includes("deprecated")) type = "deprecated";

                    return { name, type };
                }).filter(Boolean),
        },
        {
            match: /hypnohub\.net/,
            extract: (doc) =>
                [...doc.querySelectorAll("#tag-sidebar li.tag")].map((li) => {
                    const aList = li.querySelectorAll("a");
                    if (!aList[1]) return null; // второй <a> содержит имя тега
                    const name = aList[1].textContent.trim();

                    let type = "general";
                    const cls = li.className.toLowerCase();
                    if (cls.includes("artist")) type = "artist";
                    else if (cls.includes("character")) type = "character";
                    else if (cls.includes("copyright")) type = "copyright";
                    else if (cls.includes("metadata")) type = "metadata";
                    else if (cls.includes("deprecated")) type = "deprecated";

                    return { name, type };
                }).filter(Boolean),
        },
        {
            match: /konachan\.com/,
            extract: (doc) =>
                [...doc.querySelectorAll("#tag-sidebar li.tag-link")].map((li) => {
                    const aList = li.querySelectorAll("a");
                    if (!aList[1]) return null; // второе <a> содержит имя тега
                    const name = aList[1].textContent.trim();

                    // тип хранится в data-type или fallback на general
                    const type = li.getAttribute("data-type") || "general";

                    return { name, type };
                }).filter(Boolean),
        },
        {
            match: /e621\.net/,
            extract: (doc) =>
                [...doc.querySelectorAll("ul.tag-list li.tag-list-item")].map((li) => {
                    const nameEl = li.querySelector(".tag-list-name");
                    if (!nameEl) return null;

                    const name = nameEl.textContent.trim();
                    const type = li.getAttribute("data-category") || "general";

                    return { name, type };
                }).filter(Boolean),
        },
        {
            match: /derpibooru\.org/,
            extract: (doc) =>
                [...doc.querySelectorAll(".tag-list .tag.dropdown")].map((div) => {
                    const name = div.getAttribute("data-tag-name")?.trim();
                    const type = kebabToCamel(div.getAttribute("data-tag-category")?.trim()) || "general";
                    if (!name) return null;

                    return { name, type };
                }).filter(Boolean),
        },
        {
            match: /realbooru\.com/,
            extract: (doc) =>
                [...doc.querySelectorAll("#tagLink a")].map((a) => {
                    if (!a.className) return null;
                    const name = a.textContent.trim();

                    let type = "general";
                    const cls = a.className.toLowerCase();
                    if (cls.includes("artist") || cls.includes("model")) type = "artist";
                    else if (cls.includes("character")) type = "character";
                    else if (cls.includes("copyright")) type = "copyright";
                    else if (cls.includes("metadata")) type = "metadata";
                    console.log(type);
                    return { name, type };
                }).filter(Boolean),
        },
        {
            match: /rule34\.paheal\.net/,
            extract: (doc) =>
                [...doc.querySelectorAll("tbody tr")].map((tr) => {
                    const a = tr.querySelector("td.tag_name_cell a.tag_name");
                    if (!a) return null; // если нет ссылки, пропускаем

                    const name = a.textContent.trim();
                    const type = "general"; // на Paheal нет явного типа, можно потом расширить
                    const countSpan = tr.querySelector("td.tag_count_cell span.tag_count");
                    const count = countSpan ? parseInt(countSpan.textContent.replace(/,/g, ""), 10) : 0;

                    return { name, type, count };
                }).filter(Boolean),
        },
    ];

    for (const rule of rules) {
        if (rule.match.test(url)) {
            return rule.extract(doc);
        }
    }

    return [{ name: "Unknown site or unsupported structure", type: "general" }];
}
