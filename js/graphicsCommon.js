function drawBitmapCenteredWithRotation(canvasContext, useBitmap, atX, atY, withAng) {
  canvasContext.save();
  canvasContext.translate(atX, atY);
  if (withAng != undefined) {
    canvasContext.rotate(withAng);
  }
  canvasContext.drawImage(useBitmap, -useBitmap.width / 2, -useBitmap.height / 2);
  canvasContext.restore();
}

function drawBitmapFrameCenteredWithRotation(canvasContext, useBitmap, frame, atX, atY, width, height, withAng) {
  canvasContext.save();
  canvasContext.translate(atX, atY);
  if (withAng != undefined) {
    canvasContext.rotate(withAng);
  }
  canvasContext.drawImage(useBitmap, width * frame, 0, width, height, -width / 2, -height / 2, width, height);
  canvasContext.restore();
}

function drawBitmapFrameCenteredWithRotationAndAlpha(canvasContext, useBitmap, frame, atX, atY, width, height, withAng, alpha) {
  canvasContext.save();
  canvasContext.globalAlpha = alpha;
  canvasContext.translate(atX, atY);
  if (withAng != undefined) {
    canvasContext.rotate(withAng);
  }
  canvasContext.drawImage(useBitmap, width * frame, 0, width, height, -width / 2, -height / 2, width, height);
  canvasContext.restore();
}

function drawBitmapCenteredWithScaleAndRotation(canvasContext, useBitmap, atX, atY, scale, angle) {
  canvasContext.save();
  canvasContext.translate(atX, atY);
  if (angle != undefined) {
    canvasContext.rotate(angle);
  }
  if (scale == undefined) {
    scale = 1;
  }
  var scaledWidth = useBitmap.width * scale;
  var scaledHeight = useBitmap.height * scale;
  canvasContext.drawImage(useBitmap, 0, 0, useBitmap.width, useBitmap.height, -scaledWidth / 2, -scaledHeight / 2, scaledWidth, scaledHeight);
  canvasContext.restore();
}

function drawFillRect(canvasContext, topLeftX, topLeftY, boxWidth, boxHeight, fillColor) {
  canvasContext.fillStyle = fillColor;
  canvasContext.fillRect(topLeftX, topLeftY, boxWidth, boxHeight);
}

function drawStrokeRect(canvasContext, topLeftX, topLeftY, boxWidth, boxHeight, strokeColor) {
  canvasContext.strokeStyle = strokeColor;
  canvasContext.strokeRect(topLeftX, topLeftY, boxWidth, boxHeight);
}

function drawFillCircle(canvasContext, centerX, centerY, radius, fillColor) {
  canvasContext.fillStyle = fillColor;
  canvasContext.beginPath();
  canvasContext.arc(centerX, centerY, radius, 0, Math.PI * 2, true);
  canvasContext.fill();
}

function drawStrokeCircle(canvasContext, centerX, centerY, radius, fillColor) {
  canvasContext.strokeStyle = fillColor;
  canvasContext.beginPath();
  canvasContext.arc(centerX, centerY, radius, 0, Math.PI * 2, true);
  canvasContext.stroke();
}

function drawLines(canvasContext, fillColor, pointArray) {
  canvasContext.beginPath();
  canvasContext.moveTo(pointArray[0].x, pointArray[0].y);
  for (var i = 1; i < pointArray.length; i++) {
    canvasContext.lineTo(pointArray[i].x, pointArray[i].y);
  }
  canvasContext.strokeStyle = fillColor;
  canvasContext.stroke();
}

function drawText(canvasContext, textX, textY, fillColor, showWords) {
  canvasContext.fillStyle = fillColor;
  canvasContext.fillText(showWords, textX, textY);
}

function drawTextAlpha(canvasContext, textX, textY, fillColor, showWords, alpha) {
  canvasContext.save();

  if (alpha === undefined) {
    alpha = 1;
  }
  canvasContext.globalAlpha = alpha;
  drawText(canvasContext, textX, textY, fillColor, showWords);
  canvasContext.restore();
}
