import React, { useEffect, useState, useRef } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import SideBar from '../components/SideBar'
import upvote from '../assets/upvote.svg'
import downvote from '../assets/downvote.svg'

const Claim = () => {
  const { id } = useParams()
  const [claim, setClaim] = useState(null)
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState('')
  const [isWide, setIsWide] = useState(false)
  const imgRef = useRef(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const claimRes = await axios.get(`${import.meta.env.VITE_BASE_URL}/claim/${id}`, { withCredentials: true })
        setClaim(claimRes.data)

        const commentsRes = await axios.get(`${import.meta.env.VITE_BASE_URL}/claim/${id}/comments`, { withCredentials: true })
        setComments(commentsRes.data.comments)
      } catch (err) {
        console.error(err)
      }
    }
    fetchData()
  }, [id])

  const handleAddComment = async () => {
    if (!newComment.trim()) return
    try {
      await axios.post(
        `${import.meta.env.VITE_BASE_URL}/claim/${id}/comment`,
        { comments: newComment },
        { withCredentials: true }
      )
      const commentsRes = await axios.get(`${import.meta.env.VITE_BASE_URL}/claim/${id}/comments`, { withCredentials: true })
      setComments(commentsRes.data.comments)
      setNewComment('')
    } catch (err) {
      console.error(err)
    }
  }

  if (!claim) return <div className="text-white p-10 text-3xl">Loading claim...</div>

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

      <div className="h-screen w-full pl-6.5 flex items-center p-4 -ml-0.5">
        <SideBar />

        <div className="flex w-full h-full">
          <div className="absolute top-5 left-63.5 rounded-3xl h-146 w-[64.5%] bg-gradient-to-b from-gray-400 to-black opacity-30 z-0"></div>
          <div className="w-3/4 h-[98%] flex flex-col border-4 border-white text-white px-8 pt-4 rounded-3xl shadow-lg shadow-purple-800 ml-20 bg-transparent overflow-y-auto space-y-4 scrollbar-hide font-[spaceMono] z-5">
            <style>{`.scrollbar-hide::-webkit-scrollbar { display: none; }`}</style>

            <div className="flex flex-row items-center justify-between">
              <h1 className="text-[50px] tracking-wide font-bold font-[monaco]" style={{ textShadow: '3px 3px 2.5px #51E5F8' }}>
                {claim.title}
              </h1>
              <div className="flex flex-row items-center space-x-2">
                <button className="bg-red-700 flex flex-row p-2 rounded-full hover:bg-red-600 hover:scale-110 hover:cursor-pointer transition duration-300 ease-in-out active:scale-90">
                  <img src={upvote} alt="Upvote" className="h-4 w-4 mr-1 mt-0.5" /> 5
                </button>
                <button className="bg-white hover:scale-110 hover:cursor-pointer transition duration-300 ease-in-out active:scale-90 p-2 flex flex-row text-black rounded-full hover:bg-gray-200">
                  <img src={downvote} alt="Downvote" className="h-4 w-4 mr-1 mt-0.5" /> 2
                </button>
              </div>
            </div>

            <div className="text-sm text-gray-300 -mt-4 mb-4">
              Posted on {new Date(claim.createdAt).toLocaleDateString('en-GB')} by {claim.isAnonymous ? 'Anonymous' : claim.user?.username}
            </div>

            <div className={`flex ${isWide ? "justify-center items-center" : "items-start"}`}>
              {claim?.image ? (
                <img
                  ref={imgRef}
                  src={`${import.meta.env.VITE_BASE_URL}${claim.image}`}
                  alt="Claim Media"
                  className="max-h-96 max-w-full object-contain rounded-xl border-2 border-white shadow-md"
                  onLoad={() => {
                    if (imgRef.current?.naturalWidth >= 700) setIsWide(true)
                    else setIsWide(false)
                  }}
                />
              ) : (
                <p className="text-lg text-white">{claim.description}</p>
              )}
            </div>

            <div>
              <p className="text-lg text-white font-{spaceMono}">{claim.description}</p>
            </div>

            <div className="mt-0 mb-2 text-3xl font-bold font-[monaco]" style={{ textShadow: '2px 2px 2px #51E5F8' }}>
              Comments
            </div>

            <div className="flex flex-col gap-4 text-black">
              {comments.map((comment) => (
                <div key={comment._id} className="bg-white bg-opacity-20 rounded-2xl p-4 border-2 border-cyan-300 shadow-md text-black">
                  <div className="flex justify-between ml-2 mr-5">
                    <div>{comment.user?.username || 'Unknown'}</div>
                    <div className="text-sm text-gray-600 opacity-70">
                      {new Date(comment.createdAt).toLocaleDateString('en-GB')}
                    </div>
                  </div>
                  <div className="text-base">{comment.comments}</div>
                </div>
              ))}
            </div>

            <span className="-my-2 font-bold">Add a Comment</span>
            <div className="mt-4 flex flex-col gap-3">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment..."
                className="p-3 rounded-xl border-2 border-gray-300 bg-white bg-opacity-30 text-black resize-none"
                rows={3}
              />
              <button
                onClick={handleAddComment}
                className="self-start bg-purple-600 text-white px-4 py-2 rounded-xl hover:bg-purple-700 transition hover:scale-105 font-bold mb-3 mt-1"
              >
                Post Comment
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Claim
