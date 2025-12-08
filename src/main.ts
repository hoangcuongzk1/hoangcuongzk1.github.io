interface PostMeta {
    title: string;
    date: string;
    tags: string[];
    path: string;
}


async function fetchPostList(): Promise<PostMeta[]> {
    const res = await fetch("docs/posts.json");
    return await res.json();
}


function renderPosts(posts: PostMeta[]) {
    const list = document.getElementById("postList")!;
    list.innerHTML = "";


    posts.forEach(p => {
        const li = document.createElement("li");
        li.className = "post-item";


        li.innerHTML = `
<a href="${p.path}">${p.title}</a>
<span class="date">${p.date}</span>
<span class="tags">${p.tags.map(t => `#${t}`).join(" ")}</span>
`;


        list.appendChild(li);
    });
}


function setupSearch(posts: PostMeta[]) {
    const input = document.getElementById("searchInput") as HTMLInputElement;


    input.addEventListener("input", () => {
        const q = input.value.toLowerCase();
        const filtered = posts.filter(p => p.tags.some(t => t.toLowerCase().includes(q)));
        renderPosts(filtered);
    });
}


async function main() {
    const posts = await fetchPostList();
    renderPosts(posts);
    setupSearch(posts);
}


main();