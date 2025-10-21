import React, { useState, useEffect, useRef } from "react";

export default function PlaneTakeoff() {
  const planeRef = useRef(null);
  const arenaRef = useRef(null);
  const [status, setStatus] = useState("Idle");
  const [adminAlt, setAdminAlt] = useState(400);
  const [altInput, setAltInput] = useState("");
  const [msg, setMsg] = useState("");

  const [running, setRunning] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    let autoTimer;
    const scheduleNext = () => {
      autoTimer = setTimeout(() => startFlight(), 4000);
    };
    scheduleNext();
    return () => clearTimeout(autoTimer);
  }, [adminAlt]);

  const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

  const startFlight = () => {
    if (running || collapsed) return;
    setRunning(true);
    setStatus("🛫 Taking off...");

    const plane = planeRef.current;
    const arena = arenaRef.current;
    if (!plane || !arena) return;

    const runDuration = randInt(2000, 6000);
    const maxAlt = randInt(100, adminAlt);
    const arenaRect = arena.getBoundingClientRect();
    const targetY = -maxAlt;
    const targetX = arenaRect.width - 100;

    plane.style.transition = `transform ${runDuration}ms cubic-bezier(.2,.9,.3,1)`;
    plane.style.transform = `translate(${targetX}px, ${targetY}px) rotate(-20deg)`;

    setTimeout(() => collapsePlane(), runDuration);
  };

  const collapsePlane = () => {
    if (!running) return;
    setRunning(false);
    setCollapsed(true);
    setStatus("💥 Plane collapsed!");

    const plane = planeRef.current;
    if (plane) plane.classList.add("collapsed");

    setTimeout(() => {
      if (plane) {
        plane.classList.remove("collapsed");
        plane.style.transition = "transform 0.8s ease";
        plane.style.transform = `translate(0px, 0px) rotate(0deg)`;
      }
      setCollapsed(false);
      setStatus("Idle");
    }, 4000);
  };

  const handleSetAlt = () => {
    const val = parseInt(altInput, 10);
    if (isNaN(val) || val < 100 || val > 1000) {
      setMsg("Enter a value between 100 and 1000.");
      return;
    }
    setAdminAlt(val);
    setMsg(`Altitude limit set to ${val}px.`);
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-b from-sky-200 to-sky-50 text-gray-900 font-sans">
      <header className="py-4 text-center">
        <h1 className="text-2xl font-bold text-blue-600">✈️ Plane Takeoff Simulation</h1>
      </header>

      <main className="flex flex-col items-center gap-4 w-full px-4">
        {/* Arena */}
        <div
          ref={arenaRef}
          className="relative w-full max-w-3xl h-[350px] bg-gradient-to-b from-sky-100 to-sky-200 rounded-xl shadow-lg overflow-hidden"
        >
          <div className="absolute top-4 left-4 bg-white/80 text-gray-600 text-sm px-3 py-1 rounded-md shadow-sm">
            {status}
          </div>
          <div className="absolute bottom-10 left-0 w-full h-[6px] bg-gradient-to-r from-gray-500 to-gray-400"></div>
          <div
            ref={planeRef}
            className="absolute bottom-10 left-5 text-4xl transition-transform duration-300 ease-in-out plane"
          >
            ✈️
          </div>
        </div>

        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-3xl">
          <div className="bg-white rounded-xl p-4 shadow">
            <h3 className="text-lg font-semibold text-gray-800">Admin Altitude</h3>
            <p className="text-sm text-gray-500">Set max altitude (100–1000)</p>
            <div className="flex gap-2 mt-2">
              <input
                type="number"
                value={altInput}
                onChange={(e) => setAltInput(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 w-28 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="100–1000"
              />
              <button
                onClick={handleSetAlt}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-3 py-2 rounded-md"
              >
                Set Altitude
              </button>
            </div>
            <div className="text-sm text-red-500 mt-1 min-h-[20px]">{msg}</div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow">
            <h3 className="text-lg font-semibold text-gray-800">Manual Takeoff</h3>
            <p className="text-sm text-gray-500">Click to manually trigger a flight</p>
            <div className="mt-3">
              <button
                onClick={startFlight}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-md"
              >
                Takeoff Now
              </button>
            </div>
          </div>
        </div>
      </main>

      <footer className="text-gray-500 text-sm mt-6 mb-4 text-center">
        Plane takes off randomly every 4 seconds. Collapses at a random altitude set by admin.
      </footer>

      <style>{`
        .plane.collapsed {
          opacity: 0;
          transform: translate(0, 200px) rotate(45deg);
          transition: transform 0.8s ease, opacity 0.8s ease;
        }
      `}</style>
    </div>
  );
}
