'use strict'
//checbox
const checkbox = document.querySelectorAll('.filter-check_checkbox');

checkbox.forEach(function(elem){
    elem.addEventListener('change', function(){
        if(this.checked){
            this.nextElementSibling.classList.add('checked');
        } else {
            this.nextElementSibling.classList.remove('checked');
        }
    });
});
//end checkbox

//recycle
const btnCart = document.getElementById('cart');
const modalCart = document.querySelector('.cart');
const btnClose = document.querySelector('.cart-close');

btnCart.addEventListener('click', () => {
    modalCart.style.display = 'flex';
    document.body.style.overflow = 'hidden';
});

btnClose.addEventListener ('click', ()=>{
    modalCart.style.display = 'none';
    document.body.style.overflow = '';
});
//end recycle

//work with prodcts in cart
const cards = document.querySelectorAll('.goods .card'),
    cartWrapper = document.querySelector ('.cart-wrapper'),
    cartEmpty = document.getElementById('cart-empty'),
    countGoods = document.querySelector('.counter');

cards.forEach((card) => {
    const btn = card.querySelector('button');
    btn.addEventListener('click', () => {
        const cardClone = card.cloneNode(true);
        cartWrapper.appendChild(cardClone);
        cartEmpty.remove();
        showData();
    });
});

function showData() {
    const cardsCart = cartWrapper.querySelectorAll('.card');
    countGoods.textContent = cardsCart.length;
    console.log(cardsCart.length);
}

//end work with products in cart t