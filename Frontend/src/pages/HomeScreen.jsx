import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import Profile from '../components/Profile';
import SideBar from '../components/SideBar';
import RightBar from '../components/RightBar';
import Lenis from 'lenis';


const HomeScreen = () => {
    const categoryRef = useRef(null);
    const profileRef = useRef(null);
    const [categoryOpen, setCategoryOpen] = useState(false)
    const [profileOpen, setProfileOpen] = useState(false)
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
    
        


    useGSAP( () => {
        gsap.to(
          profileRef.current,
          {
            opacity: profileOpen ? '1' : '0',
            duration: 0.3,
            ease: 'power3.inOut',
          }
        )
       },[profileOpen]);
    

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

        <div className="flex flex-col w-3/4 space-y-6 items-center">
          <div className="flex justify-between w-full px-10 ml-5 mt-3">
            <div className="relative w-2/3 ml-7">
              <img src="./src/assets/search.svg" alt="Search" className="absolute top-1/2 mt-3 left-4 transform -translate-y-1/2 h-5 w-5" />
              <input type="text" placeholder="Search" className="caret-black text-black bg-white border-2 border-white rounded-full w-full pl-10 pr-4 py-2 mt-6 focus:bg-white focus:text-black focus:caret-black font-[SpaceMono]"/>
            </div>
            <Link to={'/newClaim'} className="bg-gray-200 mr-15 text-black text-3xl px-6 py-1 mt-6 rounded-2xl font-[monaco] hover:scale-105 transition hover:cursor-pointer">New Claim</Link>
          </div>

          <h2 className="text-white text-2xl font-bold font-[SpaceMono] ">Top Claims</h2>

          <div ref={scrollRef}  className="grid grid-cols-2 gap-4 gap-x-6 w-full h-120 px-10 drop-shadow-lg drop-shadow-purple-800 overflow-y-auto ">
            {[1,2,3,4,5,6].map(index => (
              <div key={index} className="bg-[#2a2a2a] text-white rounded-2xl p-4 space-y-3 font-[SpaceMono]">
                <div className="flex justify-between text-sm">
                  <h3>Claim Title</h3>
                  <span>AI Summary (agree/disagree %)</span>
                </div>

                <div className="bg-white text-black h-32 rounded-lg flex justify-center items-center">
                  Claim img/vid
                </div>

                <div className="flex flex-row items-center space-x-2">
                  <button className="bg-red-700 flex flex-row p-2 rounded-full hover:bg-red-600  hover:cursor-pointer">
                    <img src="./src/assets/upvote.svg" alt="Upvote" className="h-4 w-4 mr-1 mt-0.5"/> 5
                  </button>
                  <button className="bg-white p-2 flex flex-row text-black rounded-full hover:bg-gray-300 hover:cursor-pointer">
                    <img src="./src/assets/downvote.svg" alt="Downvote" className="h-4 w-4 mr-1 mt-0.5"/> 2
                  </button>
                  <Link to={'/claim/:id'} className="ml-auto flex items-center hover:scale-115 transition">
                    Open
                    <img src="./src/assets/open.svg" alt="Open" className=" bg-white h-5 w-5 ml-1 mt-1"/>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="h-full w-48 flex flex-col items-center justify-between py-6">
          <RightBar/>
      </div>

      </div>
              

        

    </>
   
  );
};

export default HomeScreen;
