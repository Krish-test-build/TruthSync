import React, { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import SideBar from '../components/SideBar'
import upvote from '../assets/upvote.svg'
import downvote from '../assets/downvote.svg'
import Lenis from 'lenis'

const bookmarkedClaims = [
  {
    id: 1,
    title: "Aliens Spotted in New York",
    date: "2024-06-01",
    source: "user123",
    description: "Several witnesses claim to have seen UFOs hovering over Manhattan.",
    media: { type: "image", url: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=800&q=80" }
  },
  {
    id: 2,
    title: "Water Turns to Wine in Local Church",
    date: "2024-05-28",
    source: "miracleGuy",
    description: "A mysterious event occurred during Sunday mass.",
    media: { type: "video", url: "https://www.w3schools.com/html/mov_bbb.mp4" }
  }
]

const Bookmarks = () => {
    const scrollRef = useRef();


    useEffect(() => {
        if(!scrollRef.current) return


       const lenis = new Lenis({
            wrapper: scrollRef.current,
            content: scrollRef.current,
            smooth: true,
        });
      function raf(time){
        lenis.raf(time)
        requestAnimationFrame(raf)
      }
    requestAnimationFrame(raf)

    return () => {
      lenis.destroy()
    }
      
    }, []);
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

      <div className="h-screen w-full flex items-center p-4 ml-2">
        <SideBar />

        <div className="flex w-full h-full">
          <div className="absolute top-5 left-65.5 rounded-3xl h-146 w-[64.5%] bg-gradient-to-b from-gray-400 to-black opacity-30 z-0"></div>

          <div ref={scrollRef} className="w-3/4 h-[98%] flex flex-col border-4 border-white text-white px-8 py-4 rounded-3xl shadow-lg shadow-purple-800 ml-20 bg-transparent overflow-y-auto space-y-6 scrollbar-hide font-[spaceMono] z-5 ">
            <style>{`.scrollbar-hide::-webkit-scrollbar { display: none; }`}</style>

            <h1 className="text-[45px] tracking-wide font-bold mb-0 font-[monaco]" style={{ textShadow: '3px 3px 2.5px #51E5F8' }}>
              Bookmarked Claims
            </h1>

            {bookmarkedClaims.map(claim => (
              <div key={claim.id} className="  rounded-3xl p-6 border-2 border-cyan-300 shadow-lg text-black space-y-4">
                <div className="flex justify-between items-center">
                  <div className="text-2xl font-bold text-purple-700">{claim.title}</div>
                  <div className="flex space-x-2">
                    <button className="bg-red-700 p-2 rounded-full hover:scale-110 transition text-white flex items-center gap-1 active:scale-90">
                      <img src={upvote} alt="Upvote" className="h-4 w-4" /> 5
                    </button>
                    <button className="bg-white p-2 rounded-full hover:scale-110 transition flex items-center gap-1 active:scale-90">
                      <img src={downvote} alt="Downvote" className="h-4 w-4" /> 2
                    </button>
                  </div>
                </div>

                <div className="text-sm text-gray-300">
                  Posted on {claim.date} by {claim.source}
                </div>

                <p className="text-base text-white">{claim.description}</p>

                <div className='flex justify-center'>
                    {claim.media?.type === 'image' ? (
                  <img src={claim.media.url} alt="Claim Media" className=" max-h-64 rounded-xl border-2 border-white shadow-md" />
                ) : (
                  <video controls className="max-h-64 rounded-xl border-2 border-white shadow-md">
                    <source src={claim.media.url} type="video/mp4" />
                  </video>
                )}
                </div>

                <Link
                  to={`/claim/${claim.id}`}
                  className="text-white font-bold bg-purple-600 px-4 py-2 rounded-xl hover:bg-purple-700 hover:scale-105 transition inline-block"
                >
                  View Full Claim
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

export default Bookmarks
