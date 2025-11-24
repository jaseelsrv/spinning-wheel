
// "use client";
// import React, { useState, useEffect, useRef } from 'react';

// // Include Bootstrap CSS via CDN for basic styling and responsiveness
// const BootstrapCSS = () => (
//     <link
//         rel="stylesheet"
//         href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
//         crossOrigin="anonymous"
//     />
// );

// // --- CONSTANTS ---
// // Segment labels updated to reflect the products shown in the UI screenshots.
// const PRIZE_SEGMENTS = [
//   { label: "Frying Pan", icon: '🍳', color: "#FF6347" }, // Tomato Red
//   { label: "Better Luck Next Time", icon: '❌', color: "#2F4F4F" }, // Dark Slate Gray
//   { label: "Pressure Cooker", icon: '🍲', color: "#1E90FF" }, // Dodger Blue
//   { label: "Better Luck Next Time", icon: '❌', color: "#2F4F4F" }, // Dark Slate Gray
//   { label: "Sandwich Maker", icon: '🥪', color: "#DA70D6" }, // Orchid
//   { label: "Better Luck Next Time", icon: '❌', color: "#2F4F4F" }, // Dark Slate Gray
//   { label: "Dinner Plate Set", icon: '🍽️', color: "#FFD700" }, // Gold
//   { label: "Better Luck Next Time", icon: '❌', color: "#2F4F4F" }, // Dark Slate Gray
// ];

// const NUM_SEGMENTS = PRIZE_SEGMENTS.length;
// const SEGMENT_ANGLE = 360 / NUM_SEGMENTS;
// const POINTER_OFFSET = 90; // The pointer is at the top (90 deg from 3 o'clock)

// // --- HELPER FUNCTION: CANVAS DRAWING ---
// const drawWheel = (ctx, canvasRef, currentRotation = 0) => {
//   if (!canvasRef.current) return;

//   const canvas = canvasRef.current;
//   const size = canvas.width;
//   const center = size / 2;
//   const radius = center * 0.9;

//   ctx.clearRect(0, 0, size, size);

//   PRIZE_SEGMENTS.forEach((segment, index) => {
//     const startAngle = index * SEGMENT_ANGLE - POINTER_OFFSET;
//     const endAngle = (index + 1) * SEGMENT_ANGLE - POINTER_OFFSET;
//     const startRad = (startAngle * Math.PI) / 180;
//     const endRad = (endAngle * Math.PI) / 180;

//     // Draw the segment
//     ctx.beginPath();
//     ctx.moveTo(center, center);
//     ctx.arc(center, center, radius, startRad, endRad);
//     ctx.closePath();
//     ctx.fillStyle = segment.color;
//     ctx.fill();

//     // Draw text (label) and icon
//     ctx.save();
//     ctx.translate(center, center);
//     const textAngle = startRad + (SEGMENT_ANGLE / 2) * (Math.PI / 180);
//     ctx.rotate(textAngle);

//     // Text Label
//     ctx.fillStyle = (segment.color === "#FFD700" || segment.color === "#FF6347") ? "#2B083B" : "white";
//     ctx.font = 'bold 12px Inter, sans-serif';
//     ctx.textAlign = 'right';
//     ctx.fillText(segment.label, radius * 0.8, 5); // Shift text down slightly
    
//     // Icon (Emoji) - Placed above the text label
//     ctx.font = '20px Arial'; // Use a larger font for the emoji
//     ctx.textAlign = 'right';
//     ctx.fillText(segment.icon, radius * 0.8, -10); // Shift icon up

//     ctx.restore();
//   });

//   // Draw central hub
//   ctx.beginPath();
//   ctx.arc(center, center, radius * 0.2, 0, 2 * Math.PI);
//   ctx.fillStyle = '#C0C0C0';
//   ctx.fill();
//   ctx.lineWidth = 3;
//   ctx.strokeStyle = '#FFD700';
//   ctx.stroke();

//   // Draw outer rim
//   ctx.beginPath();
//   ctx.arc(center, center, radius, 0, 2 * Math.PI);
//   ctx.lineWidth = 6;
//   ctx.strokeStyle = '#FFD700';
//   ctx.stroke();
// };


