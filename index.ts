
const main = () => {
    var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    var firstSheet = spreadsheet.getSheets()[0];
    var secondSheet = spreadsheet.getSheets()[1];
    var thirdSheet = spreadsheet.getSheets()[2];
    var fourthSheet = spreadsheet.getSheets()[2];
    firstSheet.clear();
    secondSheet.clear();
    thirdSheet.clear();
    fourthSheet.clear();

    Logger.log(spreadsheet.getUrl());


    Logger.log(" obteniendo cards ");
    const firstRows = getCardsData();
    Logger.log(" fin obtencion de datos ");
    const secondRows = getCycleData(firstRows);
    const thirdRows = getThroughputData(firstRows);
    const fourthRows = getFlowData(firstRows);


    Logger.log(" cargando primera sheet ");
    loadData(firstRows, firstSheet);
    Logger.log(" cargando segunda sheet ");
    loadData(secondRows, secondSheet);
    Logger.log(" cargando tercera sheet ");
    loadData(thirdRows, thirdSheet);
    Logger.log(" cargando cuarta sheet ");
    loadData(fourthRows, fourthSheet);
    Logger.log(" fin de carga de datos ");
}


