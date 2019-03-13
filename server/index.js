const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const bodyparser = require('body-parser')
const app = express()

app.use(morgan('combined'))
app.use(cors())
app.use(bodyparser.json())

app.listen(3000, () => console.log('Listening at port 3000'))
