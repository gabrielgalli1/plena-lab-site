# Área de revendedores — operação e implantação

## Modelo aprovado nesta solicitação

A Plena-Lab verifica o CNPJ e aprova o revendedor por contato direto. Depois envia o link e uma credencial compartilhada. A página apresenta a lista completa em Excel e doze PDFs separados por categoria. Não há banco de dados nem cadastro de clientes.

Uma credencial compartilhada pode ser repassada. Também é possível repassar um arquivo já baixado. O sistema exige autenticação para entregar os arquivos, mas não controla o que o revendedor faz com o material recebido nem revoga apenas uma empresa. A troca da senha invalida as sessões anteriores quando a nova configuração é carregada. Se o controle individual se tornar necessário, o modelo de acesso deverá evoluir.

## Organização dos arquivos

- `dist/`: única raiz pública, com as páginas, CSS, JavaScript e o catálogo institucional público.
- `app/revenda/`: PHP de autenticação, apresentação e manifesto de documentos, **fora da raiz pública**.
- Pasta privada: **fora de dist e do Git**, contendo `config.php`, `files/` e `runtime/`.
- `tools/`: ferramentas locais; não copiar para a pasta pública.

Nesta estação, os documentos reais ficam em `work/revendedores/privado` do workspace, fora deste repositório. Os nomes normalizados da pasta `files/` são definidos em `app/revenda/documentos.json`. O Excel original foi preservado com sua proteção própria, independente da senha de acesso ao site.

As treze cópias são os arquivos recebidos, sem conversão ou remoção de proteção. Não colocar previews, thumbnails de tabelas de preços, extrações de preços ou cópias temporárias dentro de dist.

## Credencial e sessão

- A senha é verificada por `password_verify` contra hash gerado por `password_hash`; não fica no HTML ou JavaScript.
- Sessão no servidor com troca do identificador após login, CSRF em login/saída e cookie HttpOnly/SameSite=Lax. Cookie Secure e conexão HTTPS obrigatórios fora do servidor local em loopback.
- Expiração após 30 minutos sem atividade ou 8 horas desde o login. A senha pode ser trocada para invalidar as sessões existentes.
- Seis falhas em uma janela de dez minutos geram bloqueio do IP por cinco minutos. O identificador de IP é HMAC; a contagem fica em arquivos privados com bloqueio de escrita. Não se confia em X-Forwarded-For enviado pelo visitante.
- Páginas e arquivos reservados enviam no-store e noindex. Download e visualização passam sempre por `arquivo-revenda.php`, com lista fechada de identificadores. Não há URL direta para o arquivo físico.
- O cookie não usa Secure somente no servidor PHP de desenvolvimento, com flag local explícita, acesso loopback e bind em 127.0.0.1. Essa exceção não é uma configuração de produção.

## Definir ou trocar a credencial

Para a primeira prévia local, use o endereço de configuração indicado no README. A rota não existe na pasta pública e não opera na hospedagem de produção.

Para criar ou trocar a configuração por ferramenta local:

`./tools/configurar-acesso.ps1 -PrivatePath PASTA_PRIVADA -PhpPath CAMINHO_DO_PHP`

A senha é solicitada de forma oculta, confirmada e enviada ao PHP pela entrada padrão. Não usar senha como argumento de comando. A ferramenta grava somente o hash e a chave interna em `config.php`; nenhum valor secreto é exibido. Usuário: 3 a 64 caracteres ASCII permitidos. Senha: pelo menos 14 caracteres e até 72 bytes; preferir frase longa e exclusiva.

## Preparar a Locaweb — somente após autorização de publicação

1. Validar o plano, execução PHP atualizada e suportada, HTTPS e possibilidade de armazenamento fora da pasta pública. Os testes locais foram feitos com PHP 8.5; a hospedagem final ainda não foi testada. Se a plataforma servir apenas arquivos estáticos, não publicar esta área ali.
2. Fazer backup do conteúdo e da configuração atual da hospedagem antes de alterações. Não alterar domínio/DNS como parte desta etapa.
3. Colocar o conteúdo de `dist` na raiz pública (ex.: public_html), e `app` ao lado dela, de forma que o include de `revendedores.php` encontre `../app/revenda/bootstrap.php`.
4. Criar a pasta privada fora da raiz pública, transferir `files/` com os documentos e a configuração gerada localmente e reservar `runtime/` para escrita pelo processo PHP. Não transferir ferramentas de teste, renders, arquivos do workspace ou scripts de desenvolvimento para a raiz pública.
5. Configurar `PLENA_REVENDA_PRIVATE` com o caminho absoluto da pasta privada ou copiar `app/revenda/ambiente.exemplo.php` como `ambiente.php`, substituindo o caminho. `ambiente.php` é ignorado pelo Git. Manter `display_errors=Off`, log de erros não público e permissões mínimas; somente runtime e a configuração administrada precisam de escrita conforme a operação.
6. Manter HTTPS obrigatório no domínio. Não habilitar PLENA_LOCAL. Em instalação com proxy reverso, validar a indicação de HTTPS do servidor sem confiar em cabeçalhos arbitrários do cliente.
7. Validar compatibilidade do .htaccess (Apache), redirecionamento antigo revendedores.html, ausência de listagem de diretórios e que nenhuma pasta privada é servida. Em outro servidor web, configurar regras equivalentes. A barreira principal é armazenamento fora da raiz pública, não o .htaccess.
8. Antes de liberar o link, testar anonimamente os treze arquivos (bloqueados), login válido, senha incorreta, saída, expiração, troca de senha, PDF inline/range e download Excel, além de computador/celular, cookies Secure, console e links. Não considerar os testes locais substitutos dessa validação na hospedagem real.

## Atualização das listas

Ao trocar a planilha, atualize também a entrada `excel` de `app/revenda/documentos.json`. Informe o ano da tabela em `edition_year` e a data da revisão comercial em `updated_on` no formato `AAAA-MM-DD`. Use `null` nos campos ainda sem confirmação.

Manter backup privado da versão anterior. Atualizar os arquivos em `files/`, respeitando os nomes do manifesto. Preferir envio temporário seguido de troca atômica para evitar downloads incompletos durante atualização. O tamanho é calculado pelo servidor a cada consulta; se o PDF mudar de número de páginas ou a categoria mudar, atualizar o manifesto e revisar antes da liberação. Não oferecer upload para a credencial compartilhada.

O catálogo público de 2026 permanece separado dessas tabelas. Não colocar o Excel ou os PDFs comerciais na pasta pública de downloads nem em URLs externas compartilháveis.

## Referências técnicas

- [PHP: password_verify](https://www.php.net/manual/en/function.password-verify.php)
- [PHP: segurança de sessão](https://www.php.net/manual/en/session.security.ini.php)

Essa implementação reduz exposição por links diretos e por ausência de autenticação; não é garantia contra redistribuição de senha ou arquivos e precisa de validação na configuração real da hospedagem.
