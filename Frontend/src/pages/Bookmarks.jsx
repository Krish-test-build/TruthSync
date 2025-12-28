import React, { useEffect, useRef, useState } from "react";
import SideBar from "../components/SideBar";
import RightBar from "../components/RightBar";
import { FaCommentDots, FaBookmark } from "react-icons/fa";
import Comments from "../components/Comments";
import Lenis from "lenis";
import api from "../api/axiosConfig";
import { Link } from "react-router-dom";
import upvote from "../assets/upvote.svg";
import downvote from "../assets/downvote.svg";

const Bookmarks = () => {
  const [hydrated, setHydrated] = useState({});
  const [showNoCommentsPopup, setShowNoCommentsPopup] = useState(false);
  const [bookmarks, setBookmarks] = useState([]);
  const [userVotes, setUserVotes] = useState({});
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const commentsRef = useRef(null);
  const scrollRef = useRef(null);

  /* -------------------- DATA -------------------- */

  const fetchBookmarks = async () => {
    try {
      const res = await api.get("/claim/my-bookmarks");
      setBookmarks(res.data);

      const votes = {};
      res.data.forEach((claim) => {
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

  /* -------------------- SMOOTH SCROLL -------------------- */

  useEffect(() => {
    if (!scrollRef.current) return;

    const lenis = new Lenis({
      wrapper: scrollRef.current,
      content: scrollRef.current,
      smooth: true,
      duration: 1.2, // Adjusted for smoother feel
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Custom easing
    });

    const raf = (time) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);

    return () => lenis.destroy();
  }, []);

  /* -------------------- HELPERS -------------------- */

  const toggleComments = (id) => {
    setHydrated((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const showToast = (msg, type) => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => setMessage(""), 3000);
  };

  const handleVote = async (id, voteType) => {
    try {
      const res = await api.post(`/claim/${id}/vote`, { vote: voteType });
      const { message, upvote, downvote } = res.data;

      setBookmarks((prev) =>
        prev.map((c) =>
          c._id === id ? { ...c, upvote, downvote } : c
        )
      );

      setUserVotes((prev) => ({
        ...prev,
        [id]: message === "Vote removed" ? null : voteType,
      }));

      showToast(message === "Vote removed" ? "Vote removed!" : `Claim ${voteType}d!`, "success");
    } catch {
      showToast("Failed to update vote.", "error");
    }
  };

  const handleRemoveBookmark = async (id) => {
    try {
      await api.delete(`/claim/${id}/bookmark`);
      setBookmarks((prev) => prev.filter((c) => c._id !== id));
      showToast("Bookmark removed!", "success");
    } catch {
      showToast("Failed to remove bookmark.", "error");
    }
  };

  /* -------------------- UI -------------------- */

  return (
    <>
      {/* Background */}
      <div className="fixed inset-0 -z-10">
        <video
          autoPlay
          loop
          muted
          className="w-full h-full object-cover"
          src="https://video.wixstatic.com/video/f1c650_988626917c6549d6bdc9ae641ad3c444/720p/mp4/file.mp4"
        />
        <div className="absolute inset-0 bg-black/45" />
      </div>

      {/* Toast */}
      {message && (
        <div
          className={`fixed top-4 right-4 px-4 py-3 rounded-lg z-50 text-white ${
            messageType === "success" ? "bg-green-600" : "bg-red-600"
          }`}
        >
          {message}
        </div>
      )}

      <div className="h-screen w-full flex items-center p-4 pl-6.5">
        <SideBar />

        <div className="flex w-full h-full">
          {/* MAIN */}
          <div
            className="
              w-3/4 mt-2 h-[98%]
              flex flex-col
              border-4 border-[#2A2F45]
              rounded-xl
              shadow-lg shadow-purple-700/30
              ml-20
              px-8 py-4
              text-white
              font-[spaceMono]
              overflow-hidden
            "
          >
            <style>{`.scrollbar-hide::-webkit-scrollbar{display:none}`}</style>

            {/* Fixed Title */}
            <div
              className="sticky top-0 z-10  pb-4"
              style={{ textShadow: "2px 2px 3px rgba(123,108,255,0.6)" }}
            >
              <div className="text-[52px] font-[monaco] tracking-wide">
                Bookmarked Claims
              </div>
            </div>

            {/* Scrollable List with Lenis */}
            <div
              ref={scrollRef}
              className="
                flex-1
                w-full
                rounded-xl
                border-2 border-[#2A2F45]
                p-4
                flex flex-col gap-4
                scrollbar-hide
                overflow-y-auto
              "
            >
              {bookmarks.length ? (
                bookmarks.map((claim) => (
                  <div
                    key={claim._id}
                    className="
                      bg-[#151821]
                      border-2 border-[#2A2F45]
                      rounded-xl
                      px-6 py-4
                      shadow-md
                      flex flex-col gap-2
                    "
                  >
                    {/* Header */}
                    <div className="flex justify-between items-center">
                      <Link to={`/claim/${claim._id}`}>
                        <h1
                          className="text-[42px] font-[monaco] text-gray-200"
                        >
                          {claim.title}
                        </h1>
                      </Link>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleVote(claim._id, "upvote")}
                          className={`flex items-center gap-1 px-3 py-1 rounded-full hover:cursor-pointer bg-[#2A2F45] hover:scale-105 transition ${
                            userVotes[claim._id] === "upvote" ? "bg-purple-600" : ""
                          }`}
                        >
                          <img src={upvote} className="h-4 w-4" />
                          {claim.upvote || 0}
                        </button>

                        <button
                          onClick={() => handleVote(claim._id, "downvote")}
                          className={`flex items-center gap-1 px-3 py-1 rounded-full hover:cursor-pointer bg-[#2A2F45] hover:scale-105 transition ${
                            userVotes[claim._id] === "downvote" ? "bg-purple-600" : ""
                          }`}
                        >
                          <img src={downvote} className="h-4 w-4" />
                          {claim.downvote || 0}
                        </button>

                        <button
                          onClick={() => handleRemoveBookmark(claim._id)}
                          className="p-2 rounded-full bg-[#7B6CFF] hover:scale-110 hover:cursor-pointer transition"
                        >
                          <FaBookmark className="h-4 w-4 text-white bg-[#7B6CFF]" />
                        </button>
                      </div>
                    </div>

                    {/* Meta */}
                    <div className="text-sm text-gray-400 -mt-3">
                      Posted on{" "}
                      {new Date(claim.createdAt || claim.date).toLocaleDateString("en-GB")} by{" "}
                      {claim.isAnonymous ? "Anonymous" : claim.user?.username}
                    </div>

                    {/* Body */}
                    <div className="text-lg text-white">{claim.description}</div>

                    {/* Media */}
                    {claim.image ? (
                  claim.image.endsWith('.mp4') ? (
                    <video
                      src={`${import.meta.env.VITE_BASE_URL}${claim.image}`}
                      controls
                      className="w-full h-32 rounded-md object-cover"
                    />
                  ) : (
                    <img
                      src={`${import.meta.env.VITE_BASE_URL}${claim.image}`}
                      className="w-full h-32 rounded-md object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none'
                      }}
                    />
                  )
                ) : (
                  <div className="w-full h-50 rounded-md bg-[#1E2230]" />
                )}

                    {/* Comments */}
                    <button
                      onClick={() => toggleComments(claim._id)}
                      className="
                        mt-3 w-fit
                        flex items-center gap-2
                        px-4 py-2
                        rounded-full
                        bg-[#7B6CFF]
                        text-white
                        hover:scale-105
                        hover:cursor-pointer
                        transition
                      "
                    >
                      <FaCommentDots className="h-4 w-4" />
                      {claim.comments || ' '} Comments
                    </button>

                    {hydrated[claim._id] && (
                      <div ref={commentsRef} className="-mt-2">
                        <Comments
                          claimId={claim._id}
                          onNoComments={() => setShowNoCommentsPopup(true)}
                          onCommentAdded={fetchBookmarks}
                        />
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-white">No bookmarked claims yet.</div>
              )}
            </div>
          </div>

          <RightBar />
        </div>
      </div>

      {/* No comments popup */}
      {showNoCommentsPopup && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-lg font-bold mb-4">No Comments Yet</h2>
            <p>This claim has no comments yet.</p>
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