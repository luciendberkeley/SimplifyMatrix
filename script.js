const rows_i = document.querySelector(".rows");
const cols_i = document.querySelector(".cols");

let rows = 2;
let cols = 2;

let matrix = [[0,0], [0,0]];

const simplifyMatrix = (matrix) => {
	let n = matrix.length;

	for(let i=0; i < n; i++) {
		let highest_row = i;
		for(let row=0; row < n; row++) {
			if(matrix[row][i] > matrix[highest_row][i]) {
				highest_row = row;
			}
		}

		matrix[i], matrix[highest_row] = matrix[highest_row], matrix[i];

		let pivot = matrix[i][i];
		if(pivot === 0) {
			console.error("Matrix is singular or nearly singular.");
			return;
		}

		for(let col=i; col < n + 1; col++) {
			matrix[i][col] /= pivot;
		}

		for(let row=i + 1; row < n; row++) {
			let factor = matrix[row][i];
			for(let col=0; col < n+1; col++) {
				matrix[row][col] -= matrix[i][col] * factor;
			}
		}
	}

	let outputs = [];
	for(let i=0; i < n; i++) {
		outputs.push(0);
	}

	for(let row=n-1; row > -1; row--) {
		outputs[row] = matrix[row][n];
		for(let col=row+1; col < n; col++) {
			outputs[row] -= outputs[col] * matrix[row][col];
		}
	}

	matrix = [];
	for(let row=0; row < n; row++) {
		let this_row = [];
		for(let col=0; col < n; col++) {
			if(row == col) {
				this_row.push(1);
			} else {
				this_row.push(0);
			}
		}
		this_row.push(outputs[row]);
		matrix.push(this_row);
	}

	return matrix;
};

const updateMatrix = () => {
	matrix = [];
	for(const row of document.querySelector(".matrix").children) {
		let row_m = [];
		for(const input of row.children) {
			row_m.push(eval(input.value));
		}
		matrix.push(row_m);
	}
}

const passThrough = () => {
	console.log("h")
	updateMatrix();
	console.log(matrix)
	let solved = simplifyMatrix(matrix);

	let inside = "";
	for(let i=0; i < solved.length; i++) {
		const row = solved[i];
		for(let col=0; col < row.length; col++) {
			if(col != row.length - 1) {
				inside += ` ${row[col]} &`
			} else {
				inside += ` ${row[col]}`
			}
		}
		if(i != solved.length -1) {
			inside += "\\\\\n ";
		} else {
			inside += "\n ";
		}
	}

	let split = "{";
	for(let i=0; i < matrix.length; i++) {
		split += "c";
	}
	split += "|";
	split += "c}";

	console.log(split);
	
	let matrix_latex = `$\\left[\\begin{array}${split}\n ${inside}\\end{array}\\right]$`;

	console.log(matrix_latex)
	let output_el = document.querySelector(".output");
	console.log(output_el);
	output_el.innerHTML = matrix_latex;

	MathJax.typeset();
};

const updateSize = () => {
	rows = parseInt(rows_i.value);
	cols = rows + 1;

	let matrix_div = document.querySelector(".matrix");
	while (matrix_div.firstChild) {
		matrix_div.removeChild(matrix_div.firstChild);
	}

	matrix = [];
	for(let row=0; row < rows; row++) {
		let this_row = [];
		let row_el = document.createElement("div");
		for(let col=0; col < cols; col++) {
			if(col == row) {
				this_row.push(1);
				let input_el = document.createElement("input");
				input_el.onchange = function() {passThrough();};
				input_el.value = 1;
				row_el.appendChild(input_el);
			} else {
				this_row.push(0);
				let input_el = document.createElement("input");
				input_el.onchange = function() {passThrough();};
				input_el.value = 0;
				row_el.appendChild(input_el);
			}
		}
		matrix.push(this_row);
		matrix_div.appendChild(row_el);
	}

	console.log(matrix, "\n", matrix_div);
	passThrough();
};

updateSize();