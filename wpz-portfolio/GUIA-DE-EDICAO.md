# Guia de edição do portfólio WPZ

Edite a pasta `wpz-chrome`. Os arquivos publicados do site ficam em `dist/`. Se estiver usando o ZIP, edite a pasta extraída `wpz-portfolio`.

## Rodar e conferir

Na pasta que contém `package.json`:

```sh
npm run dev
```

Abra http://127.0.0.1:4173. Salve as alterações e recarregue com Ctrl+F5. Para verificar sintaxe e links:

```sh
npm run check
```

Se o HTML aparecer em poucas linhas, use a opção de formatar documento do seu editor (no VS Code: Shift+Alt+F). Não execute os scripts temporários de geração que ficam fora desta pasta: eles podem sobrescrever edições manuais.

## 1. Intensidade da refração do título

Abra `dist/title-glass.js`. Os controles estão no começo do arquivo, em `TITLE_GLASS`:

```js
const TITLE_GLASS = {
 dispersion: 3.8,
 blur: 0.95,
 colorMix: 0.65,
 distortion: 0.6,
 bulge: 0.075,
 grain: 0.045,
 scrollDistance: 5,
 bands: [
  { position: 0.58, tilt: -0.15, height: 0.24, width: 1.04, center: 0.5, shift: 2.8 },
  { position: 0.70, tilt: 0.09, height: 0.26, width: 1.04, center: 0.5, shift: -2.5 },
  { position: 0.58, tilt: -0.08, height: 0.26, width: 1.04, center: 0.5, shift: 2.8 }
 ]
};
```

| Controle | O que altera | Sugestão para experimentar |
| --- | --- | --- |
| `dispersion` | Distância da separação das cores | 2 para discreto; 4 ou 5 para forte |
| `blur` | Desfoque dentro das lentes | 0.5 a 2 |
| `colorMix` | Intensidade das cores | 0 sem separação colorida; 1 intensidade máxima |
| `distortion` | Deformação vertical | 0.2 a 0.6 |
| `bulge` | Curvatura e ampliação óptica | 0.03 a 0.12 |
| `grain` | Granulado fino nas letras | 0 desliga; 0.02 a 0.08 é sutil |
| `scrollDistance` | Distância percorrida pelas lentes durante a rolagem | 0 fixa; 5 discreto; 12 mais perceptível |

Altere um controle por vez. Use ponto decimal, não vírgula. Preserve as vírgulas que separam as propriedades do objeto.

### Faixas individuais

As três entradas em `bands` correspondem, nesta ordem, a Código, Interação e Experimentos.

- `position`: posição vertical, medida a partir do topo da linha. `0.5` é o meio; valores maiores descem a lente.
- `tilt`: inclinação. Negativo sobe para a direita; positivo desce para a direita.
- `height`: altura da faixa em relação à linha. `0.24` corresponde a 24%.
- `width`: largura em relação à palavra. `1` cobre toda a palavra.
- `center`: posição horizontal do centro. `0.5` centraliza.
- `shift`: deslocamento horizontal das letras dentro da faixa, em pixels. Negativo desloca para a esquerda.

O efeito é renderizado sob demanda; não existe um loop contínuo de grain. A preferência de movimento reduzido do sistema exibe o título em HTML sem o efeito WebGL.

## 2. Trocar o título e a apresentação

Em `dist/index.html`, procure `optical-title`.

Ao mudar uma palavra, atualize os três lugares relacionados:

1. O texto dentro de `<span class="word-ink">`.
2. O atributo `data-word` da respectiva palavra, usado pelo canvas.
3. O `aria-label` do `<h1>`, usado por leitores de tela.

As três faixas estão configuradas para três palavras/linhas. Alterar a quantidade de linhas exige ajustar também o código de `title-glass.js`.

A frase de apresentação começa com `Sou William.`. O restante da biografia, habilidades, cursos e idiomas também está em `index.html`.

## 3. E-mail, cartão e imagens nas faces

Os ajustes principais do cartão agora estão em **`dist/card-config.js`**. Não é preciso editar o renderizador para essas personalizações.

### Tamanho dos textos e espessura

