let listings = [];
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Fetch listings from the JSON file with caching
async function fetchListings() {
    if (sessionStorage.getItem('listings')) {
        listings = JSON.parse(sessionStorage.getItem('listings'));
        populateFilters(); // Populate filters after fetching listings
        displayListings();
        return listings;
    }
    try {
        const response = await fetch('listings.json');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        listings = await response.json();
        sessionStorage.setItem('listings', JSON.stringify(listings));
        populateFilters(); // Populate filters after fetching listings
        displayListings();
        return listings;
    } catch (error) {
        console.error('Error fetching listings:', error);
    }
}

// Function to redirect to brand-specific pages or main page
function redirectToBrandPage() {
    const selectedBrand = document.getElementById("brandFilter").value; // Get the selected brand
    const page = window.location.pathname.includes("parts") ? "parts.html" : "guns.html";
    if (selectedBrand === "all") {
        // Redirect to the main page
        window.location.href = page;
    } else {
        // Redirect to the brand-specific page, replacing spaces with empty string and converting to lowercase
        const brandPage = selectedBrand.replace(/\s+/g, '').toLowerCase() + page;
        window.location.href = brandPage;
    }
}

// Function to remove all filters
function removeFilters() {
    // Reset dropdowns to "All Brands", "All Models", and "All Types"
    document.getElementById("brandFilter").value = "all";
    document.getElementById("modelFilter").value = "all";
    document.getElementById("typeFilter").value = "all";

    // Reset price inputs
    document.getElementById("minPrice").value = "";
    document.getElementById("maxPrice").value = "";

    // Display all listings
    displayListings();
}

// Populate Brand, Model, and Type Dropdowns
function populateFilters(selectedBrand = "all") {
    const brandFilter = document.getElementById("brandFilter");
    const modelFilter = document.getElementById("modelFilter");
    const typeFilter = document.getElementById("typeFilter");

    // Determine the current page (guns.html or parts.html)
    const isGunsPage = window.location.pathname.includes("guns");
    const isPartsPage = window.location.pathname.includes("parts");

    // Filter listings based on the current page
    const filteredListings = listings.filter(listing => {
        if (isGunsPage && listing.allocation === "gun") {
            return true;
        }
        if (isPartsPage && listing.allocation === "part") {
            return true;
        }
        return false;
    });

    // Get unique brands, models, and types
    const brands = [...new Set(filteredListings.map(item => item.brand))];
    const models = [...new Set(filteredListings.map(item => item.model))];
    const types = [...new Set(filteredListings.map(item => item.type))];

    // Populate brand filter
    brands.forEach(brand => {
        const option = document.createElement("option");
        option.value = brand;
        option.textContent = brand;
        if (brand === selectedBrand) {
            option.selected = true; // Pre-select the current brand
        }
        brandFilter.appendChild(option);
    });

    // Populate model filter
    models.forEach(model => {
        const option = document.createElement("option");
        option.value = model;
        option.textContent = model;
        modelFilter.appendChild(option);
    });

    // Populate type filter
    types.forEach(type => {
        const option = document.createElement("option");
        option.value = type;
        option.textContent = type;
        typeFilter.appendChild(option);
    });
}

// Filter Listings Based on Selected Criteria
function filterListings() {
    const brandFilter = document.getElementById("brandFilter");
    const modelFilter = document.getElementById("modelFilter");
    const typeFilter = document.getElementById("typeFilter");
    const minPriceInput = document.getElementById("minPrice");
    const maxPriceInput = document.getElementById("maxPrice");

    const selectedBrand = brandFilter.value;
    const selectedModel = modelFilter.value;
    const selectedType = typeFilter.value;
    const minPrice = parseFloat(minPriceInput.value) || 0;
    const maxPrice = parseFloat(maxPriceInput.value) || Infinity;

    const filteredListings = listings.filter(item => {
        const matchesBrand = selectedBrand === "all" || item.brand === selectedBrand;
        const matchesModel = selectedModel === "all" || item.model === selectedModel;
        const matchesType = selectedType === "all" || item.type === selectedType;
        const matchesPrice = item.price >= minPrice && item.price <= maxPrice;
        return matchesBrand && matchesModel && matchesType && matchesPrice;
    });

    displayListings(filteredListings);
}

// Format Price as $9,500.00
function formatPrice(price) {
    return `$${price.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`;
}

// Generate Image Paths Based on refNumber and imageCount
function generateImagePaths(refNumber, imageCount) {
    const paths = [];
    for (let i = 1; i <= imageCount; i++) {
        paths.push(`assets/item/${refNumber.toLowerCase()}/${i}.png`);
    }
    return paths;
}

