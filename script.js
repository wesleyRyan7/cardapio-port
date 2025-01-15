const menu = document.getElementById("menu");
const cartBtn = document.getElementById("cart-btn");
const cartModal = document.getElementById("cart-modal");
const cartItemsContainer = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const checkoutBtn = document.getElementById("checkout-btn");
const closeModalBtn = document.getElementById("close-modal-btn");
const cartCounter = document.getElementById("cart-count");
const addressInput = document.getElementById("address");
const addressWarn = document.getElementById("address-warn");

let cart = [];

// Abrir o modal carrinho
cartBtn.addEventListener("click", function() {
    updateCartModal();
    cartModal.style.display = "flex";
});

cartModal.addEventListener("click", function(event) {
    if (event.target === cartModal) {
        cartModal.style.display = "none";
    }
});

closeModalBtn.addEventListener("click", function() {
    cartModal.style.display = "none";
});

menu.addEventListener("click", function(event) {
    let parentButton = event.target.closest(".add-to-cart-btn");
    if (parentButton) {
        const name = parentButton.getAttribute("data-name");
        const price = parentButton.getAttribute("data-price");
        addToCart(name, price);
    }
});

// Função para adicionar ao carrinho
function addToCart(name, price) {
    const existingItem = cart.find(item => item.name === name);

    if (existingItem) {
        // Se o item já existe, aumenta quantidade
        existingItem.qtd += 1;
    } else {
        cart.push({
            name,
            price: parseFloat(price), // Converte o preço para número
            qtd: 1,
        });
    }

    updateCartModal();
}

// Atualiza carrinho
function updateCartModal() {
    cartItemsContainer.innerHTML = "";
    let total = 0;

    cart.forEach(item => {
        const cartItemsElement = document.createElement("div");
        cartItemsElement.classList.add("flex", "justify-between", "mb-4", "flex-col");

        cartItemsElement.innerHTML = `
        <div class="flex items-center justify-between">
            <div>
                <p class="font-medium">${item.name}</p>
                <p>Qtd: ${item.qtd}</p>
                <p class="font-medium mt-2">${item.price.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL"
                })}</p>
            </div>
            <button class="remove-from-cart-btn" data-name="${item.name}">
                Remover
            </button>
        </div>
        `;

        total += item.price * item.qtd;
        cartItemsContainer.appendChild(cartItemsElement);
    });

    cartTotal.textContent = total.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
    });
    cartCounter.innerHTML = cart.length;
}

// Botão de remover modal
cartItemsContainer.addEventListener("click", function(event) {
    if (event.target.classList.contains("remove-from-cart-btn")) {
        const name = event.target.getAttribute("data-name");
        removeItemCart(name);
    }
});

function removeItemCart(name) {
    const index = cart.findIndex(item => item.name === name);

    if (index !== -1) {
        const item = cart[index];

        if (item.qtd > 1) {
            item.qtd -= 1;
        } else {
            cart.splice(index, 1);
        }
        updateCartModal();
    }
}

addressInput.addEventListener("input", function(event){
    let inputValue = event.target.value.trim();

        if(inputValue !== ""){
        addressInput.classList.remove("border-red-500")
        addressWarn.classList.add("hidden")
        }



})

checkoutBtn.addEventListener("click", function(){

const isOpen = checkRestaurantOpen();
if(!isOpen){
    Toastify({
        text: "Ops, restaurante fechado!",
        duration: 3000,
        close: true,
        gravity: "top", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
          background: "#ef4444",
        }
    }).showToast();
    return;
}

    if(cart.length === 0) return;
    if(addressInput.value === ""){
        addressWarn.classList.remove("hidden")
        addressInput.classList.add("border-red-500")
        return;
    }

        const cartItems = cart.map((item) => {
            return(
                ` ${item.name} Quantidade: (${item.qtd}) Preço: R$${item.price} |`

            )
        }).join("")

        const message = encodeURIComponent(cartItems)
        const phone = "75991700382"

        window.open(`https://wa.me/${phone}?text=${message} Endereço: ${addressInput.value}`, "_blank")

        cart = []
        updateCartModal();
})

function checkRestaurantOpen(){
        const data = new Date();
        const hora = data.getHours();
        return hora >= 21 && hora < 22;
}

const spanItem = document.getElementById("date-span")
const isOpen = checkRestaurantOpen();

if(isOpen){
    spanItem.classList.remove("bg-red-500");
    spanItem.classList.add("bg-green-600");
}
else{
    spanItem.classList.remove("bg-green-600");
    spanItem.classList.add("bg-red-500");
}

