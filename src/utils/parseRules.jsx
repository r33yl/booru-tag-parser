function kebabToCamel(str) {
    return str.replace(/-([a-z])/g, (_, char) => char.toUpperCase());
}

export const parseRules = [
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
                if (!aList[1]) return null;
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
                if (!aList[1]) return null;
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
                if (!aList[1]) return null;
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
                if (!aList[1]) return null;
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
                if (!aList[1]) return null;
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
                if (!aList[1]) return null;
                const name = aList[1].textContent.trim();

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
                if (!a) return null;

                const name = a.textContent.trim();
                const type = "general";
                const countSpan = tr.querySelector("td.tag_count_cell span.tag_count");
                const count = countSpan ? parseInt(countSpan.textContent.replace(/,/g, ""), 10) : 0;

                return { name, type, count };
            }).filter(Boolean),
    },
];