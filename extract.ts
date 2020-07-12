
function range(start, end) {
    return Array(end - start + 1).fill().map((_, idx) => start + idx)
}
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
const getDoneWeek = date => {
    if (date !== "") {
        const current = new Date(date)
        const onejan = new Date(current.getFullYear(), 0, 1);
        return Math.ceil((((current - onejan) / 86400000) + onejan.getDay() + 1) / 7);
    }
    return 0

}

const countDays = (states) => {
    let diffDays = []

    if (states[states.length] !== "") {
        for (let index = 0; index < states.length; index++) {
            var diff = ""
            if (states[index] !== "") {

                for (let i = index + 1; i <= states.length; i++) {
                    if (states[states.length - 1] === "") {
                        break;
                    }
                    if (states[i] !== "") {
                        diff = getDiffDays(states[i], states[index]).toString()
                        break;
                    }
                }
            }
            diffDays.push(diff)
        }
    }
    return diffDays
}



const extractFirstRows = (data) => {
    let rows = [[...['idShort', 'id', 'name', 'labels'], ...names, 'week']]
    data.map(d => {
        rows = rows.concat(d.cards.map(c => {
            return [c.card.idShort, c.card.id, c.card.name, c.card.labels, ...c.card.states, c.card.week]
        }))
    })
    return rows;
}


const extractSecondRows = (data) => {

    const getRows = () => {
        let rows = [[...['name'], ...names]];
        data.map(d => {
            d.cards.map(c => {
                let diffDays = countDays(c.card.states)
                rows.push([...[c.card.name], ...diffDays])
            })
        })
        return rows
    }

    return getRows()
}





const extractThirdRows = (data) => {

    const min = data.map(function (d) {
        return d.cards.map(c => c.card.week).filter(c => c !== 0).sort()[0]
    }).sort()[0]



    let max = getDoneWeek(new Date())
    var weeks = range(min, max);
    let rows = [['week', 'count']];


    weeks.map(week => {
        const count = data.map(d => {
            return d.cards.map(c => c.card.week).filter(c => c == week).map(c => 1).reduce((a, b) => a + b, 0)
        }).reduce((a, b) => a + b, 0)
        const row = [week, count]
        rows.push(row)
    })

    return rows

}

const extractFourthRows = (data) => {

    let rows = [[...['date'], ...names]];

    const min = data.map(function (d) {
        return d.cards.map(c => c.card.states[0]).sort((a, b) => a.getTime() - b.getTime())[0]
    }).sort((a, b) => a.getTime() - b.getTime())[0]

    for (let date = new Date(min); date < new Date(); date.setDate(date.getDate() + 1)) {
        const ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(date)
        const mo = new Intl.DateTimeFormat('en', { month: '2-digit' }).format(date)
        const da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(date)
        const formattedDate = `${da}/${mo}/${ye}`

        let cummulatives = []
        for (let index = 0; index < names.length; index++) {
            let count = 0
            data.map(d => d.cards.map(c => {
                const states = c.card.states
                if (states[index] !== "") {
                    for (let next = index + 1; next <= states.length; next++) {
                        if (states[next] !== "") {
                            const indexDate = new Date(states[index])
                            const nextDate = new Date(states[next])
                            if (date >= indexDate && indexDate < nextDate) {
                                count++
                            }
                            break;
                        }
                    }
                }

            }))
            cummulatives.push(count)
        }
        rows.push([...[formattedDate], ...cummulatives])
    }


    return rows
}

const getFlowData = (cards) => {

    let rows = [[...['date'], ...names]];
    let minDate = cards.filter(c => c[0] !== 'idShort').map(c => c[4]).reduce((p, v) => (p < v ? p : v))

    for (let date = new Date(minDate); date < new Date(); date.setDate(date.getDate() + 1)) {

        // const ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(date)
        // const mo = new Intl.DateTimeFormat('en', { month: '2-digit' }).format(date)
        // const da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(date)
        // const formattedDate = `${da}/${mo}/${ye}`
        let days = 0

        cards.filter(c => c[0] !== 'idShort').map(c => {
        })
        rows.push([date, days])
    }
    return rows
}


