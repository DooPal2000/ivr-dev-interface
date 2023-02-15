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
    if (this.type === 'connector') {
      return this.getConnectorCordinates(shape2.x, shape2.y);
    }

    let [x, y] = this.getBottomCordinates();

    if (this.y < shape2.y) {
      if (shape2.getTopCordinates()[1] < this.getBottomCordinates()[1]) {
        [x, y] =
          this.x < shape2.x
            ? this.getRightCordinates()
            : this.getLeftCordinates();
      }
    } else {
      [x, y] =
        this.x < shape2.x
          ? this.getRightCordinates()
          : this.getLeftCordinates();
    }

    return [x, y];
  }

  getRelativeEntryPoint(shape1, exitPoint) {
    if (this.type === 'connector') {
      return this.getConnectorCordinates(exitPoint.x, exitPoint.y);
    }

    let [x, y] = this.getTopCordinates();

    if (this.getTopCordinates()[1] < shape1.getBottomCordinates()[1]) {
      let dxLeft = Math.abs(this.getLeftCordinates()[0] - exitPoint.x);
      let dxRight = Math.abs(this.getRightCordinates()[0] - exitPoint.x);

      [x, y] =
        dxLeft < dxRight ? this.getLeftCordinates() : this.getRightCordinates();
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

  getConnectorCordinates(pointX, pointY) {
    const angle = Math.atan2(pointY - this.y, pointX - this.x);
    const radius = this.width / 2;
    const x = this.x + radius * Math.cos(angle);
    const y = this.y + radius * Math.sin(angle);

    return [x, y];
  }

  getExitPoint() {
    return [this.x, this.y + this.height / 2];
  }

  getBottomPointForExit(numExits, exitIndex) {
    const xCoord = (this.width / (numExits + 1)) * exitIndex;
    return [this.x - this.width / 2 + xCoord, this.y + this.height / 2];
  }

  setUserValues(userValues) {
    this.userValues = {...userValues};
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

  distanceBetweenPoints(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  }

  fillSelected(ctx) {
    ctx.fillStyle = '#d4d7d8';
    ctx.fill();
  }

  isNearExitPointSwitch(x, y) {
    const numExitPoints =
      1 +
      this.userValues?.switchArray.filter(
        (object) => object.condition && object.exitPoint
      ).length;
    let bottomPoint;

    if (numExitPoints === 1) {
      // return this.userValues.default.exitPoint;
      return {
        position: 1,
        totalPoints: 1,
        exitPoint: this.userValues.default.exitPoint,
      };
    }

    let distancesFromExitPoints = [];

    for (let i = 1; i <= numExitPoints; i++) {
      bottomPoint = this.getBottomPointForExit(numExitPoints, i);
      const distance = this.distanceBetweenPoints(...bottomPoint, x, y);

      distancesFromExitPoints.push(distance);
    }

    const smallest = distancesFromExitPoints.reduce(
      (acc, current, index) => {
        if (current < acc.value) {
          return {value: current, index};
        }
        return acc;
      },
      {value: Infinity, index: -1}
    );

    if (smallest.index + 1 == numExitPoints) {
      return this.userValues.default.exitPoint;
    }

    return {
      position: smallest.index,
      totalPoints: numExitPoints,
      exitPoint: this.userValues.switchArray[smallest.index].exitPoint,
    };
  }

  isNearExitPointMenu(x, y) {
    const nonDefaultItems = this.userValues.items.filter(
      (item) => !item.isDefault
    );
    const exitPoints = nonDefaultItems.map((item) => item.action);

    if (!exitPoints.length) return false;

    if (exitPoints.length === 1) {
      return {position: 0, totalPoints: 1, exitPoint: exitPoints[0]};
    }

    const distancesFromExitPoints = exitPoints.map((exitPoint, index) => {
      const bottomPoint = this.getBottomPointForExit(
        exitPoints.length,
        index + 1
      );
      return this.distanceBetweenPoints(...bottomPoint, x, y);
    });

    const closestExit = distancesFromExitPoints.reduce(
      (acc, current, index) => {
        if (current < acc.value) {
          return {value: current, index};
        }
        return acc;
      },
      {value: Infinity, index: -1}
    );

    return {
      position: closestExit.index,
      totalPoints: exitPoints.length,
      exitPoint: exitPoints[closestExit.index],
    };
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

    if (this.type === 'playMenu') {
      this.width = width + 30 > 120 ? width + 30 : 120;
      return;
    }
    if (this.type === 'switch') {
      this.width = width + 40 > 120 ? width + 40 : 120;
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
        break;

      case 'module':
        this.drawModule(ctx);
        break;
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

      ctx.font = '18px sans-serif';
      ctx.fillStyle = 'black';
      ctx.lineWidth = 2;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(this.text, this.x, this.y);
      ctx.strokeStyle = '#2196f3';
      ctx.stroke();
      return;
    }

    ctx.strokeStyle = this.style;
    ctx.lineWidth = 2;
    ctx.stroke();
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

    ctx.strokeStyle = this.style;
    ctx.lineWidth = 2;
    ctx.arc(this.x, this.y, Math.abs(this.width * 0.5), 0, Math.PI * 2);
    ctx.stroke();
    ctx.lineWidth = 1;
    ctx.font = '18px sans-serif';
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

    ctx.strokeStyle = this.style;
    ctx.lineWidth = 2;
    ctx.arc(this.x, this.y, Math.abs(this.width * 0.5), 0, Math.PI * 2);
    ctx.stroke();
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
      ctx.font = '18px sans-serif';
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
      ctx.strokeStyle = this.style;

      ctx.lineWidth = 2;

      ctx.strokeRect(
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

      ctx.font = '18px sans-serif';
      ctx.fillStyle = 'black';
      ctx.lineWidth = 2;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(this.text, this.x, this.y - 2);
      ctx.strokeStyle = '#e91e63';
      ctx.stroke();
      return;
    }

    ctx.strokeStyle = this.style;
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  drawParallelogram(ctx) {
    ctx.beginPath();
    ctx.translate(this.x, this.y);
    this.stroke && this.setWidthFromText(ctx);
    ctx.moveTo(-this.width * (3 / 8), -this.height / 2);
    ctx.lineTo(this.width * (5 / 8), -this.height / 2);
    ctx.lineTo(this.width * (3 / 8), this.height / 2);
    ctx.lineTo(-this.width * (5 / 8), this.height / 2);
    ctx.closePath();
    ctx.setTransform(1, 0, 0, 1, 0, 0);

    if (this.stroke) {
      // fill color when selected
      this.selected && this.fillSelected(ctx);

      ctx.font = '18px sans-serif';
      ctx.fillStyle = 'black';
      ctx.lineWidth = 2;

      ctx.textAlign = 'center';
      ctx.fillText(this.text, this.x, this.y);

      ctx.strokeStyle = '#9c27b0';
      ctx.stroke();
      return;
    }
    ctx.strokeStyle = this.style;
    ctx.lineWidth = 2;
    ctx.stroke();
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

      ctx.font = '18px sans-serif';
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

    ctx.strokeStyle = this.style;
    ctx.lineWidth = 2;
    ctx.stroke();
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

      ctx.font = '18px sans-serif';
      ctx.fillStyle = 'black';
      ctx.lineWidth = 2;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(this.text, this.x, this.y);
      ctx.strokeStyle = this.style;
      ctx.stroke();
      return;
    }
    ctx.strokeStyle = this.style;
    ctx.lineWidth = 2;
    ctx.stroke();
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

      ctx.font = '18px sans-serif';
      ctx.fillStyle = 'black';
      ctx.lineWidth = 2;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(this.text, this.x, this.y);
      ctx.strokeStyle = '#7cb342';
      ctx.stroke();
      return;
    }
    ctx.strokeStyle = this.style;
    ctx.lineWidth = 2;
    ctx.stroke();
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

    ctx.strokeStyle = this.style;
    ctx.lineWidth = 2;
    ctx.arc(this.x, this.y, Math.abs(this.width * 0.5), 0, Math.PI * 2);
    ctx.stroke();
    ctx.lineWidth = 1;
    ctx.font = '18px sans-serif';
    ctx.fillStyle = 'black';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('▼', this.x, this.y + 2);
  }

  drawPentagonSwitch(ctx) {
    ctx.beginPath();
    ctx.translate(this.x, this.y);
    this.stroke && this.setWidthFromText(ctx);
    ctx.moveTo(this.width * 0.5, this.height * 0.5);
    ctx.lineTo(-this.width * 0.5, this.height * 0.5);
    ctx.lineTo(-this.width * 0.5 + 0.5 * this.height, -this.height * 0.5);
    ctx.lineTo(this.width * 0.5 - 0.5 * this.height, -this.height * 0.5);

    ctx.closePath();
    ctx.setTransform(1, 0, 0, 1, 0, 0);

    if (this.stroke) {
      // exit points for switch when in stage

      // fill color if selected
      this.selected && this.fillSelected(ctx);

      ctx.font = '18px sans-serif';
      ctx.fillStyle = 'black';
      ctx.lineWidth = 2;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(this.text, this.x, this.y);
      ctx.strokeStyle = this.style;
      ctx.stroke();
      this.drawExitPointsSwitch(ctx);
      return;
    }

    ctx.strokeStyle = this.style;
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  drawExitPointsSwitch(ctx) {
    const numberOfExitPoints =
      1 +
      this.userValues?.switchArray.filter(
        (object) => object.condition && object.exitPoint
      ).length;

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

  drawModule(ctx) {
    this.setWidthFromText(ctx);
    ctx.fillStyle = this.style;
    ctx.fillRect(
      this.x - this.width / 2,
      this.y - this.height / 2,
      this.width,
      this.height
    );
    ctx.strokeStyle = '#eda167';
    ctx.strokeRect(
      this.x - this.width / 2,
      this.y - this.height / 2,
      this.width,
      this.height
    );
    ctx.font = '18px sans-serif';
    ctx.fillStyle = 'black';
    ctx.lineWidth = 2;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(this.text, this.x, this.y);
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
