import React, { useState } from "react";
import { useNavigate, Link } from 'react-router-dom'
import easy from "../assets/easy.png"

const Footer = () => {
    const naviagte = useNavigate()

    const [email, setEmail] = useState("");

    const handleSend = () => {
        if (email.trim()) {
            window.location.href = `mailto:${email.trim()}`;
        } else {
            alert("Please enter a valid email address");
        }
    };



    return (

        <footer className="footer">
            <div className="top-footer">
                <div className="container">
                    <div className="content-footer-top">
                        <div className="footer-logo">
                            <img src={easy} alt="logo-footer" width="174" height="44" />
                        </div>
                        <div className="wd-social">
                            <span>Follow Us:</span>
                            <ul className="list-social d-flex align-items-center">
                                <li><a href="#" className="box-icon w-40 social"><i className="icon icon-facebook"></i></a></li>
                                <li><a href="#" className="box-icon w-40 social"><i className="icon icon-linkedin"></i></a></li>
                                <li><a href="#" className="box-icon w-40 social">
                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <g clip-path="url(#clip0_748_6323)">
                                            <path d="M9.4893 6.77491L15.3176 0H13.9365L8.87577 5.88256L4.8338 0H0.171875L6.28412 8.89547L0.171875 16H1.55307L6.8973 9.78782L11.1659 16H15.8278L9.48896 6.77491H9.4893ZM7.59756 8.97384L6.97826 8.08805L2.05073 1.03974H4.17217L8.14874 6.72795L8.76804 7.61374L13.9371 15.0075H11.8157L7.59756 8.97418V8.97384Z" fill="white" />
                                        </g>
                                        <defs>
                                            <clipPath id="clip0_748_6323">
                                                <rect width="16" height="16" fill="white" />
                                            </clipPath>
                                        </defs>
                                    </svg>
                                </a></li>
                                <li><a href="#" className="box-icon w-40 social"><i className="icon icon-pinterest"></i></a></li>

                                <li><a href="#" className="box-icon w-40 social"><i className="icon icon-youtube"></i></a></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <div className="inner-footer">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-4 col-md-6">
                            <div className="footer-cl-1">

                                <p className="text-variant-2">Specializes in providing high-className tours for those in need. Contact Us</p>
                                <ul className="mt-12">
                                    <li className="mt-12 d-flex align-items-center gap-8">
                                        <i className="icon icon-mapPinLine fs-20 text-variant-2"></i>
                                        <p className="text-white">#22, Aiwan Shahi Road, Kalaburagi</p>
                                    </li>
                                    <li className="mt-12 d-flex align-items-center gap-8">
                                        <i className="icon icon-phone2 fs-20 text-variant-2"></i>
                                        <a href="tel:91-7411043895" className="text-white caption-1">+91-7411043895</a>
                                    </li>
                                    <li className="mt-12 d-flex align-items-center gap-8">
                                        <i className="icon icon-mail fs-20 text-variant-2"></i>
                                        <p className="text-white">info@eazy_acres.com</p>
                                    </li>
                                </ul>

                            </div>
                        </div>
                        <div className="col-lg-2 col-md-6 col-6">
                            <div className="footer-cl-2">
                                <div className="fw-7 text-white">Categories</div>
                                <ul className="mt-10 navigation-menu-footer">
                                    <li>
                                        <Link to="/aboutus" className="caption-1 text-variant-2">
                                            About Us
                                        </Link>
                                    </li>

                                    <li>
                                        <Link to="/contactus" className="caption-1 text-variant-2">
                                            Contact Us
                                        </Link>
                                    </li>

                                    <li>
                                        <Link to="/FAQ" className="caption-1 text-variant-2">
                                            FAQ
                                        </Link>
                                    </li>

                                    <li>
                                        <Link to="/Privacy-Policy" className="caption-1 text-variant-2">
                                            Privacy Policy
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="col-lg-2 col-md-4 col-6">
                            <div className="footer-cl-3">
                                <div className="fw-7 text-white">Our Company</div>
                                <ul className="mt-10 navigation-menu-footer">
                                    <li>
                                        <Link
                                            to="/listing?listingType=sale"
                                            className="caption-1 text-variant-2"
                                        >
                                            Property For Sale
                                        </Link>
                                    </li>

                                    <li>
                                        <Link
                                            to="/listing?listingType=rent"
                                            className="caption-1 text-variant-2"
                                        >
                                            Property For Rent
                                        </Link>
                                    </li>

                                    <li>
                                        <Link
                                            to="/listing?listingType=joint venture"
                                            className="caption-1 text-variant-2"
                                        >
                                         Joint venture
                                        </Link>
                                    </li>

                                    <li>
                                        <Link to="/blogs" className="caption-1 text-variant-2">
                                            Blogs
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="col-lg-4 col-md-6">
                            <div className="footer-cl-4">
                                <div className="fw-7 text-white">Newsletter</div>
                                <p className="mt-12 text-variant-2">
                                    Your Weekly/Monthly Dose of Knowledge and Inspiration
                                </p>
                                <form
                                    className="mt-12"
                                    id="subscribe-form"
                                    onSubmit={(e) => e.preventDefault()}
                                >
                                    <div
                                        id="subscribe-content"
                                        style={{ position: "relative", width: "100%" }}
                                    >
                                        {/* Mail icon inside input */}
                                        <span
                                            className="icon-left icon-mail"
                                            style={{
                                                position: "absolute",
                                                top: "50%",
                                                left: "12px",       // 👈 move left/right here
                                                transform: "translateY(-50%)",
                                                color: "#aaa",       // icon color
                                                pointerEvents: "none" // so clicks go to input
                                            }}
                                        ></span>

                                        <input
                                            type="email"
                                            name="email-form"
                                            id="subscribe-email"
                                            placeholder="Your email address"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            autoComplete="off"
                                            style={{

                                                color: "#fff",
                                                padding: "10px 12px 10px 40px", // 👈 extra left padding so text doesn't overlap icon
                                                borderRadius: "6px",
                                                outline: "none",
                                                width: "100%",


                                                WebkitTextFillColor: "#fff",
                                            }}
                                        />

                                        <button
                                            type="button"
                                            id="subscribe-button"
                                            onClick={handleSend}
                                            style={{
                                                position: "absolute",
                                                right: "10px",
                                                top: "50%",
                                                transform: "translateY(-50%)",
                                                background: "transparent",
                                                border: "none",
                                                color: "#fff",
                                                cursor: "pointer",
                                            }}
                                        >
                                            <i className="icon icon-send"></i>
                                        </button>
                                    </div>

                                    <div id="subscribe-msg"></div>
                                </form>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
            <div className="bottom-footer">
                <div className="container">
                    <div className="content-footer-bottom">
                        <div className="copyright">©2025 Eazy Acres. All Rights Reserved.</div>

                        <ul className="menu-bottom">
                            <li><a href="">Terms Of Services</a> </li>

                            <li><a href="">Privacy Policy</a> </li>
                            <li><a href="">Cookie Policy</a> </li>

                        </ul>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer
