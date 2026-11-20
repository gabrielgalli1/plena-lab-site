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

### Categorias definidas pelo usuário

- Busca simplificada e botões retangulares conforme referência; rótulos e ordem exatos solicitados, incluindo TODOS e MATERIAIS EM INOX E ALUMINIO.
- Nova seleção: 11 categorias e 33 itens. Equipamentos gerais retirados desta prévia; versão anterior preservada no Git. Equipamentos em PP permanece.
- Testados os 12 botões: TODOS mostra 33 itens e cada categoria mostra 3; busca PL097 retorna um item; sem erros JavaScript observados ou transbordamento em 320 px.

### TODOS como diretório visual

- TODOS agora mostra 11 quadros de categoria com imagem conceitual, nome e Acessar categoria, sem itens individuais.
- Cada quadro abre a categoria com os três itens e sincroniza os botões e URL. Busca em TODOS encontra categorias pelo nome e pelos dados dos itens.
- Composição fotográfica conceitual criada com ferramenta integrada de geração de imagens, mantida em assets/categorias-conceituais.png. As imagens são ilustrativas e identificadas no site; não representam fotos de produtos oficiais.
- Prompt utilizado: composição fotográfica de estúdio em grade 4x3, com onze cenas independentes (vidrarias, calibração, porcelanas, ferragens, inox/alumínio, poli, acessórios, rolhas, equipamentos em PP, escovas, papel filtro), fundo claro, sem marcas; última célula vazia.
- Testados os onze links de categoria (três itens cada), ausência de produtos em TODOS, busca PL097, celular de 390 px e capturas desktop/mobile. Sem erros JavaScript ou transbordamento observados.

### Fotos reais da loja na prévia de porcelanas

- Aplicadas fotos da loja virtual aos três itens: gral com pistilo, pistilo com cabo de madeira e pistilo de porcelana, tanto na listagem quanto nos detalhes.
- Arquivos copiados para assets locais, sem edição, recorte ou distorção; apresentação com object-fit contain. Fotos da família não vinculadas a uma medida específica.
- Fontes registradas em FONTES_FOTOS_PORCELANAS.md; nenhuma importação de preços ou alteração das referências.
- Conferido carregamento das três fotos na listagem desktop e detalhe mobile, sem transbordamento horizontal em 390 px. Mantidas as demais categorias.
- Backup anterior preservado no Git; nenhuma publicação.

### Detalhes informativos simplificados

- Removidos os seletores individuais de capacidade e o bloco de referência selecionada dos 33 detalhes. Consulta agora identifica o produto, sem exigir escolha de variação.
- Capacidades e comprimentos apresentados como faixas em texto; outras configurações permanecem descritivas.
- Descrições autorais de uso geral acrescentadas aos 33 itens, sem promessas de resistência, certificação, precisão ou desempenho adicionais.
- Gral com pistilo: capacidades conferidas na página da loja (60 mL a 10.000 mL). Pistilos: comprimentos extraídos da coluna E da aba Porcelanas; pistilo de porcelana também conferido na loja.
- Mantidas fotos, busca por códigos e referências no conjunto de dados; não são mais seleções obrigatórias na interface.
- Testados abertura, busca, consulta, volta e os detalhes em celular; sem seletores antigos ou transbordamento horizontal no fluxo verificado.

### Acabamento visual dos detalhes

- Ajustada composição em duas colunas com foto inteira, título mais destacado, descrição com leitura confortável e resumo de capacidades em fundo suave.
- Categoria repetida removida da ficha; mantida como link para navegação. Consulta como ação principal e loja como ação secundária nos itens com fonte disponível.
- Detalhe abre como vista própria, sem repetir a introdução do catálogo. Ao voltar, a introdução e a posição da listagem são restauradas.
- Estilos isolados em produto-detalhe.css; paleta, tipografia e demais páginas preservadas. Título do item em h1 na vista de detalhe.
- Corrigido nesta página o filtro que apagava a imagem do logotipo no rodapé.
- Conferidos navegação de categorias, abertura/retorno, histórico, redução de movimento e larguras 320/390/768/1024/1440. Sem erros JavaScript ou transbordamento no fluxo testado. Capturas desktop/mobile inspecionadas.
- Gate automatizado da skill: GATE: OFF (no build active); sem alegação de aprovação desse gate. Verificação visual e funcional efetuada com Playwright no projeto existente.

## 2026-11-17 — Catálogo 2026

