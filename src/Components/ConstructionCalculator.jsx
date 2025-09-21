import React, { useState } from 'react';
import "./ConstructionCalculator.css";
import Header from './Header';
import Footer from './Footer';
import { useNavigate } from 'react-router-dom';

const ConstructionCalculator = () => {
    const navigate = useNavigate();
    const [length, setLength] = useState('');
    const [width, setWidth] = useState('');
    const [thickness, setThickness] = useState('');
    const [unit, setUnit] = useState('Feet');
    const [grade, setGrade] = useState('M20');
    const [slabType, setSlabType] = useState('One Way Slab');
    const [includeSteel, setIncludeSteel] = useState(true);
    const [results, setResults] = useState(null);

    const calculateMaterials = () => {
        // Validation
        if (!length || !width || !thickness) {
            alert('Please enter all dimensions');
            return;
        }

        const len = parseFloat(length);
        const w = parseFloat(width);
        const thick = parseFloat(thickness);

        if (isNaN(len) || isNaN(w) || isNaN(thick)) {
            alert('Please enter valid numbers');
            return;
        }

        // Convert to meters if needed
        let area, volume;
        if (unit === 'Feet') {
            area = len * w; // sq ft
            volume = area * thick; // cu ft
        } else if (unit === 'Meter') {
            area = len * w; // sq m
            volume = area * thick; // cu m
        } else { // Inches
            area = (len * w) / 144; // sq ft
            volume = (area * thick) / 12; // cu ft
        }

        // Calculate materials based on M20 grade concrete
        // These are example calculations - real formulas would be more complex
        const cementBags = volume * 2.8 * (unit === 'Meter' ? 35.3147 : 1);
        const sand = volume * 1.5 * (unit === 'Meter' ? 35.3147 : 1);
        const aggregate = volume * 3 * (unit === 'Meter' ? 35.3147 : 1);
        const water = volume * 200 * (unit === 'Meter' ? 35.3147 : 1);

        // Calculate steel (example calculation)
        const steel = area * 80 * (unit === 'Meter' ? 10.7639 : 1);

        setResults({
            area: area.toFixed(2),
            volume: volume.toFixed(2),
            cementBags: cementBags.toFixed(0),
            sand: sand.toFixed(2),
            aggregate: aggregate.toFixed(2),
            water: water.toFixed(2),
            steel: steel.toFixed(0),
            grade,
            volumeCum: (volume * (unit === 'Meter' ? 1 : 0.0283168)).toFixed(3)
        });
    };

    return (
        <div>

            <Header />
            <div className="calculator-container">
                <header className="calculator-header">
                    <button
                        style={{
                            display: "flex",
                            justifyContent: "flex-start",
                           background:"#ED2027",
                           color:"#fff",
                             // optional, to keep background clear
                            border: "none", // optional, remove default button border
                            cursor: "pointer", // optional, pointer on hover
                            fontSize: "16px", // optional, adjust text size
                            padding: "5px 10px",
                            borderRadius:"5px" // optional, spacing
                        }}
                        onClick={() => {
                            navigate("/home");
                        }}
                    >
                        Back
                    </button>

                    <h1>Detailed Construction Material Calculator</h1>
                    <p>Calculate each construction component separately with precise individual inputs. Based on Indian IS codes and international standards.</p>
                </header>

                <div className="components-container">
                    <div className="component-item">RCC Slab</div>
                    <div className="component-item">Wall</div>
                    <div className="component-item">Plaster</div>
                    <div className="component-item">Tiles</div>
                    <div className="component-item">Steel</div>
                </div>

                <div className="divider-line"></div>

                <h2>RCC Slab Calculator</h2>

                <div className="calculator-form">
                    <table className="dimensions-table">
                        <thead>
                            <tr>
                                <th>Length</th>
                                <th>Width</th>
                                <th>Thickness</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><input
                                    type="text"
                                    placeholder="Enter length"
                                    value={length}
                                    onChange={(e) => setLength(e.target.value)}
                                /></td>
                                <td><input
                                    type="text"
                                    placeholder="Enter width"
                                    value={width}
                                    onChange={(e) => setWidth(e.target.value)}
                                /></td>
                                <td><input
                                    type="text"
                                    placeholder="Enter thickness"
                                    value={thickness}
                                    onChange={(e) => setThickness(e.target.value)}
                                /></td>
                            </tr>
                        </tbody>
                    </table>

                    <div className="options-container">
                        <div className="option-item">
                            <label>Unit</label>
                            <select value={unit} onChange={(e) => setUnit(e.target.value)}>
                                <option>Feet</option>
                                <option>Meter</option>
                                <option>Inch</option>
                            </select>
                        </div>
                        <div className="option-item">
                            <label>Concrete Grade</label>
                            <select value={grade} onChange={(e) => setGrade(e.target.value)}>
                                <option>M20</option>
                                <option>M25</option>
                                <option>M30</option>
                            </select>
                        </div>
                        <div className="option-item">
                            <label>Slab Type</label>
                            <select value={slabType} onChange={(e) => setSlabType(e.target.value)}>
                                <option>One Way Slab</option>
                                <option>Two Way Slab</option>
                            </select>
                        </div>
                    </div>

                    <div className="checkbox-container">
                        <input
                            type="checkbox"
                            id="steel-calculation"
                            checked={includeSteel}
                            onChange={(e) => setIncludeSteel(e.target.checked)}
                        />
                        <label htmlFor="steel-calculation">Include Steel Reinforcement Calculation</label>
                    </div>
                </div>

                <button className="calculate-button" onClick={calculateMaterials}>Calculate Slab Materials</button>

                {results && (
                    <div className="results-container">
                        <h2>Calculate Slab Materials</h2>

                        <div className="results-section">
                            <h3>Slab Details</h3>
                            <div className="result-grid">
                                <div className="result-item">
                                    <span className="result-label">Area:</span>
                                    <span className="result-value">{results.area} sq {unit.toLowerCase()}</span>
                                </div>
                                <div className="result-item">
                                    <span className="result-label">Volume:</span>
                                    <span className="result-value">{results.volume} cu {unit.toLowerCase()}</span>
                                </div>
                                <div className="result-item">
                                    <span className="result-label">Volume:</span>
                                    <span className="result-value">{results.volumeCum} m³</span>
                                </div>
                                <div className="result-item">
                                    <span className="result-label">Grade:</span>
                                    <span className="result-value">{results.grade}</span>
                                </div>
                            </div>
                        </div>

                        <div className="results-section">
                            <h3>Materials Required</h3>
                            <div className="result-grid">
                                <div className="result-item">
                                    <span className="result-label">Cement:</span>
                                    <span className="result-value">{results.cementBags} bags</span>
                                </div>
                                <div className="result-item">
                                    <span className="result-label">Sand:</span>
                                    <span className="result-value">{results.sand} cu {unit.toLowerCase()}</span>
                                </div>
                                <div className="result-item">
                                    <span className="result-label">Aggregate:</span>
                                    <span className="result-value">{results.aggregate} cu {unit.toLowerCase()}</span>
                                </div>
                                <div className="result-item">
                                    <span className="result-label">Water:</span>
                                    <span className="result-value">{results.water} liters</span>
                                </div>
                            </div>
                        </div>

                        {includeSteel && (
                            <div className="results-section">
                                <h3>Steel Reinforcement</h3>
                                <div className="result-grid">
                                    <div className="result-item">
                                        <span className="result-label">Main Bars:</span>
                                        <span className="result-value">29/{results.steel} kg</span>
                                    </div>
                                    <div className="result-item">
                                        <span className="result-label">Distribution Bars:</span>
                                        <span className="result-value">12/{results.steel} kg</span>
                                    </div>
                                    <div className="result-item">
                                        <span className="result-label">Total:</span>
                                        <span className="result-value">424/{results.steel} kg</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="divider-line"></div>

                        <div className="results-summary">
                            <h3>All Results Summary</h3>
                            <div className="summary-grid">
                                <div className="summary-item">
                                    <span className="summary-label">Area:</span>
                                    <span className="summary-value">{results.area} sq {unit.toLowerCase()}</span>
                                </div>
                                <div className="summary-item">
                                    <span className="summary-label">Cement:</span>
                                    <span className="summary-value">{results.cementBags} bags</span>
                                </div>
                                {includeSteel && (
                                    <div className="summary-item">
                                        <span className="summary-label">Steel:</span>
                                        <span className="summary-value">424/{results.steel} kg</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <button className="download-button">Download All Results</button>
                    </div>
                )}

                <div className="standards-container">
                    <h3>Standards & References</h3>
                    <ul>
                        <li>Concrete IS 4362/000, IS 10262/2019 (Concrete Mix Design)</li>
                    </ul>
                </div>
            </div>
            <Footer />

        </div>
    );
};

export default ConstructionCalculator;