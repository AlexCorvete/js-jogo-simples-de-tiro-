let tiros = [];
let inimigos = [];
let pontuacao = 0;
let img;
let estrelas = [];
let startTime;
let padraoAtual = 0;

function setup() {
  createCanvas(400, 600);
  startTime = millis(); // guarda o tempo inicial

  // nascimento inimigos
  for (let i = 0; i < 10; i++) {
    let inimigo = {
      x: random(0, width),
      y: random(-800, 0),
      vel: 0.5,
      offset: random(1000) // usado em padrões com movimento senoidal
    };
    inimigos.push(inimigo);
  }

  // nascimento estrelas
  for (let i = 0; i < 100; i++) {
    let estrela = {
      x: random(0, width),
      y: random(0, height),
      size: random(1, 3),
      speed: random(1, 3)
    };
    estrelas.push(estrela);
  }
}

function draw() {
  noStroke();
  background(0);
  rectMode(CENTER);

  // cenário: estrelas
  fill(255);
  for (let estrela of estrelas) {
    circle(estrela.x, estrela.y, estrela.size);
    estrela.y += estrela.speed;
    if (estrela.y > height) {
      estrela.y = 0;
      estrela.x = random(0, width);
    }
  }

  // define padrão de movimento com base no tempo
  let tempoPassado = millis() - startTime;
  padraoAtual = Math.floor((tempoPassado / 60000) % 5); // 120000 ms = 2 min

  // inimigos com diferentes padrões
  fill(225, 0, 0);
  for (let inimigo of inimigos) {
    moverInimigo(inimigo, padraoAtual);
    circle(inimigo.x, inimigo.y, 20);

    if (inimigo.y > height) {
      textAlign(CENTER);
      fill(225, 225, 255);
      text("Você Perdeu!", width / 2, height / 2);
      noLoop();
    }
  }

  // player
  imageMode(CENTER);
  image(img, mouseX, height - 50, 50, 50);

  // tiros
  for (let tiro of tiros) {
    fill(225, 225, 0);
    circle(tiro.x, tiro.y, 10);
    tiro.y -= 10;
  }

  // colisões
  for (let inimigo of inimigos) {
    for (let tiro of tiros) {
      if (dist(inimigo.x, inimigo.y, tiro.x, tiro.y) < 10) {
        inimigos.splice(inimigos.indexOf(inimigo), 1);
        tiros.splice(tiros.indexOf(tiro), 1);
        let newInimigo = {
          x: random(0, width),
          y: random(-800, 0),
          vel: 2,
          offset: random(1000)
        };
        inimigos.push(newInimigo);
        pontuacao += 1;
      }
    }
  }

  // placar e padrão atual
  fill(225, 255, 255);
  textSize(20);
  textAlign(CENTER);
  text("Padrão: " + (padraoAtual + 1), width / 2, 25);

  textSize(50);
  text(pontuacao, width / 2, 65);
}

function moverInimigo(inimigo, padrao) {
  if (padrao === 0) {
    // Padrão 1: Reta para baixo
    inimigo.y += inimigo.vel;
  }
  else if (padrao === 1) {
    // Padrão 2: Zig-zag
    inimigo.x += sin(frameCount * 0.1 + inimigo.offset) * 2;
    inimigo.y += inimigo.vel;
  }
  else if (padrao === 2) {
    // Padrão 3: Movimento senoidal largo
    inimigo.x += sin(frameCount * 0.05 + inimigo.offset) * 5;
    inimigo.y += inimigo.vel * 1.2;
  }
  else if (padrao === 3) {
    // Padrão 4: Cai rápido e desacelera
    inimigo.y += map(inimigo.y, 0, height, 4, 1);
  }
  else if (padrao === 4) {
    // Padrão 5: Movimento diagonal
    inimigo.x += 1.5;
    inimigo.y += inimigo.vel;
    if (inimigo.x > width || inimigo.x < 0) inimigo.x = random(0, width);
  }
}

function preload() {
  img = loadImage('recursos/naveRepulse.png');
}

function mousePressed() {
  let tiro = {
    x: mouseX,
    y: height - 50,
  };
  tiros.push(tiro);
}