- Substituída a página demonstrativa de Catálogo por prévia local com capa original, edição, informações do arquivo, abertura em nova aba e download.
- Arquivo recebido preservado integralmente em dist/downloads/catalogo-plena-lab-2026.pdf (54 páginas PDF, 8.787.388 bytes). SHA256 conferido: 439e7a7fbf1bcd79595fe8a41e3beef4e08575d88596719ff9703d43f73f88a0.
- Capa renderizada do PDF e otimizada como WebP para apresentação na página.
- Atalhos para oito linhas apontam para as páginas físicas do PDF (8, 17, 21, 23, 27, 30, 44, 47), distintas da paginação impressa dos spreads. Compatibilidade de posicionamento depende do leitor PDF; índice disponível como alternativa.
- Removidos os botões demonstrativos e textos sobre futura inclusão do arquivo.
- Estilos isolados em catalogo.css, sem alterações à página Produtos. Mantidas identidade, navegação e responsividade.
- Testado download efetivo, nome do arquivo, resposta HTTP 200 e identidade binária. Conferidas larguras 320/390/768/1024/1440 e capturas desktop/mobile; sem erros JavaScript observados ou transbordamento horizontal.
- Nenhuma publicação ou envio ao GitHub nesta etapa. Backup anterior preservado em tag.

### Abertura ilustrada do Catálogo

- Adicionada introdução acima da seção aprovada, com título Conheça nossa linha de vidrarias, texto de apoio solicitado e botão Explorar catálogo.
- Imagem conceitual gerada com ferramenta integrada, em composição clara de vidrarias e solução azul; origem e direção do prompt documentadas em IMAGEM_ABERTURA_CATALOGO.md.
- Texto à esquerda e imagem à direita no desktop, empilhados no celular. Seção de PDF, arquivo, download e atalhos preservados.
- Botão navega para #catalogo-2026 com compensação do cabeçalho fixo. Mantido um h1 por página, redução de movimento e imagens com texto alternativo.
- Conferidos 320/390/768/1024/1440, clique no botão, resposta HTTP do PDF, capturas desktop/mobile. Sem erros JavaScript ou transbordamento observados.
- Prévia local para avaliação; nenhuma publicação.

### Abertura do Catálogo em faixa

- Substituída a introdução em duas colunas por faixa fotográfica horizontal com apenas o título, sem parágrafo e sem botão adicional.
- Imagem conceitual recomposta com ferramenta integrada para proporção 3:1, vidrarias à direita e espaço claro à esquerda. Arquivo atual: assets/catalogo-faixa.webp; versão anterior preservada.
- Mantida a seção aprovada de consulta/download do catálogo e seus atalhos.
- Layout empilhado e faixa compacta no celular. Conferidos 320/390/768/1024/1440/1920, PDF HTTP 200 e capturas desktop/mobile, sem erros JavaScript ou transbordamento observados.
- Alteração local, sem publicação. Backup anterior em tag.

### Polimento editorial e interações do Catálogo

