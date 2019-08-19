'use strict'

//checbox

function toggleCheckbox(){
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
}
//end checkbox

//recycle
function toggleCart(){
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
}
//end recycle

//работа с корзиной
function addCart() {
    const cards = document.querySelectorAll('.goods .card'),
        cartWrapper = document.querySelector ('.cart-wrapper'),
        cartEmpty = document.getElementById('cart-empty'),
        countGoods = document.querySelector('.counter'),
        cardPrice = document.querySelectorAll('.card-price');

// Заносим товары в корзину при нажатии на кнопку
    cards.forEach((card) => {
        const btn = card.querySelector('button');

        btn.addEventListener('click', () => {
            const cardClone = card.cloneNode(true);
            
            cartWrapper.appendChild(cardClone);
            showData();
    //делаем кнопку удалить из корзины
            const removeBtn = cardClone.querySelector('.btn');
            
            removeBtn.textContent = "Удалить из корзины";
            removeBtn.addEventListener('click', () => {
                cardClone.remove();
                showData();
            });
        });
    });

    // подсчет данных из корзины
    function showData() {
        const cardsCart = cartWrapper.querySelectorAll('.card'),
            cardsPrice = cartWrapper.querySelectorAll('.card-price'),
            cardTotal = document.querySelector('.cart-total span');

    // считаем кол-во товаров в индикаторе на главной
        countGoods.textContent = cardsCart.length;

    // считаем сумму всех товаров
        let sum = 0;

        cardsPrice.forEach((cardPrice) => {
            let price = parseFloat(cardPrice.textContent);
            sum += price;
        });
        cardTotal.textContent = sum;
        
    //проверка на наличие товаров, если все удалили, возвращаем напись о пустой корзине
        if (cardsCart.length !== 0){
            cartEmpty.remove();
        } else {
            cartWrapper.appendChild(cartEmpty);
        }
    }
}
//end работа с корзиной

//фильтр акции

function actionPage(){
    const cards = document.querySelectorAll('.goods .card'),
        discountCheckbox = document.getElementById('discount-checkbox'),
        min = document.getElementById('min'),
        max = document.getElementById('max'),
        search = document.querySelector('.search-wrapper_input'),
        searchBtn = document.querySelector('.search-btn');
        
        //запуск фильтра при клике по чекбоксу акции
        discountCheckbox.addEventListener('click',filter);
        //запуск фильтра по цене при изменении полей цены
        max.addEventListener('change', filter);
        min.addEventListener('change', filter);

        //делаем функцию фильтр 
        function filter (){
            cards.forEach ((card) =>{
                const cardPrice = card.querySelector('.card-price');
                const price = parseFloat(cardPrice.textContent);
                const discount = card.querySelector('.card-sale');

                if ((min.value && price < min.value) || (max.value && price > max.value)){ //фильтр по цене
                    card.parentNode.style.display = 'none';
                } else if (discountCheckbox.checked && !discount){ //фильтр по акции
                    card.parentNode.style.display = 'none';
                } else {
                    card.parentNode.style.display = '';
                }
            });
        }

        //работаем с поиском
        searchBtn.addEventListener('click', () => {
            const searchText = new RegExp(search.value.trim(), 'i');
            cards.forEach((card) =>{
               const title = card.querySelector('.card-title');
               if (!searchText.test(title.textContent)){
                card.parentNode.style.display = 'none';
               } else {
                card.parentNode.style.display = '';
               }
            });
            search.value = '';

        });
}
//end фильтр акции

//получение данных с сервера
function getData(){
    const goodsWrapper = document.querySelector('.goods');
    return fetch('../db/db.json')
        .then((response)=> {
            if (response.ok){                   //обрабатываем статус получения
                return response.json();
            } else {
                throw new Error ('Данные не были получены, ошибка: ' + response.status);
            }
        })
        //.then(data => renderCards(data))
        .then((data) => {
            return data;
        })     //обрабатываем данные с сервера функцией вывода товара с сервера
        .catch(err => {
            console.warn(err);
            goodsWrapper.innerHTML = '<div style="color: red; font-size: 30px">Упс что-то пошло не так!</div>'
        });

}

//выводим карточки товара с сервера
function renderCards(data){
    const goodsWrapper = document.querySelector('.goods'); //получаем родитель товров/обертка
    data.goods.forEach((good) => { // перебираем данные о товарах с сервера
        const card = document.createElement('div'); //создаем див для каждой карточки
        card.className = 'col-12 col-md-6 col-lg-4 col-xl-3'; //присваиваем диву классы верстки
        //помещаем верстку в карточку
        card.innerHTML = `
            <div class="card" data-category="${good.category}">
                ${good.sale ? '<div class="card-sale">🔥Hot Sale🔥</div>' : ''}
				<div class="card-img-wrapper">
                    <span class="card-img-top"
    					style="background-image: url('${good.img}')"></span>
				</div>
				<div class="card-body justify-content-between">
					<div class="card-price" style="${good.sale ? 'color:red' : ''}">${good.price} ₽</div>
                    <h5 class="card-title">${good.title}</h5>
                    <button class="btn btn-primary">В корзину</button>
				</div>
		    </div>
        `;
        goodsWrapper.appendChild(card); //помещаем каждую карточку товаров в обертку
    })
}
//end получение данных с сервера

//каталог
function renderCatalog(){
    const cards = document.querySelectorAll('.goods .card');
    const catalogList = document.querySelector('.catalog-list');
    const catalogWrapper = document.querySelector('.catalog')
    const catalogBtn = document.querySelector('.catalog-button');
    const categories = new Set(); //создаем коллекцию, куда будем добавлять категории товаров

    cards.forEach((card) => {
        categories.add(card.dataset.category); //перебираем товары и добавляем их в колекцию
    });

    //добавляем категории из нашей коллекции в меню каталог
    categories.forEach((item) => {
        const li = document.createElement('li');
        li.textContent = item;
        catalogList.appendChild(li);
    });
    //открытие/закрытие каталога
    catalogBtn.addEventListener('click', () => {
        if (catalogWrapper.style.display){
            catalogWrapper.style.display = '';
        } else {
            catalogWrapper.style.display = 'block';
        }
        if (event.target.tagName === 'LI'){
            cards.forEach((card) => {
                if (card.dataset.category === event.target.textContent){
                    card.parentNode.style.display = '';
                } else {
                    card.parentNode.style.display = 'none';
                }
            });
        }
    });
}
//end каталог

getData().then((data) => {
    renderCards(data);
    toggleCheckbox();
    toggleCart();
    addCart();
    actionPage();
    renderCatalog();
});

