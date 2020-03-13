import { fetchPricesForDays, getDaysList, getOffsetAndDays, formatDate } from '../util';
import React, { Component } from 'react';
import queryString from "query-string";
class RateHistory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      "hasError": false,
      base: '',
      currency: '',
      rates: [],
      fetching: true,
      startDate: '',
      endDate: '',
      errorMessage: ""
    };
  }

  async fetchPrices() {
    this.setState({
      rates: [],
      fetching: true
    });
    try {
    const { base, currency, startDate, endDate } = this.state;
    const { offset, days } = getOffsetAndDays({ startDate, endDate })
    const lastTen = await fetchPricesForDays(base, currency, getDaysList(offset, days));
    this.setState({
      rates: lastTen,
      fetching: false
      });
    }catch (err) {
      this.setState({
      fetching: false,
      hasError: true,
      errorMessage: err.message
      })
    }
    }
  componentDidMount() {
    const startDate = new Date();
    const endDate = new Date();
    startDate.setDate(endDate.getDate() - 10);

    const { base, currency } = queryString.parse(this.props.location.search);
    this.setState({ base, currency, startDate, endDate }, this.fetchPrices);
  }

  changeStartDate = (e) => {
    this.setState({ startDate: new Date(e.target.value) }, this.fetchPrices);
  }

  changeEndDate = (e) => {
    this.setState({ endDate: new Date(e.target.value) }, this.fetchPrices)
  }

  render() {
    const { base, currency, rates, fetching, startDate, endDate, hasError } = this.state;
    if (hasError) {
         return (
          <div class="alert alert-danger" role="alert">
              Oops, something went wrong.
              {this.state.errorMessage}
          </div>
      )
    } else {
       return (
        <div className="container" style={{ maxWidth: '600px' }}>
          <h3>Historical prices for {base} vs {currency}</h3>
          <div className="form-group">
            <label htmlFor="start-date">Start date</label>
            <input
              value={formatDate(startDate)}
              onChange={this.changeStartDate}
              type="date"
              className="form-control"
              id="start-date"
            />
          </div>
          <div className="form-group">
            <label htmlFor="end-date">End date</label>
            <input
              value={formatDate(endDate)}
              onChange={this.changeEndDate}
              type="date"
              className="form-control"
              id="end-date"
            />
          </div>

          <table className="table">
            <thead>
              <tr>
                <th scope="col">Currency</th>
                <th scope="col">Price in {base}</th>
                <th scope="col">Date</th>
              </tr>
            </thead>
            <tbody>
              {rates.map(({ value, date }) => (
                <tr key={date}>
                  <td>{currency}</td>
                  <td>{value}</td>
                  <td>{date}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {
            fetching && (
              <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                <div className="spinner-border" role="status" >
                  <span className="sr-only">Loading...</span>
                </div>
              </div>
            )
          }
        </div >
      )
    }
  }
  }
  export default RateHistory;