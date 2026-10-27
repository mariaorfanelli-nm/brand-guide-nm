---
name: neuralmind-word-documents
description: Gere documentos Word institucionais da NeuralMind usando o modelo A4 aprovado, com capa roxa, margens, cabeçalhos, rodapés, tabelas e identidade visual da marca.
---

# Documentos Word NeuralMind

Crie ou adapte documentos `.docx` institucionais da NeuralMind a partir de `assets/template.docx`. O arquivo de referência é a autoridade visual: preserve sua configuração de página, estilos, hierarquia, cabeçalhos, rodapés e tabelas, exceto quando o usuário pedir uma alteração explícita.

## Fluxo

1. Copie `assets/template.docx` para um novo arquivo de trabalho. Nunca altere o modelo original dentro da skill.
2. Use o conteúdo fornecido pelo usuário para substituir os textos entre colchetes. Não invente fatos para preencher campos ausentes.
3. Remova todas as orientações do modelo, textos entre colchetes não utilizados e páginas vazias antes de entregar.
4. Preserve a identidade descrita em `references/brand-and-layout.md`.
5. Gere o resultado em `.docx`. Quando houver suporte para renderização, converta-o temporariamente em PDF ou imagens e revise todas as páginas antes da entrega.

## Regras essenciais

- A capa deve continuar A4, roxa e sem borda branca.
- Mantenha aproximadamente 3,2 cm de margem interna lateral na capa.
- Centralize o logo da capa em relação à página inteira.
- Não adicione slogans, “Princípio orientador”, linhas decorativas ou caixas de destaque sem solicitação explícita.
- Escreva títulos claros e texto direto. Evite linguagem promocional genérica.
- Preserve margens, cabeçalho, rodapé, numeração e estrutura das tabelas nas páginas internas.
- Ajuste quebras e espaçamentos para evitar conteúdo comprimido, linhas órfãs, tabelas cortadas ou grandes lacunas acidentais.

## Logo provisório

O modelo contém o logo legado, mantido como placeholder aprovado para esta versão. Se o usuário fornecer o logo novo:

- substitua as versões branca da capa e colorida dos cabeçalhos;
- mantenha proporção, nitidez, transparência e texto alternativo;
- preserve a centralização da capa e a posição dos cabeçalhos;
- não redesenhe nem reconstrua o logo por conta própria.

Os arquivos provisórios estão em `assets/logo-legacy-white.png` e `assets/logo-legacy-color.png`.

## Verificação final

Confirme que:

- a capa cobre toda a página e o logo está centralizado;
- o texto da capa tem margem lateral confortável;
- não restaram slogans, instruções ou placeholders;
- cabeçalhos e rodapés aparecem em todas as páginas internas;
- tabelas, listas e títulos não estão cortados ou sobrepostos;
- o arquivo final abre como Word editável.

