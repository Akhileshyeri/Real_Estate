import React, { useState } from 'react'
import Footer from './Footer'
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css'
import Header from './Header';
import { Link } from 'react-router-dom';


const AboutUs = () => {
    const [name, setName] = useState(localStorage.getItem("name"));
    const [mobile, setMobile] = useState(localStorage.getItem("mobile"));
    const [email, setEmail] = useState(localStorage.getItem("email"));
    return (
        <div>
            
            <Header />
            <section className="flat-title-page style-2">
                <div className="container">
                    <ul className="breadcrumb">
                        <li><Link to="/home">Home</Link></li>
                        <li>/ Pages</li>
                        <li>/ About Us</li>
                    </ul>
                    <h2 className="text-center">About The Eazy Acres</h2>
                </div>
            </section>
            {/* <!-- End Page Title --> */}

            {/* <!-- banner video --> */}
            <section className="flat-section flat-banner-about">
                <div className="container">
                    <div className="row">
                        <div className="col-md-5">
                            <h3>Welcome To The <br /> Eazy Acres</h3>
                        </div>
                        <div className="col-md-7 hover-btn-view">
                            <p className="body-2 text-variant-1">Welcome to Eazy Acres, where we turn houses into homes and dreams into reality. At Eazy Acres, we understand that a home is more than just a physical space; it's a place where memories are created, families grow, and life unfolds. </p>

                        </div>

                    </div>
                    <div className="banner-video">
                        <img src="images/banner/img-video.jpg" alt="img-video" />
                        <a href="https://youtu.be/MLpWrANjFbI" data-fancybox="gallery2" className="btn-video"> <span className="icon icon-play"></span></a>
                    </div>
                </div>
            </section>
            {/* <!-- end banner video -->
            <!-- Service --> */}
            <section className="flat-section-v3 flat-service-v2 bg-surface">
                <div className="container">
                    <div className="row wrap-service-v2">
                        <div className="col-lg-6">
                            <div className="box-left">
                                <div className="box-title">
                                    <div className="text-subtitle text-primary">Why Choose Us</div>
                                    <h4 className="mt-4">Discover What Sets Our Real Estate Expertise Apart</h4>
                                </div>
                                <p>At Eazy Acres, our unwavering commitment lies in crafting unparalleled real estate journeys. Our seasoned professionals, armed with extensive market knowledge, walk alongside you through every phase of your property endeavor. We prioritize understanding your unique aspirations, tailoring our expertise to match your vision.</p>
                                <ul className="list-view">
                                    <li>
                                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M8 15.9947C12.4183 15.9947 16 12.4154 16 8C16 3.58462 12.4183 0.00524902 8 0.00524902C3.58172 0.00524902 0 3.58462 0 8C0 12.4154 3.58172 15.9947 8 15.9947Z" fill="#198754" />
                                            <path d="M7.35849 12.2525L3.57599 9.30575L4.65149 7.9255L6.97424 9.735L10.8077 4.20325L12.2462 5.19975L7.35849 12.2525Z" fill="white" />
                                        </svg>
                                        Transparent Partnerships
                                    </li>
                                    <li>
                                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M8 15.9947C12.4183 15.9947 16 12.4154 16 8C16 3.58462 12.4183 0.00524902 8 0.00524902C3.58172 0.00524902 0 3.58462 0 8C0 12.4154 3.58172 15.9947 8 15.9947Z" fill="#198754" />
                                            <path d="M7.35849 12.2525L3.57599 9.30575L4.65149 7.9255L6.97424 9.735L10.8077 4.20325L12.2462 5.19975L7.35849 12.2525Z" fill="white" />
                                        </svg>
                                        Proven Expertise
                                    </li>
                                    <li>
                                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M8 15.9947C12.4183 15.9947 16 12.4154 16 8C16 3.58462 12.4183 0.00524902 8 0.00524902C3.58172 0.00524902 0 3.58462 0 8C0 12.4154 3.58172 15.9947 8 15.9947Z" fill="#198754" />
                                            <path d="M7.35849 12.2525L3.57599 9.30575L4.65149 7.9255L6.97424 9.735L10.8077 4.20325L12.2462 5.19975L7.35849 12.2525Z" fill="white" />
                                        </svg>
                                        Customized Solutions
                                    </li>
                                    <li>
                                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M8 15.9947C12.4183 15.9947 16 12.4154 16 8C16 3.58462 12.4183 0.00524902 8 0.00524902C3.58172 0.00524902 0 3.58462 0 8C0 12.4154 3.58172 15.9947 8 15.9947Z" fill="#198754" />
                                            <path d="M7.35849 12.2525L3.57599 9.30575L4.65149 7.9255L6.97424 9.735L10.8077 4.20325L12.2462 5.19975L7.35849 12.2525Z" fill="white" />
                                        </svg>
                                        Local Area Knowledge
                                    </li>
                                </ul>
                            </div>

                        </div>
                        <div className="col-lg-6">
                            <div className="box-right">
                                <div className="box-service style-1 hover-btn-view">
                                    <div className="icon-box">
                                        <span className="icon icon-buy-home"></span>
                                    </div>
                                    <div className="content">
                                        <h6 className="title">Buy A New Home</h6>
                                        <p className="description">Explore diverse properties and expert guidance for a seamless buying experience.</p>
                                    </div>
                                </div>
                                <div className="box-service style-1 hover-btn-view">
                                    <div className="icon-box">
                                        <span className="icon icon-rent-home"></span>
                                    </div>
                                    <div className="content">
                                        <h6 className="title">Rent a home</h6>
                                        <p className="description">Explore a diverse variety of listings tailored precisely to suit your unique lifestyle needs.</p>
                                    </div>
                                </div>
                                <div className="box-service style-1 hover-btn-view">
                                    <div className="icon-box">
                                        <span className="icon icon-sale-home"></span>
                                    </div>
                                    <div className="content">
                                        <h6 className="title">Sell a home</h6>
                                        <p className="description">Showcasing your property's best features for a successful sale.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {/* <!-- End Service -->
            <!-- Testimonial --> */}
            <section className="flat-section flat-testimonial-v4">
                <div className="container">
                    <div className="box-title text-center">
                        <div className="text-subtitle text-primary">Our Testimonials</div>
                        <h4 className="mt-4">What’s people say’s</h4>
                    </div>
                    <div className="swiper tf-sw-testimonial" data-preview-lg="2" data-preview-md="2" data-preview-sm="2" data-space="30">
                        <div className="swiper-wrapper">
                            <div className="swiper-slide">
                                <div className="box-tes-item style-2">
                                    <ul className="list-star">
                                        <li className="icon icon-star"></li>
                                        <li className="icon icon-star"></li>
                                        <li className="icon icon-star"></li>
                                        <li className="icon icon-star"></li>
                                        <li className="icon icon-star"></li>
                                    </ul>
                                    <p className="note body-1">
                                        "I truly appreciate the professionalism and in-depth knowledge of the brokerage team. They not only helped me find the perfect home but also assisted with legal and financial aspects, making me feel confident and secure in my decision."
                                    </p>
                                    <div className="box-avt d-flex align-items-center gap-12">
                                        <div className="avatar avt-60 round">
                                            <img src="images/avatar/avt-7.jpg" alt="avatar" />
                                        </div>
                                        <div className="info">
                                            <div className="h7 fw-7">Chetan</div>
                                            <p className="text-variant-1 mt-4">CEO Digital</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="swiper-slide">
                                <div className="box-tes-item style-2">
                                    <ul className="list-star">
                                        <li className="icon icon-star"></li>
                                        <li className="icon icon-star"></li>
                                        <li className="icon icon-star"></li>
                                        <li className="icon icon-star"></li>
                                        <li className="icon icon-star"></li>
                                    </ul>
                                    <p className="note body-1">
                                        "My experience with property management services has exceeded expectations. They efficiently manage properties with a professional and attentive approach in every situation. I feel reassured that any issue will be resolved promptly and effectively."
                                    </p>
                                    <div className="box-avt d-flex align-items-center gap-12">
                                        <div className="avatar avt-60 round">
                                            <img src="images/avatar/avt-5.jpg" alt="avatar" />
                                        </div>
                                        <div className="info">
                                            <div className="h7 fw-7">Adam Will</div>
                                            <p className="text-variant-1 mt-4">CEO Agency</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="swiper-slide">
                                <div className="box-tes-item style-2">
                                    <ul className="list-star">
                                        <li className="icon icon-star"></li>
                                        <li className="icon icon-star"></li>
                                        <li className="icon icon-star"></li>
                                        <li className="icon icon-star"></li>
                                        <li className="icon icon-star"></li>
                                    </ul>
                                    <p className="note body-1">
                                        "My experience with property management services has exceeded expectations. They efficiently manage properties with a professional and attentive approach in every situation. I feel reassured that any issue will be resolved promptly and effectively."
                                    </p>
                                    <div className="box-avt d-flex align-items-center gap-12">
                                        <div className="avatar avt-60 round">
                                            <img src="images/avatar/avt-5.jpg" alt="avatar" />
                                        </div>
                                        <div className="info">
                                            <div className="h7 fw-7">Adam Will</div>
                                            <p className="text-variant-1 mt-4">CEO Agency</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="swiper-slide">
                                <div className="box-tes-item style-2">
                                    <ul className="list-star">
                                        <li className="icon icon-star"></li>
                                        <li className="icon icon-star"></li>
                                        <li className="icon icon-star"></li>
                                        <li className="icon icon-star"></li>
                                        <li className="icon icon-star"></li>
                                    </ul>
                                    <p className="note body-1">
                                        "I truly appreciate the professionalism and in-depth knowledge of the brokerage team. They not only helped me find the perfect home but also assisted with legal and financial aspects, making me feel confident and secure in my decision."
                                    </p>
                                    <div className="box-avt d-flex align-items-center gap-12">
                                        <div className="avatar avt-60 round">
                                            <img src="images/avatar/avt-7.jpg" alt="avatar" />
                                        </div>
                                        <div className="info">
                                            <div className="h7 fw-7">Liam Anderson</div>
                                            <p className="text-variant-1 mt-4">CEO Digital</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                        <div className="sw-pagination sw-pagination-testimonial"></div>

                    </div>
                 
                </div>
            </section>
            {/* <!-- End Testimonial -->
            <!-- Contact --> */}
            <section className="flat-section-v3 flat-slider-contact">
                <div className="container">
                    <div className="row content-wrap">
                        <div className="col-lg-7">
                            <div className="content-left">
                                <div className="box-title">
                                    <div className="text-subtitle text-white">Contact Us</div>
                                    <h4 className="mt-4 fw-6 text-white">We're always eager to hear from you!</h4>
                                </div>
                                <p className="body-2 text-white">
                                    Whether you're searching for your dream home, an investment
                                    property, or want to list your property for sale or rent — our
                                    expert real estate team is always ready to guide you.
                                    <br /> Get personalized advice, market insights, and property
                                    assistance tailored to your needs.
                                </p>                            </div>

                        </div>
                        <div className="col-lg-5">
                            <form action="#" className="box-contact-v2">
                                <div className="box">
                                    <label for="name" className="label">Name:</label>
                                    <input type="text" className="form-control" value={name} />
                                </div>
                                <div className="box">
                                    <label for="email" className="label">Email:</label>
                                    <input type="text" className="form-control" value={email} />
                                </div>
                                <div className="box">
                                    <label for="message" className="label">Message:</label>
                                    <textarea name="message" className="form-control" cols="30" rows="10" placeholder="Write comment"></textarea>
                                </div>
                                <div className="box">
                                    <button className="tf-btn primary">Contact US</button>
                                </div>
                            </form>
                        </div>
                    </div>

                </div>
                <div className="overlay"></div>

            </section>
            {/* <!-- End Contact -->
            <!-- Agents --> */}
            {/* <section className="flat-section flat-agents">
                <div className="container">
                    <div className="box-title text-center">
                        <div className="text-subtitle text-primary">Our Teams</div>
                        <h4 className="mt-4">Meet Our Agents</h4>
                    </div>
                    <div className="row">

                        <div className="box col-lg-4 col-sm-6">
                            <div className="box-agent style-1 hover-img">
                                <div className="box-img img-style">
                                    <img src="images/agents/agent-lg-1.jpg" alt="image-agent" />
                                    <ul className="agent-social">
                                        <li><a href="#" className="icon icon-facebook"></a></li>
                                        <li><a href="#" className="icon icon-linkedin"></a></li>
                                        <li><a href="#" className="icon icon-twitter"></a></li>
                                        <li><a href="#" className="icon icon-instagram"></a></li>
                                    </ul>
                                </div>
                                <a href="#" className="content">
                                    <div className="info">
                                        <h6 className="link">Rohit Sharma</h6>
                                        <p className="mt-4 text-variant-1">CEO & Founder</p>
                                    </div>
                                    <span className="icon-phone"></span>
                                </a>
                            </div>
                        </div>

                        <div className="box col-lg-4 col-sm-6">
                            <div className="box-agent style-1 hover-img">
                                <div className="box-img img-style">
                                    <img src="images/agents/agent-lg-2.jpg" alt="image-agent" />
                                    <ul className="agent-social">
                                        <li><a href="#" className="icon icon-facebook"></a></li>
                                        <li><a href="#" className="icon icon-linkedin"></a></li>
                                        <li><a href="#" className="icon icon-twitter"></a></li>
                                        <li><a href="#" className="icon icon-instagram"></a></li>
                                    </ul>
                                </div>
                                <a href="#" className="content">
                                    <div className="info">
                                        <h6 className="link">Priya Singh</h6>
                                        <p className="mt-4 text-variant-1">Property Manager</p>
                                    </div>
                                    <span className="icon-phone"></span>
                                </a>
                            </div>
                        </div>

                        <div className="box col-lg-4 col-sm-6">
                            <div className="box-agent style-1 hover-img">
                                <div className="box-img img-style">
                                    <img src="images/agents/agent-lg-3.jpg" alt="image-agent" />
                                    <ul className="agent-social">
                                        <li><a href="#" className="icon icon-facebook"></a></li>
                                        <li><a href="#" className="icon icon-linkedin"></a></li>
                                        <li><a href="#" className="icon icon-twitter"></a></li>
                                        <li><a href="#" className="icon icon-instagram"></a></li>
                                    </ul>
                                </div>
                                <a href="#" className="content">
                                    <div className="info">
                                        <h6 className="link">Amit Verma</h6>
                                        <p className="mt-4 text-variant-1">Administrative Staff</p>
                                    </div>
                                    <span className="icon-phone"></span>
                                </a>
                            </div>
                        </div>

                    </div>
                </div>
            </section> */}

            {/* <!-- End Agents -->
            <!-- banner --> */}
            <section className="flat-section pt-0 flat-banner">
                <div className="container">
                    <div className="wrap-banner bg-surface">
                        <div className="box-left">
                            <div className="box-title">
                                <div className="text-subtitle text-primary">Become Partners</div>
                                <h4 className="mt-4">List your Properties on Eazy Acres, join Us Now!</h4>
                            </div>
                            <a href="#" className="tf-btn primary size-1">Become A Hosting</a>
                        </div>
                        <div className="box-right">
                            <img src="images/banner/banner.png" alt="image" />
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
    )
}

export default AboutUs
