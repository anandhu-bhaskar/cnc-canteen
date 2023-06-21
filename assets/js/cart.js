document.addEventListener("DOMContentLoaded", function () {
  // Inside Cart Container
  const cartItemsContainer = document.querySelector(".cart-items-container");
  const cartTotal = document.querySelector(".cart-total");
  const clearCartBtn = document.querySelector(".clear-cart");
  const cartCounter = document.querySelector(".cart-items");
  const userData = JSON.parse(localStorage.getItem("user"));

  // Access user properties
  const userId = userData.user.user_id;
  const userEmail = userData.user.email;
  const cart_id = userData.cart.cart_id;
  console.log(userData.cart.cart_id);

  // Cart Functionality
  function ClientDataFlow(userId) {
    // Update cart counter
    function updateCartCounter(cartItems) {
      console.log("Updating cart counter:", cartItems);
      cartCounter.innerText = cartItems.length;
    }

    // Update cart data and UI
    function updateCart() {
      console.log("Updating cart...");
      // Send request to update cart
      fetch(`http://localhost:3000/cart/${userId}`)
        .then((response) => response.json())
        .then((cartData) => {
          console.log("Cart Data:", cartData);
          const cartItems = cartData.cart.items;
          setCartValues(cartItems);
          displayCartItems(cartItems);
          updateCartCounter(cartItems);
        })
        .catch((error) => {
          console.error("Error updating cart:", error);
        });
    }

    // Get the cart items from the backend
    function getCartItems() {
      console.log("Getting Cart");

      fetch(`http://localhost:3000/cart/${userId}`)
        .then((response) => response.json())
        .then((cartData) => {
          console.log("Cart Data:", cartData);
          const cartItems = cartData.cart.items;
          setCartValues(cartItems);
          displayCartItems(cartItems);
          updateCartCounter(cartItems);
        })
        .catch((error) => {
          console.error("Error fetching cart items:", error);
        });
    }

    function addToCart(itemId) {
      console.log("Adding item to cart:", itemId);

      fetch(`http://localhost:3000/cart/${userId}`, {
        method: "POST",
        body: JSON.stringify({ itemId }),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((cartData) => {
          console.log("********************************");
          updateCart(); // Call updateCart function to update the cart
          console.log("Updating cart counter2...");
          updateCartCounter(cartData.cart.items); // Call updateCartCounter function to update the cart counter
        })
        .catch((error) => {
          console.error("Error adding item to cart:", error);
        });
    }

    // Remove item from cart
    function removeFromCart(itemId) {
      console.log("Removing item from cart:", itemId);
      // Send request to remove item from cart
      fetch(`http://localhost:3000/cart/${userId}/${itemId}`, {
        method: "DELETE",
      })
        .then((response) => response.json())
        .then((cartData) => {
          console.log("Cart Data:", cartData);
          updateCart();
        })
        .catch((error) => {
          console.error("Error removing item from cart:", error);
        });
    }

    // Display cart items
    function displayCartItems(cartItems) {
      console.log("Displaying Cart Items:", cartItems);
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

      // Add event listeners to remove item buttons
      const removeButtons = document.querySelectorAll(".remove-item");
      removeButtons.forEach((button) => {
        button.addEventListener("click", (event) => {
          const itemId = event.target.closest(".cart-item").dataset.id;
          removeFromCart(itemId);
        });
      });
    }

    // Set cart values
    function setCartValues(cartItems) {
      console.log("Setting Cart Values:", cartItems);
      let tempTotal = 0;
      let itemsTotal = 0;
      cartItems.forEach((item) => {
        tempTotal += item.price * item.quantity;
        itemsTotal += item.quantity;
      });
      console.log("Temporary Total:", tempTotal);
      console.log("Items Total:", itemsTotal);
      console.log("Cart Total Element:", cartTotal);
      cartTotal.innerText = parseFloat(tempTotal.toFixed(2));
      console.log("Cart Total:", cartTotal.innerText);
      console.log("Cart Total Element (after setting):", cartTotal);
    }

    // Clear cart
    function clearCart() {
      if (clearCartBtn) {
        clearCartBtn.addEventListener("click", () => {
          console.log("Clearing Cart");
          // Send request to clear cart
          fetch(`http://localhost:3000/cart/${userId}`, {
            method: "DELETE",
          })
            .then((response) => response.json())
            .then((cartData) => {
              console.log("Cart Data:", cartData);
              updateCart();
            })
            .catch((error) => {
              console.error("Error clearing cart:", error);
            });
        });
      }
    }

    // Process checkout
    function processCheckout(paymentMethod) {
      console.log("Processing checkout...");

      fetch(`http://localhost:3000/cart/checkout/`, {
        method: "POST",
        body: JSON.stringify({ cart_id, paymentMethod }),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Checkout Data:", data);
          handleCheckoutResponse(data);
        })
        .catch((error) => {
          console.error("Error processing checkout:", error);
          Swal.fire({
            icon: "error",
            title: "Checkout Failed",
            text: "An error occurred during the checkout process. Please try again later.",
          });
        });
    }

    // Handle the checkout response
    function handleCheckoutResponse(response) {
      if (response.approvalUrl) {
        // Redirect to the approval URL
        window.location.href = response.approvalUrl;
      } else if (response.order) {
        console.log("response orderrrrrrrrrrrrrrrrrr", response.order);
        // Display the order summary
        Swal.fire({
          icon: "success",
          title: "Order Placed Successfully",
          html: getOrderSummaryHtml(response.order),
          showCancelButton: true,
          confirmButtonText: "Go to Orders",
          cancelButtonText: "OK",
        }).then((result) => {
          if (result.isConfirmed) {
            // Go to the orders page
            window.location.href = "order.html";
          } else {
            // Hide the popup
            Swal.close();
          }
          // Clear the cart and update the UI
          updateCart();
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Checkout Failed",
          text: "An error occurred during the checkout process. Please try again later.",
        });
      }
    }

    // Get the HTML for the order summary
    function getOrderSummaryHtml(order) {
      console.log("orderrrrrrrrrrrrrrrrrrrrrrrrrrrrr", order);
      // Construct the HTML for the order summary
      let html = `
    <p><strong>Order ID:</strong> ${order.orderId}</p>
    <p><strong>Payment Method:</strong> ${order.payment.method}</p>
    <p><strong>Order Total:</strong> $${order.orderTotal}</p>
    <p><strong>Items:</strong></p>
    <ul>
  `;

      // Iterate over the items in the order and add them to the HTML
      order.items.forEach((item) => {
        html += `<li>${item.title} - $${item.price.toFixed(2)}</li>`;
      });

      html += "</ul>";

      return html;
    }

    // Public methods
    return {
      init: function () {
        console.log("Initializing cart functionality");
        getCartItems();
        clearCart();
      },
      addToCart: function (itemId) {
        addToCart(itemId);
      },
      updateCart: updateCart,
      processCheckout: processCheckout,
    };
  }

  // Initialize cart functionality
  const clientDataFlow = ClientDataFlow(userId);
  clientDataFlow.init();

  // Add event listeners to "Add to Cart" buttons
  document.addEventListener("click", function (event) {
    if (event.target.matches(".add-to-cart")) {
      const foodItem = event.target.closest(".food-item");
      const itemId = foodItem.dataset.id;
      clientDataFlow.addToCart(itemId);
    }
  });

  // Add event listener to "Order Now" button
  const orderNowBtn = document.getElementById("order-now-btn");
  if (orderNowBtn) {
    orderNowBtn.addEventListener("click", () => {
      // Open the payment popup
      openPaymentPopup();
    });
  }

  // Open the payment popup
  function openPaymentPopup() {
    // Create the payment popup element
    const paymentPopup = document.createElement("div");
    paymentPopup.classList.add("payment-popup");
    paymentPopup.innerHTML = `
        <div class="payment-popup-content">
          <h2>Select Payment Method</h2>
          <div class="payment-options">
            <label for="paypal">
              <input type="radio" id="paypal" name="paymentMethod" value="1">
              <img src="../assets/images/paypal-logo.png" alt="PayPal">
              <span>PayPal</span>
            </label>
            <label for="cash-on-delivery">
              <input type="radio" id="cash-on-delivery" name="paymentMethod" value="2">
              <img src="../assets/images/paypal-logo.png" alt="Cash on Delivery">
              <span>Cash on Delivery</span>
            </label>
          </div>
          <button id="submit-payment-btn">Submit</button>
        </div>
      `;

    // Add event listener to the submit button
    const submitPaymentBtn = paymentPopup.querySelector("#submit-payment-btn");
    if (submitPaymentBtn) {
      submitPaymentBtn.addEventListener("click", () => {
        // Get the selected payment method
        const paymentMethod = paymentPopup.querySelector(
          'input[name="paymentMethod"]:checked'
        ).value;

        // Process the checkout
        clientDataFlow.processCheckout(paymentMethod);

        // Close the payment popup
        paymentPopup.remove();
      });
    }

    // Add the payment popup to the document body
    document.body.appendChild(paymentPopup);
  }
});
