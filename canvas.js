// Canvas utility classes and functions to interact with canvas

const canvasObserver = (obj, node) => {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        obj.loop();
      } else {
        obj.noLoop();
      }
    });
  });
  observer.observe(node);
}

const setColor = (p, colorList, stroke=false, weight=1) => {
  const rgbToHex = (r, g, b) => {
    const componentToHex = (c) => {
        const hex = c.toString(16);
        return hex.length == 1 ? "0" + hex : hex;
    }
    return `#${componentToHex(r) + componentToHex(g) + componentToHex(b)}`;
  }
  const obj = {}
  obj.fill = []
  for (let color of colorList) {
    let colorObj = p.color(color);
    colorObj.hex = rgbToHex(colorObj.levels[0], colorObj.levels[1], colorObj.levels[2])
    obj.fill.push(colorObj);
  }
  obj.stroke = stroke ? p.color(stroke) : false;
  obj.weight = weight;
  return obj;
}

const linearGradient = (ctx, p, start, end, colorList) => {
  try {
    let gradient = ctx.createLinearGradient(start.x, start.y, end.x, end.y);
    for (let [i, item] of colorList.entries()) {
      let mappedVal = parseFloat(p.map(i, 0, colorList.length - 1, 0, 1));
      let rgba = `rgba(${item.levels[0]}, ${item.levels[1]}, ${item.levels[2]}, ${item.levels[3]})`;
      gradient.addColorStop(mappedVal, rgba);
    }
    return gradient;
  } catch (error) {
    console.log(colorList, 'start', start, 'end', end);
    console.log(error);
  }
}

const radialGradient = (ctx, p, mass, pos, colorList) => {
  try {
    let radius = mass.x / 2;
    let gradient = ctx.createRadialGradient(pos.x, pos.y, radius / 2, pos.x, pos.y, radius);
    
    for (let [i, item] of colorList.entries()) {
      let mappedVal = parseFloat((i / colorList.length).toFixed(1));
      let rgba = `rgba(${item.levels[0]}, ${item.levels[1]}, ${item.levels[2]}, ${item.levels[3]})`;
      gradient.addColorStop(mappedVal, rgba);
    }
    return gradient;
  } catch (error) {
    console.log(colorList, 'pos', pos, 'mass', mass);
    console.log(error);
  }
}

const ranVector = (canvas, size) => {
  let x = canvas.p.random(size, canvas.p.width - size);
  let y = canvas.p.random(size, canvas.p.height - size);
  return canvas.p.createVector(x, y);
}

class CanvasManager {
  constructor(p5, p, elem) {
    this.canvas = p.createCanvas(elem.offsetWidth, elem.offsetHeight, elem);
    this.p5 = p5;
    this.p = p;
    this.center = p.createVector(p.width / 2, p.height / 2);
    this.ctx = this.canvas.drawingContext;
    this.background;
    this.flowfield = {};
    this.force;
    this.objects = [];
  }

  getFieldZone(pos) {
    let x = this.p.floor(pos.x / this.flowfield.width);
    let y = this.p.floor(pos.y / this.flowfield.width);
    return this.flowfield.field[x][y];
  }
  
  updateFlowfield() {
    this.p.angleMode(this.p.RADIANS);
    let yoff = 0;
    for (let x = 0; x < this.flowfield.field.length; x++) {
      let xoff = 0;
      for (let y = 0; y < this.flowfield.field[x].length; y++) {
        let cell = this.flowfield.field[x][y];
        let angle = this.p.noise(xoff, yoff, this.flowfield.offset) * this.p.TWO_PI * 4;
        cell.vel.set(this.p5.Vector.fromAngle(angle).setMag(1));
        xoff += this.flowfield.multiplier;
      }
      yoff += this.flowfield.multiplier;
      this.flowfield.offset += 0.0001;
    }
  }
  
  drawFlowfield() {
    for (let x = 0; x < this.flowfield.field.length; x++) {
      for (let y = 0; y < this.flowfield.field[x].length; y++) {
        let cell = this.flowfield.field[x][y];
        this.p.stroke(255);
        this.p.push();
        this.p.translate(cell.pos.x, cell.pos.y);
        this.p.rotate(cell.vel.heading());
        this.p.line(0, 0, this.flowfield.width / 2, 0)
        this.p.pop();
      }
    }
  }

