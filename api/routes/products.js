const express = require('express')
const router = express.Router()

const Product = require('./models/product')

router.get('/', async (req, res, next) => {
    const products = await Product.find()
    console.log(products.length)

    if ( !products.length > 0 ) { 
        return res.status(404).json('No products in the store')
    }
    const productCount = `${products.length} products in the store`
    return res.status(200).json({productCount, products})
});

router.post('/', async (req, res) => {
    const product = new Product({
            name: req.body.name,
            price: req.body.price
        }) 
    try {
        const newProduct = await product.save()
        return res.status(201).json(newProduct)
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