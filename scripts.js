class cell {
    constructor(row, column, data, isheader) {
        this.row = row;
        this.column = column;
        this.data = data;
        this.isheader = isheader;
        this.disabled = isheader;
    }
}
const ROW = 10;
const COLUMN = 10;

let spreadsheet = [];
const spreadsheetContainer = document.getElementById('spreadsheet-container');
const nowPosition = document.getElementById('now-position');
const exportButton = document.getElementById('export-button');

exportButton.addEventListener('click', () => {
    let csv = "";
    for (let i = 1; i < ROW; i++) {
        spreadsheet[i]
        .filter(cell => !cell.isheader)
        .map(cell => cell.value)
        .join(",") + "\n";
    }

    const csvObj = new Blob([csv]);
    console.log('csvObj', csvObj);

    const csvUrl = URL.createObjectURL(csvObj);
    console.log('csvUrl', csvUrl);

    const a = document.createElement("a");
    a.href = csvUrl;
    a.download = 'spreadsheet name.csv';
    a.click();
});

function makeSpreadsheet() { 
    for (let i = 0; i < ROW; i++) {
        let rowContainer = [];
        for (let j = 0; j < COLUMN; j++) {
            let header = false;
            let data = "";

            if (j === 0) {
                header = true;
                data = i;
            }

            if (i === 0) {
                header = true;
                data = String.fromCharCode(j+64);
            }

            if (i === 0 && j === 0) {
                header = true;
                data = "";
            }

            rowContainer.push(new cell(i, j,data,header));
        }
        spreadsheet.push(rowContainer);
    }
}

function makeInputElement(cell) {
    const input = document.createElement('input');

    input.setAttribute('type', 'text');
    input.value = cell.data;
    input.id = `cell-${cell.row}${cell.column}`;
    input.disabled = cell.disabled;
    input.classList.add('cell');

    if(cell.isheader) {
        input.classList.add('header');
    }

    input.addEventListener('click', (e) => {
        clearCellStatus();

        const columnCell = document.getElementById(`cell-0${cell.column}`);
        const rowCell = document.getElementById(`cell-${cell.row}0`);

        columnCell.classList.add('selected');
        rowCell.classList.add('selected');

        nowPosition.innerText = `${String.fromCharCode(cell.column+64)}${cell.row}`;
    });

    input.addEventListener('change', (e) => {
        cell.value = e.target.value;
    });

    return input;
}

function clearCellStatus() {
    const headers = document.querySelectorAll('.header');

    headers.forEach((header) => {
        header.classList.remove('selected');
    })
}

function drawTable() {
    for (let i = 0; i < ROW; i++) {
        const rowContainer = document.createElement('div');
        rowContainer.classList.add('row');

        for (let j = 0; j < COLUMN; j++) {
            const cell = spreadsheet[i][j];
            rowContainer.append(makeInputElement(cell));
        }
        spreadsheetContainer.append(rowContainer);
    }
}



makeSpreadsheet();
drawTable();