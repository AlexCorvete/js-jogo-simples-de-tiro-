let tiros = [];
let inimigos = [];
let pontuacao = 0;
let imgNave;
let imgInimigoSheet; // sprite sheet do inimigo
let estrelas = [];
let startTime;
let padraoAtual = 0;

function preload() {
  imgNave = loadImage('recursos/naveMk2.png');
  imgInimigoSheet = loadImage('recursos/inimigoSheet.png'); // Carrega a sprite sheet
}

function setup() {
  createCanvas(400, 600);
  startTime = millis(); 
  imageMode(CENTER);

  // nascimento inimigos
  for (let i = 0; i < 10; i++) {
    let inimigo = {
      x: random(0, width),
      y: random(-800, 0),
      vel: 0.5,
      offset: random(1000),
      frame: 0,           // frame atual
      largura: 200,       // largura de cada frame no spritesheet
      altura: 200,        // altura de cada frame
      totalFrames: 4,     // total de frames
      scale: 0.3          // <<< ajuste aqui o tamanho na tela (0.1 = 10%)
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
  padraoAtual = Math.floor((tempoPassado / 60000) % 5);

  // inimigos com diferentes padrões
  for (let inimigo of inimigos) {
    moverInimigo(inimigo, padraoAtual);
    
    // --- USO DO SCALE PARA DEFINIR O TAMANHO NA TELA ---
    const displayW = inimigo.largura * inimigo.scale; // <<< novo
    const displayH = inimigo.altura * inimigo.scale;  // <<< novo

    // Desenha a animação do inimigo: recorta 200x200 mas desenha menor (displayW/H)
    const sx = inimigo.frame * inimigo.largura;
    image(
      imgInimigoSheet,
      inimigo.x, inimigo.y,
      displayW, displayH,          // <<< tamanho na tela (escalado)
      sx, 0,
      inimigo.largura, inimigo.altura
    );

    // Atualiza a frame da animação
    inimigo.frame = (floor(frameCount / 5)) % inimigo.totalFrames;

    if (inimigo.y > height) {
      textAlign(CENTER);
      fill(225, 225, 255);
      text("Você Perdeu!", width / 2, height / 2);
      noLoop();
    }
  }
  
  // tiros
  for (let tiro of tiros) {
    fill(225, 225, 0);
    circle(tiro.x, tiro.y, 10);
    tiro.y -= 10;
  }
  
  // player
  image(imgNave, mouseX, height - 50, 50, 50);

  // colisões (raio proporcional ao tamanho do inimigo)
  for (let inimigo of inimigos) {
    const hitR = Math.min(inimigo.largura, inimigo.altura) * inimigo.scale * 0.35; // <<< ajusta colisão
    for (let tiro of tiros) {
      if (dist(inimigo.x, inimigo.y, tiro.x, tiro.y) < hitR) {
        inimigos.splice(inimigos.indexOf(inimigo), 1);
        tiros.splice(tiros.indexOf(tiro), 1);
        let newInimigo = {
          x: random(0, width),
          y: random(-800, 0),
          vel: 2,
          offset: random(1000),
          frame: 0,
          largura: 200,
          altura: 200,
          totalFrames: 4,
          scale: 0.3 // <<< mantém o scale nos novos inimigos
        };
        inimigos.push(newInimigo);
        pontuacao += 1;
        break; // evita checar o mesmo inimigo depois de removido
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
    inimigo.y += inimigo.vel;
  } else if (padrao === 1) {
    inimigo.x += sin(frameCount * 0.1 + inimigo.offset) * 2;
    inimigo.y += inimigo.vel;
  } else if (padrao === 2) {
    inimigo.x += sin(frameCount * 0.05 + inimigo.offset) * 5;
    inimigo.y += inimigo.vel * 1.2;
  } else if (padrao === 3) {
    inimigo.y += map(inimigo.y, 0, height, 4, 1);
  } else if (padrao === 4) {
    inimigo.x += 1.5;
    inimigo.y += inimigo.vel;
    if (inimigo.x > width || inimigo.x < 0) inimigo.x = random(0, width);
  }
}

function mousePressed() {
  let tiro = { x: mouseX, y: height - 50 };
  tiros.push(tiro);
}