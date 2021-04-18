const mongoose = require('mongoose')

const url=process.env.MONGODB_URL

mongoose.connect(url,{
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
})
console.log("connected")