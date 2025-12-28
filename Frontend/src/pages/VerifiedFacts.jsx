import React, { useEffect, useRef, useState } from "react";
import SideBar from "../components/SideBar";
import Lenis from "lenis";
import api from "../api/axiosConfig";
import { Link } from "react-router-dom";

const VerifiedFacts = () => {
  const scrollRef = useRef(null);
  const [facts, setFacts] = useState([]);

  /* Fetch VERIFIED claims only */
  useEffect(() => {
    const fetchVerifiedFacts = async () => {
      try {
        const res = await api.get("/claim/verified"); // status === verified
        setFacts(res.data);
      } catch (err) {
        console.error("Failed to load verified facts:", err);
      }
    };
    fetchVerifiedFacts();
  }, []);

  /* Smooth scrolling */
  useEffect(() => {
    if (!scrollRef.current) return;
    const lenis = new Lenis({
      wrapper: scrollRef.current,
      content: scrollRef.current,
      smooth: true,
    });
    const raf = (t) => {
      lenis.raf(t);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
    return () => lenis.destroy();
  }, []);

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
        <SideBar />

        <div className="flex w-full">
          <div
            ref={scrollRef}
            className="
              w-3/4 ml-20
              h-[98%]
              px-8 py-6
              rounded-xl
              border-4 border-[#2A2F45]
              bg-transparent
              overflow-y-auto
              scrollbar-hide
            "
          >
            <style>{`.scrollbar-hide::-webkit-scrollbar { display: none; }`}</style>

            {/* Header */}
            <div className="mb-10">
              <h1
                className="text-[48px] font-[monaco] tracking-wide"
                style={{ textShadow: "2px 2px 3px rgba(123,108,255,0.6)" }}
              >
                Verified Facts
              </h1>
              <p className="text-gray-400 mt-2 max-w-3xl">
                These claims have passed community validation, evidence checks,
                and final verification by the system or moderators.  
                Verified facts are immutable and represent TruthSync’s trust layer.
              </p>
            </div>

            {/* Verified Facts List */}
            <div className="flex flex-col gap-8">
              {facts.length ? (
                facts.map((fact) => (
                  <div
                    key={fact._id}
                    className="
                      bg-[#151821]
                      border-2 border-green-600/40
                      rounded-xl
                      p-6
                      shadow-md shadow-green-700/20
                      flex flex-col gap-4
                    "
                  >
                    {/* Title + Badge */}
                    <div className="flex justify-between items-start">
                      <h2 className="text-[32px] font-[monaco] text-white">
                        {fact.title}
                      </h2>
                      <span className="
                        px-3 py-1
                        rounded-full
                        text-xs
                        bg-green-600/20
                        text-green-400
                        border border-green-600
                      ">
                        VERIFIED
                      </span>
                    </div>

                    {/* Meta */}
                    <div className="text-sm text-gray-400 flex flex-wrap gap-4">
                      <span>
                        Verified on{" "}
                        {new Date(fact.verifiedAt || fact.createdAt).toLocaleDateString()}
                      </span>
                      <span>Verified by: {fact.verifiedBy || "System"}</span>
                      {fact.source && <span>Source: {fact.source}</span>}
                    </div>

                    {/* Explanation (NOT decision by AI) */}
                    {fact.verificationReason && (
                      <div className="bg-[#1E2230] border border-[#2A2F45] rounded-lg p-4">
                        <div className="text-xs text-gray-400 mb-1">
                          Verification rationale
                        </div>
                        <p className="text-gray-200">
                          {fact.verificationReason}
                        </p>
                      </div>
                    )}

                    {/* Description */}
                    <p className="text-gray-200 text-lg">
                      {fact.description}
                    </p>

                    {/* Media */}
                    {fact.image ? (
                      fact.image.match(/\.(mp4|webm|ogg)$/) ? (
                        <video
                          controls
                          src={`${import.meta.env.VITE_BASE_URL}${fact.image}`}
                          className="max-h-72 rounded-lg border border-[#2A2F45]"
                        />
                      ) : (
                        <img
                          src={`${import.meta.env.VITE_BASE_URL}${fact.image}`}
                          className="max-h-72 rounded-lg border border-[#2A2F45]"
                          onError={(e) => (e.currentTarget.style.display = "none")}
                        />
                      )
                    ) : (
                      <div className="w-full h-40 bg-[#1E2230] rounded-lg" />
                    )}

                    {/* CTA */}
                    <div className="flex justify-end">
                      <Link
                        to={`/claim/${fact._id}`}
                        className="
                          px-4 py-2
                          rounded-xl
                          bg-[#7B6CFF]
                          hover:bg-[#6A5CFF]
                          transition
                          text-white
                        "
                      >
                        View Original Claim
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-gray-400">
                  No verified facts available yet.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default VerifiedFacts;
