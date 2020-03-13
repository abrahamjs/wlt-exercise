import axios from "axios";

export const formatDate = (date) => {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
}


export const getDaysList = (offset, days) => {
    const today = new Date();
    const lastTen = []
    for (let i = offset; i < days; i++) {
        const previous = new Date().setDate(today.getDate() - i)
        lastTen.push(formatDate(previous));
    }
    return lastTen;
}

export const fetchPricesForDays = (base, currency, days) => {
    return Promise.all(days.map(date => fetchPriceAtDate(base, currency, date)));
}

export const fetchPriceAtDate = async (base, currency, date) => {
    return axios.get(`https://api.ratesapi.io/api/${date}?base=${base}&symbols=${currency}`)
        .then(response => ({ value: response.data.rates[currency], date }));
}