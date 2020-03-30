   // VARIABLES
    const cartBtn = document.querySelector('.cartBtn');
    const closeCartBtn = document.querySelector('.closeCart');
    const clearCartBtn = document.querySelector('.clearCart');
    const cartDOM = document.querySelector('.cart');
    const cartOverlay = document.querySelector('.cartOverlay');
    const cartItems = document.querySelector('.cartItems');
    const cartTotal = document.querySelector('.cartTotal');
    const cartContent = document.querySelector('.cartContent');
    const productsDOM = document.querySelector('.productsCenter');

    // CART
    let cart = [];


    // GETTING THE PRODUCTS (locally(product.json), COntentful)
    class Products {        // syntactical sugar for writing the function constructors
        // method of Products class
        async getProducts() {
           try {
               // fetch needs url from where we will get the data
               let result = await fetch('./products.json');
               let data = await result.json();
               let products = data.items; // an array
               // call map() method on products array and do destructuring of each object in the array
               products = products.map(item => {
                   const {title, price} = item.fields; // get title and price property from the fields property of each object
                   const {id} = item.sys // get id property from the sys object
                   const image = item.fields.image.fields.file.url;
                   return { title, price, id, image};
               });
               return  products;
            //    return data;
           } catch(error) {
                console.log(error);
           }
        }
    }

    // DISPLAY PRODUCTS
    class UI {
        // method to display products
        displayProducts(products){
            console.log(products);
        }
    }

    // LOCAL STORAGE
    class Storage {

    }

    // when the initial HTML document is loaded and parsed w/o waiting for stylesheets, imagesto finish loading.
    // Synchronous JavaScript pauses parsing of the DOM. If you want the DOM to get parsed as fast as possible after the user has requested the page, you can make your JavaScript asynchronous and optimize loading of stylesheets.

    // Event listener where we will kick things off
   document.addEventListener("DOMContentLoaded", () => {

        // we will call functions here

        // create instance of UI class
        const ui = new UI();

        // create instance of UI class
        const products = new Products();

        // get all products
        // products.getProducts().then(data => console.log(data));
        // products.getProducts().then(products => console.log(products));
        products.getProducts().then(products => ui.displayProducts(products));

   })








