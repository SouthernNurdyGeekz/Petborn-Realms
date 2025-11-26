console.log('Petborn script.js loaded.');

const startBtn = document.getElementById('start-game');

console.log('Start button is:', startBtn);

if (!startBtn) {
  console.warn('Start button not found in DOM.');
} else {
  startBtn.addEventListener('click', () => {
    console.log('Start button clicked.');
    alert('Button works now!');
  });
}