```js
geometry: {
 depth: 0.22,          // Espessura central. Menor = peça mais fina.
 bevelThickness: 0.07,// Espessura das bordas.
 bevelSize: 0.09      // Arredondamento das bordas.
},
text: {
 headerSize: 34,      // Texto pequeno superior.
 footerSize: 32,      // Texto pequeno inferior.
 emailSize: 46,
 noteSize: 30,
 frontLogoSize: 380,
 backLogoSize: 150,
 padding: 70         // Margem lateral na textura de 1536 px.
},
motion: { durationMs: 1800, tiltX: 0.42, tiltY: 0.6, hoverScale: 1.035 }
```

A fonte e a margem usam a textura interna de 1536 × 1152 px como referência. A face inteira cresce ou diminui com o cartão; os textos acompanham a mesma proporção. Comece aumentando fontes em passos de 2 a 4. A posição das faces impressas se ajusta automaticamente quando a espessura muda.

### E-mail e rótulos

Edite `email`, `contactNote`, `logo`, `frontHeading`, `backHeading`, `frontFooter` e `backFooter` em `card-config.js`. A configuração atualiza o cartão 3D, o e-mail da seção de contato e a alternativa HTML durante o carregamento.

Mantenha também o conteúdo estático de `dist/index.html` atualizado, para leitores e buscadores que não executam JavaScript. Procure o e-mail antigo e as mensagens de exemplo no HTML. Atualize ou remova o selo `CONTATO DE EXEMPLO` e o texto de contato em breve.

Para um contato clicável na página:

```html
<a href="mailto:voce@dominio.com">voce@dominio.com</a>
```

O texto do cartão é uma textura; o clique no cartão gira a peça. O link de e-mail deve estar na seção Contato.

### Colocar uma imagem no cartão

Sim: cada lado pode receber uma imagem própria. Coloque o arquivo em `dist/assets/images/`. PNG e WebP com transparência combinam bem com o vidro.

Em `card-config.js`, configure `images.front` para a frente ou `images.back` para o verso:

```js
front: {
 src: 'assets/images/minha-imagem.webp',
 alt: 'Descrição da imagem',
 fit: 'contain',
 replaceLogo: true,
 opacity: 1,
 box: { x: 0.20, y: 0.22, width: 0.60, height: 0.52 }
}
```

- `src: ''` desativa a imagem e mantém o logo.
- `replaceLogo: true` substitui o logo quando a imagem carregar. `false` mantém os dois; evite sobrepor as áreas.
- `fit: 'contain'` mostra a imagem inteira; `'cover'` preenche a caixa e recorta o excesso.
- `opacity` varia de 0 a 1.
- `box` define a posição e o tamanho como proporções da face. `x: 0.20` começa a 20% da largura; `width: 0.60` ocupa 60%.
- O verso usa uma caixa menor, acima do e-mail; mantenha essa área para não cobrir o contato.
- A imagem é impressa na superfície e gira junto com o cartão. Uma imagem opaca cobre o fundo de vidro naquela área.

Há um arquivo de teste em `assets/images/card-example.svg`: use esse caminho para experimentar e depois troque pelo seu arquivo. Ele fica desativado por padrão.

Use imagens locais. Imagens externas só funcionam na textura se o servidor de origem permitir CORS. Se uma imagem não carregar, o cartão continua mostrando o logo. Mantenha o texto alternativo da imagem descritivo.

## 4. Imagens dos projetos

As imagens atuais são estudos visuais criados em HTML/CSS, não screenshots reais. Crie a pasta `dist/assets/images/` e coloque seus arquivos nela. Prefira WebP, AVIF ou PNG com tamanho adequado.

### Miniaturas da página inicial

Em `dist/index.html`, localize o link do projeto e substitua somente o bloco `<span class="project-visual ...">...</span>` por:

```html
<img
 class="project-thumbnail"
 src="assets/images/ascii-audio.webp"
 alt="Tela principal do renderizador ASCII reativo ao áudio"
 loading="lazy"
 width="1200"
 height="800"
>
```

Adicione ao final de `dist/responsive.css`:

```css
.project-thumbnail {
 display: block;
 width: 100%;
 height: clamp(160px, 11vw, 225px);
 object-fit: cover;
}
@media (max-width: 640px) {
 .project-thumbnail { height: 125px; }
}
```

