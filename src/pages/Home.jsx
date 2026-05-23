import React, { useState, useEffect, useCallback, useRef } from "react";
import ArticleCard from "./ArticleCard";
import api from "../api/interceptor";
import { Loader, Search, Star } from "lucide-react";
import CategoryModal from "../components/CategoryModal";
import { useOutletContext } from "react-router-dom";

const ArticleCardSkeleton = () => (
  <div className="animate-pulse space-y-4">
    <div className="h-24 bg-gray-200 rounded"></div>
    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
  </div>
);

export default function Home() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");

  const observerTarget = useRef(null);
  const { userData } = useOutletContext();

  // userData aane ke baad Favs set karo
  useEffect(() => {
    if (!userData) return;
    if (userData?.favourites?.length > 0) {
      setActiveCategory("Favs");
    } else if (userData?.favourites?.length === 0) {
      setShowCategoryModal(true);
    }
  }, [userData]);

  // Fetch blogs
  const fetchBlogs = useCallback(async (category = "", pageNum = 1) => {
    try {
      setIsFetching(true);
      if (pageNum === 1) setLoading(true);

      let url;
      const params = new URLSearchParams();

      if (category === "Favs") {
        url = "web/blogs/favourites/list";
      } else {
        url = "web/blogs";
        if (category && category !== "All") {
          params.append('cname', category);
        }
      }

      params.append('page', pageNum);
      params.append('limit', 5);

      const response = await api.get(`${url}?${params.toString()}`);
      const blogList = response.data?.data || response.data || [];
      const newBlogs = Array.isArray(blogList) ? blogList : [];

      setBlogs(prev => pageNum === 1 ? newBlogs : [...prev, ...newBlogs]);
      setHasMore(newBlogs.length > 0);
    } catch (err) {
      console.error("Error fetching blogs:", err);
      setError(err.message);
    } finally {
      setLoading(false);
      setIsFetching(false);
    }
  }, [userData]);

  const handleCategoryClick = (category) => {
    const categoryName = typeof category === 'string' ? category : category.name;
    setActiveCategory(categoryName);
  };

  // Reset when category changes
  useEffect(() => {
    if (!activeCategory) return;
    setPage(1);
    setBlogs([]);
    setHasMore(true);
    fetchBlogs(activeCategory, 1);
  }, [activeCategory, fetchBlogs]);

  // Fetch when page changes
  useEffect(() => {
    if (page === 1) return;
    fetchBlogs(activeCategory, page);
  }, [page, activeCategory, fetchBlogs]);

  // Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        const first = entries[0];
        if (first.isIntersecting && hasMore && !loading && !isFetching) {
          setPage(prev => prev + 1);
        }
      },
      { threshold: 1.0 }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) observer.observe(currentTarget);
    return () => { if (currentTarget) observer.unobserve(currentTarget); };
  }, [hasMore, loading, isFetching]);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoryResponse = await api.get("web/categories");
        const categoryList = categoryResponse.data?.data || categoryResponse.data || [];
        setCategories(Array.isArray(categoryList) ? categoryList : []);
      } catch (err) {
        console.error("Error fetching categories:", err);
        setError(err.message);
      }
    };
    fetchCategories();
  }, []);

  if (error) {
    return <div className="text-red-500">Error loading blogs: {error}</div>;
  }

  return (
    <div className="space-y-12">
      {/* CATEGORIES */}
      <div className="sticky top-[57px] bg-white z-40 border-b border-gray-100 -mx-6 px-6 mb-6">
        <div className="flex items-center py-4 overflow-x-auto no-scrollbar space-x-4">
          <button className="flex-shrink-0 text-gray-400 hover:text-black pr-2">+</button>

          {loading ? (
            <div className="flex items-center space-x-2">
              <Loader size={16} className="animate-spin text-gray-400" />
              <span className="text-sm text-gray-400">Loading...</span>
            </div>
          ) : (
            <>
              {userData?.favourites && (
                <button
                  onClick={() => handleCategoryClick("Favs")}
                  className={`flex-shrink-0 text-[13px] whitespace-nowrap transition-colors ${
                    activeCategory === "Favs"
                      ? 'text-black font-semibold border-b-2 border-black'
                      : 'text-gray-500 hover:text-black'
                  }`}
                >
                  <span className="inline-flex items-center gap-1"><Star size={12} /> For You</span>
                </button>
              )}
              <button
                onClick={() => handleCategoryClick("All")}
                className={`flex-shrink-0 text-[13px] whitespace-nowrap transition-colors ${
                  activeCategory === "All"
                    ? 'text-black font-semibold border-b-2 border-black'
                    : 'text-gray-500 hover:text-black'
                }`}
              >
                ALL
              </button>
              {categories.map((item, index) => {
                const categoryName = typeof item === 'string' ? item : item.name || item.title;
                return (
                  <button
                    key={`${item}-${index}`}
                    onClick={() => handleCategoryClick(categoryName)}
                    className={`flex-shrink-0 text-[13px] whitespace-nowrap transition-colors ${
                      activeCategory === categoryName
                        ? 'text-black font-semibold border-b-2 border-black'
                        : 'text-gray-500 hover:text-black'
                    }`}
                  >
                    {categoryName}
                  </button>
                );
              })}
            </>
          )}
        </div>
      </div>

      {/* BLOGS */}
      {blogs.length > 0 ? (
        <>
          {blogs.map(blog => (
            <ArticleCard
              key={blog._id}
              id={blog._id}
              category={blog.category?.name || "Uncategorized"}
              title={blog.title}
              date={
                blog.date ||
                new Date(blog.createdAt).toLocaleString("en-US", {
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })
              }
              image={blog.image}
            />
          ))}

          {isFetching && (
            <div className="flex justify-center py-8">
              <Loader className="animate-spin text-gray-400" size={32} />
            </div>
          )}

          <div ref={observerTarget} className="h-10" />
        </>
      ) : loading ? (
        <div className="space-y-12">
          {[1, 2, 3].map(i => <ArticleCardSkeleton key={i} />)}
        </div>
      ) : (
        <div className="text-center py-16">
          <Search size={48} className="text-gray-300 mx-auto mb-4" />
          <div className="text-lg text-gray-400 font-light">No blogs found</div>
          <p className="text-sm text-gray-300 mt-4">Try adjusting your filters or search</p>
        </div>
      )}

      {showCategoryModal && (
        <CategoryModal
          categories={categories}
          onClose={() => setShowCategoryModal(false)}
          onSubmit={async (cats) => {
            try {
              await api.patch(`user/${userData._id}/favourites`, { categories: cats });
              window.location.reload(true);
            } catch (error) {
              console.error(error);
            } finally {
              setShowCategoryModal(false);
            }
          }}
        />
      )}
    </div>
  );
}