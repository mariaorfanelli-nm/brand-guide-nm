# NeuralMind.ai — Brand Guide

Brand guide digital da NeuralMind.ai, incluindo fundamentos visuais, identidade verbal, ativos de marca, templates para documentos, redes sociais, apresentações e reuniões.

## Página publicada

https://mariaorfanelli-nm.github.io/brand-guide-nm/

## Desenvolvimento local

Abra `index.html` no navegador. O projeto é estático e não exige etapa de build.

## Identidade aprovada em 28/10/2026

Proposta 02 do HTML fornecido: Outfit 400 para Neural, Outfit 800 para ind e M aberto da Urbanist 800 em escala de 98%. Tracking −0,02 em; ajuste após M −0,015 em. Sufixo A2: .ai minúsculo, Outfit 400, tamanho integral e mesma linha, margem 0,015 em e tracking zero. Outfit é a família principal em todo o guia, títulos, textos, redes sociais, documentos e slides. Urbanist é a família de apoio para rótulos e números. O kit TTF está em `assets/fonts/neuralmind-fonts.zip`.

`assets/brand/neuralmind-svg-kit.zip` contém 24 SVGs em contornos: NeuralMind, NeuralMind.ai, monograma NM e marca d’água NM (opacidade 12%), em roxo, branco, lilás, preto, bicolor e inverso. Os SVGs independem de fontes instaladas. PNGs de compatibilidade também foram atualizados.

O HTML original está em `lettering-reference.html`. As recomendações contidas no estudo são contexto histórico; a escolha aplicada é proposta 02 + A2, conforme solicitação. Os mockups antigos são preservados nos arquivos 08D.

Para regenerar os SVGs, execute `scripts/apply_logo_outfit_a2.py` com fontTools disponível e o HTML original em Downloads.

## Mídias e templates

A revisão completa usa Outfit em textos e títulos e Urbanist nos rótulos e indicadores. Capas de LinkedIn e YouTube, fundo de reuniões, 16 slides, 27 PNGs sociais/executivos e templates DOCX/PPTX foram atualizados. As fontes locais e o ZIP de instalação ficam em `assets/fonts/`. Estudos históricos de lettering e arquivos arquivados são mantidos como referência.

Regeneração: `python3 scripts/generate_media_assets.py`; `node scripts/export_brand_assets.cjs` (Playwright/Chromium); builders DOCX/PPTX em `scripts/`. Instale o kit TTF para preservar a tipografia ao editar os arquivos do Office.

## Revisão enterprise e arquitetura de marcas

NeuralMind é a marca mãe. As verticais são **NeuralStudio**, **SofIA** e **PrioScan**. NDocs pertence a NeuralStudio, junto a atendimento, chatbots e busca em manuais. SofIA reúne jurídico, regulatório, pré-contencioso e contencioso; inclui QSAMS e **AssrtIA (TCU)**. **Jurema** designa a família de LLMs, não uma vertical adicional. PrioScan é a vertical de saúde, prevenção e apoio à análise de exames médicos.

A revisão crítica preserva fontes e paleta e reduz molduras, sombras e selos, controla a proporção de métricas e ajusta alinhamentos e respiro nas peças. O documento A4 tem instrução mais discreta, corpo com entrelinha maior e hierarquia mais contida. As capas institucionais usam slogan mais legível e régua reduzida.

A seção `#web-system` propõe header, hero, cards de verticais, bloco de evidências, contato, campos e regras responsivas para o futuro site e suas landing pages. É uma proposta visual no guia, com links de demonstração internos; não um formulário comercial conectado.

## Fotografia e proposta editorial do site

A direção corporativa e tecnológica foi aprovada. A galeria `#photography` tem dez imagens: três referências iniciais e sete novas, com GPUs, nó de computação, data center, desenvolvimento individual, estudo, pesquisa em equipe e engenharia de infraestrutura. A navegação oferece filtros, ampliação por teclado e download individual.

O inventário ativo está em `assets/photography/gallery.json`. As imagens são estudos conceituais gerados com ImageGen, não registros da equipe, clientes ou infraestrutura própria. Os prompts estão em `corporate-directions.json` e `gallery-generation-prompts.json`. Estudos de direções anteriores estão preservados, mas não fazem parte da galeria ativa de dez imagens.

O manual [DIRECAO_FOTOGRAFICA_VISUAL.md](DIRECAO_FOTOGRAFICA_VISUAL.md) reúne posicionamento, presença física do roxo profundo, luz, composição, figurino, cenários, formatos e prompts-base para fotos e vídeos. O download está disponível na galeria do guia.

A proposta `#web-system` combina hero fotográfico, mosaico de aplicações, dossiê de caso, percurso de trabalho, abertura de pesquisa e caderno editorial. As pautas e o case são exemplos para futura produção, sem métricas ou artigos inventados.
