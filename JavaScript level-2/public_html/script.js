class GoodsItem {
  constructor(title = "none", price = 0) {
    this.title = title;
    this.price = price;
  }
  render() {
    return `
      <div class="goods-item">
        <h3>${this.title}</h3>
        <p>${this.price}</p>
        <button class="add-goods-button">Купить</button>
      </div>`;
  }
}

class GoodsList {
  constructor (el = ".goods-list") {
    this.el = el;
    this.goods = []
  }
  fetchGoods() {
    this.goods = [
      { title: "Shirt", price: 150 },
      { title: "Socks", price: 50 },
      { price: 350 },
      { title: "Jacket", price: 350 },
      { title: "Shoes" },
      
      
    ];
  }
  render() {
    const listHtml = this.goods.reduce((acc, good) => {
      const goodItem = new GoodsItem(good.title, good.price);
      return acc += goodItem.render();
    }, '');
    document.querySelector(this.el).innerHTML = listHtml;
  }
  calcSumm(){
    const goodsSummPrice = this.goods.reduce((acc, good) => {
      const goodPrice = good.price;
      if (goodPrice){
        return acc = Number(acc) + Number(goodPrice);
      }else{return acc}
    }, '');
    return goodsSummPrice
  }
}

//класс корзины товаров
class CartList{
    //перейти к оформлению покупки
    bay() {}
    //очистить корзину
    clean() {}
    //вычислить сумму товаров в корзине
    calc() {}
}

//класс элемента корзины
class CartItem{
    add() {}
    remove() {}
}

const list = new GoodsList();
list.fetchGoods();
list.render();
console.log(list.calcSumm());
