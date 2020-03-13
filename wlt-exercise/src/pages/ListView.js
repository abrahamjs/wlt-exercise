import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import queryString from "query-string";

class ListView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            "hasError" : false, 
             rates : [],
             base: "EUR"
        };
    }
    
    componentDidMount() {
        axios.get("https://api.ratesapi.io/api/latest")
        .then(response => {
            const { rates } = response.data;
            const rateList = Object.keys(rates).map(key => ({ currency: key, value: rates[key] }));
            this.setState({ rates: rateList })
           
        });
    
    }
     changeBase = ((event) => {
        const base = event.target.value;
        axios.get("https://api.ratesapi.io/api/latest?base=" + base)
        .then(response => {
            const { rates } = response.data;
            const rateList = Object.keys(rates).map(key => ({ currency: key, value: rates[key] }));
            this.setState({ rates: rateList})
        });

       this.setState({base: base}, () => {console.log('test:' + this.state.base)});


        console.log(base);
    })

    
  
    render() {
        console.log("this base ::" + this.state.base);
        if (this.state.hasError) {
            return (<p>Put any sort of error information here</p>);
        } else {
            return (
                <div>
                    <label >Choose a base : </label>
                    <select id="currency" onChange={this.changeBase}>
                        <option value="GBP">GBP</option>
                        <option value="HKD">HKD</option>
                        <option value="IDR">IDR</option>
                        <option value="ILS">ILS</option>
                        <option value="DKK">DKK</option>
                        <option value="INR">INR</option>
                        <option value="MXN">MXN</option>
                        <option value="CZK">CZK</option>
                        <option value="SGD">SGD</option>
                        <option value="THB">THB</option>
                        <option value="IDR">IDR</option>
                        <option value="ILS">ILS</option>
                        <option value="HRK">HRK</option>
                        <option value="MYR">MYR</option>
                        <option value="NOK">NOK</option>
                        <option value="CNY">CNY</option>
                        <option value="BGN">BGN</option>
                        <option value="SEK">SEK</option>
                        <option value="PLN">PLN</option>
                        <option value="ZAR">ZAR</option>
                        <option value="CAD">CAD</option>
                        <option value="ISK">ISK</option>
                        <option value="BRL">BRL</option>
                        <option value="RON">RON</option>
                        <option value="NZD">NZD</option>
                        <option value="TRY">TRY</option>
                        <option value="JPY">JPY</option>
                        <option value="RUB">RUB</option>
                        <option value="KRW">KRW</option>
                        <option value="USD">USD</option>
                        <option value="HUF">HUF</option>
                        <option value="AUD">AUD</option>
                    </select>
                    {this.state.rates.map(rate => <div><Link to={`history?${queryString.stringify({ base: this.state.base, currency: rate.currency })}`}>>Currency: {rate.currency}, Value: {rate.value}</Link></div>)}
                </div>
            )
        }
    }
}

export default ListView;