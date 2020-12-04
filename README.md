# Desafio Back End da Cubos Academy - API de pagamentos :moneybag:



## :computer: Sobre o projeto

Este é o Back End do trabalho final do curso Programação do Zero da Cubos Academy. Trata-se de uma aplicação para cadastro, geração de cobranças e controle de pagamentos através da geração de relatórios. 


## :open_file_folder: Descrição

O projeto é uma API RESTful escrita em JavaScript, integrada com banco de dados (PostgreSQL) e com a API da <a href="https://docs.pagar.me/docs/realizando-uma-transacao-de-boleto-bancario">Pagar.me</a> para geração de boletos bancários. Também é integrada a <a href="https://mailtrap.io/"> Mailtrap.io </a> que simula um servidor SMPT para envio de e-mails automáticos em fase de testes. O projeto possui os seguintes endpoints e funcionalidades:

:white_check_mark: Criar usuário <code>
URL: /usuarios
Método: POST
</code>

O cadastro do usuário ou usuária é feito a partir de nome, e-mail e senha e retorna o id do/a usuário/a criado/a. A senha é encriptada com bycrypt antes de ser salvado no banco de dados. 

:white_check_mark: Login <code>
URL: /auth
Método: POST
</code>

O login pede e-mail e senha e retorna o token da sessão que deverá ser utilizado para as demais funcionalidades. 

:white_check_mark: Criar Cliente <code>
URL: /clientes
Método: POST
</code>

Com o/a usuário/a devidamente logado, ele/ela pode criar sua lita de clientes, passando nome, cpf, e-mail e telefone. A aplicação retorna o id do/a cliente criado/a, que será necessária para a funcionalidade de edição

:white_check_mark: Editar Cliente <code>
URL: /clientes
Método: PUT
</code>

Clientes podem ser atualizadados a partir do id, passando-se dados cadastrais. É proibido que o/a usuário/a edite um cliente criado por outro/a. 

:white_check_mark: Listar Clientes <code>
URL: /clientes?clientesPorPagina=10&offset=20
Método: GET
</code>

Ao buscar o/a cliente no banco de dados, a aplicação busca também as cobranças associadas a ele/ela com os respectivos valores, identifica se foram pagas ou não e informa se o/a cliente está indadimplente. 
:warning: Essa funcionalidade deve ser aprimorada para permitir uma busca/limitação por data - pensando na escalabilidade da aplicação (por exemplo: buscar as cobranças apenas do ano corrente e criar um histórico para as demais). Por padrão, são exibidos 10 resultados por página e o offset é zero. 

:white_check_mark: Buscar Cliente <code>
URL: /clientes?busca=texto da busca&clientesPorPagina=10&offset=20
Método: GET
</code>

Aqui trata-se, na verdade, do mesmpo endpoint anterior e a diferenciação é feita dentro da função correnspondente. Permite que um/uma cliente seja encontrado/a através do nome ou e-mail, passados na query da url. 

:white_check_mark: Criar cobrança <code>
URL: /cobrancas
Método: POST
</code>

Cria cobranças para o/a cliente exigindo na entrada id do/a cliente, descrição da cobrança, valor e data de vencimento. A aplicação, através da API da Pagar.me, gera um boleto (boleto_url) e código de barras (boleto_barcode) e os envia automaticamente para o e-mail do/a cliente (nodemailer). 

:white_check_mark: Listar cobranças <code>
URL: /cobrancas?cobrancasPorPagina=10&offset=20
Método: GET
</code>

Na listagem das cobranças, cada uma tem um status associado: "PAGO", "AGUARDANDO" ou "VENCIDO". Por padrão, são exibidos 10 resultados por página e o offset é zero. 

:white_check_mark: Pagar cobrança <code>
URL: /cobrancas
Método: PUT
</code>

Atualiza a cobrança para "paga" (BOOL no banco de dados) e guarda a data do pagamento.

:white_check_mark: Obter relatórios <code>
URL: /relatorios
Método: GET
</code>

Devolve relatório geral para o/a usuário/a indicando o número de clientes adimplentes e inadimplentes, o número de cobranças pagas e a receber e o valor do saldo em conta. 

## 🧭 Organização do cógigo

Além dos arquivos da raiz, a pasta 'src' contém cinco pastas: nos controllers estão, cada uma em seu arquivo correspondente, as funções de autenticação e resposta e as responsáveis pelas cobranças (charges), clientes (clients), usuários/as (users) e relatórios (reports); em middlewares, estão os inteceptadores para criptografia de senha e verificação de sessão; em integrations, as integrações com o bando de dados (database), pagar.me e nodemailer; em repositories estão as funções responsáveis pelas queries para o banco de dados, também divididas nos arquivos correspondentes a ususários/as, clientes e cobranças. Em utils estão as funções de encriptação e comparação de senha, além dos esquemas das tabelas. Todos os endpoints estão no arquivo routes.js. 

## :scroll: Instruções de uso 

Este código roda em Node na porta 8081. Para utilizá-lo inicie com <code> npm install </code> para instalar todas as dependências. Em seguida, rode o arquivo <code> src/utils/schema </code> para montar as tabelas. Na raiz também estão os arquivos de configuração do Eslint e Prettier, utilizados para manter a qualidade na formatação do código. Você pode configurar as seguites variáveis (listadas no .env-exemplo): 

-  DATABASE_URL= 
-  JWT_SECRET=
-  PAGARME_API_KEY=
-  MAILTRAP_HOST=
-  MAILTRAP_USER=
-  MAILTRAP_PORT=
-  MAILTRAP_PW=

## :high_brightness: Tecnologias utilizadas e dependências

Linguagem: JavaScript

- Node.js
- Eslint
- Prettier
- Koa
- Koa-bodyparser
- Koa-router
- Pg(Node Postgres)
- Bcrypt
- jsonWebtoken
- nodemailer
- dotenv
- SQL
- Heroku
- Nodemon
- Pagar.me
- MailTrap

## :bust_in_silhouette: Autora
Carolina Guimarães • dev fullstack em formação
![Twitter Badge](https://img.shields.io/badge/-@carolguimari-1ca0f1?style=flat-square&labelColor=1ca0f1&logo=twitter&logoColor=white&link=https://twitter.com/carolguimari)