// Display Listings
function displayListings(filteredListings = listings) {
    const listingsContainer = document.getElementById("listingsContainer");
    listingsContainer.innerHTML = "";

    // Determine the current page (guns.html or parts.html)
    const isGunsPage = window.location.pathname.includes("guns");
    const isPartsPage = window.location.pathname.includes("parts");

    // Filter listings based on the current page
    const pageFilteredListings = filteredListings.filter(listing => {
        if (isGunsPage && listing.allocation === "gun") {
            return true;
        }
        if (isPartsPage && listing.allocation === "part") {
            return true;
        }
        return false;
    });

    pageFilteredListings.forEach(listing => {
        const listingCard = document.createElement("div");
        listingCard.classList.add("listing-card");

        // Generate image paths dynamically
        const imagePaths = generateImagePaths(listing.refNumber, listing.imageCount);

        // Slideshow container with data attributes
        const slideshowContainer = document.createElement("div");
        slideshowContainer.classList.add("slideshow-container");
        slideshowContainer.dataset.autoplay = listing.autoplay;
        slideshowContainer.dataset.transition = listing.transition;
        slideshowContainer.dataset.arrows = listing.arrows;

        const slides = document.createElement("div");
        slides.classList.add("slides");
        slides.dataset.index = 0; // Keep track of the current slide index

        imagePaths.forEach(imgSrc => {
            const slide = document.createElement("div");
            slide.classList.add("slide");
            const img = document.createElement("img");
            img.src = imgSrc;
            img.alt = `${listing.name} Image`;
            slide.appendChild(img);
            slides.appendChild(slide);
        });

        slideshowContainer.appendChild(slides);
        listingCard.appendChild(slideshowContainer);

        // Add navigation arrows if enabled
        if (listing.arrows) {
            const prevButton = document.createElement("button");
            const nextButton = document.createElement("button");
            prevButton.innerHTML = "&#10094;";
            nextButton.innerHTML = "&#10095;";
            prevButton.className = "prev";
            nextButton.className = "next";
            slideshowContainer.appendChild(prevButton);
            slideshowContainer.appendChild(nextButton);

            prevButton.addEventListener("click", () => {
                moveSlide(slides, -1, slideshowContainer);
            });

            nextButton.addEventListener("click", () => {
                moveSlide(slides, 1, slideshowContainer);
            });
        }

        // Listing details
        const details = document.createElement("div");
        details.innerHTML = `
            <h2>${listing.name}</h2>
            <p>Price: ${listing.price !== null ? formatPrice(listing.price) : ''}</p>
        `;

        // Conditionally render the "More Info" button
        if (listing.showMoreInfo) {
            const moreInfoButton = document.createElement("button");
            moreInfoButton.className = "more-info";
            moreInfoButton.textContent = "More Info";
            moreInfoButton.onclick = () => window.location.href = `${listing.refNumber.toLowerCase()}.html`;
            details.appendChild(moreInfoButton);
        }

        // Conditionally render the "Contact" button
        const contactButton = document.createElement("button");
        contactButton.className = "contact";
        contactButton.textContent = "Contact";
        contactButton.onclick = () => window.location.href = 'contact.html';
        details.appendChild(contactButton);

        // Conditionally render the "Add to Cart" and "Buy Now" buttons side by side
        if (listing.showAddToCart || listing.showBuyNow) {
            const buttonContainer = document.createElement("div");
            buttonContainer.className = "button-container";

            if (listing.showAddToCart) {
                const addToCartButton = document.createElement("button");
                addToCartButton.className = "add-to-cart";
                addToCartButton.textContent = "Add to Cart";
                addToCartButton.onclick = () => {
                    addToCart(listing);
                    toggleCartButton(addToCartButton, listing);
                };
                buttonContainer.appendChild(addToCartButton);
            }

            if (listing.showBuyNow) {
                const buyNowButton = document.createElement("button");
                buyNowButton.className = "buy-now";
                buyNowButton.textContent = "Buy Now";
                buyNowButton.onclick = () => {
                    buyNow(listing);
                };
                buttonContainer.appendChild(buyNowButton);
            }

            details.appendChild(buttonContainer);
        }

        listingCard.appendChild(details);
        listingsContainer.appendChild(listingCard);

        startSlideshow(slideshowContainer, slides);
    });
}

// Move Slides
function moveSlide(slides, direction, slideshowContainer) {
    const currentIndex = parseInt(slides.dataset.index);
    const newIndex = (currentIndex + direction + slides.children.length) % slides.children.length;
    slides.dataset.index = newIndex;
    slides.style.transform = `translateX(-${newIndex * 100}%)`;
}

// Start Slideshow
function startSlideshow(slideshow, slides) {
    if (slideshow.dataset.autoplay === "true") {
        setInterval(() => {
            moveSlide(slides, 1, slideshow);
        }, parseInt(slideshow.dataset.transition) || 3000);
    }
}

// Add to Cart
function addToCart(item) {
    const existingItem = cart.find(cartItem => cartItem.refNumber === item.refNumber);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        item.quantity = 1;
        cart.push(item);
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCart();
}

