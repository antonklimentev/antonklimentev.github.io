$(document).ready(function(){
    $(".button_promo").click(function() {
        window.location.href = "/catalog.html";
    });
    $(".button_popular").click(function() {
        window.location.href = "/catalog.html";
    });
    $(".button_catalog-prev").click(function() {
        window.location.href = "/catalog.html";
    });


});



const orderModal = document.getElementById("order-modal");
const closeModal = document.getElementById("close-modal");
const confirmOrderBtn = document.getElementById("confirm-order-btn");
const phoneNumberInput = document.getElementById("phone-number");
const orderMessage = document.getElementById("order-message");

function setupCart() {
    cartIcon.addEventListener("click", toggleCart);

    closeCart.addEventListener("click", toggleCart);
    cartOverlay.addEventListener("click", toggleCart);
    updateCart();
}

function toggleCart() {
    cartOverlay.classList.toggle("show");
    cartSidebar.classList.toggle("show");
}

function addToCart(product) {
    const existingItem = cart.find((item) => item.id === product.id);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1,
        });
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    updateCart();
    updateCartCount();

    const cartBtn = document.querySelector(`.add-to-cart[data-id="${product.id}"]`);
    if (cartBtn) {
        cartBtn.textContent = "Добавлено!";
        setTimeout(() => {
            cartBtn.textContent = "В корзину";
        }, 1000);
    }
}

function updateCart() {
    cartItems.innerHTML = "";

    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Ваша корзина пуста</p>';
        cartTotalPrice.textContent = "0 ₽";
        return;
    }

    let total = 0;

    cart.forEach((item) => {
        const cartItem = document.createElement("div");
        cartItem.className = "cart-item";
        cartItem.innerHTML = `
            <div class="cart-item-image">
                <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <div class="cart-item-price">${item.price.toLocaleString("ru-RU")} ₽ × ${item.quantity}</div>
                <div class="cart-item-actions">
                    <button class="quantity-btn minus" data-id="${item.id}">-</button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="quantity-btn plus" data-id="${item.id}">+</button>
                    <button class="remove-btn" data-id="${item.id}">Удалить</button>
                </div>
            </div>
        `;

        cartItems.appendChild(cartItem);
        total += item.price * item.quantity;

        cartItem.querySelector(".minus").addEventListener("click", () => updateQuantity(item.id, -1));
        cartItem.querySelector(".plus").addEventListener("click", () => updateQuantity(item.id, 1));
        cartItem.querySelector(".remove-btn").addEventListener("click", () => removeFromCart(item.id));
    });

    cartTotalPrice.textContent = total.toLocaleString("ru-RU") + " ₽";
}

function updateQuantity(productId, change) {
    const itemIndex = cart.findIndex((item) => item.id === productId);

    if (itemIndex !== -1) {
        cart[itemIndex].quantity += change;

        if (cart[itemIndex].quantity <= 0) {
            cart.splice(itemIndex, 1);
        }

        localStorage.setItem("cart", JSON.stringify(cart));

        updateCart();
        updateCartCount();
    }
}

function removeFromCart(productId) {
    cart = cart.filter((item) => item.id !== productId);

    localStorage.setItem("cart", JSON.stringify(cart));

    updateCart();
    updateCartCount();
}

function updateCartCount() {
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    const cartCount = document.getElementById("cart-count");

    cartCount.textContent = count;
    cartCount.style.display = count > 0 ? "flex" : "none";

    cartCount.classList.add("pulse");
    setTimeout(() => {
        cartCount.classList.remove("pulse");
    }, 200);
}

document.querySelector(".checkout-btn").addEventListener("click", () => {
    orderModal.style.display = "block";
    orderMessage.textContent = "";
    phoneNumberInput.value = "";
});

closeModal.addEventListener("click", () => {
    orderModal.style.display = "none";
});

confirmOrderBtn.addEventListener("click", () => {
    const phoneInput = document.getElementById("phone-number").value.trim();
    const orderMessage = document.getElementById("order-message");

    const phoneRegex = /^\+7\s?\d{3}\s?\d{3}\s?\d{2}\s?\d{2}$/;

    if (!phoneRegex.test(phoneInput)) {
        orderMessage.textContent = "Введите корректный номер телефона.";
        orderMessage.style.color = "red";
        return;
    }

    document.getElementById("order-modal").style.display = "none";

    const summaryItemsContainer = document.getElementById("summary-items");
    const summaryTotalPrice = document.getElementById("summary-total-price");

    summaryItemsContainer.innerHTML = "";

    let total = 0;
    cart.forEach(item => {
        const product = allProducts.find(p => p.id === item.id);
        if (product) {
            const itemEl = document.createElement("div");
            itemEl.className = "modal__items";
            itemEl.innerHTML = `${product.name} (${item.quantity} шт.) — ${product.price * item.quantity} ₽`;
            summaryItemsContainer.appendChild(itemEl);
            total += product.price * item.quantity;
        }
    });

    summaryTotalPrice.textContent = total + " ₽";

    document.getElementById("summary-modal").style.display = "block";
});

document.getElementById("close-summary-modal").addEventListener("click", () => {
    document.getElementById("summary-modal").style.display = "none";
});

document.getElementById("close-modal").addEventListener("click", () => {
    document.getElementById("order-modal").style.display = "none";
});