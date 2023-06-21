// Function to generate a unique cart ID
function generateUniqueCartId() {
  // Implement your logic to generate a unique cart ID here
  // This can be a combination of random characters, timestamps, or any other unique identifier generation mechanism

  // Example implementation using a random string of alphanumeric characters
  const chars =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const cartIdLength = 10;
  let cartId = "";

  for (let i = 0; i < cartIdLength; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    cartId += chars.charAt(randomIndex);
  }

  return cartId;
}

module.exports = {
  generateUniqueCartId,
};
