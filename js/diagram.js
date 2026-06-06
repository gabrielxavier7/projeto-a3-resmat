/**
 * diagram.js
 * Desenha o diagrama de momento fletor na tela de análise.
 */

/**
 * Desenha um diagrama simplificado de momento fletor em um canvas.
 * @param {string} canvasId - ID do elemento canvas
 * @param {number} momentoMaximo - Valor do momento fletor em N·m
 */
function drawMomentoFletor(canvasId, momentoMaximo) {
  const canvas = document.getElementById(canvasId);
  if (!canvas || !canvas.getContext) {
    return;
  }

  const ctx = canvas.getContext('2d');
  const rect = canvas.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;

  canvas.width = Math.round(rect.width * dpr);
  canvas.height = Math.round(rect.height * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  const largura = rect.width;
  const altura = rect.height;

  // Limpar o canvas
  ctx.clearRect(0, 0, largura, altura);

  // Configurações básicas
  const padding = 50;
  const baseY = altura - padding;
  const maxHeight = altura - 2 * padding;
  const suporteA = padding + 20;
  const suporteB = largura - padding - 20;
  const centro = largura / 2;
  const alturaMomento = Math.min(maxHeight, momentoMaximo * (maxHeight / Math.max(momentoMaximo, 15)));

  // Desenhar grade leve
  ctx.strokeStyle = 'rgba(15, 23, 42, 0.12)';
  ctx.lineWidth = 1;
  for (let i = 0; i <= 5; i += 1) {
    const y = baseY - (i * maxHeight) / 5;
    ctx.beginPath();
    ctx.moveTo(padding, y);
    ctx.lineTo(largura - padding, y);
    ctx.stroke();
  }

  // Desenhar eixo de referência
  ctx.strokeStyle = 'rgba(15, 23, 42, 0.7)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(padding, baseY);
  ctx.lineTo(largura - padding, baseY);
  ctx.stroke();

  // Desenhar viga do assento
  ctx.strokeStyle = 'rgba(59, 130, 246, 1)';
  ctx.lineWidth = 8;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(suporteA, baseY);
  ctx.lineTo(suporteB, baseY);
  ctx.stroke();

  // Desenhar suportes da cadeira
  ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
  [suporteA, suporteB].forEach((x) => {
    ctx.fillRect(x - 8, baseY, 16, 22);
    ctx.fillRect(x - 4, baseY + 22, 8, 10);
  });

  // Desenhar linha do diagrama de momento fletor
  ctx.beginPath();
  ctx.moveTo(suporteA, baseY);
  ctx.quadraticCurveTo(centro, baseY - alturaMomento, suporteB, baseY);
  ctx.strokeStyle = 'rgba(220, 38, 38, 0.95)';
  ctx.lineWidth = 4;
  ctx.stroke();

  // Preencher área do diagrama
  ctx.fillStyle = 'rgba(220, 38, 38, 0.18)';
  ctx.beginPath();
  ctx.moveTo(suporteA, baseY);
  ctx.quadraticCurveTo(centro, baseY - alturaMomento, suporteB, baseY);
  ctx.lineTo(suporteB, baseY);
  ctx.lineTo(suporteA, baseY);
  ctx.closePath();
  ctx.fill();

  // Desenhar setas de carga distribuída
  ctx.strokeStyle = 'rgba(59, 130, 246, 0.85)';
  ctx.lineWidth = 2;
  for (let i = 0; i <= 4; i += 1) {
    const x = suporteA + ((suporteB - suporteA) / 4) * i;
    const yArrow = baseY - 16;
    ctx.beginPath();
    ctx.moveTo(x, yArrow);
    ctx.lineTo(x, yArrow - 20);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x - 5, yArrow - 10);
    ctx.lineTo(x, yArrow - 20);
    ctx.lineTo(x + 5, yArrow - 10);
    ctx.fillStyle = 'rgba(59, 130, 246, 0.95)';
    ctx.fill();
  }

  // Títulos e etiquetas
  ctx.fillStyle = 'rgba(15, 23, 42, 0.95)';
  ctx.font = 'bold 14px Segoe UI, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(`Momento máximo: ${momentoMaximo.toFixed(2)} N·m`, centro, padding - 10);

  ctx.font = '13px Segoe UI, sans-serif';
  ctx.fillText('0', suporteA, baseY + 24);
  ctx.fillText('L', suporteB, baseY + 24);

  ctx.save();
  ctx.translate(padding - 28, altura / 2);
  ctx.rotate(-Math.PI / 2);
  ctx.textAlign = 'center';
  ctx.fillText('Momento fletor (N·m)', 0, 0);
  ctx.restore();
}
