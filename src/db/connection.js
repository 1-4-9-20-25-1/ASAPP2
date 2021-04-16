const mongoose = require('mongoose')

const connection_url=process.env.MONGODB_URL
console.log("connected")
mongoose.connect(connection_url,{
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
})