- Faixa e conteúdo aprovados preservados; acabamento de tipografia, espaçamento, capa com fundo discreto e ação de abertura visível.
- Índice com oito miniaturas reais extraídas do PDF, sem modificar o arquivo. Adicionada indicação da página física do PDF para cada atalho. Imagens otimizadas em WebP (total aproximado 247 KB).
- Bloco de atendimento com o azul da marca e botão branco; contraste, foco e navegação mantidos.
- Hover da capa: elevação de 5 px e sombra, mantendo imóvel a área clicável. Índice com realce discreto e deslocamento curto da seta; botões com feedback de pressão. Sem biblioteca nova, autoplay, efeitos contínuos ou rotação falsa.
- prefers-reduced-motion desativa transições e deslocamentos; foco por teclado responde sem animação. Sem JavaScript, conteúdo, links e download permanecem utilizáveis.
- Testados 320/390/768/1024/1440/1920 px, contexto touch, menu e Escape, download efetivo, oito links de seção, links internos e ausência de erros JavaScript no fluxo. Sem transbordamento horizontal observado.
- Conferidas capturas de desktop/mobile e sequências de entrada/saída do hover, normais e reduzidas. Capturas sequenciais com tempos e propriedades registradas; sem medição de FPS ou benchmark de desempenho. Captura por Playwright usada porque o launcher de contexto da skill estava indisponível.
- Referências de organização consultadas: DWK/DURAN (https://www.dwk.com/resource/category/e-catalogs) e Corning (https://www.corning.com/cala/en/products/life-sciences/products/glassware.html). Nenhum texto, imagem ou código dessas páginas foi incorporado.
- Backup em tag; nenhuma publicação ou envio ao GitHub nesta etapa.
- Revisão independente da interação de capa: disposition: ship, limitada às capturas normais/reduzidas e aos estados revisados; nenhuma correção de movimento pendente.

## 2026-11-17 — Revendedores com acesso restrito

- Evolução da reserva visual, autorizada pelo usuário, para login compartilhado em PHP com sessão e sem banco de dados. Aprovação de CNPJ permanece manual com a equipe.
- Novas telas de acesso e biblioteca comercial, busca de categoria, Excel completo e doze PDFs, com visualização/download autenticados. Aplicados identidade, foco e responsividade existentes.
- Documentos reais mantidos em pasta privada do workspace fora de dist e do Git. Nenhuma tabela comercial, credencial, extração de preços ou preview de tabela foi colocado nos assets públicos. Catálogo institucional público permanece separado.
- Senha por hash, rotação/expiração de sessão, CSRF, limite por IP com estado privado, no-store/noindex e lista fechada de identificadores. Entrega suporta HEAD e range de PDF; sem caminho de arquivo controlado pelo usuário.
- Configuração inicial só no servidor local em loopback e somente antes de existir credencial. Rotação por ferramenta CLI com senha oculta. Credenciais aleatórias de teste removidas; usuário definirá o acesso da prévia no próprio navegador.
- Preparado roteiro de implantação PHP/HTTPS/armazenamento privado na Locaweb. Manifesto de hospedagem estática anterior não serve para executar a área restrita; sem publicação nesta etapa.
- Servidor local migrado de Python para PHP na porta 4185. Links de navegação apontam para revendedores.php e URL antiga redireciona. Ajustado roteador para devolver 404 real em caminhos privados/inexistentes; nenhuma exposição de dados ocorreu nos testes.
- Suíte HTTP isolada com arquivos fictícios: 13 cenários aprovados, incluindo ausência de autenticação, CSRF, treze downloads íntegros, range, logout, expiração, troca de senha, limite persistente sem cookie, configuração encerrada e cookie Secure fora do ambiente local.
- Teste adicional com os treze documentos reais: downloads completos autenticados, bloqueio anônimo e após logout, PDF inline, busca, telas desktop/mobile e larguras 320/390/768/1024/1440 sem transbordamento. Arquivos inacessíveis por caminhos diretos. Sessões de teste não reutilizadas para acesso real.
- PHP portátil validado pelo SHA256 oficial, sem instalação global. Arquivos de runtime e dados privados não versionados. Backup anterior em tag.

## 18/11/2026 — Nova apresentação da entrada de revendedores

- Composição integrada: título e imagem ilustrativa existente à esquerda; formulário branco à direita, preservando autenticação e armazenamento privado.
- Etapas de solicitação de acesso movidas para seção própria, com aprovação manual do CNPJ e contato existente.
- Campos, controle de senha, estados de interação e responsividade refinados. Biblioteca interna preservada nesta etapa.
- Backup anterior em work/backups/revendedores-entrada-20261118 (fora do repositório).
- Verificação visual desktop e celular; sem overflow em 1440, 1024, 768, 390 e 320 px. Imagem carregada, foco visível, mostrar/ocultar senha e redução de movimento conferidos; nenhum erro de execução JavaScript observado. PHP sem erro de sintaxe.
- Regressão HTTP: 13 cenários aprovados; download anônimo respondeu 401.
- Taste: GATE: OFF (no build active). Gate não validou esta página; verificação realizada diretamente na prévia PHP com Playwright.
- Alterações locais, sem publicação.

## 18/11/2026 — Biblioteca de revendedores

- Lista completa em Excel destacada em faixa azul com identificação de formato, tamanho e ação de download.
- Doze PDFs organizados em blocos com imagem ilustrativa por categoria; três colunas no computador, duas em telas intermediárias e uma no celular. Imagens conceituais existentes reaproveitadas; Equipamentos usa imagem ilustrativa de laboratório já existente. Nenhuma miniatura expõe a tabela comercial.
- Ações Visualizar PDF e Baixar identificadas por categoria para leitores de tela; busca preservada com tratamento de acentos, contagem e estado vazio.
- Estados de hover, pressão, foco e redução de movimento preservados; apoio comercial integrado ao fim da biblioteca.
- Backup anterior: work/backups/revendedores-biblioteca-20261118, fora do repositório.
- PHP sem erros de sintaxe; diff sem erros de whitespace. Playwright: sem overflow em 1440, 1024, 768, 390 e 320 px; busca, vazio, foco por Tab, redução de movimento e 24 links HEAD aprovados, sem erros de console ou execução observados. Download do Excel acionado e cancelado após identificar o arquivo; leitura parcial autenticada do PDF respondeu 206, assinatura PDF e sem cache.
- Regressão HTTP isolada: 13 cenários de autenticação, expiração, downloads e bloqueio de acesso aprovados.
- Taste: GATE: OFF (no build active); não houve validação pelo gate. Conferência visual realizada diretamente na prévia PHP com Playwright, em computador e celular.
- Alterações somente locais; arquivos comerciais e credenciais continuam fora da pasta pública e do Git.

## 18/11/2026 — Banner de boas-vindas aos revendedores

- Banner público antes da introdução: Para quem leva a Plena-Lab mais longe, mensagem dirigida à revenda e botão de acesso direto ao formulário.
- Imagem ilustrativa de trabalho com vidro já existente no projeto, com identificação visível; introdução, login e biblioteca preservados.
- Um único h1; título anterior passa a h2. Âncora do formulário com distância do cabeçalho fixo. Biblioteca autenticada continua abrindo diretamente nos materiais.
- Backup anterior: work/backups/revendedores-banner-20261118, fora do Git.
- PHP validado; conferência visual em computador e celular, imagem carregada e sem overflow em 1440, 1024, 768, 390 e 320 px. Botão chega ao formulário abaixo do cabeçalho; redução de movimento respeitada. Download anônimo permanece 401. Sem erros JavaScript observados na navegação.
- Taste: GATE: OFF (no build active); conferência realizada diretamente na prévia PHP com Playwright.
- Alterações locais, sem publicação.

## 18/11/2026 — Checklist de diferenciais no banner

- Incluídos os três diferenciais solicitados pelo usuário: Preços competitivos, Equipe especializada e Materiais de qualidade.
- Lista semântica com ícones de confirmação decorativos em azul, antes do botão de acesso. Nenhuma condição comercial ou especificação adicional criada.
- Backup em work/backups/revendedores-beneficios-20261118. PHP sem erro de sintaxe; verificação visual desktop e celular; três itens presentes e sem overflow em 1440, 768, 390 e 320 px. Sem mudanças no processamento de login ou downloads.
- Alteração salva localmente, sem publicação.

## 18/11/2026 — Menu institucional azul

- Cabeçalho global com fundo #092AC6, links e indicador de página atual em branco; botão de loja branco com texto azul.
- Logo original preservado, apresentado em branco por composição CSS, sem criar ou substituir a marca. Menu mobile acompanha o azul, controles com foco branco e estados de interação.
- Atualização da versão da folha global nas páginas e no template PHP para evitar cache antigo; ajuste do foco específico de Produtos.
- Backup em work/backups/menu-azul-20261118, fora do repositório.
- Conferência visual desktop e celular. Seis páginas principais responderam 200 com cabeçalho azul e links/foco brancos. Sem overflow em 1440, 1024, 881, 880, 768, 390 e 320 px. Menu abre, fecha por Esc, restaura inert e respeita redução de movimento. Nenhum erro de execução JavaScript observado. Diff sem erros de whitespace.
- Taste: GATE: OFF (no build active); validação visual direta com Playwright na prévia local.
- Nenhuma publicação; alterações salvas localmente.

## 19/11/2026 — Prévia com padrão visual compartilhado

- Aplicada a direção autorizada pelo usuário: fonte única Manrope, cabeçalho branco, branco predominante, azul da marca e neutros consistentes.
- Criado dist/sistema-visual.css, carregado por último em todas as páginas e no template de revendedores. Paleta equivalente das folhas específicas consolidada em variáveis compartilhadas, sem alterar fotografias ou PDFs.
- Títulos de abertura 56/44/36 px conforme largura; seções 36/32/28 px; títulos de componente 28/24 px; texto de leitura 16 px e botões 14 px, mínimo de 52 px e raio de 6 px. Metadados preservam escala compacta conforme sua função.
- Blocos de atendimento, revenda e Excel usam o mesmo fundo claro com ações azuis. Experiência do béquer e seção de fabricação preservadas. Logo original mantido, sem filtro branco.
- Padrão documentado em DESIGN.md para orientar próximas alterações.
- Backup integral da pasta pública e do template em work/backups/padronizacao-visual-20261119; tag backup-antes-padronizacao-visual-20261119.
- Verificação: seis páginas com HTTP 200, Manrope e títulos/botões conforme os tokens. Sem overflow em 1440, 1024, 768, 390 e 320 px. Biblioteca autenticada também conferida em 1440/768/390/320 px, com 12 categorias, busca, login e logout funcionando. Produto da categoria Porcelanas abre com título em escala de seção; PDF público responde 200; menu mobile branco abre, fecha por Esc e mantém foco visível. Redução de movimento respeitada. PHP sem erro de sintaxe; 13 testes HTTP de proteção da revenda aprovados; nenhum erro JavaScript observado.
- Capturas visuais após carregamento de fontes/imagens; animações finitas desativadas somente na captura para registrar o estado final, sem alteração do funcionamento da página.
- Taste: GATE: OFF (no build active); validação realizada diretamente no servidor PHP com Playwright, sem declaração de aprovação do gate.
- Prévia salva localmente para avaliação; sem publicação ou envio ao GitHub.
