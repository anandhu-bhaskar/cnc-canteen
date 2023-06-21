function createRadioOption(name, value, text) {
  const radioContainer = document.createElement("div");
  radioContainer.classList.add("radio-container");

  const radio = document.createElement("input");
  radio.type = "radio";
  radio.name = name;
  radio.value = value;

  const label = document.createElement("label");
  label.textContent = text;

  radioContainer.appendChild(radio);
  radioContainer.appendChild(label);

  return radioContainer;
}

function displayAddItemPopup() {
  // Create the popup box elements
  const popupBox = document.createElement("div");
  popupBox.classList.add("popup-box");

  const title = document.createElement("h2");
  title.textContent = "Add item";
  title.classList.add("popup-title");

  const form = document.createElement("form");
  form.classList.add("popup-form");

  const categoryLabel = document.createElement("label");
  categoryLabel.textContent = "Category:";
  categoryLabel.classList.add("popup-label");

  const vegRadio = createRadioOption("category", "veg", "Veg");
  const nonVegRadio = createRadioOption("category", "non-veg", "Non-Veg");

  const itemNameLabel = document.createElement("label");
  itemNameLabel.textContent = "Item Name:";
  itemNameLabel.classList.add("popup-label");

  const itemNameInput = document.createElement("input");
  itemNameInput.setAttribute("type", "text");
  itemNameInput.classList.add("popup-input");

  const quantityLabel = document.createElement("label");
  quantityLabel.textContent = "Quantity:";
  quantityLabel.classList.add("popup-label");

  const quantityInput = document.createElement("input");
  quantityInput.setAttribute("type", "text");
  quantityInput.classList.add("popup-input");

  const priceLabel = document.createElement("label");
  priceLabel.textContent = "Price:";
  priceLabel.classList.add("popup-label");

  const priceInput = document.createElement("input");
  priceInput.setAttribute("type", "text");
  priceInput.classList.add("popup-input");

  const imageLabel = document.createElement("label");
  imageLabel.textContent = "Image:";
  imageLabel.classList.add("popup-label");

  const imageInput = document.createElement("input");
  imageInput.setAttribute("type", "file");
  imageInput.classList.add("popup-input");

  const submitButton = document.createElement("button");
  submitButton.textContent = "Submit";
  submitButton.classList.add("popup-button");

  // Append elements to the form
  form.appendChild(categoryLabel);
  form.appendChild(vegRadio);
  form.appendChild(nonVegRadio);
  form.appendChild(itemNameLabel);
  form.appendChild(itemNameInput);
  form.appendChild(quantityLabel);
  form.appendChild(quantityInput);
  form.appendChild(priceLabel);
  form.appendChild(priceInput);
  form.appendChild(imageLabel);
  form.appendChild(imageInput);
  form.appendChild(submitButton);

  // Append elements to the popup box
  popupBox.appendChild(title);
  popupBox.appendChild(form);

  // Display the popup box
  Swal.fire({
    html: popupBox,
    showCancelButton: true,
    showConfirmButton: false,
    cancelButtonText: "Close",
    customClass: {
      popup: "add-item-popup",
    },
  });
}
