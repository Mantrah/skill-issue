interface GamepadDecorationsProps {
  className?: string
}

function DPad({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 42 42"
      fill="none"
      className={`${className} cursor-pointer transition-all duration-100 hover:brightness-110 active:brightness-90`}
    >
      <defs>
        <linearGradient id="dpadGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#dc2626" />
          <stop offset="50%" stopColor="#b91c1c" />
          <stop offset="100%" stopColor="#7f1d1d" />
        </linearGradient>
      </defs>
      {/* Single cross path */}
      <path
        d="M15 0 h12 v15 h15 v12 h-15 v15 h-12 v-15 h-15 v-12 h15 z"
        fill="url(#dpadGradient)"
      />
    </svg>
  )
}

function ControllerButton({ className }: { className?: string }) {
  return (
    <div
      className={`${className} cursor-pointer rounded-full bg-gradient-to-b from-gray-300 via-gray-200 to-gray-400 border border-gray-500/30 transition-all duration-100 hover:brightness-110 active:brightness-90`}
    />
  )
}

function ControllerButtons({ className }: { className?: string }) {
  return (
    <div className={`${className} flex items-center justify-center`}>
      <div className="relative w-16 h-16 md:w-20 md:h-20">
        {/* Top-right button */}
        <ControllerButton className="absolute top-0 right-0 w-8 h-8 md:w-10 md:h-10" />
        {/* Bottom-left button */}
        <ControllerButton className="absolute bottom-0 left-0 w-8 h-8 md:w-10 md:h-10" />
      </div>
    </div>
  )
}

export default function GamepadDecorations({ className }: GamepadDecorationsProps) {
  return (
    <div className={`absolute inset-0 bg-gradient-to-b from-[#282828] via-[#1e1e1e] to-[#141414] rounded-3xl ${className || ''}`}>
      {/* Red border frame */}
      <div className="absolute inset-0 border-[3px] border-accent/30 rounded-3xl pointer-events-none" />

      {/* Left decoration - D-Pad */}
      <div className="absolute left-0 top-0 bottom-0 w-[20%] flex items-center justify-center z-20">
        <DPad className="w-16 h-16 md:w-24 md:h-24" />
      </div>

      {/* Right decoration - Controller buttons */}
      <div className="absolute right-0 top-0 bottom-0 w-[20%] flex items-center justify-center z-20">
        <ControllerButtons className="w-16 h-16 md:w-24 md:h-24" />
      </div>
    </div>
  )
}
