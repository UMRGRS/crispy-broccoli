app.use(bodyParser.json())

app.delete('/', function (req,res) {

    var data_file = fs.readFileSync('json_data/data.json')
    data_object = JSON.parse(data_file)

    var temp = fs.readFileSync('json_templates/product_temp.json')
    var del_product = JSON.parse(temp)

    array.splice(req.params.index,1)
    res.send('Valor en el indice '+ req.params.index + ' eliminado')
    
})