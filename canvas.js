/**
 * The `canvasObserver` function uses the Intersection Observer API to trigger a callback function when
 * a specified element enters or exits the viewport.
 * @param obj - The `obj` parameter is an object that has two methods: `loop()` and `noLoop()`. These
 * methods are called based on the intersection state of the `node` parameter.
 * @param node - The `node` parameter is the DOM element that you want to observe for intersection with
 * the viewport. This can be any valid DOM element, such as a `<div>`, `<section>`, or `<img>`. The
 * observer will monitor this element and trigger the callback function when it becomes visible or
 */
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

/**
 * The function `setColor` takes a list of colors and returns an object with the colors converted to
 * hexadecimal format, along with stroke and weight properties.
 * @param p - The parameter `p` is likely referring to a p5.js instance, which is used for creating and
 * manipulating graphics in the p5.js library. It is commonly used in p5.js sketches to access various
 * functions and properties related to drawing and animation.
 * @param colorList - The `colorList` parameter is an array of colors. Each color can be specified in
 * different formats such as RGB, HSL, or hexadecimal. For example, `colorList` could be `['red',
 * 'green', '#0000FF']`.
 * @param [stroke=false] - The `stroke` parameter is a boolean value that determines whether or not to
 * apply a stroke color to the shape. If `stroke` is `true`, a stroke color will be applied. If
 * `stroke` is `false` or not provided, no stroke color will be applied.
 * @param [weight=1] - The `weight` parameter is used to specify the thickness of the stroke when
 * drawing shapes. It is an optional parameter with a default value of 1.
 * @returns The function `setColor` returns an object with the following properties:
 */
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

/**
 * The `linearGradient` function creates a linear gradient using a canvas context, start and end
 * points, and a list of colors.
 * @param ctx - The `ctx` parameter is the canvas rendering context. It is used to create the linear
 * gradient and add color stops to it.
 * @param p - The parameter `p` is not defined in the code snippet you provided. It seems to be used in
 * the `parseFloat` and `map` functions, but without knowing its value or purpose, it is difficult to
 * provide a specific explanation.
 * @param start - The start parameter represents the starting point of the linear gradient. It is an
 * object with two properties: x and y. The x and y values represent the coordinates of the starting
 * point on the canvas.
 * @param end - The `end` parameter represents the end point of the linear gradient. It is an object
 * with `x` and `y` properties, which specify the coordinates of the end point.
 * @param colorList - An array of objects representing colors. Each object should have the following
 * properties:
 * @returns The function `linearGradient` returns a linear gradient object.
 */
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

/**
 * The function `radialGradient` creates a radial gradient using the provided parameters and returns
 * the gradient object.
 * @param ctx - The `ctx` parameter is the 2D rendering context of the canvas element. It is used to
 * draw and manipulate graphics on the canvas.
 * @param p - The parameter `p` is not used in the function `radialGradient`. It is not clear what it
 * represents without further context.
 * @param mass - The `mass` parameter represents the mass of an object. It is used to calculate the
 * radius of the radial gradient.
 * @param pos - The `pos` parameter represents the position of the radial gradient. It is an object
 * with `x` and `y` properties, indicating the x and y coordinates of the position.
 * @param colorList - An array of objects representing colors. Each object should have the following
 * properties:
 * @returns The function `radialGradient` returns a radial gradient object.
 */
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

/**
 * The function `ranVector` generates a random vector within the given canvas boundaries.
 * @param canvas - The `canvas` parameter is an object that represents the canvas or drawing area where
 * the vector will be generated. It likely has properties such as `p` which refers to the p5.js
 * library, and `width` and `height` which represent the dimensions of the canvas.
 * @param size - The "size" parameter represents the size of the object or element for which you want
 * to generate a random vector. It is used to determine the range within which the random x and y
 * coordinates should be generated.
 * @returns The function `ranVector` returns a p5.js `createVector` object with random x and y
 * coordinates within the specified range.
 */
const ranVector = (canvas, size) => {
  let x = canvas.p.random(size, canvas.p.width - size);
  let y = canvas.p.random(size, canvas.p.height - size);
  return canvas.p.createVector(x, y);
}

