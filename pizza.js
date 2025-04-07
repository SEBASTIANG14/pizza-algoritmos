let slicesInput, submitButton, slices;

function setup() {
  createCanvas(800, 400);
  background(220);
  
  // Crear campo de entrada y botón
  slicesInput = createInput();
  slicesInput.position(20, 20);
  
  submitButton = createButton('Dibujar');
  submitButton.position(slicesInput.x + slicesInput.width + 10, 20);
  submitButton.mousePressed(drawPizza);
  
  noLoop(); // Evita que draw se ejecute en loop
}

function drawPizza() {
  background(220);
  // Obtenemos la cantidad de rebanadas ingresadas por el usuario
  slices = int(slicesInput.value());
  
  // Definición de centros y radio para los 3 círculos
  let radius = 100;
  let center1 = { x: width / 4, y: height / 2 };
  let center2 = { x: width / 2, y: height / 2 };
  let center3 = { x: (3 * width) / 4, y: height / 2 };
  
  // Dibujar los 3 círculos
  noFill();
  ellipse(center1.x, center1.y, radius * 2, radius * 2);
  ellipse(center2.x, center2.y, radius * 2, radius * 2);
  ellipse(center3.x, center3.y, radius * 2, radius * 2);
  
  // Ángulo entre cada rebanada
  let angleStep = TWO_PI / slices;
  
  // Para cada rebanada, calcular el punto final y dibujar la línea con cada algoritmo
  for (let i = 0; i < slices; i++) {
    let angle = i * angleStep;
    let xEnd = cos(angle) * radius;
    let yEnd = sin(angle) * radius;
    
    // Primer círculo: línea usando algoritmo punto-pendiente
    drawLinePuntoPendiente(center1.x, center1.y, center1.x + xEnd, center1.y + yEnd);
    
    // Segundo círculo: línea usando algoritmo DDA
    drawLineDDA(center2.x, center2.y, center2.x + xEnd, center2.y + yEnd);
    
    // Tercer círculo: línea usando algoritmo de Bresenham
    drawLineBresenham(center3.x, center3.y, center3.x + xEnd, center3.y + yEnd);
  }
}

// Algoritmo punto-pendiente
function drawLinePuntoPendiente(x0, y0, x1, y1) {
  let dx = x1 - x0;
  let dy = y1 - y0;
  
  // Si la diferencia en x es mayor, iteramos sobre x; de lo contrario, sobre y
  if (abs(dx) >= abs(dy)) {
    let m = dy / dx;
    let b = y0 - m * x0;
    let step = dx > 0 ? 1 : -1;
    for (let x = x0; abs(x - x1) > 0.5; x += step) {
      let y = m * x + b;
      point(x, y);
    }
  } else {
    let m = dx / dy;
    let b = x0 - m * y0;
    let step = dy > 0 ? 1 : -1;
    for (let y = y0; abs(y - y1) > 0.5; y += step) {
      let x = m * y + b;
      point(x, y);
    }
  }
}

// Algoritmo DDA
function drawLineDDA(x0, y0, x1, y1) {
  let dx = x1 - x0;
  let dy = y1 - y0;
  let steps = max(abs(dx), abs(dy));
  
  let xInc = dx / steps;
  let yInc = dy / steps;
  
  let x = x0;
  let y = y0;
  for (let i = 0; i <= steps; i++) {
    point(round(x), round(y));
    x += xInc;
    y += yInc;
  }
}

// Algoritmo de Bresenham
function drawLineBresenham(x0, y0, x1, y1) {
  // Redondeamos las coordenadas a enteros
  x0 = round(x0);
  y0 = round(y0);
  x1 = round(x1);
  y1 = round(y1);
  
  let dx = abs(x1 - x0);
  let dy = abs(y1 - y0);
  let sx = x0 < x1 ? 1 : -1;
  let sy = y0 < y1 ? 1 : -1;
  let err = dx - dy;
  
  while (true) {
    point(x0, y0);
    if (x0 === x1 && y0 === y1) break;
    let e2 = 2 * err;
    if (e2 > -dy) {
      err -= dy;
      x0 += sx;
    }
    if (e2 < dx) {
      err += dx;
      y0 += sy;
    }
  }
}
