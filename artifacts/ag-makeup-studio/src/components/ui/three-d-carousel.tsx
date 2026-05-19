import { memo, useEffect, useLayoutEffect, useMemo, useState } from "react"
import {
  AnimatePresence,
  motion,
  useAnimation,
  useMotionValue,
  useTransform,
} from "framer-motion"

export const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect

type UseMediaQueryOptions = {
  defaultValue?: boolean
  initializeWithValue?: boolean
}

const IS_SERVER = typeof window === "undefined"

export function useMediaQuery(
  query: string,
  {
    defaultValue = false,
    initializeWithValue = true,
  }: UseMediaQueryOptions = {}
): boolean {
  const getMatches = (query: string): boolean => {
    if (IS_SERVER) {
      return defaultValue
    }
    return window.matchMedia(query).matches
  }

  const [matches, setMatches] = useState<boolean>(() => {
    if (initializeWithValue) {
      return getMatches(query)
    }
    return defaultValue
  })

  const handleChange = () => {
    setMatches(getMatches(query))
  }

  useIsomorphicLayoutEffect(() => {
    const matchMedia = window.matchMedia(query)
    handleChange()

    matchMedia.addEventListener("change", handleChange)

    return () => {
      matchMedia.removeEventListener("change", handleChange)
    }
  }, [query])

  return matches
}

const keywords = [
  "night",
  "city",
  "sky",
  "sunset",
  "sunrise",
  "winter",
  "skyscraper",
  "building",
  "cityscape",
  "architecture",
  "street",
  "lights",
  "downtown",
  "bridge",
]

const duration = 0.15
const transition = {
  duration,
  ease: [0.32, 0.72, 0, 1] as const,
  filter: "blur(4px)",
}
const transitionOverlay = { duration: 0.5, ease: [0.32, 0.72, 0, 1] as const }

const Face = memo(({
  imgUrl,
  i,
  faceCount,
  radius,
  faceWidth,
  rotation,
  handleClick,
}: {
  imgUrl: string
  i: number
  faceCount: number
  radius: number
  faceWidth: number
  rotation: any
  handleClick: (imgUrl: string, index: number) => void
}) => {
  const angle = i * (360 / faceCount)
  
  // Combine transforms into a single useTransform for performance
  const transform = useTransform(rotation, (r: number) => {
    const relativeAngle = (r + angle) % 360
    const normalizedAngle =
      relativeAngle > 180
        ? relativeAngle - 360
        : relativeAngle < -180
        ? relativeAngle + 360
        : relativeAngle

    const distance = Math.abs(normalizedAngle)
    
    // Optimized scale and translation
    const scale = distance < 45 ? 1 + (45 - distance) / 300 : 1
    return `rotateY(${angle}deg) translateZ(${radius}px) scale(${scale})`
  })

  // Separate opacity to avoid unnecessary re-renders of the whole transform if only opacity changes
  const opacity = useTransform(rotation, (r: number) => {
    const relativeAngle = (r + angle) % 360
    const normalizedAngle =
      relativeAngle > 180
        ? relativeAngle - 360
        : relativeAngle < -180
        ? relativeAngle + 360
        : relativeAngle
    const distance = Math.abs(normalizedAngle)
    return distance < 90 ? 1 : Math.max(0.05, 1 - (distance - 90) / 100)
  })

  return (
    <motion.div
      className="absolute flex h-full origin-center items-center justify-center rounded-xl p-2"
      style={{
        width: `${faceWidth}px`,
        transform,
        opacity,
        transformStyle: "preserve-3d",
        willChange: "transform, opacity", // Hint to GPU
      }}
      onClick={() => handleClick(imgUrl, i)}
    >
      <motion.img
        src={imgUrl}
        alt={`bridal_artistry_${i}`}
        className="pointer-events-none w-full rounded-xl object-cover aspect-[3/4] shadow-[0_15px_35px_rgba(0,0,0,0.4)] transition-all duration-300"
        style={{
          border: "1px solid rgba(255,255,255,0.05)",
          willChange: "transform", // Performance hint
        }}
        loading="lazy" // Don't load all at once
      />
    </motion.div>
  )
})

