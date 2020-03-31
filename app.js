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

            let result = ''; // create a variable

            // since we get back an array as products, we use array methods
            products.forEach(product => { // loop over products array of objects
                result += `
                <!-- single product -->
                    <article class="product">
                    <div class="imgContainer">
                        <img src=${product.image} alt="apparel1" class="productImg">
                        <button class="bagBtn" data-id=${product.id}>
                            <i class="fas fa-shopping-cart">Add to bag</i>
                        </button>
                    </div>
                    <h3>${product.title}</h3>
                    <h4>$${product.price}</h4>
                    </article>
                <!-- end of single product -->
                `;    // add on tot he empty string stored in result
            });

            // Do this with jQuery
            productsDOM.innerHTML = result;
        }
    }

    // LOCAL STORAGE
    class Storage {
        static saveProducts(products){ // products here is just a parameter name
        // within the the method we have access to the local storage
        localStorage.setItem("products", JSON.stringify(products)) // setItem is a method of localStorage
        // .stringify is to convert the JSON to string
        }
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
        products.getProducts().then(products => {
            ui.displayProducts(products);

            // since static method, we dont need to create an instance
            // we just call it on the class
            Storage.saveProducts(products);
        });
   })

   /*
   - we could go to the content ful and just get that one item
   - but we want to speed things up  so we saved all the things in the local storage (not recommmended where we will have thousands of products)
   */








