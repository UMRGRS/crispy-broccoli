const express = require('express')
const app = express()
const port = 3000
const bodyParser = require('body-parser')
const fs = require('fs')


app.get('/consult-reviews/:id', function (req, res){
    data = fs.readFileSync('json_data/data.json')
    const jsonData = JSON.parse(data)
    const { id  } = req.params
    res.send(jsonData['productos'][id-1]['Info_producto']['reviews'])
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))