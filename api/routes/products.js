const express = require('express')
const router = express.Router()

const Product = require('./models/product')

router.get('/', async (req, res, next) => {
    const products = await Product.find()
        .select('name price')
        .exec()
    console.log(products.length)

    if ( !products.length > 0 ) { 
        return res.status(404).json('No products in the store')
    }
    const response = {
        productsCount: `${products.length} products in the store`,
        products: products.map(product => {
            return {
                // ...product._doc,
                product,
                url: `http://localhost:3000/products/${product.id}`

            }
        })
    }
    return res.status(200).json({response})
});

router.post('/', async (req, res) => {
    const product = new Product({
            name: req.body.name,
            price: req.body.price
        }) 
    try {
        const newProduct = await product.save()
        const returnProduct = {
            name: newProduct.name,
            price: newProduct.price,
            url: `http://localhost:3000/products/${newProduct._id}`
        }
        return res.status(201).json(returnProduct)
    } catch (error) {
        return res.status(400).json(error)
        // console.log(error)
    }

    // const product = await Product.create({
    //     name: req.body.name,
    //     price: req.body.price
    // })

    // res.status(201).json(product)
});

router.get('/:productId', async (req, res, next) => {
    const productId  = req.params.productId
    try {
        const product = await Product.findById(productId)
            .select('name price')
            .exec()
        if (!product || product === null ){
            return res.status(404).json('No product for the given id')
        }
        return res.status(200).json(product)
        
    } catch (error) {
        res.status(500).json({error})
        
    }
    next()
})

router.patch('/:productId', async (req, res, next) => {
    const productId  = req.params.productId
    const productParams = {
        name: req.body.name, price:req.body.price
    }
    try {
        const updatedProduct = await Product.findByIdAndUpdate(
            productId,
            {$set: productParams}
        )
        res.status(201).json({updatedProduct})
        next()
    } catch (error) {
        console.log({error})
        return res.status(400).json({error})
    };

})

router.delete('/:productId', async (req, res, next) => {
    const productId  = req.params.productId
   
    try {
        const result =  await Product.deleteOne({_id:productId}).exec()
        if (!productId || productId === null ){
            return res.status(404).json('No product for the given id')
        }
        res.status(200).json({result, Deleted: productId})
    } catch (error) {
        res.status(500).json({error})
    }
})

module.exports = router;