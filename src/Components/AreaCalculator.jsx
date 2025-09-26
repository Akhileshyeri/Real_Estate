import React, { useState } from 'react';
import Header from './Header';
import Footer from './Footer';

const AreaConverter = () => {
  const [fromValue, setFromValue] = useState('');
  const [toValue, setToValue] = useState('');
  const [fromUnit, setFromUnit] = useState('square-meter');
  const [toUnit, setToUnit] = useState('square-feet');

  // Area conversion factors (relative to square meters)
  const conversionFactors = {
    'square-meter': 1,
    'square-feet': 10.7639,
    'square-inch': 1550,
    'square-kilometer': 0.000001,
    'hectare': 0.0001,
    'acre': 0.000247105,
    'square-mile': 3.861e-7,
    'bigha': 0.000617763,  // Indian unit
    'cent': 0.0247105,     // Indian unit
    'gunta': 0.0247105,    // Indian unit
  };

  const handleFromValueChange = (e) => {
    const value = e.target.value;
    setFromValue(value);
    
    if (value === '') {
      setToValue('');
      return;
    }
    
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      // Convert from fromUnit to square meters, then to toUnit
      const valueInSquareMeters = numValue / conversionFactors[fromUnit];
      const convertedValue = valueInSquareMeters * conversionFactors[toUnit];
      setToValue(convertedValue.toFixed(6));
    }
  };

  const handleFromUnitChange = (e) => {
    const newFromUnit = e.target.value;
    setFromUnit(newFromUnit);
    
    if (fromValue === '') return;
    
    const numValue = parseFloat(fromValue);
    if (!isNaN(numValue)) {
      const valueInSquareMeters = numValue / conversionFactors[newFromUnit];
      const convertedValue = valueInSquareMeters * conversionFactors[toUnit];
      setToValue(convertedValue.toFixed(6));
    }
  };

  const handleToUnitChange = (e) => {
    const newToUnit = e.target.value;
    setToUnit(newToUnit);
    
    if (fromValue === '') return;
    
    const numValue = parseFloat(fromValue);
    if (!isNaN(numValue)) {
      const valueInSquareMeters = numValue / conversionFactors[fromUnit];
      const convertedValue = valueInSquareMeters * conversionFactors[newToUnit];
      setToValue(convertedValue.toFixed(6));
    }
  };

  const swapUnits = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
    
    if (fromValue !== '') {
      setFromValue(toValue);
      setToValue(fromValue);
    }
  };

  return (
    <div style={styles.container}>
        <Header />
      {/* Header Section */}
    

      {/* Converter Section */}
        <section className="flat-section">
        <div className="container">
      <section style={styles.converterSection}>
        <div style={styles.converterContainer}>
          <div style={styles.header}>
            <h1 style={styles.converterTitle}>Area Converter</h1>
            <p style={styles.subtitle}>Enter the value and select desired unit</p>
          </div>

          {/* State Information */}
         

          {/* Converter Form */}
          <div style={styles.converterForm}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>From</label>
              <div style={styles.inputContainer}>
                <input
                  type="number"
                  value={fromValue}
                  onChange={handleFromValueChange}
                  placeholder="Enter value"
                  style={styles.input}
                />
                <select
                  value={fromUnit}
                  onChange={handleFromUnitChange}
                  style={styles.select}
                >
                  <option value="square-meter">Square Meter</option>
                  <option value="square-feet">Square Feet</option>
                  <option value="square-inch">Square Inch</option>
                  <option value="square-kilometer">Square Kilometer</option>
                  <option value="hectare">Hectare</option>
                  <option value="acre">Acre</option>
                  <option value="square-mile">Square Mile</option>
                  <option value="bigha">Bigha</option>
                  <option value="cent">Cent</option>
                  <option value="gunta">Gunta</option>
                </select>
              </div>
            </div>

            <button onClick={swapUnits} style={styles.swapButton}>
              ⇄ Swap
            </button>

            <div style={styles.inputGroup}>
              <label style={styles.label}>To</label>
              <div style={styles.inputContainer}>
                <input
                  type="text"
                  value={toValue}
                  readOnly
                  style={styles.input}
                />
                <select
                  value={toUnit}
                  onChange={handleToUnitChange}
                  style={styles.select}
                >
                  <option value="square-meter">Square Meter</option>
                  <option value="square-feet">Square Feet</option>
                  <option value="square-inch">Square Inch</option>
                  <option value="square-kilometer">Square Kilometer</option>
                  <option value="hectare">Hectare</option>
                  <option value="acre">Acre</option>
                  <option value="square-mile">Square Mile</option>
                  <option value="bigha">Bigha</option>
                  <option value="cent">Cent</option>
                  <option value="gunta">Gunta</option>
                </select>
              </div>
            </div>
          </div>

          <p style={styles.disclaimer}>
            *This tool is for informational purposes only
          </p>
        </div>
      </section>
      </div>
      </section>

        <Footer />
    </div>
  );
};

// Styles
const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f5f5f5',
  },
  titleSection: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '40px 0',
    color: 'white',
    textAlign: 'center',
  },
  titleContainer: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 20px',
  },
  title: {
    fontSize: '2.5rem',
    marginBottom: '10px',
    fontWeight: '600',
  },
  breadcrumb: {
    listStyle: 'none',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '1rem',
  },
  breadcrumbLink: {
    color: 'white',
    textDecoration: 'none',
    transition: 'color 0.3s',
  },
  breadcrumbItem: {
    marginLeft: '5px',
    color: 'rgba(255,255,255,0.8)',
  },
  converterSection: {
    padding: '40px 0',
  },
  converterContainer: {
    maxWidth: '600px',
    margin: '0 auto',
    backgroundColor: 'white',
    borderRadius: '10px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
    padding: '30px',
  },
  header: {
    textAlign: 'center',
    marginBottom: '30px',
  },
  converterTitle: {
    fontSize: '2rem',
    color: '#333',
    marginBottom: '10px',
  },
  subtitle: {
    color: '#666',
    fontSize: '1.1rem',
  },
  stateInfo: {
    backgroundColor: '#f8f9fa',
    padding: '15px',
    borderRadius: '8px',
    marginBottom: '25px',
    borderLeft: '4px solid #667eea',
  },
  stateHeader: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '10px',
  },
  stateIcon: {
    marginRight: '10px',
  },
  stateText: {
    fontSize: '1.1rem',
    color: '#333',
  },
  stateNote: {
    display: 'flex',
    alignItems: 'flex-start',
  },
  checkbox: {
    marginRight: '10px',
    marginTop: '3px',
  },
  stateLabel: {
    color: '#555',
    fontSize: '0.95rem',
  },
  converterForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    marginBottom: '8px',
    fontWeight: '600',
    color: '#333',
  },
  inputContainer: {
    display: 'flex',
    gap: '10px',
  },
  input: {
    flex: 1,
    padding: '12px 15px',
    border: '1px solid #ddd',
    borderRadius: '5px',
    fontSize: '1rem',
    outline: 'none',
    transition: 'border-color 0.3s',
  },
  select: {
    width: '180px',
    padding: '12px 15px',
    border: '1px solid #ddd',
    borderRadius: '5px',
    fontSize: '1rem',
    outline: 'none',
    backgroundColor: 'white',
  },
  swapButton: {
    alignSelf: 'center',
    padding: '10px 20px',
    backgroundColor: '#ED2027',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: '600',
    transition: 'background-color 0.3s',
  },
  disclaimer: {
    textAlign: 'center',
    marginTop: '20px',
    color: '#888',
    fontSize: '0.9rem',
    fontStyle: 'italic',
  },
};

export default AreaConverter;