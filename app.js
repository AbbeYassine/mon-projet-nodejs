const express = require("express");
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Appareil = require('./models/appareil');
const User = require('./models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const router = express.Router();

const app = express();
mongoose.connect(`mongodb+srv://abbes2:PPVuEo3StPSIQD01@cluster0-zhoit.mongodb.net/test?retryWrites=true`)
    .then(
        () => {
            console.log("Successfully connected to MongoDB Atlas");
        }
    ).catch(
    (error) => {
        console.log("Unable to connect to MongoDB Atlas");
        console.error(error);
    }
);

app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin',
        '*');

    res.setHeader('Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});




router.post('/api/users/signup', (req, res) => {
    bcrypt.hash(req.body.password, 10)
        .then(
            (hash) => {
                const user = new User({
                    email: req.body.email,
                    password: hash
                });

                user.save().then(
                    () => {
                        res.status(201).json({
                            message: 'User added successfully !'
                        });
                    }
                ).catch(
                    (error) => {
                        res.status(500).json({
                            error: error
                        });
                    }
                )
            }
        )
});

router.post('/api/users/login', (req, res) => {
    User.findOne({email: req.body.email})
        .then(
            (user) => {
                if (!user) {
                    return res.status(404).json({
                        error: new Error("User not found")
                    });
                }
                bcrypt.compare(req.body.password, user.password)
                    .then(
                        (valid) => {
                            if (!valid) {
                                return res.status(401).json(
                                    {
                                        error: "Password incorrect"
                                    }
                                )
                            }

                            const token = jwt.sign(
                                {user: user},
                                'RANDOM_TOKEN_SECRET',
                                {expiresIn: "24h"}
                            );
                            res.status(200).json({
                                user: user,
                                token: token
                            })
                        }
                    ).catch(
                    (error) => {
                        res.status(500).json({
                            error: error
                        });
                    }
                ).catch(
                    (error) => {
                        res.status(500).json({
                            error: error
                        })
                    }
                )
            }
        )
});

module.exports = app;
