var mongoose = require('mongoose');

if(!process.env.DB_INFO){
    require('dotenv').config()
}

var dbInfo = process.env.DB_INFO

var options = {
  connectTimeoutMS: 5000,
  useNewUrlParser: true,
  useUnifiedTopology : true
}
mongoose.connect(dbInfo, 
    options,         
    function(err) {
     console.log(err);
    }
);

module.exports = mongoose