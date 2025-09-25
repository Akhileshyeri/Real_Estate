import React, { useEffect, useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import api from "../api/api";
import { useParams, useNavigate } from "react-router-dom";

import { encryptId, decryptId } from "../utils/crypto"; // ✅ import helpers

const BlogOverview = () => {
    const { id } = useParams(); // this is encrypted
    const [blog, setBlog] = useState(null);
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBlogData = async () => {
            setLoading(true);

            // ✅ decrypt id first
            const decryptedId = decryptId(id);
            if (!decryptedId) {
                console.error("Invalid blog id");
                setLoading(false);
                return;
            }

            // Fetch single blog details
            try {
                const fd = new FormData();
                fd.append("programType", "getBlogOverview");
                fd.append("authToken", localStorage.getItem("authToken"));
                fd.append("blogId", decryptedId); // ✅ use decrypted id
                const response = await api.post("/properties/preRequirements", fd);
                if (response.data.success && response.data.data.length > 0) {
                    setBlog(response.data.data[0]);
                }
            } catch (error) {
                console.error("blogview error:", error);
                setBlog(null);
            }

            // Fetch related blogs
            try {
                const fd = new FormData();
                fd.append("programType", "getBlogDetails");
                fd.append("authToken", localStorage.getItem("authToken"));
                fd.append("relatedPost", decryptedId); // ✅ use decrypted id
                const response = await api.post("/properties/preRequirements", fd);
                if (response.data.success) {
                    setBlogs(response.data.data);
                } else {
                    setBlogs([]);
                }
            } catch (error) {
                console.error("bloglist error:", error);
                setBlogs([]);
            }

            setLoading(false);
        };

        fetchBlogData();
    }, [id]);

    if (loading) {
        return (
            <div>
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
                    <p className="mt-3" style={{ fontSize: "1.1rem", color: "#333" }}>
                        Loading blog details...
                    </p>
                </div>

                <style>{`
          .bouncing-cubes {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            height: 50px;
          }
          .cube {
            width: 22px;
            height: 22px;
            animation: bounce 1.5s infinite ease-in-out;
            border-radius: 4px;
          }
          .cube:nth-child(2) { animation-delay: 0.2s; }
          .cube:nth-child(3) { animation-delay: 0.4s; }
          @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-20px); }
          }
        `}</style>
            </div>
        );
    }

    return (
        <div>
            <Header />

            {/* Banner */}
            <section style={{ marginBottom: "50px" }}>
                <img
                    src={
                        blog && blog.featured_image
                            ? `${api.imageUrl}${blog.featured_image}`
                            : "images/blog/banner-blog.jpg"
                    }
                    alt={blog ? blog.title : "banner-blog"}
                    style={{
                        height: "450px",
                        width: "100%",
                        objectFit: "cover",
                        borderRadius: "8px",
                    }}
                />
            </section>

            {/* Blog Detail */}
            <section style={{ padding: "50px 15px" }}>
                <div style={{ maxWidth: "900px", margin: "0 auto" }}>
                    {blog && (
                        <div>
                            <a
                                href="#"
                                style={{
                                    display: "inline-block",
                                    marginBottom: "15px",
                                    padding: "5px 12px",
                                    backgroundColor: "#EC2126",
                                    color: "#fff",
                                    borderRadius: "20px",
                                    fontSize: "0.85rem",
                                    textTransform: "uppercase",
                                    fontWeight: "600",
                                    textDecoration: "none",
                                }}
                            >
                                {blog.relatedTo}
                            </a>
                            <h1
                                style={{
                                    fontSize: "2rem",
                                    fontWeight: "700",
                                    marginBottom: "25px",
                                    lineHeight: "1.3",
                                }}
                            >
                                {blog.title}
                            </h1>
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "15px",
                                    marginBottom: "35px",
                                }}
                            ></div>
                            <div
                                style={{ fontSize: "1.05rem", lineHeight: "1.8", color: "#444" }}
                                dangerouslySetInnerHTML={{ __html: blog.content }}
                            />
                        </div>
                    )}
                </div>
            </section>

            {/* Related Blogs */}
            <section className="flat-section">
                <div className="container">
                    <div className="row">
                        {blogs.length > 0 ? (
                            blogs.slice(0, 3).map((b) => (
                                <div className="col-lg-4 col-md-6 mb-4" key={b.blogId}>
                                    <div
                                        className="flat-blog-item hover-img"
                                        onClick={() => {
                                            const encryptedId = encryptId(b.blogId); // ✅ encrypt before navigating
                                            navigate(`/blogoverview/${encryptedId}`);
                                        }}
                                        style={{ cursor: "pointer" }}
                                    >
                                        <div className="img-style">
                                            <img
                                                src={api.imageUrl + b.featured_image}
                                                alt={b.title}
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
                                                <span>{b.relatedTo || "Property"}</span>
                                            </div>
                                            <h6 className="title">{b.title}</h6>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-center">No blogs found.</p>
                        )}
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default BlogOverview;
