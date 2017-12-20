const http = require('http')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')

const swaggerJSDoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express')

const correios = require('correios-lib')

const config = {
  port: process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080,
  ip: process.env.IP || process.env.HOST || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0'
}

app.use(bodyParser.json())
app.use(require('express-status-monitor')())

const swaggerSpec = swaggerJSDoc({
  swaggerDefinition: {
    info: {
      title: 'Documentação da API de Microserviços dos Correios',
      version: '1.0.0',
      description: 'Catalogo dos métodos',
    },
  basePath: '/api',
  },
  apis: ['./index.js']
})

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  next();
});

app.get('/swagger.json', function(req, res) {
  res.setHeader('Content-Type', 'application/json')
  res.send(swaggerSpec)
})

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

/**
 * @swagger
 * /cep/{codigo}:
 *   get:
 *     description: Consulta um determinado CEP
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: codigo
 *         description: Código do CEP a ser consultado
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Dados do CEP consultado
 *       404:
 *         description: CEP consultado não encontrado
 */
app.get('/api/cep/:codigo', function(req, resp) {
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

app.get('/api/rastreio/:codigo', function(req, resp) {
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

app.post('/api/frete', function(req, resp) {
  correios.frete(req.body)
    .then(function(data){
      resp.json(data)
    }, function(error) {
      resp.status(400).json(error)
    })
})

http.createServer(app)
  .listen(config.port, config.ip, function(){
    console.log('Microserviço dos correios iniciado na porta', config.port)
  })