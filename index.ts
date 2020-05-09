
const main = () => {

    var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    var firstSheet = spreadsheet.getSheets()[0];
    var secondSheet = spreadsheet.getSheets()[1];
    firstSheet.clear();
    secondSheet.clear();
    Logger.log(" abrir documento --->" spreadsheet.getUrl());


    Logger.log(" obteniendo cards --->" );
    const cardRows = getCardsData();
    Logger.log(" fin obtencion de datos --->" );



    Logger.log(" cargando primera sheet --->");
    loadData(cardRows, firstSheet);
    Logger.log(" fin de carga de datos --->");
}


