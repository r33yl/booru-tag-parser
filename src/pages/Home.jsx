import React, { useState, useEffect, useRef } from "react";
import { Search, LoaderCircle, Copy, Eye } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

import { colors } from "../config/colors";
import { fetchHtml, parseTags } from "../utils/parser";
import { optionalTagTypesBySite, standardTagTypes } from "../config/tagTypes";


export default function Home() {
    const [url, setUrl] = useState("");
    const [lastHostName, setLastHostName] = useState(null);
    const [loading, setLoading] = useState(false);
    const [log, setLog] = useState(null);
    const [separator, setSeparator] = useState(", ");
    const [tags, setTags] = useState([]);
    const [colorTags, setColorTags] = useState(false);

    const divRef = useRef(null);
    const [isFocus, setIsFocus] = useState(false);

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

    const getActiveTagTypes = () => {
        let optional = [];
        if (lastHostName && optionalTagTypesBySite[lastHostName]) {
            optional = optionalTagTypesBySite[lastHostName];
        }
        return [...standardTagTypes, ...optional];
    };

    const allTagsSelected = tags.filter(tag => tagTypes[tag.type] !== false).length === tags.length;
    const tagNoneSelected = !(getActiveTagTypes()
        .filter(tag => tag.key !== "error")
        .some(tag => tagTypes[tag.key]));

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
                let urlWithProtocol = (!/^https?:\/\//i.test(newUrl))
                    ? "https://" + newUrl
                    : newUrl;
                const hostname = new URL(urlWithProtocol).hostname;
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

    const enableAllTagTypes = () => {
        setTagTypes(prev => Object.fromEntries(Object.keys(prev).map(key => [key, true])));
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
        setLog(null);
        try {
            let urlWithProtocol = (!/^https?:\/\//i.test(url))
                ? "https://" + url
                : url;
            const doc = await fetchHtml(urlWithProtocol, (msg) => setLog(msg));
            setLog("Extracting tags...");
            const extracted = parseTags(urlWithProtocol, doc);
            setTags(extracted);
        } catch (err) {
            console.error(err);
            setTags([{ name: "Error fetching tags", type: "error" }]);
        } finally {
            setLoading(false);
            setLog(null);
        }
    }

    return (
        <div className={`flex flex-col justify-around ${colors.pageMotion} max-w-4xl space-y-4`}>
            <h1 className={`text-6xl text-center mt-20 mb-8 font-semibold mx-auto ${colors.headingScaleHover} ${colors.headingMotion}`}>
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
                    className={`w-full px-5 py-5 pr-32 rounded-xl shadow-md ${colors.inputBg} ${colors.inputPlaceholder} focus:outline-none ${colors.inputFocusRing} ${colors.inputFocus} ${colors.inputFocusBorder} ${colors.inputMotion} ${colors.inputInteractive}`}
                    type="text"
                    name="booru-url"
                    autoComplete="on"
                    placeholder="Paste Post URL"
                    value={url}
                    onChange={(e) => handleUrlChange(e.target.value)}
                />
                <button
                    type="submit"
                    className={`absolute right-2 top-2 bottom-2 min-w-28 place-content-center ${colors.button} ${colors.buttonHover} ${colors.buttonText} font-medium px-4 rounded-xl shadow-md flex items-center gap-2 ${colors.buttonMotion} ${colors.buttonShadowHover} ${colors.buttonScale}`}
                >
                    {loading
                        ? <LoaderCircle className="h-7 w-7 animate-spin" />
                        : <>
                            <Search className="h-5 w-5" />
                            Parse
                        </>
                    }
                </button>
            </form>

            {/* Tag type toggles */}
            <div className="flex flex-wrap items-center justify-center gap-2 text-center">
                <span className={`${colors.secondaryText} ${colors.secondaryTextHover} ${colors.textMotion}`}>Tag type:</span>
                {getActiveTagTypes().map((type, idx) => (
                    <React.Fragment key={type.key}>
                        {idx === standardTagTypes.length &&
                            <div className={`w-px h-6 ${colors.divider}`}></div>
                        }
                        <button
                            onClick={() => toggleTagType(type.key)}
                            className={`px-3 py-1 rounded-lg border shadow-md ${colors.buttonMotion} ${colors.buttonShadowHover} ${colors.buttonScale} ${tagTypes[type.key]
                                ? `${colorTags ? type.bg : colors.button} ${colorTags ? type.hover : colors.buttonHover} ${colorTags ? type.border : colors.buttonBorder} ${colors.buttonText}`
                                : `${colors.buttonBorderDisable} ${colors.buttonTextDisable}`
                                }`}
                        >
                            <span className="will-change-transform">{type.label}</span>
                        </button>
                    </React.Fragment>
                ))}
                <div className={`w-px h-6 ${colors.divider}`}></div>
                <button
                    key={colorTags}
                    onClick={toggleColorTags}
                    className={`px-3 py-1 rounded-lg border shadow-md ${colors.buttonMotion} ${colors.buttonShadowHover} ${colors.buttonScale} ${colorTags
                        ? `${colors.button} ${colors.buttonHover} ${colors.buttonBorder} ${colors.buttonText}`
                        : `${colors.buttonBorderDisable} ${colors.buttonTextDisable}`
                        }`}
                >
                    Color
                </button>
            </div>

            {/* Separator options */}
            <div className="flex flex-wrap items-center justify-center gap-2 text-center">
                <span className={`${colors.secondaryText} ${colors.secondaryTextHover} ${colors.textMotion}`}>Separator:</span>
                {standardSeparators.map((sep) => (
                    <button
                        key={sep.key}
                        onClick={() => setSeparator(sep.value)}
                        className={`px-3 py-1 rounded-lg border shadow-md ${colors.buttonMotion} ${colors.buttonShadowHover} ${colors.buttonScale} ${(separator === sep.value)
                            ? `${colors.button} ${colors.buttonHover} ${colors.buttonBorder} ${colors.buttonText}`
                            : `${colors.buttonBorderDisable} ${colors.buttonTextDisable}`
                            }`}
                    >
                        {sep.label}
                    </button>
                ))}
                <input
                    className={`w-24 px-3 py-1 rounded-lg border shadow-md ${colors.inputBg} ${colors.buttonBorderDisable} ${colors.inputPlaceholder} focus:outline-none ${colors.inputFocusRing} ${separator.length > 0 ? colors.inputFocus : colors.inputFocusError} ${colors.inputFocusBorder} ${colors.inputMotion} ${colors.buttonShadowHover} ${colors.buttonScale}`}
                    value={separator}
                    onChange={(e) => setSeparator(e.target.value)}
                    placeholder="Custom"
                />
            </div>

            {/* Tags output */}
            {tags.length > 0 && (
                <div className="mt-4">
                    <div className="flex justify-between items-center mb-2">
                        <h2 className={`px-2 text-lg font-semibold ${colors.textMotion} hover:text-blue-400`} style={{ alignSelf: "end" }}>
                            {!loading
                                ? `Tags found: ${tags.length}`
                                : "Parse tags..."}
                        </h2>
                        <div className="flex flex-row gap-2">
                            <button
                                disabled={allTagsSelected}
                                onClick={enableAllTagTypes}
                                className={`flex px-3 py-1 rounded-lg items-center gap-2 border shadow-md  ${colors.buttonMotion} ${colors.buttonShadowHover} ${colors.buttonScale} 
                                ${!allTagsSelected
                                        ? `${colors.buttonConfirm} ${colors.buttonConfirmHover} ${colors.buttonConfirmBorder} ${colors.buttonText}`
                                        : `${colors.buttonBorderDisable} ${colors.buttonTextDisable}`
                                    }`}
                            >
                                <Eye className="h-4 w-4" />
                                Show All
                            </button>
                            <button
                                onClick={copyToClipboard}
                                className={`flex px-3 py-1 rounded-lg items-center gap-2 shadow-md ${colors.buttonConfirm} ${colors.buttonConfirmHover} ${colors.buttonMotion} ${colors.buttonShadowHover} ${colors.buttonScale}`}
                            >
                                <Copy className="h-4 w-4" />
                                Copy
                            </button>
                        </div>
                    </div>

                    <div
                        ref={divRef}
                        className={`
                                ${isFocus ? "outline-none ring-2 ring-blue-500" : ""}
                                w-full h-auto min-h-10 px-3 py-2 rounded-xl items-start text-start shadow-md
                                ${colors.inputBg} overflow-auto
                                ${colors.inputMotion} ${colors.inputInteractive}
                              `}
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
                                        <React.Fragment key={`tag-${idx}`}>
                                            <span className={`${tag.type === "error" ? "underline text-red-600" : (colorTags ? getTagTextDecorationClass(tag.type) : "")} ${colors.textMotion} ${colors.textHoverBright}`}>
                                                {tag.name}
                                            </span>
                                            <span>{idx < tags.length - 1 ? separator : ""} </span>
                                        </React.Fragment>
                                    ))
                        }
                    </div>
                    <div className="flex justify-between">
                        <span className={`${colors.hintText} px-2 ${!log ? "invisible" : ""}`}>{log}</span>
                        <span className={`${colors.hintText} px-2 ${allTagsSelected ? "invisible" : ""}`}>
                            {`${tags.filter(tag => tagTypes[tag.type]).length}/${tags.length}`}
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
}
