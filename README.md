# correios

Exemplo de uso da biblioteca [correios-lib](https://github.com/jhonystein/correios-lib)

## Passos para execução

``` bash
git clone https://github.com/jhonystein/correios.git
cd correios
npm install
npm start
```

## Documentação

Serviço já em execução em:
[http://api.correios.gq](http://api.correios.gq)

Serviços:
- Consulta de CEP
```
GET /cep/{cep de consulta}
```

- Consulta de rastreio
```
GET /rastreio/{código de rastreio}
```

- Orçamento de frete
```
POST /frete
```
- Formato do objeto para geração do orçamento de frete
``` json
{
  "servico": ["{codigo do serviço *}"],
  "cepOrigem": "{cep de origem}",
  "cepDestino": "{cep de destino}",
  "peso": "{peso do objeto}",
  "formato": "{codigo do formato do objeto **}",
  "altura": "{altura do objeto}",
  "largura": "{largura do objeto}",
  "comprimento": "{comprimento do objeto}",
  "diametro": "{diametro do objeto}",
  "maoPropria": "{S ou true para indicar o uso do serviço de mão propria (opcional)}",
  "avisoRecebimento": "{S ou true para indicar o uso do serviço de aviso de recebimento (opcional)}",
  "valor": "{valor da mercadoria transportada (opcional)}"
}
```

- (*) Código do serviço

Código do serviço na base dos correios. Segue lista dos principais serviços:

|Código | Descrição |
|-------|-----------|
|40010 | SEDEX sem contrato |
|40045 | SEDEX a Cobrar, sem contrato |
|40215 | SEDEX 10, sem contrato |
|41106 | PAC sem contrato |

- (**) Código do formato

Código do formato de empacotamento da mercadoria:

|Código | Descrição |
|:-----:|-----------|
|1 | Caixa |
|2 | Rolo |
|3 | Envelope |
