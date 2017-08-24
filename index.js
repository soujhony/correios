const http = require('http')
const app = require('express')()
const bodyParser = require('body-parser')

const correios = require('correios-lib')

app.use(bodyParser.json())

app.get('/cep/:codigo', function(req, resp) {
  correios.cep(req.params.codigo)
    .then(function(data) {
      resp.json(data)
    }, function(error) {
      resp.status(500).json(error)
    })
})

app.get('/rastreio/:codigo', function(req, resp) {
  correios.rastreio(req.params.codigo)
    .then(function(data) {
      resp.json(data)
    }, function(error) {
      resp.status(500).json(error)
    })
})

app.post('/frete', function(req, resp) {
  correios.frete(req.body)
    .then(function(data){
      resp.json(data)
    }, function(error) {
      resp.status(500).json(error)
    })
})

http.createServer(app)
  .listen(8080, function(){
    console.log('Servidor iniciado na porta 8080')
  })