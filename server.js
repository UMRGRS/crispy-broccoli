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

const bodyParser = require('body-parser');
const fs = require('fs')
const path = require('path');

app.use(bodyParser.json())

//Return the API documentation
app.get('/API-info',(req,res)=> res.sendFile(path.join(__dirname, 'html/index.html')))

/*Receives a json file in the body of the request with this format to create a new product: 
{
    "SKU": "",
    "modelo": "",
    "departamento": "",
    "descripcion": "",
    "pesos": "",
    "dolares": "" 
}
*/
app.put('/create-product',function (req, res){
    //Opening and parsing data.json to save the new product
    var data_file = fs.readFileSync('json_data/data.json')
    data_object = JSON.parse(data_file)

    //Opening and parsing the template for a new product
    var temp = fs.readFileSync('json_templates/product_temp.json')
    var new_product = JSON.parse(temp)

    //Assigning the values from the req body to the new product
    new_product['ID_producto'] = data_object['productos'].length + 1
    new_product['Info_producto']['SKU'] = req.body['SKU']
    new_product['Info_producto']['modelo'] = req.body['modelo']
    new_product['Info_producto']['departamento'] = req.body['departamento']
    new_product['Info_producto']['descripcion'] = req.body['descripcion']
    new_product['Info_producto']['precio']['MX'] = req.body['MX']
    new_product['Info_producto']['precio']['US'] = req.body['US']

    //Adding the new product to the list of products
    data_object['productos'].push(new_product)

    //Converting the data object into json
    data_to_save = JSON.stringify(data_object,null,4)

    //Writing the new data into a json file
    fs.writeFile('json_data/data.json', data_to_save, 'utf8',function(err) {
        if (err) {
            console.log(err);
        }
    });
    res.send('Producto agregado con éxito')
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
