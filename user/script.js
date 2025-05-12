// ------------------- Order Summary Page -------------------
function updateOrderSummary() {
    const orderList = document.getElementById('order-list');
    const totalPriceElement = document.getElementById('total-price');

    let orderItems = JSON.parse(localStorage.getItem('orderItems')) || [];
    let totalPrice = 0;
    const groupedItems = {};

    orderItems.forEach(item => {
        totalPrice += item.price;
        if (groupedItems[item.name]) {
            groupedItems[item.name].quantity += 1;
            groupedItems[item.name].total += item.price;
        } else {
            groupedItems[item.name] = {
                quantity: 1,
                total: item.price,
                price: item.price
            };
        }
    });

    if (orderList) {
        orderList.innerHTML = '';
        for (const itemName in groupedItems) {
            const itemData = groupedItems[itemName];
            
            const orderItem = document.createElement('div');
            orderItem.classList.add('order-item');
            orderItem.innerHTML = `
                ${itemName} x${itemData.quantity} - ₹${itemData.total.toFixed(2)}
                <button class="remove-item" data-item="${itemName}">❌</button>
            `;
            orderList.appendChild(orderItem);
        }

        totalPriceElement.textContent = totalPrice.toFixed(2);
    }

    // Attach event listeners to remove buttons
    document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', () => {
            const itemName = button.getAttribute('data-item');
            removeFromOrder(itemName);
        });
    });
}
function removeFromOrder(itemName) {
    let orderItems = JSON.parse(localStorage.getItem('orderItems')) || [];
    // Remove all items with this name
    orderItems = orderItems.filter(item => item.name !== itemName);
    localStorage.setItem('orderItems', JSON.stringify(orderItems));

    // Recalculate totalPrice
    const newTotal = orderItems.reduce((sum, item) => sum + item.price, 0);
    localStorage.setItem('totalPrice', newTotal);

    updateOrderSummary();
}


function handleCheckout() {
    let orderItems = JSON.parse(localStorage.getItem('orderItems')) || [];
    let totalPrice = parseFloat(localStorage.getItem('totalPrice')) || 0;

    if (orderItems.length === 0) {
        Swal.fire({
            icon: 'warning',
            title: 'Oops!',
            text: 'No items in your order.',
        });
        return;
    }

    const tokenNumber = Math.floor(1000 + Math.random() * 9000);

    Swal.fire({
        title: 'Thank you for ordering!',
        html: `<p>Your total is ₹${totalPrice.toFixed(2)}</p>
               <p><strong>Order Token:</strong> #${tokenNumber}</p>`,
        imageUrl: 'images/QR.jpeg',
        imageWidth: 200,
        imageHeight: 250,
        imageAlt: 'Order Complete',
        confirmButtonText: 'OK'
    });

    let adminOrders = JSON.parse(localStorage.getItem('adminOrders')) || [];
    adminOrders.push({
        id: Date.now(),
        token: tokenNumber,
        items: orderItems,
        total: totalPrice,
        status: "pending"
    });

    localStorage.setItem('adminOrders', JSON.stringify(adminOrders));

    // Clear current order
    localStorage.removeItem('orderItems');
    localStorage.removeItem('totalPrice');

    updateOrderSummary();
}

// ------------------- Menu Page -------------------

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

// ------------------- DOM Events -------------------

document.addEventListener('DOMContentLoaded', () => {
    // Order summary page
    if (document.getElementById('checkout-btn')) {
        updateOrderSummary();
        document.getElementById('checkout-btn').addEventListener('click', handleCheckout);
    }
    if (document.getElementById('adminOrders')) {
        const adminOrdersContainer = document.getElementById('adminOrders');
        let adminOrders = JSON.parse(localStorage.getItem('adminOrders')) || [];
    
        if (adminOrders.length === 0) {
            adminOrdersContainer.innerHTML = "<p style='text-align:center;'>No orders yet.</p>";
        } else {
            adminOrdersContainer.innerHTML = "";
            adminOrders.forEach(order => {
                const orderDiv = document.createElement('div');
                orderDiv.classList.add('order-card');
                if (order.status === "done") orderDiv.classList.add("done");
    
                const itemList = order.items.map(item => item.name).join(", ");
    
                orderDiv.innerHTML = `
                    <p><strong>Token:</strong> #${order.token}</p>
                    <p><strong>Total:</strong> ₹${order.total.toFixed(2)}</p>
                    <p><strong>Items:</strong> ${itemList}</p>
                    <p><strong>Status:</strong> ${order.status}</p>
                    ${order.status === "pending" ? `<button class="mark-done" data-id="${order.id}">Mark as Done</button>` : ""}
                `;
    
                adminOrdersContainer.appendChild(orderDiv);
            });
    
            document.querySelectorAll('.mark-done').forEach(button => {
                button.addEventListener('click', () => {
                    const id = parseInt(button.getAttribute('data-id'));
                    let orders = JSON.parse(localStorage.getItem('adminOrders')) || [];
                    orders = orders.map(order =>
                        order.id === id ? { ...order, status: "done" } : order
                    );
                    localStorage.setItem('adminOrders', JSON.stringify(orders));
                    location.reload(); // refresh to update status
                });
            });
        }
    }
    
    // Menu page
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
            });
        }
    });

    // Advertisement scroll slider
    const adSlider = document.getElementById('adSlider');

    if (adSlider) {
        let scrollInterval = setInterval(() => {
            const scrollWidth = adSlider.scrollWidth;
            const currentScroll = adSlider.scrollLeft;
            const viewWidth = adSlider.offsetWidth;

            if (currentScroll + viewWidth >= scrollWidth - 1) {
                adSlider.scrollLeft = 0;
            } else {
                adSlider.scrollLeft += viewWidth;
            }
        }, 3000);

        adSlider.addEventListener('mouseenter', () => clearInterval(scrollInterval));
        adSlider.addEventListener('mouseleave', () => {
            scrollInterval = setInterval(() => {
                const scrollWidth = adSlider.scrollWidth;
                const currentScroll = adSlider.scrollLeft;
                const viewWidth = adSlider.offsetWidth;

                if (currentScroll + viewWidth >= scrollWidth - 1) {
                    adSlider.scrollLeft = 0;
                } else {
                    adSlider.scrollLeft += viewWidth;
                }
            }, 3000);
        });
    }
});
function applyCoupon() {
    const code = document.getElementById('couponCode').value.trim().toUpperCase();
    let totalPrice = parseFloat(localStorage.getItem('totalPrice')) || 0;

    let discount = 0;

    if (code === "SAVE10") {
        discount = 0.10;
    } else if (code === "SAVE20") {
        discount = 0.20;
    } else {
        document.getElementById('discount-msg').textContent = "Invalid coupon code.";
        return;
    }

    const discountedPrice = totalPrice - (totalPrice * discount);
    localStorage.setItem('totalPrice', discountedPrice.toFixed(2));
    document.getElementById('discount-msg').textContent = `Coupon applied! You saved ₹${(totalPrice * discount).toFixed(2)}`;
    updateOrderSummary();
}
document.addEventListener('DOMContentLoaded', () => {
    // ... existing code ...

    const couponBtn = document.getElementById('applyCouponBtn');
    if (couponBtn) {
        couponBtn.addEventListener('click', applyCoupon);
    }
});