  setFlowfield(num, offset, multiplier) {
    this.flowfield.width = num;
    this.flowfield.offset = offset;
    this.flowfield.multiplier = multiplier;
    this.flowfield.field = [];
    for (let x = 0; x < this.p.width / num; x++) {
      let col = []
      for (let y = 0; y < this.p.height / num; y++) {
        let mass = this.p.createVector(num, num);
        let pos = this.p.createVector((x * num) + (num / 2), (y * num) + num / 2);
        col.push(new Rect(this, pos, false, false, mass, setColor(this.p, ['pink'])));
      }
      this.flowfield.field.push(col);
    }
  }
  
  bg() {
    this.p.rectMode(this.p.CORNER);
    this.ctx.fillStyle = this.background;
    this.p.rect(0, 0, this.p.width, this.p.height);
    this.p.rectMode(this.p.CENTER);
  }

  applyGradient() {
    this.ctx.fillStyle = this.background;
  }

  bounceOfBorder() {
    for (let i of this.objects) {
      i.bounceOfBorder();
    }
  }

  overlaps(obj) {
    for (let i of this.objects) {
      if (i.madeContact(obj)) {
        return true;
      }
    }
    return false;
  }

  bounceOfObject() {
    for (let i = 0; i < this.objects.length; i++) {
      const main = this.objects[i];
      main.bounced = false;
      if (main.bounced) continue;
      for (let e = i + 1; e < this.objects.length; e++) {
        let objCollide = false;
        const other = this.objects[e];
        if (other.bounced) continue;
        main.collide(other);
      }
    }
    for (let i of this.objects) i.bounced = false;
  }
}

class Shape {
  constructor(canvas, pos, vel=false, acc=false, mass, color=false, angle=[0], life=false) {
    this.p5 = canvas.p5;
    this.canvas = canvas.canvas;
    this.p = canvas.p;
    this.objects = canvas.objects;
    this.ctx = canvas.ctx;
    this.id = this.objects.length + 1;
    this.pos = pos;
    this.mass = mass;
    this.vel = vel ? vel : this.p.createVector(0, 0);
    this.acc = acc ? acc : this.p.createVector(0, 0);
    this.color = color;
    this.original = {
      pos: Object.assign({}, pos),
      mass: Object.assign({}, mass),
      vel: Object.assign({}, vel),
      acc: Object.assign({}, acc),
      color: Object.assign({}, this.color)
    }
    this.init(angle, life);
    this.setColor(this.color)
  }

  init(angle, life) {
    
    // SET ANGLE
    this.angle = {}
    this.angle.angle = angle[0];
    this.angle.vel = angle.length > 1 ? angle[1] : 0;
    this.original.angle = Object.assign({}, this.angle)

    // SET LIFE POINTS
    if (life) {
      this.life = {};
      let newMass = this.p.map(life - 1, 0, life, 0, this.mass.x);
      this.life.time = life;
      this.life.unit = this.mass.x - newMass;
      this.life.vector = this.p.createVector(this.life.unit, this.life.unit);
      this.original.life = Object.assign({}, this.life)
    }
    
  }

  sizeLife() {
    if (this.life.time > 0) {
      this.mass.sub(this.life.vector);
    }
  }

  colorLife() {
    if (this.life.time > 0) {
      let alpha = this.p.map(this.life.time, 0, this.original.life.time / 2, 0, 255);
      this.color.setAlpha(parseInt(alpha));
    }
  }

  updateLife(index) {
    if (this.life.time > 0) {
      this.life.time--;
    } else {
      this.objects.splice(index, 1);
    }
  }

  applyForce(force, speedLimit) {
    let generatedForce = this.p5.Vector.div(force, this.mass.x);
    this.acc.add(generatedForce);
    this.vel.add(this.acc);
    this.vel.limit(speedLimit);
    this.pos.add(this.vel);
    this.acc.set(0, 0);
  }

  attract(mover) {
    let force = this.p5.Vector.sub(this.pos, mover.pos);
    let distanceSq = this.p.constrain(force.magSq(), 100, 1000);
    let G = 1;
    let strength = (G * (this.mass.x * mover.mass.x)) / distanceSq;
    force.setMag(strength);
    mover.applyForce(force);
  }

