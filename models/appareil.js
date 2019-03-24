const mongoose = require('mongoose');

const appareil = mongoose.Schema({
    name : {type : String, required: true},
    status : {type : Boolean, required: true}
})
module.exports = mongoose.model('Appareil',appareil)
