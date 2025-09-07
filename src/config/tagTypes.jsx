export const standardTagTypes = [
    { key: "artist", label: "Artist", color: "text-red-700", bg: "bg-red-700", border: "border-red-700", hover: "hover:bg-red-600" },
    { key: "character", label: "Character", color: "text-green-700", bg: "bg-green-700", border: "border-green-700", hover: "hover:bg-green-600" },
    { key: "copyright", label: "Copyright", color: "text-fuchsia-700", bg: "bg-fuchsia-700", border: "border-fuchsia-700", hover: "hover:bg-fuchsia-600" },
    { key: "metadata", label: "Metadata", color: "text-yellow-600", bg: "bg-yellow-600", border: "border-yellow-600", hover: "hover:bg-yellow-500" },
    { key: "general", label: "General", bg: "bg-blue-700", border: "border-blue-700", hover: "hover:bg-blue-600" },
    { key: "deprecated", label: "Deprecated", color: "text-neutral-500", bg: "bg-neutral-700", border: "border-neutral-700", hover: "hover:bg-neutral-600" },
];

export const optionalTagTypesBySite = {
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
        { key: "error", label: "Error", color: "text-red-600", bg: "bg-red-600", border: "border-red-600", hover: "hover:bg-red-500" },
        { key: "rating", label: "Rating", color: "text-sky-700", bg: "bg-sky-700", border: "border-sky-700", hover: "hover:bg-sky-600" },
        { key: "origin", label: "Origin", color: "text-violet-700", bg: "bg-violet-800", border: "border-violet-800", hover: "hover:bg-violet-700" },
        { key: "oc", label: "OC", color: "text-pink-700", bg: "bg-pink-700", border: "border-pink-700", hover: "hover:bg-pink-600" },
        { key: "species", label: "Species", color: "text-yellow-900", bg: "bg-yellow-900", border: "border-yellow-900", hover: "hover:bg-yellow-800" },
        { key: "bodyType", label: "Body Type", color: "text-neutral-500", bg: "bg-neutral-700", border: "border-neutral-700", hover: "hover:bg-neutral-600" },
        { key: "contentFanmade", label: "Content Fanmade", color: "text-pink-700", bg: "bg-pink-800", border: "border-pink-800", hover: "hover:bg-pink-700" },
        { key: "contentOfficial", label: "Content Official", color: "text-amber-500", bg: "bg-amber-500", border: "border-amber-500", hover: "hover:bg-amber-400" },
    ],
};