// Buy Now
function buyNow(item) {
    if (item.buyLink) {
        window.open(item.buyLink, '_blank');
    } else {
        cart = [];
        item.quantity = 1;
        cart.push(item);
        localStorage.setItem('cart', JSON.stringify(cart));
        window.location.href = 'checkout.html';
    }
}

// Remove from Cart
function removeFromCart(index) {
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCart();
}

// Clear Cart
function clearCart() {
    cart = [];
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCart();
}

// Update Cart
function updateCart() {
    const cartItems = document.getElementById('cartItems');
    if (cartItems) {
        cartItems.innerHTML = '';
        let total = 0;
        cart.forEach((item, index) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><a href="${item.refNumber.toLowerCase()}.html">${item.name}</a></td>
                <td>${item.refNumber.toLowerCase()}</td>
                <td>${formatPrice(item.price)}</td>
                <td>
                    <input type="number" value="${item.quantity}" min="1" onchange="updateQuantity(${index}, this.value)">
                </td>
                <td>${formatPrice(item.price * item.quantity)}</td>
                <td><button onclick="removeFromCart(${index})">Remove</button></td>
            `;
            cartItems.appendChild(tr);
            total += item.price * item.quantity;
        });
        const totalRow = document.createElement('tr');
        totalRow.innerHTML = `
            <td colspan="4"><strong>Total</strong></td>
            <td colspan="2"><strong>${formatPrice(total)}</strong></td>
        `;
        cartItems.appendChild(totalRow);
    }
}

// Update Quantity
function updateQuantity(index, quantity) {
    cart[index].quantity = parseInt(quantity);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCart();
}

// Toggle Cart Button
function toggleCartButton(button, item) {
    button.textContent = "Added";
    button.disabled = true;
    setTimeout(() => {
        button.textContent = "Remove from Cart";
        button.disabled = false;
        button.onclick = () => {
            const index = cart.findIndex(cartItem => cartItem.refNumber === item.refNumber);
            if (index !== -1) {
                removeFromCart(index);
                button.textContent = "Add to Cart";
                button.onclick = () => {
                    addToCart(item);
                    toggleCartButton(button, item);
                };
            }
        };
    }, 1000);
}

// Send Cart via Email
function sendCartEmail() {
    const name = document.getElementById('name').value;
    const number = document.getElementById('number').value;
    const address = document.getElementById('address').value;
    const country = document.getElementById('country').value;
    const city = document.getElementById('city').value;
    const state = document.getElementById('state').value;
    const zip = document.getElementById('zip').value;
    const paymentType = document.getElementById('paymentType').value;

    if (!name || !number || !address || !country || !city || !state || !zip || !paymentType) {
        alert("All fields are required to send the email.");
        return;
    }

    let emailBody = `Name: ${name}\nPhone Number: ${number}\nAddress: ${address}\nCountry: ${country}\nCity: ${city}\nState: ${state}\nZip Code: ${zip}\nPayment Type: ${paymentType}\n\nCart Items:\n`;
    cart.forEach(item => {
        emailBody += `${item.name} (Ref: ${item.refNumber}) - Quantity: ${item.quantity} - Total: ${formatPrice(item.price * item.quantity)}\n`;
    });

    if (paymentType === 'card') {
        const cardNumber = document.getElementById('cardNumber').value;
        const expirationDate = document.getElementById('expirationDate').value;
        const cvc = document.getElementById('cvc').value;
        const nameOnCard = document.getElementById('nameOnCard').value;

        if (!cardNumber || !expirationDate || !cvc || !nameOnCard) {
            alert("All card fields are required.");
            return;
        }

        emailBody += `\nCard Details:\nCard Number: ${cardNumber}\nExpiration Date: ${expirationDate}\nCVC: ${cvc}\nName on Card: ${nameOnCard}`;
    }

    const mailtoLink = `mailto:crvcustomarms@yahoo.com?subject=Cart Order&body=${encodeURIComponent(emailBody)}`;
    window.location.href = mailtoLink;
}

// Initial setup
fetchListings();

    document.addEventListener("DOMContentLoaded", () => {
      const fileName = window.location.pathname.split("/").pop(); // "silverseitzguns.html"
      fetch("listings.json")
        .then(res => res.json())
        .then(data => {
          if (data[fileName] && data[fileName]["not-available"]) {
            const box = document.getElementById("availability-box");
            box.textContent = "None available";
            box.style.display = "block";
          }
        })
        .catch(err => console.error("Could not load listings.json:", err));
    });

    // Function to perform the search and redirect the parent (outside iframe) to the search page
    function search() {
        const query = document.getElementById('searchBox').value.trim();
        if (query) {
            // Redirecting the parent page (outside iframe) to search.html with the search query
            window.top.location.href = `search.html?query=${encodeURIComponent(query)}`;
        }
    }
