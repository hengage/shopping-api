const express = require('express')
const router = express.Router()

const Order = require('./models/orders')

router.get('/', (req, res, next) => {
    res.status(200).json({
        message: 'Order fetched'
    });
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

router.get('/:orderId', (req, res, next) => {
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