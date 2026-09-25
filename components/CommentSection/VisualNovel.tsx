import React, { useState, useEffect, useRef } from 'react';
import "tailwindcss/tailwind.css";

interface ScriptLine {
  id: string;
  speaker: string;
  text: string;
  nextLabel?: string;
  option?: Record<string, { option: string; function?: () => string }>;
  style?: Record<string, string | number>;
  sound?: string;
}

interface Actor {
  name: string;
  image: string;
}

interface VisualNovelProps {
  script: ScriptLine[];
  actors: Actor[];
  onLineChange?: (currentId: string) => void;
}

const VisualNovel: React.FC<VisualNovelProps> = ({ script, actors, onLineChange }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [displayedText, setDisplayedText] = useState("");
  const [revealedOptions, setRevealedOptions] = useState<number>(0);
  const [isSceneTransitioning, setIsSceneTransitioning] = useState(false);
  // const audioRef = useRef<HTMLAudioElement | null>(null);
  const lineSoundRef = useRef<HTMLAudioElement | null>(null);
  const currentLine = script[currentIndex];

  const currentActor = actors.find((actor) => actor.name === currentLine.speaker);

  useEffect(() => {
    let typingTimeout: NodeJS.Timeout;

    if (currentLine && currentLine.text) {
      setDisplayedText("");
      setIsTyping(true);
      let charIndex = 0;

      if (currentLine.sound) {
        if (lineSoundRef.current) {
          lineSoundRef.current.pause();
          lineSoundRef.current.currentTime = 0;
        }
        lineSoundRef.current = new Audio(currentLine.sound);
        lineSoundRef.current.volume = 0.1;
        lineSoundRef.current.play().catch((error) => {
          console.error("Error playing line sound:", error);
        });
      }

      const typeNextChar = () => {
        if (charIndex < currentLine.text.length) {
          setDisplayedText((prev) => {
            return currentLine.text.slice(0, charIndex + 1);
          });
          charIndex++;
          typingTimeout = setTimeout(typeNextChar, 50);
        } else {
          setIsTyping(false);
        }
      };

      typeNextChar();
    }

    return () => {
      clearTimeout(typingTimeout);
    };
  }, [currentLine]);

  useEffect(() => {
    if (!isTyping && currentLine.option) {
      const transitionTimeout = setTimeout(() => {
        setIsSceneTransitioning(true); 
      }, 1500);

      const revealInterval = setInterval(() => {
        setRevealedOptions((prev) => {
          if (prev < Object.keys(currentLine.option!).length) {
            return prev + 1;
          } else {
            clearInterval(revealInterval);
            return prev;
          }
        });
      }, 1500);

      return () => {
        clearTimeout(transitionTimeout);
        clearInterval(revealInterval);
      };
    }
  }, [isTyping, currentLine]);

  useEffect(() => {
    if (currentLine && onLineChange) {
      onLineChange(currentLine.id);
    }
  }, [currentLine, onLineChange]);

  const handleNextLine = () => {
    if (currentLine.nextLabel === "END_SCENE") return;

    if (currentLine.option) return;
    if (isTyping) {
      setIsTyping(false);
      setDisplayedText("");
      if (currentIndex < script.length - 1) {
        const nextLabel = currentLine.nextLabel;
        if (nextLabel) {
          if (nextLabel === "END_SCENE") {
            return;
          }
          const nextIndex = script.findIndex((line) => line.id === nextLabel);
          if (nextIndex !== -1) {
            setCurrentIndex(nextIndex);
            return;
          }
        }
        setCurrentIndex((prevIndex) => prevIndex + 1);
      }
    } else if (currentIndex < script.length - 1) {
      const nextLabel = currentLine.nextLabel;
      if (nextLabel) {
        if (nextLabel === "END_SCENE") {
          return;
        }
        const nextIndex = script.findIndex((line) => line.id === nextLabel);
        if (nextIndex !== -1) {
          setCurrentIndex(nextIndex);
          return;
        }
      }
      setCurrentIndex((prevIndex) => prevIndex + 1);
    }
  };

  const handleOptionClick = (optionObj: { function?: () => string; nextLabel?: string }) => {
    let nextLabel: string | undefined = optionObj.nextLabel;
    if (!nextLabel && optionObj.function) {
      nextLabel = optionObj.function();
    }
    if (nextLabel) {
      const nextIndex = script.findIndex((line) => line.id === nextLabel);
      if (nextIndex !== -1) {
        setCurrentIndex(nextIndex);
        setRevealedOptions(0);
        setIsSceneTransitioning(false);
        return;
      }
    }
    if (currentIndex < script.length - 1) {
      setCurrentIndex((prevIndex) => prevIndex + 1);
      setRevealedOptions(0);
      setIsSceneTransitioning(false);
    }
  };

  const renderOptions = () => {
    if (!currentLine.option) return null;

    const optionsArray = Object.entries(currentLine.option);

    return (
      <div
        className={`absolute top-0 left-0 w-full h-[85%] flex items-center justify-center transition-opacity duration-1000`}
        style={{
          opacity: isSceneTransitioning ? 1 : 0,
          backgroundColor: isSceneTransitioning ? 'rgba(0, 0, 0, 0.5)' : 'transparent',
        }}
      >
        <div className="flex flex-row items-center space-x-4">
          {optionsArray.map(([key, value], idx) => (
            <button
              key={key}
              className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600 disabled:opacity-50 transition-opacity duration-1000 select-none"
              onClick={() => handleOptionClick(value)}
              disabled={isTyping}
              style={{
                opacity: idx < revealedOptions ? 1 : 0,
                pointerEvents: idx < revealedOptions ? 'auto' : 'none',
                transition: 'opacity 1s ease-in-out',
              }}
            >
              {value.option}
            </button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div
      className="visual-novel-container bg-black text-white p-6 rounded-lg shadow-lg max-w-3xl mx-auto aspect-video border-4 border-gray-700 relative overflow-hidden"
    >
      <div
        className="absolute top-0 left-0 w-full h-[85%] cursor-pointer"
        onClick={handleNextLine}
      >
        {currentActor && (
          <img
            src={currentActor.image}
            alt={currentActor.name}
            style={currentLine.style}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 max-w-[50%] max-h-[50%] object-contain pointer-events-none select-none"
          />
        )}
      </div>
      <div className="absolute bottom-0 left-0 w-full">
        <div className="w-full bg-black text-white p-4 rounded-t-lg border-t-4 border-gray-700">
          <p className="text-lg font-bold font-ari-w9500">
            {currentLine.speaker}: <span className="font-normal">{displayedText}</span>
          </p>
        </div>
      </div>
      {renderOptions()}
    </div>
  );
};

export default VisualNovel;