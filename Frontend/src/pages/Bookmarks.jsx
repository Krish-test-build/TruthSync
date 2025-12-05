import React, { useEffect, useRef, useState } from "react";
import SideBar from "../components/SideBar";
import RightBar from "../components/RightBar";
import { FaCommentDots, FaBookmark } from "react-icons/fa";
import Comments from "../components/Comments";
import Lenis from "lenis";
import api from '../api/axiosConfig';
import { Link } from "react-router-dom";
import upvote from '../assets/upvote.svg';
import downvote from '../assets/downvote.svg';

const Bookmarks = () => {
  const [hydrated, setHydrated] = useState({});
  const [showNoCommentsPopup, setShowNoCommentsPopup] = useState(false);
  const [bookmarks, setBookmarks] = useState([]);
  const [userVotes, setUserVotes] = useState({}); // { claimId: 'upvote' | 'downvote' | null }
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'
  const commentsRef = useRef(null);
  const scrollRef = useRef();

  const fetchBookmarks = async () => {
    try {
      const res = await api.get('/claim/my-bookmarks');
      setBookmarks(res.data);
      // Set user votes from response
      const votes = {};
      res.data.forEach(claim => {
        votes[claim._id] = claim.userVote || null;
      });
      setUserVotes(votes);
    } catch (err) {
      console.error("Error fetching bookmarks:", err);
    }
  };

  useEffect(() => {
    fetchBookmarks();
  }, []);

  useEffect(() => {
    if (!scrollRef.current) return;

    const lenis = new Lenis({
      wrapper: scrollRef.current,
      content: scrollRef.current,
      smooth: true,
      duration: 2,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  const toggleComments = (id) => {
    setHydrated((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const showMessage = (msg, type) => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => setMessage(''), 3000);
  };

  const handleVote = async (id, voteType) => {
    try {
      const res = await api.post(`/claim/${id}/vote`, { vote: voteType });
      const { message, upvote, downvote } = res.data;
      setBookmarks((prev) =>
        prev.map((claim) =>
          claim._id === id ? { ...claim, upvote, downvote } : claim
        )
      );
      if (message === 'Vote removed') {
        setUserVotes((prev) => ({ ...prev, [id]: null }));
        showMessage('Vote removed!', 'success');
      } else {
        setUserVotes((prev) => ({ ...prev, [id]: voteType }));
        showMessage(`Claim ${voteType}d!`, 'success');
      }
    } catch (err) {
      console.error("Error voting:", err);
      showMessage('Failed to update vote.', 'error');
    }
  };

  const handleUpvote = (id) => handleVote(id, 'upvote');
  const handleDownvote = (id) => handleVote(id, 'downvote');

  const handleRemoveBookmark = async (id) => {
    try {
      await api.delete(`/claim/${id}/bookmark`);
      setBookmarks((prev) => prev.filter((claim) => claim._id !== id));
      showMessage('Bookmark removed!', 'success');
    } catch (err) {
      console.error("Error removing bookmark:", err);
      showMessage('Failed to remove bookmark.', 'error');
    }
  };

  return (
    <>
      <div className="fixed top-0 left-0 w-full h-screen -z-10">
        <video
          autoPlay
          loop
          muted
          className="w-full h-full object-cover"
          src="https://video.wixstatic.com/video/f1c650_988626917c6549d6bdc9ae641ad3c444/720p/mp4/file.mp4"
        />
      </div>

      {message && (
        <div className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 ${messageType === 'success' ? 'bg-green-500' : 'bg-red-500'} text-white`}>
          {message}
        </div>
      )}

      <div className="h-screen w-full flex items-center p-4 pl-6.5">
        <SideBar />

        <div className="flex w-full h-full">
          <div className="w-3/4 mt-2 h-[98%] flex flex-col border-4 border-white text-white px-8 py-2 pb-5 rounded-3xl shadow-lg shadow-purple-800 ml-20 bg-transparent overflow-y-auto scrollbar-hide font-[spaceMono]">
            <style>{`.scrollbar-hide::-webkit-scrollbar { display: none; }`}</style>

            <div
              className="text-[55px] tracking-wide font-bold -mt-2 flex items-start justify-start font-[monaco]"
              style={{ textShadow: "3px 3px 2.5px #51E5F8" }}
            >
              Bookmarked Claims
            </div>

            <div className="absolute top-27 rounded-3xl h-125.5 w-[59%] bg-gradient-to-b from-gray-400 to-black opacity-30 z-0"></div>

            <div
              ref={scrollRef}
              className="w-full tracking-wide rounded-3xl border-5 border-cyan-400 z-2 flex flex-col gap-4 text-black shadow-md -mb-2 shadow-cyan-500 overflow-y-auto p-4 bg-transparent scrollbar-hide"
            >
              {bookmarks.length > 0 ? (
                bookmarks.map((claim) => (
                  <div
                    key={claim._id}
                    className="bg-transparent bg-opacity-20 rounded-3xl px-6 py-4 border-4 border-white shadow-xl flex flex-col gap-2 h-full transition duration-300 ease-in-out"
                  >
                    <div className="flex flex-row items-center justify-between">
                      <Link to={`/claim/${claim._id}`}>
                        <h1 className="text-[50px] tracking-wide text-gray-200 font-bold font-[monaco]" style={{ textShadow: '2px 2.5px 3px #51E5F8' }}>
                          {claim.title}
                        </h1>
                      </Link>
                      <div className="flex flex-row items-center space-x-2">
                        <button
                          className={`flex flex-row p-2 rounded-full hover:cursor-pointer transition-all ease-in-out delay-50 hover:scale-105 ${userVotes[claim._id] === 'upvote' ? 'bg-red-900' : 'bg-red-700 hover:bg-red-600'}`}
                          onClick={() => handleUpvote(claim._id)}
                        >
                          <img src={upvote} alt="Upvote" className="h-4 w-4 mr-1 mt-0.5" /> {claim.upvote || 0}
                        </button>
                        <button
                          className={`p-2 flex flex-row rounded-full hover:cursor-pointer transition-all ease-in-out delay-50 hover:scale-105 ${userVotes[claim._id] === 'downvote' ? 'bg-gray-900' : 'bg-white hover:bg-gray-300 text-black'}`}
                          onClick={() => handleDownvote(claim._id)}
                        >
                          <img src={downvote} alt="Downvote" className="h-4 w-4 mr-1 mt-0.5" /> {claim.downvote || 0}
                        </button>
                        <button
                          onClick={() => handleRemoveBookmark(claim._id)}
                          className="bg-blue-500 p-2 rounded-full hover:bg-blue-600 hover:scale-110 transition text-white"
                        >
                          <FaBookmark className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    <div className="text-sm text-gray-300 -mt-4 mb-4">
                      Posted on {new Date(claim.createdAt || claim.date).toLocaleDateString('en-GB')} by {claim.isAnonymous ? 'Anonymous' : claim.user?.username}
                    </div>

                    <div className="text-lg text-white">{claim.description}</div>

                    {claim.image && (
                      <div className="w-full flex justify-center items-center mt-2">
                        <img
                          src={`${import.meta.env.VITE_BASE_URL}${claim.image}`}
                          alt="Claim Media"
                          className="max-h-64 rounded-xl border-2 border-white shadow-lg"
                        />
                      </div>
                    )}

                    <div className="flex items-center gap-5 mt-3">
                      <button
                        onClick={() => toggleComments(claim._id)}
                        className="flex items-center gap-2 bg-blue-700 p-2 rounded-full hover:bg-blue-600 hover:scale-110 tracking-wide hover:cursor-pointer transition text-white font-bold"
                      >
                        <FaCommentDots className="h-4 w-4" /> {claim.comments || 0} Comments
                      </button>
                    </div>

                    {hydrated[claim._id] && (
                      <div ref={commentsRef} className="-mt-2 z-5">
                        <Comments claimId={claim._id} onNoComments={() => setShowNoCommentsPopup(true)} onCommentAdded={fetchBookmarks} />
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-white">No bookmarked claims yet.</div>
              )}
            </div>
          </div>

          <div className="flex h-full">
            <RightBar />
          </div>
        </div>
      </div>

      {showNoCommentsPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-lg font-bold mb-4">No Comments Yet</h2>
            <p>This claim has no comments yet. Be the first to add one!</p>
            <button
              onClick={() => setShowNoCommentsPopup(false)}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Bookmarks;