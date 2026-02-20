export function computedTotalWords(rawContent: string) {
    return rawContent
        .replace(/!\[[^\]]*]\([^)]+\)/g, "") // ![alt](url)
        .replace(/!\[\[[^\]]+]]/g, "") // ![[...]]
        .replace(/\[[^\]]*]\([^)]+\)/g, "$1") // [text](url) -> text（简化）
        .replace(/```[\s\S]*?```/g, "")
        .replace(/`[^`]*`/g, "").length;
}