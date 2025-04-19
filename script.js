// Function to update the order summary display in order.html
function updateOrderSummary() {
    const orderList = document.getElementById('order-list');
    const totalPriceElement = document.getElementById('total-price');

    let orderItems = JSON.parse(localStorage.getItem('orderItems')) || [];
    let totalPrice = 0;

    const groupedItems = {};

    // Group items by name and count quantity
    orderItems.forEach(item => {
        totalPrice += item.price;
        if (groupedItems[item.name]) {
            groupedItems[item.name].quantity += 1;
            groupedItems[item.name].total += item.price;
        } else {
            groupedItems[item.name] = {
                quantity: 1,
                total: item.price
            };
        }
    });

    // Clear current order list
    if (orderList) {
        orderList.innerHTML = '';

        for (const itemName in groupedItems) {
            const itemData = groupedItems[itemName];
            const orderItem = document.createElement('div');
            orderItem.classList.add('order-item');
            orderItem.textContent = `${itemName} x${itemData.quantity} - ₹${itemData.total.toFixed(2)}`;
            orderList.appendChild(orderItem);
        }

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
    localStorage.removeItem('orderItems');
    localStorage.removeItem('totalPrice');
    updateOrderSummary();
}

// Modified addToOrder to support quantity
function addToOrder(itemName, itemPrice, quantity = 1) {
    let orderItems = JSON.parse(localStorage.getItem('orderItems')) || [];
    let totalPrice = parseFloat(localStorage.getItem('totalPrice')) || 0;

    for (let i = 0; i < quantity; i++) {
        orderItems.push({ name: itemName, price: itemPrice });
        totalPrice += itemPrice;
    }

    localStorage.setItem('orderItems', JSON.stringify(orderItems));
    localStorage.setItem('totalPrice', totalPrice);

    const trolleyImage = document.querySelector('.log img');
    if (trolleyImage) {
        trolleyImage.classList.add('shake');
        trolleyImage.addEventListener('animationend', () => {
            trolleyImage.classList.remove('shake');
        });
    }
}

// Main event logic
document.addEventListener('DOMContentLoaded', () => {
    // Order Summary Page
    if (document.getElementById('checkout-btn')) {
        updateOrderSummary();
        document.getElementById('checkout-btn').addEventListener('click', handleCheckout);
    }

    // Menu Page
    document.querySelectorAll('.menu-item').forEach(item => {
        const plusBtn = item.querySelector('.plus');
        const minusBtn = item.querySelector('.minus');
        const qtyInput = item.querySelector('.qty');
        const addToOrderBtn = item.querySelector('.add-to-order');

        if (plusBtn && minusBtn && qtyInput) {
            plusBtn.addEventListener('click', () => {
                qtyInput.value = parseInt(qtyInput.value) + 1;
            });

            minusBtn.addEventListener('click', () => {
                if (parseInt(qtyInput.value) > 1) {
                    qtyInput.value = parseInt(qtyInput.value) - 1;
                }
            });
        }

        if (addToOrderBtn) {
            addToOrderBtn.addEventListener('click', () => {
                const itemName = addToOrderBtn.getAttribute('data-item');
                const itemPrice = parseFloat(addToOrderBtn.getAttribute('data-price'));
                const quantity = qtyInput ? parseInt(qtyInput.value) : 1;
                addToOrder(itemName, itemPrice, quantity);
                alert(`${itemName} x${quantity} added to your order!`);
            });
        }
    });
});
