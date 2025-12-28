import React, { useEffect, useRef, useState } from 'react';
import SideBar from '../components/SideBar';
import RightBar from '../components/RightBar';
import { Link } from 'react-router-dom';
import Lenis from 'lenis';
import api from '../api/axiosConfig';

const MyComments = () => {
  const [comments, setComments] = useState([]);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const scrollRef = useRef(null);

  const showMessage = (msg, type) => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => setMessage(''), 3000);
  };

  const fetchComments = async () => {
    try {
      const res = await api.get('/claim/my-comments');
      setComments(res.data);
    } catch (err) {
      console.error('Error fetching comments:', err);
      showMessage('Failed to load comments', 'error');
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;
    try {
      await api.delete(`/claim/delete-comment/${id}`);
      setComments((prev) => prev.filter((comment) => comment._id !== id));
      showMessage('Comment deleted successfully', 'success');
    } catch (err) {
      console.error('Error deleting comment:', err);
      showMessage('Failed to delete comment', 'error');
    }
  };

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
            messageType === 'success' ? 'bg-green-600' : 'bg-red-600'
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

            {/* Title */}
            <div
              className="text-[52px] font-[monaco] tracking-wide pb-4"
              style={{ textShadow: "2px 2px 3px rgba(123,108,255,0.6)" }}
            >
              My Comments
            </div>

            {/* Scrollable Comments List */}
            <div
              ref={scrollRef}
              className="
                w-full
                rounded-xl
                border-2 border-[#2A2F45]
                p-4
                flex flex-col gap-4
                bg-transparent
                scrollbar-hide
                overflow-y-auto
              "
            >
              {comments.length === 0 ? (
                <div className="text-gray-400 text-center">No comments yet.</div>
              ) : (
                comments.map((comment) => (
                  <div
                    key={comment._id}
                    className="
                      bg-[#151821]
                      border-2 border-[#2A2F45]
                      rounded-xl
                      px-6 py-4
                      shadow-md
                      flex flex-col gap-2
                    "
                  >
                    {/* Comment Text */}
                    <p className="text-gray-200 text-lg">{comment.comments}</p>

                    {/* Claim Info */}
                    {comment.claim ? (
                      <p className="text-sm text-gray-400">
                        On claim: <span className="font-semibold">{comment.claim.title}</span>
                        {comment.claim.user && (
                          <span> by {typeof comment.claim.user === 'object' ? comment.claim.user.username : 'Unknown'}</span>
                        )}
                      </p>
                    ) : (
                      <p className="text-sm text-gray-400">On a deleted claim</p>
                    )}

                    {/* Timestamp */}
                    <p className="text-xs text-gray-500">
                      Posted on {new Date(comment.createdAt).toLocaleString()}
                    </p>

                    {/* Actions */}
                    <div className="flex gap-3 mt-2">
                      {comment.claim && (
                        <Link
                          to={`/claim/${comment.claim._id}`}
                          className="px-4 py-2 rounded-full bg-[#7B6CFF] text-white hover:scale-105 transition text-sm"
                        >
                          View Claim
                        </Link>
                      )}
                      <button
                        onClick={() => handleDelete(comment._id)}
                        className="px-4 py-2 rounded-full bg-red-600 text-white hover:scale-105 transition text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <RightBar />
        </div>
      </div>
    </>
  );
};

export default MyComments;