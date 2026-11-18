# Site institucional Plena-Lab

Projeto existente em HTML, CSS e JavaScript. A área de revendedores usa PHP para autenticação e entrega restrita dos arquivos, sem banco de dados.

## Desenvolvimento local

Execute no PowerShell `./tools/servidor-local.ps1` e abra http://127.0.0.1:4185/. O script usa o PHP portátil preparado no workspace; também aceita `-PhpPath` e `-PrivatePath` explícitos.

A pasta pública é **dist**. **Não sirva a raiz do projeto**. O servidor Python simples continua adequado apenas para páginas estáticas; ele não executa o login PHP.

Na primeira configuração local, abra http://127.0.0.1:4185/configurar-acesso-local.php e escolha os dados de acesso. Essa rota existe somente no roteador de desenvolvimento, apenas em loopback, e deixa de aceitar configuração depois de salvar. Nunca envie senhas pelo chat ou coloque credenciais no Git.

Veja [REVENDORES_IMPLANTACAO.md](REVENDORES_IMPLANTACAO.md) para armazenamento privado, troca de senha e publicação em hospedagem PHP.

## Teste do controle de acesso

`python tests/revenda_http.py --php CAMINHO_DO_PHP`

O teste usa arquivos fictícios e credenciais aleatórias em uma pasta temporária fora do repositório. Valida login, CSRF, expiração, downloads, troca da credencial, limite de tentativas e parâmetros do cookie; nunca usa as listas comerciais reais.

## Histórico e publicação

Registrar alterações em commits e no CHANGELOG.md. Enviar código ao GitHub guarda o histórico; não autoriza publicar o site. Não configurar implantação automática sem autorização expressa.

Contratos, tabelas comerciais, planilhas, PDFs de revenda, configuração privada e credenciais ficam fora do repositório. Somente o catálogo institucional público está em dist/downloads.

O manifesto de hospedagem estática existente corresponde à proposta pública anterior. Ele não executa PHP e não serve para publicar a área restrita. A publicação oficial precisa de hospedagem PHP, HTTPS e armazenamento fora da raiz pública.
