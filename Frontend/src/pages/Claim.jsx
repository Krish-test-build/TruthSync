import React, { useEffect, useState, useRef } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import Lenis from 'lenis'
import SideBar from '../components/SideBar'
import upvote from '../assets/upvote.svg'
import downvote from '../assets/downvote.svg'

const Claim = () => {
  const { id } = useParams()
  const [claim, setClaim] = useState(null)
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState('')
  const [userVotes, setUserVotes] = useState({})
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('')
  const imgRef = useRef(null)
  const scrollRef = useRef(null)  // Add ref for the scrollable div

  useEffect(() => {
    const fetchData = async () => {
      try {
        const claimRes = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/claim/${id}`,
          { withCredentials: true }
        )
        setClaim(claimRes.data)
        setUserVotes({ [id]: claimRes.data.userVote || null })

        const commentsRes = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/claim/${id}/comments`,
          { withCredentials: true }
        )
        setComments(commentsRes.data.comments || [])
      } catch (err) {
        console.error(err)
      }
    }
    fetchData()
  }, [id])

  useEffect(() => {
    // Wait for the ref to be available
    if (!scrollRef.current) return

    const lenis = new Lenis({
      wrapper: scrollRef.current,  // Target the specific scrollable div
      content: scrollRef.current,
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      smoothTouch: false,
    })

    function raf(time) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }
    requestAnimationFrame(raf)

    return () => {
      lenis.destroy()
    }
  }, [claim])  // Depend on claim to ensure the div is rendered

  const showMessage = (msg, type) => {
    setMessage(msg)
    setMessageType(type)
    setTimeout(() => setMessage(''), 3000)
  }

  const handleVote = async (voteType) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/claim/${id}/vote`,
        { vote: voteType },
        { withCredentials: true }
      )
      const { message, upvote, downvote } = res.data
      setClaim((prev) => ({ ...prev, upvote, downvote }))
      setUserVotes((prev) => ({
        ...prev,
        [id]: message === 'Vote removed' ? null : voteType,
      }))
      showMessage(
        message === 'Vote removed' ? 'Vote removed!' : `Claim ${voteType}d!`,
        'success'
      )
    } catch {
      showMessage('Failed to update vote.', 'error')
    }
  }

  const handleAddComment = async () => {
    if (!newComment.trim()) return
    try {
      await axios.post(
        `${import.meta.env.VITE_BASE_URL}/claim/${id}/comment`,
        { comments: newComment },
        { withCredentials: true }
      )
      const commentsRes = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/claim/${id}/comments`,
        { withCredentials: true }
      )
      setComments(commentsRes.data.comments || [])
      setNewComment('')
      setClaim((prev) => ({ ...prev, comments: (prev.comments || 0) + 1 }))
    } catch (err) {
      console.error(err)
    }
  }

  if (!claim) {
    return <div className="text-white p-10 text-3xl">Loading claim...</div>
  }

  return (
    <>
      {/* Hide scrollbar globally for this component (add to your global CSS or here) */}
      <style>
        {`
          .scroll-hide::-webkit-scrollbar {
            display: none;
          }
          .scroll-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}
      </style>

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
          <div
            ref={scrollRef}  
            className="w-3/4 h-[98%] ml-20 flex flex-col border-4 border-[#2A2F45] rounded-xl shadow-lg shadow-purple-700/30 px-8 py-6 text-white font-[spaceMono] scroll-hide overflow-auto"  
          >
            <h1
              className="text-[52px] font-[monaco] tracking-wide"
              style={{ textShadow: '2px 2px 3px rgba(123,108,255,0.6)' }}
            >
              {claim.title}
            </h1>

            <div className="text-sm text-gray-400 -mt-3 mb-6">
              Posted on{' '}
              {new Date(claim.createdAt).toLocaleDateString('en-GB')} by{' '}
              {claim.isAnonymous ? 'Anonymous' : claim.user?.username}
            </div>

            <div className="flex items-center gap-3 mb-6">
              <button
                onClick={() => handleVote('upvote')}
                className={`flex items-center gap-1 hover:cursor-pointer px-4 py-2 rounded-full transition hover:scale-105 ${
                  userVotes[id] === 'upvote'
                    ? 'bg-purple-600'
                    : 'bg-[#2A2F45]'
                }`}
              >
                <img src={upvote} className="h-4 w-4" />
                {claim.upvote || 0}
              </button>

              <button
                onClick={() => handleVote('downvote')}
                className={`flex items-center gap-1 hover:cursor-pointer px-4 py-2 rounded-full transition hover:scale-105 ${
                  userVotes[id] === 'downvote'
                    ? 'bg-purple-600'
                    : 'bg-[#2A2F45]'
                }`}
              >
                <img src={downvote} className="h-4 w-4" />
                {claim.downvote || 0}
              </button>
            </div>

            {claim.image && (
              <div className="flex justify-center mb-6">
                {/\.(mp4|webm|ogg|mp3)$/.test(claim.image) ? (
                  <video
                    src={`${import.meta.env.VITE_BASE_URL}${claim.image}`}
                    controls
                    className="max-h-96 rounded-xl border-2 border-[#2A2F45]"
                  />
                ) : (
                  <img
                    ref={imgRef}
                    src={`${import.meta.env.VITE_BASE_URL}${claim.image}`}
                    className="max-h-96 rounded-xl border-2 border-[#2A2F45]"
                  />
                )}
              </div>
            )}

            <p className="text-lg text-white mb-8">{claim.description}</p>

            <h2
              className="text-3xl font-[monaco] mb-4"
              style={{ textShadow: '2px 2px 2px rgba(123,108,255,0.6)' }}
            >
              Comments {claim.comments || ' '}
            </h2>

            <div className="flex flex-col gap-4">
              {comments.map((comment) => (
                <div
                  key={comment._id}
                  className="bg-[#151821] border-2 border-[#2A2F45] rounded-xl px-4 py-3"
                >
                  <div className="flex justify-between text-sm text-gray-400 mb-1">
                    <span>{comment.user?.username || 'Anonymous'}</span>
                    <span>
                      {new Date(comment.createdAt).toLocaleDateString('en-GB')}
                    </span>
                  </div>
                  <p className="text-white">{comment.comments}</p>
                </div>
              ))}
            </div>

            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              className="w-full p-3 pt-5 pb-10 mb-5 rounded-lg border-2 border-[#2A2F45] bg-[#141823] text-white"
              rows={3}
            />

            <button
              onClick={handleAddComment}
              className="w-fit px-6 py-2 bg-purple-600 rounded-lg font-bold hover:bg-purple-700 hover:scale-105 transition hover:cursor-pointer duration-150 ease-in-out"
            >
              Post Comment
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default Claim