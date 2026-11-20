# Padrão visual da Plena-Lab

Prévia aplicada em 19/11/2026 para avaliação do usuário, a partir da direção autorizada nesta conversa. Preservar conteúdos, fotografias e fluxos existentes. Não publicar sem autorização expressa.

## Fonte única e hierarquia

Manrope em todo o site, nos pesos 400, 500, 600 e 700; 800 permanece disponível para grafismos existentes. Carregamento compartilhado via Google Fonts, com Arial como fallback. Não adicionar outra família por página.

| Papel | Computador | Tablet até 1100 px | Celular até 760 px |
| --- | --- | --- | --- |
| Título de abertura | 56 px | 44 px | 36 px |
| Título de seção e detalhe de produto | 36 px | 32 px | 28 px |
| Título de componente ou chamada de apoio | 28 px | 28 px | 24 px |
| Nome de item | 22 px | 22 px | 20 px |
| Texto de leitura | 16 px | 16 px | 16 px |
| Introdução curta | 18 px | 18 px | 16 px |
| Botão e navegação | 14 px | 14 px | 14 px |

Nomes de categorias na biblioteca e etapas do acesso usam 20 px. Metadados de arquivo, avisos auxiliares e legendas podem usar 12–14 px. Títulos com peso 700, entrelinha de 1,12 a 1,35 e espaçamento entre letras de -0,03 em. Texto de leitura com entrelinha de 1,7 a 1,75.

## Paleta e superfícies

| Uso | Cor |
| --- | --- |
| Marca e ações principais | #092AC6 |
| Hover de ação principal | #071FA2 |
| Texto principal | #07132E |
| Azul-escuro de apoio | #06164F |
| Texto secundário | #526079 |
| Fundo de apoio único | #F3F6FC |
| Divisórias | #DCE4F1 |
| Fundo predominante | #FFFFFF |

Azul nos botões, links e indicadores. Branco e cinza-claro predominam nas páginas e nos blocos de atendimento, login e Excel. Manter a experiência do béquer e a seção de fabricação com seus fundos escuros; seus textos e indicadores usam branco, sem um segundo destaque ciano. Erros mantêm cor semântica própria, não devem ser confundidos com ações da marca. Fotografias e PDFs não são recoloridos.

## Elementos compartilhados

- Cabeçalho branco, logo original azul, navegação escura, indicação da página atual em azul e botão de loja azul com texto branco. Menu mobile segue a mesma direção.
- Botão de conteúdo: altura mínima de 52 px, fonte 14 px/peso 700 e raio de 6 px. Botão compacto de cabeçalho: mínimo de 44 px. Preservar os nomes e destinos das ações.
- Campos: texto de 16 px, altura mínima de 52 px, raio de 6 px e foco azul visível. Campos de busca integrados preservam a composição com o botão próprio.
- Painéis e fotografias enquadradas: raio de 12 px. Controles pequenos usam 6 px. Não aplicar arredondamento a tabelas, fotografias de fundo ou ao produto isolado indiscriminadamente.
- Seções principais: 88 px de espaço vertical no computador e 56 px no celular. Espaço entre colunas: 48, 32 e 28 px conforme a largura. Conteúdo no limite compartilhado de 1180 px.
- Respeitar redução de movimento, manter foco por teclado e não ocultar conteúdo por falha de animação.

## Implementação e manutenção

`dist/sistema-visual.css` contém os tokens e as regras de aparência compartilhados e deve ser carregado por último. `dist/styles.css` mantém o layout institucional; as folhas de Produtos, Detalhes, Catálogo e Revendedores mantêm suas composições e comportamentos específicos. As cores equivalentes dessas folhas agora referenciam os mesmos tokens.

Novas mudanças de fonte, escala, botão ou paleta devem partir desta folha compartilhada. Usar papéis de título ou componente conforme a função, sem criar uma escala exclusiva para cada aba. As páginas podem ter imagens e composições diferentes dentro do mesmo padrão.

O template PHP da área reservada também carrega o sistema. Nenhuma regra visual deve expor listas, preços ou credenciais. O armazenamento privado, a autenticação, o processamento do formulário e as rotas de download permanecem independentes desta padronização.
