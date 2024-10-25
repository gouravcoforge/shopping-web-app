const randomSizes = ["S", "M", "L", "XL"];
const randomColors = ["Red", "Blue", "Green", "Black"];
const randomNames = ["Men's T-Shirt", "Women's Jacket", "Men's Jeans", "Women's Dress"];
 
 
function getRandomValue(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}
 
 
function getOrders() {
    const localStorageCart = localStorage.getItem("cart");
    return localStorageCart ? JSON.parse(localStorageCart) : [];
  };
 
function loadOrders() {
    
    const container = document.getElementById("order-review");
    const orders = getOrders();
    console.log({ orders });
 
    // Loop through each object in the orders array
    orders.forEach(product => {
        // Create the product column
        const coloumnDiv = document.createElement('div');
        coloumnDiv.classList.add('columns');
 
        const orderQuantity = document.createElement('div');
        orderQuantity.classList.add('Order-quantity');
 
    
        // Create the product image
        const productImg = document.createElement('img');
        productImg.src = product.image;
        productImg.setAttribute("width", "60%");
        productImg.alt = product.name;
        orderQuantity.appendChild(productImg);
        coloumnDiv.appendChild(orderQuantity);
        // Create the product labels
        const productNameLabel = document.createElement('label');
        productNameLabel.textContent = `Clothe Name: ${getRandomValue(randomNames)}`;
        coloumnDiv.appendChild(productNameLabel);
 
        const productSizeLabel = document.createElement('label');
        productSizeLabel.textContent = `Size: ${getRandomValue(randomSizes)}`;
        coloumnDiv.appendChild(productSizeLabel);
 
        const productColorLabel = document.createElement('label');
        productColorLabel.textContent = `Color: ${getRandomValue(randomColors)}`;
        coloumnDiv.appendChild(productColorLabel);
 
        const productQuantityLabel = document.createElement('label');
        productQuantityLabel.textContent = `Quantity: ${product.quantity}`;
        coloumnDiv.appendChild(productQuantityLabel);
 
        // Append the product column to the container
        container.appendChild(coloumnDiv);
    });
}
 
 
window.addEventListener('DOMContentLoaded', () => {
    loadOrders();
});