import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import Profile from '../components/Profile';
import axios from 'axios';
import defaultImage from '../assets/profile.svg';

const RightBar = () => {
  const navigate = useNavigate();
  const profileRef = useRef(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [user, setUser] = useState(null);

  const logoutHandler = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/');
  };

  const profile = async () => {
    try {
      const res = await axios.get('http://localhost:4000/profile', { withCredentials: true });
      if (res.status === 200) {
        setUser(res.data);
        return res.data;
        
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    profile();
  }, []);

  useGSAP(() => {
    gsap.to(profileRef.current, {
      opacity: profileOpen ? '1' : '0',
      duration: 0.3,
      ease: 'power3.inOut',
    });
  }, [profileOpen]);

  return (
    <>
      <div className="flex h-screen w-48 flex-col items-center justify-between absolute right-3.5 top-4 py-6">
        <img
          onClick={() => {
            setHydrated(!hydrated);
            setProfileOpen(!profileOpen);
          }}
          src={
            user?.image? `${import.meta.env.VITE_BASE_URL}${user.image}`
              : defaultImage
          }
          alt="Profile"
          className="hover:cursor-pointer h-30 w-30 bg-white border-4 border-white rounded-3xl hover:scale-110 transition object-cover object-center -mb-4"
        />

        <div className="text-white text-[40px] tracking-wide font-bold font-[monaco] space-y-6 mt-10 pl-7 ease-in-out delay-150">
          <div className="hover:scale-115 transition  cursor-pointer ">
            <Link to={'/myClaims'} style={{ textShadow: '3px 3px 2.5px #51E5F8' }}>
              My Claims
            </Link>
          </div>
          <div className="hover:scale-115 transition cursor-pointer">
            <Link to={'/myComments'} style={{ textShadow: '3px 3px 2.5px #51E5F8' }}>
              My Comments
            </Link>
          </div>
          <div className="hover:scale-115 transition cursor-pointer">
            <Link to={'/bookmarks'} style={{ textShadow: '3px 3px 2.5px #51E5F8' }}>
              Bookmarks
            </Link>
          </div>
        </div>

        <button
          onClick={logoutHandler}
          className="bg-red-600 mb-8 text-white text-4xl font-bold font-[monaco] px-6 py-2 rounded-full hover:bg-red-500 transition hover:scale-110 hover:cursor-pointer duration-250 ease-in-out"
        >
          Logout
        </button>
      </div>
      {hydrated && (
        <div ref={profileRef}>
          <Profile fetchProfile={profile} />
        </div>
      )}
    </>
  );
};

export default RightBar;
