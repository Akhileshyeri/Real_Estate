import React, { useEffect, useState } from "react";
import Footer from "./Footer";
import Header from "./Header";
import api from "../api/api";
import { useNavigate } from "react-router-dom";
import "./blog.css";

import { encryptId } from "../utils/crypto";

const Blogs = () => {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Load first page
  useEffect(() => {
    bloglist(1);
  }, []);

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    bloglist(nextPage);
  };

  const bloglist = async (currentPage) => {
    setLoading(true);
    const fd = new FormData();
    fd.append("programType", "getBlogDetails");
    fd.append("authToken", localStorage.getItem("authToken"));
    fd.append("limit", 3);
    fd.append("page", currentPage);

    try {
      const response = await api.post("/properties/preRequirements", fd);
      if (response.data.success) {
        const newBlogs = response.data.data;

        if (currentPage === 1) {
          setBlogs(newBlogs);
        } else {
          setBlogs((prev) => [...prev, ...newBlogs]);
        }

        if (newBlogs.length < 1) {
          setHasMore(false);
        }
      }
    } catch (error) {
      console.error("blog error:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderSkeleton = () => {
    return Array(6)
      .fill(0)
      .map((_, index) => (
        <div className="col-lg-4 col-md-6" key={index}>
          <div className="flat-blog-item hover-img skeleton-card">
            <div className="img-style skeleton-img"></div>
            <div className="content-box">
              <div className="post-author skeleton-text"></div>
              <h6 className="title skeleton-text"></h6>
            </div>
          </div>
        </div>
      ));
  };

  return (
    <div>
      <Header />

      <section className="flat-title-page">
        <div className="container">
          <h2 className="text-center">Latest News</h2>
          <ul className="breadcrumb">
            <li><a href="/home">Home</a></li>
            <li>/ Blog</li>
          </ul>
        </div>
      </section>

      <section className="flat-section">
        <div className="container">
          <div className="row">
            {blogs.length === 0 && loading
              ? renderSkeleton()
              : blogs.map((blog) => (
                <div className="col-lg-4 col-md-6" key={blog.blogId}>
                  <div
                    className="flat-blog-item hover-img"
                    onClick={() => {
                      const encryptedId = encryptId(blog.blogId); // ✅ encrypt
                      navigate(`/blogoverview/${encryptedId}`);
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    <div className="img-style">
                      <img
                        src={api.imageUrl + blog.featured_image}
                        alt={blog.title}
                      />
                      <span className="date-post">
                        {new Date().toLocaleDateString("en-US", {
                          month: "long",
                          day: "2-digit",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                    <div className="content-box">
                      <div className="post-author">
                        <span>{blog.relatedTo || "Property"}</span>
                      </div>
                      <h6 className="title">{blog.title}</h6>
                    </div>
                  </div>
                </div>
              ))
            }

            {hasMore && (
              <div className="col-12 text-center mt-3">
                <button
                  className="tf-btn size-1 primary"
                  onClick={loadMore}
                  disabled={loading}
                >
                  {loading ? "Loading..." : "Load More"}
                </button>
              </div>
            )}

            {!hasMore && <p className="text-center mt-3">No more blogs to load.</p>}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Blogs;
