const studioID = document.getElementById("studio-id");
const showThumbnailButton = document.getElementById("show-thumbnail");
const thumbnail = document.getElementById("studio-img");
const studioLink = document.getElementById("studio-link");
const originalSizeToggle = document.getElementById("original-size-toggle");

showThumbnailButton.addEventListener("click", () => {
	const id = studioID.value.trim();

	if (!/^\d+$/.test(id)) {
		thumbnail.src = `images/error_studio.svg`;
		thumbnail.width = 480;
		thumbnail.height = 360;
		studioLink.removeAttribute("href");
		studioLink.textContent = "";
		return;
	}
	updateThumbnailSize()
	thumbnail.src = `https://uploads.scratch.mit.edu/get_image/gallery/${id}_204x120.png`;
	studioLink.href = `https://scratch.mit.edu/studios/${id}/`;
	studioLink.textContent = studioLink.href;
});

function updateThumbnailSize() {
	if (originalSizeToggle.checked) {
		thumbnail.style.height = "auto";
		thumbnail.style.width = "auto";
	} else {
		thumbnail.style.height = "";
		thumbnail.style.width = "";
		thumbnail.width = 204;
		thumbnail.height = 120;
	}
};

originalSizeToggle.addEventListener("change", () => {
	updateThumbnailSize();
});