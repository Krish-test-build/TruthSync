import React, { useState, useEffect, useRef } from "react";
import api from "../api/axiosConfig";
import Lenis from "lenis";

const Comments = ({ claimId, onNoComments, onCommentAdded }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);

  const scrollRef = useRef(null);

  /* -------------------- FETCH COMMENTS -------------------- */

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await api.get(`/claim/${claimId}/comments`);
        const list = res.data.comments || [];
        setComments(list);

        if (list.length === 0 && onNoComments) {
          onNoComments();
        }
      } catch (err) {
        console.error("Error fetching comments:", err);
      }
    };

    if (claimId) fetchComments();
  }, [claimId, onNoComments]);

  /* -------------------- SMOOTH SCROLL -------------------- */

  useEffect(() => {
    if (!scrollRef.current) return;

    const lenis = new Lenis({
      wrapper: scrollRef.current,
      content: scrollRef.current,
      smooth: true,
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    const raf = (time) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);

    return () => lenis.destroy();
  }, []);

  /* -------------------- ADD COMMENT -------------------- */

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    setLoading(true);
    try {
      const res = await api.post(`/claim/${claimId}/comment`, {
        comments: newComment,
      });

      setComments((prev) => [...prev, res.data.comment]);
      setNewComment("");

      if (onCommentAdded) onCommentAdded(claimId);
    } catch (err) {
      console.error("Error posting comment:", err);
    } finally {
      setLoading(false);
    }
  };

  /* -------------------- UI -------------------- */

  return (
    <div
      className="
        w-full
        mt-2
        px-4
        py-1
        rounded-xl
        border-2 border-[#2A2F45]
        bg-[#ffffff] brightness-80
        text-sm
        font-[spaceMono]
        text-black
      "
    >
      {/* Header */}
      <div
        className="text-[34px] font-[monaco] tracking-wide"
      >
        Comments
      </div>

      {/* Comment List */}
      <div
        ref={scrollRef}
        className="
          max-h-[50vh]
          flex flex-col gap-3
          pr-2
          overflow-y-auto
          scrollbar-hide
        "
      >
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div
              key={comment._id}
              className="
                bg-[#0b0b0b]
                border-2 border-[#2A2F45]
                rounded-lg
                px-4 py-3
                shadow-sm
                flex flex-col gap-1
              "
            >
              {/* Meta */}
              <div className="flex justify-between items-center text-sm text-gray-400">
                <span className="text-purple-400 font-semibold">
                  {comment.user?.username || "Anonymous"}
                </span>
                <span>
                  {new Date(comment.createdAt).toLocaleDateString("en-GB")}
                </span>
              </div>

              {/* Body */}
              <div className="text-white text-base mt-1">
                {comment.comments}
              </div>
            </div>
          ))
        ) : (
          <div className="text-gray-400 text-sm">
            No comments yet.
          </div>
        )}
      </div>

      {/* Add Comment */}
      <div className="mt-4 flex flex-col gap-2">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write a comment..."
          rows={3}
          className="
            w-full
            resize-none
            rounded-lg
            border-2 border-[#2A2F45]
            bg-[#0F1220]
            p-3
            text-white
            placeholder:text-gray-500
            focus:outline-none
            focus:border-purple-500
            transition
          "
        />

        <button
          onClick={handleAddComment}
          disabled={loading}
          className="
            w-fit
            px-5 py-2
            rounded-full
            bg-[#7B6CFF]
            text-white
            font-semibold
            hover:scale-105
            hover:bg-[#6A5CFF]
            transition
            disabled:opacity-50
            disabled:cursor-not-allowed
          "
        >
          {loading ? "Posting..." : "Post Comment"}
        </button>
      </div>
    </div>
  );
};

export default Comments;
