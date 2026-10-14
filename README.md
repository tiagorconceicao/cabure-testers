# Testadores do Caburé Studio

Site estático (GitHub Pages) com uma página simples, em passos, para amigos e familiares testarem os apps
do estúdio no teste fechado da Play. O roteiro completo está em `docs/metodo/07-publicacao-e-testadores.md`
do repositório `rummiclock`.

- `apps.json`: um item por app (`signupUrl`: formulário ou grupo para pedir acesso; `optinUrl`: link de
  participação do teste fechado, que o Console só mostra depois de publicar o teste).
- `node build.js`: gera `index.html` e `<slug>/index.html`.
- Link ainda não disponível = deixe `""`; a página mostra "Em breve".
