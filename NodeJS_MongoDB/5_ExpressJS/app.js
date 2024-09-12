// import { createServer } from 'http';
import adminRoutes from "./routes/admin.js";
import shopRoutes from "./routes/shop.js";
import rootDir from "./utils/path.js";
import errorController from "./controllers/error.js";
// import sequelize from "./utils/database.js";
import Product from "./models/product.js";
import User from "./models/user.js";
// import Cart from "./models/cart.js";
// import CartItem from "./models/cart-item.js";
// import Order from "./models/order.js";
// import OrderItem from "./models/order-item.js";
import dbModule from "./utils/database.js";
const { mongoConnect, getDb } = dbModule;

import express from "express";
import bodyParser from "body-parser";
import path, { extname } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { engine } from "express-handlebars";
// import {ejs} from 'ejs';

const app = express();
const __dirname = path.resolve();
// registers a middleware and it parses the body of request
app.use(bodyParser.urlencoded({ extended: false }));

// use handlebars
// app.engine('hbs', engine({
//     extname: '.hbs',
//     defaultLayout: 'main-layout',  // Set the default layout
//     layoutsDir: path.join(__dirname, 'views', 'layouts'), // Layouts directory
// }));
// app.set('view engine', 'hbs');

// set and use pug template engine
// app.set('view engine', 'pug');

app.set("view engine", "ejs");

// app.set('views', 'views'); // only needed when the views is in other folder

// incoming request goes through bunch of functions by expressjs
// in expressjs, we can add certain third party packages which gives such middleware functions and hence gets plugged with expressjs to give more functionalities

// use method allows to add new middleware function
// below function gets executed for every upcoming request
// next is the function which needs to be executed to allow the request to travel into the next middleware
// app.use((req, res, next) => {
//     console.log('In the middleware');
//     next();  call next to allow request to go into another middleware and hence, other use() function is called
// });

// app.use((req, res, next) => {
// console.log('In the second middleware');
// res.send('<h1>Hello from ExpressJS</h1>') // instead of res.setHeadear and res.write methods, express provides send method
// by default, send method sets content-type as text/html
// });

// Example: if we want to execute certain code whose path starts with '/' after the domain (although all paths start with '/'), then we can write:
// NOTE: Order is important while writing such functions because control goes from top to bottom

// use the route containing the '/' path at the end
// now if we only write localhost:3000/add-product, it will open not found page. so, we must write localhost:3000/admin/add-product
app.use(express.static(path.join(rootDir, "public")));
/* 1. this is a middleware function
   2. when the server starts succesfully, the code below which is sequelize.sync() is executed first.
   3. after that, this middleware function is only registered but not executed
   4. it would be executed only for incoming requests because at that time only, we need to care about the user who has made the request and this can be done using User.findByPk()*/
app.use((req, res, next) => {
  //   console.log("Middleware reached");
  User.findById('66d5b674bff86aae953367d6')
    .then((user) => {
      // if (!user) {
      //   console.error("User not found");
      // }
      // store user in the request so that we can fetch the requestId whenever needed
      req.user = new User(user.name, user.email, user.cart, user._id);
      //   console.log("req.user.createProduct:", req.user.createProduct); // Check if method is available
      next();
    })
    .catch((err) => console.log(err));
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);

// app.use((req, res, next) => {
//   // in the below code, we pass pageTitle to the 404 page. So, the way in which we pass the data to the templating engine does not depend upon which templating engine we are using (pug, handlebars or ejs)
//   res.render("404", {
//     pageTitle: "Page Not Found",
//     // layout: false,
//     path: ''
// });
// });

app.use(errorController.get404);

mongoConnect(() => {
  app.listen(3000);
});

// // a user can create or offer a product. so, a product belongs to a single user
// // if a user is deleted, all the connected products should also be deleted
// Product.belongsTo(User, { constraints: true, onDelete: "CASCADE" });

// // inversely, a user can create or offer many products
// User.hasMany(Product);

// // User can have one cart
// User.hasOne(Cart);

// // a cart belongs to a user (optional)
// Cart.belongsTo(User);

// // a cart can hold multiple products and a product can be present in the multiple carts
// // we can set relation between Cart and Products through CartItem
// Cart.belongsToMany(Product, { through: CartItem });
// Product.belongsToMany(Cart, { through: CartItem });

// // a single order belongs to a single user and a user can have many orders
// Order.belongsTo(User);
// User.hasMany(Order);

// // a order can belong to many products
// Order.belongsToMany(Product, {through: OrderItem});

// // so, above statements would create a foreign key of userId so that we can identify which user has created or offered a certain product

// // sync() method looks up to all the models and creates the tables for them
// sequelize
//   .sync()
//   //   .sync({force: true}) force:true modifies the existing table if changes are made
//   .then((result) => {
//     // console.log(result);
//     // we will start the server only after creating the table if not created
//     // Instead of:- const server = createServer(app); server.listen(3000);  We can also write:
//     return User.findByPk(1);
//   })
//   .then((user) => {
//     // create a dummy user if no user exists
//     if (!user) {
//       return User.create({ name: "Ishan", email: "ishan@gmail.com" });
//     }
//     return user;
//     // as a function should return the similar data, we write app.listen() in other than block
//   })
//   .then((user) => {
//     // Check if the user already has a cart
//     return user.getCart().then((cart) => {
//       if (!cart) {
//         // If no cart exists, create one
//         return user.createCart();
//       }
//       return cart;
//     });
//   })
//   .then((cart) => {
//     app.listen(3000);
//   })
//   .catch((err) => console.log(err));
