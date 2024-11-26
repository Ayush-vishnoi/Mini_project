// Function to update the order summary
let orderItems = [];
let totalPrice = 0;

function updateOrderSummary() {
    const orderList = document.getElementById('order-list');
    const totalPriceElement = document.getElementById('total-price');

    // Clear current order list
    orderList.innerHTML = '';

    // Add each item to the order list
    orderItems.forEach(item => {
        const orderItem = document.createElement('div');
        orderItem.classList.add('order-item');
        orderItem.textContent = `${item.name} -  ₹${item.price.toFixed(2)}`;
        orderList.appendChild(orderItem);
    });

    // Update the total price
    totalPriceElement.textContent = totalPrice.toFixed(2);
}

// Add item to order
document.querySelectorAll('.add-to-order').forEach(button => {
    button.addEventListener('click', function() {
        const itemName = button.getAttribute('data-item');
        const itemPrice = parseFloat(button.getAttribute('data-price'));

        // Add to the order list
        orderItems.push({ name: itemName, price: itemPrice });
        totalPrice += itemPrice;

        // Update the order summary
        updateOrderSummary();
    });
});

// Checkout Button functionality
document.getElementById('checkout-btn').addEventListener('click', function() {
    if (orderItems.length === 0) {
        alert('Please add items to your order first.');
        return;
    }

    alert(`Your total is  ₹ ${totalPrice.toFixed(2)}. Thank you for ordering!`);
    orderItems = [];
    totalPrice = 0;
    updateOrderSummary();
});
