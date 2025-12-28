import React, { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import Profile from '../components/Profile'
import axios from 'axios'
import defaultImage from '../assets/profile.svg'

const RightBar = () => {
  const navigate = useNavigate()
  const profileRef = useRef(null)

  const [profileOpen, setProfileOpen] = useState(false)
  const [hydrated, setHydrated] = useState(false)
  const [user, setUser] = useState(null)

  const logoutHandler = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    navigate('/')
  }

  const profile = async () => {
    try {
      const res = await axios.get(
        'http://localhost:4000/profile',
        { withCredentials: true }
      )
      if (res.status === 200) {
        setUser(res.data)
        return res.data
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    profile()
  }, [])

  useGSAP(() => {
    gsap.to(profileRef.current, {
      opacity: profileOpen ? 1 : 0,
      duration: 0.3,
      ease: 'power3.inOut',
    })
  }, [profileOpen])

  return (
    <>
      <div
        className="
          flex h-screen w-48 flex-col items-center justify-between
          absolute right-3.5 top-4 py-6
          bg-gradient-to-b from-black/35 to-black/15
          rounded-3xl
        "
      >
        {/* Profile */}
        <img
          onClick={() => {
            setHydrated(!hydrated)
            setProfileOpen(!profileOpen)
          }}
          src={
            user?.image
              ? `${import.meta.env.VITE_BASE_URL}${user.image}`
              : defaultImage
          }
          alt="Profile"
          className="
            hover:cursor-pointer
            h-30 w-30
            bg-[#1E2230]
            border-2 border-[#7B6CFF]/60
            rounded-3xl
            hover:scale-110
            transition
            object-cover object-center
            -mb-4
          "
          
        />
        <div className='text-white -mt-1 text-lg'>
          {user?.firstName } {user?.lastName}
        </div>

        {/* Navigation */}
        <div
          className="
            text-[#E6E8EE]
            text-[40px]
            tracking-wide
            font-bold font-[monaco]
            space-y-6
            mt-10 pl-7
          "
        >
          <div className="hover:scale-115 transition cursor-pointer hover:text-[#B8B2FF]">
            <Link
              to="/myClaims"
              style={{
                textShadow: '2px 2px 3px rgba(123,108,255,0.55)',
              }}
            >
              My Claims
            </Link>
          </div>

          <div className="hover:scale-115 transition cursor-pointer hover:text-[#B8B2FF]">
            <Link
              to="/myComments"
              style={{
                textShadow: '2px 2px 3px rgba(123,108,255,0.55)',
              }}
            >
              My Comments
            </Link>
          </div>

          <div className="hover:scale-115 transition cursor-pointer hover:text-[#B8B2FF]">
            <Link
              to="/bookmarks"
              style={{
                textShadow: '2px 2px 3px rgba(123,108,255,0.55)',
              }}
            >
              Bookmarks
            </Link>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={logoutHandler}
          className="
            bg-[#b30000e6]
            mb-8
            text-white
            text-4xl
            font-bold font-[monaco]
            px-6 py-2
            rounded-full
            hover:bg-[#9B3A3A]
            transition
            hover:scale-110
            cursor-pointer
          "
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
  )
}

export default RightBar
