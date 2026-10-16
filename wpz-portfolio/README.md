# WPZ — William Zelent

Portfólio estático com experiências de tipografia óptica, temas claro/escuro e um cartão 3D com refração e dispersão. Projetos e formação estão disponíveis em HTML, inclusive sem JavaScript.

## Rodar localmente

Requer Node.js 20 ou superior. Não é necessário instalar dependências.

```sh
npm run dev
```

Abra http://127.0.0.1:4173. Para usar outra porta, defina a variável `PORT` antes de executar o comando. Use um servidor HTTP; módulos JavaScript não devem ser abertos diretamente com `file://`.

## Verificar

```sh
npm run check
```

Verifica sintaxe do JavaScript, dados JSON, metadados básicos e links locais. A revisão visual e de desempenho deve ser feita no navegador, incluindo celular e telas ultrawide.

## Organização

- `dist/`: arquivos do site, mantidos diretamente e versionados. Não há etapa de build.
- `dist/index.html`: conteúdo principal e dados estruturados do perfil.
- `dist/projects/`: páginas individuais e indexáveis dos projetos.
- `dist/projects.json`: dados de referência dos projetos. Ao alterar um projeto, atualize também seu HTML na página inicial e na página individual; não há geração automática.
- `dist/card-config.js`: controles de espessura, fontes, contato, imagens e movimento do cartão.
- `dist/dispersion.js`: geometria, material de vidro, impressão das faces e animação WebGL.
- `dist/title-glass.js`: controles de refração, grain e qualidade do título.
- `dist/app.js`: tema, filtros e interações principais.
- `dist/motion.js` e `motion.css`: efeitos ópticos e entradas suaves.
- `dist/responsive.css`: escalas de layout e tipografia, incluindo ultrawide.
- `dist/style.css`, `glass.css`, `editorial.css`, `profile.css`: camadas visuais da composição.
- `dist/case-study.css`: apresentação das páginas dos projetos.
- `server.cjs`: servidor de desenvolvimento.
- `scripts/check.cjs`: verificação sem dependências.

O Three.js é carregado do jsDelivr com versão fixada em `0.180.0`. As fontes Anton, Roboto, Roboto Mono e Tagesschrift são carregadas pelo Google Fonts. Essas partes precisam de internet. Se WebGL não estiver disponível, o cartão usa a alternativa em HTML/CSS.

## Publicar no GitHub Pages

1. Crie um repositório no seu GitHub e envie o conteúdo desta pasta, incluindo `dist/`, `.github/`, `package.json` e o README.
2. Em **Settings → Pages → Build and deployment**, escolha **GitHub Actions**.
3. Envie as alterações para a branch `main`. O workflow `pages.yml` valida o site e publica a pasta `dist/`.
4. Acompanhe a URL publicada na execução da action. Os links relativos funcionam também em um repositório de projeto, como `usuario.github.io/repositorio/`.

O workflow só será executado depois que o projeto estiver no GitHub. Nenhum repositório ou deploy no GitHub foi criado por esta preparação.

## Antes da publicação definitiva

- Substitua `seuemail@exemplo.com` no HTML e em `card-config.js` pelo contato que desejar publicar.
- Confira nome, cursos, idiomas e descrições dos projetos.
- Substitua os estudos visuais dos projetos por screenshots reais quando disponíveis.
- Com o domínio final definido, adicione URLs canônicas, metadados de compartilhamento com URL absoluta e `sitemap.xml`.
- Escolha uma licença antes de autorizar a reutilização do código. Nenhuma licença foi presumida.

A configuração local de Sites (`.openai/`) está ignorada e não faz parte do projeto para GitHub. Backups, arquivos temporários e credenciais também não devem ser enviados.

## Movimento e acessibilidade

O site respeita `prefers-reduced-motion`. A cena WebGL renderiza sob demanda e os elementos decorativos ficam fora da árvore de acessibilidade. Textos dos projetos, links e descrições permanecem no HTML inicial.

## Personalização

Consulte [GUIA-DE-EDICAO.md](GUIA-DE-EDICAO.md) para trocar contato, imagens e conteúdo e ajustar manualmente a refração, o desfoque e o grain do título.
