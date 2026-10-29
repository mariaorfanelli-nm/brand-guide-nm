# Inteligência para decisões — direção fotográfica editorial

Recriação da prova de conceito após pesquisa de design, revisão de narrativa e implementação por três agentes especializados. Site local em `index.html`, no contexto do Brand Guide.

## Direção de arte

Ensaio fotográfico sobre o trabalho de decidir. Fotografias amplas, materialidade, luz natural e presença humana são a base da composição. A hierarquia vem de escala, enquadramento, contraste e respiro. Sem diagramas, documentos desenhados ou cartões de interface como linguagem visual.

Referências pesquisadas:

- [SOM](https://www.som.com/) e [abordagem computacional ao design](https://www.som.com/story/pioneering-a-computational-approach-to-design/): especialização técnica e narrativa editorial fotográfica.
- [Aesop — espaços](https://www.aesop.com/de/en/r/store-experience/): materialidade e cor no ambiente.
- [Pentagram](https://www.pentagram.com/): confiança na imagem e composição editorial.
- [McKinsey — dados e decisões](https://www.mckinsey.com/capabilities/tech-and-ai/how-we-help-clients/turning-data-into-decisions-lessons-from-professional-cycling): situação, informação e decisão como narrativa.

São referências de princípios visuais e narrativos; a composição é própria para NeuralMind.

## Narrativa e proposta de valor

“Inteligência para…” alterna jurídico, compras e operações, terminando em decisões. Após a abertura, uma seção apresenta o conceito de inteligência para decisão, seguida diretamente pelos produtos. Não pressupõe integração de ponta a ponta entre produtos.

NeuralStudio reúne documentos, atendimento, chatbots e busca em bases internas; NDocs é aplicado a matrículas. SofIA cobre jurídico e regulatório, incluindo AssrtIA (TCU). PrioScan apoia análise de exames e prevenção, em contexto de saúde. Jurema é a família de LLMs da NeuralMind. Compras é um contexto empresarial da chamada, sem promessa de produto de procurement.

A tecnologia apoia. As pessoas decidem.

## Fundamentos no projeto

- `../README.md`: identidade e arquitetura de marcas.
- `../index.html#verbal`: essência e linguagem da marca.
- `../DIRECAO_FOTOGRAFICA_VISUAL.md`: direção fotográfica aprovada.
- `../assets/photography/gallery.json`: inventário e proveniência das imagens.
- `../assets/fonts/brand-typography.css`: Outfit e Urbanist.
- `../assets/brand/`: logos oficiais.

## Fotografias e limites

As imagens em `assets/photography/` são estudos fotográficos conceituais gerados, conforme o inventário do Brand Guide. Não são registros documentais de clientes, equipe ou infraestrutura própria. A fotografia de equipe em `assets/photos/team-neuralmind-slide.jpg` vem do material institucional existente. Não há modelos de IA ou integrações executando no site, nem métricas ou cases inventados.

## Preparação de imagens

As versões WebP em `images/` foram exportadas dos arquivos existentes, sem modificar seus originais. A compressão reduz o volume transferido; não altera a proveniência das fotografias.

## Verificação da recriação

JavaScript passou em `node --check`; links e assets locais foram conferidos. Revisão visual em desktop e celular de 390 × 844: abertura, capítulo de compreensão e pesquisa. Fotografias carregadas, ausência de transbordamento horizontal no celular e destino de contato confirmado. Rolagem nativa e mudança de fotos por capítulo verificadas. Esta revisão não substitui uma auditoria completa de acessibilidade.

## Estrutura atual

Abertura fotográfica com título animado e subtítulo amplo, sem chamada auxiliar ou CTA. Por que IA corporativa → produtos → Jurema → blog → mídia → apoiadores → contato. O percurso intermediário encontrar/compreender/decidir foi retirado para dar mais clareza e acesso direto ao portfólio.

## Produtos em destaque

NeuralStudio, SofIA e PrioScan ganham composições fotográficas próprias, nomes ampliados e textos curtos sobre os problemas que apoiam. O layout alterna foto e texto no desktop; no celular, mantém a foto antes do conteúdo. A apresentação não simula resultados, interfaces ou endosso das pessoas retratadas.

Fotografia clínica de PrioScan: [SHVETS production / Pexels](https://www.pexels.com/photo/doctor-looking-at-an-x-ray-8413323/), utilizada como contexto ilustrativo sob a [licença Pexels](https://www.pexels.com/license/). Arquivo otimizado: `images/prioscan-medical.webp`. Não retrata clientes, equipe ou uso real do produto. As fotografias de NeuralStudio e SofIA são os estudos conceituais já existentes no Brand Guide.

Verificados carregamento das imagens, CTA de cada produto e layout desktop/celular 390 × 844, sem transbordamento horizontal.

## Por que IA corporativa?

O botão da abertura foi restaurado. A seção seguinte responde por que uma empresa precisa de IA pensada para seu ambiente: permissões de acesso, regras do negócio, conexão às bases, compliance e engenharia contínua de operação. A proposta NeuralMind considera essas necessidades desde a concepção, sem afirmar ausência de configuração ou garantia universal de compliance. Os produtos aparecem após essa fundamentação.

A referência inexistente a QSAMS foi removida da página, do guia e das fontes textuais de marca e slides.

## Ajustes de ritmo e portfólio

A chamada alterna áreas a cada 850ms, com transição de 180ms. Em “decisões”, permanece 3,2s antes de reiniciar. Há controle de pausa; a animação suspende fora da abertura ou em aba oculta. Movimento reduzido mantém a chamada estática em decisões.

Introdução de “Por que IA corporativa?” centralizada. Legendas retiradas das fotos dessa seção e dos produtos. NeuralStudio apresentado como suíte para conhecimento, análise e extração de dados empresariais, incluindo documentos, manuais e matrículas de imóveis. SofIA: inteligência para o jurídico e regulatório, sem lista de subprodutos.

Foto de NeuralStudio corrigida com a ferramenta integrada ImageGen: `images/neuralstudio-study-v2.webp`. A tampa do notebook agora é opaca e não mostra conteúdo de tela. Imagem conceitual; não é registro da equipe.

## Expansão do site e reaproveitamento do conteúdo atual

A home preserva a direção fotográfica e passa a apresentar o slider de clientes logo abaixo da hero. As seções de equipe e pesquisa foram removidas; Jurema ganha um bloco próprio com dois destinos reais: modelo open source e API.

Novas páginas estáticas: `sofia.html`, `prioscan.html`, `jurema.html`, `blog.html`, `contato.html` e `trabalhe-conosco.html`. A navegação e o rodapé conectam todas as páginas. NeuralSearchX não tem página nem item de navegação; a vertical de conhecimento é NeuralStudio.

- [Home atual NeuralMind](https://neuralmind.ai/): nove logos de clientes, dez de apoiadores e cinco veículos de mídia com seus links. Arquivos locais em `logos/`; inventário em `content/source-inventory.json`.
- [SofIA na ANS](https://neuralmind.ai/sofia): leitura de documentos com OCR, classificação de demandas e relatório preliminar para revisão do analista.
- [PrioScan no HCPA](https://www.hcpa.edu.br/4648-ferramenta-de-ia-usada-no-clinicas-ganha-premio-internacional): parceria, apoio à priorização de radiografias e reconhecimento em 2026. O case não afirma certificação ou substituição do radiologista.
- [Projeto Jurema](https://neuralmind.ai/jurema), [modelo no Hugging Face](https://huggingface.co/Jurema-br/Jurema-7B) e [plataforma da API](https://jurema.ai/pt-BR): dois caminhos de acesso e página dedicada, mantendo o modelo como base tecnológica, não quarta vertical.
- [Blog atual](https://neuralmind.ai/blog): oito artigos com títulos, datas e links reais, organizados por tema. Não foram criados artigos fictícios; o conteúdo integral permanece no blog atual.
- [Carreiras](https://neuralmind.ai/trabalhe-conosco): princípios e banco de talentos. Contato existente `talentos@neuralmind.ai`.
- [Contato](https://neuralmind.ai/contato): canal comercial e perguntas iniciais. Contato existente `contato@neuralmind.ai`.

Mídia e clientes avançam automaticamente, com controles anteriores/próximos e pausa, além de rolagem por toque e teclado. A rotação pausa com mouse, foco de teclado, aba oculta e movimento reduzido. Logos preservam o desenho do site atual, com contraste sobre roxo. Os formulários validam campos e preparam uma mensagem no aplicativo de e-mail do visitante, sem simular entrega de servidor. Não foram conectados CRM ou banco de currículos.

Verificação: sete páginas com referências locais e âncoras válidas, JavaScript validado, revisão visual desktop e celular (390 × 844) de todas as rotas, filtro do blog e menu móvel conferidos. Links externos preservados ou conferidos em fontes oficiais; não é auditoria integral de acessibilidade ou disponibilidade de serviços externos.

## Sliders automáticos e logo HCPA

Clientes avançam a cada 2,6s; reportagens, a cada 6s. O ciclo retorna ao início. Há pausa manual e suspensão quando a seção não está visível, ao interagir com mouse/teclado e quando o visitante prefere movimento reduzido.

Logo do HCPA substituído pelo arquivo de maior qualidade do [site oficial do hospital](https://www.hcpa.edu.br/images/headers/mobile_logo_HCPA.png), salvo em `logos/hcpa-official.png`. A apresentação usa tamanho próprio para tornar o nome legível, preservando o desenho e a versão branca da marca.

## Sobre a NeuralMind: números, modelos e founders

A seção institucional usa dois números em destaque (2017 e mais de 60%), links visuais para BERTimbau e Jurema e retratos com pequenas bios de Patricia Magalhães e Roberto Lotufo. As referências das bios estão em `content/founders-sources.json`; retratos reaproveitados do guia de marca.

Jurema integrado à seção institucional da home: modelo open source, API, página do projeto e créditos de FINEP e Escavador ficam junto ao BERTimbau. Removida a seção exclusiva do Jurema na home.
