# Desafio Back End da Cubos Academy - API de pagamentos :moneybag:



## :computer: Sobre o projeto

Este é o Back End do trabalho final do curso Programação do Zero da Cubos Academy. Trata-se de uma aplicação para cadastro, geração de cobranças e controle de pagamentos através da geração de relatórios. 


## :open_file_folder: Descrição

O projeto é uma API RESTful escrita em JavaScript, integrada com banco de dados (PostgreSQL) e com a API da <a href="https://docs.pagar.me/docs/realizando-uma-transacao-de-boleto-bancario">Pagar.me</a> para geração de boletos bancários. Também é integrada a <a href="https://mailtrap.io/"> Mailtrap.io </a> que simula um servidor SMPT para envio de e-mails automáticos em fase de testes. O projeto possui os seguintes endpoints e funcionalidades:

:white_check_mark: Criar usuário <code>
URL: /usuarios
Método: POST
</code>


:white_check_mark: Login <code>
URL: /auth
Método: POST
</code>

:white_check_mark: Criar Cliente <code>
URL: /clientes
Método: POST
</code>

:white_check_mark: Editar Cliente <code>
URL: /clientes
Método: PUT
</code>

:white_check_mark: Listar Clientes <code>
URL: /clientes?clientesPorPagina=10&offset=20
Método: GET
</code>

:white_check_mark: Buscar Cliente <code>
URL: /clientes?busca=texto da busca&clientesPorPagina=10&offset=20
Método: GET
</code>

:white_check_mark: Criar cobrança <code>
URL: /cobrancas
Método: POST
</code>

:white_check_mark: Listar cobranças <code>
URL: /cobrancas?cobrancasPorPagina=10&offset=20
Método: GET
</code>

:white_check_mark: Pagar cobrança <code>
URL: /cobrancas
Método: PUT
</code>

:white_check_mark: Obter relatórios <code>
URL: /relatorios
Método: GET
</code>

