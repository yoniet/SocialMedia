
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const bodyParser = require('body-parser');
const path = require('path')
const cors = require('cors')
require('dotenv').config()



const userRoutes = require('./routes/user.routes')
const authRoutes = require('./routes/auth.routes')
const postRoutes = require('./routes/post.routes')

mongoose.connect(process.env.MONGODB_URI)

app.set("views", "./public")
app.use(express.static("public"))
app.use(cors())


app.use(bodyParser.json())
// FIX: change extended to true
app.use(bodyParser.urlencoded({ extended: true }))

app.use('/', userRoutes)
app.use('/', authRoutes)
app.use('/', postRoutes)

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname) + '/public/' ,'index.html')
})



const start = async () => {
    app.listen(process.env.PORT || 3000, console.log('server is running'))
}

start()