  bounceOfBorder() {
    const halfX = this.mass.x / 2;
    const halfY = this.mass.y / 2;
    const x = this.pos.x + this.vel.x;
    const y = this.pos.y + this.vel.y;

    if (y < halfY)                       this.vel.y = -this.vel.y;   // Top
    if (x > this.canvas.width - halfX)   this.vel.x = -this.vel.x;   // Right
    if (y > this.canvas.height - halfY)  this.vel.y = -this.vel.y;   // Bottom
    if (x < halfX)                       this.vel.x = -this.vel.x;   // Left

    this.pos.add(this.vel);
  }

  edges() {
    const halfX = this.mass.x / 2;
    const halfY = this.mass.y / 2;

    if (this.pos.x > this.p.width - halfX) {
      this.pos.x = halfX;
    }
    if (this.pos.x < halfX) {
      this.pos.x = this.p.width - halfX;
    }
    if (this.pos.y > this.p.height - halfY) {
      this.pos.y = halfY;
    }
    if (this.pos.y < halfY) {
      this.pos.y = this.p.height - halfY;
    }
  }

  collide(other) {
    let relative = this.p5.Vector.sub(other.pos, this.pos);
    let dist = relative.mag() - ((this.mass.x / 2) + (other.mass.x / 2));
    if (dist < 0) {
      let movement = relative.copy().setMag(this.p.abs(dist/2));
      this.pos.sub(movement);
      other.pos.add(movement);
      let thisToOtherNormal = relative.copy().normalize();
      let approachSpeed = this.vel.dot(thisToOtherNormal) + -other.vel.dot(thisToOtherNormal);
      let approachVector = thisToOtherNormal.copy().setMag(approachSpeed);
      this.vel.sub(approachVector);
      other.vel.add(approachVector);
    }
  }

  madeContactX(obj) {
    const distance = this.p5.Vector.dist(this.pos, obj.pos);
    return distance <= (this.mass.x / 2) + (obj.mass.y / 2) ;
  }

  madeContactY(obj) {
    const distance = this.p5.Vector.dist(this.pos, obj.pos);
    return distance <= (this.mass.y / 2) + (obj.mass.y / 2);
  }

  madeContact(obj) {
    // let relative = this.p5.Vector.sub(other.pos, main.pos);
    // let dist = relative.mag() - (main.mass.x + other.mass.x);
    const distance = this.p5.Vector.dist(this.pos, obj.pos);
    const x = (this.mass.x / 2) + (obj.mass.x / 2);
    const y = (this.mass.y / 2) + (obj.mass.y / 2);
    return distance <= x || distance <= y;
  }

  setColor(color) {
    if (!color) return false;
    if (color.stroke) {
      this.p.strokeWeight(color.weight);
      this.p.stroke(color.stroke);
    } else {
      this.p.noStroke();
    }

    if (color.fill.length > 0) {
      if (color.fill.length > 1) {
        this.ctx.fillStyle = radialGradient(this.ctx, this.p, this.mass, this.pos, color.fill);
        this.ctx.fill();
      } else {
        this.p.fill(color.fill[0]);
      }
    } else {
      this.p.noFill();
    }
  }

  rotate(angle=false) {
    let vel = angle ? angle : this.angle.vel;
    this.angle.angle = this.angle.angle + vel
    this.p.push();
    this.p.translate(this.pos.x, this.pos.y);
    this.p.rotate(this.angle.angle);
    let pos = this.p.createVector(0,0);
    this.draw(pos);
    this.p.pop();
  }

}

class Ellipse extends Shape {
  constructor(canvas, pos, vel, acc, mass, color, angle, life) {
    super(canvas, pos, vel, acc, mass, color, angle, life);
    this.p.ellipseMode(this.p.CENTER);
  }

  draw(pos=false) {
    super.setColor(this.color);
    const custPos = pos ? pos : this.pos;
    this.p.ellipse(custPos.x, custPos.y, this.mass.x, this.mass.y);
  }

}

class Rect extends Shape {
  constructor(canvas, pos, vel, acc, mass, color, angle, life, radius=0) {
    super(canvas, pos, vel, acc, mass, color, angle, life);
    this.radius = radius;
    this.p.rectMode(this.p.CENTER);
  }

  draw(pos=false) {
    super.setColor(this.color);
    const custPos = pos ? pos : this.pos;
    this.p.rect(custPos.x, custPos.y, this.mass.x, this.mass.y, this.radius);
  }

}

