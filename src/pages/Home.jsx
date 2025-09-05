
import { useState, useEffect, useRef } from "react";
import { Search, Copy, LoaderCircle } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

import { colors } from "../colors";
import { fetchHtml, parseTags } from "../utils/parser";

export default function Home() {
    const [loading, setLoading] = useState(false);
    const [url, setUrl] = useState("");
    const [separator, setSeparator] = useState(", ");
    const [tags, setTags] = useState([]);
    const [colorTags, setColorTags] = useState(false);

    const divRef = useRef(null);
    const [isFocus, setIsFocus] = useState(false);

    const [lastHostName, setLastHostName] = useState(null);

    const [tagTypes, setTagTypes] = useState({
        error: true,
        artist: true,
        character: true,
        copyright: true,
        metadata: true,
        general: true,
        deprecated: true,
        style: true,
        circle: true,
        contributor: true,
        species: true,
        invalid: true,
        lore: true,
        rating: true,
        origin: true,
        oc: true,
        bodyType: true,
        contentFanmade: true,
        contentOfficial: true,
    });

    const standardTagTypes = [
        { key: "artist", label: "Artist", color: "text-red-700", bg: "bg-red-700", border: "border-red-700", hover: "hover:bg-red-600" },
        { key: "character", label: "Character", color: "text-green-700", bg: "bg-green-700", border: "border-green-700", hover: "hover:bg-green-600" },
        { key: "copyright", label: "Copyright", color: "text-fuchsia-700", bg: "bg-fuchsia-700", border: "border-fuchsia-700", hover: "hover:bg-fuchsia-600" },
        { key: "metadata", label: "Metadata", color: "text-yellow-600", bg: "bg-yellow-600", border: "border-yellow-600", hover: "hover:bg-yellow-500" },
        { key: "general", label: "General", bg: "bg-blue-700", border: "border-blue-700", hover: "hover:bg-blue-600" },
        { key: "deprecated", label: "Deprecated", color: "text-neutral-500", bg: "bg-neutral-700", border: "border-neutral-700", hover: "hover:bg-neutral-600" },
    ];
    const optionalTagTypesBySite = {
        "konachan.com": [
            { key: "style", label: "Style", color: "text-rose-600", bg: "bg-rose-600", border: "border-rose-600", hover: "hover:bg-rose-500" },
            { key: "circle", label: "Circle", color: "text-teal-600", bg: "bg-teal-600", border: "border-teal-600", hover: "hover:bg-teal-500" },
        ],
        "e621.net": [
            { key: "contributor", label: "Contributor", color: "text-neutral-500", bg: "bg-neutral-800", border: "border-neutral-800", hover: "hover:bg-neutral-700" },
            { key: "species", label: "Species", color: "text-orange-600", bg: "bg-orange-600", border: "border-orange-600", hover: "hover:bg-orange-500" },
            { key: "invalid", label: "Invalid", color: "text-red-600", bg: "bg-red-600", border: "border-red-600", hover: "hover:bg-red-500" },
            { key: "lore", label: "Lore", color: "text-lime-700", bg: "bg-lime-700", border: "border-lime-700", hover: "hover:bg-lime-600" },
        ],
        "derpibooru.org": [
            { key: "rating", label: "Rating", color: "text-sky-700", bg: "bg-sky-700", border: "border-sky-700", hover: "hover:bg-sky-600" },
            { key: "origin", label: "Origin", color: "text-violet-700", bg: "bg-violet-800", border: "border-violet-800", hover: "hover:bg-violet-700" },
            { key: "oc", label: "OC", color: "text-pink-700", bg: "bg-pink-700", border: "border-pink-700", hover: "hover:bg-pink-600" },
            { key: "species", label: "Species", color: "text-yellow-900", bg: "bg-yellow-900", border: "border-yellow-900", hover: "hover:bg-yellow-800" },
            { key: "bodyType", label: "Body Type", color: "text-neutral-500", bg: "bg-neutral-700", border: "border-neutral-700", hover: "hover:bg-neutral-600" },
            { key: "contentFanmade", label: "Content Fanmade", color: "text-pink-700", bg: "bg-pink-800", border: "border-pink-800", hover: "hover:bg-pink-700" },
            { key: "contentOfficial", label: "Content Official", color: "text-amber-500", bg: "bg-amber-500", border: "border-amber-500", hover: "hover:bg-amber-400" },
        ],
    };
    const tagNoneSelected = !Object.values(tagTypes).some(v => v);

    const getActiveTagTypes = () => {
        let optional = [];

        if (lastHostName && optionalTagTypesBySite[lastHostName]) {
            optional = optionalTagTypesBySite[lastHostName];
        }

        return [...standardTagTypes, ...optional];
    };

    useEffect(() => {
        function handleClickOutside(event) {
            if (divRef.current && !divRef.current.contains(event.target)) {
                setIsFocus(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);


    const getTagTextDecorationClass = (typeKey) => {
        const tagType = getActiveTagTypes().find(t => t.key === typeKey);
        if (!tagType) return "";

        if (tagType.key === "deprecated") {
            return `${tagType.color || ""} line-through`;
        }

        return tagType.color || "";
    };

    const standardSeparators = [
        { key: "coma", label: ",", value: ", " },
        { key: "pipe", label: "|", value: " | " },
        { key: "space", label: "Space", value: " " },
        { key: "newLine", label: "New Line", value: "\n" },
    ];


    function handleUrlChange(newUrl) {
        setUrl(newUrl);

        try {
            if (newUrl) {
                const hostname = new URL(newUrl).hostname;
                if (hostname) setLastHostName(hostname);
            }
        } catch {
            console.warn("Invalid URL:", url);
        }
    }

    const toggleTagType = (type) => {
        setTagTypes((prev) => ({ ...prev, [type]: !prev[type] }));
    };

    const toggleColorTags = () => {
        setColorTags(prev => !prev);
    };

    const copyToClipboard = () => {
        const text = tags.map(tag => tag.name).join(separator);
        navigator.clipboard.writeText(text);
        toast.success('Text copied!', {
            style: {
                padding: '8px 12px',
                background: "#171717",
                border: '1px solid #1d4ed8',
                color: '#FFFAEE',

            },
            iconTheme: {
                primary: '#1d4ed8',
                secondary: '#FFFAEE',
            },
        });
    };

    async function fetchTags() {
        if (!url) return;
        setLoading(true);

        try {
            const doc = await fetchHtml(url);
            const extracted = parseTags(url, doc);
            setTags(extracted);
        } catch (err) {
            console.error(err);
            setTags([{ name: "Error fetching tags", type: "error" }]);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className={`flex flex-col items-center justify-around`}>

            <div className="w-full max-w-4xl space-y-4">
                <h1 className="text-6xl text-center pt-20 pb-8 font-semibold">
                    Booru Tag Parser
                </h1>

                {/* URL input with button */}
                <form
                    className="relative"
                    autoComplete="on"
                    onSubmit={(e) => {
                        e.preventDefault();
                        fetchTags();
                    }}
                >

                    <input
                        className={`w-full px-5 py-4 pr-32 text-ellipsis rounded-xl ${colors.inputBg} ${colors.inputPlaceholder} focus:outline-none focus:ring-2 ${colors.inputFocus}`}
                        type="text"
                        name="booru-url"
                        autoComplete="on"
                        placeholder="Paste Post URL"
                        value={url}
                        onChange={(e) => handleUrlChange(e.target.value)}
                    />
                    <button
                        type="submit"
                        className={`absolute right-2 top-2 bottom-2 min-w-28 place-content-center ${colors.button} ${colors.buttonHover} ${colors.buttonText} font-medium px-4 rounded-xl shadow-md flex items-center gap-2 transition-colors duration-200`}
                    >
                        {loading
                            ? <LoaderCircle className="h-5 w-5 animate-spin" />
                            : <>
                                <Search className="h-5 w-5" />
                                Parse
                            </>
                        }
                    </button>
                </form>

                {/* Tag type toggles */}
                <div className="flex flex-wrap items-center justify-center gap-2 text-center">
                    <span className={`${colors.secondaryText}`}>Tag type:</span>
                    {getActiveTagTypes().map((type, idx) => (
                        <>
                            {idx === standardTagTypes.length &&
                                <div className={`w-px h-6 ${colors.divider}`}></div>
                            }
                            <button
                                key={type.key}
                                onClick={() => toggleTagType(type.key)}
                                className={`px-3 py-1 rounded-lg border transition-colors duration-200 ${tagTypes[type.key]
                                    ? `${colorTags ? type.bg : colors.button} ${colorTags ? type.hover : colors.buttonHover} ${colorTags ? type.border : colors.buttonBorder} ${colors.buttonText}`
                                    : `${colors.buttonBorderDisable} ${colors.buttonTextDisable}`
                                    }`}
                            >
                                {type.label}
                            </button>
                        </>
                    ))}
                    <div className={`w-px h-6 ${colors.divider}`}></div>
                    <button
                        key={colorTags}
                        onClick={toggleColorTags}
                        className={`px-3 py-1 rounded-lg border transition-colors duration-200 ${colorTags
                            ? `${colors.button} ${colors.buttonHover} ${colors.buttonBorder} ${colors.buttonText}`
                            : `${colors.buttonBorderDisable} ${colors.buttonTextDisable}`
                            }`}
                    >
                        Color
                    </button>
                </div>

                {/* Separator options */}
                <div className="flex flex-wrap items-center justify-center gap-2 text-center">
                    <span className={`${colors.secondaryText}`}>Separator:</span>
                    {standardSeparators.map((sep) => (
                        <button
                            key={sep.key}
                            onClick={() => setSeparator(sep.value)}
                            className={`px-3 py-1 rounded-lg border transition-colors duration-200 ${(separator === sep.value)
                                ? `${colors.button} ${colors.buttonHover} ${colors.buttonBorder} ${colors.buttonText}`
                                : `${colors.buttonBorderDisable} ${colors.buttonTextDisable}`
                                }`}
                        >
                            {sep.label}
                        </button>
                    ))}
                    <input
                        className={`w-24 px-3 py-1 rounded-lg border ${colors.inputBg} ${colors.buttonBorderDisable} ${colors.inputPlaceholder} focus:outline-none focus:ring-1 ${separator.length > 0 ? colors.inputFocus : colors.inputFocusError} ${colors.inputFocusBorder}`}
                        value={separator}
                        onChange={(e) => setSeparator(e.target.value)}
                        placeholder="Custom"
                    />
                </div>

                {/* Tags output */}
                {tags.length > 0 && (
                    <div className="mt-4">
                        {/* Divider */}
                        {/* <div className={`h-px w-full ${colors.divider} mb-2`}></div> */}

                        <div className="flex justify-between items-center mb-2">
                            <h2 className="text-lg font-semibold" style={{ alignSelf: "end" }}>
                                {(!loading && !tagNoneSelected) ? tags.length : "..."} tags found:
                            </h2>
                            <button
                                onClick={copyToClipboard}
                                className={`flex px-3 py-1 rounded-lg items-center gap-2 ${colors.buttonConfirm} ${colors.buttonConfirmHover} transition-colors duration-200`}
                            >
                                <Copy className="h-4 w-4" />
                                Copy
                            </button>
                        </div>

                        <div
                            ref={divRef}
                            className={`${isFocus ? "outline-none ring-2 ring-blue-500" : ""} w-full h-auto px-3 py-2 rounded-xl items-start text-start ${colors.inputBg} overflow-auto`}
                            style={{ cursor: "text" }}
                            onMouseDown={() => setIsFocus(true)}
                        >
                            {loading
                                ? <span>Loading...</span>
                                : tagNoneSelected
                                    ? <span>Tag type none selected</span>
                                    : tags
                                        .filter(tag => tagTypes[tag.type] !== false)
                                        .map((tag, idx) => (
                                            <>
                                                <span key={`tag-${idx}`} className={`${tag.type === "error" ? "underline text-red-600" : (colorTags ? getTagTextDecorationClass(tag.type) : "")}`}>
                                                    {tag.name}
                                                </span>
                                                <span key={`sep-${idx}`}>
                                                    {idx < tags.length - 1 ? separator : ""}
                                                </span>
                                            </>
                                        ))
                            }
                        </div>
                    </div>
                )}
            </div>
            <Toaster
                position="bottom-center"
                reverseOrder={false}
            />
        </div >
    );
}
