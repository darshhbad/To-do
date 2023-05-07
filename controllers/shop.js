const Product = require('../models/product');
const Cart = require('../models/cart');
const Order = require('../models/order')    //11.18

exports.getProducts = (req, res, next) => {   //10.4
  Product.findAll()      //11.5 retrieving products using sequelize
  .then(products=>{
          res.render('shop/product-list', {
          prods: products,
          pageTitle: 'All Products',
          path: '/products'
          })
  }).catch(err=>console.log(err))
  //   Product.fetchAll().then(([rows])=>{      
//     res.render('shop/product-list', {
//       prods: rows,
//       pageTitle: 'All Products',
//       path: '/products'
// })
// })
// .catch(err=>console.log(err))
  // (products => {
  //   res.render('shop/product-list', {
  //     prods: products,
  //     pageTitle: 'All Products',
  //     path: '/products'
  //   });
  // });
};

exports.getProduct = (req, res, next) => {  
  const prodId = req.params.productId;    //10.6
  Product.findByPk(prodId).then((product)=>{      //11.6 findByPk instead of findById, Single product and not an array of product/metadata so product instead of [product]
    res.render('shop/product-detail', {
      product: product,      //10.6 The promise returns an array
      pageTitle: product.title,
      path: '/products'
    });
  })
  .catch(err=>console.log(err));
  // Product.findAll({where {id:prodId}}).then((products)=>{      //11.6 findAll method can also be used but it returns array
  //   res.render('shop/product-detail', {
  //     product: products[0],      //10.6 The promise returns an array
  //     pageTitle: products[0].title,
  //     path: '/products'
  //   });
  // })
  // .catch(err=>console.log(err));
};

exports.getIndex = (req, res, next) => {    //10.3
  Product.findAll()      //11.5 retrieving products using sequelize
  .then(products=>{
          res.render('shop/index', {
          prods: products,
          pageTitle: 'Shop',
          path: '/'
          })
  }).catch(err=>console.log(err))
//   Product.fetchAll().then(([rows, fieldData])=>{      
//           res.render('shop/index', {
//           prods: rows,
//           pageTitle: 'Shop',
//           path: '/'
//   })
// })
//   .catch(err=>console.log(err))

};

exports.getCart = (req, res, next) => {
  // console.log(req.user.cart)
  req.user.getCart()                         //11.14 req.user.cart will give undefined, req.user.getCart will give null if no cart is present
  .then(cart=> {
    cart.getProducts()
    .then(products=>{
      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        products: products      
    })
    })
  })
  .catch(err=>console.log(err))
  // Cart.getCart(cart => {
  //   Product.fetchAll(products => {
  //     const cartProducts = [];
  //     for (product of products) {
  //       const cartProductData = cart.products.find(
  //         prod => prod.id === product.id
  //       );
  //       if (cartProductData) {
  //         cartProducts.push({ productData: product, qty: cartProductData.qty });
  //       }
  //     }
  //     res.render('shop/cart', {
  //       path: '/cart',
  //       pageTitle: 'Your Cart',
  //       products: cartProducts
  //     });
  //   });
  // });
};

exports.postCart = (req, res, next) =>  {
  const prodId = req.body.productId;     
  let fetchedCart;                              //11.15
  let newQuantity=1
  req.user                                      //11.15
  .getCart()                                    //11.16 Changed cart ejs files p. evrywhere and p.cartItem.quantity
  .then(cart=>{
    fetchedCart=cart
    return cart.getProducts ({where: {id:prodId}})
  })
  .then(products=>{
    let product
    if (products.length>0){
     product= products[0]
  }
  
  if(product){
    const oldQuantity = product.cartItem.quantity         //11.16
    newQuantity = oldQuantity+1
    // return fetchedCart.addProduct(product,{through: {quantity: newQuantity}})
    return product
  }
  return  Product.findByPk(prodId)
  // .then(product=>{
  //   return fetchedCart.addProduct(product,{ through: {quantity: newQuantity}})
  // })
  .catch(err=>console.log(err))
  })
  .then(product=>{
    return fetchedCart.addProduct(product,{through: {quantity: newQuantity}})           //11.6
  })
  .then(()=>{
    res.redirect('/cart')
  })
  .catch()
  // Product.findById(prodId, product => {
  //   Cart.addProduct(prodId, product.price);
  // });
  // res.redirect('/cart');
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  req.user.getCart()
  .then(cart=>{
    return cart.getProducts({where:{id:prodId}})
  })
  .then(products=>{
    const product = products[0] 
    return product.cartItem.destroy()
  })
  .then(result=>{
    res.redirect('/cart')
  })
  .catch(err=>{console.log(err)})
  // Product.findById(prodId, product => {
  //   Cart.deleteProduct(prodId, product.price);
  //   res.redirect('/cart');
  // });
};

exports.postOrder= (req,res,next)=>{      //11.18
  let fetchedCart                         //11.19
  req.user.getCart()                      //11.18
  .then(cart=>{
    fetchedCart=cart
    return cart.getProducts()
  })
  .then(products=>{
    return req.user.createOrder()
    .then(order=>{
      order.addProducts(products.map(product=>{
        product.orderItem = {quantity: product.cartItem.quantity}
        return product
      }))
    })
    // console.log(products)
  })
  .then(result=>{
    return fetchedCart.setProducts(null)    //11.19
    
  })
  .then(result=>{
    res.redirect('/orders')
  })

}

exports.getOrders = (req, res, next) => {   //11.19
  req.user.getOrders({include:['products']})    //11.19
  .then(orders=>{
    // console.log(orders)        //will give array of order without order id key so we need include functionality in above
      res.render('shop/orders', {
    path: '/orders',
    pageTitle: 'Your Orders',
    orders:orders
  });
  })
  // res.render('shop/orders', {
  //   path: '/orders',
  //   pageTitle: 'Your Orders'
  // });
};

// exports.getCheckout = (req, res, next) => {
//   res.render('shop/checkout', {
//     path: '/checkout',
//     pageTitle: 'Checkout'
//   });
// };
