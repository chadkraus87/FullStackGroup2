const router = require('express').Router();
const userRoutes = require('./userRoutes');
const spotRoutes = require('./spotRoutes');

router.use('/users', userRoutes);
router.use('/spots', spotRoutes);

module.exports = router;