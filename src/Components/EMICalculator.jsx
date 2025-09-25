import React, { useState, useEffect } from 'react';
import './EMICalculator.css';
import Header from './Header';
import Footer from './Footer';
import { useNavigate } from 'react-router-dom';

const EMICalculator = () => {
  const navigate = useNavigate();
  const [loanAmount, setLoanAmount] = useState(26500000);
  const [interestRate, setInterestRate] = useState(8.4);
  const [tenure, setTenure] = useState(20);
  const [emi, setEmi] = useState(228299);
  const [totalInterest, setTotalInterest] = useState(28291686);
  const [totalAmount, setTotalAmount] = useState(54791686);

  // Calculate EMI and related values
  const calculateEMI = () => {
    const principal = loanAmount;
    const monthlyRate = interestRate / (12 * 100);
    const totalMonths = tenure * 12;

    // EMI Formula: P * r * (1+r)^n / ((1+r)^n - 1)
    const emiValue = (principal * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
      (Math.pow(1 + monthlyRate, totalMonths) - 1);

    const totalAmountValue = emiValue * totalMonths;
    const totalInterestValue = totalAmountValue - principal;
    const principalPercentage = (principal / totalAmountValue) * 100;
    const interestPercentage = (totalInterestValue / totalAmountValue) * 100;

    setEmi(Math.round(emiValue));
    setTotalAmount(Math.round(totalAmountValue));
    setTotalInterest(Math.round(totalInterestValue));
  };

  useEffect(() => {
    calculateEMI();
  }, [loanAmount, interestRate, tenure]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const principalPercentage = Math.round((loanAmount / totalAmount) * 100);
  const interestPercentage = 100 - principalPercentage;

  return (
    <div>
      <Header />

      <div className="emi-calculator">
        <div className="container">
       
          {/* Header */}
          <div className="header"
          >

            

            <h1 >EMI Calculator</h1>
            

            <p>Calculate your home loan EMI instantly</p>
          </div>

          <div className="calculator-content">
            {/* Left Panel - Loan Details */}
            <div className="loan-details">
              <h2>Loan Details</h2>

              {/* Loan Amount */}
              <div className="input-group">
                <label>Loan Amount</label>
                <div className="input-with-icon">
                  <span className="currency-symbol">₹</span>
                  <input
                    type="number"
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(Number(e.target.value))}
                    min="100000"
                    max="100000000"
                  />
                </div>
                <div className="range-labels">
                  <span>₹1L</span>
                  <span>₹5Cr</span>
                </div>
                <input
                  type="range"
                  min="100000"
                  max="50000000"
                  step="100000"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(Number(e.target.value))}
                  className="slider"
                />
              </div>

              {/* Interest Rate */}
              <div className="input-group">
                <label>Interest Rate (% per annum)</label>
                <div className="input-with-icon">
                  <input
                    type="number"
                    value={interestRate}
                    onChange={(e) => setInterestRate(Number(e.target.value))}
                    min="5"
                    max="20"
                    step="0.1"
                  />
                  <span className="percentage-symbol">%</span>
                </div>
                <div className="range-labels">
                  <span>5%</span>
                  <span>20%</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="20"
                  step="0.1"
                  value={interestRate}
                  onChange={(e) => setInterestRate(Number(e.target.value))}
                  className="slider"
                />
              </div>

              {/* Loan Tenure */}
              <div className="input-group">
                <label>Loan Tenure (Years)</label>
                <input
                  type="number"
                  value={tenure}
                  onChange={(e) => setTenure(Number(e.target.value))}
                  min="1"
                  max="30"
                />
                <div className="range-labels">
                  <span>1 Year</span>
                  <span>30 Years</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="30"
                  value={tenure}
                  onChange={(e) => setTenure(Number(e.target.value))}
                  className="slider"
                />
              </div>
            </div>

            {/* Right Panel - Results */}
            <div className="results-panel">
              {/* Monthly EMI */}
              <div className="emi-result">
                <h3 style={{ color: "white" }}>Monthly EMI</h3>
                <div className="emi-amount">{formatCurrency(emi)}</div>
                <p>Amount payable every month</p>
              </div>

              {/* Payment Breakdown */}
              <div className="payment-breakdown">
                <h3>Payment Breakdown</h3>

                <div className="breakdown-details">
                  <div className="breakdown-row">
                    <span>Principal Amount</span>
                    <span>{formatCurrency(loanAmount)}</span>
                  </div>

                  <div className="breakdown-row">
                    <span>Total Interest</span>
                    <span className="interest-amount">{formatCurrency(totalInterest)}</span>
                  </div>

                  <div className="divider"></div>

                  <div className="breakdown-row total">
                    <span>Total Amount</span>
                    <span className="total-amount">{formatCurrency(totalAmount)}</span>
                  </div>
                </div>

                {/* Payment Distribution Chart */}
                <div className="payment-distribution">
                  <h4>Payment Distribution</h4>
                  <div className="distribution-chart">
                    <div
                      className="chart-segment principal-segment"
                      style={{ width: `${principalPercentage}%` }}
                    >
                      {principalPercentage}%
                    </div>
                    <div
                      className="chart-segment interest-segment"
                      style={{ width: `${interestPercentage}%` }}
                    >
                      {interestPercentage}%
                    </div>
                  </div>

                  <div className="distribution-labels">
                    <div className="distribution-label">
                      <div className="color-indicator principal"></div>
                      <span>Principal ({principalPercentage}%)</span>
                    </div>
                    <div className="distribution-label">
                      <div className="color-indicator interest"></div>
                      <span>Interest ({interestPercentage}%)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pro Tips */}
              <div className="pro-tips">
                <div className="pro-tips-header">
                  <span className="lightbulb-icon">💡</span>
                  <h3>Pro Tips</h3>
                </div>

                <ul className="tips-list">
                  <li>Higher down payment reduces EMI burden</li>
                  <li>Shorter tenure saves on total interest</li>
                  <li>Compare rates from multiple lenders</li>
                  <li>Consider prepayment to reduce interest</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>

  );
};

export default EMICalculator;