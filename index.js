const http = require('http')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')

const swaggerJSDoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express')

const correios = require('correios-lib')
const ibge = require('municipios-ibge')

const config = {
  port: process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080,
  ip: process.env.IP || process.env.HOST || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0'
}

app.use(bodyParser.json())
app.use(require('express-status-monitor')())

const swaggerSpec = swaggerJSDoc({
  swaggerDefinition: {
    info: {
      title: 'API de Microserviços dos Correios',
      version: '1.0.0',
      description: 'Catálogo dos métodos presentes na API de microserviços dos correios',
      contact: {
        name: 'Jhony Alceu Pereira',
        url: 'https://jhonystein.github.io',
        email: 'jhonystein@gmail.com'
      },
      license: {
        name: 'MIT',
        url: 'https://raw.githubusercontent.com/jhonystein/correios/master/LICENSE'
      }
    },
    authAction: false,
    basePath: '/api',
    host: '',
    externalDocs: {
      description: 'Status do Serviço',
      url: 'http://apicorreios.herokuapp.com/status'
    }
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
 * definitions:
 *   DadosFrete:
 *     type: object
 *     required:
 *       - servico
 *       - cepOrigem
 *       - cepDestino
 *       - peso
 *       - altura
 *       - largura
 *       - comprimento
 *       - diametro
 *       - formato
 *     properties:
 *       servico:
 *         type: array
 *         items: 
 *           type: string
 *       cepOrigem:
 *         type: string
 *       cepDestino:
 *         type: string
 *       peso:
 *         type: float
 *       altura:
 *         type: float
 *       largura:
 *         type: float
 *       comprimento:
 *         type: float
 *       diametro:
 *         type: float
 *       formato:
 *         type: string
 *       maoPropria:
 *         type: string
 *       avisoRecebimento:
 *         type: string
 *       valor:
 *         type: float
 */

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
        data.codigoIbge = ibge(data.uf, data.cidade)
        resp.json(data)
      } else {
        resp.sendStatus(404)
      }
    }, function(error) {
      resp.status(500).json(error)
    })
})

/**
 * @swagger
 * /rastreio/{codigo}:
 *   get:
 *     description: Consulta um código de Rastreio
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: codigo
 *         description: Código do Rastreio a ser consultado
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Conjunto dos dados do rastreio
 *       404:
 *         description: Código de Rastreio não encontrado
 */
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

/**
 * @swagger
 * /frete:
 *   post:
 *     description: Realiza uma consulta de valores de frete com suas características
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: dados
 *         description: Dados do Frete
 *         in:  body
 *         required: true
 *         type: string
 *         schema:
 *           $ref: '#/definitions/DadosFrete'
 *     responses:
 *       200:
 *         description: Dados do frete consultado
 *       400:
 *         description: Dados inválidos para a consulta de frete
 */
app.post('/api/frete', function(req, resp) {
  correios.frete(req.body)
    .then(function(data){
      resp.json(data)
    }, function(error) {
      resp.status(400).json(error)
    })
})

app.get('/', function(req, resp) {
  resp.redirect('/api-docs')
})

http.createServer(app)
  .listen(config.port, config.ip, function(){
    console.log('Micro serviço dos correios iniciado na porta', config.port)
  })