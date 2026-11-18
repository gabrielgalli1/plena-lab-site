# Registro de alterações

## 2026-11-14

- Importação da versão original do pacote de continuidade, sem alterações no HTML, CSS, JavaScript ou imagens.
- Inclusão de instruções de desenvolvimento e regras de versionamento.

## 2026-11-15 — Prévia local de vidrarias

- Página Produtos com busca por nome, referência e capacidade, filtros por tipo e detalhes no próprio site.
- Três famílias da aba Vidraria: béquer Griffin (16 capacidades), Erlenmeyer boca estreita (13) e proveta com base hexagonal de vidro (9).
- Dados limitados a características, capacidades e referências; sem preços de revenda ou especificações adicionais presumidas.
- Espaços reservados às fotos, conforme solicitado. Demais páginas e identidade existentes preservadas.
- Conferência em desktop, tablet e celular (320/390 px), navegação de histórico, links locais, JavaScript desativado e redução de movimento. Sem erros JavaScript observados.
- Backup anterior preservado em tag; trabalho na branch previa/vidrarias. Nenhuma publicação realizada.
- Observação de revisão: o rodapé original apresenta bloco branco no lugar da marca; ajuste pendente fora desta prévia.

## 2026-11-17 — Introdução e categorias

- Recuperação da introdução e imagem conceitual do modelo original antes da pesquisa.
- Inclusão das 12 categorias de produtos/serviços da lista, com 3 itens cada (36 itens): Vidrarias, Certificados, Rolhas de borracha e silicone, Porcelanas, Ferragens, Material em aço inox, Material em poli, Acessórios, Equipamentos em PP, Equipamentos, Escovas e Papel filtro/cartuchos de extração.
- Certificados apresentados como serviço sob consulta. Termos e índice não são categorias comerciais.
- Opções de medidas/modelos/referências extraídas de cada layout de aba. Referência ausente indicada como sob consulta; não foram inferidas unidades ausentes nas medidas de papel filtro.
- Preservadas as 38 capacidades originais de vidraria. Fotografias individuais e preços não incluídos.
- Teste das 12 categorias: exatamente 3 itens por filtro; busca por código, seleção de opção e detalhe conferidos. Sem erros JavaScript observados ou transbordamento horizontal em 390 px.
- Backup anterior em backup-antes-categorias-2026-11-17. Sem publicação.

### Organização por categoria

- Separação dos 36 itens em 12 seções com título e contagem próprios; cada categoria mostra seus três itens juntos, inclusive sem JavaScript.
- Busca e filtros ocultam seções sem resultados e atualizam a contagem por grupo.
- Conferidos os 12 grupos, filtro Porcelanas, busca por PL097, estado vazio e ausência de transbordamento horizontal em celular.

### Navegação por botões de categoria

- Substituída a coluna lateral por botões abaixo da busca, conforme referência do usuário.
- Cada botão mostra somente os três itens da categoria escolhida, com destaque azul; Todas permite consultar o conjunto organizado.
- Seleção preservada na URL e operável por teclado. Testados os 12 botões, celular de 390 px e contagens dos resultados, sem erros JavaScript observados.

### Correção de navegação e responsividade

- Substituídos rádios adaptados por botões nativos com aria-pressed e foco visível.
- Troca de categoria limpa a busca anterior e mostra os três itens correspondentes; URL e histórico registram a seleção.
- Abertura dos detalhes usa navegação controlada; retorno restaura foco e posição da listagem.
- Removidas regras antigas da coluna lateral. Corrigida quebra de texto de opções longas em telas estreitas e atualizadas URLs de CSS/JS para evitar mistura com versões em cache.
- Verificados todos os 12 filtros, busca PL097 com seleção automática de 250 mL, alteração por teclado, histórico voltar/avançar, estado vazio, reset, fallback dos 36 itens sem JavaScript e acesso direto ao detalhe.
- Conferidos os 36 detalhes em 320 px e layout em 320, 390, 768 e 1440 px. Sem transbordamento horizontal ou erros JavaScript observados no fluxo testado. Conferência visual em desktop e celular.
