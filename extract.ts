
const extractFirstRows = (data) => {
    const names = data.map(d => d.name)
    let rows = [[...['idShort', 'id', 'name', 'labels'], ...names, 'week']]
    data.map(d => {
        rows = rows.concat(d.cards.map(c => {
            const states = c.states
            return [c.idShort, c.id, c.name, c.labels, ...states, c.week]
        }))
    })
    return rows;
}
const extractSecondRows = (data) => {
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
    const getDiff = (states, index) => {
        var diff = ""
        if (states[index] !== "") {
            for (let i = index + 1; i <= states.length; i++) {
                if (states[states.length - 1] === "") {
                    return;
                }
                if (states[i] !== "") {
                    return getDiffDays(states[i], states[index]).toString()
                }
            }
        }
    }
    const countDays = (states) => {
        let diffDays = []
        if (states[states.length] !== "") {
            for (let index = 0; index < states.length; index++) {
                diffDays.push(getDiff(states,index))
            }
        }
        return diffDays
    }
    const names = data.map(d => d.name)
    let rows = [[...['name'], ...names]];
    data.map(d => d.cards.map(c => rows.push([...[c.name], ...countDays(c.states)])))
    return rows
}


const extractThirdRows = (data) => {
    const min = data.map(d => {
        return d.cards.map(c => c.week).filter(c => c !== 0).sort()[0]
    }).sort()[0]
    let max = getDoneWeek(new Date())
    var weeks = range(min, max);
    let rows = [['week', 'count']];
    weeks.map(week => {
        const count = data.map(d => {
            return d.cards.map(c => c.week).filter(c => c == week).map(c => 1).reduce((a, b) => a + b, 0)
        }).reduce((a, b) => a + b, 0)
        const row = [week, count]
        rows.push(row)
    })
    return rows
}

const extractFourthRows = (data) => {
    data.map(d => d.cards.map(c => console.log(d.name,c.name) ))

    const getMin = (data) => {
        return data.map(d => d.cards.map(c => c.states[0])
            .sort((a, b) => a.getTime() - b.getTime())[0])
            .sort((a, b) => a.getTime() - b.getTime())[0]
    }
    const getCumm = (date, data, index) => {
        const past = date.getTime()
        const future = past + 86400000
        let result = []
        data.map(d => d.cards
            .map(c => {
                const state = c.states.find((s, i) => s.date !== "" && s.id === data[index].id )
                if(state && (new Date(state.date).getTime() - past) >= 0 && (new Date(state.date).getTime() - future) < 0 ){
                    const indexDate = new Date(state.date)
                    const greater = indexDate.getTime() - past >= 0
                    const lesser =  future - indexDate.getTime() > 0
                    const between = greater && lesser
                    result.push([formatted(date),formatted(indexDate),formatted(date.setDate(date.getDate() + 1)),between])
                }
            })
        )
        return result.length
    }
    const min = getMin(data);
    const formatted = date => {
        const ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(date)
        const mo = new Intl.DateTimeFormat('en', { month: '2-digit' }).format(date)
        const da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(date)
        return `${da}/${mo}/${ye}`
    }
    const names = data.map(d => d.name)
    let rows = [[...['date'], ...names]];
    for (let date = new Date(min); date < new Date(); date.setDate(date.getDate() + 1)) {
        //const reducer = (a, c) => a + c;
        let cummulatives = []
        for (let index = 0; index < names.length; index++) {
            const count = getCumm(date,data,index)
            cummulatives.push(count)
        }
        rows.push([...[formatted(date)], ...cummulatives])
    }
    return rows
}

const getCummulative = (index, date, next, data) => {


    let count = 0

    data.map(col => {
        const cards = col.cards
        cards.map(c => {
            const state = c.states[index]
            if (state !== "") {
                const indexTime = new Date(state).getTime()
                const greater = date > indexTime
                const lesser = indexTime < next
                if ((greater && lesser)) {
                    count++
                }
            }
        })
    })
    return count
}

function range(start, end) {
    return Array(end - start + 1).fill().map((_, idx) => start + idx)
}

