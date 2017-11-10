const http = require('http')
const app = require('express')()
const bodyParser = require('body-parser')

const marked = require('marked')
const fs = require('fs')

const correios = require('correios-lib')

app.use(bodyParser.json())
app.use(require('express-status-monitor')())

app.get('/cep/:codigo', function(req, resp) {
  correios.cep(req.params.codigo)
    .then(function(data) {
      if (data.cep) {
        resp.json(data)
      } else {
        resp.sendStatus(404)
      }
    }, function(error) {
      resp.status(500).json(error)
    })
})

app.get('/rastreio/:codigo', function(req, resp) {
  correios.rastreio(req.params.codigo)
    .then(function(data) {
      if (data.length) {
        resp.json(data)
      } else {
        resp.sendStatus(404)
      }
    }, function(error) {
      resp.status(500).json(error)
    })
})

app.post('/frete', function(req, resp) {
  correios.frete(req.body)
    .then(function(data){
      resp.json(data)
    }, function(error) {
      resp.status(400).json(error)
    })
})

app.get('/', function(req, resp) {
  fs.readFile('./README.md', 'utf8', function(err, data) {
    if (err) {
      resp.status(500).send(err)
    } else {
      resp.send(marked(data))
    }
  })
})

http.createServer(app)
  .listen(8080, function(){
    console.log('Servidor iniciado na porta 8080')
  })