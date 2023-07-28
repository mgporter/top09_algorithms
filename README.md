# top09_algorithms

Odin Project from https://www.theodinproject.com/lessons/javascript-linked-lists

Creates a linked list using javascript pass-by-reference instead of pointers (as in other languages). Objects are chained together by setting them to the previous object's .next property.

Nodes are absolutely positioned on top of a canvas element based on the location of adjacent nodes. New nodes are always clamped to be inside this element, even when resizing the window.

Nodes are connected with a bezier curve drawn on the canvas. The start/end points are always in the center of the .value/.next part of the node, respectively. Dragging nodes automatically animates the connections so that they stay connected. Applies dynamic scaling to canvas to keep content looking sharp, even when highly zoomed in.

The linked list uses custom error messages on invalid input, which are caught by the dom modules in 'try' blocks and displayed to the user.

The DOM gives the user access to the 12 functions of the linked list by calling those functions directly--there are no intermediary objects. The DOM is updated with logic that decides when to show/clear messages, when to show/clear controls, when to highlight nodes, and so on.
