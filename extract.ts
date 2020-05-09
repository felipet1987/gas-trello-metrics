
const getCardsData = () => {
    const getStates = (columns, actions) => {
        return columns.map((col => {
            var action = actions.find(action => {
                if (typeof action.data.listAfter !== 'undefined') {
                    action.data.listAfter.id === col.id
                }
            });
            if (action) {
                return action.date;
            }
            return "";
        })
    }
    const getLabels = cards => {
        const reducer = (accumulator, currentValue) => accumulator + "," + currentValue;
        if (typeof cards.labels !== 'undefined' && cards.labels.length > 0) {
            return cards.labels.map(l => l.name).reduce(reducer);
        }
        return "";

    }
    const getCreationDate = card => new Date(1000 * parseInt(card.id.substring(0, 8), 16))

    const getCreationWeek = card => {
        const current = new Date(1000 * parseInt(card.id.substring(0, 8), 16))
        const onejan = new Date(current.getFullYear(), 0, 1);
        return Math.ceil((((current - onejan) / 86400000) + onejan.getDay() + 1) / 7);
    }

    const getRows = (columns) => {
        const names = columns.map(col => col.name);
        let rows = [[...['idShort', 'id', 'name', 'labels'], ...names, 'week']];
        columns.map(col => {
            var cardsUrl = url + "list/" + col.id + "/cards/all?" + key_and_token;
            var cardsFromList = JSON.parse(UrlFetchApp.fetch(cardsUrl).getContentText());
            rows = rows.concat(cardsFromList.map(card => {
                var actionsUrl = url + "cards/" + card.id + "/actions/?" + key_and_token;
                var actions = JSON.parse(UrlFetchApp.fetch(actionsUrl).getContentText());
                var states = getStates(columns, actions);
                var labels = getLabels(card)
                var week = getCreationWeek(card)
                states[0] = getCreationDate(card);
                return [card.idShort, card.id, card.name, labels, ...states, week];
            }));
        })
        return rows

    }

    var url = "https://api.trello.com/1/";
    var key_and_token = "key=" + config.api_key + "&token=" + config.api_token;
    var columnUrl = url + "boards/" + config.board_id + "/lists/all/?" + key_and_token;

    var columns = JSON.parse((UrlFetchApp.fetch(columnUrl).getContentText()));
    columns = columns.filter(col => col.name !== 'Template')
    return getRows(columns)

}