const Carousel = memo(
  ({
    handleClick,
    controls,
    cards,
    isCarouselActive,
  }: {
    handleClick: (imgUrl: string, index: number) => void
    controls: any
    cards: string[]
    isCarouselActive: boolean
  }) => {
    const isScreenSizeSm = useMediaQuery("(max-width: 640px)")
    const cylinderWidth = isScreenSizeSm ? 1200 : 2200
    const faceCount = cards.length
    const faceWidth = cylinderWidth / faceCount
    const radius = cylinderWidth / (2 * Math.PI)
    const rotation = useMotionValue(0)
    const transform = useTransform(
      rotation,
      (value) => `rotate3d(0, 1, 0, ${value}deg)`
    )

    return (
      <div
        className="flex h-full items-center justify-center"
        style={{
          perspective: "1200px",
          transformStyle: "preserve-3d",
          willChange: "transform",
        }}
      >
        <motion.div
          drag={isCarouselActive ? "x" : false}
          className="relative flex h-full origin-center cursor-grab justify-center active:cursor-grabbing"
          style={{
            transform,
            rotateY: rotation,
            width: cylinderWidth,
            transformStyle: "preserve-3d",
            willChange: "transform",
          }}
          onDrag={(_, info) => {
            if (!isCarouselActive) return
            // Smoother drag response
            rotation.set(rotation.get() + info.offset.x * 0.012)
          }}
          onDragEnd={(_, info) => {
            if (!isCarouselActive) return
            
            // Refined physics for premium "heavy" but smooth feel
            controls.start({
              rotateY: rotation.get() + info.velocity.x * 0.05,
              transition: {
                type: "spring",
                stiffness: 60,
                damping: 30,
                mass: 1.5,
                restDelta: 0.01,
              },
            })
          }}
          animate={controls}
        >
          {cards.map((imgUrl, i) => (
            <Face
              key={`key-${imgUrl}-${i}`}
              imgUrl={imgUrl}
              i={i}
              faceCount={faceCount}
              radius={radius}
              faceWidth={faceWidth}
              rotation={rotation}
              handleClick={handleClick}
            />
          ))}
        </motion.div>
      </div>
    )
  }
)

const hiddenMask = `repeating-linear-gradient(to right, rgba(0,0,0,0) 0px, rgba(0,0,0,0) 30px, rgba(0,0,0,1) 30px, rgba(0,0,0,1) 30px)`
const visibleMask = `repeating-linear-gradient(to right, rgba(0,0,0,0) 0px, rgba(0,0,0,0) 0px, rgba(0,0,0,1) 0px, rgba(0,0,0,1) 30px)`
function ThreeDPhotoCarousel({ images }: { images?: string[] }) {
  const [activeImg, setActiveImg] = useState<string | null>(null)
  const [isCarouselActive, setIsCarouselActive] = useState(true)
  const controls = useAnimation()
  const cards = useMemo(
    () => images || keywords.map((keyword) => `https://picsum.photos/200/300?${keyword}`),
    [images]
  )

  useEffect(() => {
    console.log("Cards loaded:", cards)
  }, [cards])

  const handleClick = (imgUrl: string) => {
    setActiveImg(imgUrl)
    setIsCarouselActive(false)
    controls.stop()
  }

  const handleClose = () => {
    setActiveImg(null)
    setIsCarouselActive(true)
  }

  return (
    <motion.div layout className="relative">
      <AnimatePresence mode="sync">
        {activeImg && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            layoutId={`img-container-${activeImg}`}
            layout="position"
            onClick={handleClose}
            className="fixed inset-0 bg-black/90 backdrop-blur-xl flex items-center justify-center z-[100] p-6 md:p-20"
            style={{ willChange: "opacity" }}
            transition={transitionOverlay}
          >
            <motion.img
              layoutId={`img-${activeImg}`}
              src={activeImg}
              className="max-w-full max-h-full rounded-lg shadow-[0_0_100px_rgba(183,146,114,0.2)]"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                duration: 0.8,
                ease: [0.16, 1, 0.3, 1],
              }}
              style={{
                willChange: "transform",
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
      <div className="relative h-[500px] w-full overflow-hidden">
        <Carousel
          handleClick={handleClick}
          controls={controls}
          cards={cards}
          isCarouselActive={isCarouselActive}
        />
      </div>
    </motion.div>
  )
}

export default ThreeDPhotoCarousel
