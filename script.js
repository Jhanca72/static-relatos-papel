// Datos de los libros
const books = [
    {
        id: 1,
        title: "Cien Años de Soledad",
        author: "Gabriel García Márquez",
        price: 24.99,
        type: "fisico",
        novedad: true,
        image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400"
    },
    {
        id: 2,
        title: "1984",
        author: "George Orwell",
        price: 15.99,
        type: "digital",
        novedad: false,
        image: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400"
    },
    {
        id: 3,
        title: "El Nombre del Viento",
        author: "Patrick Rothfuss",
        price: 28.50,
        type: "fisico",
        novedad: true,
        image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400"
    },
    {
        id: 4,
        title: "Sapiens",
        author: "Yuval Noah Harari",
        price: 19.99,
        type: "digital",
        novedad: false,
        image: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400"
    },
    {
        id: 5,
        title: "La Sombra del Viento",
        author: "Carlos Ruiz Zafón",
        price: 22.00,
        type: "fisico",
        novedad: false,
        image: "https://images.unsplash.com/photo-1476275466078-4007374efbbe?w=400"
    },
    {
        id: 6,
        title: "Dune",
        author: "Frank Herbert",
        price: 17.50,
        type: "digital",
        novedad: true,
        image: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=400"
    },
    {
        id: 7,
        title: "Orgullo y Prejuicio",
        author: "Jane Austen",
        price: 14.99,
        type: "fisico",
        novedad: false,
        image: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400"
    },
    {
        id: 8,
        title: "El Problema de los Tres Cuerpos",
        author: "Cixin Liu",
        price: 21.00,
        type: "digital",
        novedad: true,
        image: "https://images.unsplash.com/photo-1490633874781-1c63cc424610?w=400"
    }
];

// Estado del carrito
let cart = [];

// Elementos del DOM
const booksGrid = document.getElementById('books-grid');
const filterButtons = document.querySelectorAll('.filter-btn');
const cartCount = document.getElementById('cart-count');
const cartIcon = document.getElementById('cart-icon');
const cartModal = document.getElementById('cart-modal');
const closeModal = document.getElementById('close-modal');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotalElement = document.getElementById('cart-total');
const checkoutBtn = document.getElementById('checkout-btn');
const contactForm = document.getElementById('contact-form');

// Renderizar libros
function renderBooks(filter = 'all') {
    booksGrid.innerHTML = '';
    
    const filteredBooks = books.filter(book => {
        if (filter === 'all') return true;
        if (filter === 'novedad') return book.novedad;
        return book.type === filter;
    });

    filteredBooks.forEach(book => {
        const bookCard = document.createElement('div');
        bookCard.classList.add('book-card');
        
        const badgeClass = book.type === 'fisico' ? 'badge-fisico' : 'badge-digital';
        const badgeText = book.type === 'fisico' ? 'Físico' : 'Digital';
        const novedadBadge = book.novedad ? '<span class="book-badge badge-novedad" style="left:10px; right:auto;">Novedad</span>' : '';
        
        bookCard.innerHTML = `
            <div class="book-image">
                <img src="${book.image}" alt="${book.title}">
                <span class="book-badge ${badgeClass}">${badgeText}</span>
                ${novedadBadge}
            </div>
            <div class="book-info">
                <h3>${book.title}</h3>
                <p class="book-author">${book.author}</p>
                <p class="book-price">$${book.price.toFixed(2)}</p>
                <button class="add-to-cart" data-id="${book.id}">
                    <i class="fas fa-cart-plus"></i> Añadir
                </button>
            </div>
        `;
        
        booksGrid.appendChild(bookCard);
    });

    // Añadir event listeners a los botones de añadir al carrito
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', addToCart);
    });
}

// Añadir al carrito
function addToCart(e) {
    const bookId = parseInt(e.currentTarget.dataset.id);
    const book = books.find(b => b.id === bookId);
    
    const existingItem = cart.find(item => item.id === bookId);
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ ...book, quantity: 1 });
    }
    
    updateCartCount();
    showNotification(`${book.title} añadido al carrito`);
}

// Actualizar contador del carrito
function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
}

// Mostrar el carrito
function showCart() {
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p style="text-align:center; color:#6c757d;">Tu carrito está vacío</p>';
    } else {
        cartItemsContainer.innerHTML = cart.map(item => `
            <div class="cart-item">
                <div class="cart-item-info">
                    <span class="cart-item-title">${item.title} x${item.quantity}</span>
                    <span class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</span>
                </div>
                <button class="cart-item-remove" data-id="${item.id}">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `).join('');
        
        // Event listeners para eliminar items
        document.querySelectorAll('.cart-item-remove').forEach(button => {
            button.addEventListener('click', removeFromCart);
        });
    }
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotalElement.textContent = `$${total.toFixed(2)}`;
    cartModal.classList.add('active');
}

// Eliminar del carrito
function removeFromCart(e) {
    const bookId = parseInt(e.currentTarget.dataset.id);
    cart = cart.filter(item => item.id !== bookId);
    updateCartCount();
    showCart();
}

// Notificación temporal
function showNotification(message) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background-color: #6b4f3a;
        color: white;
        padding: 12px 24px;
        border-radius: 8px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        z-index: 3000;
        animation: slideIn 0.3s ease;
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

// Event listeners
filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        renderBooks(button.dataset.filter);
    });
});

cartIcon.addEventListener('click', showCart);
closeModal.addEventListener('click', () => cartModal.classList.remove('active'));
cartModal.addEventListener('click', (e) => {
    if (e.target === cartModal) cartModal.classList.remove('active');
});

checkoutBtn.addEventListener('click', () => {
    if (cart.length === 0) {
        showNotification('Tu carrito está vacío');
        return;
    }
    showNotification('¡Gracias por tu compra! 🎉');
    cart = [];
    updateCartCount();
    cartModal.classList.remove('active');
});

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    showNotification('Mensaje enviado. ¡Gracias por contactarnos!');
    contactForm.reset();
});

// Animaciones CSS para notificaciones
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

// Inicializar
renderBooks();