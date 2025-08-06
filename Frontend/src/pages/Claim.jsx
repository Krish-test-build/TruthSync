import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import SideBar from '../components/SideBar'
import { Link } from 'react-router-dom'
import upvote from '../assets/upvote.svg'
import downvote from '../assets/downvote.svg'

const dummyClaims = [
  {
    id: 1,
    title: "Aliens Spotted in New York",
    date: "2024-06-01",
    source: "user123",
    description: "Several witnesses claim to have seen UFOs hovering over Manhattan.",
    media: { type: "image", url: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=800&q=80" },
    comments: [
      { id: 1,user: "user123", text: "This sounds like a hoax.", date: "2024-06-02" },
      { id: 2,user: "LaLaLand", text: "There are videos on YouTube!", date: "2024-06-03" }
    ]
  },
  {
    id: 2,
    title: "Water Turns to Wine in Local Church",
    date: "2024-05-28",
    source: "miracleGuy",
    description: "A mysterious event occurred during Sunday mass.",
    media: { type: "video", url: "https://www.w3schools.com/html/mov_bbb.mp4" },
    comments: [
      { id: 1,user: "user123", text: "I think it's a hoax.", date: "2024-05-29" },
      { id: 2,user: "miracleGuy", text: "There are videos on YouTube!", date: "2024-05-30" }
    ]
  }
]

const Claim = () => {
  const { id } = useParams()
  const claim = dummyClaims.find(c => c.id == id)

  const [comments, setComments] = useState(claim?.comments || [])
  const [newComment, setNewComment] = useState('')

  if (!claim) {
    console.log('Not found')
    return <div className="text-white p-10 text-3xl">Claim not found.</div>
  }

  const handleAddComment = () => {
    if (newComment.trim() === '') return

    const newEntry = {
      id: comments.length + 1,
      text: newComment,
      date: new Date().toISOString().split('T')[0]
    }

    setComments([...comments, newEntry])
    setNewComment('')
  }

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
            <div className="absolute top-5 left-63.5 rounded-3xl h-146 w-[64.5%] bg-gradient-to-b  from-gray-400 to-black opacity-30 z-0"></div>
          <div className="w-3/4 h-[98%] flex flex-col border-4 border-white text-white px-8 pt-4 rounded-3xl shadow-lg shadow-purple-800 ml-20 bg-transparent overflow-y-auto space-y-4 scrollbar-hide font-[spaceMono] z-5">
            <style>{`.scrollbar-hide::-webkit-scrollbar { display: none; }`}</style>

            <div className='flex flex-row items-center justify-between'>
                <h1 className="text-[50px] tracking-wide font-bold font-[monaco]" style={{ textShadow: '3px 3px 2.5px #51E5F8' }}>
              {claim.title}
            </h1>
            <div className="flex flex-row items-center space-x-2">
                  <button className="bg-red-700 flex flex-row p-2 rounded-full hover:bg-red-600 hover:scale-110 hover:cursor-pointer transition duration-300 ease-in-out active:scale-90  ">
                    <img src={upvote} alt="Upvote" className="h-4 w-4 mr-1 mt-0.5"/> 5
                  </button>
                  <button className="bg-white hover:scale-110 hover:cursor-pointer transition duration-300 ease-in-out active:scale-90 p-2 flex flex-row text-black rounded-full hover:bg-gray-200">
                    <img src={downvote} alt="Downvote" className="h-4 w-4 mr-1 mt-0.5"/> 2
                  </button>
                  
                </div>
            </div>

            <div className="text-sm text-gray-300">
              Posted on {claim.date} by {claim.source}
            </div>

            <p className="text-lg text-white">{claim.description}</p>

            {claim.media?.type === "image" ? (
              <img src={claim.media.url} alt="Claim Media" className="max-h-96 rounded-xl border-2 border-white shadow-md" />
            ) : (
              <video controls className="max-h-96 rounded-xl border-2 border-white shadow-md">
                <source src={claim.media.url} type="video/mp4" />
              </video>
            )}

            <div className="mt-0 mb-2 text-3xl font-bold font-[monaco]" style={{ textShadow: '2px 2px 2px #51E5F8' }}>
              Comments
            </div>

            <div className="flex flex-col gap-4 text-black">
              {comments.map(comment => (
                <div
                  key={comment.id}
                  className="bg-white bg-opacity-20 rounded-2xl p-4 border-2 border-cyan-300 shadow-md text-black"
                >
                <div className='flex justify-between ml-2 mr-5'>
                    <div className=' text-black'>{comment.user}</div>
                <div className="text-sm text-gray-600 opacity-70">{comment.date}</div>
                </div>
                <div className="text-base">{comment.text}</div>
                </div>
              ))}
            </div>

            <span className='-my-2 font-bold'>Add a Comment</span>
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
