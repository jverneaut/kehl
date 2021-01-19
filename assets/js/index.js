import Chart from 'chart.js';
import colors from 'open-color';

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

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const labels = new Array(24)
  .fill(new Date())
  .map(
    (now, index) =>
      new Date(
        now.getTime() -
          1000 * 60 * now.getMinutes() -
          1000 * now.getSeconds() -
          1000 * 60 * 60 * index
      )
  )
  .reverse();

const openData = window.votes
  .filter(vote => vote.is_open === 1)
  .reduce(
    (acc, curr) => {
      return acc.map(({ x, y }) => ({
        x,
        y: new Date(curr.date) < x ? y + 1 : y,
      }));
    },
    labels.map(time => ({ x: time, y: 0 }))
  );

const closedData = window.votes
  .filter(vote => vote.is_open === 0)
  .reduce(
    (acc, curr) => {
      return acc.map(({ x, y }) => ({
        x,
        y: new Date(curr.date) < x ? y + 1 : y,
      }));
    },
    labels.map(time => ({ x: time, y: 0 }))
  );

new Chart(ctx, {
  type: 'line',
  data: {
    labels,
    datasets: [
      {
        label: 'Ouvert',
        data: openData,
        borderColor: colors.green[4],
        backgroundColor: colors.green[0],
        fill: false,
      },
      {
        label: 'Fermé',
        data: closedData,
        borderColor: colors.orange[4],
        backgroundColor: colors.orange[0],
        fill: false,
      },
    ],
  },
  options: {
    legend: {
      position: 'top',
      align: 'end',
    },
    scales: {
      xAxes: [
        {
          type: 'time',
          time: {
            displayFormats: {
              hour: 'H:mm',
              minute: 'H:mm',
            },
          },
        },
      ],
    },
  },
});
