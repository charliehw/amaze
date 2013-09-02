var amaze = amaze || {};

amaze.Maze = function (sim) {
	this.simulation = sim;
	this.grid = this.initGrid(10, 10);
	this.directionsMap = {
		n: {x: 0, y: -1, inverse: 's'},
		e: {x: 1, y: 0, inverse: 'w'},
		s: {x: 0, y: 1, inverse: 'n'},
		w: {x: -1, y: 0, inverse: 'e'}
	};
};

amaze.Maze.prototype = {
	constructor: amaze.Maze,

	initGrid: function (x, y) {
		var i, j, temp, result = [];
		for (i = 0; i < x; i++) {
			temp = [];
			for (j = 0; j < y; j++) {
				temp.push(new amaze.Cell(i, j));
			}
			result.push(temp);
		}
		return result;
	}
};