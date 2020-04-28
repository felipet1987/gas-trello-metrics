




const extractData = () => {


    const getStates = (columns, actions) => {
        return columns.map((col => {
            var action = actions.find(a => a.data.listAfter.name = col.name)
            if (action) return action.date
        })
    }

    const getRows = (columns) =>{
        let rows = [[...['id', 'creation', 'item'], ...columns.map(col => col.name)]]
        columns.map(col => {
            var cardsUrl = url + "list/" + col.id + "/cards/all?" + key_and_token
            var cardsFromList = JSON.parse(UrlFetchApp.fetch(cardsUrl).getContentText());
            rows = rows.concat(cardsFromList.map(card => {
                var creationDate = new Date(1000 * parseInt(card.id.substring(0, 8), 16));

                var actionsUrl = url + "cards/" + card.id + "/actions/?" + key_and_token
                var actions = JSON.parse(UrlFetchApp.fetch(actionsUrl).getContentText());
                var states = getStates(columns, actions)
                
                return [card.id, creationDate, card.name, ...states]
            }));
        })
        return rows

    }


    var url = "https://api.trello.com/1/";
    var key_and_token = "key=" + config.api_key + "&token=" + config.api_token;
    var columnUrl = url + "boards/" + config.board_id + "/lists/all/?" + key_and_token
    var columns = JSON.parse((UrlFetchApp.fetch(columnUrl).getContentText()));
    
    return getRows(columns)
}

const loadData = (rows) => {
    var ss = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Data");
    ss.setName("Data");
    ss.clear();
    rows.map(row => {
        ss.appendRow(row);
    })
}
const main = () => {

    const rows = extractData()
    loadData(rows)
}


