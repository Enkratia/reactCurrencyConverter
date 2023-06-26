import React from 'react';
import { Block } from './Block';
import './index.scss';

function App() {
  const [fromCurrency, setFromCurrency] = React.useState("AZN");
  const [toCurrency, setToCurrency] = React.useState("USD");
  const [fromPrice, setFromPrice] = React.useState(0);
  const [toPrice, setToPrice] = React.useState(1);
  const ratesRef = React.useRef({});

  React.useEffect(() => {
    fetch("https://www.cbr-xml-daily.ru/latest.js")
    .then(res => res.json())
    .then(json => {
      ratesRef.current = json.rates;
      onChangeToPrice(toPrice, toCurrency);
    })
    .catch(err => {
      console.warn(err);
      alert("Не удалось получить информацию");
    });
  }, []);

  const onChangeFromPrice = (value, chosenCurrency) => {
    const price = value / ratesRef.current[chosenCurrency];
    const result = price * ratesRef.current[toCurrency];
    setFromPrice(value);
    setToPrice(result.toFixed(3));
  };

  const onChangeToPrice = (value, chosenCurrency) => {
    const result = ratesRef.current[fromCurrency] / ratesRef.current[chosenCurrency] * value;
    setFromPrice(result.toFixed(3));
    setToPrice(value);
  };

  const handleChangeFromCurrency = (currency) => {
    setFromCurrency(currency);
    onChangeFromPrice(fromPrice, currency);
  };

  const handleChangeToCurrency = (currency) => {
    setToCurrency(currency);
    onChangeToPrice(toPrice, currency);
  };

  return (
    <div className="App">
      <Block 
        value={fromPrice} 
        currency={fromCurrency} 
        onChangeCurrency={handleChangeFromCurrency} 
        onChangeValue={onChangeFromPrice} 
      />

      <Block 
        value={toPrice} 
        currency={toCurrency} 
        onChangeCurrency={handleChangeToCurrency} 
        onChangeValue={onChangeToPrice} 
      />
    </div>
  );
}

export default App;
