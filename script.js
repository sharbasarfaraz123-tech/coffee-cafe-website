const cart = [];

const addCartButtons = document.querySelectorAll(".add-cart-btn");
const cartItemsContainer = document.getElementById("cart-items");
const emptyCartMessage = document.getElementById("empty-cart-message");

const subtotalElement = document.getElementById("subtotal");
const gstElement = document.getElementById("gst");
const deliveryElement = document.getElementById("delivery-charge");
const grandTotalElement = document.getElementById("grand-total");

const placeOrderButton = document.getElementById("place-order-btn");
const orderMessage = document.getElementById("order-message");
const cartCount = document.getElementById("cart-count");

const menuCartControls =
    document.querySelectorAll(".menu-cart-control");

menuCartControls.forEach(function (control) {
    const addButton = control.querySelector(".add-cart-btn");
    const quantityBox =
        control.querySelector(".menu-quantity-control");
    const quantityText =
        control.querySelector(".menu-quantity");
    const plusButton = control.querySelector(".menu-plus");
    const minusButton = control.querySelector(".menu-minus");

    const itemName = control.dataset.name;
    const itemPrice = Number(control.dataset.price);

    addButton.addEventListener("click", function () {
        const existingItem = cart.find(function (item) {
            return item.name === itemName;
        });

        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({
                name: itemName,
                price: itemPrice,
                quantity: 1
            });
        }

        updateMenuQuantity();
        updateCart();
    });

    plusButton.addEventListener("click", function () {
        const item = cart.find(function (cartItem) {
            return cartItem.name === itemName;
        });

        if (item) {
            item.quantity++;
        }

        updateMenuQuantity();
        updateCart();
    });

    minusButton.addEventListener("click", function () {
        const index = cart.findIndex(function (cartItem) {
            return cartItem.name === itemName;
        });

        if (index === -1) {
            return;
        }

        if (cart[index].quantity > 1) {
            cart[index].quantity--;
        } else {
            cart.splice(index, 1);
        }

        updateMenuQuantity();
        updateCart();
    });

    function updateMenuQuantity() {
        const item = cart.find(function (cartItem) {
            return cartItem.name === itemName;
        });

        if (item) {
            addButton.style.display = "none";
            quantityBox.style.display = "inline-flex";
            quantityText.textContent = item.quantity;
        } else {
            addButton.style.display = "inline-block";
            quantityBox.style.display = "none";
            quantityText.textContent = "0";
        }
    }
});


function addToCart(name, price) {
    const existingItem = cart.find((item) => item.name === name);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            name: name,
            price: price,
            quantity: 1
        });
    }

    function showQuantityOnMenuCard(button, itemName) {
    const item = cart.find((cartItem) => cartItem.name === itemName);

    if (!item) {
        button.textContent = "Add to Cart";
        button.classList.remove("quantity-active");
        return;
    }

    button.innerHTML = `
        <span class="menu-minus">−</span>
        <span class="menu-quantity">${item.quantity}</span>
        <span class="menu-plus">+</span>
    `;

    button.classList.add("quantity-active");

    const minusButton = button.querySelector(".menu-minus");
    const plusButton = button.querySelector(".menu-plus");

    minusButton.addEventListener("click", (event) => {
        event.stopPropagation();

        const index = cart.findIndex(
            (cartItem) => cartItem.name === itemName
        );

        if (index === -1) {
            return;
        }

        if (cart[index].quantity > 1) {
            cart[index].quantity--;
        } else {
            cart.splice(index, 1);
        }

        updateCart();
        showQuantityOnMenuCard(button, itemName);
    });

    plusButton.addEventListener("click", (event) => {
        event.stopPropagation();

        const index = cart.findIndex(
            (cartItem) => cartItem.name === itemName
        );

        if (index !== -1) {
            cart[index].quantity++;
        }

        updateCart();
        showQuantityOnMenuCard(button, itemName);
    });
}

    updateCart();
}

function increaseQuantity(index) {
    cart[index].quantity++;
    updateCart();
}

function decreaseQuantity(index) {
    if (cart[index].quantity > 1) {
        cart[index].quantity--;
    } else {
        cart.splice(index, 1);
    }

    updateCart();
}

function removeItem(index) {
    cart.splice(index, 1);
    updateCart();
}

function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = `(${totalItems})`;
}

function syncMenuQuantityButtons() {
    document.querySelectorAll(".menu-cart-control").forEach((control) => {
        const addButton = control.querySelector(".add-cart-btn");
        const quantityBox = control.querySelector(".menu-quantity-control");
        const quantityText = control.querySelector(".menu-quantity");
        const itemName = control.dataset.name;
        const item = cart.find((cartItem) => cartItem.name === itemName);

        if (item) {
            addButton.style.display = "none";
            quantityBox.style.display = "inline-flex";
            quantityText.textContent = item.quantity;
        } else {
            addButton.style.display = "inline-block";
            quantityBox.style.display = "none";
            quantityText.textContent = "0";
        }
    });
}

function updateCart() {
    cartItemsContainer.innerHTML = "";

    if (cart.length === 0) {
        cartItemsContainer.innerHTML =
            '<p id="empty-cart-message">Your cart is empty.</p>';
    }

    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;

        const cartItem = document.createElement("div");
        cartItem.classList.add("cart-item");

        cartItem.innerHTML = `

            <div>
                <strong>${item.name}</strong>
<p>Price: ₹${item.price}</p>

<p>
Quantity:
<button class="qty-btn minus">−</button>

<span class="qty">${item.quantity}</span>

<button class="qty-btn plus">+</button>
</p>

<p>Total: ₹${itemTotal}</p>
            </div>

            <div class="cart-item-controls">
                <button class="quantity-btn"
                    onclick="decreaseQuantity(${index})">−</button>

                <span>${item.quantity}</span>

                <button class="quantity-btn"
                    onclick="increaseQuantity(${index})">+</button>

                <button class="remove-btn"
                    onclick="removeItem(${index})">Remove</button>
            </div>
        `;

        cartItemsContainer.appendChild(cartItem);
    });

    updateCartCount();
    syncMenuQuantityButtons();
    calculateBill();
}

function calculateBill() {
    const subtotal = cart.reduce((total, item) => {
        return total + item.price * item.quantity;
    }, 0);

    const gst = subtotal * 0.05;
    const deliveryCharge = subtotal > 0 ? 40 : 0;
    const grandTotal = subtotal + gst + deliveryCharge;

    subtotalElement.textContent = `₹${subtotal.toFixed(2)}`;
    gstElement.textContent = `₹${gst.toFixed(2)}`;
    deliveryElement.textContent = `₹${deliveryCharge.toFixed(2)}`;
    grandTotalElement.textContent = `₹${grandTotal.toFixed(2)}`;
}

placeOrderButton.addEventListener("click", () => {
    if (cart.length === 0) {
        orderMessage.textContent =
            "Please add at least one item to the cart.";
        return;
    }

    const selectedPayment = document.querySelector(
        'input[name="payment"]:checked'
    );

    if (!selectedPayment) {
        orderMessage.textContent =
            "Please select a payment method.";
        return;
    }

    orderMessage.textContent =
        `Order placed successfully using ${selectedPayment.value}!`;

    cart.length = 0;
    updateCart();
});