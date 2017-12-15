const http = require('http')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')

const marked = require('marked')
const fs = require('fs')

const correios = require('correios-lib')

const config = {
  port: process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080,
  ip: process.env.IP || process.env.HOST || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0'
}

app.use(bodyParser.json())
app.use(require('express-status-monitor')())
app.use(express.static('./public'))

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
  .listen(config.port, config.ip, function(){
    console.log('Servidor iniciado na porta', config.port)
  })