
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
let cartItems = 0;

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
        cartItems += 1;

        if (cartCount) {
            cartCount.textContent = cartItems;
        }

        showCartNotification(productName);
    });
});



/* olho da senha */
