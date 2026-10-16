# wpz

Meu portfólio pessoal. Um lugar para reunir projetos, estudos e experimentos com desenvolvimento web, aplicações desktop e gráficos 3D.

A identidade visual parte de tipografia forte, vidro e textura. O cartão da página inicial é um objeto 3D: reage ao cursor, vira ao clicar e refrata os elementos do fundo. O título explora a mesma ideia de distorção óptica, com dispersão de cores e grain.

## Tecnologias

HTML, CSS e JavaScript, com Three.js para as cenas WebGL. O site é estático e não usa framework de interface nem etapa de build.

As fontes são Anton, Roboto, Roboto Mono e Tagesschrift. Há temas claro e escuro, layouts para celular e telas ultrawide e suporte à preferência de movimento reduzido.

## Executar

Com Node.js 20 ou superior:

```sh
npm run dev
```

Abra [localhost:4173](http://localhost:4173). Não é necessário instalar dependências; o Three.js e as fontes são carregados por CDN.

Para conferir a sintaxe dos scripts, os dados e os links internos:

```sh
npm run check
```

## Estrutura

```text
dist/
  index.html          Página inicial
  projects/           Páginas dos projetos
  assets/             Imagens
  card-config.js      Textos, imagens e ajustes do cartão
  dispersion.js       Cena 3D e material de vidro
  title-glass.js      Refração e textura do título
scripts/
  check.cjs           Verificações do site
server.cjs            Servidor local
```

Os arquivos em `dist/` são editados diretamente. O conteúdo dos projetos fica no HTML; `projects.json` serve como referência e não gera as páginas automaticamente.



---

[William Zelent · PzWill](https://github.com/PzWill)
