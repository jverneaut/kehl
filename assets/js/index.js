const votes = document.querySelectorAll('.vote__btn');
const form = document.querySelector('form');

votes.forEach(el => {
  el.addEventListener('click', e => {
    e.preventDefault();

    form.querySelector('input[name="vote"]').value = el.dataset.value;

    form.classList.remove('active');
    form.classList.add('active');
  });
});

window.submit_form = () => form.submit();
