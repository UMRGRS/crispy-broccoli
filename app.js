const express = require('express')
const app = express()
const port = 3000


let array=[1,2,3,4]
app.get('/',(req,res)=> {
    res.statusCode = 200
    res.send(array.toString())
})

app.put('/:valor',(req,res)=>{
    array.push(req.params.valor)
    res.send('Valor '+req.params.valor+' agregado')
})

app.post('/',(req,res)=>{
    array[req.query.index] = req.query.valor
    res.send('Indice actualizado')
})

app.delete('/:index',(req,res)=>{
    array.splice(req.params.index,1)
    res.send('Valor en el indice '+ req.params.index + ' eliminado')
})

app.get('/:index',(req,res)=>{
    const index = req.params.index
    if(id>array.length-1){
        res.json({"Elemento":"No existe el elemento"})
    }
    else{
        res.json({"Elemento":array[index]})
    }
})



app.listen(port, () => console.log(`Example app listening on port ${port}!`))


