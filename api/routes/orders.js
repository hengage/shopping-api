const express = require('express')
const router = express.Router()

const Order = require('../models/orders')
const Product = require('../models/product')

const orderURL = (id) => {
    /* 
    Gets the id of an order and returns the url to the product
    */
    return `http://localhost:3000/orders/${id}`
}

router.get('/', async (req, res, next) => {
    const orders = await Order.find()
    .select('product quantity')
    .exec()
    const response = {
        count: orders.length,
        orders : orders.map(order => {
            return {
            order,
            url:{
                method: "GET",
                path:  orderURL(order.id)
            }}
        })
    }
    res.status(200).json({response});
});

router.post('/', async (req, res, next) => {
    const findProduct = await Product.findById(req.body.productId).exec()
    if (!findProduct || findProduct == null) {
        return res.status(404).json('The product does not exist')
    }

    const order = new Order ({
        product: req.body.productId,
        quantity: req.body.quantity
    })

    try {
        const newOrder = await order.save()
        const response = {
            newOrder,
            url: orderURL(newOrder._id)
        }
        return res.status(201).json(response)
    } catch (error) {
        return res.status(500).json({error})
    }
});

router.get('/:orderId', async (req, res, next) => {

    const order = await Order.findOne({_id: req.params.orderId})
    .select('product quantity')
    .exec()

    return res.status(200).json({
        order
    });
});

router.delete('/:orderId', (req, res, next) => {
    res.status(200).json({
        message: 'Order deleted', id: req.params.orderId
    });
});

module.exports = router;