/* The CanvasManager class manages a canvas in JavaScript, including handling flow fields, objects, and
collisions. */
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

  /**
   * The function `getFieldZone` takes a position and returns the corresponding field zone from the
   * flowfield.
   * @param pos - The parameter "pos" represents the position for which we want to retrieve the field
   * zone. It is an object that contains the x and y coordinates of the position.
   * @returns the value of the field at the specified position in the flowfield.
   */
  getFieldZone(pos) {
    let x = this.p.floor(pos.x / this.flowfield.width);
    let y = this.p.floor(pos.y / this.flowfield.width);
    return this.flowfield.field[x][y];
  }
  
  /**
   * The function updates the flowfield by setting the velocity of each cell based on Perlin noise.
   */
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
  
  /**
   * The function `drawFlowfield()` draws a flow field by iterating through each cell in the field and
   * drawing a line representing the direction of the cell's velocity.
   */
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

  /**
   * The function `setFlowfield` creates a flow field grid with specified parameters.
   * @param num - The "num" parameter represents the size of each cell in the flowfield grid. It
   * determines the width and height of each cell in pixels.
   * @param offset - The offset parameter determines the starting position of the flowfield. It is used
   * to calculate the position of each flowfield cell within the canvas.
   * @param multiplier - The multiplier parameter is used to scale the flow field vectors. It
   * determines the magnitude of the vectors and affects the strength of the flow. A higher multiplier
   * value will result in stronger flow, while a lower multiplier value will result in weaker flow.
   */
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
  
  /**
   * The `bg()` function sets the background color of a canvas element in JavaScript.
   */
  bg() {
    this.p.rectMode(this.p.CORNER);
    this.ctx.fillStyle = this.background;
    this.p.rect(0, 0, this.p.width, this.p.height);
    this.p.rectMode(this.p.CENTER);
  }

  /**
   * The function sets the fill style of the canvas context to the specified background color.
   */
  applyGradient() {
    this.ctx.fillStyle = this.background;
  }

  /**
   * The function iterates through a list of objects and calls a method to make each object bounce off
   * the border.
   */
  bounceOfBorder() {
    for (let i of this.objects) {
      i.bounceOfBorder();
    }
  }

  /* The above code is defining a method called "overlaps" in JavaScript. This method checks if any
  object in the "objects" array has made contact with the given "obj" object. It iterates through
  each object in the array and calls the "madeContact" method on each object. If any object returns
  true for the "madeContact" method, the "overlaps" method returns true. If no object makes contact
  with the given object, the method returns false. */
  overlaps(obj) {
    for (let i of this.objects) {
      if (i.madeContact(obj)) {
        return true;
      }
    }
    return false;
  }

  /**
   * The function iterates through a list of objects and checks for collisions between each pair of
   * objects.
   */
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