// // --- TONE.JS SOUND LOGIC (for spin effects) ---
// const useTone = () => {
//     const spinSynthRef = useRef(null);
//     const winSynthRef = useRef(null);

//     const startSpinSound = async () => {
//         if (typeof window.Tone === 'undefined') {
//             // Tone.js must be loaded via CDN for this to work
//             return;
//         }
//         await window.Tone.start();
        
//         if (!spinSynthRef.current) {
//             const noise = new window.Tone.Noise("white").toDestination();
//             const autoFilter = new window.Tone.AutoFilter({
//                 frequency: "8n", depth: 1, baseFrequency: 2000, octaves: 2
//             }).toDestination().start();
//             noise.connect(autoFilter);
//             noise.volume.value = -10;
//             noise.start();
//             spinSynthRef.current = noise;
//         }
//     };

//     const stopSpinSound = () => {
//         if (spinSynthRef.current) {
//             spinSynthRef.current.stop();
//             spinSynthRef.current.dispose();
//             spinSynthRef.current = null;
//         }
//     };

//     const playWinSound = async () => {
//         if (typeof window.Tone === 'undefined') return;
//         await window.Tone.start();
//         const synth = new window.Tone.MembraneSynth().toDestination();
//         winSynthRef.current = synth;
//         synth.triggerAttackRelease("C5", "8n");
//         synth.triggerAttackRelease("G5", "8n", "+0.2");
//         synth.triggerAttackRelease("C6", "4n", "+0.4");
//         setTimeout(() => {
//             synth.dispose();
//             winSynthRef.current = null;
//         }, 1000);
//     };

//     return { startSpinSound, stopSpinSound, playWinSound };
// };


// // --- MAIN APP COMPONENT ---
// export default function App() {
//   const [currentView, setCurrentView] = useState('register');
//   const [userData, setUserData] = useState({
//     name: '', mobile: '', city: '', registrationId: '', prize: null, code: null,
//   });
//   const [formData, setFormData] = useState({ name: '', mobile: '', city: '' });
//   const [wheelRotation, setWheelRotation] = useState(0);
//   const [isSpinning, setIsSpinning] = useState(false);
//   const canvasRef = useRef(null);
//   const { startSpinSound, stopSpinSound, playWinSound } = useTone();

//   // Set initial Reg ID
//   useEffect(() => {
//     // Generate a more stylized Reg ID
//     const newRegistrationId = '#' + Math.floor(1000000 + Math.random() * 9000000);
//     setUserData(prev => ({ ...prev, registrationId: newRegistrationId }));
//   }, []);

//   // Redraw the canvas
//   useEffect(() => {
//     if (currentView === 'spin' && canvasRef.current) {
//       const ctx = canvasRef.current.getContext('2d');
//       const container = canvasRef.current.parentElement;
      
//       // Responsive Canvas size
//       const size = Math.min(container.offsetWidth, container.offsetHeight, 350);
//       canvasRef.current.width = size;
//       canvasRef.current.height = size;
      
//       drawWheel(ctx, canvasRef, wheelRotation);
//     }
//     return () => { if (isSpinning) { stopSpinSound(); } };
//   }, [currentView, wheelRotation, isSpinning, stopSpinSound]);


//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleRegistration = (e) => {
//     e.preventDefault();
//     if (!formData.name || !formData.mobile || !formData.city) {
//       console.error("Please fill all fields.");
//       return;
//     }
//     setUserData(prev => ({ ...prev, ...formData, code: 'AD' + Math.floor(1000 + Math.random() * 9000) }));
//     setCurrentView('spin');
//   };

//   const handleSpin = () => {
//     if (isSpinning) return;

//     setIsSpinning(true);
//     startSpinSound();

//     // 25% chance of winning a prize (non-Better Luck Next Time)
//     const prizeSegments = PRIZE_SEGMENTS.filter(p => p.label !== "Better Luck Next Time");
//     const nonPrizeSegments = PRIZE_SEGMENTS.filter(p => p.label === "Better Luck Next Time");

//     let winningPrize;
//     let winningIndex;

