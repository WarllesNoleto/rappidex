/* eslint-disable no-undef */
import express from 'express'
const app = express()

app.use('/', express.static('./dist'))
app.use('*', express.static('./dist'))

app.listen(process.env.PORT || 3000, (err) => {
    if(err) { return console.log(err) }
    console.log('Esse é o Rappidex Express.')
})