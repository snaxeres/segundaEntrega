const socket = io();

document.getElementById('productForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const price = document.getElementById('price').value;
    const description = document.getElementById('description').value;

    socket.emit('newProduct', { name, price, description });
});

socket.on('updateProducts', (products) => {
    const container = document.getElementById('products-container');
    container.innerHTML = '';
    products.forEach(product => {
        container.innerHTML += `
            <div class="product-card" data-id="${product.id}">
                <h2>${product.name}</h2>
                <p>Precio: ${product.price}</p>
                <p>${product.description}</p>
                <button onclick="deleteProduct('${product.id}')">Eliminar</button>
            </div>
        `;
    });
});

function deleteProduct(id) {
    socket.emit('deleteProduct', id);
}