//     if (Math.random() < 0.25) { // 25% chance to win an actual prize
//         winningPrize = prizeSegments[Math.floor(Math.random() * prizeSegments.length)];
//         winningIndex = PRIZE_SEGMENTS.findIndex(p => p.label === winningPrize.label);
//     } else { // 75% chance to lose
//         winningPrize = nonPrizeSegments[Math.floor(Math.random() * nonPrizeSegments.length)];
//         // Find the index of a "Better Luck Next Time" segment
//         const possibleIndices = PRIZE_SEGMENTS.map((p, i) => (p.label === winningPrize.label ? i : -1)).filter(i => i !== -1);
//         winningIndex = possibleIndices[Math.floor(Math.random() * possibleIndices.length)];
//     }
    
//     // Calculate the target rotation
//     const targetSegmentCenterAngle = (winningIndex * SEGMENT_ANGLE) + (SEGMENT_ANGLE / 2);
//     // Add 5 full rotations (1800 deg) + the remaining degrees to center the winning segment under the pointer (90 deg from 3 o'clock)
//     const totalSpinDegrees = (5 * 360) + (360 - targetSegmentCenterAngle);

//     setWheelRotation(totalSpinDegrees);

//     setTimeout(() => {
//       setIsSpinning(false);
//       stopSpinSound();

//       if (winningPrize.label !== "Better Luck Next Time") {
//         playWinSound();
//       }
      
//       setUserData(prev => ({
//         ...prev,
//         prize: winningPrize,
//         code: (winningPrize.label === "Better Luck Next Time" ? null : prev.code),
//       }));
//       setCurrentView('reward');
//       setWheelRotation(0);
//     }, 5000);
//   };
  
//   // Reusable detail component
//   const DetailItem = ({ label, value, highlight = false }) => (
//     <div className="d-flex justify-content-between my-2">
//         <span className="text-dark small opacity-75 fw-medium me-3">{label}:</span>
//         <span className={`small text-end fw-semibold ${highlight ? 'text-danger' : 'text-dark'}`}>{value}</span>
//     </div>
//   );

//   // Screen 1: Registration Form
//   const renderRegister = () => (
//     <div className="content-card p-4 p-sm-5 d-flex flex-column">
//       <h2 className="text-center mb-4 form-title-custom">Enter Your Details</h2>
//       <form onSubmit={handleRegistration} className="space-y-4">
        
//         {/* Name Input */}
//         <div className="mb-3">
//             <label htmlFor="name" className="  label">Your Name</label>
//             <input
//               id="name"
//               type="text"
//               name="name"
//               placeholder="Enter Your Name"
//               value={formData.name}
//               onChange={handleInputChange}
//               className="form-control glass-input"
//               required
//             />
//         </div>

//         {/* Mobile Input */}
//         <div className="mb-3">
//             <label htmlFor="mobile" className="label">Mobile Number</label>
//             <input
//               id="mobile"
//               type="tel"
//               name="mobile"
//               placeholder="Enter Mobile Number"
//               value={formData.mobile}
//               onChange={handleInputChange}
//               className="form-control glass-input"
//               required
//             />
//         </div>

//         {/* City Input */}
//         <div className="mb-4">
//             <label htmlFor="city" className="label">City</label>
//             <input
//               id="city"
//               type="text"
//               name="city"
//               placeholder="City"
//               value={formData.city}
//               onChange={handleInputChange}
//               className="form-control glass-input"
//               required
//             />
//         </div>
// <div className="d-flex justify-content-center">    <button
//           type="submit"
//           className=" btn-submit-custom "
//         >
//           Submit
//         </button></div>
    
//       </form>
//     </div>
//   );



//   // Screen 3: The Spinning Wheel
//   const renderSpin = () => (
//     <div className=" p-4 p-sm-5 d-flex flex-column align-items-center text-center">
//       {/* <h2 className="mb-5 text-dark fw-bold fs-4">Spin the Wheel to Reveal Your Reward</h2> */}
//       <div
//         className="wheel-container position-relative mb-5"
//         style={{ width: '300px', height: '300px', maxWidth: '100%' }}
//       >
        
//         {/* The Wheel Pointer (Fixed Position) */}
//         <div className="wheel-pointer" />
        
