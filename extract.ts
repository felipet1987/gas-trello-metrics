
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


const countDays = (states) => {
    let diffDays = []
    for (let index = 0; index < states.length; index++) {
        var diff = ""
        if (states[index] !== "") {
            for (let i = index + 1; i <= states.length ; i++) {
                if (states[i] !== "") {
                    diff = getDiffDays(states[i], states[index]).toString()
                    break;
                }
            }
        }
        diffDays.push(diff)
    })
    return diffDays
}


const extractThirdRows = (data) =>{

   const min = data.map(function (d) {
        return d.cards.map(c => c.card.week).filter(c => c !== 0).sort()[0]
    }).sort()[0]



    let max = getDoneWeek(new Date())
    var weeks = range(min, max);
    let rows = [['week', 'count']];


    weeks.map(week => {
        const count = data.map(d => {
            return d.cards.map(c =>c.card.week).filter(c => c == week).map(c => 1).reduce((a, b) => a + b, 0)
        }).reduce((a, b) => a + b, 0)
        const row = [week, count]
        rows.push(row)
    })

    return rows

}


const countCummulatives = (date, dates, current) => {

    let count = 0
    for (let index = 4; index < dates.length - 2; index++) {
        for (let next = index + 1; next < dates.length; next++) {
            if (dates[current] > date && date < dates[next + 1]) {
                count++
            }
        }
    } return count

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

            const cummulatives = []

            for (let i = 4; i < c.length - 2; i++) {
                const cummulative = countCummulatives(date, c, i);
                cummulatives.push(cummulative)
            }
        })
        rows.push([date, days])
    }
    return rows
}


