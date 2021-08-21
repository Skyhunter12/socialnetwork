const express = require('express');
const dotenv = require('dotenv')
const cookieParser = require('cookie-parser')
require('./db/mongoConn')
dotenv.config({path:'./config/dotenv.env'})
const router = require('./router/router');
const PORT = process.env.PORT || 3000;

let app = express()

app.use(express.json());
// app.use(cors())
app.use('/images/:id', express.static('./assets'))
app.use(cookieParser())
app.use(router)

app.listen(PORT,()=>{
    console.log(`Listening to port numeber ${PORT}`);
})