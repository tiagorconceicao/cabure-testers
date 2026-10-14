// Gera o site de testadores do Caburé Studio a partir de apps.json: `index.html` (lista de apps) e uma
// página por app (`<slug>/index.html`). Sem dependências: node build.js
// Para um app novo: acrescente um item em apps.json e rode de novo. Link ainda não pronto = deixe "".
const fs = require('node:fs');
const path = require('node:path');

const { studio, apps } = JSON.parse(fs.readFileSync(path.join(__dirname, 'apps.json'), 'utf8'));

const esc = (text) =>
  String(text).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

const STYLE = `
  :root { --bg: #fbfaf7; --fg: #1f1d1a; --muted: #5d584f; --accent: #405642; --on-accent: #fff; --card: #fff; --line: #ddd7cb; --warn: #fff3d6; --warn-line: #d9b45a; }
  @media (prefers-color-scheme: dark) {
    :root { --bg: #16140f; --fg: #ece7dc; --muted: #a8a193; --accent: #5a7d5e; --on-accent: #fff; --card: #211e17; --line: #36322a; --warn: #3a2f12; --warn-line: #8c7747; }
  }
  * { box-sizing: border-box; }
  body { margin: 0; background: var(--bg); color: var(--fg); font: 19px/1.55 system-ui, sans-serif; }
  main { max-width: 36rem; margin: 0 auto; padding: 1.5rem 1rem 4rem; }
  h1 { font-size: 1.7rem; line-height: 1.2; margin: .5rem 0; }
  h2 { font-size: 1.25rem; margin: 2rem 0 .5rem; }
  p { margin: .5rem 0; }
  .muted { color: var(--muted); font-size: .9rem; }
  .step { background: var(--card); border: 1px solid var(--line); border-radius: 16px; padding: 1.1rem; margin: 1rem 0; }
  .step h2 { margin: 0 0 .4rem; font-size: 1.2rem; }
  .num { display: inline-grid; place-items: center; width: 2rem; height: 2rem; border-radius: 50%; background: var(--accent); color: var(--on-accent); font-weight: 700; margin-right: .5rem; }
  .button { display: block; text-align: center; padding: 1rem; margin-top: .8rem; border-radius: 12px; background: var(--accent); color: var(--on-accent); font-weight: 700; text-decoration: none; font-size: 1.1rem; }
  .button[aria-disabled="true"] { background: var(--line); color: var(--muted); pointer-events: none; }
  .warn { background: var(--warn); border: 1px solid var(--warn-line); border-radius: 12px; padding: 1rem; margin: 1.5rem 0; }
  a { color: var(--accent); }
  details { border-top: 1px solid var(--line); padding: .7rem 0; }
  summary { cursor: pointer; font-weight: 600; }
  ul.apps { list-style: none; padding: 0; }
  ul.apps a { display: block; padding: 1rem; margin: .6rem 0; background: var(--card); border: 1px solid var(--line); border-radius: 12px; text-decoration: none; color: var(--fg); }
`;

function page(title, body, description) {
  return `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<style>${STYLE}</style>
</head>
<body>
<main>
${body}
<p class="muted">${esc(studio.name)} · dúvidas: <a href="mailto:${esc(studio.contact)}">${esc(studio.contact)}</a></p>
</main>
</body>
</html>
`;
}

function button(url, label, soon) {
  return url
    ? `<a class="button" href="${esc(url)}">${esc(label)}</a>`
    : `<a class="button" aria-disabled="true" href="#">${esc(soon)}</a>`;
}

function appPage(app) {
  return page(
    `Testar o ${app.name}`,
    `<h1>Testar o ${esc(app.name)}</h1>
<p>${esc(app.tagline)}. Obrigado por ajudar! O Google exige que um grupo de pessoas teste o app por <strong>${app.days} dias</strong> antes de ele ser publicado. Você só precisa de um <strong>celular Android</strong> e de uma <strong>conta Google</strong> (a mesma do Gmail e da Play Store).</p>

<section class="step">
  <h2><span class="num">1</span>Peça seu acesso</h2>
  <p>Informe seu nome e o <strong>e-mail da conta Google do celular</strong>. Eu libero o seu acesso, o que pode levar até 1 dia.</p>
  ${button(app.signupUrl, 'Pedir acesso', 'Em breve')}
</section>

<section class="step">
  <h2><span class="num">2</span>Aceite o convite</h2>
  <p>Quando eu avisar que está liberado, toque no botão abaixo <strong>no celular</strong> e depois em <strong>“Tornar-se testador”</strong>.</p>
  ${button(app.optinUrl, 'Aceitar o convite', 'Em breve: eu aviso quando abrir')}
</section>

<section class="step">
  <h2><span class="num">3</span>Instale e use</h2>
  <p>Toque em <strong>“Instalar”</strong> na Play Store e abra o ${esc(app.name)}. Use algumas vezes nos próximos ${app.days} dias, por exemplo numa noite de jogos com os amigos.</p>
</section>

<div class="warn">
  <strong>Importante:</strong> não saia do teste nem desinstale o app durante os ${app.days} dias. O Google conta os dias seguidos: se você sair, a sua contagem recomeça.
</div>

<h2>Dúvidas comuns</h2>
<details><summary>Não tenho Android</summary><p>Infelizmente o teste é só para celulares Android.</p></details>
<details><summary>Apareceu “app não encontrado” ou “indisponível”</summary><p>Confira se você está logado no celular com o <strong>mesmo e-mail</strong> que me passou. Se estiver, espere algumas horas e tente de novo: o Google demora um pouco para liberar.</p></details>
<details><summary>O que o app faz com os meus dados?</summary><p>Nada sai do seu celular. Seu e-mail só é usado para liberar o teste.</p></details>
<details><summary>Quero sair do teste</summary><p>Pode sair quando quiser, é só me avisar. Se puder, fique até o fim dos ${app.days} dias: ajuda muito.</p></details>`,
    `Como testar o ${app.name} antes da publicação.`,
  );
}

function indexPage() {
  const items = apps
    .map((app) => `<li><a href="${esc(app.slug)}/">${esc(app.name)}<br><span class="muted">${esc(app.tagline)}</span></a></li>`)
    .join('\n');
  return page(
    `Testadores · ${studio.name}`,
    `<h1>Teste os apps do ${esc(studio.name)}</h1>
<p>Escolha o app que você vai testar:</p>
<ul class="apps">
${items}
</ul>`,
    `Participe dos testes dos apps do ${studio.name}.`,
  );
}

fs.writeFileSync(path.join(__dirname, 'index.html'), indexPage());
for (const app of apps) {
  fs.mkdirSync(path.join(__dirname, app.slug), { recursive: true });
  fs.writeFileSync(path.join(__dirname, app.slug, 'index.html'), appPage(app));
}
console.log(`Gerado: index.html e ${apps.map((a) => `${a.slug}/index.html`).join(', ')}`);
