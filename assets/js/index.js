const votes = document.querySelectorAll('.vote__btn');
const form = document.querySelector('form');

votes.forEach(el => {
  el.addEventListener('click', e => {
    e.preventDefault();
    console.log('test');
    form.classList.remove('active');
    form.classList.add('active');
  });
});

window.submit_form = () => form.submit();
