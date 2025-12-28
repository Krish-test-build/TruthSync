import React, { useEffect, useRef, useState } from "react";
import SideBar from "../components/SideBar";
import RightBar from "../components/RightBar";
import { FaCommentDots, FaEdit, FaTrash } from "react-icons/fa";
import Comments from "../components/Comments";
import Lenis from "lenis";
import api from "../api/axiosConfig";
import { Link } from "react-router-dom";
import upvote from "../assets/upvote.svg";
import downvote from "../assets/downvote.svg";

const MyClaims = () => {
  // State management
  const [hydrated, setHydrated] = useState({});
  const [showNoCommentsPopup, setShowNoCommentsPopup] = useState(false);
  const [claims, setClaims] = useState([]);
  const [userVotes, setUserVotes] = useState({});
  const [commentCounts, setCommentCounts] = useState({}); // Track accurate comment counts
  const [editingClaim, setEditingClaim] = useState(null);
  const [editForm, setEditForm] = useState({ title: "", description: "" });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [shownNoCommentsFor, setShownNoCommentsFor] = useState(new Set()); // Prevent popup loop

  // Refs
  const commentsRef = useRef(null);
  const scrollRef = useRef(null);

  // Fetch claims on mount
  useEffect(() => {
    const fetchClaims = async () => {
      try {
        const res = await api.get("/claim/my-claims");
        setClaims(res.data);
        const votes = {};
        res.data.forEach((claim) => {
          votes[claim._id] = claim.userVote || null;
        });
        setUserVotes(votes);
        // Initialize comment counts
        const counts = {};
        res.data.forEach((claim) => {
          counts[claim._id] = claim.comments || 0;
        });
        setCommentCounts(counts);
      } catch (err) {
        console.error("Error fetching claims:", err);
        showMessage("Failed to load claims.", "error");
      }
    };
    fetchClaims();
  }, []);

  // Lenis smooth scrolling setup
  useEffect(() => {
    if (!scrollRef.current) return;
    const lenis = new Lenis({
      wrapper: scrollRef.current,
      content: scrollRef.current,
      smooth: true,
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });
    const raf = (time) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
    return () => lenis.destroy();
  }, []);

  // Utility functions
  const toggleComments = async (id) => {
    setHydrated((prev) => ({ ...prev, [id]: !prev[id] }));
    // Fetch accurate comment count when opening comments
    if (!hydrated[id]) {
      try {
        const res = await api.get(`/claim/comments/${id}`);
        const count = res.data.comments ? res.data.comments.length : 0;
        setCommentCounts((prev) => ({ ...prev, [id]: count }));
      } catch (err) {
        console.error("Error fetching comment count:", err);
      }
    }
  };

  const showMessage = (msg, type) => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => setMessage(""), 3000);
  };

  // Voting handlers
  const handleVote = async (id, voteType) => {
    try {
      const res = await api.post(`/claim/${id}/vote`, { vote: voteType });
      const { message, upvote: newUpvote, downvote: newDownvote } = res.data;
      setClaims((prev) =>
        prev.map((claim) =>
          claim._id === id ? { ...claim, upvote: newUpvote, downvote: newDownvote } : claim
        )
      );
      if (message === "Vote removed") {
        setUserVotes((prev) => ({ ...prev, [id]: null }));
        showMessage("Vote removed!", "success");
      } else {
        setUserVotes((prev) => ({ ...prev, [id]: voteType }));
        showMessage(`Claim ${voteType}d!`, "success");
      }
    } catch (err) {
      console.error("Error voting:", err);
      showMessage("Failed to update vote.", "error");
    }
  };

  const handleUpvote = (id) => handleVote(id, "upvote");
  const handleDownvote = (id) => handleVote(id, "downvote");

  // Edit handlers
  const handleEdit = (claim) => {
    setEditingClaim(claim._id);
    setEditForm({ title: claim.title, description: claim.description });
  };

  const handleEditSubmit = async () => {
    if (!editingClaim) {
      showMessage("No claim selected for editing.", "error");
      return;
    }
    try {
      const res = await api.put(`/claim/update-claim/${editingClaim}`, editForm); // Fixed: Use editingClaim
      const updated = res.data.claim;
      setClaims((prev) =>
        prev.map((claim) => (claim._id === editingClaim ? updated : claim))
      );
      setEditingClaim(null);
      setEditForm({ title: "", description: "" }); // Reset form
      showMessage("Claim updated successfully!", "success");
    } catch (err) {
      console.error("Error updating claim:", err);
      if (err.response?.status === 401 || err.response?.status === 403) {
        showMessage("Unauthorized: You may not own this claim or need to log in again.", "error");
      } else {
        showMessage("Failed to update claim. Please try again.", "error");
      }
    }
  };

  // Delete handlers
  const handleDelete = async (id) => {
    if (!id) {
      showMessage("No claim selected for deletion.", "error");
      return;
    }
    try {
      await api.delete(`/claim/delete-claim/${id}`);
      setClaims((prev) => prev.filter((c) => c._id !== id));
      setShowDeleteConfirm(null);
      showMessage("Claim deleted successfully!", "success");
    } catch (err) {
      console.error("Error deleting claim:", err);
      if (err.response?.status === 401 || err.response?.status === 403) {
        showMessage("Unauthorized: You may not own this claim or need to log in again.", "error");
      } else {
        showMessage("Failed to delete claim. Please try again.", "error");
      }
    }
  };

  // Comment handlers
  const handleCommentAdded = (claimId) => {
    setCommentCounts((prev) => ({ ...prev, [claimId]: (prev[claimId] || 0) + 1 }));
    setShownNoCommentsFor((prev) => {
      const newSet = new Set(prev);
      newSet.delete(claimId);
      return newSet;
    });
  };

  const handleNoComments = (claimId) => {
    if (!shownNoCommentsFor.has(claimId)) {
      setShowNoCommentsPopup(true);
      setShownNoCommentsFor((prev) => new Set(prev).add(claimId));
    }
  };

  return (
    <>
      {/* Background Video */}
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

      {/* Toast Message */}
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
          {/* Main Panel */}
          <div
            className="
              w-3/4 mt-2 h-[98%]
              flex flex-col
              px-8 py-4
              ml-20
              rounded-xl
              border-4 border-[#2A2F45]
              bg-transparent
              text-white
              shadow-lg shadow-purple-700/25
              overflow-hidden
              font-[spaceMono]
            "
          >
            <style>{`.scrollbar-hide::-webkit-scrollbar { display: none; }`}</style>
            <div
              className="text-[52px] font-[monaco] tracking-wide"
              style={{ textShadow: "2px 2px 3px rgba(123,108,255,0.6)" }}
            >
              My Claims
            </div>
            <div
              ref={scrollRef}
              className="
                w-full mt-4
                rounded-xl
                border-2 border-[#2A2F45]
                p-4
                flex flex-col gap-4
                bg-transparent
                scrollbar-hide
                overflow-y-auto
              "
            >
              {claims.length > 0 ? (
                claims
              .filter((claim) => claim.status === 'Approved')
              .map((claim) => (
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
                  <div className="flex items-start justify-between">
                    <Link to={`/claim/${claim._id}`}>
                      <h1
                        className="text-[40px] font-[monaco] text-gray-200"
                        style={{ textShadow: '2px 2px 3px rgba(123,108,255,0.5)' }}
                      >
                        {claim.title}
                      </h1>
                    </Link>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleUpvote(claim._id)}
                        className={`flex items-center gap-1 px-3 py-1.5 rounded-full transition-all duration-150 ease-in-out ${
                          userVotes[claim._id] === 'upvote'
                            ? 'bg-purple-600'
                            : 'bg-[#1E2230] hover:bg-[#2A2F45] hover:cursor-pointer'
                        }`}
                      >
                        <img src={upvote} className="h-4 w-4" />
                        {claim.upvote || 0}
                      </button>

                      <button
                        onClick={() => handleDownvote(claim._id)}
                        className={`flex items-center gap-1 px-3 py-1.5 rounded-full transition-all duration-150 ease-in-out ${
                          userVotes[claim._id] === 'downvote'
                            ? 'bg-purple-600'
                            : 'bg-[#1E2230] hover:bg-[#2A2F45] hover:cursor-pointer'
                        }`}
                      >
                        <img src={downvote} className="h-4 w-4" />
                        {claim.downvote || 0}
                      </button>

                      <button
                        onClick={() => handleEdit(claim)}
                        className="bg-[#1E2230] p-2 rounded-full hover:cursor-pointer hover:bg-[#2A2F45] transition-all duration-150 ease-in-out"
                      >
                        <FaEdit />
                      </button>

                      <button
                        onClick={() => setShowDeleteConfirm(claim._id)}
                        className="bg-[#1E2230] p-2 rounded-full hover:bg-red-600 hover:cursor-pointer transition-all duration-150 ease-in-out"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>

                  <div className="text-sm text-gray-400">
                    Posted on{' '}
                    {new Date(claim.createdAt || claim.date).toLocaleDateString('en-GB')}{' '}
                    by {claim.isAnonymous ? 'Anonymous' : claim.user?.username}
                  </div>

                  <div className="text-gray-200 text-lg">{claim.description}</div>

                  {/* Media spacer (always present) */}
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

                  <button
                    onClick={() => toggleComments(claim._id)}
                    className="
                      mt-3 w-fit
                      px-4 py-1.5
                      rounded-full opacity-90
                      bg-[#7B6CFF]
                      hover:bg-[#2A2F45] hover:cursor-pointer
                      flex items-center gap-2
                      transition-all duration-150 ease-in-out
                    "
                  >
                    <FaCommentDots /> {commentCounts[claim._id] || ' '} Comments
                  </button>

                  {hydrated[claim._id] && (
                    <div ref={commentsRef}>
                      <Comments
                        claimId={claim._id}
                        onNoComments={() => handleNoComments(claim._id)}
                        onCommentAdded={handleCommentAdded}
                      />
                    </div>
                  )}
                </div>
              ))
              ) : (
                <div className="text-gray-400">No claims yet.</div>
              )}
            </div>
          </div>
          <RightBar />
        </div>
      </div>

      {/* Popups */}
      {showNoCommentsPopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="font-bold mb-2">No Comments Yet</h2>
            <p>Be the first to comment.</p>
            <button
              onClick={() => setShowNoCommentsPopup(false)}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 hover:cursor-pointer transition-all duration-150 ease-in-out"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {editingClaim && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="font-bold mb-4 ">Edit Claim</h2>
            <input
              value={editForm.title}
              onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
              className="w-full p-2 mb-2 border rounded"
            />
            <textarea
              value={editForm.description}
              onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
              className="w-full p-2 mb-4 border rounded"
              rows={4}
            />
            <div className="flex gap-2">
              <button
                onClick={handleEditSubmit}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 hover:cursor-pointer transition-all duration-150 ease-in-out"
              >
                Save
              </button>
              <button
                onClick={() => setEditingClaim(null)}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 hover:cursor-pointer transition-all duration-150 ease-in-out"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg">
            <h2 className="font-bold mb-2">Confirm Delete</h2>
            <p>This action cannot be undone.</p>
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => handleDelete(showDeleteConfirm)}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 hover:cursor-pointer transition-all duration-150 ease-in-out"
              >
                Delete
              </button>
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 hover:cursor-pointer transition-all duration-150 ease-in-out"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MyClaims;