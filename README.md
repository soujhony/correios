# correios
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fjhonystein%2Fcorreios.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2Fjhonystein%2Fcorreios?ref=badge_shield)


Exemplo de uso da biblioteca [correios-lib](https://github.com/jhonystein/correios-lib)

## Passos para executar uma cópia do micro serviço

``` bash
git clone https://github.com/jhonystein/correios.git
cd correios
npm install
npm start
```

## Documentação

Serviço já em execução em:
[http://apicorreios.herokuapp.com](http://apicorreios.herokuapp.com)

Serviços:
- Consulta de CEP
```
GET /api/cep/{cep de consulta}
```

- Consulta de rastreio
```
GET /api/rastreio/{código de rastreio}
```

- Orçamento de frete
```
POST /api/frete
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


## License
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fjhonystein%2Fcorreios.svg?type=large)](https://app.fossa.io/projects/git%2Bgithub.com%2Fjhonystein%2Fcorreios?ref=badge_large)