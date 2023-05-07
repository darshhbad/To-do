const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  req.user.createProduct({        //11.12 Instead we can use magic method cretaed by sequelize for associations as we declared relations in app.js
    title:title,
    price:price,
    imageUrl:imageUrl,
    description:description
  })
  .then(result=>{
    res.redirect('/')
  })          
  // Product.create({                          //11.4 Create a new product using sequelize
  //   title:title,
  //   price:price,
  //   imageUrl:imageUrl,
  //   description:description
  //   // userId:req.user.id         //11.12 We manually fetched userid in this case
  // }).then(result=>{
    // console.log(result)
    //console.log('Created Product')
  .catch(err=>console.log(err))
  // const product = new Product(null, title, imageUrl, description, price);
  // product.save().then(()=>{         //10.5
  //   res.redirect('/');
  // })
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/');
  }
  const prodId = req.params.productId;
  req.user.getProducts({where:{id:prodId}})     //11.13 Similar magic method
  // Product.findByPk(prodId)        //11.8 Editing product in  admin page
  .then(products=>{                   //11.13 Here we get an array of products
    const product=products[0]         //Only then will it populate the edit product fields
    if (!product) {
          return res.redirect('/');
        }
        res.render('admin/edit-product', {
          pageTitle: 'Edit Product',
          path: '/admin/edit-product',
          editing: editMode,
          product: product
        });
  })    
  .catch(err=>console.log(err))    
  // Product.findById(prodId, product => {
  //   if (!product) {
  //     return res.redirect('/');
  //   }
  //   res.render('admin/edit-product', {
  //     pageTitle: 'Edit Product',
  //     path: '/admin/edit-product',
  //     editing: editMode,
  //     product: product
  //   });
  // });
};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDesc = req.body.description;
  Product.findByPk(prodId).then(product=>{    //11.8 Updating product
    product.title= updatedTitle,
    product.imageUrl= updatedImageUrl,
    product.description= updatedDesc,
    product.price=updatedPrice
    return product.save()
  })
  .then(result=>{console.log('updated product')})
  .catch(err=>console.log(err))
  res.redirect('/admin/products')
  // const updatedProduct = new Product(
  //   prodId,
  //   updatedTitle,
  //   updatedImageUrl,
  //   updatedDesc,
  //   updatedPrice
  // );
  // updatedProduct.save();
  // res.redirect('/admin/products');
};

exports.getProducts = (req, res, next) => {
  req.user.getProducts()      //11.13
  // Product.findAll()       //11.7 retrieving admin products
  .then(products=>{      
    res.render('admin/products', {
      prods: products,
      pageTitle: 'Admin Products',
      path: '/admin/products'
  })
})
.catch(err=>console.log(err))
  // Product.fetchAll(products => {
  //   res.render('admin/products', {
  //     prods: products,
  //     pageTitle: 'Admin Products',
  //     path: '/admin/products'
  //   });
  // });
}
exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findByPk(prodId)            //11.9 Deleted product
  .then(product=>{
    return product.destroy()
  })
  .then(result=>console.log('deleted product'))
  .catch(err=>console.log(err))
  res.redirect('/admin/products')
  // Product.deleteById(prodId);
  // res.redirect('/admin/products');
};
