var url = "https://api.trello.com/1/";
var key_and_token = "key=" + config.api_key + "&token=" + config.api_token;


const getColumns = () => {
    var columnUrl = url + "boards/" + config.board_id + "/lists/all/?" + key_and_token;
    return JSON.parse((UrlFetchApp.fetch(columnUrl).getContentText()));
}
let columns = getColumns()

const getActions = (card) => {
    var actionsUrl = url + "cards/" + card.id + "/actions/?" + key_and_token;
    return JSON.parse(UrlFetchApp.fetch(actionsUrl).getContentText());
}

const getCards = (col) => {
    var cardsUrl = url + "list/" + col.id + "/cards/all?" + key_and_token;
    return JSON.parse(UrlFetchApp.fetch(cardsUrl).getContentText());
}