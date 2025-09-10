import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/api';
import "./MyFavorites.css"
import easy from "../assets/easy.png"
import toast from 'react-hot-toast';



const MyFavorites = () => {
    const navigate = useNavigate();
    const [menuVisible, setMenuVisible] = useState(false);
    const [isMobileView, setIsMobileView] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [showDashboard, setShowDashboard] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [avatar, setAvatar] = useState(localStorage.getItem("userProfile"));


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
            label: 'Options', className: 'dropdown3',
            submenu: [
                { text: 'Dashboard', onClick: () => navigate('/dashboard') },
                { text: 'My Favorites', onClick: () => navigate('/myfavorites') },
                { text: 'My Properties', onClick: () => navigate('/myproperties') },
                { text: 'Reviews', onClick: () => navigate('/reviews') },
            ]
        },
        {
            label: 'My Profile',
            className: 'myprofile',
            onClick: () => navigate('/myprofile')
        }
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




    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true); // <-- new loading state

    const myFavoritesList = async () => {
        setLoading(true); // start loading
        const fd = new FormData();
        fd.append("programType", "myFavoritesProperty");
        fd.append("authToken", localStorage.getItem("authToken"));

        try {
            const response = await api.post("/properties/property", fd);
            console.log("Favorites API:", response);

            if (response.data.success && response.data.data.Favorites) {
                setFavorites(response.data.data.Favorites);
            } else {
                setFavorites([]);
            }
        } catch (error) {
            console.error("myfavorites error:", error);
            setFavorites([]);
        } finally {
            setLoading(false); // stop loading
        }
    };


    useEffect(() => {
        myFavoritesList();
    }, []);


    const remove = async (favoriteId, id) => {
        console.log("Removing favorite:", favoriteId);

        const fd = new FormData();
        fd.append("programType", "removeFavorites");
        fd.append("authToken", localStorage.getItem("authToken"));
        fd.append("favoriteId", favoriteId);
        fd.append("property_id", propertyId);

        try {
            const response = await api.post("/properties/property", fd);
            console.log("Remove response:", response);

            if (response.data.success) {
                toast.success("Favorite removed successfully!");

                // remove from state without refetch
                setFavorites((prev) =>
                    prev.filter((fav) => fav.favoriteId !== favoriteId)
                );
                // or call myFavoritesList() if you want to refetch from backend
                // myFavoritesList();

                myFavoritesList();

                // Option 2: Or remove it locally without API refetch
                // setFavorites(prev => prev.filter(fav => fav.favoriteId !== favoriteId));

            }
        } catch (error) {
            console.error("Remove favorite error:", error);
        }
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
                                                <div className="logo"><Link to="" onClick={(e) => { e.preventDefault(); navigate('/home'); }}><img src={easy} alt="logo" width="174" height="44" /></Link> </div>
                                                <div className="button-show-hide">
                                                    <span className="icon icon-categories"></span>
                                                </div>
                                            </div>
                                            <div className="nav-outer">
                                                {/* <!-- Main Menu --> */}
                                                <nav className="main-menu show navbar-expand-md">
                                                    <div className="navbar-collapse collapse clearfix" id="navbarSupportedContent">
                                                        <ul className="navigation clearfix">
                                                            <li className="home ms-4">
                                                                <Link to="" onClick={(e) => { e.preventDefault(); navigate('/home'); }}>Home</Link>
                                                            </li>

                                                            <li className="Properties">
                                                                <Link to="" onClick={(e) => { e.preventDefault(); navigate('/listing'); }}>Properties</Link>
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
                                                                <Link to="#" onClick={(e) => e.preventDefault()}>Pages</Link>
                                                                <ul style={{ display: activeDropdown === 3 ? 'block' : 'none' }}>
                                                                    <li><Link to="aboutus" onClick={(e) => { e.preventDefault(); navigate('/aboutus'); }}>About Us</Link> </li>
                                                                    <li><Link to="contactus" onClick={(e) => { e.preventDefault(); navigate('/contactus'); }}>Contact Us</Link> </li>
                                                                    <li><Link to="faq" onClick={(e) => { e.preventDefault(); navigate('/FAQ'); }}>FAQs</Link> </li>
                                                                    <li><Link to="" onClick={(e) => { e.preventDefault(); navigate('/Privacy-Policy'); }}>Privacy Policy</Link> </li>
                                                                </ul>
                                                            </li>
                                                            <li className="myprofile">
                                                                <Link to="" onClick={(e) => { e.preventDefault(); navigate('/myprofile'); }}>My profile</Link>
                                                            </li>
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
                                                            position: 'absolute',
                                                            top: '100%',
                                                            right: 0,
                                                            zIndex: 1000,
                                                            marginTop: '0.5rem'
                                                        }}
                                                    >
                                                        <Link className="dropdown-item" to="/myproperties">My Properties</Link>
                                                        <Link className="dropdown-item" to="/myfavorites">My Favorites</Link>
                                                        <Link className="dropdown-item" to="/reviews">Reviews</Link>
                                                        <Link className="dropdown-item" to="/myprofile">My Profile</Link>
                                                        <Link className="dropdown-item" onClick={(e) => {
                                                            e.preventDefault();
                                                            localStorage.removeItem("authToken"); // clear token
                                                            navigate("/home"); // redirect after logout
                                                            window.location.reload(); // reload so header updates
                                                        }}>Logout</Link>

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
                                        <Link to="" onClick={(e) => { e.preventDefault(); navigate('/home'); toggleMobileMenu(); }}>
                                            <img src={easy} alt="nav-logo" width="174" height="44" />
                                        </Link>
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
                                                            <Link to="#" onClick={(e) => e.preventDefault()}>
                                                                {item.label}
                                                                {item.submenu && <span className=""></span>}
                                                            </Link>
                                                            {item.submenu && (
                                                                <ul style={{ display: activeDropdown === index ? 'block' : 'none' }}>
                                                                    {item.submenu.map((sub, i) => (
                                                                        <li key={i}>
                                                                            <Link

                                                                                onClick={(e) => {
                                                                                    e.preventDefault();
                                                                                    if (sub.onClick) {
                                                                                        sub.onClick();
                                                                                        toggleMobileMenu();
                                                                                    }
                                                                                }}
                                                                            >
                                                                                {sub.text}
                                                                            </Link>
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
                                            <a className="tf-btn primary" onClick={(e) => {
                                                e.preventDefault();
                                                // Navigate to add property if logged in
                                                navigate("/addproperty");
                                            }}>Add Property</a>
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
                                    <Link className="nav-menu-link" onClick={(e) => { e.preventDefault(); navigate('/dashboard'); }}>
                                        <span className="icon icon-dashboard"></span> Dashboard
                                    </Link>
                                </li>
                                <li className="nav-menu-item">
                                    <Link className="nav-menu-link" onClick={(e) => { e.preventDefault(); navigate('/myproperties'); }}>
                                        <span className="icon icon-list-dashes"></span> My Properties
                                    </Link>
                                </li>
                                <li className="nav-menu-item">
                                    <Link className="nav-menu-link" onClick={(e) => { e.preventDefault(); navigate('/myfavorites'); }}>
                                        <span className="icon icon-heart"></span> My Favorites
                                    </Link>
                                </li>
                                <li className="nav-menu-item">
                                    <Link className="nav-menu-link" onClick={(e) => { e.preventDefault(); navigate('/reviews'); }}>
                                        <span className="icon icon-review"></span> Reviews
                                    </Link>
                                </li>

                                <li className="nav-menu-item">
                                    <a
                                        className="nav-menu-link"
                                        href=""
                                        onClick={(e) => {
                                            e.preventDefault();
                                            localStorage.removeItem("authToken"); // clear token
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


                                <div className="widget-box-2 wd-listing">
                                    <h6 className="title">My Favorites</h6>
                                    <div className="wrap-table">
                                        <div className="table-responsive">
                                            <table>
                                                <thead>
                                                    <tr>
                                                        <th>LISTING TITLE</th>
                                                        <th>Date Published</th>
                                                        <th>Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {loading ? (
                                                        // Skeleton loader rows
                                                        Array.from({ length: 3 }).map((_, index) => (
                                                            <tr key={index}>
                                                                <td colSpan="3">
                                                                    <div className="skeleton-row">
                                                                        <div className="skeleton-img"></div>
                                                                        <div className="skeleton-content">
                                                                            <div className="skeleton-line short"></div>
                                                                            <div className="skeleton-line"></div>
                                                                            <div className="skeleton-line"></div>
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        ))
                                                    ) : favorites.length > 0 ? (
                                                        favorites.map((fav) => (
                                                            <tr key={fav.favoriteId} className="file-delete">
                                                                <td>
                                                                    <div className="listing-box">
                                                                        <div
                                                                            className="images"
                                                                            style={{ cursor: "pointer" }}
                                                                            onClick={() => navigate(`/property/${fav.id}`)} // ✅ Navigate on click
                                                                        >
                                                                            <img
                                                                                src="https://themesflat.co/html/homzen/images/home/house-1.jpg"
                                                                                alt={fav.title}
                                                                            />
                                                                        </div>
                                                                        <div className="content">
                                                                            <div className="title">
                                                                                <Link to={`/property-details/${fav.slug}`} className="link">
                                                                                    {fav.title}
                                                                                </Link>
                                                                            </div>
                                                                            <div className="text-date">
                                                                                {fav.location}, {fav.sub_locality}
                                                                            </div>
                                                                            <div className="text-1 fw-7">
                                                                                {fav.listing_type === "rent"
                                                                                    ? `₹${fav.expected_rent} / ${fav.rent_period}`
                                                                                    : `₹${fav.expected_price}`}
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                </td>
                                                                <td>
                                                                    <span>
                                                                        {fav.created_at
                                                                            ? (() => {
                                                                                const d = new Date(fav.created_at);
                                                                                const day = String(d.getDate()).padStart(2, "0");
                                                                                const month = String(d.getMonth() + 1).padStart(2, "0");
                                                                                const year = d.getFullYear();
                                                                                return `${day}-${month}-${year}`;
                                                                            })()
                                                                            : ""}
                                                                    </span>
                                                                </td>

                                                                {/* <td>
                                                                    <span>DD/MM/YYYY</span>
                                                                </td> */}
                                                                <td>
                                                                    <ul className="list-action">

                                                                        <li onClick={() => remove(fav.favoriteId)}>

                                                                            <Link className="remove-file item flex items-center gap-1">
                                                                                <i className="icon icon-trash"></i>
                                                                                Remove

                                                                            </Link>

                                                                        </li>
                                                                    </ul>
                                                                </td>



                                                            </tr>
                                                        ))
                                                    ) : (
                                                        <tr>
                                                            <td colSpan="3" className="text-center">
                                                                No favorites found
                                                            </td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>

                                        {/* <ul className="wd-navigation">
                                            <li><Link to="#" className="nav-item active">1</Link> </li>

                                            <li><Link to="#" className="nav-item"><i className="icon icon-arr-r"></i></Link> </li>
                                        </ul> */}
                                    </div>
                                </div>


                            </div>
                            <div className="footer-dashboard">
                                <p className="text-variant-2">©2024 Homzen. All Rights Reserved.</p>
                            </div>

                            <div className="overlay-dashboard"></div>

                            <div className="progress-wrap">
                                <svg className="progress-circle svg-content" width="100%" height="100%" viewBox="-1 -1 102 102">
                                    <path d="M50,1 a49,49 0 0,1 0,98 a49,49 0 0,1 0,-98" style={{ transition: 'stroke-dashoffset 10ms linear 0s', strokeDasharray: '307.919, 307.919', strokeDashoffset: '286.138' }}></path>
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MyFavorites
