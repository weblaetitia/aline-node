const mongoose = require('mongoose');


var SubscriptionSchema = mongoose.Schema({
    created : Date,
    email: String,
   });

const SubscriptionModel = mongoose.model('subscriptions', SubscriptionSchema);

module.exports = SubscriptionModel