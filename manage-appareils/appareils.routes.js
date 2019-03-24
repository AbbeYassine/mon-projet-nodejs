const express = require('express');
const appareilCtr = require('./appareils.controllers');

const router = express.Router();

router.post('/', appareilCtr.createAppareil);
router.get('/', appareilCtr.getAllAppareil);
router.get('/:id', appareilCtr.getAppareilById);
router.delete('/:id', appareilCtr.deleteAppareilById);
router.put('/:id', appareilCtr.updateAppareilById);

module.exports = router;
