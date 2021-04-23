const mongoose = require("mongoose");
module.exports = () => {
  mongoose.connect("mongodb+srv://softwarechasers:softwarechasers@cluster0.kmmfi.mongodb.net/movie-app?retryWrites=true&w=majority", {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex:true})
  mongoose.connection.on("open", () => {
    console.log("DB connection established")
  })
  
  mongoose.connection.on("error", (err) => {
    console.log("Connection failed" + err)
  })
}