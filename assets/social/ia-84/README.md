# Post — 84% / IA e estratégia

Status: **Instagram aprovado e exportado para PNG em 28/08/2026.**

## Entregas

- `neuralmind-ia-84-instagram-1080x1350.png`: arte aprovada, 1080 × 1350 px, RGB. Captura de navegador convertida em PNG sem redimensionamento; formato e dimensões verificados.
- `legenda-instagram.txt`: legenda pronta para copiar.
- A versão LinkedIn permanece disponível em HTML; não foi exportada nesta etapa.

Abra `../../../ia-84-social.html` em um navegador. Os botões alternam as duas composições:

- Instagram: 1080 × 1350 px (4:5).
- LinkedIn: 1200 × 1200 px (1:1).

A fonte local e as imagens não dependem de serviços externos. `post.css` controla a arte; `preview.js` apenas alterna os formatos e ajusta a escala da prévia.

## Referência visual

Brandguide local: `../../../index.html`, seção Social; tokens em `../../../styles.css`.
Roxo profundo #290241, violeta #9381FF, branco quente #FFFFFC, coral #EF476F. Fonte NeuralMind Sans Square. Manchete e número em peso 500.

Os arquivos `logo-h-branco.png` e `logo-h.png` são cópias sem alterações dos anexos enviados pela usuária. O CSS oculta somente a margem transparente original para alinhar o logo. Os logos novos do brandguide não são utilizados.

## Dado e fonte

- [Exame, 11 de agosto de 2026](https://exame.com/inteligencia-artificial/84-das-empresas-brasileiras-usam-ia-aos-pedacos-o-que-o-dado-revela-sobre-a-maturidade-digital/), atualizada em 12 de agosto de 2026.
- [Relatório original Panorama 2026 — Amcham Brasil / Humanizadas](https://mkt.amcham.com.br/materiais/panorama-2026-amcham-humanizadas.pdf), página 30: 84% dos respondentes afirmam que suas empresas usam IA; amostra com 629 executivos.

O texto “das empresas pesquisadas” evita generalizar a estatística para todas as empresas brasileiras. A amostra tem predominância de médias e grandes empresas. O gráfico é conceitual: os nove blocos não representam percentuais nem quantidade de empresas.

## Rotas de exportação

As URLs abaixo exibem apenas a arte, no tamanho nativo, sem interface de revisão:

- `ia-84-social.html?view=art&format=instagram`
- `ia-84-social.html?view=art&format=linkedin`

Para novas exportações, aguardar o carregamento da fonte e dos logos e capturar `#post` com escala 1, nos tamanhos acima. O PNG Instagram foi conferido visualmente e validado com Pillow. A composição final tem logo centralizado, número e percentual na mesma escala e linha de base, sem régua coral no topo e com maior espaço antes da fonte no rodapé.
