# Portfólio · Pedro Vieira

Site pessoal com meus projetos, trajetória, habilidades e contato. Tema escuro em azul royal, feito com HTML, CSS e JavaScript puros (sem framework e sem etapa de build) e pensado para o **GitHub Pages**.

No ar em: **https://peseogo-stack.github.io/**

## O que tem no site

| Seção | Destaque |
| --- | --- |
| **Topo** | Circuito com pulsos de energia, frase que se digita sozinha, cartão de código que inclina com o mouse e botão "Executar" que dispara uma descarga pelo circuito |
| **Projetos** | Vitrine em mosaico: a borda dos cards acende perto do mouse, a tela de cada projeto rola sozinha e um mini disjuntor liga ao passar o mouse |
| **Sobre e trajetória** | Texto "Do poste ao código", painel "Agora" e linha do tempo com dois fios (elétrica e software) que se juntam no objetivo |
| **Habilidades** | Cada habilidade ligada por fios aos projetos em que foi usada, mais o que estou estudando e o que trouxe da área elétrica |
| **Contato** | E-mail com botão de copiar, LinkedIn e GitHub |

O menu fica fixo ao rolar, acende a seção atual e uma linha de energia no topo mostra o quanto da página já foi vista. Quem prefere menos movimento (configuração "reduzir movimento" do sistema) vê o site sem animações.

## Estrutura

```
peseogo-stack.github.io/
├── index.html        # todo o conteúdo do site, com uma seção comentada para cada parte
├── 404.html          # página de "não encontrado"
├── css/estilo.css    # cores, fontes e medidas no :root; uma parte comentada por seção
├── js/main.js        # interações (menu, topo, projetos, habilidades, contato)
└── img/
    ├── favicon.svg
    ├── og.png        # prévia do link no LinkedIn/WhatsApp (1200 × 630)
    └── *.webp        # telas dos projetos (960 px de largura, altas para o efeito de rolagem)
```

## Como atualizar o site

Este repositório é publicado automaticamente pelo **GitHub Pages**. Cada alteração enviada para a branch `main` aparece em https://peseogo-stack.github.io/ em 1 ou 2 minutos. As demos que já existem (`/inventaria-system/` e `/mathesis/`) continuam funcionando, porque cada repositório com Pages vira uma subpasta desse mesmo endereço.

Para ver no computador antes de enviar, rode `python -m http.server` dentro da pasta e acesse http://localhost:8000 (abrir o arquivo com dois cliques também funciona, mas copiar o e-mail só funciona por um endereço `http`).

O arquivo `.nojekyll` avisa o GitHub Pages para publicar os arquivos como estão, sem processá-los.

## Como editar

- **Adicionar um projeto:** em `index.html`, copie um bloco `<article class="vcard rola">` inteiro e troque textos, links, imagem e o número do circuito (C1, C2…). Salve a tela do projeto em `img/` com 960 px de largura, em `.webp`.
- **Ligar uma habilidade a um projeto:** na seção `#habilidades`, cada botão tem `data-proj` com os projetos onde a habilidade foi usada (`inv`, `mat`, `prf`, `alm`). Os fios são desenhados a partir disso. Um projeto novo precisa de um botão na coluna "Projetos" com um `data-id` próprio.
- **Atualizar o painel "Agora":** fica na seção `#sobre`; lembre de mudar a data.
- **Novo marco na trajetória:** copie um `<li class="fio-item ...">`. Use `fio-item--eletrica` (fio da esquerda) ou `fio-item--software` (fio da direita) e ajuste o `grid-row` para a ordem cronológica.
- **Trocar as cores:** mude as variáveis no início de `css/estilo.css` (`--royal`, `--eletrico`...).

Se mudar o endereço do site (por exemplo, para um domínio próprio), atualize também `canonical`, `og:url`, `og:image` e o JSON-LD no `<head>` do `index.html`.

## Ferramentas do GitHub Student Developer Pack

| Ferramenta | Para que serve aqui | Vale a pena? |
| --- | --- | --- |
| **GitHub Pages** | Hospeda o site de graça em `peseogo-stack.github.io` | Sim, é a base de tudo |
| **GitHub Pro** | Permite publicar Pages também a partir de repositório **privado** (útil para pôr a demo do PRF Aprova no ar sem abrir o código) | Sim |
| **GitHub Codespaces** | Editar o site pelo navegador, de qualquer computador | Sim, quando estiver longe do PC |
| **GitHub Copilot** | Ajuda a escrever e entender código | Use para aprender, não para colar sem entender |
| **Namecheap (.me)** ou **.TECH** ou **Name.com** | Domínio próprio grátis por **1 ano** (ex.: `pedrovieira.me`) | Opcional: depois do 1º ano a renovação é paga |
| **Imgbot** | Otimiza as imagens do repositório automaticamente | Sim, instala em 1 minuto |
| **Simple Analytics** | Mostra quantas pessoas visitam o site, sem cookies | Opcional |
| **Polypane** | Navegador para testar o site em vários tamanhos de tela | Opcional |
| **Frontend Masters** (6 meses) | Cursos de HTML, CSS e JavaScript para evoluir o site | Sim, se tiver tempo para estudar |
