import React, { useEffect, useRef } from 'react'
import SideBar from '../components/SideBar'
import Lenis from 'lenis'
import { useNavigate } from 'react-router-dom'

const verifiedClaims = [
  {
    id: 1,
    title: "Water is composed of H2O molecules",
    date: "2023-12-12",
    source: "ScienceDaily",
    description: "Confirmed by multiple scientific studies and widely accepted by scientific consensus.",
    media: { type: "image", url: "https://images.unsplash.com/photo-1464925257126-6450e871c667?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
    verifiedBy: "FactBot AI"
  },
  {
    id: 2,
    title: "Vaccines help prevent infectious diseases",
    date: "2024-01-10",
    source: "WHO",
    description: "Numerous studies show the effectiveness of vaccines in preventing disease spread.",
    media: { type: "video", url: "https://www.w3schools.com/html/mov_bbb.mp4" },
    verifiedBy: "Admin Review"
  }
]

const VerifiedFacts = () => {
    const navigate= useNavigate()
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

      <div className="h-screen w-full flex items-center p-4 ml-2 ">
        <SideBar />

        <div className="flex w-full h-full">
          <div ref={scrollRef} className="w-4/5 h-[98%] flex flex-col border-4 border-white text-white px-8 pt-4 rounded-3xl shadow-lg shadow-purple-800 ml-20 bg-transparent overflow-y-auto space-y-6 scrollbar-hide font-[spaceMono] ">
            <style>{`.scrollbar-hide::-webkit-scrollbar { display: none; }`}</style>

            <h1 className="text-[45px] tracking-wide font-bold font-[monaco]" style={{ textShadow: '3px 3px 2.5px #51E5F8' }}>
              ✅ Verified Facts
            </h1>

            {verifiedClaims.map(claim => (
              <div
                key={claim.id}
                
                className="bg-transparent bg-opacity-10 text-white border-4 border-white shadow-md shadow-green-500 rounded-3xl px-6 py-5 flex flex-col gap-3 mb-10"
              >
                <div className="flex justify-between items-center">
                  <div className="text-2xl font-bold text-green-700">{claim.title}</div>
                  <div className="text-sm text-white">✓ Verified by {claim.verifiedBy}</div>
                </div>

                <div className="text-sm text-gray-400">Posted on {claim.date} | Source: {claim.source}</div>

                <div className="text-base">{claim.description}</div>

                {claim.media?.type === "image" ? (
                  <img src={claim.media.url} alt="Media" className="max-h-96 rounded-xl border-2 border-white shadow-md" />
                ) : (
                  <video controls className="max-h-96 rounded-xl border-2 border-white shadow-md">
                    <source src={claim.media.url} type="video/mp4" />
                  </video>
                )}  
                <button
                className="text-white font-bold bg-purple-600 px-4 py-2 mt-2 mx-5 hover:cursor-pointer rounded-xl hover:bg-purple-700 hover:scale-105 transition duration-250 ease-in-out inline-block"
                 onClick={()=>{
                    navigate(`/claim/${claim.id}`)
                }}>
                    View Claim
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

export default VerifiedFacts
