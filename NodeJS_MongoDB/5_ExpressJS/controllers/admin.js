import Product from "../models/product.js";
import client from "../utils/database.js";
import { ObjectId } from "mongodb";

function postAddProduct(req, res, next) {
  const { title, imageUrl, price, description } = req.body;

  const product = new Product(
    title,
    price,
    description,
    imageUrl,
    null,
    req.user._id
  );
  console.log("UserId: " + req.user._id);
  product
    .save()
    .then((result) => {
      console.log("Product created:", result);
      res.redirect("/admin/add-product");
      return; // Add a return statement to prevent further execution
    })
    .catch((err) => {
      console.error("Error creating product:", err);
      res.status(500).send("Failed to create product");
      return; // Add a return statement to prevent further execution
    });

  //   req.user
  //     .createProduct({
  //       title: title,
  //       price: price,
  //       imageUrl: imageUrl,
  //       description: description,
  //     })
  //     .then((result) => {
  //       console.log("Created product:", result);
  //       res.redirect("/admin/products");
  //     })
  //     .catch((err) => {
  //       console.error("Error creating product:", err);
  //       res.status(500).send("Failed to create product");
  //     });

  // instead of the above method, we can add product like this, but here we need to specify the userId from the request which is not a preferred method
  /*Product.create({
    title: title,
    price: price,
    imageUrl: imageUrl,
    description: description,
    userId: req.user.id
  })
    .then((result) => {
      console.log("Created product");
      res.redirect("/admin/products");
    })
    .catch((err) => {
      console.log(err);
    });*/

  // insertion using query
  //   const { title, imageUrl, price, description } = req.body;

  //   const query = `
  //     INSERT INTO "Products" ("ProductName", "ProductImageUrl", "ProductDesc", "ProductPrice")
  //     VALUES ($1, $2, $3, $4)
  //     RETURNING *;
  //   `;
  //   const values = [title, imageUrl, description, price];

  //   client.query(query, values, (err, result) => {
  //     if (err) {
  //       console.error("Error inserting product into the database:", err.stack);
  //       return res.status(500).send("Failed to add product");
  //     }
  //     console.log("Product added:", result.rows[0]);
  //     res.redirect("/");
  //   });
}

function getAddProduct(req, res, next) {
  return res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
  });
}

function getEditProduct(req, res, next) {
  // fetch the value of query parameter edit from the URL i.e. ...?edit=true
  const editMode = req.query.edit;
  // if it does not exist or it is false/null/undefined, redirect to home page
  if (!editMode) {
    return res.redirect("/");
  }
  const prodId = req.params.productId;
  //   console.log("ProductId : " + prodId);
  //   Product.findById(prodId, (product) => {
  //     if (!product) {
  //       return res.redirect("/");
  //     }
  //     res.render("admin/edit-product", {
  //       pageTitle: "",
  //       path: "/admin/edit-product",
  //       editing: editMode,
  //       product: product,
  //     });
  //   });
  Product.findById(prodId)
    //   Product.findByPk(prodId)
    .then((product) => {
      if (!product) {
        return res.redirect("/");
      }
      return res.render("admin/edit-product", {
        pageTitle: "",
        path: "/admin/edit-product",
        editing: editMode,
        product: product,
      });
    })
    .catch((err) => {
      console.error("Error fetching product:", err);
      return res.status(500).send("Failed to fetch product");
    });
  // fetch the specific product details
  // so when the URL is like: http://localhost:3000/admin/edit-product/123245?edit=true, the edit-product.ejs page is loaded
  const product = {};
}

function postEditProduct(req, res, next) {
  //   const prodId = req.body.productId;
  //   const updatedTitle = req.body.title;
  //   const updatedPrice = req.body.price;
  //   const updatedImageUrl = req.body.imageUrl;
  //   const updatedDescription = req.body.description;
  //   const updatedProduct = new Product(
  //     prodId,
  //     updatedTitle,
  //     updatedImageUrl,
  //     updatedDescription,
  //     updatedPrice
  //   );
  //   updatedProduct.saveProduct();
  //   res.redirect("/admin/products");

  const prodId = req.body.id.trim(); // Assuming the hidden field uses name="id"
  console.log(prodId.length);
  const { title, imageUrl, price, description } = req.body;

  //   const query = `
  //     UPDATE "Products"
  //     SET "ProductName" = $1, "ProductImageUrl" = $2, "ProductDesc" = $3, "ProductPrice" = $4
  //     WHERE "ProductId" = $5
  //     RETURNING *;
  //   `;
  //   const values = [updatedTitle, updatedImageUrl, updtedDescription, updatedPrice, prodId];

  //   client.query(query, values, (err, result) => {
  //     if (err) {
  //       console.error("Error updating product in the database:", err.stack);
  //       return res.status(500).send("Failed to update product");
  //     }
  //     console.log("Product updated:", result.rows[0]);
  //     res.redirect("/admin/products");
  //   });

  const product = new Product(
    title,
    price,
    description,
    imageUrl,
    ObjectId.createFromHexString(prodId), null
  );
  product
    .save()
    // .then((product) => {
    //   product.title = title;
    //   product.price = price;
    //   product.description = description;
    //   product.imageUrl = imageUrl;
    //   console.log("fetched new data: ", description);
    //   return product.save(); // method of sequalize to update the product if exists and if not, creates the one
    // })
    .then((result) => {
      res.redirect("/admin/products");
      console.log("updated product");
    })
    .catch((err) => {
      console.error("Error updating product:", err);
      return res.status(500).send("Failed to update product");
    });
}

function postDeleteProduct(req, res, next) {
  const prodId = req.body.productId;
  Product.deleteById(prodId)
    .then(() => {
      console.log("Product deleted");
      return res.redirect("/admin/products");
    })
    .catch((err) => {
      console.error("Error deleting product:", err);
    });
}

function getProducts(req, res, next) {
  //   Product.fetchAll((products) => {
  //     res.render("admin/product-list", {
  //         pageTitle: "",/
  //         path: "/admin/products",
  //         products: products,
  //       });
  //   });
  // req.user
  //   .getProducts()
  //   //   Product.findAll()
  //   .then((products) => {
  //     res.render("admin/product-list", {
  //       pageTitle: "",
  //       path: "/admin/products",
  //       products: products,
  //     });
  //   })
  //   .catch((err) => console.log(err));

  Product.fetchAll()
    .then((products) => {
      return res.render("admin/product-list", {
        prods: products,
        pageTitle: "Admin Products",
        path: "/admin/products",
      });
    })
    .catch((err) => {
      console.error("Error fetching products:", err);
      return res.status(500).send("Failed to fetch products");
    });
}

export default {
  postAddProduct,
  getAddProduct,
  getEditProduct,
  postEditProduct,
  postDeleteProduct,
  getProducts,
};
