//region Array of products
const produits = [
    { id: 1, nom: "Thé Vert Bio", prix: 12.99, image: "https://placehold.co/150" },
    { id: 2, nom: "Café Arabica", prix: 8.50, image: "https://placehold.co/150" },
    { id: 3, nom: "Infusion Menthe", prix: 5.00, image: "https://placehold.co/150" },
    { id: 4, nom: "Chocolat Chaud", prix: 15.00, image: "https://placehold.co/150" }
];

//region Element references
const boutique = document.getElementById("boutiue");
const container = document.getElementById("produits-container");
const panier = document.getElementById("panier-liste");
const totalPrice = document.getElementById("montant-total");
const orderBttn = document.getElementById("btn-commander");
const emailClient = document.getElementById("email-client");
const messageFeedback = document.getElementById("message-feedback");

//region Email Regex
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

//region User local data / user cart
const userCart = JSON.parse(localStorage.getItem("userCart")) || createNewUserCart(); //import from localStorage


//region Main function on start
function main() {
    createAllProductCards();
    orderBttn.addEventListener('click', tryOrder);
    renderCart();
}

//region Init functions
function createNewUserCart() {
    const newCart = [];
    produits.forEach((produit) => {
        newCart.push({id :produit.id, amount:0})
    })
    return newCart; //note that we don't set the localstorage yet
}

function createAllProductCards() {
    produits.forEach((produit) => {
        createProductCard(produit, false);
    });
}

function createProductCard(produit, cartClone) {
    //New card element
    const newElem = document.createElement("div");
    let cardClass = cartClone ? "cartCard" : "card";
    newElem.classList = cardClass;

    
    //Card image
    const elemImg = document.createElement("img");
    elemImg.src = produit.image;
    let imgClass = cartClone ? "cartCard__img" : "card__img";
    elemImg.classList = imgClass;
    newElem.appendChild(elemImg);
    
    
    //Card title => Product Name
    const elemTitle = document.createElement("h3");
    let titleClass = cartClone ? "cartCard__name" : "card__name";
    elemTitle.textContent = produit.nom;
    elemTitle.classList = titleClass;
    newElem.appendChild(elemTitle);
    
    //Card price 
    const elemPrice = document.createElement("p");
    let priceClass = cartClone ? "cartCard__price" : "card__price";
    elemPrice.textContent = produit.prix +" €";
    newElem.appendChild(elemPrice);

    //Add to cart button
    const addToCartBttn = document.createElement("button");
    let buttonText = cartClone ? "+" : "Ajouter au panier";
    addToCartBttn.textContent = buttonText;
    let addButtonClass = cartClone ? "cartCard__addToCartBttn" :"card__addToCartBttn";
    addToCartBttn.classList = "card__addToCartBttn";
    newElem.appendChild(addToCartBttn);
    addToCartBttn.addEventListener("click", () => { addToCart(produit); });

    //Remove from cart button in card cart
    if (cartClone) {
        const removeOneFromCartBttn = document.createElement("button");
        removeOneFromCartBttn.textContent = "-";
        removeOneFromCartBttn.classList = "cartCard__removeFromCartBttn";
        newElem.appendChild(removeOneFromCartBttn); 
        removeOneFromCartBttn.addEventListener('click',() => { removeFromCart(produit); });
    }

    //Subtotal 
    if (cartClone) {
        const elemAmount = document.createElement("p");
        elemAmount.classList ="cartCard__amount";
        elemAmount.textContent = userCart.find(u => u.id === produit.id).amount;
        newElem.appendChild(elemAmount);

        const subTotal = document.createElement("p");
        subTotal.classList ="cartCard__subtotal";
        subTotal.textContent = (userCart.find(u => u.id === produit.id).amount * produit.prix) + " €";
        newElem.appendChild(subTotal);
    }

    if (cartClone) {
        newElem.classList = ("cartCard hidden productID" + produit.id);
        panier.appendChild(newElem);
    }
    else {
        newElem.classList = "card";
        container.appendChild(newElem);
        createProductCard(produit, true); //create the same card but in the cart
    }   
    
}

//region Update Cart functions
function addToCart(produit) {
    //update array
    userCart[produit.id - 1].amount++;
    //update localStorage
    localStorage.setItem("userCart", JSON.stringify(userCart));
    renderCart();
}

function removeFromCart(produit) {
    //check if amount < 0
    let newAmount = userCart[produit.id - 1].amount;
    newAmount = newAmount - 1 < 0 ? 0 : newAmount - 1;
    //update array
    userCart[produit.id - 1].amount = newAmount;
    //update localStorage
    localStorage.setItem("userCart", JSON.stringify(userCart));
    renderCart();
}

function renderCart() {
    //display products cards correctly in the cart
    let total = 0;
    userCart.forEach((product) => {
        const productElem = document.querySelector(".productID" + product.id); //only one exist so querySelector is suffficient
        if (product.amount <= 0) productElem.classList.toggle("hidden", true);
        else{
            productElem.classList.toggle("hidden", false); //display the card in the cart
            //update the textContents
            productElem.querySelector(".cartCard__amount").textContent = product.amount;
            let subtotal = (product.amount * (produits.find(u => u.id === product.id).prix));
            productElem.querySelector(".cartCard__subtotal").textContent = subtotal + " €";
            total += subtotal;
        }

    })

    //update total
    totalPrice.textContent = total;

}

//region Trying to Order function
function tryOrder() {
    console.log("try order")
    let validOrder = true;
    let cartProductAmount = 0;
    userCart.forEach((product) => { cartProductAmount += product.amount }); //find the current amount in the cart
    let feedbackString = "";

    //Is cart empty ?
    if (cartProductAmount <= 0) {
        feedbackString = "Panier vide. ";
        validOrder = false;
    } 

    //Is input field empty ?
    if (!emailClient.value) {
        feedbackString += "Veuillez insérer votre adresse mail. "
        validOrder = false;
    }
    else {
        //Is input value a valid email adress ?
        if (!emailRegex.test(emailClient.value)) {
            feedbackString += "Adresse email invalide."
            validOrder = false;
        }
    }

    if (validOrder) {
        feedbackString = "Commande réalisée !"
        messageFeedback.classList = "feedback-valid";
    }
    else {
        messageFeedback.classList = "feedback-error";
    }

    messageFeedback.textContent = feedbackString;
}



main();