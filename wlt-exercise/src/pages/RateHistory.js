import queryString from 'query-string';
import { fetchPricesForDays, getDaysList, formatDate } from '../util';
import React, { useState, useEffect} from 'react';

const RateHistory = props => {
  const today = new Date();
  const tenDaysAgo = new Date();
  tenDaysAgo.setDate(today.getDate() - 10);
  const [startDate, setStartDate] = useState(tenDaysAgo);
  const [endDate, setEndDate] = useState(today);
  const [rates, setRates] = useState([]);
  const { base, currency } = queryString.parse(props.location.search);

  const navigateBack = () => props.history.push('/');

  useEffect(async () => {
    const fetchLastTen = async () => {
      const lastTen = await fetchPricesForDays(base, currency, getDaysList(0, 10));
      setRates([...rates, ...lastTen]);
    }
    fetchLastTen();
  }, [startDate, endDate])

  return (
    <div className="container" style={{ maxWidth: '600px' }}>
      <button type="button" className="btn btn-link" onClick={navigateBack}>Back to Search</button>
      <h3>Historical prices for {base} vs {currency}</h3>
      <div className="form-group">
        <label htmlFor="start-date">Start Date</label>
        <input
          value={formatDate(startDate)}
          type="date"
          className="form-control"
          id="start-date"
          onChange={e => setStartDate(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label htmlFor="end-date">End Date</label>
        <input
          value={formatDate(endDate)}
          type="date"
          className="form-control"
          id="end-date"
          onChange={e => setEndDate(e.target.value)}
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
            <tr>
              <td>{currency}</td>
              <td>{value}</td>
              <td>{date}</td>
            </tr>
          ))}
        </tbody>
      </table>

    </div >

  )
}

export default RateHistory;