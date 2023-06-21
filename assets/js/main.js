const userData = JSON.parse(localStorage.getItem("user"));

// Access user properties
const userId = userData.id;
const userEmail = userData.email;
console.log("Accessing user properties: " + JSON.stringify(userData));

// Menu Section -
const menuSection = document.querySelector(".menu-section");
// Menu Filter Buttons -
const menuFilterBtns = document.querySelectorAll("#menu-filter");

// Function to fetch menu items from API
function fetchMenuItems() {
  const apiUrl = "http://localhost:3000/menu"; // Replace with your API endpoint URL

  return fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      return data;
    })
    .catch((error) => {
      console.error("Error fetching menu items:", error);
    });
}

// Function to filter menu items based on category
function filtering(addToCartBtn, menuItems) {
  // Menu Items Filteration
  menuFilterBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const Category = e.currentTarget.dataset.id;

      // Current Btn Indication -
      btn.classList.add("current");
      menuFilterBtns.forEach((i) => {
        if (i.dataset.id != Category) {
          i.classList.remove("current");
        }
      });

      // Filtering Menu Items -
      addToCartBtn.forEach((item) => {
        let id = item.dataset.id;
        let menuItemClass =
          item.parentElement.parentElement.parentElement.parentElement;
        if (Category === menuItems[id - 1].category) {
          menuItemClass.classList.remove("display-none");
          menuItemClass.classList.add("show");
        }
        if (Category != menuItems[id - 1].category) {
          menuItemClass.classList.add("display-none");
        }
        if (Category === "all") {
          menuItemClass.classList.remove("display-none");
          menuItemClass.classList.add("show");
        }
      });
    });
  });
}

// Function To Create Menu Cards & Add to HTML
function displayMenuItems(menuItems) {
  let displayMenu = menuItems.map(function (item) {
    // Extract the JPEG name from the URL
    const imageUrl = item.image;
    const jpegName = imageUrl.substring(imageUrl.lastIndexOf("/") + 1);
    // Construct the local directory path based on the JPEG name
    const localImagePath = `../assets/images/${jpegName}`;
    return `
        <article class="menu-item">
            <img src="${localImagePath}" loading="lazy" alt="Product image">
            <div class="item-info">
            <figure>
                <h2>${item.title}</h2>
                <div class="item-category">${item.category}</div>
                <div class="flex" style="margin-top: 10px;">
                    <i class="fas fa-fire"></i>
                    <p>${item.calories}</p>
                </div>
            </figure>
            <hr style="margin: 10px 0;">
            <div class="menu-cart-functionality">
                <div class="price">&#8377;${item.price}</div>
                <div class="cart-btn-container">
                    <button class="bag-btn" id="add-to-cart-btn" data-id=${item.id}>Add to Cart</i></button>
                </div>
            </div>
            </div>
        </article>
        `;
  });

  displayMenu = displayMenu.join("");
  if (menuSection) {
    menuSection.innerHTML = displayMenu;
  }
}

// ---------------- Cart Functioning ----------------
// Inside Cart Container
const cartItemsContainer = document.querySelector(".cart-items-container");
// Nav Cart Items Indicator
const cartItems = document.querySelector(".cart-items");
// Total Bill
const cartTotal = document.querySelector(".cart-total");

// Clear Cart Btn
const clearCart = document.querySelector(".clear-cart");

// Clear Cart Btn
const checkOutBtn = document.querySelector(".check-out");

// Nav Cart btn Values
const cartValues = document.querySelectorAll("#cart-values");

// Item Quantity -
var quantity = 1;

// Cart
var addItem = [];

// Function to fetch menu items from API and display them
function fetchAndDisplayMenuItems() {
  fetchMenuItems()
    .then((data) => {
      const menuItems = data;
      displayMenuItems(menuItems);
      const addToCartBtn = document.querySelectorAll("#add-to-cart-btn");
      filtering(addToCartBtn, menuItems);

      // Add event listener to add-to-cart buttons
      addToCartBtn.forEach((btn) => {
        btn.addEventListener("click", () => {
          // console.log(data);
          const itemId = parseInt(btn.dataset.id);
          console.log(itemId);
          console.log(menuItems);
          const selectedItem = menuItems.find((item) => item.id === itemId);

          // Call your API endpoint to add the item to the cart
          addToCart(selectedItem, userData);
        });
      });
    })
    .catch((error) => {
      console.error("Error fetching menu items:", error);
    });
}

// Call the fetchAndDisplayMenuItems function
fetchAndDisplayMenuItems();

// Add event listener to add-to-cart buttons
// Add event listener to add-to-cart buttons
// addToCartBtn.forEach((btn) => {
//   btn.addEventListener("click", () => {
//     const itemId = btn.dataset.id;
//     const selectedItem = menuItems.find((item) => item.id === itemId);

//     // Call your API endpoint to add the item to the cart
//     addToCart(selectedItem, userData); // Pass the userData object here
//   });
// });

function addToCart(item, userData) {
  console.log(userData);
  // Check if user data and cart_id are available
  if (userData && userData.cart && userData.cart.cart_id) {
    const cartId = userData.cart.cart_id;
    const user_id = userData.user.user_id;
    console.log("Calling API: " + cartId);
    console.log("Calling API: " + userData);
    const apiUrl = `http://localhost:3000/cart`; // Replace with your API endpoint URL

    // Create the payload for the API request
    const payload = {
      cart_id: cartId,
      user_id: user_id,
      item: {
        id: item.id,
        title: item.title,
        category: item.category,
        price: item.price,
        calories: item.calories,
        image: item.image,
        type: item.type,
      },
    };

    fetch(apiUrl, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((response) => response.json())
      .then((data) => {
        // Handle the response from the API if needed
        console.log("Item added to cart:", data);
      })
      .catch((error) => {
        console.error("Error adding item to cart:", error);
      });
  } else {
    console.error("User data or cart_id is missing");
  }
}