/* The Shape class is a JavaScript class that represents a shape on a canvas, with properties such as
position, velocity, acceleration, mass, color, angle, and life points. */
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

  /**
   * The `init` function initializes the angle and life properties of an object.
   * @param angle - The angle parameter is an array that contains two values. The first value
   * represents the initial angle, and the second value (optional) represents the initial velocity of
   * the angle.
   * @param life - The "life" parameter represents the life points of an object. It determines how long
   * the object will exist or how much damage it can sustain before being destroyed.
   */
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

  /**
   * The "sizeLife" function decreases the mass of an object based on its life vector if its life time
   * is greater than 0.
   */
  sizeLife() {
    if (this.life.time > 0) {
      this.mass.sub(this.life.vector);
    }
  }

  /**
   * The colorLife function adjusts the alpha value of a color based on the remaining time of an
   * object's life.
   */
  colorLife() {
    if (this.life.time > 0) {
      let alpha = this.p.map(this.life.time, 0, this.original.life.time / 2, 0, 255);
      this.color.setAlpha(parseInt(alpha));
    }
  }

  /**
   * The function updates the life time of an object and removes it from an array if the time reaches
   * zero.
   * @param index - The "index" parameter is the index of the object in the "objects" array that needs
   * to be updated.
   */
  updateLife(index) {
    if (this.life.time > 0) {
      this.life.time--;
    } else {
      this.objects.splice(index, 1);
    }
  }

  /**
   * The function applies a force to an object, updates its velocity and position, and limits the
   * velocity to a specified speed limit.
   * @param force - The force parameter represents the force vector that is being applied to an object.
   * It can be any vector that describes the magnitude and direction of the force.
   * @param speedLimit - The speedLimit parameter is the maximum speed that the object can reach. If
   * the object's velocity exceeds this limit, it will be capped at the speedLimit value.
   */
  applyForce(force, speedLimit) {
    let generatedForce = this.p5.Vector.div(force, this.mass.x);
    this.acc.add(generatedForce);
    this.vel.add(this.acc);
    this.vel.limit(speedLimit);
    this.pos.add(this.vel);
    this.acc.set(0, 0);
  }

 /**
  * The function calculates the attractive force between two objects and applies it to the second
  * object.
  * @param mover - The "mover" parameter represents an object that is being attracted towards another
  * object.
  */
  attract(mover) {
    let force = this.p5.Vector.sub(this.pos, mover.pos);
    let distanceSq = this.p.constrain(force.magSq(), 100, 1000);
    let G = 1;
    let strength = (G * (this.mass.x * mover.mass.x)) / distanceSq;
    force.setMag(strength);
    mover.applyForce(force);
  }

  /**
   * The function checks if an object has collided with the borders of a canvas and changes its
   * velocity accordingly to create a bouncing effect.
   */
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

  /**
   * The function `edges()` ensures that an object stays within the boundaries of a given canvas by
   * adjusting its position if it goes beyond the edges.
   */
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

  /**
   * The `collide` function checks if two objects are colliding and adjusts their positions and
   * velocities accordingly.
   * @param other - The "other" parameter in the collide function refers to another object that the
   * current object is colliding with. It is an object that has properties such as position (pos), mass
   * (mass), and velocity (vel).
   */
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

  /**
   * The function checks if two objects have made contact based on their positions and sizes.
   * @param obj - The parameter "obj" is an object that represents another entity in the code. It
   * likely has properties such as "pos" (position) and "mass" that are used in the calculation of the
   * distance between the two entities.
   * @returns a boolean value indicating whether or not the two objects have made contact.
   */
  madeContactX(obj) {
    const distance = this.p5.Vector.dist(this.pos, obj.pos);
    return distance <= (this.mass.x / 2) + (obj.mass.y / 2) ;
  }

  /**
   * The function checks if two objects have made contact based on their positions and sizes.
   * @param obj - The parameter "obj" is an object that represents another entity in the code. It
   * likely has properties such as "pos" (position) and "mass" that are being used in the function.
   * @returns a boolean value indicating whether or not there is contact between the two objects.
   */
  madeContactY(obj) {
    const distance = this.p5.Vector.dist(this.pos, obj.pos);
    return distance <= (this.mass.y / 2) + (obj.mass.y / 2);
  }

 /**
  * The function checks if two objects have made contact based on their positions and sizes.
  * @param obj - The "obj" parameter is an object that represents another contact. It has a "pos"
  * property that represents the position of the contact, and a "mass" property that represents the
  * mass of the contact.
  * @returns a boolean value indicating whether the distance between the positions of the two objects
  * is less than or equal to half the sum of their respective masses in the x and y directions.
  */
  madeContact(obj) {
    const distance = this.p5.Vector.dist(this.pos, obj.pos);
    const x = (this.mass.x / 2) + (obj.mass.x / 2);
    const y = (this.mass.y / 2) + (obj.mass.y / 2);
    return distance <= x || distance <= y;
  }

  /**
   * The function sets the stroke and fill colors for a shape in JavaScript.
   * @param color - The "color" parameter is an object that contains the following properties:
   * @returns a boolean value. If the color parameter is falsy (e.g. undefined, null, false, 0, empty
   * string), it returns false. Otherwise, it does not explicitly return anything, so it will
   * implicitly return undefined.
   */
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

  /**
   * The `rotate` function rotates an object by a specified angle or by the current velocity of the
   * object's angle.
   * @param [angle=false] - The `angle` parameter is an optional parameter that specifies the amount by
   * which the object should be rotated. If no value is provided for `angle`, it will default to the
   * current angular velocity (`this.angle.vel`).
   */
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

/* The Ellipse class is a subclass of Shape that represents an ellipse shape on a canvas. */
class Ellipse extends Shape {
  constructor(canvas, pos, vel, acc, mass, color, angle, life) {
    super(canvas, pos, vel, acc, mass, color, angle, life);
    this.p.ellipseMode(this.p.CENTER);
  }

