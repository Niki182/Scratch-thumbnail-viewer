const projectID = document.getElementById("project-id");
const showThumbnailButton = document.getElementById("show-thumbnail");
const thumbnail = document.getElementById("project-img");
const projectLink = document.getElementById("project-link");
const originalSizeToggle = document.getElementById("original-size-toggle");
const projectAuthor = document.getElementById("project-author");
const authorAccountLink = projectAuthor.querySelector("a");
const authorLink = authorAccountLink.querySelector("img.authorPfp");
const pfpAuthor = authorLink;

function setAuthorName(name) {
    if (authorLink) {
        authorAccountLink.replaceChildren (
            authorLink,
            document.createTextNode(name ? ` ${name}` : "")
        );
    } else {
        authorAccountLink.textContent = name;
    }
}

showThumbnailButton.addEventListener("click", async () => {
    const id = projectID.value.trim();
    pfpAuthor.hidden = true;
    authorLink.style.display = "none";

    if (!/^\d+$/.test(id)) {
        thumbnail.src = `images/error_project.svg`;
        projectLink.removeAttribute("href");
        projectLink.textContent = "";
        setAuthorName("");
        authorLink.removeAttribute("src");
        authorLink.hidden = true;
        authorAccountLink.removeAttribute("href");
        return;
    }

    updateThumbnailSize();
    thumbnail.src = `https://uploads.scratch.mit.edu/get_image/project/${id}_480x360.png`;
    projectLink.href = `https://scratch.mit.edu/projects/${id}/`;
    projectLink.textContent = projectLink.href;

    setAuthorName("Loading author…");
    authorLink.removeAttribute("src");
    authorLink.hidden = true;
    authorAccountLink.removeAttribute("href");

    try {
        const projectResponse = await fetch(
            `https://proxy.corsfix.com/?https://api.scratch.mit.edu/projects/${id}`
        );
        if (!projectResponse.ok) throw new Error("Project request failed");
        const project = await projectResponse.json();
        const username = project.author?.username;
        if (!username) throw new Error("Project author unavailable");

        const userResponse = await fetch(
            `https://proxy.corsfix.com/?https://api.scratch.mit.edu/users/${encodeURIComponent(username)}`
        );
        if (!userResponse.ok) throw new Error("User request failed");
        const user = await userResponse.json();

        setAuthorName(username);
        authorAccountLink.href = `https://scratch.mit.edu/users/${encodeURIComponent(username)}/`;
        const avatar = user.profile?.images?.["90x90"];
        if (avatar) {
            authorLink.onload = () => {
                authorLink.hidden = false;
                authorLink.style.display = "";
                pfpAuthor.hidden = false;
            };
            authorLink.onerror = () => {
                authorLink.hidden = true;
                authorLink.style.display = "none";
                pfpAuthor.hidden = true;
            };
            authorLink.src = avatar;
        }
    } catch {
        setAuthorName("Author unavailable");
    }
});

function updateThumbnailSize() {
    if (originalSizeToggle.checked) {
        thumbnail.style.height = "auto";
        thumbnail.style.width = "auto";
    } else {
        thumbnail.style.height = "";
        thumbnail.style.width = "";
        thumbnail.width = 480;
        thumbnail.height = 360;
    }
}

originalSizeToggle.addEventListener("change", () => {
    updateThumbnailSize();
});
