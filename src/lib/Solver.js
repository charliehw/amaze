var amaze = amaze || {};

amaze.Solver = function (sim) {
	this.simulation = sim;
	this.maze = sim.maze;
	this.path = []; // Full path including backtracks
	this.stack = []; // Excludes deadends
	this.opts = {
		updateTimer: 60
	}
};

amaze.Solver.prototype = {
	constructor: amaze.Solver,

	start: function (x, y) {
		var record = {
			cell: this.maze.grid[x][y],
			dir: this.maze.directionsMap.e // The stack records the direction used to move into that cell 
		};
		this.stack.push(record);
		this.path.push(record);
		this.progress();
	},

	progress: function () {
		var self = this,	
			currentPosition = this.stack[this.stack.length - 1].cell.position,
			viablePaths = this.checkViablePaths(),
			chosenPath,
			newCell,
			record;

		if (viablePaths.length === 0) {
			// Need to backtrack
			chosenPath = this.stack[this.stack.length - 1].dir.inverse;
			this.stack.pop();
			newCell = this.stack[this.stack.length - 1].cell;
		} else {
			// Add in a check to see if that stack has already been taken
			chosenPath = this.choosePath(viablePaths);
			newCell = this.maze.grid[currentPosition.x + chosenPath.x][currentPosition.y + chosenPath.y];
		}

		record = {
			cell: newCell,
			dir: chosenPath
		};
		this.stack.push(record);
		this.path.push(record);

		if (this.simulation.maze.end !== newCell) {
			setTimeout(function () {
				self.progress();
			}, self.opts.updateTimer);
		} else {
			console.log('Solved');
		}

		this.simulation.view.update();

	},

	checkViablePaths: function () {
		var currentLocation = this.stack[this.stack.length - 1],
			viablePaths = [];
		for (var wall in currentLocation.cell.walls) {
			if (currentLocation.cell.walls[wall] === 0 && wall !== currentLocation.dir.inverse) {
				viablePaths.push(this.maze.directionsMap[wall]);
			}
		}
		return viablePaths;
	},

	choosePath: function (paths) {
		return paths[Math.floor(Math.random() * paths.length)];
	},

	isSolving: function () {
		return this.stack.length > 0 ? true : false;
	}
};