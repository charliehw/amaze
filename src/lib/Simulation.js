var amaze = amaze || {};

amaze.Simulation = function () {
	this.maze = new amaze.Maze(this);
	this.solver = new amaze.Solver(this);
	this.view = new amaze.View(this);
	this.designer = new amaze.Designer(this);	
};

amaze.Simulation.prototype = {
	constructor: amaze.Simulation,

	init: function () {
		this.designer.start(0, 0); // Currently always starting top left of grid
	}
};