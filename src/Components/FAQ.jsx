import React, { useState } from 'react';
import Footer from './Footer';
import Header from './Header';
import { Link } from 'react-router-dom';

const FAQ = () => {
  const [activeAccordion, setActiveAccordion] = useState({
    'accordion-faq-two': true // Set second item as open by default
  });

  const toggleAccordion = (id) => {
    setActiveAccordion(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <div>
      <Header />
      <section className="flat-title-page style-2">
        <div className="container">
          <ul className="breadcrumb">
            <li><Link to="/home">Home</Link></li>
            <li>/ Pages</li>
            <li>/ Frequently Asked Questions</li>
          </ul>
          <h2 className="text-center">FAQs</h2>
        </div>
      </section>

      <section className="flat-section">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              {/* Overview Section */}
              <div className="tf-faq">
                <h5>Overview</h5>
                <ul className="box-faq" id="wrapper-faq">
                  <li className="faq-item">
                    <div 
                      className={`faq-header ${activeAccordion['accordion-faq-one'] ? '' : 'collapsed'}`}
                      onClick={() => toggleAccordion('accordion-faq-one')}
                      aria-expanded={activeAccordion['accordion-faq-one']}
                    >
                      Why should I use your services?
                      <span className="icon-toggle"></span>
                    </div>
                    <div 
                      id="accordion-faq-one" 
                      className={`collapse ${activeAccordion['accordion-faq-one'] ? 'show' : ''}`}
                    >
                      <p className="faq-body">
                        Our services provide comprehensive solutions tailored to your needs with industry-leading reliability and customer support.
                      </p>
                    </div>
                  </li>
                  
                  <li className="faq-item">
                    <div 
                      className={`faq-header ${activeAccordion['accordion-faq-two'] ? '' : 'collapsed'}`}
                      onClick={() => toggleAccordion('accordion-faq-two')}
                      aria-expanded={activeAccordion['accordion-faq-two']}
                    >
                      How do I get started with your services?
                      <span className="icon-toggle"></span>
                    </div>
                    <div 
                      id="accordion-faq-two" 
                      className={`collapse ${activeAccordion['accordion-faq-two'] ? 'show' : ''}`}
                    >
                      <p className="faq-body">
                        Simply create an account, complete your profile, and you'll be ready to access all our features within minutes.
                      </p>
                    </div>
                  </li>

                  <li className="faq-item">
                    <div 
                      className={`faq-header ${activeAccordion['accordion-faq-three'] ? '' : 'collapsed'}`}
                      onClick={() => toggleAccordion('accordion-faq-three')}
                      aria-expanded={activeAccordion['accordion-faq-three']}
                    >
                      How secure are your services?
                      <span className="icon-toggle"></span>
                    </div>
                    <div 
                      id="accordion-faq-three" 
                      className={`collapse ${activeAccordion['accordion-faq-three'] ? 'show' : ''}`}
                    >
                      <p className="faq-body">
                        We use bank-grade 256-bit encryption, two-factor authentication, and regular security audits to protect your data.
                      </p>
                    </div>
                  </li>

                  <li className="faq-item">
                    <div 
                      className={`faq-header ${activeAccordion['accordion-faq-four'] ? '' : 'collapsed'}`}
                      onClick={() => toggleAccordion('accordion-faq-four')}
                      aria-expanded={activeAccordion['accordion-faq-four']}
                    >
                      Is there customer support available?
                      <span className="icon-toggle"></span>
                    </div>
                    <div 
                      id="accordion-faq-four" 
                      className={`collapse ${activeAccordion['accordion-faq-four'] ? 'show' : ''}`}
                    >
                      <p className="faq-body">
                        Yes, we offer 24/7 customer support via live chat, email, and phone with an average response time under 15 minutes.
                      </p>
                    </div>
                  </li>

                  <li className="faq-item">
                    <div 
                      className={`faq-header ${activeAccordion['accordion-faq-five'] ? '' : 'collapsed'}`}
                      onClick={() => toggleAccordion('accordion-faq-five')}
                      aria-expanded={activeAccordion['accordion-faq-five']}
                    >
                      How can I update my account information?
                      <span className="icon-toggle"></span>
                    </div>
                    <div 
                      id="accordion-faq-five" 
                      className={`collapse ${activeAccordion['accordion-faq-five'] ? 'show' : ''}`}
                    >
                      <p className="faq-body">
                        You can update your account details anytime in the 'My Profile' section of your dashboard.
                      </p>
                    </div>
                  </li>
                </ul>
              </div>

              {/* Costs and Payments Section */}
              <div className="tf-faq">
                <h5>Costs and Payments</h5>
                <ul className="box-faq" id="wrapper-faq-two">
                  <li className="faq-item">
                    <div 
                      className={`faq-header ${activeAccordion['accordion2-faq-one'] ? '' : 'collapsed'}`}
                      onClick={() => toggleAccordion('accordion2-faq-one')}
                      aria-expanded={activeAccordion['accordion2-faq-one']}
                    >
                      How do you calculate fees?
                      <span className="icon-toggle"></span>
                    </div>
                    <div 
                      id="accordion2-faq-one" 
                      className={`collapse ${activeAccordion['accordion2-faq-one'] ? 'show' : ''}`}
                    >
                      <p className="faq-body">
                        Fees are calculated based on your usage tier, with volume discounts available for high-volume customers.
                      </p>
                    </div>
                  </li>

                  <li className="faq-item">
                    <div 
                      className={`faq-header ${activeAccordion['accordion2-faq-two'] ? '' : 'collapsed'}`}
                      onClick={() => toggleAccordion('accordion2-faq-two')}
                      aria-expanded={activeAccordion['accordion2-faq-two']}
                    >
                      How do I pay my invoices?
                      <span className="icon-toggle"></span>
                    </div>
                    <div 
                      id="accordion2-faq-two" 
                      className={`collapse ${activeAccordion['accordion2-faq-two'] ? 'show' : ''}`}
                    >
                      <p className="faq-body">
                        We accept all major credit cards, bank transfers, PayPal, and cryptocurrency payments.
                      </p>
                    </div>
                  </li>

                  <li className="faq-item">
                    <div 
                      className={`faq-header ${activeAccordion['accordion2-faq-three'] ? '' : 'collapsed'}`}
                      onClick={() => toggleAccordion('accordion2-faq-three')}
                      aria-expanded={activeAccordion['accordion2-faq-three']}
                    >
                      Are there opportunities for discounts or promotions?
                      <span className="icon-toggle"></span>
                    </div>
                    <div 
                      id="accordion2-faq-three" 
                      className={`collapse ${activeAccordion['accordion2-faq-three'] ? 'show' : ''}`}
                    >
                      <p className="faq-body">
                        Yes, we offer seasonal promotions, referral bonuses, and discounts for annual prepayments.
                      </p>
                    </div>
                  </li>

                  <li className="faq-item">
                    <div 
                      className={`faq-header ${activeAccordion['accordion2-faq-four'] ? '' : 'collapsed'}`}
                      onClick={() => toggleAccordion('accordion2-faq-four')}
                      aria-expanded={activeAccordion['accordion2-faq-four']}
                    >
                      Are there any hidden fees not displayed in the pricing table?
                      <span className="icon-toggle"></span>
                    </div>
                    <div 
                      id="accordion2-faq-four" 
                      className={`collapse ${activeAccordion['accordion2-faq-four'] ? 'show' : ''}`}
                    >
                      <p className="faq-body">
                        No, we believe in transparent pricing. All fees are clearly displayed before you commit.
                      </p>
                    </div>
                  </li>

                  <li className="faq-item">
                   
                 
                  </li>
                </ul>
              </div>

              {/* Safety and Security Section */}
              <div className="tf-faq">
                <h5>Safety and Security</h5>
                <ul className="box-faq" id="wrapper-faq-three">
                  <li className="faq-item">
                    <div 
                      className={`faq-header ${activeAccordion['accordion3-faq-one'] ? '' : 'collapsed'}`}
                      onClick={() => toggleAccordion('accordion3-faq-one')}
                      aria-expanded={activeAccordion['accordion3-faq-one']}
                    >
                      What languages does your service support?
                      <span className="icon-toggle"></span>
                    </div>
                    <div 
                      id="accordion3-faq-one" 
                      className={`collapse ${activeAccordion['accordion3-faq-one'] ? 'show' : ''}`}
                    >
                      <p className="faq-body">
                        Our platform is available in English, with more languages coming soon.
                      </p>
                    </div>
                  </li>

                  <li className="faq-item">
                    <div 
                      className={`faq-header ${activeAccordion['accordion3-faq-two'] ? '' : 'collapsed'}`}
                      onClick={() => toggleAccordion('accordion3-faq-two')}
                      aria-expanded={activeAccordion['accordion3-faq-two']}
                    >
                      How do I integrate your service into my system?
                      <span className="icon-toggle"></span>
                    </div>
                    <div 
                      id="accordion3-faq-two" 
                      className={`collapse ${activeAccordion['accordion3-faq-two'] ? 'show' : ''}`}
                    >
                      <p className="faq-body">
                        We provide comprehensive API documentation and SDKs for all major platforms.
                      </p>
                    </div>
                  </li>

                  <li className="faq-item">
                    <div 
                      className={`faq-header ${activeAccordion['accordion3-faq-three'] ? '' : 'collapsed'}`}
                      onClick={() => toggleAccordion('accordion3-faq-three')}
                      aria-expanded={activeAccordion['accordion3-faq-three']}
                    >
                      What are the safety features of your system?
                      <span className="icon-toggle"></span>
                    </div>
                    <div 
                      id="accordion3-faq-three" 
                      className={`collapse ${activeAccordion['accordion3-faq-three'] ? 'show' : ''}`}
                    >
                      <p className="faq-body">
                        Our system features include end-to-end encryption, regular penetration testing, and SOC 2 Type II compliance.
                      </p>
                    </div>
                  </li>

                  <li className="faq-item">
                    <div 
                      className={`faq-header ${activeAccordion['accordion3-faq-four'] ? '' : 'collapsed'}`}
                      onClick={() => toggleAccordion('accordion3-faq-four')}
                      aria-expanded={activeAccordion['accordion3-faq-four']}
                    >
                      How can I request new features?
                      <span className="icon-toggle"></span>
                    </div>
                    <div 
                      id="accordion3-faq-four" 
                      className={`collapse ${activeAccordion['accordion3-faq-four'] ? 'show' : ''}`}
                    >
                      <p className="faq-body">
                        You can submit feature requests through our customer portal, and we prioritize based on user demand.
                      </p>
                    </div>
                  </li>

                  <li className="faq-item">
                    <div 
                      className={`faq-header ${activeAccordion['accordion3-faq-five'] ? '' : 'collapsed'}`}
                      onClick={() => toggleAccordion('accordion3-faq-five')}
                      aria-expanded={activeAccordion['accordion3-faq-five']}
                    >
                      Is my data protected?
                      <span className="icon-toggle"></span>
                    </div>
                    <div 
                      id="accordion3-faq-five" 
                      className={`collapse ${activeAccordion['accordion3-faq-five'] ? 'show' : ''}`}
                    >
                      <p className="faq-body">
                        Yes, we adhere to GDPR and CCPA regulations, and never share your data with third parties without consent.
                      </p>
                    </div>
                  </li>
                </ul>
              </div>

              {/* Additional FAQ Sections */}
              <div className="tf-faq">
                <h5>Technical Requirements</h5>
                <ul className="box-faq" id="wrapper-faq-four">
                  <li className="faq-item">
                    <div 
                      className={`faq-header ${activeAccordion['accordion4-faq-one'] ? '' : 'collapsed'}`}
                      onClick={() => toggleAccordion('accordion4-faq-one')}
                      aria-expanded={activeAccordion['accordion4-faq-one']}
                    >
                      What browsers do you support?
                      <span className="icon-toggle"></span>
                    </div>
                    <div 
                      id="accordion4-faq-one" 
                      className={`collapse ${activeAccordion['accordion4-faq-one'] ? 'show' : ''}`}
                    >
                      <p className="faq-body">
                        We support Chrome, Firefox, Safari, Edge, and Opera on their latest versions.
                      </p>
                    </div>
                  </li>

                 
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="progress-wrap">
        <svg className="progress-circle svg-content" width="100%" height="100%" viewBox="-1 -1 102 102">
          <path d="M50,1 a49,49 0 0,1 0,98 a49,49 0 0,1 0,-98" style={{ transition: 'stroke-dashoffset 10ms linear 0s', strokeDasharray: '307.919, 307.919', strokeDashoffset: '286.138' }}></path>
        </svg>
      </div>
      <Footer />
    </div>
  );
};

export default FAQ;