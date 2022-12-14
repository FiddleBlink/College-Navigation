const express = require('express');
const router = express.Router();
const handler = require('../services/handler');

/* GET programming languages. */
router.get('/', async function(req, res, next) {
  try {
    res.json(await handler.getMultiple(req.query.page));
  } catch (err) {
    console.error(`Error while getting location `, err.message);
    next(err);
  }
});

router.post('/', async function(req, res, next) {
  try {
    res.json(await handler.create(req.body));
  } catch (err) {
    console.error(`Error while creating new location`, err.message);
    next(err);
  }
});

router.put('/:id', async function(req, res, next) {
  try {
    res.json(await handler.update(req.params.id, req.body));
  } catch (err) {
    console.error(`Error while updating location`, err.message);
    next(err);
  }
});

router.delete('/:id', async function(req, res, next) {
  try {
    res.json(await handler.remove(req.params.id));
  } catch (err) {
    console.error(`Error while deleting programming language`, err.message);
    next(err);
  }
});

module.exports = router;