import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect, use } from 'react';
import api from '../api/api';
import easy from "../assets/easy.png"
import Header from './Header';
import toast from 'react-hot-toast';
import './Myprofile.css';
import Arrow from '../assets/Arrow.png'




const MyProfile = () => {



    const [avatar, setAvatar] = useState(localStorage.getItem("userProfile"));

    const navigate = useNavigate();
    const [menuVisible, setMenuVisible] = useState(false);
    const [isMobileView, setIsMobileView] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [showDashboard, setShowDashboard] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [loading, setLoading] = useState(true); // 👈 loader state




    const [btnLoading, setBtnLoading] = useState(false);


    const authToken = localStorage.getItem("authToken") || "Guest";
    localStorage.setItem("authToken", authToken);


    const [name, setName] = useState(localStorage.getItem("name"));
    console.log(name);

    const [customer, setCustomer] = useState({
        firstName: "",
        lastName: "",
        email: "",
        mobile: "",
        country: "",
        state: "",
        city: "",
        address: "",
        postalCode: "",
        file: null,
    });

    useEffect(() => {
        const authToken = localStorage.getItem("authToken");

        if (!authToken || authToken === "Guest") {
            toast.error("Please Login");
            navigate("/", { replace: true }); // redirect to homepage
        }
    }, [navigate]);




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
            ]
        }, {
            label: 'My profile', className: 'dropdown3',
            submenu: [
                { text: 'Dashboard', onClick: () => navigate('/dashboard') },
                { text: 'My Favorites', onClick: () => navigate('/myfavorites') },
                { text: 'My Properties', onClick: () => navigate('/myproperties') },
                { text: 'Recent Properties', onClick: () => navigate('/recent') },

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



    // Fetch customer details on mount
    // Fetch customer details on mount
    const getCustomerDetails = async () => {
        const fd = new FormData();
        fd.append("programType", "getPersonalDetailsOfCustomer");
        fd.append("authToken", authToken);

        try {
            setLoading(true);
            const response = await api.post("customers/customerProfile", fd);
            console.log("customer details", response);

            if (response.data?.success) {
                const user = response.data.data;

                // Normalize backend profile image URL
                const profileUrl = user.profile
                    ? user.profile.startsWith("http")
                        ? user.profile
                        : `${api.imageUrl}/${user.profile}`
                    : "https://media.istockphoto.com/id/1337144146/vector/default-avatar-profile-icon-vector.jpg?s=612x612&w=0&k=20&c=BIbFwuv7FxTWvh5S3vB6bkT0Qv8Vn8N5Ffseq84ClGI=";


                localStorage.setItem("userProfile", profileUrl);
                setAvatar(profileUrl);
                setCustomer((prev) => ({
                    ...prev,
                    ...user,
                    profile: profileUrl,
                }));
            }








            if (response.data?.success) {
                const user = response.data.data;

                const profileUrl = user.profile
                    ? user.profile.startsWith("http")
                        ? user.profile
                        : `${api.imageUrl}/${user.profile}`
                    : "https://static.vecteezy.com/system/resources/previews/044/245/684/non_2x/smiling-real-estate-agent-holding-a-house-shaped-keychain-png.png";

                // ✅ Save to localStorage for Properties.jsx
                localStorage.setItem("userProfile", profileUrl);
                localStorage.setItem("userName", user.firstName || user.agentName || "Guest User");
                localStorage.setItem("userEmail", user.email || "");
                localStorage.setItem("userMobile", user.mobile || user.mobileNo || "");
            }




        } catch (error) {
            console.error("customer error:", error);
        } finally {
            setLoading(false);
        }
    };


    // Update customer details
    const updateCustomerDetails = async () => {
        const fd = new FormData();
        fd.append("programType", "updateCustomer");
        fd.append("authToken", authToken);
        fd.append("firstName", customer.firstName);
        fd.append("lastName", customer.lastName);
        fd.append("email", customer.email);
        fd.append("mobile", customer.mobile);
        fd.append("country", customer.country);
        fd.append("state", customer.state);
        fd.append("city", customer.city);
        fd.append("address", customer.address);
        fd.append("postalCode", customer.postalCode);
        if (customer.file) {
            fd.append("file", customer.file);
        }

        console.log("Submitting form data:");
        for (let pair of fd.entries()) {
            console.log(pair[0], pair[1]); // Logs each key-value pair
        }

        try {
            setBtnLoading(true); // start button loader
            const response = await api.post("customers/customerProfile", fd);
            console.log("Update response:", response.data);





            if (response.data.success) {
                toast.success(response.data.message);

                // ✅ Update localStorage + state for header display
                const updatedName = customer.firstName || "Guest User";
                localStorage.setItem("name", updatedName);
                setName(updatedName);
            }

        } catch (error) {
            console.error("customer error:", error);
            alert("Something went wrong while updating profile!");
        } finally {
            setBtnLoading(false); // stop loader
        }
    };

    // Handle file change





    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setCustomer((prev) => ({
                ...prev,
                file,
                profile: URL.createObjectURL(file), // temporary preview
            }));
        }
    };





    const getAgentDetails = async () => {
        const fd = new FormData();
        fd.append("programType", "getPersonalDetailsOfAgent");
        fd.append("authToken", authToken);

        try {
            setLoading(true);
            const response = await api.post("agents/agentProfile", fd);
            console.log("agent details", response);

            if (response.data?.success) {
                const agent = response.data.data;

                const profileUrl = agent.profile
                    ? agent.profile.startsWith("http")
                        ? agent.profile
                        : `${api.imageUrl}/${agent.profile}`
                    : "http://192.168.1.103/projects/easyAcers/admin/api/images/avatar/avt-2.jpg";





                setCustomer({
                    firstName: agent.agentName || "",
                    lastName: "",
                    email: agent.email || "",
                    mobile: agent.mobileNo || "",
                    country: agent.country || "",
                    state: agent.state || "",
                    city: agent.city || "",
                    address: agent.address || "",
                    postalCode: agent.postCode || "",
                    profile: profileUrl,
                    file: null,
                });
            // ✅ Update localStorage + avatar (for Header / UI display)
      localStorage.setItem("userProfile", profileUrl);
      localStorage.setItem("userName", agent.agentName || "Guest User");
      localStorage.setItem("userEmail", agent.email || "");
      localStorage.setItem("userMobile", agent.mobileNo || "");

      setAvatar(profileUrl); // 👈 Immediate update (no refresh needed)
    }
  } catch (error) {
    console.error("agent error:", error);
  } finally {
    setLoading(false);
  }
};









    const updateAgentDetails = async () => {
        const fd = new FormData();
        fd.append("programType", "updateAgent");
        fd.append("authToken", authToken);
        fd.append("firstName", customer.firstName);
        fd.append("lastName", customer.lastName);
        fd.append("email", customer.email);
        fd.append("mobile", customer.mobile);
        fd.append("country", customer.country);
        fd.append("state", customer.state);
        fd.append("city", customer.city);
        fd.append("address", customer.address);
        fd.append("postalCode", customer.postalCode);
        if (customer.file) {
            fd.append("file", customer.file);
        }

        try {
            setBtnLoading(true); // start button loader
            const response = await api.post("agents/agentProfile", fd);
            console.log("Agent Update response:", response.data);




            if (response.data.success) {
                toast.success(response.data.message || "Agent profile updated successfully!");

                // ✅ Update localStorage + state for header display
                const updatedName = customer.firstName || "Guest User";
                localStorage.setItem("name", updatedName);
                setName(updatedName);
            }


            else {
                toast.error(response.data.message || "Failed to update agent profile.");
            }
        } catch (error) {
            console.error("Agent error:", error);
            toast.error("Something went wrong while updating Agent profile!");
        } finally {
            setBtnLoading(false); // stop loader
        }
    };









    useEffect(() => {
        const userType = localStorage.getItem("usertype");
        if (userType === "Agent") {
            getAgentDetails();
        } else {
            getCustomerDetails();
        }
    }, []);








    const [kycDocs, setKycDocs] = useState([]);
    const [fileMap, setFileMap] = useState({});



    // ---- Fetch existing KYC details ----
    const kycDetails = async () => {
        const fd = new FormData();
        fd.append("programType", "displayRequestedKycDetails");
        fd.append("authToken", authToken);

        try {
            const response = await api.post("agents/agentProfile", fd);
            console.log("KYC details", response);

            if (response.data?.success) {
                setKycDocs(response.data.data || []);
            }
        } catch (error) {
            console.error("KYC fetch error:", error);
            toast.error("Failed to fetch KYC details");
        }
    };
    // ---- Upload Handler ----



    const [aadharFile, setAadharFile] = useState(null);
    const [panFile, setPanFile] = useState(null);

    // 👇 inside MyProfile component, before return
    const userType = localStorage.getItem("usertype");



    const handleFileChangeAgent = (kycId, file) => {
        setFileMap((prev) => ({ ...prev, [kycId]: file }));
    };

    // ---- Upload Handler ----
    const handleUpload = async (kycId) => {
        if (!fileMap[kycId]) {
            toast.error("Please select a file first!");
            return;
        }

        const formData = new FormData();
        formData.append("programType", "uploadKycDetailsOfAgent");
        formData.append("authToken", authToken);
        formData.append("kycId", kycId);
        formData.append("file", fileMap[kycId]);

        try {
            const response = await api.post("agents/agentProfile", formData);
            console.log("Upload KYC", response);

            if (response.data?.success) {
                toast.success("Document uploaded successfully!");
                kycDetails(); // refresh list
            } else {
                toast.error(response.data?.message || "Upload failed");
            }
        } catch (error) {
            console.error("Upload error:", error);
            toast.error("Upload failed. Try again.");
        }
    };
    useEffect(() => {
        kycDetails();
    }, []);





    // ✅ Show loader if loading
    if (loading) {
        return (
            <>
                <Header />
                <div
                    style={{
                        minHeight: "80vh",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        flexDirection: "column",
                    }}
                >
                    <div className="bouncing-cubes">
                        <div className="cube" style={{ backgroundColor: "#EC2126" }}></div>
                        <div className="cube" style={{ backgroundColor: "#EC2126" }}></div>
                        <div className="cube" style={{ backgroundColor: "#EC2126" }}></div>
                    </div>
                    <p className="mt-3">Loading Profile details...</p>
                </div>

                <style>{`
                .bouncing-cubes {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    height: 50px;
                }
                
                .cube {
                    width: 20px;
                    height: 20px;
                    animation: bounce 1.5s infinite ease-in-out;
                }
                
                .cube:nth-child(2) {
                    animation-delay: 0.2s;
                }
                
                .cube:nth-child(3) {
                    animation-delay: 0.4s;
                }
                
                @keyframes bounce {
                    0%, 100% {
                        transform: translateY(0);
                    }
                    50% {
                        transform: translateY(-20px);
                    }
                }
            `}</style>
            </>
        );
    }


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
                                                        <ul className="navigation clearfix">
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






                                                    <div
                                                    // style={{ position: "relative", display: "inline-block" }}
                                                    // onMouseEnter={() => setDropdownOpen(true)}
                                                    // onMouseLeave={() => setDropdownOpen(false)}
                                                    >
                                                        {/* Avatar + Name */}
                                                        <div
                                                            className="avatar avt-40 round"
                                                            style={{ display: "inline-block", verticalAlign: "middle" }}
                                                        >
                                                            <img src={avatar || "fallback.png"} alt="avt" />

                                                            {/* <img src="https://cdn-icons-png.flaticon.com/512/10307/10307911.png" alt="avt" /> */}
                                                        </div>






                                                        {!isMobileView && (
                                                            <p
                                                                className="name"
                                                                style={{ cursor: "pointer", display: "inline-block", marginLeft: "8px" }}
                                                            >
                                                                {name} <span className="icon icon-arr-down"></span>
                                                            </p>
                                                        )}


                                                        {/* Dropdown */}
                                                        <div
                                                            className={`dropdown-menu ${dropdownOpen ? "show" : ""}`}
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
                                                            <a className="dropdown-item" onClick={() => navigate("/dashboard")}>
                                                                Dashboard
                                                            </a>
                                                            <a className="dropdown-item" onClick={() => navigate("/myproperties")}>
                                                                My Properties
                                                            </a>
                                                            <a className="dropdown-item" onClick={() => navigate("/myfavorites")}>
                                                                My Favorites
                                                            </a>
                                                              <a className="dropdown-item" onClick={() => navigate("/recent")}>
                                                                Recent Properties
                                                            </a>
                                                            {/* <a className="dropdown-item" onClick={() => navigate("/reviews")}>
                                                                Reviews
                                                            </a> */}

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
                                                                localStorage.removeItem("usertype"); // clear token
                                                                navigate("/home"); // redirect after logout
                                                                window.location.reload(); // reload so header updates
                                                            }}>
                                                                Logout
                                                            </a>
                                                        </div>
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
                                        <i class="fa-solid fa-clock-rotate-left" style={{color:"#a3abb0"}}></i> Recent Properties
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
                            <div className="main-content-inner wrap-dashboard-content-2">
                                <div className="widget-box-2">
                                    <h6 className="title">Account Settings</h6>











                                    {/* Avatar Upload */}
                                    {/* Avatar Upload */}
                                    <div className="box">
                                        <h6 className="title">Avatar</h6>
                                        <div className="box-agent-avt">
                                            <div className="avatar-container">



                                                <img
                                                    src={customer.profile}
                                                    alt="avatar"
                                                    className="avatar-img"
                                                />



                                                {/* Pencil Icon Overlay */}
                                                <label htmlFor="avatarInput" className="edit-icon">
                                                    <i className="fa-solid fa-pencil"></i>
                                                </label>

                                                {/* Hidden File Input */}
                                                <input
                                                    type="file"
                                                    id="avatarInput"
                                                    className="ip-file-hidden"
                                                    accept="image/*"
                                                    onChange={handleFileChange}
                                                />
                                            </div>
                                            <p className="mt-2 text-muted">JPEG 100x100</p>
                                        </div>
                                    </div>


                                    {/* Information Fields */}
                                    <h6 className="title">Information</h6>
                                    <div className="box box-fieldset">
                                        <label>First Name:<span>*</span></label>
                                        <input
                                            type="text"
                                            className="form-control style-1"
                                            value={customer.firstName || ""}
                                            onChange={(e) =>
                                                setCustomer({ ...customer, firstName: e.target.value })
                                            }
                                        />
                                    </div>

                                    <div className="box box-fieldset">
                                        <label>Last Name:<span>*</span></label>
                                        <input
                                            type="text"
                                            className="form-control style-1"
                                            value={customer.lastName || ""}
                                            onChange={(e) =>
                                                setCustomer({ ...customer, lastName: e.target.value })
                                            }
                                        />
                                    </div>

                                    <div className="box grid-4 gap-30">
                                        <div className="box-fieldset">
                                            <label>Email:<span>*</span></label>
                                            <input
                                                type="text"
                                                className="form-control style-1"
                                                value={customer.email || ""}
                                                onChange={(e) =>
                                                    setCustomer({ ...customer, email: e.target.value })
                                                }
                                            />
                                        </div>
                                        <div className="box-fieldset">
                                            <label>Mobile:<span>*</span></label>
                                            <input
                                                type="text"
                                                className="form-control style-1"
                                                value={customer.mobile || ""}
                                                onChange={(e) =>
                                                    setCustomer({ ...customer, mobile: e.target.value })
                                                }
                                            />
                                        </div>
                                        <div className="box-fieldset">
                                            <label>Country:<span>*</span></label>
                                            <input
                                                type="text"
                                                className="form-control style-1"
                                                value={customer.country || ""}
                                                onChange={(e) =>
                                                    setCustomer({ ...customer, country: e.target.value })
                                                }
                                            />
                                        </div>
                                        <div className="box-fieldset">
                                            <label>State:<span>*</span></label>
                                            <input
                                                type="text"
                                                className="form-control style-1"
                                                value={customer.state || ""}
                                                onChange={(e) =>
                                                    setCustomer({ ...customer, state: e.target.value })
                                                }
                                            />
                                        </div>
                                    </div>

                                    <div className="box grid-4 gap-30 box-info-2">
                                        <div className="box-fieldset">
                                            <label>City:<span>*</span></label>
                                            <input
                                                type="text"
                                                className="form-control style-1"
                                                value={customer.city || ""}
                                                onChange={(e) =>
                                                    setCustomer({ ...customer, city: e.target.value })
                                                }
                                            />
                                        </div>
                                        <div className="box-fieldset">
                                            <label>Address:<span>*</span></label>
                                            <input
                                                type="text"
                                                className="form-control style-1"
                                                value={customer.address || ""}
                                                onChange={(e) =>
                                                    setCustomer({ ...customer, address: e.target.value })
                                                }
                                            />
                                        </div>
                                        <div className="box-fieldset">
                                            <label>Postal Code:<span>*</span></label>
                                            <input
                                                type="number"
                                                className="form-control style-1"
                                                value={customer.postalCode || ""}
                                                onChange={(e) =>
                                                    setCustomer({ ...customer, postalCode: e.target.value })
                                                }
                                            />
                                        </div>
                                    </div>







                                    {/* ---- KYC DOCUMENTS ---- */}
                                    {/* ---- KYC DOCUMENTS ---- */}
                                    {userType === "Agent" && (
                                        <div className="kyc-container">
                                            <h6 className="kyc-title">KYC Documents</h6>

                                            <div className="approved-docs">
                                                {kycDocs.map((doc) => (
                                                    <div className="document-card" key={doc.id}>
                                                        <label className="document-label">{doc.documentType}:</label>

                                                        {/* If already uploaded, show preview */}
                                                        {doc.document ? (
                                                            <div className="uploaded-document">
                                                                <img
                                                                    src={`${api.imageUrl}/${doc.document}`}
                                                                    alt={doc.documentType}
                                                                    className="document-preview"
                                                                />
                                                                <div className="document-actions">
                                                                    <a
                                                                        href={`${api.imageUrl}/${doc.document}`}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        className="view-link"
                                                                    >
                                                                        View Uploaded Document
                                                                    </a>
                                                                    {doc.status === 2 && (
                                                                        <span className="status-badge status-approved">Approved</span>
                                                                    )}
                                                                    {doc.status === 1 && (
                                                                        <span className="status-badge status-rejected">Rejected</span>
                                                                    )}
                                                                    {(doc.status === 0 || doc.status == null) && (
                                                                        <span className="status-badge status-pending">Pending</span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <p className="no-document">No document uploaded yet</p>
                                                        )}

                                                        {/* Upload (drag-drop) only if not approved */}
                                                        {doc.status !== 2 && (
                                                            <div
                                                                className="upload-area"
                                                                onDragOver={(e) => e.preventDefault()}
                                                                onDrop={(e) => {
                                                                    e.preventDefault();
                                                                    if (e.dataTransfer.files.length > 0) {
                                                                        handleFileChangeAgent(doc.id, e.dataTransfer.files[0]);
                                                                    }
                                                                }}
                                                                onClick={() =>
                                                                    document.getElementById(`fileInput-${doc.id}`).click()
                                                                }
                                                            >
                                                                <div className="upload-icon">
                                                                    <svg
                                                                        width="24"
                                                                        height="24"
                                                                        viewBox="0 0 24 24"
                                                                        fill="none"
                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                    >
                                                                        <path
                                                                            d="M11 15H13V9H16L12 4L8 9H11V15Z"
                                                                            fill="currentColor"
                                                                        />
                                                                        <path
                                                                            d="M20 18H4V11H2V18C2 19.103 2.897 20 4 20H20C21.103 20 22 19.103 22 18V11H20V18Z"
                                                                            fill="currentColor"
                                                                        />
                                                                    </svg>
                                                                </div>
                                                                <p>Drag & Drop {doc.documentType} here</p>
                                                                <p className="upload-subtext">
                                                                    or <strong>Click to Browse</strong>
                                                                </p>
                                                                <p className="upload-formats">Supports: JPG, PNG, PDF</p>
                                                            </div>
                                                        )}

                                                        {/* Hidden file input */}
                                                        <input
                                                            type="file"
                                                            id={`fileInput-${doc.id}`}
                                                            accept="image/*,.pdf"
                                                            className="file-input"
                                                            onChange={(e) => handleFileChangeAgent(doc.id, e.target.files[0])}
                                                        />

                                                        {/* Preview selected file before upload */}
                                                        {fileMap[doc.id] && (
                                                            <div className="file-preview-container">
                                                                {fileMap[doc.id].type.startsWith("image/") ? (
                                                                    <img
                                                                        src={URL.createObjectURL(fileMap[doc.id])}
                                                                        alt="Preview"
                                                                        className="file-preview-image"
                                                                    />
                                                                ) : (
                                                                    <div className="file-preview-details">
                                                                        <svg
                                                                            width="40"
                                                                            height="40"
                                                                            viewBox="0 0 24 24"
                                                                            fill="none"
                                                                            xmlns="http://www.w3.org/2000/svg"
                                                                        >
                                                                            <path
                                                                                d="M14 2H6C4.9 2 4.01 2.9 4.01 4L4 20C4 21.1 4.89 22 5.99 22H18C19.1 22 20 21.1 20 20V8L14 2ZM18 20H6V4H13V9H18V20Z"
                                                                                fill="#6c757d"
                                                                            />
                                                                        </svg>
                                                                        <p className="file-name">{fileMap[doc.id].name}</p>
                                                                    </div>
                                                                )}

                                                                <button
                                                                    className="upload-button"
                                                                    onClick={() => handleUpload(doc.id)}
                                                                >
                                                                    Upload Document
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}







                                    {/* Save Button */}
                                    <div className="box">
                                        <button
                                            className="tf-btn primary"
                                            disabled={btnLoading} // disable while loading
                                            onClick={() => {
                                                const userType = localStorage.getItem("usertype");
                                                if (userType === "Agent") {
                                                    updateAgentDetails();
                                                } else {
                                                    updateCustomerDetails();
                                                }
                                            }}
                                        >
                                            {btnLoading ? (
                                                <span className="spinner"></span>  // 👇 loader animation
                                            ) : (
                                                "Save & Update"
                                            )}
                                        </button>

                                        <style>{`
    .spinner {
      display: inline-block;
      width: 18px;
      height: 18px;
      border: 2px solid #fff;
      border-top: 2px solid transparent;
      border-radius: 50%;
      animation: spin 0.7s linear infinite;
    }
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `}</style>
                                    </div>


                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyProfile;