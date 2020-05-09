const loadData = (rows, dataSheet) => {
    rows.map(row => {
        dataSheet.appendRow(row);
    })
}