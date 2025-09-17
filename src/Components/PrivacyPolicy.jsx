import React, { useState } from 'react';
import Header from './Header';
import Footer from './Footer';
import { Link } from 'react-router-dom';

const PrivacyPolicy = () => {
    const [activeTab, setActiveTab] = useState('limitations'); // default active tab

    const handleTabClick = (tabId) => {
        setActiveTab(tabId);
    };

    return (
        <div>
            <Header />
            <section className="flat-title-page style-2">
                <div className="container">
                    <ul className="breadcrumb">
                        <li><Link to="/home">Home</Link></li>
                        <li>/ Pages</li>
                        <li>/ Privacy Policy</li>
                    </ul>
                    <h2 className="text-center">Privacy Policy</h2>
                </div>
            </section>

            <section className="flat-section">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-5">
                            <ul className="nav-tab-privacy" role="tablist">
                                <li className="nav-tab-item" role="presentation">
                                    <button
                                        className={`nav-link-item ${activeTab === 'terms' ? 'active' : ''}`}
                                        onClick={() => handleTabClick('terms')}
                                        style={{ border: 'none' }}
                                    >
                                        1. Terms
                                    </button>

                                </li>
                                <li className="nav-tab-item" role="presentation">
                                    <button
                                        className={`nav-link-item ${activeTab === 'limitations' ? 'active' : ''}`}
                                        onClick={() => handleTabClick('limitations')}
                                        style={{ border: 'none' }}
                                    >
                                        2. Limitations
                                    </button>
                                </li>
                                <li className="nav-tab-item" role="presentation">
                                    <button
                                        className={`nav-link-item ${activeTab === 'revisions' ? 'active' : ''}`}
                                        onClick={() => handleTabClick('revisions')}
                                        style={{ border: 'none' }}
                                    >
                                        3. Revisions and errata
                                    </button>
                                </li>
                                <li className="nav-tab-item" role="presentation">
                                    <button
                                        className={`nav-link-item ${activeTab === 'modifications' ? 'active' : ''}`}
                                        onClick={() => handleTabClick('modifications')}
                                        style={{ border: 'none', textAlign: 'left' }}
                                    >
                                        4. Site terms of use modifications
                                    </button>
                                </li>
                                <li className="nav-tab-item" role="presentation">
                                    <button
                                        className={`nav-link-item ${activeTab === 'risks' ? 'active' : ''}`}
                                        onClick={() => handleTabClick('risks')}
                                        style={{ border: 'none' }}
                                    >
                                        5. Risks
                                    </button>
                                </li>
                            </ul>
                        </div>

                        <div className="col-lg-7">
                            <h5 className="text-capitalize title">Terms of use</h5>
                            <div className="tab-content content-box-privacy">
                                <div className={`tab-pane fade ${activeTab === 'terms' ? 'active show' : ''}`} id="terms" role="tabpanel">
                                    <h6>1. Terms</h6>
                                    <p>When purchasing real estate, the buyer agrees to follow all legal procedures and pay the agreed-upon price either in full or through a loan. Ownership will be transferred only after registration with the local authorities.</p>
                                    <p>All buyers must verify that the property has a clear title and no pending legal disputes. It is important to check land approvals, zoning permissions, and any encumbrances before finalizing the transaction. Properties should meet local safety and building standards.</p>
                                    <p>Investors should also be aware of additional costs such as stamp duty, registration fees, maintenance charges, and property taxes. It is recommended to consult a licensed real estate agent or legal advisor to ensure a smooth and secure transaction.</p>
                                </div>
                                <div className={`tab-pane fade ${activeTab === 'limitations' ? 'active show' : ''}`} id="limitations" role="tabpanel">
                                    <h6>2. Limitations</h6>
                                    <p>While investing in real estate can be profitable, there are certain limitations buyers and investors should be aware of. Market fluctuations, legal disputes, and delays in approvals can affect property value and usability.</p>
                                    <ul className="box-list">
                                        <li>Property resale may take time, depending on location, demand, and market conditions.</li>
                                        <li>Unexpected costs like maintenance, property taxes, or repair expenses can arise.</li>
                                        <li>Legal restrictions or zoning laws may limit how the property can be used or modified.</li>
                                    </ul>
                                    <p>It is important to conduct thorough due diligence, including verifying ownership, checking approvals, and understanding local real estate regulations before making any purchase or investment.</p>
                                </div>

                                <div className={`tab-pane fade ${activeTab === 'revisions' ? 'active show' : ''}`} id="revisions" role="tabpanel">
                                    <h6>3. Revisions and Errata</h6>
                                    <p>All real estate documents, listings, and agreements are subject to updates and corrections. Information about property availability, pricing, or legal status may change over time, and buyers should verify details before making decisions.</p>
                                    <p>Property descriptions, floor plans, or images provided in brochures or online listings may not always reflect the current condition. Buyers are encouraged to conduct site visits and inspections to confirm the property’s features and condition.</p>
                                    <p>Any discrepancies or errors found in property documentation, advertisements, or legal papers should be reported immediately to the seller or real estate agent. It is essential to ensure all contracts are accurate before signing or making payments.</p>

                                </div>
                                <div className={`tab-pane fade ${activeTab === 'modifications' ? 'active show' : ''}`} id="modifications" role="tabpanel">
                                    <h6>4. Site Terms of Use Modifications</h6>
                                    <p>The real estate platform may update its terms of use, property listings, and content at any time. Users are responsible for reviewing these changes regularly to stay informed about current rules and policies.</p>
                                    <ul className="box-list">
                                        <li>Property availability, prices, or descriptions may change without prior notice. Always verify details before making decisions.</li>
                                        <li>The platform reserves the right to modify, remove, or update listings and content to maintain accuracy and compliance with local laws.</li>
                                        <li>Users must agree to the updated terms to continue using the site, including browsing, contacting sellers, or making inquiries.</li>
                                    </ul>
                                    <p>It is recommended that buyers and investors regularly check for updates on property information and site policies to ensure informed and secure real estate transactions.</p>
                                </div>
                                <div className={`tab-pane fade ${activeTab === 'risks' ? 'active show' : ''}`} id="risks" role="tabpanel">
                                    <h6>5. Risks</h6>
                                    <p>Investing in real estate involves certain risks that buyers and investors should consider. Market fluctuations, changes in property value, or unexpected expenses can impact the overall return on investment.</p>
                                    <p>Legal and regulatory risks may arise if property documents are not properly verified. Issues such as unclear titles, zoning restrictions, or pending legal disputes can delay or prevent property transactions.</p>
                                    <p>Other risks include maintenance costs, property damage, or delays in project completion. It is important to conduct thorough due diligence, consult legal and real estate experts, and carefully evaluate each property before making a purchase or investment.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* <div className="progress-wrap">
                <svg className="progress-circle svg-content" width="100%" height="100%" viewBox="-1 -1 102 102">
                    <path d="M50,1 a49,49 0 0,1 0,98 a49,49 0 0,1 0,-98" style={{ transition: 'stroke-dashoffset 10ms linear 0s', strokeDasharray: '307.919, 307.919', strokeDashoffset: '286.138' }}></path>
                </svg>
            </div> */}
            <Footer />
        </div>
    );
}

export default PrivacyPolicy;
