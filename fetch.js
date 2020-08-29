var url = "https://api.trello.com/1/";
var key_and_token = "key=" + config.api_key + "&token=" + config.api_token;
const get = url => JSON.parse((UrlFetchApp.fetch(url).getContentText()))
const getSheets = () => SpreadsheetApp.getActiveSpreadsheet().getSheets();
const getColumns = () => {
    const cols = get(url + "boards/" + config.board_id + "/lists/all/?" + key_and_token)
    return cols.map(r => { return { id: r.id, name: r.name } })
}

const cols = getColumns()

const getCards = col => {
    const cards = get(url + "list/" + col.id + "/cards/all?" + key_and_token)
    
    return cards.map(c => {
        const states = getStates(c)
        return {
            idShort: c.idShort,
            id: c.id,
            name: c.name,
            states: states.map(s => s.date),
            labels: getLabels(c),
            week: getDoneWeek(states[states.length - 1].date)
        }
    })
}
const getAllCards = () => {
    return cols.map(col => {
        return {
            id: col.id,
            name: col.name,
            cards: cards = getCards(col)
        }
    })
}
const getCreationDate = card => {
    var date = new Date(1000 * parseInt(card.id.substring(0, 8), 16))
    date.setHours(0, 0, 0, 0);
    return date
}
const getStates = card => {

    let actions = getActions(card)
    return cols.filter(col => col.name !== 'Template').map(col => {
        if (col.name.includes("Backlog")) {
            return {id :col.id ,date : getCreationDate(card)}
        }
        const action = actions.find(a => col.id === a.id)
        if (typeof action !== 'undefined') {
            const date = new Date(action.date)
            date.setHours(0, 0, 0, 0)
            return {id : col.id,date : date}
        }
        return {id: col.id, date : ""}
    })
}
const getLabels = card => {
    if (typeof card.labels !== 'undefined' && card.labels.length > 0) {
        const reducer = (accumulator, currentValue) => accumulator + "," + currentValue;
        return card.labels.map(l => l.name).reduce(reducer);
    }
    return "";
}
const getDoneWeek = date => {
    if (date !== "") {
        const current = new Date(date)
        const onejan = new Date(current.getFullYear(), 0, 1);
        return Math.ceil((((current - onejan) / 86400000) + onejan.getDay() + 1) / 7);
    }
    return 0
}
const getActions = card => {
    const data = get(url + "cards/" + card.id + "/actions/?" + key_and_token)

    return data.filter(r => typeof r.data.listAfter !== 'undefined')
        .map(r => {
            return {
                id: r.data.listAfter.id,
                date: r.date
            }
        })
}

