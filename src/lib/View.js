var amaze = amaze || {};

amaze.View = function (sim) {
	this.simulation = sim
	this.maze = sim.maze;

	this.opts = {
		cols: this.maze.grid.length,
		rows: this.maze.grid[0].length,
		cellSize: 40,
		wallScale: 0.25
	};

	this.init();
};

amaze.View.prototype = {
	constructor: amaze.View,

	init: function () {
		var canvas = document.createElement('canvas');
		canvas.width = this.opts.cellSize * this.opts.cols;
		canvas.height = this.opts.cellSize * this.opts.rows;
		document.body.appendChild(canvas);
		this.context = canvas.getContext('2d');
		this.update();
	},

	update: function () {
		var i,
			j,
			cell,
			cs = this.opts.cellSize,
			ws = this.opts.wallScale * cs,
			ps = cs - (2 * ws);

		this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);
		this.context.fillStyle = 'black';
		for (i = 0; i < this.maze.grid.length; i++) {
			for (j = 0; j < this.maze.grid[i].length; j++) {
				cell = this.maze.grid[i][j];
				if (!cell.visited) {
					// Fill the whole cell black if unvisited
					this.context.fillRect(cell.position.x * cs, cell.position.y * cs, cs, cs);
				} else {
					// Fill only the walls and corners
					this.context.fillRect(cell.position.x * cs, cell.position.y * cs, ws, ws); // top left corner
					this.context.fillRect((cell.position.x * cs) + (ws + ps), cell.position.y * cs, ws, ws); // top right corner
					this.context.fillRect((cell.position.x * cs) + (ws + ps), (cell.position.y * cs) + (ws + ps), ws, ws); // bottom right corner
					this.context.fillRect(cell.position.x * cs, (cell.position.y * cs) + (ws + ps), ws, ws); // bottom left corner
					if (cell.walls.n) {
						this.context.fillRect(cell.position.x * cs, cell.position.y * cs, cs, ws);
					}
					if (cell.walls.e) {
						this.context.fillRect((cell.position.x * cs) + (ws + ps), cell.position.y * cs, ws, cs);
					}
					if (cell.walls.s) {
						this.context.fillRect(cell.position.x * cs, (cell.position.y * cs) + (ws + ps), cs, ws);
					}
					if (cell.walls.w) {
						this.context.fillRect(cell.position.x * cs, cell.position.y * cs, ws, cs);
					}
				}
			}
		}

		if (this.simulation.solver.isSolving()) {
			this.context.fillStyle = 'red';
			this.context.fillRect(this.simulation.solver.path[this.simulation.solver.path.length - 1].cell.position.x * cs + ws, this.simulation.solver.path[this.simulation.solver.path.length - 1].cell.position.y * cs + ws, ps, ps);
		}				

	}
};