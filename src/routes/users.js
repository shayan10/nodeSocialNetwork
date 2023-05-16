const express = require('express');
const router = express.Router();

const userRepo = require('./../repos/user-repo');

router.get('/users', async (req, res) => {
    try {    
        const users = await userRepo.find();
        res.send(users);   
    } catch (error) {
        res.status(400).send(error.message);
    }
});

router.get('/users/:id', async (req, res) => {
    try {    
        const user = await userRepo.findById(req.params.id);
        res.send(user);
    } catch (error) {
        res.status(400).send(error.message);
    }
});

router.post('/users', async (req, res) => {
    try {
        const {username, bio} = req.body;
        const user = await userRepo.insert(username, bio);
        res.status(201).send(user);
    } catch (error) {
        res.status(400).send({
            'code': error.code,
            'message': error.message
        });
    }
});

router.put('/users/:id', async (req, res) => {
    try {
        const {id} = req.params;
        const {username, bio} = req.body;
        
        const user = await userRepo.updateAll(id, username, bio);
        res.status(200).send(user);
    } catch (error) {
        res.status(400).send({
            'code': error.code,
            'message': error.message
        });
    }
});

router.delete('/users/:id', async (req, res) => {

});

module.exports = router;