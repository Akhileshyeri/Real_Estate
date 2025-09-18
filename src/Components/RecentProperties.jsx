
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect, use } from 'react';
import api from '../api/api';
import "./Myproperties.css"
import easy from "../assets/easy.png"
import toast from 'react-hot-toast';
import Arrow from '../assets/Arrow.png'



const RecentProperties = () => {
    const navigate = useNavigate();


    const [menuVisible, setMenuVisible] = useState(false);
    const [isMobileView, setIsMobileView] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [showDashboard, setShowDashboard] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [name, setName] = useState(localStorage.getItem("name"));
    const [avatar, setAvatar] = useState(localStorage.getItem("userProfile"));

    console.log(name);

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    const toggleMobileMenu = () => {
        setMenuVisible(prev => !prev);
    };

    const toggleDashboard = () => {
        setShowDashboard(prev => !prev);
    };

    const handleDropdownClick = (index) => {
        if (isMobileView || window.innerWidth <= 991) {
            setActiveDropdown(prev => (prev === index ? null : index));
        }
    };

    useEffect(() => {
        const handleResize = () => {
            setIsMobileView(window.innerWidth <= 991);
            if (window.innerWidth > 991) {
                setMenuVisible(false);
                setShowDashboard(false);
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        if (menuVisible) {
            document.body.classList.add('mobile-menu-visible');
        } else {
            document.body.classList.remove('mobile-menu-visible');
        }
    }, [menuVisible]);

    const menuItems = [
        {
            label: 'Home',
            className: 'home',
            onClick: () => navigate('/home')
        },

        {
            label: 'Properties',
            className: 'Properties',
            onClick: () => navigate('/listing')
        },
        {
            label: 'Pages',
            className: 'dropdown2',
            submenu: [
                { text: 'About Us', onClick: () => navigate('/aboutus') },
                { text: 'Contact Us', onClick: () => navigate('/contactus') },
                { text: 'FAQs', onClick: () => navigate('/FAQ') },
                { text: 'Privacy Policy', onClick: () => navigate('/Privacy-Policy') },
                { text: 'Blogs', onClick: () => navigate('/blogs') },
            ]
        },
        {
            label: 'Recent activity', className: 'dropdown3',
            submenu: [
                { text: 'My Profile', onClick: () => navigate('/myprofile') },
                { text: 'Dashboard', onClick: () => navigate('/dashboard') },
                { text: 'My Favorites', onClick: () => navigate('/myfavorites') },
                { text: 'My Properties', onClick: () => navigate('/myproperties') },

                // { text: 'Reviews', onClick: () => navigate('/reviews') },
            ]
        },

    ];
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownOpen && !event.target.closest('.box-avatar')) {
                setDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [dropdownOpen]);






    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);       // current page
    const [limit] = useState(5);              // items per page
    const [totalPages, setTotalPages] = useState(1);





    const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= totalPages) {
            setPage(newPage);
        }
    };




    const [stats, setStats] = useState({
        active_properties: 0,
        pending_properties: 0,
        total_favorites: 0,
        total_inquiries: 0,
        total_properties: 0,
    });
    const [recentProperties, setRecentProperties] = useState([]);
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");



    // With this useEffect:
    useEffect(() => {
        // Get Recent activity from localStorage
        const storedRecentProperties = localStorage.getItem("recentProperties");
        if (storedRecentProperties) {
            setRecentProperties(JSON.parse(storedRecentProperties));
        } else {
            setRecentProperties([]); // fallback if nothing in storage
        }

        // Optionally, you can still fetch dashboard stats if needed
        // dashboardList();
    }, []);




    // Filter button handler
    const handleFilter = () => {
        if (!fromDate || !toDate) {
            toast.error("Please select both From Date and To Date");
            return;
        }
        dashboardList(fromDate, toDate);
    };



    const [showModal, setShowModal] = useState(false);
    const [selectedInquiry, setSelectedInquiry] = useState([]);
    const [showReviewModal, setShowReviewModal] = useState(false);



    const [selectedReview, setSelectedReview] = useState([]);
    const [selectedPropertyTitle, setSelectedPropertyTitle] = useState("");




    const handleReviewClick = (reviews, propertyTitle) => {
        setSelectedReview(reviews);
        setSelectedPropertyTitle(propertyTitle); // store the property title
        setShowReviewModal(true);
    };



    const handleInquiryClick = (inquiries, propertyTitle) => {
        console.log("Inquiry Data:", inquiries);
        setSelectedPropertyTitle(propertyTitle); // ✅ Shows full inquiry data in console
        setSelectedInquiry(inquiries);
        setShowModal(true);
    };


    return (
        <div className={`body bg-surface ${menuVisible ? 'mobile-menu-visible' : ''}`}>
            <div id="wrapper">
                <div id="page" className="clearfix">
                    <div className={`layout-wrap ${showDashboard ? 'full-width' : ''}`}>
                        {/* <!-- header --> */}
                        <header className="main-header fixed-header header-dashboard">
                            {/* <!-- Header Lower --> */}
                            <div className="header-lower">
                                <div className="row">
                                    <div className="col-lg-12">
                                        <div className="inner-container d-flex justify-content-between align-items-center">
                                            {/* <!-- Logo Box --> */}
                                            <div className="logo-box d-flex">
                                                <div className="logo"><a href="" onClick={(e) => { e.preventDefault(); navigate('/home'); }}><img src={easy} alt="logo" width="174" height="44" /></a></div>
                                                <div className="button-show-hide" onClick={toggleDashboard}>
                                                    <span className="icon icon-categories"></span>
                                                </div>

                                            </div>
                                            <div className="nav-outer">
                                                {/* <!-- Main Menu --> */}
                                                <nav className="main-menu show navbar-expand-md">
                                                    <div className="navbar-collapse collapse clearfix" id="navbarSupportedContent">
                                                        <ul className="navigation clearfix" style={{ marginLeft: "228px" }}>
                                                            <li className="home ms-4">
                                                                <a href="" onClick={(e) => { e.preventDefault(); navigate('/home'); }}>Home</a>
                                                            </li>

                                                            <li className="Properties">
                                                                <a href="" onClick={(e) => { e.preventDefault(); navigate('/listing'); }}>Properties</a>
                                                            </li>
                                                            <li
                                                                className={`dropdown2 ${activeDropdown === 3 ? 'open' : ''}`}
                                                                onClick={(e) => {
                                                                    if (isMobileView || window.innerWidth <= 991) {
                                                                        e.preventDefault();
                                                                        handleDropdownClick(3);
                                                                    }
                                                                }}
                                                                onMouseEnter={() => {
                                                                    if (!isMobileView && window.innerWidth > 991) {
                                                                        setActiveDropdown(3);
                                                                    }
                                                                }}
                                                                onMouseLeave={() => {
                                                                    if (!isMobileView && window.innerWidth > 991) {
                                                                        setActiveDropdown(null);
                                                                    }
                                                                }}
                                                            >
                                                                <a href="" onClick={(e) => e.preventDefault()}>Pages</a>
                                                                <ul style={{ display: activeDropdown === 3 ? 'block' : 'none' }}>
                                                                    <li><a href="aboutus" onClick={(e) => { e.preventDefault(); navigate('/aboutus'); }}>About Us</a></li>
                                                                    <li><a href="contactus" onClick={(e) => { e.preventDefault(); navigate('/contactus'); }}>Contact Us</a></li>
                                                                    <li><a href="faq" onClick={(e) => { e.preventDefault(); navigate('/FAQ'); }}>FAQs</a></li>
                                                                    <li><a href="" onClick={(e) => { e.preventDefault(); navigate('/Privacy-Policy'); }}>Privacy Policy</a></li>
                                                                </ul>
                                                            </li>
                                                            {/* <li className="myprofile">
                                                                <a href="" onClick={(e) => { e.preventDefault(); navigate('/myprofile'); }}>My profile</a>
                                                            </li> */}
                                                        </ul>
                                                    </div>
                                                </nav>
                                            </div>
                                            <div className="header-account">
                                                <div
                                                    className={`box-avatar dropdown-toggle ${dropdownOpen ? 'show' : ''}`}
                                                    onClick={toggleDropdown}
                                                    style={{ position: 'relative' }}
                                                >
                                                    <div className="avatar avt-40 round">
                                                        {/* <img src="https://cdn-icons-png.flaticon.com/512/10307/10307911.png" alt="avt" /> */}
                                                        <img src={avatar || "fallback.png"} alt="avt" />

                                                    </div>
                                                    <p className="name" style={{ cursor: "pointer" }}> {name}<span className="icon icon-arr-down"></span></p>
                                                    <div
                                                        className={`dropdown-menu ${dropdownOpen ? 'show' : ''}`}
                                                        style={{
                                                            position: "absolute",
                                                            top: "100%",
                                                            right: 0,
                                                            zIndex: 1000,
                                                            marginTop: "0.5rem",
                                                            display: dropdownOpen ? "block" : "none",
                                                            background: "#fff",
                                                            border: "1px solid #ddd",
                                                            borderRadius: "6px",
                                                            boxShadow: "0px 4px 12px rgba(0,0,0,0.1)",
                                                            minWidth: "180px",
                                                        }}
                                                    >
                                                        <a className="dropdown-item" onClick={() => navigate('/myprofile')}>My Profile</a>
                                                        <a className="dropdown-item" onClick={() => navigate("/dashboard")}>
                                                            Dashboard
                                                        </a>
                                                        <a className="dropdown-item" onClick={() => navigate('/myproperties')}>My Properties</a>

                                                        <a className="dropdown-item" onClick={() => navigate('/myfavorites')}>My Favorites</a>
                                                        {/* <a className="dropdown-item" onClick={() => navigate('/reviews')}>Reviews</a> */}

                                                        <a className="dropdown-item" onClick={(e) => {
                                                            e.preventDefault();
                                                            localStorage.removeItem("authToken");
                                                            localStorage.removeItem("addPropertyForm"); // clear token
                                                            localStorage.removeItem("email"); // clear token
                                                            localStorage.removeItem("hasSeenPopup"); // clear token
                                                            localStorage.removeItem("hasSeenSticky"); // clear token
                                                            localStorage.removeItem("mobile"); // clear token
                                                            localStorage.removeItem("name"); // clear token
                                                            localStorage.removeItem("photo"); // clear token
                                                            localStorage.removeItem("userEmail"); // clear token
                                                            localStorage.removeItem("userMobile"); // clear token
                                                            localStorage.removeItem("userName"); // clear token
                                                            localStorage.removeItem("userProfile"); // clear token
                                                            localStorage.removeItem("usertype");// clear token
                                                            navigate("/home"); // redirect after logout
                                                            window.location.reload(); // reload so header updates
                                                        }}>Logout</a>

                                                    </div>
                                                </div>
                                                <div className="button-mobi-sell">
                                                    <a className="tf-btn primary" onClick={(e) => {
                                                        e.preventDefault();
                                                        // Navigate to add property if logged in
                                                        navigate("/addproperty");
                                                    }}>Add Property</a>




                                                </div>
                                            </div>

                                            <div className="mobile-nav-toggler mobile-button" onClick={toggleMobileMenu}><span></span></div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* <!-- Mobile Menu  --> */}
                            <div className="close-btn" onClick={toggleMobileMenu}><span className="icon flaticon-cancel-1"></span></div>
                            <div className="mobile-menu" style={{ display: menuVisible ? 'block' : 'none' }}>
                                <div className="menu-backdrop" onClick={toggleMobileMenu}></div>
                                <nav className="menu-box">
                                    <div className="nav-logo">
                                        <a href="" onClick={(e) => { e.preventDefault(); navigate('/home'); toggleMobileMenu(); }}>
                                            <img src={easy} alt="nav-logo" width="174" height="44" />
                                        </a>
                                    </div>
                                    <div className="bottom-canvas">
                                        <div className="menu-outer">
                                            <div className="navbar-collapse collapse clearfix" id="navbarSupportedContent">
                                                <ul className="navigation clearfix">
                                                    {menuItems.map((item, index) => (
                                                        <li
                                                            key={index}
                                                            className={`${item.className} ${activeDropdown === index ? 'open' : ''}`}
                                                            onClick={() => {
                                                                if (item.submenu) {
                                                                    handleDropdownClick(index);
                                                                } else if (item.onClick) {
                                                                    item.onClick();
                                                                    toggleMobileMenu();
                                                                }
                                                            }}
                                                        >
                                                            <a href="" onClick={(e) => e.preventDefault()}
                                                                style={{
                                                                    display: "flex",
                                                                    alignItems: "center",
                                                                    justifyContent: "space-between", // 👈 pushes text left, icon right
                                                                    width: "100%"
                                                                }}>
                                                                {item.label}
                                                                {item.submenu && (
                                                                    <img
                                                                        src={Arrow}
                                                                        alt="dropdown"
                                                                        style={{
                                                                            width: "14px",
                                                                            height: "14px",
                                                                            marginRight: "15px",
                                                                            transition: "transform 0.3s",
                                                                            transform: activeDropdown === index ? "rotate(180deg)" : "rotate(0deg)"
                                                                        }}
                                                                    />
                                                                )}
                                                            </a>
                                                            {item.submenu && (
                                                                <ul style={{ display: activeDropdown === index ? "block" : "none" }}>
                                                                    {item.submenu.map((sub, i) => (
                                                                        <li key={i}>
                                                                            <a
                                                                                href=""
                                                                                onClick={(e) => {
                                                                                    e.preventDefault();
                                                                                    if (sub.onClick) {
                                                                                        sub.onClick();
                                                                                        toggleMobileMenu();
                                                                                    }
                                                                                }}
                                                                            >
                                                                                {sub.text}
                                                                            </a>
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            )}
                                                        </li>
                                                    ))}
                                                </ul>

                                            </div>
                                        </div>
                                        <div className="button-mobi-sell">
                                            <a className="tf-btn primary" style={{ marginBottom: "1rem" }} onClick={(e) => {
                                                e.preventDefault();
                                                // Navigate to add property if logged in
                                                navigate("/addproperty");
                                            }}>Add Property</a>


                                            <a
                                                className="tf-btn primary"
                                                href=""
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    localStorage.removeItem("authToken");
                                                    localStorage.removeItem("addPropertyForm"); // clear token
                                                    localStorage.removeItem("email"); // clear token
                                                    localStorage.removeItem("hasSeenPopup"); // clear token
                                                    localStorage.removeItem("hasSeenSticky"); // clear token
                                                    localStorage.removeItem("mobile"); // clear token
                                                    localStorage.removeItem("name"); // clear token
                                                    localStorage.removeItem("photo"); // clear token
                                                    localStorage.removeItem("userEmail"); // clear token
                                                    localStorage.removeItem("userMobile"); // clear token
                                                    localStorage.removeItem("userName"); // clear token
                                                    localStorage.removeItem("userProfile"); // clear token
                                                    localStorage.removeItem("usertype");// clear token
                                                    navigate("/home"); // redirect after logout
                                                    window.location.reload(); // reload so header updates
                                                }}
                                            >
                                                <span className="icon icon-sign-out"></span> Logout
                                            </a>


                                        </div>
                                        <div className="mobi-icon-box">
                                            <div className="box d-flex align-items-center">
                                                <span className="icon icon-phone2"></span>
                                                <div>91-7411043895</div>
                                            </div>
                                            <div className="box d-flex align-items-center">
                                                <span className="icon icon-mail"></span>
                                                <div>themesflat@gmail.com</div>
                                            </div>
                                        </div>
                                    </div>
                                </nav>
                            </div>
                        </header>

                        <div className={`sidebar-menu-dashboard ${showDashboard ? 'show' : ''}`}>
                            <ul className="box-menu-dashboard">
                                <li className="nav-menu-item">
                                    <a className="nav-menu-link" href="" onClick={(e) => { e.preventDefault(); navigate('/dashboard'); }}>
                                        <span className="icon icon-dashboard"></span> Dashboard
                                    </a>
                                </li>
                                <li className="nav-menu-item">
                                    <a className="nav-menu-link" href="" onClick={(e) => { e.preventDefault(); navigate('/myproperties'); }}>
                                        <span className="icon icon-list-dashes"></span> My Properties
                                    </a>
                                </li>
                                <li className="nav-menu-item">
                                    <a className="nav-menu-link" href="" onClick={(e) => { e.preventDefault(); navigate('/myfavorites'); }}>
                                        <span className="icon icon-heart"></span> My Favorites
                                    </a>
                                </li>
                                <li className="nav-menu-item">
                                    <a className="nav-menu-link" href="" onClick={(e) => { e.preventDefault(); navigate('/recent'); }}>
                                        <i class="fa-solid fa-clock-rotate-left" style={{ color: "#a3abb0" }}></i>  Recent activity
                                    </a>
                                </li>
                                {/* <li className="nav-menu-item">
                                    <a className="nav-menu-link" href="" onClick={(e) => { e.preventDefault(); navigate('/reviews'); }}>
                                        <span className="icon icon-review"></span> Reviews
                                    </a>
                                </li> */}

                                <li className="nav-menu-item">
                                    <a
                                        className="nav-menu-link"
                                        href=""
                                        onClick={(e) => {
                                            e.preventDefault();
                                            localStorage.removeItem("authToken");
                                            localStorage.removeItem("addPropertyForm"); // clear token
                                            localStorage.removeItem("email"); // clear token
                                            localStorage.removeItem("hasSeenPopup"); // clear token
                                            localStorage.removeItem("hasSeenSticky"); // clear token
                                            localStorage.removeItem("mobile"); // clear token
                                            localStorage.removeItem("name"); // clear token
                                            localStorage.removeItem("photo"); // clear token
                                            localStorage.removeItem("userEmail"); // clear token
                                            localStorage.removeItem("userMobile"); // clear token
                                            localStorage.removeItem("userName"); // clear token
                                            localStorage.removeItem("userProfile"); // clear token
                                            localStorage.removeItem("usertype");
                                            navigate("/home"); // redirect after logout
                                            window.location.reload(); // reload so header updates
                                        }}
                                    >
                                        <span className="icon icon-sign-out"></span> Logout
                                    </a>
                                </li>





                            </ul>
                        </div>

                        <div className="main-content">
                            <div className="main-content-inner wrap-dashboard-content-2">
                                {/* <div className="button-show-hide show-mb" onClick={toggleDashboard}>
                                    <span className="body-1">Show Dashboard</span>
                                </div> */}


                                <div className="widget-box-2 wd-listing mt-3">
                                    <h6 className="title">Recent Activity</h6>
                                    <div className="wrap-table">
                                        <div className="table-responsive">
                                            <table>
                                                <thead>
                                                    <tr>
                                                        <th>Listing Title</th>
                                                        <th>Action</th>
                                                    </tr>
                                                </thead>

                                                <tbody>
                                                    {recentProperties.length > 0 ? (
                                                        recentProperties.map((property) => (
                                                            <tr key={property.id}>
                                                                <td>
                                                                    <div
                                                                        className="listing-box"
                                                                        style={{ cursor: "pointer" }}
                                                                        onClick={() => navigate(`/property/${property.id}`)}
                                                                    >
                                                                        <div className="images">
                                                                            <img
                                                                                src={
                                                                                    property.image
                                                                                        ? `${api.imageUrl}${property.image}`
                                                                                        : "https://themesflat.co/html/homzen/images/home/house-1.jpg"
                                                                                }
                                                                                alt={property.name}
                                                                            />
                                                                        </div>

                                                                        <div className="content">
                                                                            {/* Title + Status */}
                                                                            <div className="content">
                                                                                {/* Title */}
                                                                                <div className="title">{property.name}</div>

                                                                                {/* Listing Badge */}
                                                                                <div className="listing-type">
                                                                                    <span
                                                                                        className={` ${property.for === "sale" ? "success" : "style-1"}`}
                                                                                    >
                                                                                        <span className="fw-6">Listing Type:</span>{" "}
                                                                                        {property.for.charAt(0).toUpperCase() + property.for.slice(1)}
                                                                                    </span>
                                                                                </div>

                                                                            </div>

                                                                            {/* Location */}
                                                                            <div className="" >
                                                                                <span className="fw-6">Location:</span>{" "}
                                                                                {property.location || "N/A"}
                                                                            </div>

                                                                            {/* Price */}
                                                                            <div className="text-1 fw-7">
                                                                                <span className="fw-6">Price:</span>{" "}
                                                                                ₹{Number(property.priceValue).toLocaleString()}{" "}
                                                                                {property.priceUnit}
                                                                            </div>

                                                                            {/* Type */}
                                                                            <div className="listing-type">
                                                                                <span className="fw-6">Type:</span> {property.subType}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </td>

                                                                <td>
                                                                    <ul className="list-action">
                                                                        <li style={{ display: "flex", justifyContent: "center" }}>
                                                                            <button
                                                                                type="button"
                                                                                className="remove-file item flex items-center gap-1"
                                                                                onClick={() => navigate(`/property/${property.id}`)}
                                                                                style={{
                                                                                    backgroundColor: "#ed2027",
                                                                                    color: "#fff", // makes text white
                                                                                    padding: "8px 16px",
                                                                                    border: "none",
                                                                                    borderRadius: "6px",
                                                                                    cursor: "pointer",
                                                                                    fontSize: "14px",
                                                                                    fontWeight: 600,
                                                                                    transition: "all 0.3s ease",
                                                                                    display: "flex",
                                                                                    alignItems: "center",
                                                                                    gap: "6px",
                                                                                }}
                                                                                onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#c91a21")}
                                                                                onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#ed2027")}
                                                                            >
                                                                                <i className="fi fi-rs-eye" style={{ color: "#fff", marginTop: "5px" }}></i> View
                                                                            </button>
                                                                        </li>


                                                                    </ul>
                                                                </td>
                                                            </tr>
                                                        ))
                                                    ) : (
                                                        <tr>
                                                            <td colSpan={2} className="text-center">
                                                                No Recent Activity found.
                                                            </td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>


                            </div>
                            <div className="footer-dashboard">
                                <p className="text-variant-2">©2025 Eazy_Acres. All Rights Reserved.</p>
                            </div>

                            <div className="overlay-dashboard"></div>


                        </div>

                        {/* {showModal && (
                            <div className="modal-overlay">
                                <div className="modal-box">
                                    <h3>Inquiry Details</h3>

                                    {selectedInquiry && selectedInquiry.length > 0 ? (
                                        <ul>
                                            {selectedInquiry.map((inq) => (
                                                <li key={inq.id} className="inquiry-item">
                                                    <p><strong>Name:</strong> {inq.name}</p>
                                                    <p><strong>Email:</strong> {inq.email}</p>
                                                    <p><strong>Phone:</strong> {inq.phone}</p>
                                                    <p><strong>Message:</strong> {inq.message}</p>
                                                    <p><strong>Status:</strong> {inq.status}</p>
                                                    <p><strong>Date:</strong> {inq.created_at?.split(" ")[0] || "N/A"}</p>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p>No inquiries found for this property.</p>
                                    )}

                                    <div className="modal-actions">
                                        <button className="btn cancel-btn" onClick={() => setShowModal(false)}>
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )} */}









                        {showModal && (
                            <div className="modal-overlay">
                                <div className="modal-box">

                                    {/* Heading + View All button in one line */}
                                    <div
                                        style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                            marginBottom: "20px",
                                            marginTop: "10px"
                                        }}
                                    >
                                        <h3 style={{ margin: 0 }}>Inquiry Details</h3>
                                        <button
                                            className="view-btn"
                                            onClick={() => navigate(`/inquiries/${selectedInquiry[0]?.property_id}`)}
                                        >
                                            View All <i className="fa-solid fa-eye" style={{ marginLeft: "8px" }}></i>
                                        </button>


                                    </div>

                                    <span>
                                        <small>Property name :</small>{" "}
                                        <b>{selectedPropertyTitle || "Property"}</b>
                                    </span>

                                    {selectedInquiry && selectedInquiry.length > 0 ? (
                                        <div className="inquiry-table-wrapper">
                                            <table className="inquiry-details-table">
                                                <thead>
                                                    <tr>
                                                        <th>Name</th>
                                                        <th>Email</th>
                                                        <th>Phone</th>
                                                        <th>Message</th>
                                                        <th>Status</th>
                                                        <th>Date</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {selectedInquiry.slice(0, 5).map((inq) => (
                                                        <tr key={inq.id}>
                                                            <td>{inq.name}</td>
                                                            <td>{inq.email}</td>
                                                            <td>{inq.phone}</td>
                                                            <td
                                                                style={{
                                                                    whiteSpace: "pre-wrap",
                                                                    wordBreak: "break-word",
                                                                    maxWidth: "300px",
                                                                }}
                                                            >
                                                                {inq.message}
                                                            </td>
                                                            <td>{inq.status}</td>
                                                            <td>
                                                                {inq.created_at
                                                                    ? inq.created_at.split(" ")[0].split("-").reverse().join("-")
                                                                    : "N/A"}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    ) : (
                                        <div className="no-inquiries">
                                            <p>No inquiries found for this property.</p>
                                        </div>
                                    )}

                                    <div className="modal-actions">
                                        <button
                                            className="btn cancel-btn"
                                            onClick={() => setShowModal(false)}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}


                        {showReviewModal && (
                            <div className="modal-overlay">
                                <div className="modal-box">

                                    {/* Header */}
                                    <div
                                        style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                            marginBottom: "20px",
                                            marginTop: "10px"
                                        }}
                                    >
                                        <h3 style={{ margin: 0 }}>Reviews</h3>
                                        <button
                                            className="view-btn"
                                            onClick={() =>
                                                navigate(`/reviewlist/${selectedReview[0]?.property_id}`)
                                            }
                                        >
                                            View All <i className="fa-solid fa-eye" style={{ marginLeft: "8px" }}></i>
                                        </button>
                                    </div>

                                    <span>
                                        <small>Property name :</small>{" "}
                                        <b>{selectedPropertyTitle || "Property"}</b>
                                    </span>

                                    {selectedReview && selectedReview.length > 0 ? (
                                        <div className="inquiry-table-wrapper" style={{ marginTop: "10px" }}>
                                            <table className="inquiry-details-table">
                                                <thead>
                                                    <tr>
                                                        <th>User Name</th>
                                                        <th>Message</th>
                                                        <th>Star</th>
                                                        <th>User Type</th>
                                                        <th>Date</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {selectedReview.slice(0, 5).map((rev) => (
                                                        <tr key={rev.id}>
                                                            <td>{rev.user_name || rev.username}</td>
                                                            <td
                                                                style={{
                                                                    whiteSpace: "pre-wrap",
                                                                    wordBreak: "break-word",
                                                                    maxWidth: "300px",
                                                                }}
                                                            >
                                                                {rev.message}
                                                            </td>
                                                            <td>
                                                                {[...Array(5)].map((_, i) => (
                                                                    <span
                                                                        key={i}
                                                                        style={{ color: i < Number(rev.star) ? "#f5c518" : "#ccc" }}
                                                                    >
                                                                        ★
                                                                    </span>
                                                                ))}
                                                            </td>
                                                            <td>{rev.userType}</td>
                                                            <td>
                                                                {rev.created_at
                                                                    ? rev.created_at.split(" ")[0].split("-").reverse().join("-")
                                                                    : "N/A"}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    ) : (
                                        <div className="no-inquiries">
                                            <p>No reviews found for this property.</p>
                                        </div>
                                    )}

                                    <div className="modal-actions">
                                        <button
                                            className="btn cancel-btn"
                                            onClick={() => setShowReviewModal(false)}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}



                    </div>
                </div>
            </div>
        </div>
    )
}

export default RecentProperties
