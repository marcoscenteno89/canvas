# Canvas Utility with P5.js README
## Canvas Manager
### Description
#### The CanvasManager class provides methods for creating and managing a canvas, including creating a flow field, updating the flow field, drawing the flow field, and managing objects within the canvas.

### Installation
To use this module in your project, you can import it as follows:
``` js
import { CanvasManager } from './path/to/canvas.js';
```

### Usage
#### Here is an example of how to use the CanvasManager class:
``` js
// Assuming p5 and p are instances of p5.js and elem is a DOM element
let canvasManager = new CanvasManager(p5, p, elem);

// Set the flowfield
canvasManager.setFlowfield(20, 0, 0.1);

// Update the flowfield
canvasManager.updateFlowfield();

// Draw the flowfield
canvasManager.drawFlowfield();

// Set the background color
canvasManager.background = '#000000';

// Apply the background color
canvasManager.bg();

// Apply a gradient
canvasManager.applyGradient();

// Check for overlaps with an object
let obj = { /* ... */ };
let isOverlapping = canvasManager.overlaps(obj);

// Handle object-object collisions
canvasManager.bounceOfObject();

// Handle object-border collisions
canvasManager.bounceOfBorder();
```