`object-fit: cover` preenche a área e pode cortar as bordas. Use `contain` se for importante mostrar a interface inteira.

### Imagem grande da página do projeto

Abra a página correspondente em `dist/projects/`. Dentro de `<figure class="case-visual ...">`, substitua a ilustração e sua legenda por:

```html
<img
 class="case-image"
 src="../assets/images/ascii-audio.webp"
 alt="Interface do renderizador ASCII"
 width="1200"
 height="800"
>
<figcaption>Interface do projeto Audio-Reactive ASCII 3D</figcaption>
```

Adicione ao final de `dist/case-study.css`:

```css
.case-image {
 display: block;
 width: 100%;
 height: 100%;
 object-fit: contain;
}
```

O prefixo `../` é necessário porque a página está dentro de `projects/`. Use nomes de arquivo sem espaços e respeite maiúsculas/minúsculas para funcionar no GitHub Pages.

Para substituir o desenho da seção Sobre, procure `<div class="about-art">` em `index.html` e coloque uma imagem com texto alternativo apropriado.

## 5. Descrições e links de projetos

- `dist/index.html`: título, resumo, categoria e link dos cards.
- `dist/projects/*.html`: apresentação completa, tecnologias, funcionalidades e link do repositório.
- `dist/projects.json`: dados de referência; não gera os HTMLs automaticamente.

Atualize os três locais para manter consistência. Se mudar categorias, atualize também os filtros `data-filter` e `data-category` na página inicial.

As páginas também contêm metadados em `<title>`, `<meta name="description">` e `<script type="application/ld+json">`. Mantenha esses dados coerentes com o conteúdo visível.

## 6. Fontes, cores, tamanhos e cartão

| Alteração | Arquivo principal |
| --- | --- |
| Tamanho das letras, largura da página e ultrawide | `dist/responsive.css` |
| Cores dos temas | variáveis `--paper`, `--ink`, `--muted`, `--accent` em `dist/editorial.css` |
| Fundo renderizado do título | cores em `rebuild()` de `dist/title-glass.js`; mantenha iguais às cores da página |
| Fundo renderizado do cartão | função `paint()` de `dist/dispersion.js` |
| Fontes carregadas | links do Google Fonts nos HTMLs |
| Aparência das páginas dos projetos | `dist/case-study.css` |
| Entradas suaves e microinterações | `dist/motion.js` e `dist/motion.css` |
| Textos, imagens, espessura e vidro do cartão | `dist/card-config.js`; implementação em `dist/dispersion.js` |
| Fonte Tagesschrift do cartão | `ctx.font` dentro da função `paint()` em `dist/dispersion.js` |
| Duração do giro | `motion.durationMs` em `dist/card-config.js` (milissegundos) |
| Duração do giro da alternativa HTML/CSS | `.card { transition-duration: 1800ms; }` em `dist/profile.css` |

Os estilos são carregados em camadas. Para ajustes de tamanho, prefira `responsive.css`, carregado depois dos estilos gerais. Evite alterar várias definições da mesma propriedade em arquivos diferentes.

## 7. Publicação e cópias do projeto

O `README.md` explica como publicar com GitHub Pages. O workflow publica `dist/` após um push na branch `main`.

`github-ready/wpz-portfolio` e `wpz-portfolio-github.zip` são cópias de entrega. Elas não são sincronizadas automaticamente quando você edita `wpz-chrome`. Publique a pasta de trabalho atual ou gere um ZIP novo depois de editar.

Antes de publicar, confirme contato, imagens reais, links e informações pessoais. Quando houver um domínio final, configure canonical, sitemap e URLs absolutas de compartilhamento. Não envie `.openai/`, `.env`, backups ou credenciais.

## Nitidez e redimensionamento do título

Em `TITLE_GLASS`, no início de `dist/title-glass.js`, `maxPixelRatio` limita a resolução de renderização em telas de alta densidade e `textureScale` controla a resolução da textura de texto. Ambos estão em 2.5. Aumentar melhora a definição até o limite da tela/GPU, com maior custo de memória. O site recalcula fontes, medidas e textura ao redimensionar a janela, alterar zoom/densidade da tela ou terminar de carregar fontes. A dispersão também é ajustada proporcionalmente ao tamanho da letra.
