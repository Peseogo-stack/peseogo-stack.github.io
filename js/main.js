/* Interações do portfólio: menu do celular, frase digitando, luz que segue o ponteiro,
   cartão que inclina, botões magnéticos, botão "Executar" do topo, cards de projeto,
   fios das habilidades, copiar e-mail e menu fixo com a seção atual acesa. */
(function () {
  var reduz = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var ponteiroFino = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  function cada(lista, fn) { Array.prototype.forEach.call(lista, fn); }

  /* ---------- Menu no celular ---------- */
  var menu = document.getElementById('menu');
  var botaoMenu = document.getElementById('abrir-menu');

  function fecharMenu() {
    menu.classList.remove('aberto');
    botaoMenu.setAttribute('aria-expanded', 'false');
  }
  botaoMenu.addEventListener('click', function () {
    var abrir = !menu.classList.contains('aberto');
    menu.classList.toggle('aberto', abrir);
    botaoMenu.setAttribute('aria-expanded', String(abrir));
  });
  menu.addEventListener('click', function (e) { if (e.target.closest('a')) fecharMenu(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') fecharMenu(); });

  /* ---------- Topo ---------- */
  var heroi = document.getElementById('inicio');

  /* frase "Eu sou ..." que se digita sozinha */
  (function () {
    var el = heroi.querySelector('.digitando__texto');
    var frases = ['desenvolvedor em formação', 'eletricista de rede', 'estudante de Eng. de Software'];
    var i = 0, j = frases[0].length, apagando = true;
    if (reduz) return;
    function passo() {
      var f = frases[i];
      if (apagando) {
        j--; el.textContent = f.slice(0, j);
        if (j === 0) { apagando = false; i = (i + 1) % frases.length; return setTimeout(passo, 300); }
        setTimeout(passo, 28);
      } else {
        j++; el.textContent = f.slice(0, j);
        if (j === f.length) { apagando = true; return setTimeout(passo, 1800); }
        setTimeout(passo, 60);
      }
    }
    setTimeout(passo, 2400);
  })();

  /* luz e grade acompanham o ponteiro */
  heroi.addEventListener('pointermove', function (e) {
    var r = heroi.getBoundingClientRect();
    heroi.style.setProperty('--mx', (e.clientX - r.left) + 'px');
    heroi.style.setProperty('--my', (e.clientY - r.top) + 'px');
  });

  /* cartão de código inclina e botões são puxados pelo cursor (só com mouse) */
  var cartao = document.getElementById('cartao');
  if (ponteiroFino && !reduz) {
    cartao.addEventListener('pointermove', function (e) {
      var r = cartao.getBoundingClientRect();
      var px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
      cartao.style.setProperty('--ry', ((px - .5) * 14).toFixed(2) + 'deg');
      cartao.style.setProperty('--rx', ((.5 - py) * 12).toFixed(2) + 'deg');
      cartao.style.setProperty('--gx', (px * 100).toFixed(1) + '%');
      cartao.style.setProperty('--gy', (py * 100).toFixed(1) + '%');
    });
    cartao.addEventListener('pointerleave', function () {
      cartao.style.setProperty('--rx', '0deg');
      cartao.style.setProperty('--ry', '0deg');
    });

    cada(document.querySelectorAll('.magnetico'), function (b) {
      b.addEventListener('pointermove', function (e) {
        var r = b.getBoundingClientRect();
        var dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2);
        b.style.transform = 'translate(' + (dx * .22).toFixed(1) + 'px,' + (dy * .3 - 2).toFixed(1) + 'px)';
      });
      b.addEventListener('pointerleave', function () { b.style.transform = ''; });
    });
  }

  /* "Executar": imprime o resumo no terminal e manda uma descarga pelo circuito */
  var executar = document.getElementById('executar');
  var executarTexto = document.getElementById('executar-texto');
  var saida = document.getElementById('saida');
  var rodando = false;
  executar.addEventListener('click', function () {
    if (rodando) return;
    rodando = true;
    executar.classList.add('rodando');
    executarTexto.textContent = 'Executando…';
    saida.classList.remove('rodar');
    heroi.classList.remove('surtando');
    void saida.offsetWidth; /* reinicia as animações */
    saida.classList.add('rodar');
    heroi.classList.add('surtando');
    setTimeout(function () {
      rodando = false;
      executar.classList.remove('rodando');
      executarTexto.textContent = 'Executar de novo';
      heroi.classList.remove('surtando');
    }, 1900);
  });

  /* ---------- Projetos ---------- */
  var vitrine = document.getElementById('vitrine');
  var vcards = vitrine.querySelectorAll('.vcard');

  /* a borda dos cards acende perto do ponteiro */
  vitrine.addEventListener('pointermove', function (e) {
    cada(vcards, function (c) {
      var r = c.getBoundingClientRect();
      c.style.setProperty('--x', (e.clientX - r.left) + 'px');
      c.style.setProperty('--y', (e.clientY - r.top) + 'px');
    });
  });

  /* os cards sobem de leve quando entram na tela (o conteúdo fica visível o tempo todo) */
  if (!reduz && 'IntersectionObserver' in window) {
    vitrine.classList.add('movimento');
    var obsCards = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (en) {
        if (!en.isIntersecting) return;
        var i = Array.prototype.indexOf.call(vcards, en.target);
        en.target.style.transitionDelay = (i % 2) * 0.12 + 's';
        en.target.classList.add('visto');
        obsCards.unobserve(en.target);
      });
    }, { threshold: 0.15 });
    cada(vcards, function (c) { obsCards.observe(c); });
  }

  /* ---------- Habilidades: fios entre cada habilidade e os projetos onde foi usada ---------- */
  (function () {
    var rede = document.getElementById('rede');
    var svg = document.getElementById('rede-fios');
    var nosHab = rede.querySelectorAll('[data-proj]');
    var nosProj = {};
    cada(rede.querySelectorAll('[data-id]'), function (n) { nosProj[n.dataset.id] = n; });

    var ligacoes = [];
    cada(nosHab, function (n, i) {
      n.dataset.proj.split(' ').forEach(function (k) { if (nosProj[k]) ligacoes.push({ h: i, p: k }); });
    });

    function desenhar() {
      var base = rede.getBoundingClientRect();
      svg.setAttribute('viewBox', '0 0 ' + base.width + ' ' + base.height);
      svg.innerHTML = ligacoes.map(function (l) {
        var a = nosHab[l.h].getBoundingClientRect(), b = nosProj[l.p].getBoundingClientRect();
        var x1 = a.right - base.left, y1 = a.top + a.height / 2 - base.top;
        var x2 = b.left - base.left, y2 = b.top + b.height / 2 - base.top;
        var dx = (x2 - x1) * .5;
        return '<path d="M' + x1.toFixed(1) + ' ' + y1.toFixed(1) + ' C' + (x1 + dx).toFixed(1) + ' ' + y1.toFixed(1) + ' ' +
          (x2 - dx).toFixed(1) + ' ' + y2.toFixed(1) + ' ' + x2.toFixed(1) + ' ' + y2.toFixed(1) + '"/>';
      }).join('');
      aplicar();
    }

    var foco = null, fixo = null; /* foco: mouse/teclado em cima; fixo: escolhido com clique ou toque */
    function aplicar() {
      var f = foco || fixo;
      var caminhos = svg.querySelectorAll('path');
      rede.classList.toggle('focando', !!f);
      cada(rede.querySelectorAll('.no'), function (n) { n.classList.remove('aceso'); n.setAttribute('aria-pressed', 'false'); });
      cada(caminhos, function (c) { c.classList.remove('aceso'); });
      if (!f) return;
      ligacoes.forEach(function (l, i) {
        if ((f.tipo === 'h' && l.h === f.id) || (f.tipo === 'p' && l.p === f.id)) {
          if (caminhos[i]) caminhos[i].classList.add('aceso');
          nosHab[l.h].classList.add('aceso');
          nosProj[l.p].classList.add('aceso');
        }
      });
      if (fixo) (fixo.tipo === 'h' ? nosHab[fixo.id] : nosProj[fixo.id]).setAttribute('aria-pressed', 'true');
    }
    function ligarNo(n, tipo, id) {
      n.addEventListener('pointerenter', function (e) { if (e.pointerType === 'mouse') { foco = { tipo: tipo, id: id }; aplicar(); } });
      n.addEventListener('pointerleave', function (e) { if (e.pointerType === 'mouse') { foco = null; aplicar(); } });
      n.addEventListener('focus', function () { foco = { tipo: tipo, id: id }; aplicar(); });
      n.addEventListener('blur', function () { foco = null; aplicar(); });
      n.addEventListener('click', function () {
        fixo = (fixo && fixo.tipo === tipo && fixo.id === id) ? null : { tipo: tipo, id: id };
        aplicar();
      });
    }
    cada(nosHab, function (n, i) { ligarNo(n, 'h', i); });
    Object.keys(nosProj).forEach(function (k) { ligarNo(nosProj[k], 'p', k); });

    /* quando ninguém está mexendo, um pulso de energia passeia pelas ligações */
    if (!reduz) {
      setInterval(function () {
        if (foco || fixo || document.getElementById('habilidades').classList.contains('pausado')) return;
        var caminhos = svg.querySelectorAll('path');
        if (!caminhos.length) return;
        var c = caminhos[Math.floor(Math.random() * caminhos.length)];
        c.classList.add('ambiente');
        setTimeout(function () { c.classList.remove('ambiente'); }, 1400);
      }, 700);
    }

    window.addEventListener('resize', desenhar);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(desenhar);
    desenhar();
  })();

  /* ---------- Contato: copiar e-mail ---------- */
  var avisoEl = document.getElementById('aviso'), tempoAviso;
  function aviso(texto) {
    avisoEl.textContent = texto;
    avisoEl.classList.add('visivel');
    clearTimeout(tempoAviso);
    tempoAviso = setTimeout(function () { avisoEl.classList.remove('visivel'); }, 2400);
  }
  (function () {
    var botao = document.getElementById('copiar-email');
    var email = document.getElementById('email');
    function selecionar() {
      var r = document.createRange();
      r.selectNodeContents(email);
      var s = window.getSelection();
      s.removeAllRanges();
      s.addRange(r);
      aviso('E-mail selecionado. É só copiar.');
    }
    botao.addEventListener('click', function () {
      if (!navigator.clipboard || !window.isSecureContext) return selecionar();
      navigator.clipboard.writeText(email.textContent.trim()).then(function () {
        aviso('E-mail copiado!');
        botao.textContent = 'Copiado ✓';
        setTimeout(function () { botao.textContent = 'Copiar e-mail'; }, 2000);
      }, selecionar);
    });
  })();

  /* ---------- Menu fixo ao rolar, linha de progresso e seção atual acesa ---------- */
  (function () {
    var nav = document.querySelector('.nav');
    var barra = document.createElement('div');
    barra.className = 'progresso-leitura';
    barra.setAttribute('aria-hidden', 'true');
    document.body.appendChild(barra);
    var links = Array.prototype.slice.call(document.querySelectorAll('.nav__links a, .nav__contato'));
    var alvos = links.map(function (a) { return document.querySelector(a.getAttribute('href')); });
    var pendente = false;
    function atualizar() {
      pendente = false;
      var y = window.scrollY, total = document.documentElement.scrollHeight - window.innerHeight;
      nav.classList.toggle('nav--fixa', y > 140);
      barra.style.setProperty('--p', total > 0 ? Math.min(1, y / total).toFixed(4) : '0');
      var atual = -1;
      alvos.forEach(function (el, i) { if (el && el.getBoundingClientRect().top < window.innerHeight * .4) atual = i; });
      links.forEach(function (a, i) {
        a.classList.toggle('ativo', i === atual);
        if (i === atual) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
      });
    }
    window.addEventListener('scroll', function () {
      if (!pendente) { pendente = true; requestAnimationFrame(atualizar); }
    }, { passive: true });
    atualizar();
  })();

  /* ---------- Pausa as animações das seções que estão fora da tela ---------- */
  if ('IntersectionObserver' in window) {
    var obsSecoes = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (en) { en.target.classList.toggle('pausado', !en.isIntersecting); });
    }, { rootMargin: '120px 0px' });
    cada(document.querySelectorAll('#inicio, main > .secao'), function (s) { obsSecoes.observe(s); });
  }

  /* ---------- Ano no rodapé ---------- */
  document.getElementById('ano').textContent = new Date().getFullYear();
})();
