
function makeGETRequest(url, callback) {
  var xhr;

  if (window.XMLHttpRequest) {
    xhr = new XMLHttpRequest();
  } else if (window.ActiveXObject) { 
    xhr = new ActiveXObject("Microsoft.XMLHTTP");
  }

  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      callback(xhr.responseText);
    }
  }

  xhr.open('GET', url, true);
  xhr.send();
}
const API_URL = 'https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses';

function addEventHandlers(){
    const googsSearch = document.querySelector('.goods-search');
    
}

class GoodsItem {
  constructor(title = "none", price = 0) {
    this.product_name = title;
    this.price = price;
  }
  render() {
    return `
      <div class="goods-item">
        <h3>${this.product_name}</h3>
        <p>${this.price}</p>
        <button class="add-goods-button">Купить</button>
      </div>`;
  }
}

class GoodsList {
  constructor (el = ".goods-list") {
    this.el = el;
    this.goods = []
    this.filteredGoods = [];

  }
 
 fetchGoods(cb) {
    makeGETRequest(`${API_URL}/catalogData.json`, (goods) => {
      this.goods = JSON.parse(goods);
      cb();
    })
  }


    filterGoods(value) {
    const regexp = new RegExp(value, 'i');
    this.filteredGoods = this.goods.filter(good => regexp.test(good.product_name));
    this.render();
  }


 render() {
    let listHtml = '';
    this.filteredGoods.forEach(good => {
      const goodItem = new GoodsItem(good.product_name, good.price);
      listHtml += goodItem.render();
    });
    document.querySelector('.goods-list').innerHTML = listHtml;
  }

  calcSumm(){
    const goodsSummPrice = this.goods.reduce((acc, good) => {
      const goodPrice = good.price;
      if (goodPrice){
        return acc = Number(acc) + Number(goodPrice);
      }
      return acc
    }, '');
    return goodsSummPrice
  }
}

//класс корзины товаров
class CartList{
    //перейти к оформлению покупки
    buy() {}
    //очистить корзину
    clean() {}
    //вычислить сумму товаров в корзине
   get calc() {}
}

//класс элемента корзины
class CartItem{
    add() {}
    update() {}
    remove() {}
}

const list = new GoodsList();
list.fetchGoods();
list.render();
console.log(list.calcSumm());
