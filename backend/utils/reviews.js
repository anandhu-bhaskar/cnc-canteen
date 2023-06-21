const User = require("../models/userSchema");
const Chance = require("chance");

// Create a new instance of Chance
const chance = new Chance();

// Function to generate random reviewer names
const getRandomReviewer = async () => {
  try {
    const users = await User.find();
    const randomUser = chance.pickone(users);
    return {
      reviewer: randomUser.name,
      reviewer_id: randomUser._id.toString(),
    };
  } catch (error) {
    console.error("Error getting random reviewer:", error);
  }
};

// Generate dummy review data
const generateReviews = async () => {
  const reviews = [
    {
      rating: 4,
      comment: "Delicious burger!",
      menuItemId: 1,
    },
    {
      rating: 5,
      comment: "Best sandwich I've ever had!",
      menuItemId: 2,
    },
    {
      rating: 3,
      comment: "Decent wrap, but could be better.",
      menuItemId: 3,
    },
    {
      rating: 4,
      comment: "Great pizza, loved the toppings!",
      menuItemId: 4,
    },
    {
      rating: 5,
      comment: "Excellent service and quality. Will order again!",
      menuItemId: 2,
    },
    {
      rating: 4,
      comment: "The burger was juicy and flavorful.",
      menuItemId: 1,
    },
    {
      rating: 3,
      comment: "The sandwich was average, nothing special.",
      menuItemId: 2,
    },
    {
      rating: 5,
      comment: "The veg club sandwich was packed with fresh veggies. Loved it!",
      menuItemId: 3,
    },
    {
      rating: 4,
      comment: "The cheese masala sandwich had a great blend of flavors.",
      menuItemId: 4,
    },
    {
      rating: 5,
      comment: "The veg Schezuan sandwich was spicy and delicious.",
      menuItemId: 5,
    },
    {
      rating: 4,
      comment: "The masala Maggie was a perfect comfort food.",
      menuItemId: 6,
    },
    {
      rating: 5,
      comment: "The Schezuan Maggie had a unique flavor. Loved it!",
      menuItemId: 7,
    },
    {
      rating: 4,
      comment: "The veg Maggie was simple yet tasty.",
      menuItemId: 8,
    },
    {
      rating: 3,
      comment: "The cheese garlic Maggie had a strong garlic flavor.",
      menuItemId: 9,
    },
    {
      rating: 5,
      comment: "The cheese veg Maggie was a delightful combination.",
      menuItemId: 10,
    },
    {
      rating: 4,
      comment: "The masala fries were crispy and flavorful.",
      menuItemId: 11,
    },
    {
      rating: 5,
      comment: "The Schezuan fries had a spicy kick. Loved it!",
      menuItemId: 12,
    },
    {
      rating: 4,
      comment: "The cheese fries were cheesy and delicious.",
      menuItemId: 13,
    },
    {
      rating: 3,
      comment: "The red sauce pasta was a bit too tangy for my liking.",
      menuItemId: 14,
    },
    {
      rating: 5,
      comment: "The white sauce pasta was creamy and heavenly.",
      menuItemId: 15,
    },
    {
      rating: 4,
      comment: "The mixed sauce pasta had a perfect blend of flavors.",
      menuItemId: 16,
    },
    {
      rating: 5,
      comment: "The veg lasagna was absolutely delicious!",
      menuItemId: 17,
    },
    {
      rating: 4,
      comment: "The garlic bread was perfectly toasted and garlicky.",
      menuItemId: 18,
    },
    {
      rating: 3,
      comment: "The cheesy garlic bread lacked sufficient cheese.",
      menuItemId: 19,
    },
    {
      rating: 5,
      comment: "The stuffed garlic bread was a flavor explosion.",
      menuItemId: 20,
    },
    {
      rating: 4,
      comment: "The chocolate shake was rich and creamy.",
      menuItemId: 21,
    },
    {
      rating: 5,
      comment: "The strawberry shake was refreshing and delightful.",
      menuItemId: 22,
    },
    {
      rating: 4,
      comment: "The vanilla shake had a smooth and creamy texture.",
      menuItemId: 23,
    },
    {
      rating: 3,
      comment: "The mango shake was a bit too sweet for my taste.",
      menuItemId: 24,
    },
    {
      rating: 5,
      comment: "The butterscotch shake was a perfect blend of flavors.",
      menuItemId: 25,
    },
  ];

  const generatedReviews = [];

  try {
    for (const review of reviews) {
      const randomReviewer = await getRandomReviewer();
      const modifiedReview = {
        ...review,
        reviewer: randomReviewer.reviewer,
        reviewer_id: randomReviewer.reviewer_id,
      };
      generatedReviews.push(modifiedReview);
    }
    return generatedReviews;
  } catch (error) {
    console.error("Error generating reviews:", error);
  }
};

module.exports = generateReviews;
