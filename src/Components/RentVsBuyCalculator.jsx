import React, { useState, useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';

const RentVsBuyCalculator = () => {
  // State for input parameters
  const [monthlyRent, setMonthlyRent] = useState(20000);
  const [propertyPrice, setPropertyPrice] = useState(5000000);
  const [downPayment, setDownPayment] = useState(20);
  const [interestRate, setInterestRate] = useState(7);
  const [propertyAppreciation, setPropertyAppreciation] = useState(7);
  const [yearsToStay, setYearsToStay] = useState(10);

  // State for calculated results
  const [totalRentingCost, setTotalRentingCost] = useState(0);
  const [totalBuyingCost, setTotalBuyingCost] = useState(0);
  const [propertyValue, setPropertyValue] = useState(0);
  const [netFinancialImpact, setNetFinancialImpact] = useState(0);
  const [monthlyLoanPayment, setMonthlyLoanPayment] = useState(0);
  const [loanAmount, setLoanAmount] = useState(0);
  const [downPaymentAmount, setDownPaymentAmount] = useState(0);

  // Calculate all values when inputs change
  useEffect(() => {
    calculateResults();
  }, [monthlyRent, propertyPrice, downPayment, interestRate, propertyAppreciation, yearsToStay]);

  const calculateResults = () => {
    // Calculate loan details
    const downPaymentAmt = propertyPrice * (downPayment / 100);
    const loanAmt = propertyPrice - downPaymentAmt;
    
    // Monthly loan payment calculation (simplified)
    const monthlyInterestRate = interestRate / 100 / 12;
    const numberOfPayments = yearsToStay * 12;
    const monthlyPayment = loanAmt * monthlyInterestRate * 
      Math.pow(1 + monthlyInterestRate, numberOfPayments) / 
      (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);
    
    // Total costs
    const rentingCost = monthlyRent * 12 * yearsToStay;
    const buyingCost = downPaymentAmt + (monthlyPayment * numberOfPayments);
    
    // Property value after appreciation
    const futurePropertyValue = propertyPrice * Math.pow(1 + propertyAppreciation/100, yearsToStay);
    
    // Net financial impact
    const netImpact = futurePropertyValue - buyingCost + rentingCost;
    
    // Update state
    setDownPaymentAmount(downPaymentAmt);
    setLoanAmount(loanAmt);
    setMonthlyLoanPayment(monthlyPayment);
    setTotalRentingCost(rentingCost);
    setTotalBuyingCost(buyingCost);
    setPropertyValue(futurePropertyValue);
    setNetFinancialImpact(netImpact);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div style={styles.container}>
      {/* Header Section */}
     <Header />

      {/* Calculator Section */}
      <section style={styles.calculatorSection}>
        <div style={styles.calculatorContainer}>
          {/* Input Parameters */}
          <div style={styles.inputSection}>
            <h2 style={styles.sectionTitle}>Input Parameters</h2>
            
            <div style={styles.inputGrid}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Monthly Rent (₹)</label>
                <input
                  type="number"
                  value={monthlyRent}
                  onChange={(e) => setMonthlyRent(Number(e.target.value))}
                  style={styles.input}
                />
              </div>
              
              <div style={styles.inputGroup}>
                <label style={styles.label}>Property Price (₹)</label>
                <input
                  type="number"
                  value={propertyPrice}
                  onChange={(e) => setPropertyPrice(Number(e.target.value))}
                  style={styles.input}
                />
              </div>
              
              <div style={styles.inputGroup}>
                <label style={styles.label}>Down Payment (%)</label>
                <input
                  type="number"
                  value={downPayment}
                  onChange={(e) => setDownPayment(Number(e.target.value))}
                  style={styles.input}
                />
              </div>
              
              <div style={styles.inputGroup}>
                <label style={styles.label}>Interest Rate (%)</label>
                <input
                  type="number"
                  value={interestRate}
                  onChange={(e) => setInterestRate(Number(e.target.value))}
                  style={styles.input}
                  step="0.1"
                />
              </div>
              
              <div style={styles.inputGroup}>
                <label style={styles.label}>Property Appreciation (%)</label>
                <input
                  type="number"
                  value={propertyAppreciation}
                  onChange={(e) => setPropertyAppreciation(Number(e.target.value))}
                  style={styles.input}
                  step="0.1"
                />
              </div>
              
              <div style={styles.inputGroup}>
                <label style={styles.label}>Years to Stay</label>
                <input
                  type="number"
                  value={yearsToStay}
                  onChange={(e) => setYearsToStay(Number(e.target.value))}
                  style={styles.input}
                />
              </div>
            </div>
          </div>

          <hr style={styles.divider} />

          {/* Financial Summary */}
          <div style={styles.summarySection}>
            <h2 style={styles.sectionTitle}>Financial Summary</h2>
            
            <div style={styles.summaryGrid}>
              <div style={styles.summaryCard}>
                <h3 style={styles.summaryTitle}>Total Renting Cost</h3>
                <p style={styles.summaryAmount}>{formatCurrency(totalRentingCost)}</p>
                <p style={styles.summaryNote}>Over {yearsToStay} years</p>
              </div>
              
              <div style={styles.summaryCard}>
                <h3 style={styles.summaryTitle}>Total Buying Cost</h3>
                <p style={styles.summaryAmount}>{formatCurrency(totalBuyingCost)}</p>
                <p style={styles.summaryNote}>Including loan payments</p>
              </div>
              
              <div style={styles.summaryCard}>
                <h3 style={styles.summaryTitle}>Property Value</h3>
                <p style={styles.summaryAmount}>{formatCurrency(propertyValue)}</p>
                <p style={styles.summaryNote}>After appreciation</p>
              </div>
              
              <div style={styles.summaryCard}>
                <h3 style={styles.summaryTitle}>Net Financial Impact</h3>
                <p style={styles.summaryAmount}>{formatCurrency(netFinancialImpact)}</p>
                <p style={styles.summaryNote}>
                  {netFinancialImpact > 0 ? 'Buying is financially better' : 'Renting is financially better'}
                </p>
              </div>
            </div>
          </div>

          {/* Loan Details */}
          <div style={styles.loanSection}>
            <h2 style={styles.sectionTitle}>Loan Details</h2>
            
            <div style={styles.loanGrid}>
              <div style={styles.loanCard}>
                <h3 style={styles.loanTitle}>Monthly Payment</h3>
                <p style={styles.loanAmount}>{formatCurrency(monthlyLoanPayment)}</p>
              </div>
              
              <div style={styles.loanCard}>
                <h3 style={styles.loanTitle}>Loan Amount</h3>
                <p style={styles.loanAmount}>{formatCurrency(loanAmount)}</p>
              </div>
              
              <div style={styles.loanCard}>
                <h3 style={styles.loanTitle}>Down Payment</h3>
                <p style={styles.loanAmount}>{formatCurrency(downPaymentAmount)}</p>
              </div>
            </div>
          </div>
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
    backgroundColor: '#f5f7fa',
    fontFamily: 'Arial, sans-serif',
  },
  headerSection: {
    background: 'linear-gradient(135deg, #4f6df5 0%, #3a56d6 100%)',
    padding: '40px 0',
    color: 'white',
    textAlign: 'center',
  },
  headerContainer: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 20px',
  },
  mainTitle: {
    fontSize: '2.5rem',
    marginBottom: '10px',
    fontWeight: '700',
  },
  subtitle: {
    fontSize: '1.2rem',
    opacity: '0.9',
  },
  calculatorSection: {
    padding: '40px 20px',
  },
  calculatorContainer: {
    maxWidth: '1000px',
    margin: '0 auto',
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 5px 20px rgba(0,0,0,0.1)',
    overflow: 'hidden',
  },
  inputSection: {
    padding: '30px',
  },
  sectionTitle: {
    fontSize: '1.8rem',
    color: '#2d3748',
    marginBottom: '25px',
    fontWeight: '600',
  },
  inputGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '20px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    marginBottom: '8px',
    fontWeight: '600',
    color: '#4a5568',
    fontSize: '1rem',
  },
  input: {
    padding: '12px 15px',
    border: '1px solid #e2e8f0',
    borderRadius: '6px',
    fontSize: '1rem',
    outline: 'none',
    transition: 'border-color 0.3s',
  },
  inputFocus: {
    borderColor: '#ED2027',
  },
  divider: {
    border: 'none',
    height: '1px',
    backgroundColor: '#e2e8f0',
    margin: '0',
  },
  summarySection: {
    padding: '30px',
  },
  summaryGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '20px',
  },
  summaryCard: {
    backgroundColor: '#f8fafc',
    padding: '20px',
    borderRadius: '8px',
    textAlign: 'center',
    borderLeft: '4px solid #ED2027',
  },
  summaryTitle: {
    fontSize: '1.1rem',
    color: '#4a5568',
    marginBottom: '10px',
    fontWeight: '600',
  },
  summaryAmount: {
    fontSize: '1.5rem',
    color: '#2d3748',
    fontWeight: '700',
    marginBottom: '5px',
  },
  summaryNote: {
    fontSize: '0.9rem',
    color: '#718096',
  },
  loanSection: {
    padding: '30px',
    backgroundColor: '#f8fafc',
  },
  loanGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
  },
  loanCard: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    textAlign: 'center',
    boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
  },
  loanTitle: {
    fontSize: '1rem',
    color: '#4a5568',
    marginBottom: '10px',
    fontWeight: '600',
  },
  loanAmount: {
    fontSize: '1.3rem',
    color: '#2d3748',
    fontWeight: '700',
  },
};

export default RentVsBuyCalculator;