//array of products
const produits = [
    { id: 1, nom: "Thé Vert Bio", prix: 12.99, image: "https://placehold.co/150" },
    { id: 2, nom: "Café Arabica", prix: 8.50, image: "https://placehold.co/150" },
    { id: 3, nom: "Infusion Menthe", prix: 5.00, image: "https://placehold.co/150" },
    { id: 4, nom: "Chocolat Chaud", prix: 15.00, image: "https://placehold.co/150" }
];

//Element references
const boutique = document.getElementById("boutiue");
const container = document.getElementById("produits-container");
const panier = document.getElementById("panier-liste");

//User local data / user cart
const userCart = JSON.parse(localStorage.getItem("userCart")) || createNewUserCart(); //import from localStorage


produits.forEach((produit) => {
    createProductCard(produit, false);
})
    
function createProductCard(produit,cartClone) {
    const newElem = document.createElement("div");

    const elemImg = document.createElement("img");
    elemImg.src = produit.image;
    newElem.appendChild(elemImg);

    let cardClass = cartClone ? "produit-carte-panier" : "produit-carte"
    newElem.classList = cardClass;
    if (!cartClone) newElem.addEventListener("click", () => {addToCart(produit);})
    
    
    const elemTitle = document.createElement("h3");
    elemTitle.textContent = produit.nom;
    newElem.appendChild(elemTitle);

    const addToCartBttn = document.createElement("button");
    addToCartBttn.textContent = "Ajouter au panier";
    newElem.appendChild(addToCartBttn);

    const removeOneFromCartBttn = document.createElement("button");
    removeOneFromCartBttn.textContent = "-";
    newElem.appendChild(removeOneFromCartBttn);


    const elemPrice = document.createElement("p");
    elemPrice.textContent = produit.prix +" €";
    newElem.appendChild(elemPrice);


    if (cartClone) {
        panier.appendChild(newElem);

    }
    else {
        container.appendChild(newElem);
        createProductCard(produit, true); //create the same card but in the cart
    }   
    
}

function createNewUserCart() {
    const newCart = [];
    produits.forEach((produit) => {
        newCart.push({id :produit.id, amount:0})
    })
    return newCart; //note that we don't set the localstorage yet
}

function addToCart(produit) {
    //update array
    userCart[produit.id - 1].amount++;
    //update localStorage
    localStorage.setItem("userCart", JSON.stringify(userCart));

}

function removeFromACart(produit) {
    //check if amount < 0
    let newAmount = userCart[produit.id - 1].amount;
    newAmount = newAmount - 1 < 0 ? 0 : newAmount - 1;
    //update array
    userCart[produit.id - 1].amount = newAmount;
    //update localStorage
    localStorage.setItem("userCart", JSON.stringify(userCart));

}

//utility functions 
