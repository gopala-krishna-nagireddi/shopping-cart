let productsListEl = document.querySelector(".products-list");
let cartListEl = document.querySelector(".cart-list");
let cartTotalPriceEl = document.querySelector(".cart-total");
let avgCartEl = document.querySelector(".cart-avg");
let inputEl = document.querySelector(".price-input");
let sortingEl = document.querySelector(".sorting");
let clearCartBtnEl = document.querySelector(".clear-cart");

let cartList = getCartItems();
let cartTotalPrice = 0;
let totalProducts = 0;

function getCartItems() {
  const cartList = JSON.parse(localStorage.getItem("cartList"));

  if (cartList === null) {
    return [];
  }
  return cartList;
}

function createAndAppendProduct(product, category) {
  const { id, name, price, image } = product;

  let productItemEl = document.createElement("li");
  productItemEl.classList.add("product-item");

  if (category === "product") {
    productsListEl.appendChild(productItemEl);
  } else if (category === "cartItem") {
    cartListEl.appendChild(productItemEl);
    cartTotalPrice += product.totalPrice;
    totalProducts += product.qty;
  }

  let productItemContainerEl = document.createElement("div");
  productItemEl.appendChild(productItemContainerEl);

  let productImgEl = document.createElement("img");
  productImgEl.src = image;
  productImgEl.classList.add("product-img");
  productItemContainerEl.appendChild(productImgEl);

  let productTitleBtnContairEl = document.createElement("div");
  productTitleBtnContairEl.classList.add("product-title-btn-container");
  productItemContainerEl.appendChild(productTitleBtnContairEl);

  let productTitlePriceEl = document.createElement("div");
  productTitleBtnContairEl.appendChild(productTitlePriceEl);

  let productTitleEl = document.createElement("p");
  productTitleEl.textContent = name;
  productTitleEl.classList.add("title");
  productTitlePriceEl.appendChild(productTitleEl);

  let productPriceEl = document.createElement("p");
  productPriceEl.textContent = `$${price}`;
  productPriceEl.classList.add("price");
  productTitlePriceEl.appendChild(productPriceEl);

  let addCartBtnEl = document.createElement("button");

  if (category === "product") {
    addCartBtnEl.textContent = "Add to Cart";
    addCartBtnEl.classList.add("cart-btn", "add-btn");
    addCartBtnEl.addEventListener("click", function () {
      addItemToCart(product);
    });
  } else if (category === "cartItem") {
    const { qty, totalPrice } = product;

    let quantityToalPriceEl = document.createElement("div");
    productTitleBtnContairEl.appendChild(quantityToalPriceEl);

    let quantityEl = document.createElement("p");
    quantityEl.textContent = `Qty: ${qty}`;
    quantityEl.classList.add("qty");
    quantityToalPriceEl.appendChild(quantityEl);

    let totalPriceEl = document.createElement("p");
    totalPriceEl.textContent = `Total: $${totalPrice}`;
    totalPriceEl.classList.add("total-price");
    quantityToalPriceEl.appendChild(totalPriceEl);

    addCartBtnEl.textContent = "X";
    addCartBtnEl.classList.add("cart-btn", "del-btn");
    addCartBtnEl.addEventListener("click", function () {
      removeFromCart(product);
    });
  }

  productTitleBtnContairEl.appendChild(addCartBtnEl);

  cartTotalPriceEl.textContent = `$${cartTotalPrice}`;

  avgCartEl.textContent =
    totalProducts > 0 ? `$${Math.round(cartTotalPrice / totalProducts)}` : "$0";
}

function updateCart() {
  cartListEl.innerHTML = "";
  cartTotalPrice = 0;
  totalProducts = 0;

  if (cartList.length === 0) {
    cartTotalPriceEl.textContent = "$0";
    avgCartEl.textContent = "$0";
  }

  for (let cartItem of cartList) {
    createAndAppendProduct(cartItem, "cartItem");
  }
}

function addItemToCart(product) {
  const index = cartList.findIndex((item) => item.id === product.id);

  if (index === -1) {
    const updatedProduct = {
      id: product.id,
      name: product.name,
      image: product.image,
      price: product.price,
      qty: 1,
      totalPrice: product.price,
    };

    cartList.push(updatedProduct);
  } else {
    const updatedCartList = cartList.map((item, itemIndex) => {
      if (index === itemIndex) {
        return {
          id: item.id,
          name: item.name,
          image: item.image,
          price: item.price,
          qty: item.qty + 1,
          totalPrice: item.totalPrice + item.price,
        };
      }
      return item;
    });
    cartList = updatedCartList;
  }

  localStorage.setItem("cartList", JSON.stringify(cartList));

  updateCart();
}

function removeFromCart(product) {
  cartList = JSON.parse(localStorage.getItem("cartList"));

  const updatedList = cartList.filter((item) => item.id !== product.id);

  localStorage.setItem("cartList", JSON.stringify(updatedList));
  cartList = updatedList;

  updateCart();
}

function displayProducts(productsList) {
  for (let product of productsList) {
    createAndAppendProduct(product, "product");
  }
}

function fetchProducts() {
  fetch("/products.json")
    .then(function (response) {
      return response.json();
    })
    .then(function (jsondata) {
      const { products } = jsondata;
      displayProducts(products);
    });
}

fetchProducts();
updateCart();

inputEl.addEventListener("change", function (e) {
  const filteredCartItems = cartList.filter(
    (item) => item.price > e.target.value
  );

  cartListEl.innerHTML = "";
  cartTotalPrice = 0;
  totalProducts = 0;

  for (let item of filteredCartItems) {
    createAndAppendProduct(item, "cartItem");
  }
});

sortingEl.addEventListener("change", function (e) {
  const sortedProducts = cartList.sort((a, b) => {
    return e.target.value === "ascending"
      ? a.price - b.price
      : b.price - a.price;
  });

  cartList = sortedProducts;

  updateCart();
});

clearCartBtnEl.addEventListener("click", function () {
  cartList = [];
  localStorage.setItem("cartList", JSON.stringify(cartList));

  updateCart();
});
