// src/lib/gsapUtils.js
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

// Register hook useGSAP biar bisa dipakai aman di Next.js App Router
gsap.registerPlugin(useGSAP);

// Animasi 1: Fade Up buat Card/Element individual
export const animateFadeUp = (targetRef, delay = 0) => {
  gsap.fromTo(
    targetRef.current,
    { y: 30, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out', delay }
  );
};

// Animasi 2: Stagger Fade In buat List/Grid (Banyak Card sekaligus)
export const animateStagger = (selectorClass) => {
  gsap.fromTo(
    selectorClass,
    { y: 40, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: 'power2.out' }
  );
};

export default gsap;