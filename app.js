const express = require("express");
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Appareil = require('./models/appareil');
const bcrypt = require('bcrypt');
const User = require('./models/user');
const jwt = require('jsonwebtoken');

const router = express.Router()
const app = express();

app.use(bodyParser.json());

app.use((req,res,next) =>{

//res.setHeader('Access-Control-Allow-Origin','http://localhost:4200');

res.setHeader('Access-Control-Allow-Origin','*');

res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');

res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');

next();

});
mongoose.connect('mongodb+srv://Akram:AkramMasmoudi14@cluster0-urb7l.mongodb.net/test?retryWrites=true')
.then(
    () => {
        console.log("Successfully connected to MongoDb Atlas")
    }
).catch(
     (error) => {
        console.log("Unable to connected to MongoDb Atlas")
        console.log(error)
     }   
    )
    router.post('/api/appareils',(req,res,next)=>{
    console.log(req.body);
    const appareil = new Appareil({
        name: req.body.name,
        status: req.body.status
    })
    appareil.save()
    .then(
       () => {
        res.status(201).json({
            message: "Appareil Added success"
        });
       } 
    ).catch(
        (error) => {
            res.status(400).json({
                error: "Appareil Not Added !!!!!!!!!!! " + error
            });  
        }
    )

});
router.get('/api/appareils',(req,res,next)=>{
    //console.log(req.body);
    
    Appareil.find()
    .then(
       (data) => {
        
        //console.log(data);
        res.status(201).json(data);
        
       } 
    ).catch(
        (error) => {
            res.status(400).json({
                error: "Appareil Not !!!!!!!!!!! " + error
            });  
        }
    )

});
router.get('/api/appareils/:id',(req,res,next)=>{
    //console.log(req.body);
    console.log('req.params._id')
    console.log(req.params.id)

    Appareil.findOne({
        _id : req.params.id
    })
    .then(
       (data) => {
        console.log('Appareil By Id ');
        console.log(data);
        res.status(201).json(data);
       } 
    ).catch(
        (error) => {
            res.status(400).json({
                error: "Appareil Not !!!!!!!!!!! " + error
            });  
        }
    )

});
router.get('/api/appareils',(req,res,next)=>{
    //console.log(req.body);
    
    Appareil.find()
    .then(
       (data) => {
        
        //console.log(data);
        res.status(201).json(data);
        
       } 
    ).catch(
        (error) => {
            res.status(400).json({
                error: "Appareil Not !!!!!!!!!!! " + error
            });  
        }
    )

});
router.get('/api/appareils/delete/:id',(req,res,next)=>{
    Appareil.deleteOne({
        _id : req.params.id
    })
    .then(
       (data) => {
        console.log('Delete Appareil By Id ');
        console.log(data);
        res.status(201).json(data);
       } 
    ).catch(
        (error) => {
            res.status(400).json({
                error: "Delete Appareil Not !!!!!!!!!!! " + error
            });  
        }
    )

});
router.put('/api/appareils/:id',(req,res,next)=>{
    console.log(req.body);
    const appareil = new Appareil({
        _id : req.body._id,
        name: req.body.name,
        status: req.body.status
    })

    Appareil.updateOne({
        _id : req.params.id
    },appareil)
    .then(
       () => {
        res.status(201).json({
            message: "Appareil updated success"
        });
       } 
    ).catch(
        (error) => {
            res.status(400).json({
                error: "Appareil Not updated !!!!!!!!!!! " + error
            });  
        }
    )

});

//*****auth *****//

router.post('/api/users/signup',(req,res)=>{
   bcrypt.hash(req.body.password,10)
   .then(
       (hash) => {
           const user = new User({
               email : req.body.email,
               password : hash
           })
           user.save().then(
               () => {
                   res.status(201).json({
                       message : 'user Added Successfully'
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
})
router.post('/api/users/login',(req,res)=>{
    User.findOne({
        email: req.body.email
    })
    .then(
        (user)=>{
            console.log('user : ')
            console.log(user)
            if(!user){
                return res.status(404).json({
                    error: "User Not Found !!!!"
                })
            }
            bcrypt.compare(req.body.password,user.password)
            .then(
                (valid) => {
                    console.log(valid)
                    if(!valid){
                        return res.status(401).json({
                            error: "Incorrect Password !!!!"
                        })
                    }
                    const token = jwt.sign(
                        {userId : user._id},
                        'RANDOM_TOKEN_SECRET',
                        {expiresIn : "24h"} //optionnel
                    )
                    res.status(200).json({
                        user: user,
                        token: token
                    })
                }
            )
            .catch(
                (error)=>{
                    res.status(500).json({
                        error : error 
                    })
                }
            )
        }
    )
    .catch(
        (error)=> {
            res.status(500).json({
                error : error + '1'
            })
        }
        
    )
})

module.exports = app;
