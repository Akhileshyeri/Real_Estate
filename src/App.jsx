import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";

import Header from "./Components/Header";
import HomePAge from "./Components/HomePage";
import Footer from "./Components/Footer";
import Listing from "./Components/Listing";
import Properties from "./Components/Properties";
import MyProfile from "./Components/MyProfile";
import AboutUs from "./Components/AboutUs";
import ContactUs from "./Components/ContactUs";
import FAQ from "./Components/FAQ";
import PrivacyPolicy from "./Components/PrivacyPolicy";
import Dashboard from "./Components/Dashboard";
import Myproperties from "./Components/Myproperties";
import MyFavorites from "./Components/MyFavorites";
import Reviews from "./Components/Reviews";
import Addproperty from "./Components/Addproperty";
import CityList from "./Components/CityList";
import Adddetails from "./Components/Adddetails";
import Blogs from "./Components/Blogs";
import BlogOverview from "./Components/BlogOverview";
import Inquiries from "./Components/Inquiries";
import ReviewList from "./Components/ReviewList";
import UpdateProperty from "./Components/UpdateProperty";
import StateList from "./Components/CityList";
import RecentProperties from "./Components/RecentProperties";
import EMICalculator from "./Components/EMICalculator";
import ConstructionCalculator from "./Components/ConstructionCalculator";
import AreaCalculator from "./Components/AreaCalculator";
import RentVsBuyCalculator from "./Components/RentVsBuyCalculator";



// ✅ Inline ScrollToTop helper
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);

  return null;
};

function App() {
  return (
    <>
      <Toaster />
      <ScrollToTop />

      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route exact path="/header" element={<Header />} />
        <Route exact path="/home" element={<HomePAge />} />
        <Route exact path="/footer" element={<Footer />} />
        <Route exact path="/listing" element={<Listing />} />
        <Route exact path="/property/:id" element={<Properties />} />
        <Route exact path="/myprofile" element={<MyProfile />} />
        <Route exact path="/aboutus" element={<AboutUs />} />
        <Route exact path="/contactus" element={<ContactUs />} />
        <Route exact path="/FAQ" element={<FAQ />} />
        <Route exact path="/Privacy-Policy" element={<PrivacyPolicy />} />
        <Route exact path="/dashboard" element={<Dashboard />} />
        <Route exact path="/myproperties" element={<Myproperties />} />
        <Route exact path="/myfavorites" element={<MyFavorites />} />
        <Route exact path="/reviews" element={<Reviews />} />
        <Route exact path="/addproperty" element={<Addproperty />} />
        <Route exact path="/add" element={<Adddetails />} />
        <Route exact path="/blogs" element={<Blogs />} />
        <Route exact path="/city-list/:id" element={<StateList />} />
        <Route exact path="/blogoverview/:id" element={<BlogOverview />} />
        <Route exact path="/inquiries" element={<Inquiries />} />
        <Route exact path="/inquiries/:id" element={<Inquiries />} />
        <Route path="/reviewlist" element={<ReviewList />} />
        <Route path="/reviewlist/:id" element={<ReviewList />} />
        <Route exact path="/edit-property/:id" element={<UpdateProperty />} />
        <Route exact path="/recent" element={<RecentProperties />} />
        <Route exact path="/emi" element={<EMICalculator />} />
        <Route exact path="/calc" element={<ConstructionCalculator />} />
        <Route exact path="/area" element={<AreaCalculator />} />

        <Route exact path="/rent" element={<RentVsBuyCalculator />} />


      </Routes>
    </>
  );
}

export default App;
