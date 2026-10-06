
/* animação de scroll */
const myObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show');
        } else {
            entry.target.classList.remove('show');
        }
    });
}, {
    threshold: 0.2
});
//Notificação 
const elements = document.querySelectorAll('section');

elements.forEach((element) => myObserver.observe(element));

const cartCount = document.getElementById('cartCount');
const cartNotification = document.getElementById('cartNotification');
const cartStorageKey = 'cantor-cart';

function readCart() {
    try {
        const storedCart = JSON.parse(localStorage.getItem(cartStorageKey) || '[]');
        return Array.isArray(storedCart) ? storedCart : [];
    } catch {
        return [];
    }
}

function saveCart(items) {
    localStorage.setItem(cartStorageKey, JSON.stringify(items));
    if (cartCount) {
        cartCount.textContent = items.reduce((total, item) => total + (item.quantity || 1), 0);
    }
}

const cart = readCart();
if (cartCount) {
    cartCount.textContent = cart.reduce((total, item) => total + (item.quantity || 1), 0);
}

function showCartNotification(productName) {
    if (!cartNotification) return;

    cartNotification.textContent = `${productName} adicionado ao carrinho`;
    cartNotification.classList.remove('show');
    void cartNotification.offsetWidth;
    cartNotification.classList.add('show');

    clearTimeout(showCartNotification.timeoutId);
    showCartNotification.timeoutId = setTimeout(() => {
        cartNotification.classList.remove('show');
    }, 1800);
}

document.querySelectorAll('.cart-btn').forEach((button) => {
    button.addEventListener('click', (event) => {
        event.preventDefault();

        const productName = button.dataset.product || 'Produto';
        const productCard = button.closest('.produto');
        const price = productCard?.querySelector('p')?.textContent.trim() || '';
        const image = productCard?.querySelector('img')?.getAttribute('src') || '';

        cart.push({
            id: `${Date.now()}-${Math.random()}`,
            name: productName,
            price,
            image,
            quantity: 1
        });
        saveCart(cart);

        showCartNotification(productName);
    });
});

const cartList = document.getElementById('listaCarrinho');
const emptyCart = document.getElementById('sacola');
const checkout = document.querySelector('.Finalizar-Compra');

function renderCart() {
    if (!cartList || !emptyCart || !checkout) return;

    const items = readCart();
    cartList.replaceChildren();
    emptyCart.classList.toggle('visivel', items.length === 0);
    checkout.hidden = items.length === 0;

    items.forEach((product) => {
        const card = document.createElement('div');
        card.className = 'finalizeCompra';

        const item = document.createElement('li');
        const image = document.createElement('img');
        image.src = product.image.startsWith('/img/')
            ? product.image.slice(1)
            : product.image;
        image.alt = product.name;

        const name = document.createElement('h3');
        name.textContent = product.name;

        const removeButton = document.createElement('button');
        removeButton.className = 'material-symbols-outlined';
        removeButton.type = 'button';
        removeButton.setAttribute('aria-label', `Remover ${product.name} da sacola`);
        removeButton.textContent = 'delete';
        removeButton.addEventListener('click', () => {
            saveCart(readCart().filter((item) => item.id !== product.id));
            renderCart();
        });

        const quantity = document.createElement('div');
        quantity.className = 'quantidade';
        const quantityValue = document.createElement('span');
        quantityValue.className = 'valor-qtd';
        quantityValue.textContent = product.quantity || 1;

        ['diminuir', 'aumentar'].forEach((action) => {
            const button = document.createElement('button');
            button.className = 'btn-qtd';
            button.type = 'button';
            button.dataset.action = action;
            button.textContent = action === 'diminuir' ? '-' : '+';
            button.addEventListener('click', () => {
                const updatedItems = readCart().map((item) => item.id === product.id
                    ? { ...item, quantity: Math.max(1, (item.quantity || 1) + (action === 'aumentar' ? 1 : -1)) }
                    : item);
                saveCart(updatedItems);
                renderCart();
            });
            quantity.append(button);
            if (action === 'diminuir') quantity.append(quantityValue);
        });

        const price = document.createElement('p');
        price.textContent = product.price;

        item.append(image, name, removeButton, quantity, price);
        card.append(item);
        cartList.append(card);
    });

    saveCart(items);
}

renderCart();
