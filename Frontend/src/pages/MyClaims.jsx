import React, { useEffect, useRef, useState } from 'react';
import SideBar from '../components/SideBar';
import RightBar from '../components/RightBar';
import { FaArrowUp, FaArrowDown, FaCommentDots } from 'react-icons/fa';
import Comments from '../components/Comments';
import Lenis from 'lenis';

const dummyClaims = [
  {
    id: 1,
    title: "Aliens Spotted in New York",
    date: "2024-06-01",
    source: "user123",
    description: "Several witnesses claim to have seen UFOs hovering over Manhattan.",
    media: { type: "image", url: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80" },
    upvotes: 12,
    downvotes: 3,
    comments: 5
  },
  {
    id: 2,
    title: "Water Turns to Wine in Local Church",
    date: "2024-05-28",
    source: "miracleGuy",
    description: "A mysterious event occurred during Sunday mass.",
    media: { type: "video", url: "https://www.w3schools.com/html/mov_bbb.mp4" },
    upvotes: 8,
    downvotes: 2,
    comments: 2
  },
  {
    id: 3,
    title: "Cat Solves Rubik's Cube",
    date: "2024-06-02",
    source: "catlover",
    description: "A viral video shows a cat allegedly solving a Rubik's cube.",
    media: { type: "image", url: "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?auto=format&fit=crop&w=400&q=80" },
    upvotes: 20,
    downvotes: 1,
    comments: 10
  }
];


const MyClaims = () => {
  const [hydrated, setHydrated] = useState({}); 
  const commentsRef = useRef(null);
  const scrollRef = useRef()

  useEffect(() => {
        if(!scrollRef.current) return


       const lenis = new Lenis({
            wrapper: scrollRef.current,
            content: scrollRef.current,
            smooth: true,
            duration:2,
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

  const toggleComments = (id) => {
    setHydrated((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

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

      <div className="h-screen w-full flex items-center pl-6.5 p-4 -ml-0.5">
        <SideBar />

        <div className="flex w-full h-full">    
          <div  className="w-3/4 mt-2 h-[98%] flex flex-col border-4 border-white text-white px-8 py-2 pb-5 rounded-3xl shadow-lg shadow-purple-800 ml-20 bg-transparent overflow-y-auto scrollbar-hide font-[spaceMono]">
            <style>{`.scrollbar-hide::-webkit-scrollbar { display: none; }`}</style>

            <div
              className="text-[55px] tracking-wide font-bold -mt-2 flex items-start justify-start font-[monaco]"
              style={{ textShadow: '3px 3px 2.5px #51E5F8' }}
            >
              My Claims
            </div>
            <div className="absolute top-27 rounded-3xl h-125.5 w-[59%] bg-gradient-to-b from-gray-400 to-black opacity-30 z-0"></div>

            <div ref={scrollRef} className="w-full tracking-wide rounded-3xl border-5 border-cyan-400 z-2 flex flex-col gap-4 text-black shadow-md -mb-2 shadow-cyan-500 overflow-y-auto p-4 bg-transparent scrollbar-hide">
              {dummyClaims.map(claim => (
                <div
                  key={claim.id}
                  className="bg-transparent bg-opacity-20 rounded-3xl px-6 py-4 border-4 border-white shadow-xl flex flex-col gap-2 h-full transition duration-300 ease-in-out"
                >
                  <div className="flex justify-between items-center text-white">
                    <div className="text-xl font-bold text-purple-500">{claim.title}</div>
                    <div className="text-sm text-gray-300">{claim.date}</div>
                  </div>

                  <div className="text-sm text-white">
                    Source: <span className="font-semibold">{claim.source}</span>
                  </div>

                  <div className="text-md text-white">{claim.description}</div>

                  <div className="w-full flex justify-center items-center mt-2">
                    {claim.media.type === "image" ? (
                      <img
                        src={claim.media.url}
                        alt="claim media"
                        className="max-h-64 rounded-xl border-2 border-white shadow-lg"
                      />
                    ) : (
                      <video controls className="max-h-64 rounded-xl hover:cursor-pointer border-2 border-white shadow-lg">
                        <source src={claim.media.url} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    )}
                  </div>

                  <div className="flex items-center gap-5 mt-3 z-5">
                    <button className="flex items-center gap-1 bg-red-700 px-3 py-2 rounded-full hover:bg-red-600 hover:scale-110 transition text-white font-bold hover:cursor-pointer">
                      <img src="./src/assets/upvote.svg" alt="Upvote" className="h-4 w-4"/> {claim.upvotes}
                    </button>
                    <button className="flex items-center gap-1 bg-white px-3 py-2 rounded-full hover:bg-gray-300 hover:scale-110 transition hover:cursor-pointer text-red-700 font-bold">
                      <img src="./src/assets/downvote.svg" alt="downvote" className="h-4 w-4"/> {claim.downvotes}
                    </button>
                    <button onClick={() => toggleComments(claim.id)} className="flex items-center gap-2 bg-blue-700 p-2 rounded-full hover:bg-blue-600 hover:scale-110 tracking-wide hover:cursor-pointer transition text-white font-bold">
                      <FaCommentDots className="h-4 w-4" /> {claim.comments} Comments
                    </button>
                  </div>

                  {hydrated[claim.id] && (
                    <div ref={commentsRef} className='-mt-2 z-5'>
                      <Comments />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex h-full">
            <RightBar />
          </div>
        </div>
      </div>
    </>
  );
};

export default MyClaims;
