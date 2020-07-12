
const main = () => {

    const data = getData()

    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();

    Logger.log("primera pagina")
    var firstPage = spreadsheet.getSheets()[0];
    firstPage.setName("Primera Pagina")
    firstPage.clear()
    const firstRows = extractFirstRows(data)
    loadData(firstRows, firstPage);

    Logger.log("segunda pagina")
    var secondPage = spreadsheet.getSheets()[1];
    secondPage.clear()
    const secondRows = extractSecondRows(data);
    loadData(secondRows, secondPage);


    Logger.log("tercera pagina")
    var thirdPage = spreadsheet.getSheets()[2];
    thirdPage.clear();
    const thirdRows = extractThirdRows(data);
    loadData(thirdRows, thirdPage);



    //var fourthSheet = spreadsheet.getSheets()[3];
    //fourthSheet.clear();
    //const fourthRows = getFlowData(firstRows);
    //loadData(fourthRows, fourthSheet);


    Logger.log("cuarta pagina")
    var test = spreadsheet.getSheets()[3];
    test.clear();
    const testRows = extractFourthRows(data);
    loadData(testRows, test);

    
}


