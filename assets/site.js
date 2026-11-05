(function () {
  var KEY = 'sg-theme', GKEY = 'sg-grad', RKEY = 'sg-rich';
  var sw = document.querySelectorAll('.theme button[data-t]');
  var gt = document.querySelector('.gt[data-k=g]'), rt = document.querySelector('.gt[data-k=r]');
  var ALL = [].map.call(sw, function (b) { return b.dataset.t; });
  var NAME = {};
  sw.forEach(function (b) { NAME[b.dataset.t] = b.getAttribute('aria-label'); });
  var t = null, g = false, r = false;
  try { t = localStorage.getItem(KEY); g = localStorage.getItem(GKEY) === '1'; r = localStorage.getItem(RKEY) === '1'; } catch (e) {}
  if (ALL.indexOf(t) < 0) t = 'teal';
  function apply() {
    try { localStorage.setItem(KEY, t); localStorage.setItem(GKEY, g ? '1' : '0'); localStorage.setItem(RKEY, r ? '1' : '0'); } catch (e) {}
    document.body.setAttribute('data-theme', t);
    document.body.classList.toggle('grad', g);
    document.querySelectorAll('[data-tpl]').forEach(function (el) {
      // 켜면 달라지는 장만 따로 있다: 리치(data-r) → <t>-rich(-grad), 그라데이션(data-g) → <t>-grad
      var tt = (r && el.hasAttribute('data-r')) ? t + '-rich' + (g ? '-grad' : '')
             : t + (g && el.hasAttribute('data-g') ? '-grad' : '');
      var v = el.getAttribute('data-tpl').split('{t}').join(tt);
      if (el.tagName !== 'A') { el.src = v; return; }
      el.href = v;  // 받은 파일 이름에는 테마를 붙인다: pptx/<t>/<pid>.pptx → <pid>-<t>.pptx
      if (el.hasAttribute('data-potx'))  // 빈 서식: 원래 .potx 이름처럼 HaLab-틸-클린-16x9.potx
        el.setAttribute('download', 'HaLab-' + NAME[t] + (r ? '-리치' : '-클린') + (g ? '-그라데이션' : '') + '-' + el.getAttribute('data-potx') + '.potx');
      else if (el.hasAttribute('download')) el.setAttribute('download', v.split('/').pop().replace('.pptx', '-' + tt + '.pptx'));
    });
    sw.forEach(function (b) { b.setAttribute('aria-pressed', b.dataset.t === t); });
    gt.setAttribute('aria-checked', g);
    rt.setAttribute('aria-checked', r);
  }
  sw.forEach(function (b) { b.onclick = function () { t = b.dataset.t; apply(); }; });
  var cbar = document.querySelector('.counts');  // 개수별 시안: 쪽의 모든 [data-cnt] 를 그 개수로 (0 = 원래대로)
  if (cbar) cbar.querySelectorAll('button[data-n]').forEach(function (b) {
    b.onclick = function () {
      var n = b.dataset.n;
      document.querySelectorAll('[data-cnt]').forEach(function (el) {
        var m = JSON.parse(el.getAttribute('data-cnt')), x = m[n] || m['0'];
        el.setAttribute('data-tpl', x[0]);
        el.toggleAttribute('data-g', !!x[1]);
        el.toggleAttribute('data-r', !!x[2]);
      });
      document.querySelectorAll('[data-cnt-text]').forEach(function (el) {
        var m = JSON.parse(el.getAttribute('data-cnt-text'));
        el.textContent = m[n] || m['0'];
      });
      cbar.querySelectorAll('button').forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
      apply();
    };
  });
  gt.onclick = function () { g = !g; apply(); };
  rt.onclick = function () { r = !r; apply(); };
  apply();
  var dlg = document.querySelector('dialog.lb');
  document.querySelectorAll('img.zoom').forEach(function (im) {
    im.onclick = function (e) { e.preventDefault(); dlg.querySelector('img').src = im.src; dlg.showModal(); };
  });
  dlg.onclick = function () { dlg.close(); };
  document.querySelectorAll('.hex[data-hex]').forEach(function (b) {  // 색 코드: 눌러서 복사
    b.onclick = function () {
      var v = '#' + b.dataset.hex;
      var done = function () { b.classList.add('ok'); setTimeout(function () { b.classList.remove('ok'); }, 1200); };
      if (navigator.clipboard) navigator.clipboard.writeText(v).then(done, function () {}); else done();
    };
  });
})();
