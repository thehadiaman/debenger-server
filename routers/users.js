const router = require('express').Router();

router.get('/', (req, res)=>{
    res.send(['user-1', 'user-2']);
});

module.exports = router;
