import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import Lenis from 'lenis'
import api from '../api/axiosConfig'

import SideBar from '../components/SideBar'
import RightBar from '../components/RightBar'

import upvote from '../assets/upvote.svg'
import downvote from '../assets/downvote.svg'
import bookmark from '../assets/bookmark.svg'
import openIcon from '../assets/open.svg'

const HomeScreen = () => {
  const scrollRef = useRef(null)

  const [claims, setClaims] = useState([])
  const [userVotes, setUserVotes] = useState({})
  const [search, setSearch] = useState('')
  const [sortMode, setSortMode] = useState('MostRecent')
  const [category, setCategory] = useState(null)

  /* Smooth scroll */
  useEffect(() => {
    if (!scrollRef.current) return
    const lenis = new Lenis({
      wrapper: scrollRef.current,
      content: scrollRef.current,
      smooth: true,
    })
    const raf = (t) => {
      lenis.raf(t)
      requestAnimationFrame(raf)
    }
    requestAnimationFrame(raf)
    return () => lenis.destroy()
  }, [])

  /* Fetch claims */
  useEffect(() => {
    const fetchClaims = async () => {
      try {
        let res
        if (category) {
          const r = await api.get(`/claim/filterby/${category}`)
          res = { data: r.data.claim }
        } else {
          res = await api.get(`/claim/sort?sort=${sortMode}`)
        }

        const data = res.data.claim || res.data
        setClaims(data)

        const votes = {}
        data.forEach(c => {
          votes[c._id] = c.userVote || null
        })
        setUserVotes(votes)
      } catch (err) {
        console.error('Fetch claims error:', err)
      }
    }

    fetchClaims()
  }, [sortMode, category])

  /* Voting */
  const handleVote = async (id, type) => {
    try {
      const res = await api.post(`/claim/${id}/vote`, { vote: type })
      const { upvote, downvote, message } = res.data

      setClaims(prev =>
        prev.map(c =>
          c._id === id ? { ...c, upvote, downvote } : c
        )
      )

      setUserVotes(prev => ({
        ...prev,
        [id]: message === 'Vote removed' ? null : type,
      }))
    } catch (err) {
      console.error('Vote error:', err)
    }
  }

  /* Bookmark */
  const handleBookmark = async (id, bookmarked) => {
    try {
      if (bookmarked) await api.delete(`/claim/${id}/bookmark`)
      else await api.post(`/claim/${id}/bookmark`)

      setClaims(prev =>
        prev.map(c =>
          c._id === id ? { ...c, bookmarked: !bookmarked } : c
        )
      )
    } catch (err) {
      console.error('Bookmark error:', err)
    }
  }

  /* Only APPROVED claims appear on Home */
  const visibleClaims = claims.filter(c =>
    c.status === 'Approved' &&
    c.title?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <>
      {/* Background */}
      <div className="fixed inset-0 -z-10">
        <video
          autoPlay
          loop
          muted
          className="w-full h-full object-cover"
          src="https://video.wixstatic.com/video/f1c650_988626917c6549d6bdc9ae641ad3c444/720p/mp4/file.mp4"
        />
        <div className="absolute inset-0 bg-black/45" />
      </div>

      <div className="h-screen w-full flex p-4 font-[SpaceMono] text-[#E6E8EE]">
        {/* Left */}
        <SideBar
          onHomeClick={() => {
            setCategory(null)
            setSortMode('MostRecent')
          }}
          onTopClaimsClick={() => {
            setCategory(null)
            setSortMode('TopClaims')
          }}
          onCategoryClick={(cat) => {
            setCategory(cat)
            setSortMode('MostRecent')
          }}
        />

        {/* Center */}
        <div className="flex flex-col w-3/4 space-y-6 items-center">
          {/* Search + New */}
          <div className="flex justify-between w-full px-10 mt-4">
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search"
              className="
                w-2/3 px-5 py-1.5 rounded-xl
                bg-[#141823]
                border border-[#242837]
                text-[#E6E8EE]
                focus:outline-none
              "
            />

            <Link
              to="/newClaim"
              className="
                px-6 py-1 rounded-xl
                bg-[#7B6CFF]
                text-white text-3xl
                font-[monaco]
                hover:opacity-90 transition
              "
            >
              New Claim
            </Link>
          </div>

          {/* Heading */}
          <h2 className="text-white text-4xl font-[monaco] tracking-wide">
            {category
              ? `${category} Claims`
              : sortMode === 'TopClaims'
              ? 'Top Claims'
              : 'All Claims'}
          </h2>

          {/* Claims Grid */}
          <div
            ref={scrollRef}
            className="
              grid grid-cols-2 gap-6
              w-[98%] pl-6 pr-4 mr-10
              overflow-y-auto
              max-h-[75vh]
            "
          >
            {visibleClaims.map(claim => (
              <div
                key={claim._id}
                className="
                  bg-[#151821]
                  border border-[#242837]
                  rounded-lg
                  p-3.5
                  flex flex-col
                "
              >
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-[monaco] text-2xl">
                    {claim.title}
                  </span>
                  <span className="text-[#9AA0B2]">
                    AI Summary (TBD)
                  </span>
                </div>

                {/* Media */}
                {claim.image ? (
                  claim.image.endsWith('.mp4') ? (
                    <video
                      src={`${import.meta.env.VITE_BASE_URL}${claim.image}`}
                      controls
                      className="w-full h-32 rounded-md object-cover"
                    />
                  ) : (
                    <img
                      src={`${import.meta.env.VITE_BASE_URL}${claim.image}`}
                      className="w-full h-32 rounded-md object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none'
                      }}
                    />
                  )
                ) : (
                  <div className="w-full h-50 rounded-md bg-[#1E2230]" />
                )}

                <div className="flex justify-between text-xs text-[#9AA0B2] mt-2">
                  <span>
                    {new Date(claim.createdAt).toLocaleDateString()}
                  </span>
                  <span>{claim.category}</span>
                </div>

                <div className="flex items-center gap-2 mt-3">
                  <button
                    onClick={() => handleVote(claim._id, 'upvote')}
                    className={`flex items-center gap-1 px-2 py-2.5 rounded-full
                      ${
                        userVotes[claim._id] === 'upvote'
                          ? 'bg-[#7B6CFF]'
                          : 'bg-[#1E2230] hover:bg-[#353b53]'
                      }`}
                  >
                    <img src={upvote} className="h-4 w-4" />
                    <span className="text-xs">{claim.upvote ?? 0}</span>
                  </button>

                  <button
                    onClick={() => handleVote(claim._id, 'downvote')}
                    className={`flex items-center gap-1 px-2 py-2.5 rounded-full
                      ${
                        userVotes[claim._id] === 'downvote'
                          ? 'bg-[#7B6CFF]'
                          : 'bg-[#1E2230] hover:bg-[#353b53]'
                      }`}
                  >
                    <img src={downvote} className="h-4 w-4" />
                    <span className="text-xs">{claim.downvote ?? 0}</span>
                  </button>

                  <button
                    onClick={() =>
                      handleBookmark(claim._id, claim.bookmarked)
                    }
                    className={`ml-1 p-2 rounded-full
                      ${
                        claim.bookmarked
                          ? 'bg-[#7B6CFF]'
                          : 'bg-[#1E2230] hover:bg-[#353b53]'
                      }`}
                  >
                    <img src={bookmark} className="h-4 w-4" />
                  </button>

                  <Link
                    to={`/claim/${claim._id}`}
                    className="ml-auto flex items-center gap-1 text-sm text-gray-400 hover:text-white"
                  >
                    Open <img src={openIcon} className="h-5 w-5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        <RightBar />
      </div>
    </>
  )
}

export default HomeScreen
