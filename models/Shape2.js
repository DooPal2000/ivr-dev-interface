class Shape {
  constructor(x, y, width, height, type, style = 'black', stroke = false) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.type = type;
    this.style = style;
    this.stroke = stroke;

    this.initPos = [x, y];
    this.text = type;
    this.selected = false;
    this.userValues = null;
    this.nextItem = null;
    this.functionString = '';
  }

  getInitPos() {
    // return initial position to reset palette shape after dragdrop
    return this.initPos;
  }
  getEntryPoint() {
    return [this.x, this.y - this.height / 2];
  }

  getExitPoint() {
    return [this.x, this.y + this.height / 2];
  }

  getBottomPointForExit(number, position) {
    const xPoint = (this.width / (number + 1)) * position;
    return [this.x - this.width * 0.5 + xPoint, this.y + this.height * 0.5];
  }

  setUserValues(userValues) {
    this.userValues = { ...userValues };
  }
  setSelected(bool) {
    this.selected = bool;
  }
  setFillStyle(hex) {
    this.style = hex;
  }
  setFunctionString(text) {
    this.functionString = text;
  }
  setText(inputText) {
    this.text = inputText;

    // auto set width from textSize
    this.setWidthFromText();
  }
  setNextItem(item) {
    this.nextItem = item;
  }
  isBetween(x, min, max) {
    return x >= min && x <= max;
  }
  fillSelected(ctx) {
    ctx.fillStyle = '#d4d7d8';
    ctx.fill();
  }
  isNearExitPointSwitch(x, y) {
    const numberOfExitPoints = 1 + this.userValues?.switchArray.length;

    if (numberOfExitPoints === 1) {
      const bottomPoint = this.getExitPoint();

      if (
        this.isBetween(x, bottomPoint[0] - 5, bottomPoint[0] + 5) &&
        this.isBetween(y, bottomPoint[1] - 5, bottomPoint[1] + 5)
      ) {
        return this.userValues.default.exitPoint;
      }

      return false;
    }

    for (let i = 1; i <= numberOfExitPoints; i++) {
      const bottomPoint = this.getBottomPointForExit(numberOfExitPoints, i);

      if (
        this.isBetween(x, bottomPoint[0] - 5, bottomPoint[0] + 5) &&
        this.isBetween(y, bottomPoint[1] - 5, bottomPoint[1] + 5)
      ) {
        if (i == numberOfExitPoints) {
          // last exit point is the default exit point
          return this.userValues.default.exitPoint;
        }
        return this.userValues.switchArray[i - 1].exitPoint;
      }
    }
    return false;
  }

  isNearExitPointMenu(x, y) {
    const numberOfExitPoints = this.userValues.items.length;

    if (numberOfExitPoints === 0) return false;

    if (numberOfExitPoints === 1) {
      const bottomPoint = this.getExitPoint();

      if (
        this.isBetween(x, bottomPoint[0] - 5, bottomPoint[0] + 5) &&
        this.isBetween(y, bottomPoint[1] - 5, bottomPoint[1] + 5)
      ) {
        return this.userValues.items[0].action;
      }

      return false;
    }

    // items >1

    for (let i = 1; i <= numberOfExitPoints; i++) {
      const bottomPoint = this.getBottomPointForExit(numberOfExitPoints, i);

      if (
        this.isBetween(x, bottomPoint[0] - 5, bottomPoint[0] + 5) &&
        this.isBetween(y, bottomPoint[1] - 5, bottomPoint[1] + 5)
      ) {
        return this.userValues.items[i - 1].action;
      }
    }
    return false;
  }

  isMouseInShape(x, y) {
    // returns true if mouse is in shape; else false
    let shapeLeft, shapeRight, shapeTop, shapeBottom;

    shapeLeft = this.x - this.width / 2;
    shapeRight = this.x + this.width / 2;
    shapeTop = this.y - this.height / 2;
    shapeBottom = this.y + this.height / 2;

    return x > shapeLeft && x < shapeRight && y > shapeTop && y < shapeBottom;
  }

  setWidthFromText() {
    switch (this.type) {
      case 'runScript':
        this.width = this.text.length * 11.5;
        break;

      case 'callAPI':
        this.width = this.text.length * 10.5 + 10;
        break;

      case 'setParams':
        this.width = this.text.length * 11.5;
        break;

      case 'switch':
        this.width =
          this.text.length * 12 < 130 ? 130 : this.text.length * 12 + 50;
        break;

      case 'playMenu':
        this.width =
          this.text.length * 12 < 125 ? 125 : this.text.length * 12 + 50;
        break;

      case 'getDigits':
        this.width = this.text.length * 11 + 30;
        break;

      case 'playMessage':
        this.width = this.text.length * 10.3 + 10;
        break;

      case 'playConfirm':
        this.width = this.text.length * 10.3 + 10;
        break;
    }
  }

  drawShape(ctx) {
    switch (this.type) {
      case 'runScript':
        this.drawRectangle(ctx);
        break;

      case 'callAPI':
        this.drawInvertedHexagon(ctx);
        break;

      case 'setParams':
        this.drawPentagon(ctx);
        break;

      case 'playMenu':
        this.drawHexagon(ctx);
        break;

      case 'getDigits':
        this.drawParallelogram(ctx);
        break;

      case 'playMessage':
        this.drawRoundedRectangle(ctx);
        break;

      case 'playConfirm':
        this.drawRoundedRectangle2(ctx);
        break;

      case 'connector':
        this.drawSmallCircle(ctx);
        break;

      case 'jumper':
        this.drawTriangle(ctx);
        break;

      case 'switch':
        this.drawPentagonSwitch(ctx);
        break;

      case 'exitPoint':
        this.drawTinyCircle(ctx);
        break;
    }
  }

  drawInvertedHexagon(ctx) {
    ctx.beginPath();
    ctx.translate(this.x, this.y);

    ctx.moveTo(this.width * 0.5, -this.height * 0.5);
    ctx.lineTo(this.width * 0.5, this.height * 0.5);
    ctx.lineTo(0, this.height * 0.5 + this.height * 0.3);
    ctx.lineTo(-this.width * 0.5, this.height * 0.5);
    ctx.lineTo(-this.width * 0.5, -this.height * 0.5);
    ctx.lineTo(0, -this.height * 0.5 - this.height * 0.3);

    ctx.closePath();
    ctx.setTransform(1, 0, 0, 1, 0, 0);

    if (this.stroke) {
      // fill color when selected
      this.selected && this.fillSelected(ctx);

      ctx.font = '19px sans-serif';
      ctx.fillStyle = 'black';
      ctx.lineWidth = 2;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(this.text, this.x, this.y);
      ctx.strokeStyle = '#2196f3';
      ctx.stroke();
      return;
    }

    ctx.fillStyle = this.style;
    ctx.lineWidth = 2;
    ctx.fill();
  }

  drawSmallCircle(ctx) {
    ctx.beginPath();

    if (this.stroke) {
      ctx.arc(this.x, this.y, Math.abs(this.width * 0.5), 0, Math.PI * 2);
      // fill color if selected
      this.selected && this.fillSelected(ctx);
      ctx.fillStyle = '#009688';
      ctx.fill();

      ctx.lineWidth = 1;
      ctx.font = '30px sans-serif';
      ctx.fillStyle = 'black';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('+', this.x, this.y + 2);

      return;
    }

    ctx.fillStyle = '#b2dfdb';
    ctx.lineWidth = 2;
    ctx.arc(this.x, this.y, Math.abs(this.width * 0.5), 0, Math.PI * 2);
    ctx.fill();
    ctx.lineWidth = 1;
    ctx.font = '25px sans-serif';
    ctx.fillStyle = 'black';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('+', this.x, this.y + 1);
  }

  drawRectangle(ctx) {
    if (this.stroke) {
      if (this.selected) {
        ctx.fillStyle = '#eceff1';
        ctx.fillRect(
          this.x - this.width / 2,
          this.y - this.height / 2,
          this.width,
          this.height
        );
      }
      ctx.font = '19px sans-serif';
      ctx.fillStyle = 'black';
      ctx.lineWidth = 2;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(this.text, this.x, this.y);
      ctx.strokeStyle = '#ff5722';
      ctx.strokeRect(
        this.x - this.width / 2,
        this.y - this.height / 2,
        this.width,
        this.height
      );
    } else {
      ctx.fillStyle = this.style;

      ctx.lineWidth = 2;

      ctx.fillRect(
        this.x - this.width / 2,
        this.y - this.height / 2,
        this.width,
        this.height
      );
    }
  }

  drawPentagon(ctx) {
    ctx.beginPath();
    ctx.translate(this.x, this.y);

    ctx.moveTo(this.width * 0.5, -this.height * 0.5);
    ctx.lineTo(this.width * 0.5, 10);
    ctx.lineTo(0, this.height * 0.5 + 2);
    ctx.lineTo(-this.width * 0.5, 10);
    ctx.lineTo(-this.width * 0.5, -this.height * 0.5);

    ctx.closePath();
    ctx.setTransform(1, 0, 0, 1, 0, 0);

    if (this.stroke) {
      // fill color when selected
      this.selected && this.fillSelected(ctx);

      ctx.font = '19px sans-serif';
      ctx.fillStyle = 'black';
      ctx.lineWidth = 2;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(this.text, this.x, this.y - 2);
      ctx.strokeStyle = '#e91e63';
      ctx.stroke();
      return;
    }

    ctx.fillStyle = this.style;
    ctx.lineWidth = 2;
    ctx.fill();
  }

  drawParallelogram(ctx) {
    ctx.beginPath();
    ctx.translate(this.x, this.y);
    ctx.lineTo(this.width * 0.5 - this.height * 0.5, this.height * 0.5);
    ctx.lineTo(-this.width * 0.5 - this.height * 0.5, this.height * 0.5);
    ctx.lineTo(-this.width * 0.5 + this.height * 0.5, -this.height * 0.5);
    ctx.lineTo(this.width * 0.5 + this.height * 0.5, -this.height * 0.5);
    ctx.closePath();
    ctx.setTransform(1, 0, 0, 1, 0, 0);

    if (this.stroke) {
      // fill color when selected
      this.selected && this.fillSelected(ctx);

      ctx.font = '19px sans-serif';
      ctx.fillStyle = 'black';
      ctx.lineWidth = 2;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(this.text, this.x, this.y);
      ctx.strokeStyle = '#9c27b0';
      ctx.stroke();
      return;
    }
    ctx.fillStyle = this.style;
    ctx.lineWidth = 2;
    ctx.fill();
  }

  drawHexagon(ctx) {
    ctx.beginPath();
    ctx.translate(this.x, this.y);

    ctx.moveTo(this.width * 0.5, 0);
    ctx.lineTo(this.width * 0.4, 0.5 * this.height);

    ctx.lineTo(-this.width * 0.4, 0.5 * this.height);
    ctx.lineTo(-this.width * 0.5, 0);
    ctx.lineTo(-this.width * 0.4, -0.5 * this.height);
    ctx.lineTo(this.width * 0.4, -0.5 * this.height);
    ctx.closePath();
    ctx.setTransform(1, 0, 0, 1, 0, 0);

    if (this.stroke) {
      // fill color when selected
      this.selected && this.fillSelected(ctx);

      ctx.font = '19px sans-serif';
      ctx.fillStyle = 'black';
      ctx.lineWidth = 2;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(this.text, this.x, this.y);
      ctx.strokeStyle = '#009688';
      ctx.stroke();
      this.drawExitPointsMenu(ctx);
      return;
    }

    ctx.fillStyle = this.style;
    ctx.lineWidth = 2;
    ctx.fill();
  }

  drawRoundedRectangle(ctx) {
    ctx.beginPath();
    ctx.translate(this.x, this.y);
    ctx.moveTo(this.width * 0.5 - this.height * 0.5, this.height * 0.5);
    ctx.lineTo(-(this.width * 0.5 - this.height * 0.5), this.height * 0.5);

    ctx.arc(
      -(this.width * 0.5 - this.height * 0.5),
      0,
      Math.abs(this.height * 0.5),
      0.5 * Math.PI,
      1.5 * Math.PI
    );
    ctx.lineTo(this.width * 0.5 - this.height * 0.5, -this.height * 0.5);
    ctx.arc(
      this.width * 0.5 - this.height * 0.5,
      0,
      Math.abs(this.height * 0.5),
      1.5 * Math.PI,
      0.5 * Math.PI
    );
    ctx.closePath();
    ctx.setTransform(1, 0, 0, 1, 0, 0);

    if (this.stroke) {
      // fill color if selected
      this.selected && this.fillSelected(ctx);

      ctx.font = '19px sans-serif';
      ctx.fillStyle = 'black';
      ctx.lineWidth = 2;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(this.text, this.x, this.y);
      ctx.strokeStyle = '#c0ca33';
      ctx.stroke();
      return;
    }
    ctx.fillStyle = this.style;
    ctx.lineWidth = 2;
    ctx.fill();
  }

  drawRoundedRectangle2(ctx) {
    ctx.beginPath();
    ctx.translate(this.x, this.y);

    ctx.moveTo(this.width * 0.5 - this.height * 0.5, this.height * 0.5);
    ctx.lineTo(-(this.width * 0.5 - this.height * 0.5), this.height * 0.5);
    // ctx.lineTo(-this.width * 0.5, -this.height * 0.5);
    ctx.arc(
      -(this.width * 0.5 - this.height * 0.5),
      0,
      Math.abs(this.height * 0.5),
      0.5 * Math.PI,
      1.5 * Math.PI
    );
    ctx.lineTo(this.width * 0.5 - this.height * 0.5, -this.height * 0.5);
    ctx.arc(
      this.width * 0.5 - this.height * 0.5,
      0,
      Math.abs(this.height * 0.5),
      1.5 * Math.PI,
      0.5 * Math.PI
    );
    ctx.closePath();
    ctx.setTransform(1, 0, 0, 1, 0, 0);

    if (this.stroke) {
      // fill color if selected
      this.selected && this.fillSelected(ctx);

      ctx.font = '19px sans-serif';
      ctx.fillStyle = 'black';
      ctx.lineWidth = 2;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(this.text, this.x, this.y);
      ctx.strokeStyle = '#7cb342';
      ctx.stroke();
      return;
    }
    ctx.fillStyle = this.style;
    ctx.lineWidth = 2;
    ctx.fill();
  }
  drawTriangle(ctx) {
    ctx.beginPath();

    if (this.stroke) {
      ctx.arc(this.x, this.y, Math.abs(this.width * 0.5), 0, Math.PI * 2);
      // fill color if selected
      this.selected && this.fillSelected(ctx);
      ctx.fillStyle = this.style;
      ctx.fill();

      ctx.lineWidth = 1;
      ctx.font = '20px sans-serif';
      ctx.fillStyle = 'black';

      ctx.fillText('▼', this.x, this.y + 2);

      return;
    }

    ctx.fillStyle = this.style;
    ctx.lineWidth = 2;
    ctx.arc(this.x, this.y, Math.abs(this.width * 0.5), 0, Math.PI * 2);
    ctx.fill();
    ctx.lineWidth = 1;
    ctx.font = '20px sans-serif';
    ctx.fillStyle = 'black';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('▼', this.x, this.y + 2);
  }

  drawPentagonSwitch(ctx) {
    ctx.beginPath();
    ctx.translate(this.x, this.y);

    ctx.moveTo(this.width * 0.5, this.height * 0.1);
    ctx.lineTo(this.width * 0.5, this.height * 0.5);
    ctx.lineTo(-this.width * 0.5, this.height * 0.5);
    ctx.lineTo(-this.width * 0.5, this.height * 0.1);
    ctx.lineTo(0, -this.height * 0.5);

    ctx.closePath();
    ctx.setTransform(1, 0, 0, 1, 0, 0);

    if (this.stroke) {
      // exit points for switch when in stage

      // fill color if selected
      this.selected && this.fillSelected(ctx);

      ctx.font = '19px sans-serif';
      ctx.fillStyle = 'black';
      ctx.lineWidth = 2;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(this.text, this.x, this.y + 7);
      ctx.strokeStyle = this.style;
      ctx.stroke();
      this.drawExitPointsSwitch(ctx);
      return;
    }

    ctx.fillStyle = this.style;
    ctx.lineWidth = 2;
    ctx.fill();
  }

  drawExitPointsSwitch(ctx) {
    const numberOfExitPoints = 1 + this.userValues?.switchArray.length;

    if (numberOfExitPoints === 1) {
      this.drawTinyCircle(ctx, ...this.getExitPoint(), '#43a047');
      return;
    }

    // more than 1; spread them evenly bottom
    // including default exit point

    for (let i = 1; i <= numberOfExitPoints; i++) {
      const bottomPoint = this.getBottomPointForExit(numberOfExitPoints, i);
      this.drawTinyCircle(ctx, ...bottomPoint, '#43a047');
    }
  }

  drawExitPointsMenu(ctx) {
    const numberOfExitPoints = this.userValues.items.length;
    if (numberOfExitPoints === 0) return;

    if (numberOfExitPoints === 1) {
      this.drawTinyCircle(ctx, ...this.getExitPoint(), '#fb8c00');
      return;
    }

    for (let i = 1; i <= numberOfExitPoints; i++) {
      const bottomPoint = this.getBottomPointForExit(numberOfExitPoints, i);
      this.drawTinyCircle(ctx, ...bottomPoint, '#fb8c00');
    }
  }

  drawTinyCircle(ctx, x, y, color = 'black') {
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.closePath();
  }
}

export default Shape;
