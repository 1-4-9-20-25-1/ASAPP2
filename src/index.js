const app=require('./app')

const port=process.env.PORT || 4004
app.listen(port, () => {
    console.log('Server is up on port '+port)
})