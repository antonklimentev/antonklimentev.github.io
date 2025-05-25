const allProducts = [
{
    id: 1,
    name: "Петуния",
    description: "Кустовая",
    price: 80,
    category: "seedling",
    image: "img/catalog/seedling/petunia_bush.jpg",
},
{
    id: 2,
    name: "Лобелия",
    description: "Кустовая",
    price: 100,
    category: "seedling",
    image: "img/catalog/seedling/lobelia_bush.jpg",
},
{
    id: 3,
    name: "Голубика",
    description: "Высокорослая",
    price: 900,
    category: "fruit_trees",
    image: "img/catalog/fruit_trees/blueberry_high.jpg",
},
{
    id: 4,
    name: "Клубника",
    description: "Сезонная",
    price: 80,
    category: "fruit_trees",
    image: "img/catalog/fruit_trees/strawberry_season.jpg",
},
{
    id: 5,
    name: "Монобукет Розы",
    description: "21 красная роза в букете",
    price: 8990,
    category: "flowers",
    image: "img/catalog/flowers/rose.png",
},
{
    id: 6,
    name: "Монобукет Тюльпаны",
    description: "15 жёлтых тюльпанов",
    price: 5690,
    category: "flowers",
    image: "img/catalog/flowers/tulpan.png",
},
{
    id: 7,
    name: "Пион",
    description: "Долгоцветущий",
    price: 1880,
    category: "perennial_plants",
    image: "img/catalog/perennial_plants/pion.png",
},
{
    id: 8,
    name: "Туя",
    description: "Конусовидная",
    price: 850,
    category: "trees",
    image: "img/catalog/trees/thuja.png",
},
{
    id: 9,
    name: "Ель",
    description: "Пирамидальная",
    price: 1200,
    category: "trees",
    image: "img/catalog/trees/spruce.png",
},
{
    id: 10,
    name: "Азалия",
    description: "Подушковидная",
    price: 1350,
    category: "home_plants",
    image: "img/catalog/home_plants/azaliya.png",
},
{
    id: 11,
    name: "Герань",
    description: "Блюдцевидная",
    price: 400,
    category: "home_plants",
    image: "img/catalog/home_plants/geran.png",
},
{
    id: 12,
    name: "Грунт",
    description: "Универсальный 50кг",
    price: 400,
    category: "garden",
    image: "img/catalog/garden/grunt.png",
},
{
    id: 13,
    name: "Удобрение",
    description: "Селитра аммиачная",
    price: 200,
    category: "garden",
    image: "img/catalog/garden/fertilizer.png",
},
];

let cart = JSON.parse(localStorage.getItem("cart")) || [];

let currentFilters = {
    category: "all",
    sort: "price-asc",
};

let loadedProducts = [];
let visibleProductsCount = 24;

const productsGrid = document.getElementById("products-grid");
const loadingIndicator = document.getElementById("loading-indicator");
const cartIcon = document.getElementById("cart-icon");
const cartCount = document.getElementById("cart-count");
const cartOverlay = document.getElementById("cart-overlay");
const cartSidebar = document.getElementById("cart-sidebar");
const closeCart = document.getElementById("close-cart");
const cartItems = document.getElementById("cart-items");
const cartTotalPrice = document.getElementById("cart-total-price");


document.addEventListener("DOMContentLoaded", function () {
    updateCartCount();

    loadProducts();

    setupFilters();

    setupCart();
});

function loadProducts() {
    loadingIndicator.style.display = "block";

    let filteredProducts = allProducts.filter((product) => {
        if (
            currentFilters.category !== "all" &&
            product.category !== currentFilters.category
        ) {
            return false;
        }
        if (product.price > currentFilters.maxPrice) {
            return false;
        }
        return true;
    });
    filteredProducts = sortProducts(filteredProducts, currentFilters.sort);

    loadedProducts = filteredProducts;

    displayProducts();

    loadingIndicator.style.display = "none";
}

function sortProducts(products, sortType) {
    switch (sortType) {
        case "price-asc":
            return [...products].sort((a, b) => a.price - b.price);
        case "price-desc":
            return [...products].sort((a, b) => b.price - a.price);
        default:
            return products;
    }
}

function displayProducts() {
    productsGrid.innerHTML = "";

    const productsToShow = loadedProducts.slice(0, visibleProductsCount);

    productsToShow.forEach((product) => {
        const productCard = createProductCard(product);
        productsGrid.appendChild(productCard);

        const addToCartBtn = productCard.querySelector(".add-to-cart");
        addToCartBtn.addEventListener("click", () => addToCart(product));
    });
}

function createProductCard(product) {
    const card = document.createElement("div");
    card.className = "product-card";
    card.innerHTML = `
        <div class="product-image">
            <img src="${product.image}" alt="${product.name}">
        </div>
        <div class="product-info">
            <h3>${product.name}</h3>
            <p class="product-description">${product.description}</p>
            <div class="product-price">${product.price.toLocaleString("ru-RU")} ₽</div>
            <button class="add-to-cart">В корзину</button>
        </div>
    `;
    return card;
}

function setupFilters() {
    document.querySelectorAll("#category-filters .filter-option").forEach((option) => {
        option.addEventListener("click", function () {
            document.querySelector("#category-filters .active").classList.remove("active");
            this.classList.add("active");
            currentFilters.category = this.dataset.category;
            applyFilters();
        });
    });

    document.querySelectorAll("#sort-options .filter-option").forEach((option) => {
        option.addEventListener("click", function () {
            document.querySelector("#sort-options .active").classList.remove("active");
            this.classList.add("active");
            currentFilters.sort = this.dataset.sort;
            applyFilters();
        });
    });
}

function applyFilters() {
    visibleProductsCount = 30;
    loadProducts();
}