//         {/* The Spinning Wheel Canvas container */}
//         <div
//           className={`wheel-spin-area ${isSpinning ? 'spinning' : ''}`}
//           style={{
//             transform: `rotate(${wheelRotation}deg)`,
//             pointerEvents: isSpinning ? 'none' : 'auto'
//           }}
//         >
//           <canvas
//             ref={canvasRef}
//             className="w-100 h-100 rounded-circle"
//           />
//         </div>
//       </div>
      
//       <button
//         onClick={handleSpin}
//         disabled={isSpinning}
//         className={`btn btn-lg w-100 btn-spin-custom shadow-lg ${isSpinning ? 'disabled-spin' : ''}`}
//       >
//         {isSpinning ? 'SPINNING...' : 'Spin'}
//       </button>

//     </div>
//   );

//   // Screen 4: Final Reward Pop-up
// // Screen 4: Final Reward Pop-up
// const renderReward = () => (
//     // Outer container for the whole screen (d-flex is fine)
//     <div className="d-flex flex-column align-items-center justify-content-start h-100 p-3 reward-screen-container">
        
//         {/* Frosted Glass Content Card - Positioned relative to hold the absolute CONGRATS image */}
//       <div className="reward-content-card p-4 p-sm-5 text-center" style={{
//     // Size and Shape
//     width: '100%',
//     maxWidth: '355px',
//     height: 'auto',
//     borderRadius: '32px',
    
//     // 👇 IMAGE BACKGROUND STYLES ADDED HERE 👇
//     // backgroundImage: 'url("YOUR_BACKGROUND_IMAGE_URL")', // REPLACE with your actual image path/URL
//     backgroundSize: 'cover',        // Ensures the image covers the entire card
//     backgroundPosition: 'center',   // Centers the image
//     backgroundRepeat: 'no-repeat',  // Prevents tiling

//     // Frosted Glass Effect (Keep these to create the translucent overlay)
//     // background: 'rgba(255, 255, 255, 0.1)', // This creates the 10% white overlay
//     backdropFilter: 'blur(10px)',
    
//     // Border
//     border: '1px solid rgba(255, 255, 255, 0.22)',
    
//     // Other existing styles
//     boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
// }}>
            
//             {/* 1. CONGRATS Text Art - ABSOLUTELY POSITIONED */}
//             {/* <img
//                 src="/Layer 1.svg"
//                 alt="Congratulations"
//                 className="congrats-img-reward" // NEW Class for specific styling
//                 // We don't use inline styles here, rely on CSS classes for absolute positioning
//             /> */}
            
//             {/* 2. Prize Text */}
//             <div className="win-message-text mb-2">
//      You won 10% Cashback
//             </div>
//             {/* <p className="fs-1 fw-bold text-white mb-4">
//                 {userData.prize?.label === "Better Luck Next Time" ? "Better Luck Next Time!" : "Cashback"}
//             </p> */}

//       {/* 3. Registration ID & Name Block */}
//       <hr/>
//             <div className="text-white text-start mb-3">
//                 <div className="d-flex justify-content-between mb-1 small mb-3">
//                     <span className="detail-label-text">Registration ID:</span>
//                     <span className="detail-label-text">{userData.registrationId || "#122878999"}</span>
//                 </div>
//                 <div className="d-flex justify-content-between small mb-3">
//                     <span className="detail-label-text">Name:</span>
//                     <span className="detail-label-text">{userData.name || "Darsh Bhavsar"}</span>
//                 </div>
//             </div>

//             {/* 4. Code Input */}
//             <div className="mb-4">
//                 <input
//                 type="text"
//                 value={userData.code || "AD456J"}
//                 readOnly
//                 // --- APPLY NEW CLASS AND REMOVE CONFLICTING CLASSES ---
//                 className="form-control text-center reward-code-input"
//                 // --- INLINE STYLE FOR WIDTH (320px) AND HEIGHT (56px) IS NOW HANDLED BY THE CLASS/CONTAINER WIDTH ---
//                 style={{
//                     // Width is now effectively 100% of the card, which is 320px wide (minus padding)
//                     // If you specifically need 320px width, ensure the card is wide enough or set width: '320px' here
//                     // I will let it be 100% width for responsiveness, assuming the parent card width is appropriate.
//                     height: '56px', // Applied the new height
//                 }}
//             />
//             </div>
            
