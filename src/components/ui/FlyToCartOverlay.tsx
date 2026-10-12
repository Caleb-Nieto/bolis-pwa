import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Particle {
    id: number;
    startX: number;
    startY: number;
    targetX: number;
    targetY: number;
}

export default function FlyToCartOverlay() {
    const [particles, setParticles] = useState<Particle[]>([]);

    useEffect(() => {
        const handleFly = (e: Event) => {
            const customEvent = e as CustomEvent<{ startX: number; startY: number }>;
            const { startX, startY } = customEvent.detail || {
                startX: window.innerWidth / 2,
                startY: window.innerHeight / 2,
            };

            const cartBtn = document.getElementById('navbar-cart-tab');
            const cartRect = cartBtn?.getBoundingClientRect();

            // Ubicación exacta del icono del carrito en el navbar inferior
            const targetX = cartRect
                ? cartRect.left + cartRect.width / 2
                : window.innerWidth / 2 + 42;
            const targetY = cartRect
                ? cartRect.top + cartRect.height / 2
                : window.innerHeight - 44;

            const newParticle: Particle = {
                id: Date.now() + Math.random(),
                startX,
                startY,
                targetX,
                targetY,
            };

            setParticles(prev => [...prev, newParticle]);
        };

        window.addEventListener('fly-to-cart', handleFly);
        return () => window.removeEventListener('fly-to-cart', handleFly);
    }, []);

    const handleComplete = (id: number) => {
        // Dispara la reacción visual de impacto en el navbar
        window.dispatchEvent(new CustomEvent('cart-impact'));
        setParticles(prev => prev.filter(p => p.id !== id));
    };

    return (
        <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
            <AnimatePresence>
                {particles.map(p => {
                    const deltaX = p.targetX - p.startX;
                    const midX = p.startX + deltaX * 0.4;
                    // Arco parabólico: se eleva ligeramente (-30px) antes de caer por gravedad hacia el navbar
                    const midY = Math.min(p.startY, p.targetY) - 30;

                    return (
                        <motion.div
                            key={p.id}
                            initial={{
                                x: p.startX - 14,
                                y: p.startY - 14,
                                scale: 0.6,
                                opacity: 1,
                            }}
                            animate={{
                                x: [p.startX - 14, midX - 14, p.targetX - 14],
                                y: [p.startY - 14, midY - 14, p.targetY - 14],
                                scale: [0.6, 1.15, 0.4],
                                opacity: [1, 1, 0.85, 0],
                            }}
                            transition={{
                                duration: 0.55,
                                times: [0, 0.35, 1],
                                ease: [0.25, 0.1, 0.25, 1],
                            }}
                            onAnimationComplete={() => handleComplete(p.id)}
                            className="absolute top-0 left-0 w-7 h-7 rounded-full bg-cyan-800 text-white flex items-center justify-center shadow-lg shadow-cyan-950/40 border border-white/40 pointer-events-none select-none"
                        >
                            <span className="text-[11px] font-bold leading-none">+1</span>
                        </motion.div>
                    );
                })}
            </AnimatePresence>
        </div>
    );
}
