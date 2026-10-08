// legal.js - shared by the support pages

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

// contact page: click the email to copy it
var btn = document.getElementById('email');
if (btn) {
  var hint = document.getElementById('hint');

  function copied() {
    btn.classList.add('copied');
    hint.classList.add('ok');
    hint.textContent = 'Copied.';
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
