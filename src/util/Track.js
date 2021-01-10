function isCheckpointValid(path, i, j) {
	if (!path.length) {
		// first checkpoint always valid
		return true;
	}

	const [i_prev, j_prev] = path[path.length - 1];

	if (Math.abs(i_prev - i) > 1 || Math.abs(j_prev - j) > 1) {
		// has to be one away from previous
		return false;
	}

	for (let [x, y] of path) {
		// cannot intersect itself
		if (x === i && y === j) {
			return false;
		}
	}

	return true;
}

module.exports = {
	/**
	 * @param {number} owner Player this belongs to (one of NODE_VALUES), or EMPTY for none
	 */
	createTrack: function(owner) {
		return {
			owner,
			complete: false,  // false when the track is being constructed (within a turn)
			path: [],
		}
	},

	addCheckpoint: function(path, i, j) {
		if (!isCheckpointValid(path, i, j)) {
			return false;
		}

		path.push([i, j]);
		return true;
	},
};