class Triangle extends Shape {
  constructor(canvas, pos, vel, acc, mass, color, angle, life) {
    super(canvas, pos, vel, acc, mass, color, angle, life);
    // this.p.triangleMode(this.p.CENTER);
  }

  draw(pos=false) {
    super.setColor(this.color);
    const custPos = pos ? pos : this.pos;
    // this.p.triangle(-this.pos.x, -this.mass.y / 2, -this.mass.x, this.mass.y / 2, this.mass.x, 0);
    // this.p.triangle(-this.r, -this.r / 2, -this.r, this.r / 2, this.r, 0)
  }

}

class Polygon extends Shape {
  constructor(canvas, pos, vel, acc, mass, color, angle, life, sides) {
    super(canvas, pos, vel, acc, mass, color, angle, life, sides);
    this.sides = sides;
  }
  
  draw(pos=false) {
    super.setColor(this.color);
    const custPos = pos ? pos : this.pos;
    const radius = this.mass.x / 2;
    const angle = 360 / this.sides;
    this.p.beginShape();
    for (let i = 0; i < this.sides; i++) {
      const x = custPos.x + radius * this.p.cos(angle * i);
      const y = custPos.y + radius * this.p.sin(angle * i);
      this.p.vertex(x, y);
    }
    this.p.endShape(this.p.CLOSE);
  }

}

class Line {
  constructor(canvas, start, end, vel=false, color=false) {
    this.p5 = canvas.p5;
    this.canvas = canvas.canvas;
    this.p = canvas.p;
    this.objects = canvas.objects;
    this.id = this.objects.length + 1;
    this.start = start;
    this.end = end;
    this.vel = vel ? vel : this.p.createVector(0, 0);
    this.color = color;
    this.original = {
      start: Object.assign({}, start),
      end: Object.assign({}, end),
      vel: Object.assign({}, vel),
      color: Object.assign({}, color)
    }
    this.draw();
  }

  getDisplacement() {
    let direction = this.p5.Vector.sub(this.start, this.end);
    direction.normalize();
    return direction.mult(this.vel);
  }

  setColor(color) {
    if (!color) return false;
    if (color.stroke) {
      this.p.strokeWeight(color.weight);
      this.p.stroke(color.stroke);
    } else {
      this.p.noStroke();
    }
  }

  updatePrev() {
    this.start.x = this.end.x;
    this.start.y = this.end.y;
  }

  edges() {

    if (this.end.x > this.p.width) {
      this.end.x = 0;
      this.updatePrev();
    }
    if (this.end.x < 0) {
      this.end.x = this.p.width;
      this.updatePrev();
    }
    if (this.end.y > this.p.height) {
      this.end.y = 0;
      this.updatePrev();
    }
    if (this.end.y < 0) {
      this.end.y = this.p.height;
      this.updatePrev();
    }
  }

  add(pos) {
    this.start.set(this.end);
    this.end.set(pos);
  }

  remove(pos) {
    this.end.set(this.start);
    this.start.set(pos);
  }

  draw() {
    this.setColor(this.color);
    this.p.line(this.start.x, this.start.y, this.end.x, this.end.y);
  }
}

class Orbit {
  constructor(canvas, orbit) {
    this.p5 = canvas.p5;
    this.canvas = canvas.canvas;
    this.p = canvas.p;
    this.orbit = orbit;
    this.objects = canvas.objects;
    this.id = this.objects.length + 1;
    this.children = [];
  }

  rotate() {
    this.p.push(); 
    this.p.translate(this.orbit.pos.x, this.orbit.pos.y);
    for (let i of this.children) {
      i.pos.x = (this.orbit.mass.x / 2) * this.p.cos(i.angle.angle);
      i.pos.y = (this.orbit.mass.x / 2) * this.p.sin(i.angle.angle);
      i.draw();
      i.angle.angle += i.angle.vel;
    }
    this.p.pop();
  }
}

class Flame {
  constructor(canvas) {
    this.p5 = canvas.p5;
    this.canvas = canvas.canvas;
    this.p = canvas.p;
  }

  burn() {

  }
}

export { 
  Ellipse, Rect, Line, canvasObserver, CanvasManager, 
  Triangle, Polygon, Orbit, radialGradient, linearGradient, 
  setColor, ranVector 
}