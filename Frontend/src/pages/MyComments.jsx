import React, { useEffect, useRef } from 'react'
import SideBar from '../components/SideBar'
import RightBar from '../components/RightBar'
import { Link } from 'react-router-dom'
import Lenis from 'lenis'

const dummyComments = [
  {
    id: 1,
    text: "I think this is definitely suspicious.",
    claimTitle: "Aliens Spotted in New York",
    date: "2024-06-02"
  },
  {
    id: 2,
    text: "Maybe a camera trick caused this. Still impressive.",
    claimTitle: "Water Turns to Wine in Local Church",
    date: "2024-06-01"
  },
  {
    id: 3,
    text: "No way a cat solved a Rubik's cube! Show me the video!",
    claimTitle: "Cat Solves Rubik's Cube",
    date: "2024-06-03"
  },
  {
    id: 4,
    text: "No way a cat solved a Rubik's cube! Show me the video!",
    claimTitle: "Cat Solves Rubik's Cube",
    date: "2024-06-03"
  }
]

const MyComments = () => {
    const scrollRef = useRef()
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

      <div className="h-screen w-full flex items-center p-4 pl-6.5 -ml-0.5 ">
        <SideBar />

        <div className="flex w-full h-full">
          <div className="w-3/4 h-[98%] flex flex-col border-4 border-white mt-2  text-white px-8 py-2 pb-5 rounded-3xl shadow-lg shadow-purple-800 ml-20 bg-transparent overflow-y-auto space-y-8 scrollbar-hide font-[spaceMono]">
            <style>{`.scrollbar-hide::-webkit-scrollbar { display: none; }`}</style>

            <div
              className="text-[55px] tracking-wide font-bold flex -mt-2 mb-0 items-start justify-start  font-[monaco]"
              style={{ textShadow: '3px 3px 2.5px #51E5F8' }}
            >
              My Comments
            </div>
            <div className="absolute top-28 rounded-3xl h-125.5 w-[60%] bg-gray-400 opacity-30 z-0"></div>

            <div ref={scrollRef} className="w-full h-full tracking-wide rounded-3xl border-5 border-cyan-300 z-2 flex flex-col gap-6 text-black shadow-md shadow-cyan-500 overflow-y-auto p-4  bg-opacity-10 scrollbar-hide -mb-2 ">
              {dummyComments.map(comment => (
                <div
                  key={comment.id}
                  className="bg-[#E5E7EB] bg-opacity-20 rounded-3xl px-6 py-4 border-2 border-cyan-300 shadow-xl flex flex-col gap-3 hover:scale-[1.01] transition duration-300 ease-in-out"
                >
                  <div className="flex justify-between items-center text-white">
                    <div className="text-lg font-bold text-purple-500 ">
                      {comment.claimTitle}
                    </div>
                    <div className="text-sm text-black opacity-50 ">{comment.date}</div>
                  </div>

                  <div className="text-black">{comment.text}</div>
                  <Link
                    to={`/claim/${comment.id}`}
                    className="mt-2 text-sm text-cyan-500 hover:text-cyan-300 transition duration-300 ease-in-out origin-center underline underline-offset-2"
                    >
                    View Related Claim
                    </Link>

                </div>
              ))}
            </div>
          </div>

          {/* RightBar */}
          <div className="flex h-full">
            <RightBar />
          </div>
        </div>
      </div>
    </>
  )
}

export default MyComments
