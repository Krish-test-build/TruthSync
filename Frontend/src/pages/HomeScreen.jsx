import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import Profile from '../components/Profile'
import SideBar from '../components/SideBar'
import RightBar from '../components/RightBar'
import Lenis from 'lenis'
import api from '../api/axiosConfig'

const HomeScreen = () => {
  const scrollRef = useRef(null)
  const profileRef = useRef(null)
  const [claims, setClaims] = useState([])
  const [userVotes, setUserVotes] = useState({}) // { claimId: 'upvote' | 'downvote' | null }
  const [category, setCategory] = useState('')
  const [search, setSearch] = useState('')
  const [sortTop, setSortTop] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('') // 'success' or 'error'

  useEffect(() => {
    if (!scrollRef.current) return
    const lenis = new Lenis({ wrapper: scrollRef.current, content: scrollRef.current, smooth: true })
    const frame = (time) => { lenis.raf(time); requestAnimationFrame(frame) }
    const rafId = requestAnimationFrame(frame)
    return () => { cancelAnimationFrame(rafId); lenis.destroy() }
  }, [])

  const fetchClaims = async () => {
    try {
      let url = `/claim/sort?sort=${sortTop ? 'TopClaims' : 'MostRecent'}`
      if (category) url = `/claim/filterby/${category}`
      const res = await api.get(url, { withCredentials: true })
      const claimsData = res.data.claim || res.data
      setClaims(claimsData)
      // Set user votes and bookmarks from response
      const votes = {}
      claimsData.forEach(claim => {
        votes[claim._id] = claim.userVote || null
      })
      setUserVotes(votes)
    } catch (err) {
      console.error("Error fetching claims:", err)
    }
  }

  useEffect(() => { fetchClaims() }, [category, sortTop])

  useGSAP(() => {
    gsap.to(profileRef.current, { opacity: profileOpen ? 1 : 0, duration: 0.3, ease: "power3.inOut" })
  }, [profileOpen])

  const formatDate = (isoString) => new Date(isoString).toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" })

  const handleCategoryClick = (cat) => { setCategory(cat); setSortTop(false) }
  const handleTopClaimsClick = () => { setSortTop(true); setCategory('') }
  const homeClick = () => { setSortTop(false); setCategory('') }

  const showMessage = (msg, type) => {
    setMessage(msg)
    setMessageType(type)
    setTimeout(() => setMessage(''), 3000)
  }

  const handleVote = async (id, voteType) => {
    try {
      const res = await api.post(`/claim/${id}/vote`, { vote: voteType })
      console.log('vote response', res.data);

      const { message, upvote, downvote } = res.data
      setClaims((prev) =>
        prev.map((claim) =>
          claim._id === id ? { ...claim, upvote, downvote } : claim
        )
      )
      if (message === 'Vote removed') {
        setUserVotes((prev) => ({ ...prev, [id]: null }))
        showMessage('Vote removed!', 'success')
      } else {
        setUserVotes((prev) => ({ ...prev, [id]: voteType }))
        showMessage(`Claim ${voteType}d!`, 'success')
      }
    } catch (err) {
      console.error("Error voting:", err)
      showMessage('Failed to update vote.', 'error')
    }
  }

  const handleUpvote = (id) => handleVote(id, 'upvote')
  const handleDownvote = (id) => handleVote(id, 'downvote')

  const handleBookmark = async (id, bookmarked) => {
    try {
      if (bookmarked) {
        await api.delete(`/claim/${id}/bookmark`)
        setClaims((prev) =>
          prev.map((claim) =>
            claim._id === id ? { ...claim, bookmarked: false } : claim
          )
        )
        showMessage('Bookmark removed!', 'success')
      } else {
        await api.post(`/claim/${id}/bookmark`, {})
        setClaims((prev) =>
          prev.map((claim) =>
            claim._id === id ? { ...claim, bookmarked: true } : claim
          )
        )
        showMessage('Claim bookmarked!', 'success')
      }
    } catch (err) {
      console.error("Error bookmarking:", err)
      showMessage('Claim already bookmarked', 'error')
    }
  }

  const filteredClaims = claims.filter(c =>
    c.title?.toLowerCase().includes(search.toLowerCase()) &&
    (category ? c.category === category : true)
  )

  const sortedClaims = sortTop
    ? [...filteredClaims].sort((a, b) =>
        ((b.upvote || 0) + (b.downvote || 0)) -
        ((a.upvote || 0) + (a.downvote || 0))
      )
    : filteredClaims

  return (
    <>
      <div className="fixed top-0 left-0 w-full h-screen -z-10">
        <video autoPlay loop muted className="w-full h-full object-cover" src="https://video.wixstatic.com/video/f1c650_988626917c6549d6bdc9ae641ad3c444/720p/mp4/file.mp4" />
      </div>

      {message && (
        <div className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 ${messageType === 'success' ? 'bg-green-500' : 'bg-red-500'} text-white`}>
          {message}
        </div>
      )}

      <div className="h-screen w-full flex justify-between items-center p-4">
        <SideBar onCategoryClick={handleCategoryClick} onTopClaimsClick={handleTopClaimsClick} onHomeClick={homeClick} />

        <div className="flex flex-col w-3/4 space-y-6 items-center">
          <div className="flex justify-between w-full px-10 ml-5 mt-3">
            <div className="relative w-2/3 ml-7">
              <img src="./src/assets/search.svg" alt="Search" className="absolute top-1/2 mt-3 left-4 transform -translate-y-1/2 h-5 w-5" />
              <input
                type="text"
                placeholder="Search"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="caret-black text-black bg-white border-2 border-white rounded-full w-full pl-10 pr-4 py-2 mt-6 focus:bg-white focus:text-black focus:caret-black font-[SpaceMono]"
              />
            </div>
            <Link to="/newClaim" className="bg-gray-200 mr-15 text-black text-3xl px-6 py-1 mt-6 rounded-2xl font-[monaco] hover:scale-105 transition hover:cursor-pointer">New Claim</Link>
          </div>

          <h2 className="text-white text-2xl font-bold font-[SpaceMono]">
            {sortTop ? "Top Claims" : category ? `${category} Claims` : "All Claims"}
          </h2>

          <div ref={scrollRef} className="grid grid-cols-2 gap-4 gap-x-6 w-full max-h-120 h-120 px-10 overflow-y-auto drop-shadow-lg drop-shadow-purple-800">
            {sortedClaims.map(claim => (
              <div key={claim._id} className="bg-[#2a2a2a] text-white rounded-2xl p-4 space-y-3 flex flex-col justify-between h-68 font-[SpaceMono]">
                <div className="flex justify-between text-sm">
                  <h3>{claim.title}</h3>
                  <span>{claim.aiSummary || "AI Summary (TBD)"}</span>
                </div>

                {claim.image && claim.image.endsWith(".mp4") ? (
                  <video src={`${import.meta.env.VITE_BASE_URL}${claim.image}`} controls className="w-full h-32 rounded-lg object-cover" />
                ) : claim.image ? (
                  <img src={`${import.meta.env.VITE_BASE_URL}${claim.image}`} alt="Claim Media" className="max-w-full h-32 rounded-lg object-cover" />
                ) : (
                  <p className="text-lg text-white">{claim.description}</p>
                )}

                <div className="flex justify-between text-xs opacity-70">
                  <span>{formatDate(claim.createdAt)}</span>
                  <span>{claim.category || "Uncategorized"}</span>
                </div>

                <div className="flex flex-row items-center space-x-2">
                  <button
                    className={`flex flex-row p-2 rounded-full hover:cursor-pointer transition-all ease-in-out delay-50 hover:scale-105 ${userVotes[claim._id] === 'upvote' ? 'bg-red-600' : 'bg-red-700 hover:bg-red-600'}`}
                    onClick={() => handleUpvote(claim._id)}
                  >
                    <img src="./src/assets/upvote.svg" alt="Upvote" className="h-4 w-4 mr-1 mt-0.5" /> {claim.upvote || 0}
                  </button>

                  <button
                    className={`p-2 flex flex-row rounded-full hover:cursor-pointer transition-all ease-in-out delay-50 hover:scale-105 ${userVotes[claim._id] === 'downvote' ? 'bg-gray-300 text-black' : 'bg-white hover:bg-gray-300 text-black'}`}
                    onClick={() => handleDownvote(claim._id)}
                  >
                    <img src="./src/assets/downvote.svg" alt="Downvote" className="h-4 w-4 mr-1 mt-0.5" /> {claim.downvote || 0}
                  </button>

                  <button className={`ml-2 p-2 rounded-full cursor-pointer hover:scale-110 transition-all ease-in-out delay-50  ${claim.bookmarked ? 'bg-yellow-400' : 'bg-gray-200'}`} onClick={() => handleBookmark(claim._id, claim.bookmarked)}>
                    <img src="./src/assets/bookmark.png" alt="Bookmark" className="h-4 w-4" />
                  </button>

                  <Link to={`/claim/${claim._id}`} className="ml-auto flex items-center hover:scale-115 transition">
                    Open <img src="./src/assets/open.svg" alt="Open" className="bg-white h-5 w-5 ml-1 mt-1" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="h-full w-48 flex flex-col items-center justify-between py-6">
          <RightBar />
        </div>
      </div>
    </>
  )
}

export default HomeScreen