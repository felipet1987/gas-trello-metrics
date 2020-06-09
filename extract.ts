
// const getFormattedDate = (date) => {
//     let formatted_date = ("0" + date.getDate()).slice(-2) + "/" + ("0" + (date.getMonth() + 1)).slice(-2) + "/" + date.getFullYear()
//     return formatted_date
// }

const getStates = (columns, card) => {
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
const getDoneWeek = date => {
    if (date !== "") {
        const current = new Date(date)
        const onejan = new Date(current.getFullYear(), 0, 1);
        return Math.ceil((((current - onejan) / 86400000) + onejan.getDay() + 1) / 7);
    }
    return 0

}



const getCardsData = () => {

    const getRows = (columns) => {
        const names = columns.map(col => col.name);
        let rows = [[...['idShort', 'id', 'name', 'labels'], ...names, 'week']];
        columns.map(col => {
            var cardsFromList = getCards(col)
            rows = rows.concat(cardsFromList.map(card => {

                var states = getStates(columns, card);
                var labels = getLabels(card)
                var week = getDoneWeek(states[states.length - 1])
                return [card.idShort, card.id, card.name, labels, ...states, week];
            }));
        })
        return rows

    }

    columns = columns.filter(col => col.name !== 'Template')
    return getRows(columns)
}


const getCycleData = (cards) => {


    const getDiffDays = (start, end) => {
        var timeStart = new Date(start).getTime()
        var timeEnd = new Date(end).getTime()
        var timeDiff = Math.abs(timeEnd - timeStart)
        var days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
        if (isNaN(days)) {
            days = 0
        }
        return days
    }

    const getRows = (columns) => {
        const names = columns.map(col => col.name);
        let rows = [[...['name'], ...names]];
        cards.filter(row => row[0] !== 'idShort' && row[row.length - 2] !== "").map(row => {

            const last = row.length - 2
            let diffDays = []
            for (let index = 4; index <= last; index++) {
                // diff = getDiffDays(row[index],(new Date().toDateString())).toString()
                var diff = ""
                if (row[index] !== "") {
                    for (let i = index + 1; i <= last; i++) {
                        if (row[i] !== "") {
                            diff = getDiffDays(row[i], row[index]).toString()
                            break;
                        }
                    }
                }
                diffDays.push(diff)
            }
            rows.push([...[row[2], ...diffDays]])
        })

        return rows

    }
    return getRows(columns)
}

const getThroughputData = (cards) => {


    function range(start, end) {
        return Array(end - start + 1).fill().map((_, idx) => start + idx)
    }

    const min = cards.map(c => c[c.length-1]).filter(c => c !== 0).sort()[0]
    let rows = [['week', 'count']];
 
    let max = getDoneWeek(new Date())

    var weeks = range(min, max);

    weeks.map(week => {
        const count = cards.map(c => c[c.length-1]).filter(c => c == week).map(c => 1).reduce((a, b) => a + b, 0)
        const row = [week, count]
        rows.push(row)
    })

    return rows
}

const getFlowData = (cards) => {
    let rows = [['day', 'done']];
    return rows
}


