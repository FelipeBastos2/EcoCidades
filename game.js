const player = document.getElementById('player');
const obstacle = document.getElementById('obstacle');
const distanceDisplay = document.getElementById('distance');
const playButton = document.getElementById('playButton');
const nuvem = document.getElementById('nuvem');
const characterSelection = document.getElementById('character-selection');
const characterOptions = document.querySelectorAll('.char-option');

let distance = 0;
let isJumping = false;
let gameInterval;
let nuvemPosition = -100;
let obstacleSpeed = 5;
let jumpHeight = 250;
let selectedCharacter = 'img/bode.gif'; // padrão

// Atualiza personagem ao selecionar
characterOptions.forEach(option => {
  option.addEventListener('click', () => {
    characterOptions.forEach(i => i.classList.remove('selected'));
    option.classList.add('selected');
    selectedCharacter = option.dataset.image;
    player.src = selectedCharacter;
    playButton.classList.remove('hidden');
  });
});

// Ajusta para mobile
function updateJumpHeight() {
  const isMobile = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);
  jumpHeight = isMobile ? 100 : 250;
  obstacleSpeed = isMobile ? 4 : 8;
}

// Pulo
function jump() {
  if (isJumping) return;
  isJumping = true;
  player.style.bottom = jumpHeight + 'px';
  setTimeout(() => {
    player.style.bottom = '50px';
    isJumping = false;
  }, 550);
}

function detectCollision() {
  const playerLeft = player.offsetLeft;
  const playerRight = playerLeft + player.offsetWidth;
  const playerTop = player.offsetTop;
  const playerBottom = playerTop + player.offsetHeight;

  const obstacleLeft = obstacle.offsetLeft;
  const obstacleRight = obstacleLeft + obstacle.offsetWidth;
  const obstacleTop = obstacle.offsetTop;
  const obstacleBottom = obstacleTop + obstacle.offsetHeight;

  return (
    playerRight > obstacleLeft + 60 &&
    playerLeft < obstacleRight - 30 &&
    playerBottom > obstacleTop + 40 &&
    playerTop < obstacleBottom - 20
  );
}

// Movimento da nuvem
function moveNuvem() {
  nuvemPosition -= 3;
  if (nuvemPosition < -400) nuvemPosition = 1600;
  nuvem.style.left = nuvemPosition + 'px';
}

// Inicia jogo
function startGame() {
  updateJumpHeight();
  distance = 0;
  distanceDisplay.innerText = '0';
  obstacle.style.right = '-50px';
  nuvemPosition = -100;

  characterSelection.style.display = 'none';
  playButton.classList.add('hidden');

  // Força recarregamento da imagem e espera
  player.src = selectedCharacter;
  player.onload = () => {
    gameInterval = setInterval(() => {
      let obstacleRight = parseInt(getComputedStyle(obstacle).right);
      obstacleRight += obstacleSpeed;
      obstacle.style.right = obstacleRight + 'px';

      if (obstacleRight > window.innerWidth + 100) {
        obstacle.style.right = '-50px';
      }

      distance++;
      distanceDisplay.innerText = distance;
      moveNuvem();

      if (detectCollision()) {
        clearInterval(gameInterval);
        alert('💥 Game Over!\nVocê percorreu: ' + distance + ' metros');
        characterSelection.style.display = 'block';
        playButton.classList.remove('hidden');
      }
    }, 20);
  };

}

// Controles
document.addEventListener('keydown', (e) => {
  if (e.code === 'Space' || e.code === 'ArrowUp') jump();
});
document.addEventListener('touchstart', jump);
playButton.addEventListener('click', startGame);