document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".slideshow-container").forEach(slideshow => {
        let slides = slideshow.querySelector(".slides");

        // Clone only the necessary slides for a smooth loop
        let clone = slides.innerHTML;
        slides.innerHTML += clone;
    });
});