//             {/* 5. Screenshot Instruction */}
//             <p className="detail-label-text">
//                 Take a screenshot to save your code
//             </p>

//         </div>
//     </div>
// );
  
//   // --- MAIN RENDER LOGIC ---
//   const renderView = () => {
//     switch (currentView) {
//       // case 'success':
//       //   return renderSuccess();
//       case 'spin':
//         return renderSpin();
//       case 'reward':
//         return renderReward();
//       case 'register':
//       default:
//         return renderRegister();
//     }
//   };

//   return (
//     <>
//       {/* Tone.js CDN for sound effects */}
//       <script src="https://cdnjs.cloudflare.com/ajax/libs/tone/14.8.49/Tone.min.js"></script>
//       <BootstrapCSS />
//       <style>{`
//         /* Custom SCSS for Holiday UI */
        
//         @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;900&display=swap');
        
//         :root {
//             --holiday-red-dark: #8B0000;
//             --holiday-red-light: #C40000;
//             --gold: #FFD700;
//         }

//         body {
//             font-family: 'Inter', sans-serif;
//             background-color: #333; /* Default dark gray */
//         }
        
//         .app-container {
        
//             min-height: 100vh;
//             display: flex;
//             align-items: center;
//             justify-content: center;
//             padding: 0;
//             /* Holiday Background - Used an image of red background with gifts and snow/glitter */
//             background-image: url('/bg-img.png');
//             background-size: cover;
//             background-position: center;
//             background-repeat: no-repeat;
       
//              position: relative; /* required for bottom absolute image */
//   overflow: hidden;   /* so image won't overflow page */
//         }
// .bottom-decoration {
//   position: absolute;
//   bottom: 0;
//   left: 50%;
//   transform: translateX(-50%); /* center horizontally */
//   width: auto;     /* adjust depending on your image */
//   // height: 130px;   /* or anything you want */
//   pointer-events: none; /* prevents blocking button clicks */
// }

//         .main-card {
//             /* This div now acts as the full-screen container on mobile, holding the glass card */
//             width: 100%;
//             max-width: 400px;
//             min-height: 100vh;
//             border-radius: 0;
//             display: flex;
//             flex-direction: column;
//             align-items: center;
//             justify-content: center;
//             padding: 1rem;
//         }

//     hr {
//     border: none; /* Remove default browser HR styling */
//     border-bottom: 1px solid #FFFFFF38; /* Apply the desired translucent border color */
//     margin: 1rem 0; /* Add some vertical space around it */
//     opacity: 1; /* Ensure the line is fully visible with the set color */
// }
// .content-card {
//    background: transparent;
//   // backdrop-filter: blur(11px);
//   -webkit-backdrop-filter: blur(11px); /* Safari support */
//   border: 1px solid rgba(255, 255, 255, 0.22);
//   border-radius: 32px;
//   box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.3);
  
//   width: 100%;
//   max-width: 350px;
//   height: auto;
//   color: #333;
//   opacity: 1;         /* (Optional: default is already 1) */
// }
//   .detail-label-text {
//     font-family: 'DM Sans', sans-serif;
//     font-weight: 400; /* Regular */
//     font-size: 16px;
//     line-height: 1; /* 100% line height */
//     letter-spacing: 0;
//     /* --- UPDATED TEXT COLOR TO SOLID WHITE --- */
//     color: #FFFFFF !important;
//     /* The opacity on the original span element is removed since we want solid white now */
// }
//         /* Responsive adjustments for the card */
//         @media (min-width: 576px) {
//             .main-card {
//                 min-height: auto;
//                 margin: 2rem;
//             }
//         }
//         .reward-code-input {
//     /* Background and Border */
//     background: #FFFFFF !important;
//     border: 2px dashed #D1D5DB !important; /* Dashed Border Style */
    
//     /* Typography */
//     font-family: 'DM Sans', sans-serif !important;
//     font-weight: 400 !important; /* Regular */
//     font-size: 16px !important;
//     line-height: 28px !important; /* Line Height */
//     letter-spacing: 0 !important;
//     color: #404040 !important; /* Text Color */
    
