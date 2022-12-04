const express = require('express')
const router = express.Router()

router.get('/', (req, res, next) => {
    res.status(200).json({
        message: 'Order fetched'
    });
});

router.post('/', (req, res, next) => {
    const order = {
        productId: req.body.productId,
        quantity: req.body.quantity
    }

    res.status(200).json({
        message: 'Order created',
        order
    });
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