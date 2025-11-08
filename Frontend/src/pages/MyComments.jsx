import React, { useEffect, useRef, useState } from 'react'
import SideBar from '../components/SideBar'
import RightBar from '../components/RightBar'
import { Link } from 'react-router-dom'
import Lenis from 'lenis'
import api from '../api/axiosConfig'

const MyComments = () => {
  const [comments, setComments] = useState([])
  const scrollRef = useRef()

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await api.get('/comment/my-comments')
        setComments(res.data)
      } catch (error) {
        console.error(error)
      }
    }
    fetchComments()
  }, [])

  useEffect(() => {
    if (!scrollRef.current) return

    const lenis = new Lenis({
      wrapper: scrollRef.current,
      content: scrollRef.current,
      smooth: true,
    })

    function raf(time) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)
    return () => lenis.destroy()
  }, [])

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

      <div className="h-screen w-full flex justify-between items-center p-4">
        <SideBar />
        <div
          ref={scrollRef}
          className="flex flex-col w-3/4 space-y-6 items-center overflow-y-auto max-h-[90vh]"
        >
          <h2 className="text-white text-2xl font-bold font-[SpaceMono] mt-4">
            My Comments
          </h2>

          {comments.length === 0 ? (
            <p className="text-white text-lg font-[SpaceMono] mt-10">
              No comments yet.
            </p>
          ) : (
            comments.map((comment) => {
              const claimId =
                comment.claim && typeof comment.claim === "object"
                  ? comment.claim._id || ""
                  : comment.claim || comment.claimId || ""
              return (
                <div
                  key={comment._id || Math.random()}
                  className="bg-[#2a2a2a] text-white rounded-2xl p-4 space-y-2 w-2/3 font-[SpaceMono]"
                >
                  <p>{comment.comments}</p>
                  <Link
                    to={`/claim/${claimId}`}
                    className="text-sm text-blue-400 underline"
                  >
                    View Claim
                  </Link>
                </div>
              )
            })
          )}
        </div>
        <RightBar />
      </div>
    </>
  )
}

export default MyComments
