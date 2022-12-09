const express = require('express')
const router = express.Router()

const Order = require('../models/orders')

router.get('/', async (req, res, next) => {
    const orders = await Order.find()
    .select('product quantity')
    .exec()
    const response = {
        count: orders.length,
        orders
    }
    res.status(200).json({response});
});

router.post('/', async (req, res, next) => {
    const order = new Order ({
        product: req.body.productId,
        quantity: req.body.quantity
    })

    try {
        const newOrder = await order.save()
        const response = {
            newOrder,
            url: `http://localhost:3000/orders/${newOrder._id}`
        }
        return res.status(201).json(response)
    } catch (error) {
        return res.status(500).json({error})
    }
});

router.get('/:orderId', async (req, res, next) => {

    res.status(200).json({
        message: 'Order details', id: req.params.orderId
    });
});

router.delete('/:orderId', (req, res, next) => {
    res.status(200).json({
        message: 'Order deleted', id: req.params.orderId
    });
});

module.exports = router;