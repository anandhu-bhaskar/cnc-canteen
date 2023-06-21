const orders = [
  {
    orderId: "1",
    customerName: "Emma Johnson",
    status: "Pending",
    items: [
      {
        itemId: "1",
        title: "Margherita Pizza",
        category: "Pizza",
        price: "100",
        calories: "200 - 250 Kcal",
        image: {
          fields: { file: { url: "assets/images/margherita-pizza.jpg" } },
        },
        type: "veg",
      },
      {
        itemId: "12",
        title: "French Fries",
        category: "Starters",
        price: "50",
        calories: "200 - 300 Kcal",
        image: { fields: { file: { url: "assets/images/french-fries.jpg" } } },
        type: "veg",
      },
    ],
    payment: {
      paid: false,
      method: "Cash on Delivery",
    },
    statusUpdates: [
      {
        status: "Pending",
        timestamp: new Date(),
        elapsed: 0,
      },
    ],
  },
  {
    orderId: "2",
    customerName: "John Smith",
    status: "Processing",
    items: [
      {
        itemId: "4",
        title: "Cheeseburger",
        category: "Burger",
        price: "80",
        calories: "300 - 350 Kcal",
        image: { fields: { file: { url: "assets/images/cheeseburger.jpg" } } },
        type: "non-veg",
      },
      {
        itemId: "17",
        title: "Hot Chocolate",
        category: "Beverages",
        price: "35",
        calories: "230 - 280 Kcal",
        image: { fields: { file: { url: "assets/images/hot-chocolate.jpg" } } },
        type: "veg",
      },
    ],
    payment: {
      paid: true,
      method: "PayPal",
    },
    statusUpdates: [
      {
        status: "Processing",
        timestamp: new Date(),
        elapsed: 0,
      },
    ],
  },
  {
    orderId: "3",
    customerName: "Sophia Williams",
    status: "Delivered",
    items: [
      {
        itemId: "8",
        title: "Veggie Wrap",
        category: "Wraps",
        price: "90",
        calories: "250 - 300 Kcal",
        image: { fields: { file: { url: "assets/images/veggie-wrap.jpg" } } },
        type: "veg",
      },
      {
        itemId: "21",
        title: "Tea",
        category: "Beverages",
        price: "10",
        calories: "155 - 225 Kcal",
        image: { fields: { file: { url: "assets/images/tea.jpg" } } },
        type: "veg",
      },
    ],
    payment: {
      paid: true,
      method: "PayPal",
    },
    statusUpdates: [
      {
        status: "Processing",
        timestamp: new Date("2023-06-06T12:00:00"),
        elapsed: 0,
      },
      {
        status: "Out for Delivery",
        timestamp: new Date("2023-06-06T13:30:00"),
        elapsed: 90,
      },
      {
        status: "Delivered",
        timestamp: new Date("2023-06-06T14:15:00"),
        elapsed: 165,
      },
    ],
  },
  {
    orderId: "4",
    customerName: "Oliver Brown",
    status: "Cancelled",
    items: [
      {
        itemId: "11",
        title: "Pepperoni Pizza",
        category: "Pizza",
        price: "120",
        calories: "300 - 350 Kcal",
        image: {
          fields: { file: { url: "assets/images/pepperoni-pizza.jpg" } },
        },
        type: "non-veg",
      },
      {
        itemId: "14",
        title: "Onion Rings",
        category: "Starters",
        price: "60",
        calories: "200 - 250 Kcal",
        image: { fields: { file: { url: "assets/images/onion-rings.jpg" } } },
        type: "veg",
      },
    ],
    payment: {
      paid: false,
      method: "Cash on Delivery",
    },
    statusUpdates: [
      {
        status: "Cancelled",
        timestamp: new Date(),
        elapsed: 0,
      },
    ],
  },
];

module.exports = orders;
