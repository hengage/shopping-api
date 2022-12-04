const router = require('express').Router()

const productsRoutes = require('./products')
const ordersRoutes = require('./orders')

router.use('/products', productsRoutes)
router.use('/orders', ordersRoutes)


module.exports = router