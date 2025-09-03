const NasliLogo = () => {
  return (
    <div className="flex flex-col items-center mb-8">
      {/* Logo SVG */}
      <div className="mb-4">
        <svg
          width="120"
          height="120"
          viewBox="0 0 120 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-lg"
        >
          {/* Background circle */}
          <circle cx="60" cy="60" r="55" fill="white" fillOpacity="0.9" />
          
          {/* Main shape - blue part */}
          <path
            d="M30 35 L30 85 L45 85 L45 50 L60 50 L60 35 Z"
            fill="hsl(var(--primary))"
          />
          
          {/* Green curved element */}
          <path
            d="M60 35 Q90 35 90 65 Q90 85 70 85 L60 85 L60 70 L70 70 Q75 70 75 65 Q75 50 60 50 Z"
            fill="hsl(var(--login-green))"
          />
        </svg>
      </div>
      
      {/* Brand text */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white mb-2">
          Grupo <span className="text-login-green">Nasli</span>
        </h1>
        <p className="text-white/90 text-sm px-4 leading-relaxed">
          Excelência, portanto, não é um ato mas sim um hábito.
        </p>
      </div>
    </div>
  );
};

export default NasliLogo;