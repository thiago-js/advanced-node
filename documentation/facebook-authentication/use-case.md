# Autenticação com facebook

> ## Dados
* Token de acesso

> ## Fluxo primário
1. Obter dados (nome, email, e Facebook Id) da Api do Facebook
2. Consultar se existye um usuário com o email recebido acima
3. Criar um conta para o usuario com os dados recebidos Facebook
4. Cria um token de acesso, a partir do ID do usuário, com expiração de 30 minutos 
5. Retornar o token de acesso gerado

> ## Fluxo alternativo: Usuário já existe
1. Atualizar a conta do usuário com os dados recebidos FAcebook (Facebook Id e node - só atualixar o nome caso a conta do usuário não possua nome)

> ## Fluxo de exceção: Token inválido ou expirado
1. Retornar um rro de autenticação
