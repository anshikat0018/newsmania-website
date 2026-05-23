import {useState, useEffect} from 'react';
import { Home, Bookmark, User, Search, Heart } from 'lucide-react';
import { Outlet } from "react-router-dom";
import { Link, useNavigate } from 'react-router-dom';
import { useDebounce } from './hooks/useDebounce';

import api from './api/interceptor';

import NavItem from './pages/NavItem';
import RecentPick from './pages/RecentPick';

const Layout = ({user}) => {
  const [recentBlogs, setRecentBlogs] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [error, setError] = useState(null);

  const [searchInput, setSearchInput] = useState('');
  const debouncedSearchValue = useDebounce(searchInput, 500); 

  // console.log("LOGGEDIN USER:",user.name); 

  const navigate = useNavigate();

  const searchData = async () => {
      try {
        const blogsResponse = await api.get(`web/blogs?limit=5&search=${debouncedSearchValue}`);
        const blogsList = blogsResponse.data?.data || blogsResponse.data || [];
        setSearchResults(Array.isArray(blogsList) ? blogsList : []);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.message);
      }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const blogsResponse = await api.get(`web/blogs?limit=5&search=${debouncedSearchValue}`);
        const blogsList = blogsResponse.data?.data || blogsResponse.data || [];
        setRecentBlogs(Array.isArray(blogsList) ? blogsList : []);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.message);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (debouncedSearchValue) {
      console.log('API call with:', debouncedSearchValue);
      // API call karo yahan
      searchData(debouncedSearchValue)
    }
  }, [debouncedSearchValue]);

  const handleLogout = async() => {
    if(!window.confirm("Do you want to Sign Out ?")) return;
    try {
      await api.post("auth/logout");
      window.location.replace('/');
    } catch (error) {
      console.log(error.message);
    }
    
  };

if (error) {
    return (
      <div className="min-h-screen bg-black bg-opacity-90 flex items-center justify-center hidden">
        <div className="text-center">
          <div className="text-red-500 text-lg font-semibold mb-2">Error Occured</div>
          <p className="text-gray-500 text-sm mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-black-600 text-white px-4 py-2 rounded-lg hover:bg-white hover:text-black"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans text-[#242424]">
      {/* --- TOP NAVIGATION BAR --- */}
      <header className="flex items-center justify-between px-6 py-2 border-b border-gray-100 sticky top-0 bg-white z-50">
        <div className="flex items-center gap-2">
          <span className="text-3xl font-bold tracking-tight">NewsMania</span>
        </div>
        <div className="flex justify-center flex-1 mx-4">
          <div className="relative group w-full max-w-md">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            <input
              placeholder="Search"
              className="w-full bg-[#f9f9f9] py-2 pl-10 pr-4 rounded-full text-sm outline-none border border-transparent focus:border-gray-200"
              type="search"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onBlur={() => setTimeout(() => setSearchResults([]), 150)}
            />

            {debouncedSearchValue && (
              <div className="absolute top-full mt-1.5 left-0 right-0 bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden z-50">
                {searchResults.length > 0 ? (
                  searchResults.map((blog) => (
                    <div
                      key={blog._id}
                      onClick={() => {
                        setSearchInput("");
                        navigate(`/article/${blog._id}`)
                      }}
                      className="flex items-center justify-between px-4 py-2.5 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-none"
                    >
                      <span className="text-sm text-gray-800">{blog.title}</span>
                      <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                        {blog.category?.name}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="px-4 py-3 text-sm text-gray-400">No results found</div>
                )}
              </div>
            )}
          </div>
        </div>
        {
          user ?
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold cursor-pointer hover:bg-purple-700 transition">
                {user?.name.charAt(0)}
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-gray-900">{user.name}</p>
                <p className="text-xs text-gray-500">{user.email}</p>
              </div>
            </div>
            <button 
              onClick={() => handleLogout()}
              className="px-4 py-1.5 border border-red-300 rounded-full text-sm font-medium text-red-700 hover:bg-red-50 transition hidden sm:block">
              Sign out
            </button>
          </div> :
          <div className="flex items-center space-x-4">
            <Link 
              to={`sign-in`}
              className="px-4 py-1.5 border border-gray-300 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-50 transition hidden sm:block">
              Sign In
            </Link>
          </div> 
        }
      </header>

      <div className="flex w-full mx-auto max-w-7xl">
        {/* LEFT SIDEBAR */}
        <aside className="hidden md:flex w-20 lg:w-64 border-r border-gray-100 flex-col items-center lg:items-start p-4 sticky top-[57px] h-[calc(100vh-57px)]">
          <nav className="space-y-6 w-full">
            <NavItem icon={<Home size={24} />} label="Home" active />
            <NavItem icon={<Bookmark size={24} />} label="Saved" />
            <NavItem icon={<Heart size={24} />} label="Liked" />
            <NavItem icon={<User size={24} />} label="Profile" />
          </nav>
        </aside>

        {/* CENTER FEED */}
        <main className="flex-1 max-w-2xl px-6 py-4">
          <Outlet context={{ userData: user }}/>
        </main>

        {/* RIGHT SIDEBAR */}
        <aside className="hidden lg:block w-96 p-10 border-l border-gray-100 sticky top-[57px] h-[calc(100vh-57px)] overflow-y-auto">
          <h3 className="font-bold text-sm mb-4">Recent Picks</h3>
          <div className="space-y-5">
            {recentBlogs.length > 0 ? (
              recentBlogs.map((blog) => (
                <RecentPick
                  key={blog._id || blog.id}
                  id={blog._id}
                  title={blog.title}
                  date={new Date(blog.createdAt).toLocaleString('en-US', { 
                    month: 'short', 
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                />
              ))
            ) : (
              <p className="text-sm text-gray-400">No recent picks</p>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Layout;