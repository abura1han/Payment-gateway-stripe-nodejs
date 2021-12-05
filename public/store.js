if (document.readyState == 'loading') {
    document.addEventListener('DOMContentLoaded', ready)
} else {
    ready()
}

// cart array for store all product list to checkout
var CART = [];

// when document is ready
function ready() {
    // cart item remove buttons
    var removeCartItemButtons = document.getElementsByClassName('btn-danger')
    for (var i = 0; i < removeCartItemButtons.length; i++) {
        var button = removeCartItemButtons[i]
        button.addEventListener('click', removeCartItem)
    }

    // quantity inputs
    var quantityInputs = document.getElementsByClassName('cart-quantity-input')
    for (var i = 0; i < quantityInputs.length; i++) {
        var input = quantityInputs[i]
        input.addEventListener('change', quantityChanged)
    }

    // add to cart button
    var addToCartButtons = document.getElementsByClassName('shop-item-button')
    for (var i = 0; i < addToCartButtons.length; i++) {
        var button = addToCartButtons[i]
        button.addEventListener('click', addToCartClicked)
    }

    // purchase button
    document.getElementsByClassName('btn-purchase')[0].addEventListener('click', purchaseClicked)

    // hide empty cart
    hideEmptyCart();
}

function purchaseClicked() {
    // send purchase data to server
    fetch('http://localhost:8000/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            products: CART
        })
    })
        .then(res => res.ok ? res.json() : Promise.reject(res))
        .then(({ url }) => window.location = url)
        .catch(err => console.error(err))
}

// remove items from cart
function removeCartItem(event) {
    // remove item from `CART` array by product id
    CART = CART.filter(function (item) { return item.id !== event.target.dataset.pid });

    var buttonClicked = event.target
    buttonClicked.parentElement.parentElement.remove()
    updateCartTotal()
}

// update quantity
function quantityChanged(event) {
    var input = event.target
    if (isNaN(input.value) || input.value <= 0) {
        input.value = 1
    }

    // change quantity of `CART` element
    CART.forEach(function ({ id }, index) {
        if (id == event.target.dataset.pid) {
            CART[index].quantity = input.value;
        }
    })
    console.log(CART)

    updateCartTotal()
}

// add to cart
function addToCartClicked(event) {
    var pid = event.target.dataset.pid;
    var button = event.target
    var shopItem = button.parentElement.parentElement
    var title = shopItem.getElementsByClassName('shop-item-title')[0].innerText
    var price = shopItem.getElementsByClassName('shop-item-price')[0].innerText
    var imageSrc = shopItem.getElementsByClassName('shop-item-image')[0].src
    addItemToCart(pid, title, price, imageSrc)
    updateCartTotal()
}

function addItemToCart(id, title, price, imageSrc) {
    // add item to `CART` array
    // initial quantity 1
    CART.push({ id, quantity: 1 });

    var cartRow = document.createElement('div')
    cartRow.classList.add('cart-row')
    var cartItems = document.getElementsByClassName('cart-items')[0]
    var cartItemNames = cartItems.getElementsByClassName('cart-item-title')
    for (var i = 0; i < cartItemNames.length; i++) {
        if (cartItemNames[i].innerText == title) {
            alert('This item is already added to the cart')
            return
        }
    }

    // cart ui
    var cartRowContents = `
        <div class="cart-item cart-column" data-pid="${id}" data-quantity="1">
            <img class="cart-item-image" src="${imageSrc}" width="100" height="100">
            <span class="cart-item-title">${title}</span>
        </div>
        <span class="cart-price cart-column">${price}</span>
        <div class="cart-quantity cart-column">
            <input class="cart-quantity-input" type="number" value="1" data-pid="${id}">
            <button class="btn btn-danger" type="button" data-pid="${id}">REMOVE</button>
        </div>`
    cartRow.innerHTML = cartRowContents
    cartItems.append(cartRow)
    cartRow.getElementsByClassName('btn-danger')[0].addEventListener('click', removeCartItem)
    cartRow.getElementsByClassName('cart-quantity-input')[0].addEventListener('change', quantityChanged)
}

// update total cart
function updateCartTotal() {
    var cartItemContainer = document.getElementsByClassName('cart-items')[0]
    var cartRows = cartItemContainer.getElementsByClassName('cart-row')
    var total = 0
    for (var i = 0; i < cartRows.length; i++) {
        var cartRow = cartRows[i]
        var priceElement = cartRow.getElementsByClassName('cart-price')[0]
        var quantityElement = cartRow.getElementsByClassName('cart-quantity-input')[0]
        var price = parseFloat(priceElement.innerText.replace('$', ''))
        var quantity = quantityElement.value
        total = total + (price * quantity)
    }
    total = Math.round(total * 100) / 100
    document.getElementsByClassName('cart-total-price')[0].innerText = '$' + total
}

// hide empty cart
function hideEmptyCart() {
    const cart = document.querySelector('#cart');
    cart.style.display = 'none';

    window.addEventListener('click', () => {
        if (CART.length < 1) {
            cart.style.display = 'none';
        } else {
            cart.style.display = 'block';
        }
    })
}