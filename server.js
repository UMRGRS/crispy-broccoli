const express = require('express')
const app = express()
const port = 3000
const bodyParser = require('body-parser');
const fs = require('fs')

app.delete('/eliminar/:index', function(req,res) {
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

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
