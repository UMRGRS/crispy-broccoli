const express = require('express')
const app = express()
const port = 3000
const bodyParser = require('body-parser')
const fs = require('fs')
const path = require('path')

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
app.put('/create-product', (req, res) => {
    //Opening and parsing data.json to save the new product
    var data_file = fs.readFileSync('json_data/data.json')
    data_object = JSON.parse(data_file)

    //Opening and parsing the template for a new product
    var temp = fs.readFileSync('json_templates/product_temp.json')
    var new_product = JSON.parse(temp)

    //Assigning the values from the req body to the new product
    new_product['ID_Producto'] = data_object['productos'].length 
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

//Delete the product in the specified index
app.delete('/eliminar/:index', (req,res) => {
    var data_file = fs.readFileSync('json_data/data.json')
    data_object = JSON.parse(data_file)

    data_object["productos"].splice(req.params.index-1, 1);
     //Converting the data object into json
    data_to_save = JSON.stringify(data_object,null,4)

     //Writing the new data into a json file
     fs.writeFile('json_data/data.json', data_to_save, 'utf8',function(err) {
         if (err) {
             console.log(err);
         }
     });
    res.send("Se elimino correctamente")
})

//Update the info of the selected product
app.post('/update-product/:index', function (req, res) {
    // Leer el archivo JSON existente
    var data_file = fs.readFileSync('json_data/data.json')
    var data_object = JSON.parse(data_file)

    // Obtener el índice del producto a actualizar desde los parámetros de la URL
    var indexToUpdate = req.params.index - 1;

    // Verificar si el índice está dentro de los límites válidos
    if (indexToUpdate >= 0 && indexToUpdate < data_object['productos'].length) {
        // Obtener el producto existente que se va a actualizar
        var productToUpdate = data_object['productos'][indexToUpdate];

        // Actualizar los valores del producto con los datos del cuerpo de la solicitud
        productToUpdate['Info_producto']['SKU'] = req.body['SKU'] || productToUpdate['Info_producto']['SKU'];
        productToUpdate['Info_producto']['modelo'] = req.body['modelo'] || productToUpdate['Info_producto']['modelo'];
        productToUpdate['Info_producto']['departamento'] = req.body['departamento'] || productToUpdate['Info_producto']['departamento'];
        productToUpdate['Info_producto']['descripcion'] = req.body['descripcion'] || productToUpdate['Info_producto']['descripcion'];
        productToUpdate['Info_producto']['precio']['MX'] = req.body['MX'] || productToUpdate['Info_producto']['precio']['MX'];
        productToUpdate['Info_producto']['precio']['US'] = req.body['US'] || productToUpdate['Info_producto']['precio']['US'];

        // Guardar los cambios de nuevo en el arreglo de productos
        data_object['productos'][indexToUpdate] = productToUpdate;

        // Convertir el objeto de datos actualizado a formato JSON
        var data_to_save = JSON.stringify(data_object, null, 4);

        // Escribir los datos actualizados de nuevo al archivo JSON
        fs.writeFile('json_data/data.json', data_to_save, 'utf8', function (err) {
            if (err) {
                console.log(err);
                res.status(500).send('Error interno del servidor al actualizar el producto.');
            } else {
                res.send('Producto actualizado con éxito');
            }
        });
    } else {
        // Si el índice está fuera de los límites válidos, enviar una respuesta de error
        res.status(400).send('Índice de producto no válido');
    }
});

//Return the info of the selected product
app.get('/search/:index',(req,res)=>{
    var data_file = fs.readFileSync('json_data/data.json')
    data_object = JSON.parse(data_file)
    res.json(data_object['productos'][req.params.index-1])
});

//Adds a new review to the indicated product
app.post('/add-review/:index', (req, res) => {
    //Opening and parsing data.json to save the new review
    var data_file = fs.readFileSync('json_data/data.json')
    data_object = JSON.parse(data_file)
    
    //Opening and parsing the template for a new review
    var temp = fs.readFileSync('json_templates/review_temp.json')
    var new_review = JSON.parse(temp)

    //Assigning the values from the req body to the new review
    new_review['Info_review']['calificacion'] = req.body['calificacion']
    new_review['Info_review']['texto'] = req.body['texto']

    //Adding the new review to the list
    data_object['productos'][req.params.index-1]['Info_producto']['reviews'].push(new_review)

    //Converting the data object back into json
    data_to_save = JSON.stringify(data_object,null,4)

    //Writing the new data into a json file
    fs.writeFile('json_data/data.json', data_to_save, 'utf8',function(err) {
        if (err) {
            console.log(err);
        }
     });
    res.send("Review agregada con éxito")
})

//Return the reviews of the selected product
app.get('/consult-reviews/:id', (req, res) => {
    data = fs.readFileSync('json_data/data.json')
    const jsonData = JSON.parse(data)
    const { id } = req.params
    res.send(jsonData['productos'][id-1]['Info_producto']['reviews'])
})

//Returns all the products in the same department
app.get('/:department',(req, res) => {
    //Opening and parsing data.json
    var data_file = fs.readFileSync('json_data/data.json')
    data_object = JSON.parse(data_file)

    var response_obj = []

    //When we encounter a product with the desired category we add it to the list
    data_object['productos'].forEach(prod => {
        if(prod['Info_producto']['departamento']==req.params.department){
            response_obj.push(prod)
        }
    });
    res.json(response_obj)
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
