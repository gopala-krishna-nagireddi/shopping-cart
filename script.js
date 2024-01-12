let proudctsContainerEl = document.querySelector('.products-container')
let productsListEl = document.querySelector('.products-list')
productsListEl.classList.add('products-list')
proudctsContainerEl.appendChild(productsListEl)

let cartListEl = document.querySelector(".cart-list")

let priceInputEl = document.querySelector("price-input")

let avgPriceEl = document.querySelector(".avg-price")
let totalPriceEl = document.querySelector(".total-price")


let totalPrice = 0

function addItemToCart(id){
    const parsedData = JSON.parse(localStorage.getItem("productsList"))
    const cartList = JSON.parse(localStorage.getItem('cartList'))
    const {products} = parsedData
    
    const product = products.find(function(product){
        if(product.id === id){
            return product
        }
    })

    if(cartList === null){
        const cartItems = {
            cartItems: [
                {...product}
            ]
        }

        localStorage.setItem('cartList', JSON.stringify(cartItems))
    }
    else{
        const {cartItems} = cartList

        cartItems.push(product)

        localStorage.setItem('cartList', JSON.stringify(cartList))
    }


}


function createAndAppendProduct(product){
    const {id, image, name, price} = product
        
    let productItemEl = document.createElement("li")
    productItemEl.classList.add("product-item")
    productsListEl.appendChild(productItemEl)

    let imageEl = document.createElement('img')
    imageEl.src = image
    imageEl.classList.add('product-img')
    productItemEl.appendChild(imageEl)

    let productDetailsEl = document.createElement('div')
    productDetailsEl.classList.add('product-details-container')
    productItemEl.appendChild(productDetailsEl)

    let productNamePriceEl = document.createElement('div')
    productDetailsEl.appendChild(productNamePriceEl)

    let nameEl = document.createElement('p')
    nameEl.textContent = name
    nameEl.classList.add('product-name')
    productNamePriceEl.appendChild(nameEl)

    let priceEl = document.createElement('p')
    priceEl.textContent = `$${price}`
    productNamePriceEl.appendChild(priceEl)


    let btnEl = document.createElement('button')
    btnEl.textContent = "AC"
    btnEl.addEventListener('click', function(){
        addItemToCart(id)
    })
    productDetailsEl.appendChild(btnEl)
    
    
}

function displayProducts(data){
    const {products} = data
    localStorage.setItem('productsList', JSON.stringify(data))
    
    for(let eachProduct of products){
        createAndAppendProduct(eachProduct)
    }
}


function fetchProductsList(){
    fetch('/products.json')
    .then(function(response){
        return response.json()
    })
    .then(function(jsondata){
        
        displayProducts(jsondata)
    })
}

fetchProductsList()


function removeCartItem(id){

    const cartList = JSON.parse(localStorage.getItem('cartList'))
    const {cartItems} = cartList

    const filteredCartItems = cartItems.filter((item) => item.id !== id)

    const updatedCart = {
        cartItems: filteredCartItems
    }


    localStorage.setItem('cartList', JSON.stringify(updatedCart))
}


function createAndAppendCartItem(item){
    const {id, image, name, price} = item
        
    let productItemEl = document.createElement("li")
    productItemEl.classList.add("product-item")
    cartListEl.appendChild(productItemEl)

    let imageEl = document.createElement('img')
    imageEl.src = image
    imageEl.classList.add('product-img')
    productItemEl.appendChild(imageEl)

    let productDetailsEl = document.createElement('div')
    productDetailsEl.classList.add('product-details-container')
    productItemEl.appendChild(productDetailsEl)

    let productNamePriceEl = document.createElement('div')
    productDetailsEl.appendChild(productNamePriceEl)

    let nameEl = document.createElement('p')
    nameEl.textContent = name
    nameEl.classList.add('product-name')
    productNamePriceEl.appendChild(nameEl)

    let priceEl = document.createElement('p')
    priceEl.textContent = `$${price}`
    productNamePriceEl.appendChild(priceEl)


    let btnEl = document.createElement('button')
    btnEl.textContent = "X"
    btnEl.addEventListener('click', function(){
        removeCartItem(id)
    })
    productDetailsEl.appendChild(btnEl)

    totalPrice = totalPrice + price

    totalPriceEl.textContent = `$${Math.round(totalPrice, 2)}`

    

}


function displayCart(){

    const cartList = JSON.parse(localStorage.getItem('cartList'))


    if(cartList !== null){
        
        const {cartItems} = cartList

        for (let item of cartItems){
            createAndAppendCartItem(item)
        }
    }
}


displayCart()
