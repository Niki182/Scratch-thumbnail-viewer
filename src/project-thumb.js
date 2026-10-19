const projectID = document.getElementById("project-id");
const showThumbnailButton = document.getElementById("show-thumbnail");
const thumbnail = document.getElementById("project-img");
const projectLink = document.getElementById("project-link");
const projectAuthor = document.getElementById("project-author");
const originalSizeToggle = document.getElementById("original-size-toggle");

// Using your native Cloudflare Pages Function proxy
const corsfixProxy = (url) => `functions/proxy?url=${encodeURIComponent(url)}`;

showThumbnailButton.addEventListener("click", async () => {
    const id = projectID.value.trim();

    if (!/^\d+$/.test(id)) {
        thumbnail.src = `images/error_project.svg`;
        projectLink.removeAttribute("href");
        projectLink.textContent = "";
        if (projectAuthor) projectAuthor.textContent = "";
        return;
    }

    updateThumbnailSize();
    thumbnail.src = `https://uploads.scratch.mit.edu/get_image/project/${id}_480x360.png`;
    projectLink.href = `https://scratch.mit.edu/projects/${id}/`;
    projectLink.textContent = projectLink.href;

    if (projectAuthor) {
        try {
            projectAuthor.textContent = "Loading author...";
            
            // Fetch project metadata via Cloudflare Function
            const targetUrl = `https://api.scratch.mit.edu/projects/${id}`;
            const response = await fetch(corsfixProxy(targetUrl), { "method": "GET" });
            
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            
            // Direct JSON parsing since your Cloudflare worker returns the raw response text
            const data = await response.json();
            const username = data.author.username;
            
            // Fetch author avatar via Cloudflare Function
            let avatarUrl = "";
            try {
                const userTargetUrl = `https://api.scratch.mit.edu/users/${username}`;
                const userResponse = await fetch(corsfixProxy(userTargetUrl), { "method": "GET" });
                if (userResponse.ok) {
                    const userData = await userResponse.json();
                    avatarUrl = userData.profile.images['90x90'];
                }
            } catch (avatarErr) {
                console.warn("Could not fetch avatar:", avatarErr);
            }

            projectAuthor.innerHTML = `Project made by: ${
                avatarUrl ? `<img src="${avatarUrl}" alt="${username}'s avatar" width="30" height="30" style="vertical-align: middle;">` : ""
            }<a href="https://scratch.mit.edu/users/${username}/" target="_blank" rel="noreferrer">${username}</a>`;

        } catch (error) {
            projectAuthor.textContent = "Author: Unknown or Private";
            console.error("CORS Bypass Failed:", error);
        }
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
};

originalSizeToggle.addEventListener("change", () => {
    updateThumbnailSize();
});
