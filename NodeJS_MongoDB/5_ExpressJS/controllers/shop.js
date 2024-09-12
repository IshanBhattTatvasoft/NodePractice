import Product from "../models/product.js";
import client from "../utils/database.js";
// import CartItem from "../models/cart-item.js";

function getProducts(req, res, next) {
  Product.fetchAll()
    .then((products) => {
      res.render("shop/product-list", {
        pageTitle: "Shop",
        path: "/",
        products: products,
      });
    })
    .catch((err) => console.log(err));
}

function getProduct(req, res, next) {
  const prodId = req.params.productId;
  console.log("ProductId : " + prodId);
  // using findByPk() method
  //   Product.findByPk(prodId)
  //     .then((product) => {
  //       res.render("shop/product-details", {
  //         product: product,
  //         pageTitle: product.title,
  //         path: "/products",
  //       });
  //     })
  //     .catch((err) => console.log(err));
  Product.findById(prodId)
    .then((product) => {
      res.render("shop/product-details", {
        pageTitle: product.title,
        path: "/products",
        product: product,
      });
    })
    .catch((err) => console.log(err));
}

function getIndex(req, res, next) {
  Product.fetchAll()
    .then((products) => {
      res.render("shop/index", {
        pageTitle: "Shop",
        path: "/",
        products: products,
      });
    })
    .catch((err) => console.log(err));
}

function getCart(req, res, next) {
  // we cannot access cart like req.user.cart. Instead, what we can do is:
  req.user
    .getCart()
    .then((products) => {
      res.render("shop/cart", {
        pageTitle: "Cart",
        path: "/cart",
        products: products,
      });
    })
    .catch((err) => console.log(err));
  //   Cart.fetchAll((cart) => {
  //     Product.fetchAll((products) => {
  //       const newProducts = [];
  //       for (let product of products) {
  //         let cartProductData = cart.products.find(
  //           (prod) => prod.id === product.id
  //         );
  //         if (cartProductData) {
  //           newProducts.push({ ...product, quantity: cartProductData.quantity });
  //         }
  //       }
  //       const newCart = {
  //         products: newProducts,
  //         totalPrice: cart.totalPrice,
  //       };
  //       res.render("shop/cart", {
  //         pageTitle: "Your Cart",
  //         path: "/cart",
  //         cart: newCart,
  //       });
  //     });
  //   });
}

function postCart(req, res, next) {
  // console.log(`Product ID received: ${prodId}`);

  //   Product.findById(prodId, (product) => {
  //     if (!product) {
  //       // console.log(`No product found with id ${prodId}`);
  //       return res
  //         .status(404)
  //         .render("404", { pageTitle: "Product Not Found", path: "/404" });
  //     }

  //     Cart.addProduct(prodId, product.price);
  //     res.redirect("/cart");

  //   });
  const productId = req.body.productId;
  Product.findById(productId)
    .then((product) => {
      req.user.addToCart(productId); // addToCart() method returns updateOne() method hence it returns a promise so we write another then too
    })
    .then((result) => {
      console.log(result);
      res.redirect("/cart");
    });
  // let fetchedCart;
  // let newQuantity = 1;
  // req.user
  //   .getCart()
  //   .then((cart) => {
  //     fetchedCart = cart;
  //     return cart.getProducts({
  //       where: { id: productId },
  //     });
  //   })
  //   .then((products) => {
  //     const product = products[0];
  //     if (product) {
  //       const oldQuantity = product.cartItem.quantity;
  //       newQuantity = oldQuantity + 1;
  //       return product;
  //     } else {
  //       return Product.findByPk(productId);
  //     }
  //   })
  //   .then((product) => {
  //     return fetchedCart.addProduct(product, {
  //       through: {
  //         quantity: newQuantity,
  //       },
  //     });
  //   })
  //   .then(() => {
  //     res.redirect("/cart");
  //   })
  //   .catch((err) => console.log(err));
}

function postCartDeleteProduct(req, res, next) {
  //   Product.fetch(req.body.productId, (product) => {
  //     Cart.removeProduct(product.id, product.price, (err) => {
  //       if (!err) {
  //         res.redirect("/cart");
  //       }
  //     });
  //   });

  const prodId = req.body.productId;
  req.user
    .deleteItemFromCart(prodId)
    // .then((cart) => {
    //   return cart.getProducts({ where: { id: prodId } });
    // })
    // .then((products) => {
    //   const product = products[0];
    //   return product.cartItem.destroy();
    // })
    .then((result) => {
      res.redirect("/cart");
    })
    .catch((err) => console.log(err));
}

function getOrders(req, res, next) {
  req.user
    .getOrders()
    .then((orders) => {
      res.render("shop/orders", {
        pageTitle: "Your Orders",
        path: "/orders",
        orders: orders,
      });
    })
    .catch((err) => console.log(err));
}

function postOrder(req, res, next) {
  let fetchedCart;
  req.user
    .addOrder()
    // .then((cart) => {
    //   fetchedCart = cart;
    //   return cart.getProducts();
    // })
    // .then((products) => {
    //   return req.user
    //     .createOrder()
    //     .then((order) => {
    //       // there could be different quantities of different products so we cannot write like: order.addProducts(products, {through: {quantity}})
    //       return order.addProducts(
    //         products.map((product) => {
    //           product.orderItem = { quantity: product.cartItem.quantity };
    //           return product;
    //         })
    //       );
    //     })
    //     .catch((err) => console.log(err));
    // })
    // .then((result) => {
    //   return fetchedCart.setProducts(null);
    // })
    .then((result) => {
      res.redirect("/orders");
    })
    .catch((err) => console.log(err));
}

function getCheckout(req, res, next) {
  res.render("shop/checkout", {
    pageTitle: "Checkout",
    path: "/checkout",
  });
}

export default {
  getProducts,
  getProduct,
  getIndex,
  getCart,
  postCart,
  postCartDeleteProduct,
  getOrders,
  postOrder,
  getCheckout,
};
