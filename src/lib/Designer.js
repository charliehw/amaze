var amaze = amaze || {};

amaze.Designer = function (sim) {
	this.simulation = sim;
	this.stack = [];
	this.opts = {
		updateTimer: 30
	};
};

amaze.Designer.prototype = {
	constructor: amaze.Designer,

	start: function (x, y) {
		var entryCell = this.simulation.maze.grid[x][y];
		entryCell.removeWall('w'); // Removing west wall as this is the entry point
		this.simulation.maze.start = entryCell;

		this.stack.push(entryCell);
		this.progress();
	},

	progress: function () {
		var head = this.stack[this.stack.length - 1],
			viableAdjacentCells = this.checkAdjacentCells(head),
			chosenCell,
			self = this;

		if (viableAdjacentCells.length > 0) {
			if (viableAdjacentCells.length > 1) {
				// More than one so pick at random
				chosenCell = this.chooseCell(viableAdjacentCells);
			} else {
				chosenCell = viableAdjacentCells[0];
			}

			head.removeWall(this.simulation.maze.directionsMap[chosenCell.direction.inverse].inverse);
			chosenCell.cell.removeWall(chosenCell.direction.inverse);
			this.stack.push(chosenCell.cell);

			if (chosenCell.cell.position.x === this.simulation.maze.grid.length - 1 && chosenCell.cell.position.y === this.simulation.maze.grid[0].length - 1) {
				chosenCell.cell.removeWall('e'); // This is the exit cell
				this.simulation.maze.end = chosenCell.cell;
				this.simulation.maze.optimalPath = this.stack;
			}
		} else {
			// No viable cells so backtrack
			this.backtrack();
		}

		if (!this.finished) {
			setTimeout(function () {
				self.progress();
			}, self.opts.updateTimer);
		} else {
			// Finished
			console.log('Design complete', this.simulation.maze);
			this.simulation.solver.start(0, 0);
		}

		this.simulation.view.update();

	},

	checkAdjacentCells: function (cell) {
		var i, 
			adjacentCell,
			direction,
			viableCells = [];
		for (var wall in this.simulation.maze.directionsMap) {
			direction = this.simulation.maze.directionsMap[wall];
			// Check if there is a cell in that direction
			if (this.simulation.maze.grid[cell.position.x + direction.x]) {
				adjacentCell = this.simulation.maze.grid[cell.position.x + direction.x][cell.position.y + direction.y];
				if (adjacentCell) {
					// Check if the adjacent cell has not already been visited
					if (!adjacentCell.visited) {
						viableCells.push({
							cell: adjacentCell,
							direction: direction
						});
					}
				}
			}		
		}
		return viableCells;
	},

	chooseCell: function (cells) {
		return cells[Math.floor(Math.random() * cells.length)];
	},

	backtrack: function () {
		var foundViableHead = false;

		while (!foundViableHead) {
			this.stack.pop();
			if (this.stack.length > 1) {
				if (this.checkAdjacentCells(this.stack[this.stack.length - 1]).length > 0) {
					foundViableHead = true;
					break;
				}
			} else {
				this.finished = true;
				break;
			}
		}
	}

};