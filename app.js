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

    // BUTTONS
    let buttonsDOM = [];


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
                            <i class="fas fa-shopping-cart">Add to cart</i>
                        </button>
                    </div>
                    <h3>${product.title}</h3>
                    <h4>$${product.price}</h4>
                    </article>
                <!-- end of single product -->
                `;    // add on to the empty string stored in result
            });

            // Do this with jQuery
            productsDOM.innerHTML = result;
        }

        // Get Bag Buttons
        getBagButtons(){
            const buttons = [...document.querySelectorAll(".bagBtn")]; // ...(spread operator) converts nodelist to array
            // find() method works on an array (not on Nodelist)
            // console.log(buttons);

            buttonsDOM = buttons;

            // get id for the buttons
            buttons.forEach(button => {
                let id = button.dataset.id;
                // console.log(id);

                // check for the item in the cart
                let inCart = cart.find(item => item.id === id);
                if(inCart){
                    button.innerText = "In Cart";
                    button.disabled = true;
                }
                
                    button.addEventListener('click', (event) => {
                        // console.log(event);
                        event.target.innerText = " In Cart";
                        event.target.disabled = true;

                        // get product from the products based on the id
                        let cartItem = {...Storage.getProduct(id), amount: 1}; // add amount to the property (key: value pair to the object representing clicked item)
                        // console.log(cartItem);

                        // add product to the cart
                        cart = [...cart, cartItem]; // get all the items from cart array and add cartItem (just created)
                        // console.log(cart);

                        // save the cart in the local storage
                        Storage.saveCart(cart);

                        // set cart values
                        this.setCartValues(cart);

                        // display cart item
                        this.addCartItem(cartItem);

                        // show the cart
                        this.showCart();
                    });
            })
        }

        setCartValues(cart){
            let tempTotal = 0;
            let itemsTotal = 0;
            cart.map(item => {
                tempTotal += item.price * item.amount;
                itemsTotal += item.amount;
            });
            cartTotal.innerText = parseFloat(tempTotal.toFixed(2));
            cartItems.innerText = itemsTotal;
            // console.log(cartTotal, cartItems);
        }

        // Create new cart item
        addCartItem(item){
            const div = document.createElement('div');
            div.classList.add('cartItem');
            div.innerHTML = `
                <img src=${item.image} alt="product">
                    <div>
                        <h4>${item.title}</h4>
                        <h5>$${item.price}</h5>
                        <span class="removeItem" data-id=${item.id}>remove</span>
                    </div>
                    <div>
                        <i class="fas fa-chevron-up" data-id=${item.id}></i>
                        <p class="itemAmount">${item.amount}</p>
                        <i class="fas fa-chevron-down" data-id=${item.id}></i>
                    </div>
            `;
            // Append item to the Cart Content
            cartContent.appendChild(div);
            // console.log(cartContent);
        }        

        // Show the Cart
        showCart(){
            cartOverlay.classList.add('transparentBcg');
            cartDOM.classList.add('showCart');
        }

        setupApp(){
            cart = Storage.getCart();
            this.setCartValues(cart);
            this.populateCart(cart);
            cartBtn.addEventListener('click', this.showCart);
            closeCartBtn.addEventListener('click', this.hideCart);
        }
        
        populateCart(cart){
            cart.forEach(item => this.addCartItem(item));
        }

        hideCart(){
            cartOverlay.classList.remove('transparentBcg');
            cartDOM.classList.remove('showCart');
        }

        cartLogic(){
            // CLEAR CART button

            // clearCartBtn.addEventListener('click', this.clearCart); // accessing a method within the class. be sure what this is pointing to
            clearCartBtn.addEventListener('click', () => {
                this.clearCart();
            });

            // CART FUNCTIONALITY
            cartContent.addEventListener('click', event => {
                // console.log(event.target);
                if(event.target.classList.contains('removeItem')){
                    let removeItem = event.target;
                    // console.log(removeItem);
                    let id = removeItem.dataset.id;
                    // console.log(id);

                    // console.log(removeItem.parentElement.parentElement);
                    cartContent.removeChild(removeItem.parentElement.parentElement);
                    this.removeItem(id);
                }
            })

        }

        clearCart(){
            console.log(this); // first this references the button that is clicked not the UI class
            // Now this refers to the UI class

            let cartItems = cart.map(item => item.id);
            // console.log(cartItems); // gives the ids of the items in the cart

            cartItems.forEach(id => this.removeItem(id));
            console.log(cartContent.children);

            // Remove items from the DOM
            while(cartContent.children.length > 0){
                cartContent.removeChild(cartContent.children[0]);
                console.log(cartContent.children);
            }
            this.hideCart();
        }

        removeItem(id){
            cart = cart.filter(item => item.id !== id);
            this.setCartValues(cart);
            Storage.saveCart(cart);
            let button = this.getSingleButton(id);
            button.disabled = false;
            button.innerHTML = `<i class="fas fa-shopping-cart"></i> Add to cart`;
        }

        getSingleButton(id){
            return buttonsDOM.find(button => button.dataset.id === id)
        }
    }

    // LOCAL STORAGE
    class Storage {
        static saveProducts(products){ // products here is just a parameter name
        // within the the method we have access to the local storage
        localStorage.setItem("products", JSON.stringify(products)) // setItem is a method of localStorage
        // .stringify is to convert the JSON to string
        }

        static getProduct(id){
            let products = JSON.parse(localStorage.getItem('products')); // return an array.
            return products.find(product => product.id === id);
        }

        static saveCart(cart){
            localStorage.setItem('cart', JSON.stringify(cart));
        }

        static getCart(){
            return localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : [];
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

        // setup App
        ui.setupApp();

        // get all products
        // products.getProducts().then(data => console.log(data));
        // products.getProducts().then(products => console.log(products));
        products.getProducts().then(products => {
            ui.displayProducts(products);

            // since static method, we dont need to create an instance
            // we just call it on the class
            Storage.saveProducts(products);
        }).then(() => {
            ui.getBagButtons();
            ui.cartLogic();
        });
   })

   /*
   - we could go to the content ful and just get that one item
   - but we want to speed things up  so we saved all the things in the local storage (not recommmended where we will have thousands of products)
   */