//     /* Override Bootstrap/Existing styles */
//     border-radius: 8px !important;
//     padding-top: 0 !important;
//     padding-bottom: 0 !important;
// }

// /* You must also remove the old classes that conflict */
// .form-control.reward-code-input {
//     /* Ensures the text is vertically centered due to line-height and height */
//     height: 56px !important;
//     display: flex;
//     align-items: center;
//     justify-content: center;
// }
//         /* Logo positioning */
//         .logo-wrapper {
//             position: absolute;
//             top: 2rem;
//             left: 50%;
//             transform: translateX(-50%);
//             z-index: 10;
//         }

//         .logo-img {
//             height: 3.5rem;
//             filter: drop-shadow(0 4px 6px rgba(0,0,0,0.4));
//         }
        
//         /* Glass Input Styling */
//       .glass-input {
//       width:100%;
//   // width: 298.8656px;         // Added unit (px) — consider using responsive units like % or clamp() in real projects
//   height: 44px;              // Added unit (px)
//   padding: 11px 20px;        // Shorthand for padding-top/right/bottom/left
//   gap: 12px;                 // Only works if this element is a flex/grid container (ignored on <input>)
//   border-radius: 8px;
//   border: 1px solid rgba(255, 255, 255, 0.22);
//   background: rgba(255, 255, 255, 1); // Fully opaque white (not glass — see note below)
//   color: #333;
//   font-weight: 500;
//   opacity: 1;
//   transition: all 0.2s ease;

//   // Optional: Remove default input styles
//   outline: none;
//   box-shadow: none;

//   // Optional: Placeholder style
//   &::placeholder {
//     color: rgba(51, 51, 51, 0.6);
//   }
// }
//         .glass-input::placeholder {
//             color: rgba(51, 51, 51, 0.5);
//         }
//         .glass-input:focus {
//             background-color: white;
//             border-color: var(--holiday-red-light);
//             box-shadow: 0 0 0 0.25rem rgba(196, 0, 0, 0.25);
//             color: #333;
//         }

       
// .btn-spin-custom,
// .btn-submit-custom {
//   width: 173px;
//   height: 48px;
//   border-radius: 58px;
//   border: none;
//   cursor: pointer;
//   outline: none;

//   display: flex;
//   justify-content: center;
//   align-items: center;
//   margin: 0 auto;

//   /* Glossy gold gradient */
//   background: linear-gradient(180deg, #FFC93C 0%, #F8AE00 100%);
  
//   /* White top glossy highlight */
//   position: relative;
//   overflow: hidden;

//   /* Glow + shine */
//   box-shadow:
//     0 8px 18px rgba(0, 0, 0, 0.25),
//     inset 0 2px 4px rgba(255, 255, 255, 0.45),
//     inset 0 -3px 6px rgba(0, 0, 0, 0.3);

//   font-family: 'DM Sans', sans-serif;
//   font-weight: 500;
//   font-size: 18px;
//   color: #ffffff;
//   transition: 0.25s ease;
//   text-transform: none;
// }
// .btn-spin-custom::before,
// .btn-submit-custom::before {
//   content: "";
//   position: absolute;
//   top: 0;
//   left: 0;
//   width: 100%;
//   height: 50%;
//   border-radius: inherit;
//   background: rgba(255, 255, 255, 0.35);
//   filter: blur(8px);
// }
// .btn-spin-custom:hover,
// .btn-submit-custom:hover {
//   transform: scale(1.05);
//   filter: brightness(1.08);
// }


//         .btn-spin-custom {
//             font-size: 1.5rem;
//         }

//         .btn-reset-custom {
//             background: #f8f9fa;
//             color: var(--holiday-red-dark) !important;
//             border: 1px solid var(--holiday-red-light);
//         }

//         .disabled-spin {
//             background: #adb5bd !important;
//             cursor: not-allowed;
//             color: #e9ecef !important;
//             pointer-events: none;
//         }
        
