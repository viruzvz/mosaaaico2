# mosaaaico2

O `mosaaaico2` é um conjunto de convenções sobre o `webpack` que simplifica
o desenvolvimento de protótipos web ao eliminar o processo de configuração.

## instalação

Para instalar o `mosaaaico2` e criar o esqueleto do projeto, execute
em um diretório de sua escolha:

```bash
env TEMPLATE=true yarn add fabianonunes/mosaaaico2 --dev
```

Ao setar a variável `TEMPLATE=true`, a estrutura de diretórios será
criada e alguns arquivos de configuração serão incluídos
(`.editorconfig`, `.gitignore` e `.gitattributes`).

## entradas

As `entradas` são os arquivos que serão processados pelo `webpack`.
Elas podem ser de três tipos: html, folhas de estilos ou javascripts.

Os HTML


Todo arquivo `[nome].html` ou `[nome].pug` na pasta `src` será publicado na raiz do servidor local.

Nas entradas que produzam HTML serão injetadas automaticamente as referências `link:href` e `script:src` para os seguintes arquivos (caso existam):

* folhas de estilos (css, less ou scss):
  * `src/css/vendors.css`
  * `src/css/main.css`
  * `src/css/[nome].css`
* scripts:
  * `src/js/vendors.js`
  * `src/js/main.js`
  * `src/js/[nome].js`

## modo desenvolvimento

O modo de desenvolvimento é iniciado com o comando `yarn dev`.
Quando executado,um servidor na porta `8000` será iniciado localmente.

Para alterar a porta, passe a variável `PORT` via linha de comando:

```bash
env PORT=9090 yarn dev
```
