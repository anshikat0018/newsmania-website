import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Bookmark, ArrowRight, Loader, Hash } from "lucide-react";
import ArticleCard from "./ArticleCard";
import api from "../api/interceptor";

const ArticleCardSkeleton = () => (
  <div className="animate-pulse space-y-4">
    <div className="h-24 bg-gray-200 rounded"></div>
    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
  </div>
);

export default function BlogByTag() {
  const navigate = useNavigate();
    const { tag } = useParams();


  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [error, setError] = useState(null);

  const observerTarget = useRef(null);

  const fetchBlogs = useCallback(async (pageNum = 1) => {
    try {
      setIsFetching(true);
      if (pageNum === 1) setLoading(true);

      const params = new URLSearchParams();
      params.append("page", pageNum);
      params.append("limit", 5);

      const response = await api.get(`web/blogs/tag/${tag}/list?${params.toString()}`);
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
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchBlogs(1);
  }, [fetchBlogs]);

  // Page change fetch
  useEffect(() => {
    if (page === 1) return;
    fetchBlogs(page);
  }, [page, fetchBlogs]);

  // Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore && !loading && !isFetching) {
          setPage(prev => prev + 1);
        }
      },
      { threshold: 1.0 }
    );
    const currentTarget = observerTarget.current;
    if (currentTarget) observer.observe(currentTarget);
    return () => { if (currentTarget) observer.unobserve(currentTarget); };
  }, [hasMore, loading, isFetching]);


  // ── Error
  if (error) return (
    <div className="text-center py-20 text-red-400 text-sm">Error: {error}</div>
  );

  // ── Loading skeletons
  if (loading) return (
    <div className="space-y-12 pt-4">
      {[1, 2, 3].map(i => <ArticleCardSkeleton key={i} />)}
    </div>
  );

  // ── Empty state
  if (!loading && blogs.length === 0) return (
    <div className="flex flex-col items-center justify-center min-h-[65vh] text-center px-4">
      <div className="w-20 h-20 rounded-full bg-gray-50 border-2 border-gray-100 flex items-center justify-center mb-6">
        <Bookmark size={34} className="text-gray-300" strokeWidth={1.5} />
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">No items yet</h2>
      <p className="text-[14px] text-gray-400 max-w-xs leading-relaxed mb-7">
        Bookmark News you want to read later — they'll show up here.
      </p>
      <button
        onClick={() => navigate("/")}
        className="inline-flex items-center gap-2 px-6 py-2.5 bg-gray-900 text-white text-[13px] font-semibold rounded-lg hover:bg-gray-800 active:scale-95 transition-all"
      >
        Browse News <ArrowRight size={14} />
      </button>
    </div>
  );

  // ── Has items
  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="flex items-center gap-2 pt-2 pb-1 border-b border-gray-100">
        <Hash size={15} className="text-amber-500 fill-amber-400" />
        <h2 className="text-[13px] font-semibold text-gray-500 uppercase tracking-widest">
          {tag || "Tag"} · ({blogs.length} results)
        </h2>
      </div>

      {/* Cards */}
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

      {/* Fetching more spinner */}
      {isFetching && (
        <div className="flex justify-center py-8">
          <Loader className="animate-spin text-gray-400" size={28} />
        </div>
      )}

      {/* End of list */}
      {!hasMore && blogs.length > 0 && (
        <div className="flex items-center gap-3 py-6">
          <div className="h-px flex-1 bg-gray-100" />
          <span className="text-amber-400 text-[10px]">◆</span>
          <div className="h-px flex-1 bg-gray-100" />
        </div>
      )}

      <div ref={observerTarget} className="h-10" />
    </div>
  );
}