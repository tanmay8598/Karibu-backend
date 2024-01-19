const mongoose = require("mongoose");

const featuredSchema = mongoose.Schema({
 
    service: {
        type: mongoose.Schema.Types.String,
        ref: "Service",
      }
  
});

const Featured = mongoose.model("Featured", featuredSchema);

module.exports = Featured;
