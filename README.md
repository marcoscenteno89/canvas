# Canvas Utility with P5.js README
## Canvas Manager
### Description
#### The CanvasManager class provides methods for creating and managing a canvas, including creating a flow field, updating the flow field, drawing the flow field, and managing objects within the canvas.

### Usage
#### Here is an example of how to use the CanvasManager class:
``` js
import p5 from "https://esm.sh/p5";
import { CanvasManager } from './path/to/canvas.js';

let elem = document.querySelector('#canvas');
let canvas;
const sketch = new p5((p) => {
  p.setup = () => {

    let canvasManager = new CanvasManager(p5, p, elem);

    // Set the flowfield
    canvasManager.setFlowfield(20, 0, 0.1);

    
  };
  p.draw = () => {

    // Update the flowfield
    canvasManager.updateFlowfield();

    // Draw the flowfield
    canvasManager.drawFlowfield();

  };
});
```

## Shape
### Description
#### The Shape class provides methods for creating and managing a objects within canvas, this class does not draw into canvas and it is meant to be extended by other classes

## Shape child classes
#### Ellipse, Rect, Triangle, and Polygon
### Description
#### These classes extend from the shape class and contain the drawing method to draw in canvas.

### Usage
#### Here is an example of how to use the Shape class:

``` js

import p5 from "https://esm.sh/p5";
import { Ellipse, Rect, Triangle, Polygon } from './path/to/canvas.js';

let elem = document.querySelector('#canvas');
let canvas;
const sketch = new p5((p) => {
  p.setup = () => {
    let canvasManager = new CanvasManager(p5, p, elem);

    // Create an ellipse
    let pos = p.createVector(50, 50);
    let vel = p.createVector(1, 1);
    let acc = p.createVector(0, 0.1);
    let mass = p.createVector(20, 20);
    let ellipse = new Ellipse(canvasManager, pos, vel, acc, mass);

    // Add shape objects to canvas objects array
    canvasManager.objects.push(ellipse);
    
  };
  p.draw = () => {
    for (let shapeObj of canvas.objects) {

      // Handle object-object collisions
      shapeObj.bounceOfObject();

      // Handle object-border collisions
      shapeObj.bounceOfBorder();
      
    }
  };
});
```
