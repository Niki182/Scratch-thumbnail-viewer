const projectID = document.getElementById("project-id");
const showThumbnailButton = document.getElementById("show-thumbnail");
const thumbnail = document.getElementById("project-img");
const projectLink = document.getElementById("project-link");
const originalSizeToggle = document.getElementById("original-size-toggle");

showThumbnailButton.addEventListener("click", () => {
    const id = projectID.value.trim();

    if (!/^\d+$/.test(id)) {
        thumbnail.src = `images/error_project.svg`;
        projectLink.removeAttribute("href");
        projectLink.textContent = "";
        return;
    }

    updateThumbnailSize();
    thumbnail.src = `https://uploads.scratch.mit.edu/get_image/project/${id}_480x360.png`;
    projectLink.href = `https://scratch.mit.edu/projects/${id}/`;
    projectLink.textContent = projectLink.href;
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
