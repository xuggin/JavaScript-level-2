const API_URL = "https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses";

function addEventHandlers(list) {
  const goodsSearch = document.querySelector('.goods-search');
  const searchInput = document.querySelector('.search-input');
  goodsSearch.addEventListener('submit', (e) => {
    e.preventDefault();
    const value = searchInput.value;
    list.filterGoods(value);
  })
}

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
    this.goods = [];
    this.filteredGoods = [];
  }
  async fetchGoods() {
    try {
      const goods = await makeGETRequest(`${API_URL}/catalogData.json`);
      this.goods = JSON.parse(goods);
      this.filteredGoods = [...this.goods];
      return this.goods;
    } catch (e) {
      return e;
    }
  }
  filterGoods(value) {
    const regexp = new RegExp(value, 'i');
    this.filteredGoods = this.goods.filter(good =>
      regexp.test(good.product_name));
    this.render();
  }
  get totalSum() {
    return this.goods.reduce((acc, good) => {
      if (good.price) {
        return acc += Number(good.price)
      }
      return acc;
    }, 0)
  }
  render() {
    const listHtml = this.filteredGoods.reduce((acc, good) => {
      const goodItem = new GoodsItem(good.product_name, good.price);
      return acc += goodItem.render();
    }, '');
    document.querySelector(this.el).innerHTML = listHtml;
  }
}

class Cart extends GoodsList {
  add() {
    return makeGETRequest(`${API_URL}/addToBasket.json`)
  }
  delete() {
    return makeGETRequest(`${API_URL}/deleteFromBasket.json`)
  }
  fetchGoods() {
    return makeGETRequest(`${API_URL}/getBasket.json`).then((res) => {
      const cart = JSON.parse(res);
      this.goods = cart.content;
    }).catch(e => e);
  }
}

class CartItem extends GoodsItem {
  constructor(title = "none", price = 0, count = 1) {
    super(title, price);
    this.count = count;
  }
  set setCount(count) {
    this.count += count;
  }
  get getCount() {
    return this.count;
  }
}

const init = async () => {
  try {
    const list = new GoodsList();
    addEventHandlers(list);
    await list.fetchGoods();
    list.render();
  } catch (e) {
    console.error(e);
  }
};

// init();

Vue.component('goods-item', {
  props: ["good"],
  template: `
    <div class="goods-item">
        <h3>{{ good.product_name }}</h3>
        <p>{{ good.price}}</p>
    </div>
  `
});

Vue.component('goods-list', {
  props: ['goods'],
  computed: {
    isGoodsEmpty() {
      return this.goods.length === 0;
    },
  },
  template: `
    <div v-if="!isGoodsEmpty" class="goods-list">
       <goods-item v-for="good in goods" :key="good.id_product" :good="good"></goods-item>
    </div>
    <div v-else class="goods-not-found">
      <h2>Нет товара</h2>
    </div>`
});

const app = new Vue({
  el: "#app",
  data: {
    goods: [],
    isLoading: true,
    searchLine: '',
    isVisibleCart: false,
    currentSearch: new RegExp('', 'i'),
  },
  methods: {
    makeGETRequest(url) {
      return new Promise((resolve, reject) => {
        let xhr;

        if (window.XMLHttpRequest) {
          xhr = new XMLHttpRequest();
        } else if (window.ActiveXObject) {
          xhr = new ActiveXObject("Microsoft.XMLHTTP");
        }

        xhr.onreadystatechange = function () {
          if (xhr.readyState !== 4) return;
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve(JSON.parse(xhr.responseText));
          } else {
            reject(xhr.status)
          }
        };

        xhr.open("GET", url);
        xhr.send();
      })
    },
    filterGoods() {
      this.currentSearch = new RegExp(this.searchLine, 'i');
    },
    toggleCart() {
      this.isVisibleCart = !this.isVisibleCart;
    }
  },
  computed: {
    throttleFilter() {
      return _.throttle(this.filterGoods, 700);
    },
    filteredGoods() {
      if (!this.goods || !Array.isArray(this.goods)) return [];
      return this.goods.filter(good =>
        this.currentSearch.test(good.product_name));
    }
  },
  async mounted() {
    this.goods = await this.makeGETRequest(`${API_URL}/catalogData.json`);
    await this.$nextTick();
    setTimeout(() => {
      this.isLoading = false;
    }, 500);
  }
});
