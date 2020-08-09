


const main = () => {
    const data = getAllCards()
    const sheets = SpreadsheetApp.getActiveSpreadsheet().getSheets();
    buildFirst(sheets[0], data)
    buildSecond(sheets[1], data)
    buildThird(sheets[2], data)
    buildFourth(sheets[3], data)
}




const buildFirst = (sheet, data) => {
    Logger.log("primera pagina")
    sheet.setName("Primera Pagina")
    sheet.clear()
    const rows = extractFirstRows(data)
    loadData(rows, sheet);
}

const buildSecond = (sheet, data) => {
    Logger.log("segunda pagina")
    sheet.setName("Segunda Pagina")
    sheet.clear()
    const rows = extractSecondRows(data);
    loadData(rows, sheet);
}

const buildThird = (sheet, data) => {
    Logger.log("tercera pagina")
    sheet.setName("Tercera Pagina")
    sheet.clear();
    const rows = extractThirdRows(data);
    loadData(rows, sheet);
}

const buildFourth = (sheet, data) => {
    Logger.log("cuarta pagina")
    sheet.setName("cuarta Pagina")
    sheet.clear();
    const rows = extractFourthRows(data);
    loadData(rows, sheet);
}




