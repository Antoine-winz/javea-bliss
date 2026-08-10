import { useEffect } from "react";

/*
  Drives the [data-reveal] / [data-reveal-stagger] CSS in index.css.

  Elements are hidden only once `js-reveal` is set on <html>, and that happens only
  when this hook runs and the visitor allows motion — so with JS off, with reduced
  motion on, or if anything here throws, every element simply renders visible.

  A MutationObserver picks up nodes that mount later (reviews arrive from the API),
  and each element animates once, then is unobserved.
*/
const SELECTOR = "[data-reveal], [data-reveal-stagger]";

const MotionProvider = () => {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const root = document.documentElement;
    root.classList.add("js-reveal");

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
    );

    const observe = (scope: ParentNode) => {
      scope.querySelectorAll(SELECTOR).forEach((el) => {
        if (!el.classList.contains("is-visible")) io.observe(el);
      });
    };
    observe(document);

    const mo = new MutationObserver((mutations) => {
      for (const m of mutations) {
        m.addedNodes.forEach((node) => {
          if (!(node instanceof Element)) return;
          if (node.matches(SELECTOR)) io.observe(node);
          observe(node);
        });
      }
    });
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      mo.disconnect();
      root.classList.remove("js-reveal");
    };
  }, []);

  return null;
};

export default MotionProvider;
