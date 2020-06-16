var url = "https://api.trello.com/1/";
var key_and_token = "key=" + config.api_key + "&token=" + config.api_token;


const getColumns = () => {
    var columnUrl = url + "boards/" + config.board_id + "/lists/all/?" + key_and_token;
    return JSON.parse((UrlFetchApp.fetch(columnUrl).getContentText()));
}


const getActions = (card) => {
    var actionsUrl = url + "cards/" + card.id + "/actions/?" + key_and_token;
    return JSON.parse(UrlFetchApp.fetch(actionsUrl).getContentText());
}

const getCards = (col) => {
    var cardsUrl = url + "list/" + col.id + "/cards/all?" + key_and_token;
    return JSON.parse(UrlFetchApp.fetch(cardsUrl).getContentText());
}


const getData = () => {
    return columns.map(col => {
        const cards = getCards(col).map(card => {
            const states = getStates(card);
            const labels = getLabels(card)
            const week = getDoneWeek(states[states.length - 1])

            return {
                card: {
                    idShort: card.idShort,
                    id: card.id,
                    name: card.name,
                    labels: labels,
                    states: states,
                    week: week
                }
            }


        })

        return {
            columns: { id: col.id, name: col.name },
            cards: cards
        }
    })
}




const getStates = (card) => {
    var actions = getActions(card)
    columns = columns.filter(col => col.name !== 'Template')

    return columns.map(col => {
        if (col.name.includes("Backlog")) {
            return getCreationDate(card)
        }

        var action = actions.find(action => {
            return typeof action.data.listAfter !== 'undefined' && col.id === action.data.listAfter.id
        }

        )
        if (typeof action !== 'undefined') {
            const date = new Date(action.date.split("T")[0])
            date.setHours(0, 0, 0, 0);
            return date
        }
        return ""
    })
}
const getLabels = cards => {
    const reducer = (accumulator, currentValue) => accumulator + "," + currentValue;
    if (typeof cards.labels !== 'undefined' && cards.labels.length > 0) {
        return cards.labels.map(l => l.name).reduce(reducer);
    }
    return "";

}
const getCreationDate = card => {
    var date = new Date(1000 * parseInt(card.id.substring(0, 8), 16))
    date.setHours(0, 0, 0, 0);
    return date
}

let columns = getColumns()
const names = columns.filter(col => col.name !== 'Template').map(col => col.name);
