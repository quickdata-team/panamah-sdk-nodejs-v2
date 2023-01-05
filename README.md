<h1 align="center">Bem-vindo ao Panamah SDK 👋</h1>

<p>
  <a href="https://www.npmjs.com/package/panamah-sdk" target="_blank">
    <img alt="Npm Package" src="https://img.shields.io/npm/v/panamah-sdk.svg" />
  </a>
  <a href="https://github.com/quickdata-team/panamah-sdk-nodejs-v2/blob/main/LICENSE" target="_blank">
    <img alt="License: ISC" src="https://img.shields.io/github/license/quickdata-team/panamah-sdk-nodejs-v2" />
  </a>
  <a href="https://quickdata.atlassian.net/wiki/spaces/PANSDKV2" target="_blank">
    <img alt="Documentation" src="https://img.shields.io/badge/documentation-yes-brightgreen.svg" />
  </a>
  <img alt="Coverage" src="./.github/assets/test-coverage.svg" />
</p>

> SDK do Panamah em NodeJs

## 📑 Sobre

O PanamahSDK possibilita o consumo dos serviços do Panamah, permitindo a manipulação e validação de dados, leitura de documentos fiscais e gerenciamento de assinantes de forma prática e segura. A fim de facilitar as integrações e tirar dúvidas de maneira mais rápida, consulte nossa documentação no [Confluence](https://quickdata.atlassian.net/wiki/spaces/PANSDKV2/). O SDK atualmente trabalha com o envio de `Cupons Fiscais` e gerenciamento de assinantes.

## 💻 Pré-requisitos

Antes de começar, verifique se você atendeu aos seguintes requisitos:

- Você instalou o `nodejs` na versão `>=14`
- Você possui o `npm` na versão `>=6`
- Você possui uma `api-key` fornecida pela QuickData
- Você possui credenciais fornecidas pela QuickData

## 🚀 Getting Started

### Instalação

Instale o SDK como dependência:

```sh
npm i panamah-sdk
```

### Configuração de ambiente

O SDK necessita de algumas variáveis de ambiente, por isso é de suma importância que elas estejam cadastradas no momento da utilização. Você poderá conferir todas elas no arquivo `.env.sample`

### Primeiros passos

O SDK dispõe de alguns métodos, detalhes sobre os mesmo serão listados abaixo, mas para uma utilização de envio de dados, existem 3 métodos principais: `PanamahInit`, `PanamahSend` e `PanamahTerminate`. 

> É importante SEMPRE executar o PanamahTerminate ao final da operação, isso irá garantir que tudo será enviado.

Segue um exemplo básico de utilização do SDK: 

```js
const { PanamahInit, PanamahSend, PanamahTerminate } = require("panamah-sdk")


const exec = async () => {
  await PanamahInit({
    username: 'username'
    password: 'password'
  })

  // utilização via path
  await PanamahSend('/path/to/nfe.xml', true)

  await PanamahTerminate()
}

exec()
```

### Métodos expostos

* PanamahInit: Inicialização do SDK, necessário para qualquer ação (exceto a validação de um XML)
* PanamahTerminate: Finalização da utilização do SDK. Irá enviar quaisquer arquivos restantes e finalizar a sessão. 

#### Envio de dados 
* PanamahSend: Envio dos arquivos para uma pasta temporária localmente, os arquivos estão armazenados até algum limite ser alcançado ou uma ação `terminate` for executada. 
* PanamahValidateXML: É possível validar um XML, com isso, será mais fácil de validar e realizar `debugs` no envio.

#### Gerenciamento de assinantes 
* PanamahCreateSubscriber: Criação de um novo assinante
* PanamahGetSubscriber: Busca de assinante
* PanamahUpdateSubscriber: Atualização de assinante  
* PanamahDeleteSubscriber: Desativação de um assinante

### Erros expostos

Todos os erros estão expostos, para mais detalhes, consulte nossa documentação no [Confluence](https://quickdata.atlassian.net/wiki/spaces/PANSDKV2/pages/130449412/Erros)!