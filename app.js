const express = require("express");
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const appareilsRoutes = require("./manage-appareils/appareils.routes");
const bcrypt = require('bcrypt');
const User = require('./models/user');
const jwt = require('jsonwebtoken');

const app = express();


app.use(bodyParser.json());

app.use((req, res, next) => {

    res.setHeader('Access-Control-Allow-Origin', '*');

    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');

    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');

    next();

});
mongoose.connect('mongodb+srv://abbes2:PPVuEo3StPSIQD01@cluster0-zhoit.mongodb.net/test?retryWrites=true')
    .then(
        () => {
            console.log("Successfully connected to MongoDb Atlas")
        }
    ).catch(
    (error) => {
        console.log("Unable to connected to MongoDb Atlas")
        console.log(error)
    }
);

app.use('/api/appareils', appareilsRoutes);

//*****auth *****//

app.post('/api/users/signup', (req, res) => {
    bcrypt.hash(req.body.password, 10)
        .then(
            (hash) => {
                const user = new User({
                    email: req.body.email,
                    password: hash
                })
                user.save().then(
                    () => {
                        res.status(201).json({
                            message: 'user Added Successfully'
                        })
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
app.post('/api/users/login', (req, res) => {
    User.findOne({
        email: req.body.email
    })
        .then(
            (user) => {
                console.log('user : ')
                console.log(user)
                if (!user) {
                    return res.status(404).json({
                        error: "User Not Found !!!!"
                    })
                }
                bcrypt.compare(req.body.password, user.password)
                    .then(
                        (valid) => {
                            console.log(valid)
                            if (!valid) {
                                return res.status(401).json({
                                    error: "Incorrect Password !!!!"
                                })
                            }
                            const token = jwt.sign(
                                {userId: user._id},
                                'RANDOM_TOKEN_SECRET',
                                {expiresIn: "24h"} //optionnel
                            )
                            res.status(200).json({
                                user: user,
                                token: token
                            })
                        }
                    )
                    .catch(
                        (error) => {
                            res.status(500).json({
                                error: error
                            })
                        }
                    )
            }
        )
        .catch(
            (error) => {
                res.status(500).json({
                    error: error + '1'
                })
            }
        )
})

module.exports = app;
