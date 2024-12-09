
// script.js

// Function to update the order summary display in order.html
function updateOrderSummary() {
    const orderList = document.getElementById('order-list');
    const totalPriceElement = document.getElementById('total-price');

    // Retrieve order items and total price from localStorage
    let orderItems = JSON.parse(localStorage.getItem('orderItems')) || [];
    let totalPrice = parseFloat(localStorage.getItem('totalPrice')) || 0;

    // Clear current order list
    if (orderList) {
        orderList.innerHTML = '';

        // Add each item to the order list
        orderItems.forEach(item => {
            const orderItem = document.createElement('div');
            orderItem.classList.add('order-item');
            orderItem.textContent = `${item.name} - ₹${item.price.toFixed(2)}`;
            orderList.appendChild(orderItem);
        });

        // Update the total price
        totalPriceElement.textContent = totalPrice.toFixed(2);
    }
}

// Function to handle checkout
function handleCheckout() {
    let orderItems = JSON.parse(localStorage.getItem('orderItems')) || [];
    let totalPrice = parseFloat(localStorage.getItem('totalPrice')) || 0;

    if (orderItems.length === 0) {
        alert('No items in your order.');
        return;
    }

    alert(`Your total is ₹${totalPrice.toFixed(2)}. Thank you for ordering!`);
    // Clear order summary
    localStorage.removeItem('orderItems');
    localStorage.removeItem('totalPrice');
    updateOrderSummary();
}

// Function to add items to order (for use in the main menu)
function addToOrder(itemName, itemPrice) {
    let orderItems = JSON.parse(localStorage.getItem('orderItems')) || [];
    let totalPrice = parseFloat(localStorage.getItem('totalPrice')) || 0;

    // Add new item to order
    orderItems.push({ name: itemName, price: itemPrice });
    totalPrice += itemPrice;

    // Save back to localStorage
    localStorage.setItem('orderItems', JSON.stringify(orderItems));
    localStorage.setItem('totalPrice', totalPrice);
}

// Event listener for the checkout button in order.html
document.addEventListener('DOMContentLoaded', () => {
    // Check if we are on the order summary page
    if (document.getElementById('checkout-btn')) {
        updateOrderSummary();
        document.getElementById('checkout-btn').addEventListener('click', handleCheckout);
    }

    // Check if we are on a menu page to add items to order
    if (document.querySelectorAll('.add-to-order')) {
        document.querySelectorAll('.add-to-order').forEach(button => {
            button.addEventListener('click', function () {
                const itemName = button.getAttribute('data-item');
                const itemPrice = parseFloat(button.getAttribute('data-price'));
                addToOrder(itemName, itemPrice);
                alert(`${itemName} has been added to your order!`);
            });
        });
    }
});
function addToOrder(itemName, itemPrice) {
    let orderItems = JSON.parse(localStorage.getItem('orderItems')) || [];
    let totalPrice = parseFloat(localStorage.getItem('totalPrice')) || 0;

    // Add new item to order
    orderItems.push({ name: itemName, price: itemPrice });
    totalPrice += itemPrice;

    // Save back to localStorage
    localStorage.setItem('orderItems', JSON.stringify(orderItems));
    localStorage.setItem('totalPrice', totalPrice);

    // Trigger shake animation
    const trolleyImage = document.querySelector('.log img'); // Select the trolley image
    trolleyImage.classList.add('shake'); // Add the shake class

    // Remove the shake class after animation ends to allow it to be triggered again
    trolleyImage.addEventListener('animationend', () => {
        trolleyImage.classList.remove('shake');
    });
}