//         /* Success/Checkmark Icon Styling */
//         .icon-wrapper {
//             background-color: #28a745; /* Success green */
//             border-radius: 50%;
//             padding: 0.5rem;
//             box-shadow: 0 0 10px rgba(40, 167, 69, 0.5);
//         }
//         .icon-large {
//             width: 3rem;
//             height: 3rem;
//         }


//         /* Wheel Styling */
//         .wheel-container {
//             position: relative;
//         }
//           .win-message-text {
//     font-family: 'DM Sans', sans-serif;
//     font-weight: 600; /* SemiBold */
//     font-size: 28px;
//     line-height: 1; /* 100% line height */
//     letter-spacing: -0.3px;
//     color: #FFFFFF !important;
//     margin-bottom: 0.5rem !important; /* Adjusted margin for better spacing */
// }
//         .wheel-pointer {
//             position: absolute;
//             top: -20px; /* Shifted slightly higher */
//             left: 50%;
//             transform: translateX(-50%);
//             width: 0;
//             height: 0;
//             border-left: 15px solid transparent;
//             border-right: 15px solid transparent;
//             border-bottom: 30px solid var(--holiday-red-light); /* Red pointer */
//             z-index: 10;
//             filter: drop-shadow(0 4px 8px rgba(0,0,0,0.5));
//         }
        
//         .wheel-spin-area {
//             transition: transform 5s cubic-bezier(0.25, 0.1, 0.25, 1);
//             box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
//             border-radius: 50%;
//             width: 100%;
//             height: 100%;
//         }

//         /* Reward Screen Styling (Confetti and Congrats Image) */
//        /* Reward Screen Styling (Confetti and Congrats Image) */
//         .reward-visual {
//             width: 100%;
//             max-width: 300px;
//             height: auto;
//         }
//         .congrats-img {
//             width: 100%;
//             height: auto;
//             object-fit: contain;
//         }
        
//         /* NEW STYLES FOR ABSOLUTELY POSITIONED CONGRATS IMAGE */
//         .congrats-img-reward {
//             position: absolute;
//             top: -165px; /* Adjust this value to position the top of the image */
//             left: 50%;
//             transform: translateX(-50%);
//             width: 280px; /* Adjust size */
//             height: auto;
//             z-index: -1; /* Make it appear behind the card content */
//             pointer-events: none;
            
//             /* Applying filter to fix black/dull export issues */
//             /* This example slightly brightens and adjusts the hue */
//             filter: brightness(1.05) saturate(1.1);
//         }

//         /* Ensure input focus border is visible on glass card */
// // ... rest of the CSS

//         /* Ensure input focus border is visible on glass card */
//         .form-control:focus {
//             z-index: 10;
//         }
//  .form-title-custom {
//             font-family: 'DM Sans', sans-serif !important;
//             font-weight: 500 !important; /* Medium weight */
//             font-size: 24px !important;
//             line-height: 1 !important; /* Approximately 100% line-height */
//             color: rgba(255, 255, 255, 1)!important;
//             /* Replacing Bootstrap's mb-4 with a fixed margin-bottom */
//             margin-bottom: 1.5rem !important;
//         }

//         .label {
//           color: rgba(255, 255, 255, 1)!important;
//   font-family: 'DM Sans', sans-serif; // Fallback to system font
//   font-weight: 500;
//   font-size: 15px;
//   line-height: 1; // Equivalent to 100%
//   letter-spacing: 0; // 0% = 0

//   vertical-align: middle;
  
//   // Optional: Ensure consistent sizing
//   display: inline-block;
//   margin-bottom: 0.5rem;


//       `}</style>
      
//       <div className="app-container">
//         {/* Top Centered Logo */}
//         <div className="logo-wrapper">
//             <img
//                 src="/liveble-logo.svg"
//                 alt="Logolpsum"
//                 className="logo-img"
//                 onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/120x40/ffffff/000000?text=LOGO' }}
//             />
//         </div>

//         <div className="main-card">
//             {renderView()}
//         </div>
//       {currentView !== "spin" && (
//   <img src="/bottom-img.svg" className="bottom-decoration" alt="" />
// )}
//       </div>
//     </>
//   );
// }







export default function Home() {

  return (
    <div >

    </div>
  );
}
