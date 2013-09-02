var amaze = amaze || {};

amaze.Cell = function (x, y) {
	this.position = {x: x, y: y};
	this.visited = false;
	this.walls = {
		n: 1,
		e: 1,
		s: 1,
		w: 1
	};
};

amaze.Cell.prototype = {
	constructor: amaze.Cell,

	removeWall: function (dir) {
		this.walls[dir] = 0;
		this.visited = true;
	}
}