  /**
   * The "draw" function is used to draw an ellipse on a canvas using the given position and color.
   * @param [pos=false] - The "pos" parameter is a boolean value that determines whether to use the
   * provided position or the default position of the object. If "pos" is true, the provided position
   * will be used. If "pos" is false or not provided, the default position of the object will be used.
   */
  draw(pos=false) {
    super.setColor(this.color);
    const custPos = pos ? pos : this.pos;
    this.p.ellipse(custPos.x, custPos.y, this.mass.x, this.mass.y);
  }

}

/* The Rect class is a subclass of the Shape class in JavaScript that represents a rectangle shape with
additional properties and methods. */
class Rect extends Shape {
  constructor(canvas, pos, vel, acc, mass, color, angle, life, radius=0) {
    super(canvas, pos, vel, acc, mass, color, angle, life);
    this.radius = radius;
    this.p.rectMode(this.p.CENTER);
  }

  /**
   * The "draw" function is used to draw a rectangle with a specified position, color, size, and
   * radius.
   * @param [pos=false] - The `pos` parameter is a boolean value that determines whether to use the
   * provided position (`pos`) or the default position (`this.pos`) for drawing the shape. If `pos` is
   * `true`, the provided position will be used. If `pos` is `false` or not provided,
   */
  draw(pos=false) {
    super.setColor(this.color);
    const custPos = pos ? pos : this.pos;
    this.p.rect(custPos.x, custPos.y, this.mass.x, this.mass.y, this.radius);
  }

}

/* The Triangle class is a subclass of the Shape class in JavaScript that represents a triangle shape. */
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

/* The Polygon class is a subclass of the Shape class that represents a polygon shape with a specified
number of sides. */
class Polygon extends Shape {
  constructor(canvas, pos, vel, acc, mass, color, angle, life, sides) {
    super(canvas, pos, vel, acc, mass, color, angle, life, sides);
    this.sides = sides;
  }
  
  /**
   * The function draws a polygon shape with a specified number of sides and a given position.
   * @param [pos=false] - The "pos" parameter is a boolean value that determines whether to use the
   * default position of the shape or a custom position. If "pos" is true, then the custom position
   * will be used. If "pos" is false or not provided, then the default position of the shape will be
   * used
   */
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

/* The Line class is a JavaScript class that represents a line on a canvas, with methods for updating
and drawing the line. */
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

  /**
   * The function calculates the displacement vector between two points and scales it by a given
   * velocity.
   * @returns the displacement vector.
   */
  getDisplacement() {
    let direction = this.p5.Vector.sub(this.start, this.end);
    direction.normalize();
    return direction.mult(this.vel);
  }

  /**
   * The function sets the stroke weight and stroke color for a given color object, or removes the
   * stroke if no color is provided.
   * @param color - The `color` parameter is an object that contains information about the color to be
   * set. It can have the following properties:
   * @returns If the `color` parameter is falsy (e.g. `null`, `undefined`, `false`, `0`, `""`), then
   * `false` is being returned. Otherwise, no value is being explicitly returned, so `undefined` is
   * being returned by default.
   */
  setColor(color) {
    if (!color) return false;
    if (color.stroke) {
      this.p.strokeWeight(color.weight);
      this.p.stroke(color.stroke);
    } else {
      this.p.noStroke();
    }
  }

  /**
   * The function "updatePrev" updates the values of the "start" object's x and y properties to match
   * the values of the "end" object's x and y properties.
   */
  updatePrev() {
    this.start.x = this.end.x;
    this.start.y = this.end.y;
  }

  /**
   * The function checks if the end point of a line is outside the canvas boundaries and updates it
   * accordingly.
   */
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

  /**
   * The "add" function updates the start and end positions with a new position.
   * @param pos - The parameter "pos" is the position that will be added to the current position.
   */
  add(pos) {
    this.start.set(this.end);
    this.end.set(pos);
  }

  /**
   * The function removes a specified position from the start of a string.
   * @param pos - The parameter "pos" in the "remove" function represents the position from which to
   * remove elements.
   */
  remove(pos) {
    this.end.set(this.start);
    this.start.set(pos);
  }

  /**
   * The draw function sets the color and draws a line from the start point to the end point.
   */
  draw() {
    this.setColor(this.color);
    this.p.line(this.start.x, this.start.y, this.end.x, this.end.y);
  }
}

/* The Orbit class is used to create and manage objects that rotate around a central point on a canvas. */
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

  /**
   * The rotate function translates and rotates a set of objects around a central point.
   */
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