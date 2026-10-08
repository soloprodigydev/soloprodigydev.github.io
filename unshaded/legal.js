// legal.js - shared by all the support pages

var bar = document.getElementById('prog');
var links = document.querySelectorAll('.qn a');

// progress bar + highlight whichever section you're reading
function onScroll() {
  var max = document.documentElement.scrollHeight - innerHeight;
  bar.style.transform = 'scaleX(' + (max > 0 ? scrollY / max : 0) + ')';

  var cur = -1;
  links.forEach(function (a, i) {
    var sec = document.querySelector(a.getAttribute('href'));
    if (sec && sec.getBoundingClientRect().top < innerHeight * 0.3) cur = i;
  });
  links.forEach(function (a, i) {
    a.classList.toggle('on', i === cur);
  });
}
addEventListener('scroll', onScroll);
onScroll();

// floating pixels in the background
var cv = document.getElementById('motes');
var g = cv.getContext('2d');
var dots = [];
var still = matchMedia('(prefers-reduced-motion: reduce)').matches;
var color = getComputedStyle(document.documentElement).getPropertyValue('--glow').trim() || '#b79cff';

function resize() {
  cv.width = innerWidth;
  cv.height = innerHeight;
  dots = [];
  var n = Math.min(60, Math.round(innerWidth * innerHeight / 25000));
  for (var i = 0; i < n; i++) {
    dots.push({
      x: Math.random() * cv.width,
      y: Math.random() * cv.height,
      s: 2 + Math.floor(Math.random() * 3),
      v: 0.1 + Math.random() * 0.25,
      a: 0.15 + Math.random() * 0.35
    });
  }
}

function draw() {
  g.clearRect(0, 0, cv.width, cv.height);
  g.fillStyle = color;
  dots.forEach(function (d) {
    d.y -= d.v;
    if (d.y < -5) d.y = cv.height + 5; // wrap around
    g.globalAlpha = d.a;
    g.fillRect(Math.round(d.x), Math.round(d.y), d.s, d.s);
  });
  if (!still) requestAnimationFrame(draw);
}

addEventListener('resize', resize);
resize();
draw();

// contact page: click the email to copy it
var btn = document.getElementById('email');
if (btn) {
  var hint = document.getElementById('hint');

  function copied() {
    btn.classList.add('copied');
    hint.classList.add('ok');
    hint.textContent = 'Copied!';
    setTimeout(function () {
      btn.classList.remove('copied');
      hint.classList.remove('ok');
      hint.textContent = 'Click to copy';
    }, 2000);
  }

  btn.onclick = function () {
    var text = btn.textContent.trim();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(copied);
    } else {
      // old browsers / not https
      var t = document.createElement('textarea');
      t.value = text;
      document.body.appendChild(t);
      t.select();
      document.execCommand('copy');
      document.body.removeChild(t);
      copied();
    }
  };
}
