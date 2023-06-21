// Inside Cart Container
const cartItemsContainer = document.querySelector(".cart-items-container");
const cartTotal = document.querySelector(".cart-total");
const clearCartBtn = document.querySelector(".clear-cart");

// Cart Functionality
function ClientDataFlow(addToCartBtn) {
  // ClientDataFlow
  let cart = [];

  // Get the cart items from the backend
  function getCartItems() {
    fetch("http://your-backend-url/cart/")
      .then((response) => response.json())
      .then((cartData) => {
        cart = cartData;
        displayCartItems(cartData);
        setCartValues(cartData);
      })
      .catch((error) => {
        console.error("Error fetching cart items:", error);
      });
  }

  // Display cart items
  function displayCartItems(cartItems) {
    let displayCart = cartItems.map(function (item) {
      return `
        <div class="cart-item" data-id="${item.id}">
            <img src="${item.image}" alt="Cart item">
            <div>
                <h4>${item.title}</h4>
                <h5>&#8377;${item.price}</h5>
                <span class="remove-item">remove</span>
            </div>
            <div>
                <i class="fas fa-chevron-up increase-quantity"></i>
                <p class="item-quantity">${item.quantity}</p>
                <i class="fas fa-chevron-down decrease-quantity"></i>
            </div>
        </div>
        `;
    });

    displayCart = displayCart.join("");
    if (cartItemsContainer) {
      cartItemsContainer.innerHTML = displayCart;
    }
  }

  // Set cart values
  function setCartValues(cartItems) {
    let tempTotal = 0;
    let itemsTotal = 0;
    cartItems.forEach((item) => {
      tempTotal += item.price * item.quantity;
      itemsTotal += item.quantity;
    });
    cartTotal.innerText = parseFloat(tempTotal.toFixed(2));
    // Display items total
    document.querySelector(".cart-items").innerText = itemsTotal;
  }

  // Add to cart functionality
  function foodItemCartBtn() {
    addToCartBtn.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        let id = e.target.dataset.id;
        // Check if the item is already in the cart
        let inCart = cart.find((item) => item.id === id);
        if (inCart) {
          increaseQuantity(id);
        } else {
          fetch("http://your-backend-url/cart/add", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ id: id, quantity: 1 }),
          })
            .then((response) => response.json())
            .then((item) => {
              cart.push(item);
              displayCartItems(cart);
              setCartValues(cart);
            })
            .catch((error) => {
              console.error("Error adding item to cart:", error);
            });
        }
      });
    });
  }

  // Increase quantity
  function increaseQuantity(id) {
    fetch(`http://your-backend-url/cart/increase/${id}`, {
      method: "PATCH",
    })
      .then((response) => response.json())
      .then((item) => {
        displayCartItems(cart);
        setCartValues(cart);
      })
      .catch((error) => {
        console.error("Error increasing item quantity:", error);
      });
  }

  // Decrease quantity
  function decreaseQuantity(id) {
    fetch(`http://your-backend-url/cart/decrease/${id}`, {
      method: "PATCH",
    })
      .then((response) => response.json())
      .then((item) => {
        // Remove item from cart if quantity is zero
        if (item.quantity === 0) {
          removeItem(id);
        } else {
          displayCartItems(cart);
          setCartValues(cart);
        }
      })
      .catch((error) => {
        console.error("Error decreasing item quantity:", error);
      });
  }

  // Remove item from cart
  function removeItem(id) {
    fetch(`http://your-backend-url/cart/remove/${id}`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then((item) => {
        cart = cart.filter((item) => item.id !== id);
        displayCartItems(cart);
        setCartValues(cart);
      })
      .catch((error) => {
        console.error("Error removing item from cart:", error);
      });
  }

  // Clear cart
  function clearCart() {
    fetch("http://your-backend-url/cart/clear", {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then(() => {
        cart = [];
        displayCartItems(cart);
        setCartValues(cart);
      })
      .catch((error) => {
        console.error("Error clearing cart:", error);
      });
  }

  // Cart functionality
  function cartFunctionality() {
    // Get cart items on page load
    getCartItems();

    // Increase quantity event listener
    cartItemsContainer.addEventListener("click", (event) => {
      if (event.target.classList.contains("increase-quantity")) {
        const item = event.target.parentElement.parentElement;
        const itemId = item.dataset.id;
        increaseQuantity(itemId);
      }
    });

    // Decrease quantity event listener
    cartItemsContainer.addEventListener("click", (event) => {
      if (event.target.classList.contains("decrease-quantity")) {
        const item = event.target.parentElement.parentElement;
        const itemId = item.dataset.id;
        decreaseQuantity(itemId);
      }
    });

    // Remove item event listener
    cartItemsContainer.addEventListener("click", (event) => {
      if (event.target.classList.contains("remove-item")) {
        const item = event.target.parentElement.parentElement;
        const itemId = item.dataset.id;
        removeItem(itemId);
      }
    });

    // Clear cart event listener
    clearCartBtn.addEventListener("click", clearCart);
  }

  // Cart functionality
  cartFunctionality();
}

// When Content Loaded
document.addEventListener("DOMContentLoaded", ClientDataFlow);

// // --- Authentication Part ---
// // Sign Up Form ID's -
// const myForm = document.getElementById("main-form");
// const googleSignUp = document.querySelectorAll("#google-signUpIn");
// const githubSignUp = document.querySelectorAll("#github-signUpIn");
// const facebookSignUp = document.querySelectorAll("#facebook-signUpIn");

// // Sign In Form ID's -
// const signInForm = document.getElementById("signIn-form");

// // Sign Up Methods -
// class signUpMethods {
//   // Basic LogIn System
//   builtInSignUp() {
//     const userName = myForm["sign-up-full-name"].value;
//     const email = myForm["sign-up-email"].value;
//     const password = myForm["sign-up-password"].value;
//     const repassword = myForm["sign-up-repassword"].value;
//     const phoneNumber = myForm["sign-up-number"].value;

//     // CheckStuff -
//     if (password != repassword || password === "") {
//       Swal.fire(
//         "Re Entered password is not same as entered password or field empty"
//       );
//     } else if (phoneNumber.length != 10) {
//       Swal.fire("Phone Number is not valid");
//     } else {
//       // Send API request to create user
//       fetch("/signup", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           userName,
//           email,
//           password,
//           phoneNumber,
//         }),
//       })
//         .then((response) => {
//           if (response.ok) {
//             Swal.fire({
//               icon: "success",
//               title:
//                 "Account Created Successfully. Please Log In To order Delicious Cuisine",
//             });
//           } else {
//             throw new Error("Failed to create account");
//           }
//         })
//         .catch((error) => Swal.fire("" + error));
//     }
//   }

//   // Google SignUp Method -
//   googleSignUpIn() {
//     // Send API request for Google sign-in
//     fetch("/google-signin")
//       .then((response) => response.json())
//       .then((data) => {
//         console.log(data.email);
//         this.notifyUser();
//         this.redirectToClientSide();
//       })
//       .catch((error) => Swal.fire("" + error));
//   }

//   // FaceBook SignUp Method -
//   facebookSignUpIn() {
//     // Send API request for Facebook sign-in
//     fetch("/facebook-signin")
//       .then((response) => response.json())
//       .then((data) => {
//         this.notifyUser();
//         this.redirectToClientSide();
//       })
//       .catch((error) => Swal.fire("" + error));
//   }

//   // GitHub SignUp Method -
//   githubSignUpIn() {
//     // Send API request for GitHub sign-in
//     fetch("/github-signin")
//       .then((response) => response.json())
//       .then((data) => {
//         this.notifyUser();
//         this.redirectToClientSide();
//       })
//       .catch((error) => Swal.fire("" + error));
//   }

//   static redirectToClientSide() {
//     window.setTimeout(() => {
//       window.location.replace("client-side.html");
//     }, 500);
//   }

//   // Notify User
//   notifyUser() {
//     window.setTimeout(function () {
//       Swal.fire({
//         icon: "success",
//         title: "Account Signed In Successfully",
//       });
//     }, 1250);
//   }
// }

// // Sign In Methods -
// class signInMethods {
//   // Basic LogIn System
//   builtInSignIn() {
//     const email = document.getElementById("sign-in-email").value;
//     const password = document.getElementById("sign-in-password").value;

//     // Send API request for built-in sign-in
//     fetch("http://localhost:3000/auth/login", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         email,
//         password,
//       }),
//     })
//       .then((response) => {
//         if (response.ok) {
//           Swal.fire({
//             icon: "success",
//             title: "Logged In",
//           });
//           signUpMethods.redirectToClientSide();
//         } else {
//           throw new Error("Failed to log in");
//         }
//       })
//       .catch((error) => {
//         Swal.fire({
//           icon: "error",
//           title: "" + error,
//         });
//       });
//   }
// }

// // When HTML & Other code is done -
// document.addEventListener("DOMContentLoaded", () => {
//   // Sign In Methods -
//   const signIn = new signInMethods();

//   // Main Sign In Form
//   if (signInForm) {
//     signInForm.addEventListener("submit", (e) => {
//       e.preventDefault();
//       signIn.builtInSignIn();
//     });
//   }
// });
// // When HTML & Other code is done -
// document.addEventListener("DOMContentLoaded", () => {
//   // Sign Up Mehtods -
//   const signUp = new signUpMethods();

//   // Main Sign Up Form
//   if (myForm) {
//     myForm.addEventListener("submit", (e) => {
//       e.preventDefault();
//       signUp.builtInSignUp();
//     });
//   }

//   // Google Sign Up Form
//   if (googleSignUp) {
//     googleSignUp.forEach((element) => {
//       element.addEventListener("click", (e) => {
//         e.preventDefault();
//         signUp.googleSignUpIn();
//       });
//     });
//   }

//   // GitHub Sign Up Form
//   if (githubSignUp) {
//     githubSignUp.forEach((element) => {
//       element.addEventListener("click", (e) => {
//         e.preventDefault();
//         signUp.githubSignUpIn();
//       });
//     });
//   }

//   // Facebook Sign Up Form
//   if (facebookSignUp) {
//     facebookSignUp.forEach((element) => {
//       element.addEventListener("click", (e) => {
//         e.preventDefault();
//         signUp.facebookSignUpIn();
//       });
//     });
//   }

//   // Sign In Methods -
//   const signIn = new signInMethods();
//   if (signInForm) {
//     // Main Sign In Form
//     signInForm.addEventListener("submit", (e) => {
//       e.preventDefault();
//       signIn.builtInSignIn();
//     });
//   }

//   // LogOut User -
//   const logout = document.querySelectorAll("#userlogout");
//   if (logout) {
//     logout.forEach((btn) => {
//       btn.addEventListener("click", (e) => {
//         e.preventDefault();
//         Swal.fire({
//           icon: "success",
//           title: "Logged Out Successfully",
//         });
//         // Send API request to log out
//         fetch("/logout").then(() => {
//           window.location.replace("index.html");
//         });
//       });
//     });
//   }
// });

// // Makes User ID Through EmailID Provided By User
// let userDataID = "";
// function makeUserDataID(userEmailID) {
//   // let userDataID = '';
//   for (i = 0; userEmailID.length; i++) {
//     if (userEmailID[i] != "@") {
//       userDataID = userDataID + userEmailID[i];
//     } else {
//       break;
//     }
//   }
//   return userDataID;
// }
