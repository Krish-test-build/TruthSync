import React, { useState, useEffect, useRef } from 'react'
import api from '../api/axiosConfig'
import Lenis from 'lenis'

const Comments = ({ claimId, onNoComments }) => {
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState('')
  const [loading, setLoading] = useState(false)
  const scrollRef = useRef()

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await api.get(`/claim/${claimId}/comments`)
        setComments(res.data.comments || [])
        if ((res.data.comments || []).length === 0 && onNoComments) {
          onNoComments()
        }
      } catch (err) {
        console.error('Error fetching comments:', err)
      }
    }
    if (claimId) fetchComments()
  }, [claimId, onNoComments])

  useEffect(() => {
    if (!scrollRef.current) return

    const lenis = new Lenis({
      wrapper: scrollRef.current,
      content: scrollRef.current,
      smooth: true,
      duration: 2,
    })

    function raf(time) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }
    requestAnimationFrame(raf)

    return () => {
      lenis.destroy()
    }
  }, [])

  const handleAddComment = async () => {
    if (!newComment.trim()) return
    setLoading(true)
    try {
      const res = await api.post(`/claim/${claimId}/comment`, { comments: newComment })
      console.log('POST response:', res.data) // Debug: Check if comment is returned
      setComments((prev) => {
        const updated = [...prev, res.data.comment]
        console.log('Updated comments:', updated) // Debug: Check state update
        return updated
      })
      setNewComment('')
    } catch (err) {
      console.error('Error posting comment:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full h-full flex flex-col p-4 rounded-3xl border-4 border-white bg-black bg-opacity-40 shadow-xl font-[spaceMono] text-white">
      <h2 className="text-3xl font-bold font-[monaco] " style={{ textShadow: '2px 2px 2px #51E5F8' }}>
        Comments
      </h2>

      <div ref={scrollRef} className="flex flex-col gap-3 text-black max-h-[70vh] pr-3 overflow-y-auto scrollbar-visible">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div
              key={comment._id}
              className="bg-white bg-opacity-20 rounded-2xl px-4 py-2 border-2 border-cyan-300 shadow-md"
            >
              <div className="flex justify-between mb-1">
                <span className="text-purple-600 font-semibold">
                  {comment.user?.username || 'Anonymous'}
                </span>
                <span className="text-sm text-gray-700 opacity-70">
                  {new Date(comment.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="text-base text-black">{comment.comments}</div>
            </div>
          ))
        ) : null}
      </div>

      <div className="mt-4">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write a comment..."
          className="w-full p-3 rounded-xl border-2 border-gray-300 bg-white bg-opacity-30 text-black resize-none"
          rows={3}
        />
        <button
          onClick={handleAddComment}
          disabled={loading}
          className="mt-2 bg-purple-600 text-white px-4 py-2 rounded-xl hover:bg-purple-700 transition hover:scale-105 font-bold disabled:opacity-50"
        >
          {loading ? 'Posting...' : 'Post Comment'}
        </button>
      </div>
    </div>
  )
}

export default Comments
