import dbModule from "../utils/database.js";
import mongodb, { ObjectId } from "mongodb";
const { mongoDb, getDb } = dbModule;

class Product {
  constructor(title, price, description, imageUrl, id, userId) {
    console.log("Length of id in constructor : " + id);
    this.title = title;
    this.price = price;
    this.description = description;
    this.imageUrl = imageUrl;
    this._id = id ? ObjectId.createFromHexString(id.toString()) : null;
    this.userId = userId;
  }

  save() {
    const db = getDb();
    let dbOp;
    if (this._id) {
      console.log("this.id: " + this._id);
      // update the product

      // updateOne() method's first argument is used to specify which document we need to update and second argument specifies what do we need to update (here we have written only 'this' but we can also write like: {$set: {title: this.title and so on...}})
      // $set is like a reserved keyword for MongoDB which is used when we want to update the data
      dbOp = db
        .collection("products")
        .updateOne({ _id: this._id }, { $set: this });
    } else {
      // add new product
      dbOp = db.collection("products").insertOne(this);
    }

    return dbOp
      .then((result) => {
        console.log("Product saved:", result);
        return result;
      })
      .catch((err) => {
        console.error("Error saving product:", err);
      });
  }

  static fetchAll() {
    // to get only the roducts whose title is A Book, we write find({title: 'A Book})

    //find() method returns a cursor instead of a promise
    // cursor is an object provided to go through all the objects because we do not want all the millions of objects returned by the find()
    // use toArray() when there are only few records, else we can use other thing like pagination
    const db = getDb();
    return db
      .collection("products")
      .find()
      .toArray()
      .then((products) => {
        console.log(products);
        return products;
      })
      .catch((err) => {
        console.log(err);
      });
  }

  static findById(prodId) {
    console.log("Product Id : " + prodId);
    const db = getDb();
    return db
      .collection("products")
      .findOne({ _id: ObjectId.createFromHexString(prodId) })
      .then((product) => {
        console.log(product);
        return product;
      })
      .catch((err) => {
        console.log(err);
      });
  }

  static deleteById(prodId) {
    const db = getDb();
    return db
      .collection("products")
      .deleteOne({ _id: ObjectId.createFromHexString(prodId) })
      .then((result) => {
        console.log("deleted");
      })
      .catch((err) => {
        console.log(err);
      });
  }
}

export default Product;
