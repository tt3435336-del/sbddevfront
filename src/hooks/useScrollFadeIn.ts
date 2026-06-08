import { useEffect, useRef } from "react";

export const useScrollFadeIn = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("scroll-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    const el = ref.current;
    if (el) {
      const sections = el.querySelectorAll(".scroll-fade-in");
      sections.forEach((s) => observer.observe(s));
    }

    return () => observer.disconnect();
  }, []);

  return ref;
};
