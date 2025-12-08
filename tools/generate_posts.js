const fs = require("fs");
const path = require("path");
const marked = require("marked");


const DOCS = path.join(__dirname, "..", "docs");
const OUT = path.join(DOCS, "posts.json");


function extractMeta(mdText) {
    const lines = mdText.split("\n");
    const title = lines[0].replace(/^# /, "");
    const tagsLine = lines.find(l => l.startsWith("tags:"));
    const tags = tagsLine ? tagsLine.replace("tags:", "").split(",").map(t => t.trim()) : [];


    return { title, tags };
}


function main() {
    const files = fs.readdirSync(DOCS).filter(f => f.endsWith(".md"));


    const posts = files.map(f => {
        const full = path.join(DOCS, f);
        const txt = fs.readFileSync(full, "utf8");
        const meta = extractMeta(txt);


        return {
            title: meta.title,
            date: fs.statSync(full).mtime.toISOString().substring(0, 10),
            tags: meta.tags,
            path: `docs/${f.replace(/\\.md$/, ".html")}`
        };
    });


    fs.writeFileSync(OUT, JSON.stringify(posts, null, 2));
    console.log("Generated posts.json");
}


main();