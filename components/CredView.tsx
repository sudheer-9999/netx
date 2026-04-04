import React, { useEffect, useRef, useState } from "react";

const lines: string[] = [
  "not everyone hears it.",
  "the ones who do, feel it differently.",
  "this isn't a concert. this is a jam.",
  "raw sounds. real people. no rules.",
  "welcome to the session."
];

const CredText: React.FC = () => {
  const refs = useRef<(HTMLParagraphElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState<number>(-1);

  useEffect(() => {
    const observers = refs.current.map((el, index) => {
      if (!el) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveIndex(index);
          }
        },
        {
          root: null,
          rootMargin: "-40% 0px -40% 0px", // trigger at middle
          threshold: 0,
        }
      );

      observer.observe(el);
      return observer;
    });

    return () => {
      observers.forEach((observer) => observer?.disconnect());
    };
  }, []);

  return (
    <section className="bg-black text-white  flex items-center">
      <div className="max-w-4xl mx-auto px-6 pt-20">
        {lines.map((text, i) => (
          <p
            key={i}
            ref={(el) => {
              refs.current[i] = el;
            }}
            className={`
              text-4xl md:text-5xl lg:text-6xl leading-tight transition-all duration-700
              ${activeIndex === i
                ? "opacity-100 text-white"
                : "opacity-20 text-gray-500"}
            `}
          >
            {text}
          </p>
        ))}
      </div>
    </section>
  );
};

export default CredText;