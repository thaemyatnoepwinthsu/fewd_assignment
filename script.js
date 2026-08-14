document.addEventListener("DOMContentLoaded", () => {
    // 1. Safe LocalStorage Cart Retrieval
    function getCart() {
        try {
            const item = localStorage.getItem('beanBoutiqueCart');
            return item ? JSON.parse(item) : [];
        } catch (e) {
            console.error("Corrupted cart data found, resetting cart:", e);
            localStorage.removeItem('beanBoutiqueCart');
            return [];
        }
    }

    function saveCart(cart) {
        localStorage.setItem('beanBoutiqueCart', JSON.stringify(cart));
    }

    // Modal & UI Elements
    const cartModalEl = document.getElementById('cartModal');
    let cartModalInstance = null;
    if (cartModalEl) {
        cartModalInstance = new bootstrap.Modal(cartModalEl);
    }
    
    const cartCountBadge = document.getElementById('cartCountBadge');
    const cartItemsContainer = document.getElementById('cartItemsContainer');
    const cartSubtotal = document.getElementById('cartSubtotal');

    // Initial UI Update
    updateCartUI();

    // Open Cart Modal Trigger
    document.getElementById("cartModalTrigger")?.addEventListener("click", (e) => {
        e.preventDefault();
        if (cartModalInstance) cartModalInstance.show();
    });

    // 2. Update Cart Display in Modal
    function updateCartUI() {
        const cart = getCart();
        const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
        
        if (cartCountBadge) cartCountBadge.textContent = totalItems;
        if (!cartItemsContainer) return;

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = `
                <tr>
                    <td colspan="4" class="text-center py-4 text-muted">Your basket is currently empty. Add items to see them here!</td>
                </tr>`;
            if (cartSubtotal) cartSubtotal.textContent = '£0.00';
            return;
        }

        let subtotal = 0;
        cartItemsContainer.innerHTML = cart.map(item => {
            const itemTotal = item.price * item.qty;
            subtotal += itemTotal;
            return `
                <tr>
                    <td>
                        <strong>${item.title}</strong><br>
                        <small class="text-muted">${item.subtitle || ''}</small>
                    </td>
                    <td class="text-center">${item.qty}</td>
                    <td class="text-end">£${item.price.toFixed(2)}</td>
                    <td class="text-end">£${itemTotal.toFixed(2)}</td>
                </tr>
            `;
        }).join('');

        if (cartSubtotal) cartSubtotal.textContent = `£${subtotal.toFixed(2)}`;
    }

    // 3. Add to Cart / Subscription Buttons Logic
    const addCartButtons = document.querySelectorAll('.add-subscription-btn, .add-to-cart-btn');
    addCartButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const title = btn.getAttribute('data-title');
            const subtitle = btn.getAttribute('data-subtitle');
            const price = parseFloat(btn.getAttribute('data-price'));

            const cart = getCart();
            const existingItem = cart.find(item => item.title === title);

            if (existingItem) {
                existingItem.qty += 1;
            } else {
                cart.push({ title, subtitle, price, qty: 1 });
            }

            saveCart(cart);
            updateCartUI();
            if (cartModalInstance) cartModalInstance.show();
        });
    });

    // 4. Checkout Button
    document.getElementById("checkoutBtn")?.addEventListener("click", () => {
        const cart = getCart();
        if (cart.length === 0) {
            alert('Your basket is empty!');
        } else {
            alert('Checkout function will be available once back-end databases are linked!');
            if (cartModalInstance) cartModalInstance.hide();
        }
    });

    // Clean backdrop on modal hide
    if (cartModalEl) {
        cartModalEl.addEventListener('hidden.bs.modal', () => {
            document.querySelectorAll('.modal-backdrop').forEach(el => el.remove());
            document.body.classList.remove('modal-open');
            document.body.style.overflow = '';
            document.body.style.paddingRight = '';
        });
    }

    // 5. Back to Top Button Logic
    const backToTopBtn = document.getElementById("backToTopBtn");
    if (backToTopBtn) {
        window.addEventListener("scroll", () => {
            backToTopBtn.classList.toggle("show", window.scrollY > 300);
        });
        backToTopBtn.addEventListener("click", () => {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }
});