const rows_i = document.querySelector('.rows');
const cols_i = document.querySelector('.cols');

let rows = 2;
let cols = 2;

let matrix = [
	[0, 0],
	[0, 0],
];

const generateIdentity = (size) => {
	let this_matrix = [];
	for (let row = 0; row < size; row++) {
		let row_matrix = [];
		for (let col = 0; col < size; col++) {
			if (row != col) {
				row_matrix.push(0);
			} else {
				row_matrix.push(1);
			}
		}
		this_matrix.push(row_matrix);
	}

	return this_matrix;
};

const simplifyMatrix = (matrix) => {
	let start_matrix = JSON.parse(JSON.stringify(matrix));

	let multipliers = [];
	let n = matrix.length;

	for (let i = 0; i < n; i++) {
		let highest_row = i;
		for (let row = 0; row < n; row++) {
			if (matrix[row][i] > matrix[highest_row][i]) {
				highest_row = row;
			}
		}

		matrix[i], (matrix[highest_row] = matrix[highest_row]), matrix[i];
		let buffer = matrix[i];
		matrix[i] = matrix[highest_row];
		matrix[highest_row] = buffer;

		if (i != highest_row) {
			let this_mult = generateIdentity(n);
			this_mult[i][highest_row] = 1;
			this_mult[i][i] = 0;

			this_mult[highest_row][i] = 1;
			this_mult[highest_row][highest_row] = 0;
			multipliers.push(this_mult);
		}

		let pivot = matrix[i][i];
		if (pivot === 0) {
			console.log(matrix);
			console.error('Matrix is singular or nearly singular.');
			return;
		}

		for (let col = i; col < n + 1; col++) {
			matrix[i][col] /= pivot;
		}

		let this_mult = generateIdentity(n);
		this_mult[i][i] = 1 / pivot;
		multipliers.push(this_mult);

		for (let row = i + 1; row < n; row++) {
			let factor = matrix[row][i];
			for (let col = 0; col < n + 1; col++) {
				matrix[row][col] -= matrix[i][col] * factor;
			}
			let this_mult = generateIdentity(n);
			this_mult[row][i] = -factor;
			multipliers.push(this_mult);
		}
	}

	let outputs = [];
	for (let i = 0; i < n; i++) {
		outputs.push(0);
	}

	for (let row = n - 1; row > -1; row--) {
		outputs[row] = matrix[row][n];
		for (let col = row + 1; col < n; col++) {
			outputs[row] -= outputs[col] * matrix[row][col];
			let this_mult = generateIdentity(n);
			this_mult[row][col] = -matrix[row][col];
			multipliers.push(this_mult);
		}
	}

	matrix = generateIdentity(n);
	for (let i = 0; i < n; i++) {
		matrix[i].push(outputs[i]);
	}

	let inverse = generateIdentity(n);
	for (const matrx of multipliers) {
		inverse = multiplyMatrix(matrx, inverse);
	}

	return {
		decimal: {
			start: roundMatrix(start_matrix),
			solved: roundMatrix(matrix),
			inverse: roundMatrix(inverse),
		},
	};
};

const fractMatrix = (matrix) => {
	for (let r = 0; r < matrix.length; r++) {
		for (let c = 0; c < matrix[r].length; c++) {
			let frac = matrix[r][c];
			frac.toString.split('.');
		}
	}

	return matrix;
};

const roundMatrix = (matrix) => {
	for (let r = 0; r < matrix.length; r++) {
		for (let c = 0; c < matrix[r].length; c++) {
			matrix[r][c] = Math.round(matrix[r][c] * 100) / 100;
		}
	}

	return matrix;
};

const fractionMatrix = (matrix) => {};

const prettify = (matrix) => {
	let message = '\n[\n';
	for (let r = 0; r < matrix.length; r++) {
		let row = matrix[r];
		message += '	[';
		for (let c = 0; c < row.length; c++) {
			let col = row[c];
			message += col;
			if (c != row.length - 1) {
				message += ', ';
			}
		}
		message += ']';
		if (r != matrix.length - 1) {
			message += ',\n';
		}
	}
	message += '\n]';

	return message;
};

const multiplyMatrix = (a, b) => {
	if (a[0].length == b.length) {
		let rows = a.length;
		let cols = b[0].length;

		let out_matrix = [];
		for (let row = 0; row < rows; row++) {
			let row_m = [];
			for (let col = 0; col < cols; col++) {
				let x = 0;
				for (let h = 0; h < b.length; h++) {
					x += a[row][h] * b[h][col];
				}
				row_m.push(x);
			}
			out_matrix.push(row_m);
		}

		return out_matrix;
	}
};

const updateMatrix = () => {
	matrix = [];
	for (const row of document.querySelector('.matrix').children) {
		let row_m = [];
		for (const input of row.children) {
			row_m.push(eval(input.value));
		}
		matrix.push(row_m);
	}
};

const latexAugmentedMatrix = (matrix) => {
	let inside = '';
	for (let i = 0; i < matrix.length; i++) {
		const row = matrix[i];
		for (let col = 0; col < row.length; col++) {
			if (col != row.length - 1) {
				inside += ` ${row[col]} &`;
			} else {
				inside += ` ${row[col]}`;
			}
		}
		if (i != matrix.length - 1) {
			inside += '\\\\\n ';
		} else {
			inside += '\n ';
		}
	}

	let split = '{';
	for (let i = 0; i < matrix.length; i++) {
		split += 'c';
	}
	split += '|';
	split += 'c}';

	return `$\\left[\\begin{array}${split}\n ${inside}\\end{array}\\right]$`;
};

const passThrough = () => {
	updateMatrix();
	let out = simplifyMatrix(matrix);
	let solved = out.decimal.solved;
	let inverse = out.decimal.inverse;
	let start = out.decimal.start;

	let message =
		latexAugmentedMatrix(inverse) +
		latexAugmentedMatrix(start) +
		' = ' +
		latexAugmentedMatrix(solved);

	let output_el = document.querySelector('.output');
	output_el.innerHTML = message;

	MathJax.typeset();
};

const updateSize = () => {
	rows = parseInt(rows_i.value);
	cols = rows + 1;

	let matrix_div = document.querySelector('.matrix');
	while (matrix_div.firstChild) {
		matrix_div.removeChild(matrix_div.firstChild);
	}

	matrix = [];
	for (let row = 0; row < rows; row++) {
		let this_row = [];
		let row_el = document.createElement('div');
		for (let col = 0; col < cols; col++) {
			if (col == row) {
				this_row.push(1);
				let input_el = document.createElement('input');
				input_el.onchange = function () {
					passThrough();
				};
				input_el.value = 1;
				row_el.appendChild(input_el);
			} else {
				this_row.push(0);
				let input_el = document.createElement('input');
				input_el.onchange = function () {
					passThrough();
				};
				input_el.value = 0;
				row_el.appendChild(input_el);
			}
		}
		matrix.push(this_row);
		matrix_div.appendChild(row_el);
	}

	// console.log(matrix, "\n", matrix_div);
	passThrough();
};

updateSize();
