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

  getRelativeExitPoint(shape2) {
    let [x, y] = this.getBottomCordinates();

    if (this.y < shape2.y) {
      let [bottomX1, bottomY1] = this.getBottomCordinates();
      let [topX2, topY2] = shape2.getTopCordinates();

      if (topY2 > bottomY1) {
        [x, y] = this.getBottomCordinates();
      } else {
        if (this.x < shape2.x) {
          [x, y] = this.getRightCordinates();
        } else {
          [x, y] = this.getLeftCordinates();
        }
      }
    } else {
      if (this.x < shape2.x) {
        [x, y] = this.getRightCordinates();
      } else {
        [x, y] = this.getLeftCordinates();
      }
    }

    return [x, y];
  }

  getRelativeEntryPoint(shape1, exitPoint) {
    let [x, y] = this.getLeftCordinates();
    let slope = (y - exitPoint.y) / (x - exitPoint.x);

    if (this.y >= shape1.y) {
      if (shape1.x < this.x) {
        if (!(Math.abs(slope) < 0.5)) {
          [x, y] = this.getTopCordinates();
        }
      } else {
        [x, y] = this.getRightCordinates();
        slope = (y - exitPoint.y) / (x - exitPoint.x);

        if (!(Math.abs(slope) < 0.5)) {
          [x, y] = this.getTopCordinates();
        }
      }
    } else {
      if (exitPoint.x > this.x) {
        [x, y] = this.getRightCordinates();
      } else {
        [x, y] = this.getLeftCordinates();
      }
    }

    return [x, y];
  }

  getBottomCordinates() {
    return [this.x, this.y + this.height / 2];
  }
  getTopCordinates() {
    return [this.x, this.y - this.height / 2];
  }
  getLeftCordinates() {
    return [this.x - this.width / 2, this.y];
  }
  getRightCordinates() {
    return [this.x + this.width / 2, this.y];
  }

  getExitPoint() {
    return [this.x, this.y + this.height / 2];
  }

  getBottomPointForExit(numExits, exitIndex) {
    const xCoord = (this.width / (numExits + 1)) * (exitIndex + 1);
    return [this.x - this.width / 2 + xCoord, this.y + this.height / 2];
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
    const numExitPoints = 1 + (this.userValues?.switchArray.length || 0);
    let bottomPoint;

    if (numExitPoints === 1) {
      bottomPoint = this.getExitPoint();

      if (
        this.isBetween(x, bottomPoint[0] - 5, bottomPoint[0] + 5) &&
        this.isBetween(y, bottomPoint[1] - 5, bottomPoint[1] + 5)
      ) {
        return this.userValues.default.exitPoint;
      }

      return false;
    }

    for (let i = 1; i <= numExitPoints; i++) {
      bottomPoint = this.getBottomPointForExit(numExitPoints, i);

      if (
        this.isBetween(x, bottomPoint[0] - 5, bottomPoint[0] + 5) &&
        this.isBetween(y, bottomPoint[1] - 5, bottomPoint[1] + 5)
      ) {
        if (i == numExitPoints) {
          return this.userValues.default.exitPoint;
        }
        return this.userValues.switchArray[i - 1].exitPoint;
      }
    }
    return false;
  }

  isNearExitPointMenu(x, y) {
    const itemsWithoutDefaults = this.userValues.items.filter(
      (item) => !(item.isDefault === true)
    );
    const numberOfExitPoints = itemsWithoutDefaults.length;

    if (numberOfExitPoints === 0) return false;

    // If one exit point
    if (numberOfExitPoints === 1) {
      const bottomPoint = this.getExitPoint();

      if (
        this.isBetween(x, bottomPoint[0] - 5, bottomPoint[0] + 5) &&
        this.isBetween(y, bottomPoint[1] - 5, bottomPoint[1] + 5)
      ) {
        return itemsWithoutDefaults[0].action;
      }

      return false;
    }

    // If multiple exit points
    for (let i = 1; i <= numberOfExitPoints; i++) {
      const bottomPoint = this.getBottomPointForExit(numberOfExitPoints, i);

      if (
        this.isBetween(x, bottomPoint[0] - 5, bottomPoint[0] + 5) &&
        this.isBetween(y, bottomPoint[1] - 5, bottomPoint[1] + 5)
      ) {
        return itemsWithoutDefaults[i - 1].action;
      }
    }
    return false;
  }

  isMouseInShape(x, y) {
    const shapeLeft = this.x - this.width / 2;
    const shapeRight = this.x + this.width / 2;
    const shapeTop = this.y - this.height / 2;
    const shapeBottom = this.y + this.height / 2;

    return x > shapeLeft && x < shapeRight && y > shapeTop && y < shapeBottom;
  }

  setWidthFromText(ctx) {
    const width = ctx.measureText(this.text).width;

    if (this.type === 'playMenu' || this.type === 'switch') {
      this.width = width + 25 > 125 ? width + 30 : 125;
      return;
    }

    this.width = width + 20;
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

      case 'endFlow':
        this.drawEndCircle(ctx);
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

      case 'tinyCircle':
        this.drawTinyCircle(ctx);
    }
  }

  drawInvertedHexagon(ctx) {
    ctx.beginPath();
    ctx.translate(this.x, this.y);
    this.stroke && this.setWidthFromText(ctx);

    ctx.moveTo(this.width / 2, -(this.height / 3));
    ctx.lineTo(this.width / 2, this.height / 3);
    ctx.lineTo(0, this.height / 2);
    ctx.lineTo(-this.width / 2, this.height / 3);
    ctx.lineTo(-this.width / 2, -this.height / 3);
    ctx.lineTo(0, -this.height / 2);

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

  drawEndCircle(ctx) {
    ctx.beginPath();

    if (this.stroke) {
      ctx.arc(this.x, this.y, Math.abs(this.width * 0.5), 0, Math.PI * 2);
      // fill color if selected
      this.selected && this.fillSelected(ctx);
      ctx.fillStyle = this.style;
      ctx.fill();

      ctx.lineWidth = 1;
      ctx.font = '25px sans-serif';
      ctx.fillStyle = 'black';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('Χ', this.x, this.y + 2);

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
    ctx.fillText('Χ', this.x, this.y + 1);
  }

  drawSmallCircle(ctx) {
    ctx.beginPath();

    if (this.stroke) {
      ctx.arc(this.x, this.y, Math.abs(this.width * 0.5), 0, Math.PI * 2);
      // fill color if selected
      this.selected && this.fillSelected(ctx);
      ctx.fillStyle = this.style;
      ctx.fill();

      ctx.lineWidth = 1;
      ctx.font = '30px sans-serif';
      ctx.fillStyle = 'black';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('+', this.x, this.y + 2);

      return;
    }

    ctx.fillStyle = this.style;
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
      this.setWidthFromText(ctx);
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
    this.stroke && this.setWidthFromText(ctx);

    ctx.moveTo(this.width / 2, -this.height / 2);
    ctx.lineTo(this.width / 2, this.height / 3);
    ctx.lineTo(0, this.height / 2);
    ctx.lineTo(-this.width / 2, this.height / 3);
    ctx.lineTo(-this.width / 2, -this.height / 2);

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
    this.stroke && this.setWidthFromText(ctx);
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
    this.stroke && this.setWidthFromText(ctx);
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
    this.stroke && this.setWidthFromText(ctx);
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
      ctx.strokeStyle = this.style;
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
    this.stroke && this.setWidthFromText(ctx);
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
    this.stroke && this.setWidthFromText(ctx);
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
      ctx.fillText(this.text, this.x, this.y + 6);
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
    // only draw exitPoints for non default actions
    const itemsWithoutDefaults = this.userValues.items.filter(
      (item) => !(item.isDefault === true)
    );
    const numberOfExitPoints = itemsWithoutDefaults.length;

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
