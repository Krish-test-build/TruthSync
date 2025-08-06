import React, { useState } from 'react'

const Comments = ({ initialComments = [] }) => {
  const [comments, setComments] = useState(initialComments)
  const [newComment, setNewComment] = useState('')

  const handleAddComment = () => {
    if (!newComment.trim()) return

    const newEntry = {
      id: comments.length + 1,
      user: 'anonymousUser',
      text: newComment,
      date: new Date().toISOString().split('T')[0]
    }

    setComments([...comments, newEntry])
    setNewComment('')
  }

  return (
    <div className="w-full h-full flex flex-col p-4 rounded-3xl border-4 border-white bg-black bg-opacity-40 shadow-xl font-[spaceMono] text-white">
      <h2 className="text-3xl font-bold font-[monaco] mb-4" style={{ textShadow: '2px 2px 2px #51E5F8' }}>
        Comments
      </h2>

      <div className="flex flex-col gap-4 text-black max-h-[70vh] overflow-y-auto scrollbar-hide">
        {comments.map(comment => (
          <div
            key={comment.id}
            className="bg-white bg-opacity-20 rounded-2xl p-4 border-2 border-cyan-300 shadow-md"
          >
            <div className="flex justify-between mb-1">
              <span className="text-purple-600 font-semibold">{comment.user}</span>
              <span className="text-sm text-gray-700 opacity-70">{comment.date}</span>
            </div>
            <div className="text-base text-black">{comment.text}</div>
          </div>
        ))}
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
          className="mt-2 bg-purple-600 text-white px-4 py-2 rounded-xl hover:bg-purple-700 transition hover:scale-105 font-bold"
        >
          Post Comment
        </button>
      </div>
    </div>
  )
}

export default Comments
