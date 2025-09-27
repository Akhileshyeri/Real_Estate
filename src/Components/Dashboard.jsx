
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import api from '../api/api';
import "./Dashboard.css"
import easy from "../assets/easy.png"
import toast from 'react-hot-toast';
import download from '/src/assets/download.png'
import List from '/src/assets/list.png'
import clock from '/src/assets/wall-clock.png'
import home from '/src/assets/home.png'
import Message from '/src/assets/comment.png'
import Save from '/src/assets/save.png'
import Star from '/src/assets/star.png'
import Arrow from '../assets/Arrow.png'
import Edit from '../assets/edit.png'
import Delete from '../assets/delete.png';
import { encryptId } from "../utils/crypto";
import { slugify } from "../utils/slugify";




const Dashboard = () => {
    const navigate = useNavigate();
    const [menuVisible, setMenuVisible] = useState(false);
    const [isMobileView, setIsMobileView] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [showDashboard, setShowDashboard] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [avatar, setAvatar] = useState(localStorage.getItem("userProfile"));
    const [isDeleting, setIsDeleting] = useState();





    const [name, setName] = useState(localStorage.getItem("name"));
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
            label: 'Dashboard', className: 'dropdown3',
            submenu: [
                { text: ' My Profile', onClick: () => navigate('/myprofile') },
                { text: 'My Favorites', onClick: () => navigate('/myfavorites') },
                { text: 'My Properties', onClick: () => navigate('/myproperties') },
                { text: 'Recent activity', onClick: () => navigate('/recent') },
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

    const myPropertyList = async (pageNum = 1) => {
        const fd = new FormData();
        fd.append("programType", "myPropertyDetails");
        fd.append("authToken", localStorage.getItem("authToken"));
        fd.append("page", pageNum);
        fd.append("limit", limit);

        try {
            setLoading(true);
            const response = await api.post("/properties/property", fd);
            if (response.data.success) {
                setProperties(response.data.data["My Property"]); // <-- important!
                setTotalPages(Math.ceil(response.data.data.length / limit)); // optional
            }
        } catch (error) {
            console.error("Property fetch error:", error);
        } finally {
            setLoading(false);
        }
    };

    const remove = async (id) => {

        console.log("removing")
        const fd = new FormData();
        fd.append("programType", "removeFavorites");
        fd.append("authToken", localStorage.getItem("authToken"));
        fd.append("favoriteId", id)
        console.log(id)

        try {

            const response = await api.post("/properties/property", fd);
            console.log(response)
            if (response.data.success) {
                setProperties([])
                myPropertyList()
            }
        } catch (error) {
            console.error("Property fetch error:", error);
        }
    };
    useEffect(() => {
        myPropertyList(page);
    }, [page]);






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


    const dashboardList = async (from = "", to = "") => {
        const fd = new FormData();
        fd.append("programType", "userProfileDashboard");
        fd.append("authToken", localStorage.getItem("authToken"));

        if (from && to) {
            fd.append("fromDate", from);
            fd.append("toDate", to);
        }

        try {
            setLoading(true);
            const response = await api.post("/properties/property", fd);
            console.log("dashboard list ", response);

            if (response.data?.data?.dashboard_stats) {
                setStats(response.data.data.dashboard_stats);
            }
            if (response.data?.data?.recent_properties) {
                setRecentProperties(response.data.data.recent_properties);
            }
        } catch (error) {
            console.error("Dashboard fetch error:", error);
        } finally {
            setLoading(false);
        }
    };

    // Filter button handler
    const handleFilter = () => {
        if (!fromDate || !toDate) {
            toast.error("Please select both From Date and To Date");
            return;
        }
        dashboardList(fromDate, toDate);
    };

    useEffect(() => {
        dashboardList();
    }, []);






    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [propertyToDelete, setPropertyToDelete] = useState(null);


    const deleteproperty = async (id) => {
        const fd = new FormData();
        fd.append("programType", "deletePropertyFromCustomer");
        fd.append("authToken", localStorage.getItem("authToken"));
        fd.append("propertyId", id);

        try {
            const response = await api.post("properties/property", fd);
            console.log("deleted", response);

            if (response.data.success) {
                // ✅ Immediately update local state so UI hides deleted property
                setProperties((prev) => prev.filter((p) => p.id !== id));

                toast.success("Property deleted successfully ✅");
            } else {
                toast.error("Failed to delete property ❌");
            }
        } catch (error) {
            console.error("Delete fetch error:", error);
            toast.error("Something went wrong!");
        }
    };



    // ================= Status Mapping =================
    const getStatusText = (status) => {
        if (status === 0) return "Pending";
        if (status === 1) return "Approved";
        if (status === 2) return "Rejected";
        return "Unknown";
    };

    const getStatusClass = (status) => {
        if (status === 0) return "btn-status pending";
        if (status === 1) return "btn-status approved";
        if (status === 2) return "btn-status rejected";
        return "btn-status";
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
                                                    <div className="navbar-collapse collapse clearfix" id="navbarSupportedContent" >
                                                        <ul className="navigation clearfix ss" style={{ marginLeft: "180px" }}>
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
                                                                    <li><a href="" onClick={(e) => { e.preventDefault(); navigate('/blogs'); }}>Blogs</a></li>
                                                                </ul>
                                                            </li>
                                                            {/* <li className="my profile">
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
                                                    <p className="name" style={{ cursor: "pointer" }}>{name}<span className="icon icon-arr-down"></span></p>
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
                                                        <a className="dropdown-item" onClick={() => navigate('/myproperties')}>My Properties</a>
                                                        <a className="dropdown-item" onClick={() => navigate('/myfavorites')}>My Favorites</a>
                                                        <a className="dropdown-item" onClick={() => navigate('/recent')}>Recent activity</a>

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
                                                            localStorage.removeItem("usertype");
                                                            navigate("/home"); // redirect after logout
                                                            window.location.reload(); // reload so header updates
                                                        }}>Logout</a>

                                                    </div>
                                                </div>
                                                <div className="flat-bt-top">
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
                                            <div className="navbar-collapse collapse clearfix" id="navbarSupportedContent" style={{ marginRight: "50px" }}>

                                                <ul className="navigation clearfix bb">
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
                                        <i class="fa-solid fa-clock-rotate-left" style={{ color: "#a3abb0" }}></i> Recent activity
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
                                            localStorage.removeItem("usertype");// clear token
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

                            <div className="main-content-inner">
                                <h6 className="title">Property</h6>
                                {/* <div className="button-show-hide show-mb">
                                    <span className="body-1">Show Dashboard</span>
                                </div> */}
                                <div className="flat-counter-v2 tf-counter">




                                    {/* Active Properties */}
                                    <div className="counter-box">
                                        <div className="box-icon w-68 round">
                                            <img
                                                src={List}
                                                alt="avatar"
                                                style={{ width: "30px", height: "30px", objectFit: "contain" }}
                                            />

                                        </div>
                                        <div className="content-box">
                                            <div className="title-count">Active </div>
                                            <h6 className="number">{stats.active_properties}</h6>
                                        </div>
                                    </div>

                                    {/* Pending Properties */}
                                    <div className="counter-box">
                                        <div className="box-icon w-68 round">
                                            <img
                                                src={clock}
                                                alt="avatar"
                                                style={{ width: "30px", height: "30px", objectFit: "contain" }}
                                            />
                                        </div>
                                        <div className="content-box">
                                            <div className="title-count">Pending </div>
                                            <h6 className="number">{stats.pending_properties}</h6>
                                        </div>
                                    </div>

                                    {/* Total Properties */}
                                    <div className="counter-box">
                                        <div className="box-icon w-68 round">
                                            <img
                                                src={home}
                                                alt="avatar"
                                                style={{ width: "30px", height: "30px", objectFit: "contain" }}
                                            />
                                        </div>
                                        <div className="content-box">
                                            <div className="title-count">Total </div>
                                            <h6 className="number">{stats.total_properties}</h6>
                                        </div>
                                    </div>


                                    {/* Total Inquiries */}
                                    <div className="counter-box" onClick={() => navigate("/inquiries")} style={{ cursor: "pointer" }}>
                                        <div className="box-icon w-68 round">
                                            <img
                                                src={Message}
                                                alt="avatar"
                                                style={{ width: "60px", height: "40px", objectFit: "contain" }}
                                            />
                                        </div>
                                        <div className="content-box">
                                            <div className="title-count">Total Inquiries</div>
                                            <h6 className="number">{stats.total_inquiries}</h6>
                                        </div>
                                    </div>


                                    {/* Total Favorites */}
                                    <div className="counter-box">
                                        <div className="box-icon w-68 round">

                                            <img
                                                src={Save}
                                                alt="avatar"
                                                style={{ width: "30px", height: "28px", objectFit: "contain" }}
                                            />
                                        </div>
                                        <div className="content-box">
                                            <div className="title-count">Total Favorites</div>
                                            <h6 className="number">{stats.total_favorites}</h6>
                                        </div>
                                    </div>


                                    <div className="counter-box">
                                        <div className="box-icon w-68 round">
                                            <img
                                                src={Star}
                                                alt="avatar"
                                                style={{ width: "80px", height: "45px", objectFit: "contain" }}
                                            />
                                        </div>
                                        <div className="content-box" onClick={() => navigate("/reviewlist")} style={{ cursor: "pointer" }}>
                                            <div className="title-count">Total Reviews</div>
                                            <h6 className="number"></h6>
                                        </div>
                                    </div>



                                </div>
                                <div className="wrapper-content row">
                                    <div className="col-xl-9">
                                        <div className="widget-box-2 wd-listing" style={{ marginBottom: "-0px" }}>
                                            <div className="wd-filter">

                                                {/* From Date */}
                                                <div style={{ position: "relative" }}>
                                                    <label
                                                        htmlFor="datepicker1"
                                                        style={{
                                                            position: "absolute",
                                                            top: "-10px",
                                                            left: "5px",
                                                            fontSize: "12px",
                                                            fontWeight: "500",

                                                            background: "#fff",
                                                            padding: "0 4px"
                                                        }}
                                                    >
                                                        From
                                                    </label>
                                                    <input
                                                        type="date"
                                                        id="datepicker1"
                                                        className="ip-datepicker icon"
                                                        placeholder="From Date"
                                                        value={fromDate}
                                                        onChange={(e) => setFromDate(e.target.value)}
                                                    />
                                                </div>

                                                {/* To Date */}
                                                <div style={{ position: "relative" }}>
                                                    <label
                                                        htmlFor="datepicker2"
                                                        style={{
                                                            position: "absolute",
                                                            top: "-10px",
                                                            left: "5px",
                                                            fontSize: "12px",
                                                            fontWeight: "500",

                                                            background: "#fff",
                                                            padding: "0 4px"
                                                        }}
                                                    >
                                                        To
                                                    </label>
                                                    <input
                                                        type="date"
                                                        id="datepicker2"
                                                        className="ip-datepicker icon"
                                                        placeholder="To Date"
                                                        value={toDate}
                                                        onChange={(e) => setToDate(e.target.value)}
                                                    />
                                                </div>

                                                {/* Filter Button */}
                                                <button
                                                    type="button"
                                                    className="tf-btn primary flex items-center gap-2"
                                                    onClick={handleFilter}
                                                >
                                                    <img
                                                        src="/edit.png"
                                                        alt="Edit Icon"
                                                        style={{ width: "20px", height: "25px", marginRight: "10px" }}
                                                    />
                                                    Filter
                                                </button>
                                            </div>

                                            <div className="wrap-table">
                                                <div className="table-responsive">

                                                    <table>
                                                        <thead>
                                                            <tr>
                                                                <th>Listing</th>
                                                                <th>Status</th>
                                                                <th>Action</th>
                                                            </tr>
                                                        </thead>



                                                        <tbody>
                                                            {loading ? (
                                                                Array.from({ length: 5 }).map((_, idx) => (
                                                                    <tr key={idx} className="file-delete" style={{ minHeight: "100px" }}>
                                                                        <td>
                                                                            <div className="listing-box">
                                                                                <div className="images skeleton-box" style={{ width: "120px", height: "80px", borderRadius: "8px" }}></div>
                                                                                <div>
                                                                                    <div className="skeleton-box" style={{ width: "150px", height: "18px", marginBottom: "6px" }}></div>
                                                                                </div>
                                                                                <div>
                                                                                    <div className="skeleton-box" style={{ width: "150px", height: "18px", marginBottom: "6px" }}></div>
                                                                                </div>
                                                                                <div className="content">
                                                                                    <div className="skeleton-line" style={{ width: "70%", height: "16px", marginBottom: "8px" }}></div>
                                                                                    <div className="skeleton-line" style={{ width: "50%", height: "14px", marginBottom: "8px" }}></div>
                                                                                    <div className="skeleton-line" style={{ width: "40%", height: "14px", marginBottom: "8px" }}></div>
                                                                                    <div className="skeleton-line" style={{ width: "30%", height: "14px" }}></div>
                                                                                </div>
                                                                            </div>
                                                                        </td>
                                                                        <td>
                                                                            <div className="status-wrap">
                                                                                <div className="skeleton-line" style={{ width: "80px", height: "24px", borderRadius: "12px" }}></div>
                                                                            </div>
                                                                        </td>
                                                                        <td>
                                                                            <ul className="list-action">
                                                                                <li>
                                                                                    <div className="skeleton-line" style={{ width: "50px", height: "16px", borderRadius: "6px" }}></div>
                                                                                </li>
                                                                            </ul>
                                                                        </td>
                                                                    </tr>
                                                                ))
                                                            ) : recentProperties.length > 0 ? (
                                                                recentProperties.map((property) => {
                                                                    // Status handling
                                                                    let statusLabel = "Pending";
                                                                    if (property.property_status === 1) statusLabel = "Approved";
                                                                    else if (property.property_status === 2) statusLabel = "Rejected";

                                                                    // Image handling
                                                                    const defaultImg =
                                                                        "https://themesflat.co/html/homzen/images/home/house-1.jpg";
                                                                    const imageUrl = property.propertyImage
                                                                        ? `${api.imageUrl}${property.propertyImage}`
                                                                        : defaultImg;

                                                                    return (
                                                                        <tr key={property.id} className="file-delete">
                                                                            <td>
                                                                                <div
                                                                                    className="listing-box"
                                                                                    style={{ cursor: "pointer" }}



                                                                                    onClick={() => {
                                                                                        const encryptedId = encryptId(property.id);
                                                                                        const slug = slugify(property.title);
                                                                                        navigate(`/property/${encryptedId}&slug=${slug}`);
                                                                                    }}

                                                                                >
                                                                                    <div className="images">
                                                                                        <img
                                                                                            src={imageUrl}
                                                                                            alt={property.title}
                                                                                            onError={(e) => {
                                                                                                e.currentTarget.onerror = null; // prevents infinite loop
                                                                                                e.currentTarget.src = defaultImg;
                                                                                            }}
                                                                                        />

                                                                                    </div>
                                                                                    <div className="content">
                                                                                        <div className="title" style={{ margin: 0 }}>
                                                                                            <a href="" className="link">{property.title}</a>
                                                                                        </div>

                                                                                        <div className="listing-type" style={{ margin: 0 }}>
                                                                                            <span className="fw-6">Listing Type:</span>{" "}
                                                                                            <span>{property.listing_type}</span>
                                                                                        </div>

                                                                                        <div className="text-date" style={{ margin: 0 }}>
                                                                                            <p className="fw-5" style={{ margin: 0 }}>
                                                                                                <span className="fw-6" style={{ margin: 0 }}>Posting date:</span>{" "}
                                                                                                {property.created_at
                                                                                                    ? (() => {
                                                                                                        const d = new Date(property.created_at);
                                                                                                        const day = String(d.getDate()).padStart(2, "0");
                                                                                                        const month = String(d.getMonth() + 1).padStart(2, "0");
                                                                                                        const year = d.getFullYear();
                                                                                                        return `${day}-${month}-${year}`;
                                                                                                    })()
                                                                                                    : "-----"}
                                                                                            </p>
                                                                                        </div>

                                                                                        <div className="text-1 fw-6" style={{ margin: 0 }}>
                                                                                            <span className="fw-6" style={{ fontSize: "15px", margin: 0 }}>Property Type:</span>
                                                                                            <span style={{ fontSize: "15px", margin: 0 }}>{property.property_type}</span>
                                                                                        </div>
                                                                                    </div>

                                                                                </div>
                                                                            </td>
                                                                            <td>
                                                                                <div className="status-wrap">
                                                                                    <span className="btn-status">
                                                                                        {statusLabel}
                                                                                    </span>
                                                                                </div>
                                                                            </td>
                                                                            <td>
                                                                                <ul className="list-action" style={{ display: "flex", alignItems: "center", gap: "10px", padding: 0, margin: 0 }}>
                                                                                    <li style={{ listStyle: "none", display: "flex", gap: 11 }}>
                                                                                        {/* Edit Button */}
                                                                                        <button
                                                                                            onClick={() => {
                                                                                                const encryptedId = encryptId(property.id)
                                                                                                const slug = slugify(property.title);

                                                                                                navigate(`/edit-property/${encryptedId}&slug=${slug}`)
                                                                                            }}
                                                                                            style={{
                                                                                                display: "flex",
                                                                                                alignItems: "center",
                                                                                                gap: "6px",
                                                                                                padding: "6px 12px",
                                                                                                backgroundColor: "#f5f5f5",
                                                                                                border: "1px solid #ddd",
                                                                                                borderRadius: "6px",
                                                                                                cursor: "pointer",
                                                                                                fontSize: "14px",
                                                                                                fontWeight: "500",
                                                                                                color: "#333",
                                                                                                transition: "all 0.2s ease-in-out",
                                                                                            }}
                                                                                            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#e9e9e9")}
                                                                                            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#f5f5f5")}
                                                                                        >

                                                                                            <img src={Edit} alt="Edit" style={{ width: "16px", height: "16px" }} />
                                                                                            Edit
                                                                                        </button>

                                                                                        {/* Delete Button (icon only) */}
                                                                                        <button
                                                                                            onClick={() => {
                                                                                                setPropertyToDelete(property.id);
                                                                                                setShowDeleteModal(true);
                                                                                            }}


                                                                                            style={{
                                                                                                display: "flex",
                                                                                                alignItems: "center",
                                                                                                justifyContent: "center",
                                                                                                padding: "6px",
                                                                                                backgroundColor: "#f5f5f5",
                                                                                                border: "1px solid #ddd",
                                                                                                borderRadius: "6px",
                                                                                                cursor: "pointer",
                                                                                                transition: "all 0.2s ease-in-out",
                                                                                            }}
                                                                                            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#e9e9e9")}
                                                                                            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#f5f5f5")}
                                                                                        >

                                                                                            <img src={Delete} alt="Delete" style={{ width: "16px", height: "16px" }} />
                                                                                        </button>

                                                                                        {/* Delete Confirmation Modal */}


                                                                                        {showDeleteModal && (
                                                                                            <div
                                                                                                style={{
                                                                                                    position: "fixed",
                                                                                                    top: 0,
                                                                                                    left: 0,
                                                                                                    width: "100%",
                                                                                                    height: "100%",
                                                                                                    backgroundColor: "rgba(0,0,0,0.5)",
                                                                                                    display: "flex",
                                                                                                    justifyContent: "center",
                                                                                                    alignItems: "center",
                                                                                                    zIndex: 1000,
                                                                                                }}
                                                                                            >
                                                                                                <div
                                                                                                    style={{
                                                                                                        backgroundColor: "#fff",
                                                                                                        padding: "30px 35px",
                                                                                                        borderRadius: "10px",
                                                                                                        width: "350px",
                                                                                                        maxWidth: "90%",
                                                                                                        textAlign: "center",
                                                                                                        boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
                                                                                                        wordWrap: "break-word",
                                                                                                    }}
                                                                                                >
                                                                                                    <h3 style={{ marginBottom: "20px", fontSize: "18px", fontWeight: 500 }}>
                                                                                                        Are you sure you want to delete?
                                                                                                    </h3>
                                                                                                    <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                                                                                                        <button
                                                                                                            onClick={() => setShowDeleteModal(false)}
                                                                                                            style={{
                                                                                                                padding: "6px 12px",
                                                                                                                borderRadius: "6px",
                                                                                                                border: "1px solid #ddd",
                                                                                                                backgroundColor: "#f5f5f5",
                                                                                                                cursor: "pointer",
                                                                                                                fontSize: "14px",
                                                                                                            }}
                                                                                                            disabled={isDeleting}
                                                                                                        >
                                                                                                            Cancel
                                                                                                        </button>
                                                                                                        <button
                                                                                                            onClick={async () => {
                                                                                                                if (propertyToDelete) {
                                                                                                                    setIsDeleting(true); // start loader
                                                                                                                    await deleteproperty(propertyToDelete); // ⬅ this now removes from UI
                                                                                                                    setIsDeleting(false); // stop loader
                                                                                                                    setShowDeleteModal(false);
                                                                                                                    setPropertyToDelete(null);
                                                                                                                }
                                                                                                            }}

                                                                                                        >
                                                                                                            {isDeleting ? (
                                                                                                                <div
                                                                                                                    style={{
                                                                                                                        border: "2px solid #fff",
                                                                                                                        borderTop: "2px solid transparent",
                                                                                                                        borderRadius: "50%",
                                                                                                                        width: "14px",
                                                                                                                        height: "14px",
                                                                                                                        animation: "spin 1s linear infinite",
                                                                                                                    }}
                                                                                                                ></div>
                                                                                                            ) : (
                                                                                                                "Delete"
                                                                                                            )}
                                                                                                        </button>

                                                                                                    </div>
                                                                                                </div>
                                                                                            </div>
                                                                                        )}



                                                                                    </li>
                                                                                </ul>
                                                                            </td>

                                                                        </tr>
                                                                    );
                                                                })
                                                            ) : (
                                                                <tr>
                                                                    <td colSpan={3} className="text-center">
                                                                        No Recent activity found.
                                                                    </td>
                                                                </tr>
                                                            )}
                                                        </tbody>

                                                    </table>
                                                </div>


                                            </div>
                                        </div>

                                    </div>
                                    <div className="col-xl-3">
                                        <div className="widget-box-3 recent-box">
                                            <h6>Recent Reviews</h6>

                                            {loading ? (
                                                // Skeleton Loader for Reviews
                                                Array.from({ length: 3 }).map((_, idx) => (
                                                    <div key={idx} className="box-tes-item">
                                                        <div className="box-avt d-flex align-items-center gap-12">
                                                            <div className="avatar avt-40 round skeleton-box"></div>
                                                            <div style={{ flex: 1 }}>
                                                                <div className="skeleton-line" style={{ width: "60%", height: "14px", marginBottom: "6px" }}></div>

                                                            </div>
                                                        </div>

                                                        <div className="skeleton-line" style={{ width: "100%", height: "14px", marginTop: "10px" }}></div>
                                                        <div className="skeleton-line" style={{ width: "90%", height: "14px", marginTop: "6px" }}></div>
                                                        <ul className="list-star d-flex gap-2 mt-2">
                                                            {Array.from({ length: 5 }).map((_, starIdx) => (
                                                                <li
                                                                    key={starIdx}
                                                                    className="icon icon-star skeleton-box"
                                                                    style={{ width: "16px", height: "16px", borderRadius: "3px" }}
                                                                ></li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                ))
                                            ) : recentProperties.length === 0 ? (
                                                <p>No reviews found.</p>
                                            ) : (
                                                (() => {
                                                    // Flatten all reviews
                                                    const allReviews = recentProperties
                                                        .flatMap((property) =>
                                                            property.review && property.review.length > 0
                                                                ? property.review.map((rev) => ({
                                                                    ...rev,
                                                                    propertyTitle: property.title, // optional
                                                                }))
                                                                : []
                                                        )
                                                        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at)) // latest first
                                                        .slice(0, 5); // limit to 5

                                                    return allReviews.length > 0 ? (
                                                        allReviews.map((rev) => (
                                                            <div key={rev.id} className="box-tes-item">
                                                                <div className="box-avt d-flex align-items-center gap-12">
                                                                    <div className="avatar avt-40 round">


                                                                        <img
                                                                            src={rev?.profile ? `${api.imageUrl}${rev.profile}` : "images/avatar/avt-7.jpg"}
                                                                            alt="avatar"
                                                                            onError={(e) => { e.currentTarget.src = { download } }}
                                                                        />
                                                                    </div>
                                                                    <p className="fw-6">{rev.user_name}</p>
                                                                    <small>{new Date(rev.created_at).toLocaleDateString()}</small>
                                                                </div>

                                                                <p className="note p-16">{rev.message}</p>
                                                                <ul className="list-star">
                                                                    {Array.from({ length: 5 }, (_, i) => (
                                                                        <li
                                                                            key={i}
                                                                            className={`icon icon-star ${i < parseInt(rev.star) ? "filled" : ""
                                                                                }`}
                                                                        ></li>
                                                                    ))}
                                                                </ul>
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <p>No reviews found.</p>
                                                    );
                                                })()
                                            )}
                                        </div>
                                    </div>

                                </div>
                            </div>
                            <div className="footer-dashboard">
                                <p className="text-variant-2">©2025 Eazy_Acres. All Rights Reserved.</p>
                            </div>
                            <div className="overlay-dashboard"></div>

                            {/* <div className="progress-wrap">
                                <svg className="progress-circle svg-content" width="100%" height="100%" viewBox="-1 -1 102 102">
                                    <path d="M50,1 a49,49 0 0,1 0,98 a49,49 0 0,1 0,-98" style={{ transition: 'stroke-dashoffset 10ms linear 0s', strokeDasharray: '307.919, 307.919', strokeDashoffset: '286.138' }}></path>
                                </svg>
                            </div> */}
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default Dashboard