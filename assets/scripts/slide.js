        document.addEventListener("DOMContentLoaded", function () {
            document.querySelectorAll(".slideshow-container").forEach(slideshow => {
                let slides = slideshow.querySelector(".slides");
                let slidesCount = slides.children.length;
                let currentIndex = 0;
                let autoPlay = slideshow.dataset.autoplay === "true";
                let transition = slideshow.dataset.transition === "true";
                let arrows = slideshow.dataset.arrows === "true";
                
                if (!transition) slides.style.transition = "none";
                
                if (arrows) {
                    let prevButton = document.createElement("button");
                    let nextButton = document.createElement("button");
                    prevButton.innerHTML = "&#10094;";
                    nextButton.innerHTML = "&#10095;";
                    prevButton.className = "prev";
                    nextButton.className = "next";
                    slideshow.appendChild(prevButton);
                    slideshow.appendChild(nextButton);
                    
                    prevButton.addEventListener("click", () => {
                        currentIndex = (currentIndex - 1 + slidesCount) % slidesCount;
                        updateSlide();
                    });
                    nextButton.addEventListener("click", () => {
                        currentIndex = (currentIndex + 1) % slidesCount;
                        updateSlide();
                    });
                }
                
                function updateSlide() {
                    slides.style.transform = `translateX(-${currentIndex * 100}%)`;
                }
                
                if (autoPlay) {
                    setInterval(() => {
                        currentIndex = (currentIndex + 1) % slidesCount;
                        updateSlide();
                    }, 3000);
                }
            });
        });