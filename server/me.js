const express = require('express');

const router = new express.Router();

router.get('/', (req, res) => {
  res.status(200).json({
    user: {
        id: req.user._id,
        email: req.user.email,
        name: req.user.name,
        rank: req.user.rank
    }
  });
});

module.exports = router;
