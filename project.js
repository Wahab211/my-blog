let cart = [];
let cartCount = 0;
let total = 0;

const cartCountEl = document.getElementById("cart-count");
const cartItemsEl = document.getElementById("cart-items");
const cartTotalEl = document.getElementById("cart-total");
const checkoutBtn = document.getElementById("checkout");

document.querySelectorAll(".add-to-cart").forEach(button => {
    button.addEventListener("click", () => {
        const name = button.getAttribute("data-name");
        const price = parseFloat(button.getAttribute("data-price"));

        cart.push({ name, price });
        cartCount++;
        total += price;

        cartCountEl.textContent = cartCount;
        cartTotalEl.textContent = total.toFixed(2);

        const li = document.createElement("li");
        li.textContent = `${name} - $${price}`;
        cartItemsEl.appendChild(li);
    });
});
// script.js

function showPage(page) {
    // Hide all product pages
    document.querySelectorAll('.product-page').forEach(div => div.style.display = 'none');

    // Show selected page
    document.getElementById('page' + page).style.display = 'block';

    // Update active button
    document.querySelectorAll('.pagination button').forEach(btn => btn.classList.remove('active'));
    document.querySelector('.pagination button:nth-child(' + page + ')').classList.add('active');
}
document.addEventListener("DOMContentLoaded", () => {
    const productsPerPage = 3; // how many products per page
    const products = document.querySelectorAll("#all-products .product");
    const totalPages = Math.ceil(products.length / productsPerPage);
    const pagination = document.getElementById("pagination");

    let currentPage = 1;

    // Function to show products for the current page
    function showPage(page) {
        products.forEach((product, index) => {
            product.style.display =
                index >= (page - 1) * productsPerPage && index < page * productsPerPage
                    ? "block"
                    : "none";
        });

        // Update active button
        document.querySelectorAll(".pagination button").forEach(btn =>
            btn.classList.remove("active")
        );
        document.querySelector(`.pagination button[data-page="${page}"]`).classList.add("active");

        currentPage = page;
    }

    // Generate pagination buttons
    for (let i = 1; i <= totalPages; i++) {
        const button = document.createElement("button");
        button.innerText = i;
        button.setAttribute("data-page", i);
        if (i === 1) button.classList.add("active");
        button.addEventListener("click", () => showPage(i));
        pagination.appendChild(button);
    }

    // Show first page by default
    showPage(1);
});

// ✅ Paystack Payment Integration
checkoutBtn.addEventListener("click", () => {
    if (total === 0) {
        alert("Your cart is empty!");
        return;
    }

    let handler = PaystackPop.setup({
        key: "pk_test_xxxxxxxxxxxxxxxxxxxxx", // ⚡ Replace with your Paystack PUBLIC KEY
        email: "customer@example.com", // ⚡ Collect from user
        amount: total * 100, // Paystack works in kobo (100 kobo = 1 Naira)
        currency: "USD", // You can use "NGN", "USD", etc.
        ref: "" + Math.floor(Math.random() * 1000000000 + 1), // Unique reference
        onClose: function () {
            alert("Payment cancelled.");
        },
        callback: function (response) {
            alert("Payment successful! Reference: " + response.reference);
            // ✅ Here you can send order details to your server/database
            cart = [];
            cartCount = 0;
            total = 0;
            cartCountEl.textContent = cartCount;
            cartItemsEl.innerHTML = "";
            cartTotalEl.textContent = total;
        }
    });
    handler.openIframe();
});
