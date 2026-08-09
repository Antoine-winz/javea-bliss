const JaveaBlissLogo = ({ className = "w-80 h-auto" }: { className?: string }) => {
  return (
    <svg
      viewBox="0 0 400 80"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Background - transparent */}
      
      {/* Main text "JÁVEA BLISS" */}
      <text
        x="20"
        y="50"
        fontSize="28"
        fontWeight="bold"
        fill="white"
        fontFamily="Arial, sans-serif"
        letterSpacing="2px"
      >
        JÁVEA BLISS
      </text>
      
      {/* Sun */}
      <circle
        cx="340"
        cy="40"
        r="25"
        fill="#F59E0B"
      />
      
      {/* Wave */}
      <path
        d="M310 50 Q325 45 340 50 Q355 55 370 50 Q385 45 400 50 V80 H310 Z"
        fill="#0891B2"
      />
      
      {/* Palm tree 1 */}
      <g transform="translate(350, 30)">
        {/* Trunk */}
        <rect x="0" y="25" width="3" height="25" fill="#8B4513" />
        
        {/* Leaves */}
        <path d="M-8 20 Q-5 15 2 20" stroke="#059669" strokeWidth="2" fill="none" />
        <path d="M-5 18 Q0 12 5 18" stroke="#059669" strokeWidth="2" fill="none" />
        <path d="M-2 22 Q2 16 8 22" stroke="#059669" strokeWidth="2" fill="none" />
        <path d="M0 24 Q5 18 10 24" stroke="#059669" strokeWidth="2" fill="none" />
        <path d="M2 26 Q8 20 12 26" stroke="#059669" strokeWidth="2" fill="none" />
      </g>
      
      {/* Palm tree 2 */}
      <g transform="translate(370, 25)">
        {/* Trunk */}
        <rect x="0" y="20" width="2.5" height="30" fill="#8B4513" />
        
        {/* Leaves */}
        <path d="M-6 18 Q-3 13 2 18" stroke="#059669" strokeWidth="1.5" fill="none" />
        <path d="M-3 16 Q0 10 4 16" stroke="#059669" strokeWidth="1.5" fill="none" />
        <path d="M-1 20 Q2 14 6 20" stroke="#059669" strokeWidth="1.5" fill="none" />
        <path d="M1 22 Q4 16 8 22" stroke="#059669" strokeWidth="1.5" fill="none" />
      </g>
    </svg>
  );
};

export default JaveaBlissLogo;