import { useState, useEffect } from 'react';
import {
  Bookmark,
  Heart, Calendar, LayoutGrid, Clock
} from 'lucide-react';
import { useParams,useOutletContext } from 'react-router-dom';
import api from '../api/interceptor';

/* ─── tiny helpers ─────────────────────────────────────── */
const fmt = (iso) =>
  new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  });

/* ─── Loading skeleton ─────────────────────────────────── */
const Skeleton = () => (
  <div className="animate-pulse space-y-6 pt-10">
    <div className="h-3 bg-gray-100 rounded w-28" />
    <div className="space-y-3">
      <div className="h-8 bg-gray-100 rounded w-full" />
      <div className="h-8 bg-gray-100 rounded w-3/4" />
    </div>
    <div className="h-3 bg-gray-100 rounded w-48" />
    <div className="h-[420px] bg-gray-100 rounded-xl w-full" />
    <div className="space-y-3 pt-4">
      {[...Array(6)].map((_, i) => (
        <div key={i} className={`h-3 bg-gray-100 rounded ${i % 5 === 4 ? 'w-2/3' : 'w-full'}`} />
      ))}
    </div>
  </div>
);

/* ─── Main Component ───────────────────────────────────── */
const Article = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saved, setSaved] = useState(false);
  const [liked, setLiked] = useState(false);


  const { userData } = useOutletContext();

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true);
        const response = await api.get(`web/blogs/${id}`);
        setBlog(response.data?.data || response.data);
        (userData?.liked.includes(response.data?.data._id)) &&  setLiked(true);
        (userData?.saved.includes(response.data?.data._id)) &&  setSaved(true);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchArticle();
  }, [id]);

  /* ── states ── */
  if (loading) return <Skeleton />;

  if (error) return (
    <div className="flex flex-col items-center justify-center py-32 text-center">
      <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mb-4">
        <span className="text-red-400 text-xl">!</span>
      </div>
      <p className="text-sm text-red-400 font-medium">Failed to load article</p>
      <p className="text-xs text-gray-400 mt-1">{error}</p>
    </div>
  );

  if (!blog) return (
    <div className="flex flex-col items-center justify-center py-32 text-center">
      <p className="text-gray-400 text-sm">Article not found</p>
    </div>
  );

  return (
    <>
      {/* Google Font */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,800;1,700&family=Lora:ital@0;1&display=swap');

        .article-title { font-family: 'Playfair Display', Georgia, serif; }
        .article-body  { font-family: 'Lora', Georgia, serif; }

        .article-body p          { margin-bottom: 1.6rem; line-height: 1.9; font-size: 1.0625rem; color: #1a1a1a; }
        .article-body h2         { font-family: 'Playfair Display', serif; font-size: 1.6rem; font-weight: 700; margin: 2.5rem 0 1rem; color: #111; }
        .article-body h3         { font-family: 'Playfair Display', serif; font-size: 1.25rem; font-weight: 700; margin: 2rem 0 0.75rem; color: #111; }
        .article-body blockquote { border-left: 3px solid #d4a847; padding: 0.5rem 0 0.5rem 1.5rem; margin: 2rem 0; font-style: italic; color: #555; font-size: 1.1rem; }
        .article-body a          { color: #b8860b; text-decoration: underline; text-underline-offset: 3px; }
        .article-body ul, .article-body ol { padding-left: 1.5rem; margin-bottom: 1.5rem; }
        .article-body li         { margin-bottom: 0.5rem; line-height: 1.8; }
        .article-body img        { border-radius: 0.5rem; width: 100%; margin: 1.5rem 0; }

        .toolbar-btn { transition: color 0.2s, transform 0.15s; }
        .toolbar-btn:hover { color: #111; transform: scale(1.1); }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-up { animation: fadeUp 0.55s ease both; }
        .fade-up-2 { animation: fadeUp 0.55s 0.1s ease both; }
        .fade-up-3 { animation: fadeUp 0.55s 0.2s ease both; }
        .fade-up-4 { animation: fadeUp 0.55s 0.32s ease both; }
      `}</style>

      <article className="max-w-2xl mx-auto px-4 pb-24">

        {/* ── Category + Date ── */}
        <div className="fade-up flex items-center gap-3 pt-10 pb-5">
          <span className="inline-flex items-center gap-1.5 bg-amber-50 border border-amber-200 text-amber-700 text-[10.5px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full">
            <LayoutGrid size={9} />
            {blog.category?.name || 'Uncategorized'}
          </span>
          <span className="w-1 h-1 rounded-full bg-gray-300 block" />
          <span className="flex items-center gap-1.5 text-[12px] text-gray-400">
            <Calendar size={12} />
            {fmt(blog.createdAt)}
          </span>
          {blog.readTime && (
            <>
              <span className="w-1 h-1 rounded-full bg-gray-300 block" />
              <span className="flex items-center gap-1.5 text-[12px] text-gray-400">
                <Clock size={12} />
                {blog.readTime} min read
              </span>
            </>
          )}
        </div>

        {/* ── Title ── */}
        <h1 className="article-title fade-up-2 text-[2.1rem] sm:text-[2.7rem] font-extrabold leading-[1.18] tracking-[-0.01em] text-gray-950 mb-6">
          {blog.title}
        </h1>

        {/* ── Divider ── */}
        <div className="fade-up-3 flex items-center gap-3 mb-8">
          <div className="h-px flex-1 bg-gray-100" />
          <span className="text-amber-400 text-xs">◆</span>
          <div className="h-px flex-1 bg-gray-100" />
        </div>

        {/* ── Hero Image ── */}
        {blog.image && (
          <div className="fade-up-3 relative w-full h-[380px] sm:h-[460px] overflow-hidden rounded-2xl mb-10 bg-gray-100 shadow-sm">
            <img
              src={`http://localhost:5000${blog.image}`}
              alt={blog.title}
              className="w-full h-full object-cover"
            />
            {/* subtle vignette */}
            <div className="absolute inset-0 rounded-2xl shadow-[inset_0_-60px_80px_rgba(0,0,0,0.08)]" />
          </div>
        )}

        {/* ── Engagement Toolbar ── */}
        <div className="fade-up-4 flex items-center justify-between py-3.5 px-4 mb-10 border-y border-gray-100  text-gray-400 text-[13px]">
          <div className="flex items-center gap-5">
            <button
              disabled={!userData}
              onClick={async() => {
                  {
                    typeof userData !==null  && 
                    setLiked(v => !v)
                    try {
                      { liked ? setBlog({
                        ...blog,
                        likes: blog.likes - 1
                      }) :
                      setBlog({
                        ...blog,
                        likes: blog.likes + 1
                      })
                    }
                      await api.patch(`user/${userData._id}/liked`, { blogId: blog._id });
                      await api.patch(`web/blogs/${blog._id}/like`, { action: liked ? "dec" : "inc" });
                    } catch (error) {
                      console.error(error);
                    } 
                  }
              }}
              className={`toolbar-btn flex items-center gap-1.5 ${liked ? 'text-rose-500' : ''}`}
            >
              <Heart size={28} className={liked ? 'fill-rose-500' : ''} />
              <span>{blog.likes}</span>
            </button>
          </div>

          <div className="flex items-center gap-4">
            <button
              disabled={!userData}
              onClick={async() => {
                {
                  typeof userData !== null &&
                  setSaved(v => !v)
                  try {
                      { saved ? setBlog({
                        ...blog,
                        saves: blog.saves - 1
                      }) :
                      setBlog({
                        ...blog,
                        saves: blog.saves + 1
                      })
                    }
                      await api.patch(`user/${userData._id}/saved`, { blogId: blog._id });
                      await api.patch(`web/blogs/${blog._id}/save`, { action: saved ? "dec" : "inc" });
                    } catch (error) {
                      console.error(error);
                    } 
                }
              }}
              className={`toolbar-btn ${saved ? 'text-black' : ''}`}
              title="Bookmark"
            >
              <Bookmark size={28} className={saved ? 'fill-black' : ''} />
              {/* <span>{blog.saves}</span> */}
            </button>
          </div>
        </div>

        {/* ── Article Body ── */}
        <div
          className="article-body fade-up-4"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />
        {blog.tags?.map((tag, index) => (
          <span
            onClick={() => window.location.replace(`/blogs/tag/${tag}`)}
            key={index}
            className="inline-flex items-center cursor-pointer hover:text-blue-600 rounded-md bg-blue-400/10 px-2 py-1 text-xs font-medium text-blue-400 inset-ring inset-ring-blue-400/30 me-2"
          >
            #{tag}
          </span>
        ))}


        {/* ── End mark ── */}
        <div className="flex items-center gap-3 mt-16 mb-4">
          <div className="h-px flex-1 bg-gray-100" />
          <span className="text-amber-400 text-xs">◆</span>
          <div className="h-px flex-1 bg-gray-100" />
        </div>

      </article>
    </>
  );
};

export default Article;