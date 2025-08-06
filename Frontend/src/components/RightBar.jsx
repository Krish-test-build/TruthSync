import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import Profile from '../components/Profile';



const RightBar = () => {
    const navigate= useNavigate()
    const profileRef = useRef(null);
    const [profileOpen, setProfileOpen] = useState(false)
    const [hydrated, setHydrated] = useState(false);


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
      <div className="flex h-screen w-48 flex-col items-center justify-between absolute right-3.5 top-4 py-6 ">
        <img onClick={()=>{
            setHydrated(!hydrated)
            setProfileOpen(!profileOpen)}} src="./src/assets/profile.svg" alt="Profile" className=" hover:cursor-pointer h-24 w-24 bg-white border-4 border-white rounded-3xl hover:scale-110 transition"/>

        <div className="text-white text-4xl tracking-wide font-bold font-[monaco] space-y-4 mt-10 pl-4">
          <div className="hover:scale-115 transition  cursor-pointer">
            <Link to={'/myClaims'} style={{ textShadow: '3px 3px 2.5px #51E5F8' }}>My Claims</Link>
          </div>
          <div className="hover:scale-115 transition  cursor-pointer">
            <Link to={'/myComments'} style={{ textShadow: '3px 3px 2.5px #51E5F8' }}>My Comments</Link></div>
          <div className="hover:scale-115 transition  cursor-pointer"><Link to={'/bookmarks'} style={{ textShadow: '3px 3px 2.5px #51E5F8' }}>Bookmarks </Link></div>
        </div>

        <button onClick={()=>{
            navigate('/')
        }} className="bg-red-600 mb-8 text-white text-4xl font-bold font-[monaco] px-6 py-2 rounded-full hover:bg-red-500 transition hover:scale-110 hover:cursor-pointer duration-250 ease-in-out">
          Logout
        </button>
      </div>
      {hydrated &&(<div ref={profileRef}>
        <Profile/>
      </div>)}
    </>
  )
}

export default RightBar