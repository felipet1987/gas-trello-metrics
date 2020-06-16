
const main = () => {

    const data = getData()

    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    var thirdSheet = spreadsheet.getSheets()[2];
    var fourthSheet = spreadsheet.getSheets()[3];
    


    var firstPage = spreadsheet.getSheets()[0];
    firstPage.clear()
    const firstRows = extractFirstRows(data)
    loadData(firstRows, firstPage);


    var secondPage = spreadsheet.getSheets()[1];
    secondPage.clear()
    const secondRows = extractSecondRows(data);
    loadData(secondRows, secondPage);



    thirdSheet.clear();
    const thirdRows = extractThirdRows(data);
    loadData(thirdRows, thirdSheet);




    // fourthSheet.clear();
    // var fourthSheet = spreadsheet.getSheets()[3];
    // const fourthRows = getFlowData(firstRows);
    // loadData(fourthRows, fourthSheet);

    var testSheet = spreadsheet.getSheets()[4];
    testSheet.clear()
    const testRows = ;
    loadData(testRows, testSheet);

    
}


