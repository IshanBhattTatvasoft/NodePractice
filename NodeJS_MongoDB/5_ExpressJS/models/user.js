import { ObjectId } from "mongodb";
import dbModule from "../utils/database.js";
const { getDb } = dbModule;

class User {
  constructor(username, email, cart, id) {
    this.username = username;
    this.email = email;
    this.cart = cart; // {items: []}
    this._id = id;
  }

  save() {
    const db = getDb();
    return db.collection("users").insertOne(this);
  }

  addToCart(productId) {
    // findIndex() returns the index of the first item in items array which has the same _id as the given product._id. If no such product is found, it returns -1
    const cartProductIndex = this.cart.items.findIndex((cp) => {
      // NOTE: == only compares values but === compares and checks the datatypes too. So, _id is not a string so we need to convert it into the string and then compare it using ===
      return cp.productId.toString() === productId.toString();
    });
    let newQuantity = 1;
    const updatedCartItems = [...this.cart.items];

    const pId =
      typeof this._id === "string"
        ? ObjectId.createFromHexString(productId)
        : this._id;

    // if product is already in cart
    if (cartProductIndex >= 0) {
      newQuantity = this.cart.items[cartProductIndex].quantity + 1;
      updatedCartItems[cartProductIndex].quantity = newQuantity;
    }
    // if product does not exist in cart, add it with quantity = 1
    else {
      updatedCartItems.push({ productId: pId, quantity: newQuantity });
    }

    const updatedCart = { items: updatedCartItems };

    const db = getDb();
    console.log("ProductId : " + pId);
    // find user whose id matches with this._id and update the cart property of that user with the updatedCart
    return db
      .collection("users")
      .updateOne({ _id: pId }, { $set: { cart: updatedCart } });
  }

  getCart() {
    const db = getDb();
    // get all the productIds from the items object present inside the cart
    const productIds = this.cart.items.map((i) => {
      return i.productId;
    });
    // find() method returns a cursor to the documents whose _id are present in the productIds array
    return db
      .collection("products")
      .find({ _id: { $in: productIds } })
      .toArray()
      .then((products) => {
        return products.map((p) => {
          return {
            ...p,
            quantity: this.cart.items.find((i) => {
              return i.productId.toString() === p._id.toString();
            }).quantity,
          };
        });
      })
      .catch((err) => console.log(err));
  }

  deleteItemFromCart(productId) {
    // gets only those cart items whose productId matches with the one passed in the argument
    const updatedCartItems = this.cart.items.filter((item) => {
      return item.productId.toString() !== productId.toString();
    });
    const db = getDb();
    return db
      .collection("users")
      .updateOne(
        { _id: ObjectId.createFromHexString(this._id) },
        { $set: { cart: { items: updatedCartItems } } }
      );
  }

  addOrder() {
    const db = getDb();
    // get cart, create order, insert that order in the orders collection and empty the existing cart
    return this.getCart()
      .then((products) => {
        const order = {
          items: products,
          user: {
            _id: ObjectId.createFromHexString(this._id),
            name: this.name,
          },
        };
        return db.collection("orders").insertOne(order);
      })
      .then((result) => {
        this.cart = { items: [] };
        return db
          .collection("users")
          .updateOne(
            { _id: ObjectId.createFromHexString(this._id) },
            { $set: { cart: { items: [] } } }
          );
      });
  }

  getOrders() {
    const db = getDb();
    return db
      .collection("orders")
      .find({ "user._id": ObjectId.createFromHexString(this._id) })
      .toArray();
  }

  static findById(userId) {
    const db = getDb();
    return db
      .collection("users")
      .findOne({ _id: ObjectId.createFromHexString(userId) })
      .then((user) => {
        console.log(user);
        return user;
      })
      .catch((err) => console.log(err));
  }
}

export default User;
