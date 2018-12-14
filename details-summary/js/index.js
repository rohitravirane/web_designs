const main = document.querySelector('.main');
main && main.addEventListener('click', function(e) {
  if (e.target.tagName.toLowerCase() == 'summary') {
    if (e.target.parentNode.open) {
      main.removeAttribute('open');
    } else {
      main.setAttribute('open', true);
    }
  }
});