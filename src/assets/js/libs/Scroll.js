// ============================================
// gsap scrollTrigger
// ============================================
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);
import Lenis from "lenis";

// ============================================
// Lenis
// ============================================
export const lenis = new Lenis({
    lerp: 0.2,
    duration: 1.4,
    smoothTouch: true,
});

//初期設定
lenis.on("scroll", ScrollTrigger.update);
gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);

// ============================================
// ページ内リンク
// ============================================
function lenisPageScroll() {
    const links = document.querySelectorAll('a[href^="#"]:not(.-no-smooth, .l-header__skip-content)');
    if (links.length === 0) return;

    const headerHeight = getComputedStyle(document.documentElement).getPropertyValue("--size-header-h");
    const headerHeightNum = headerHeight.split("px")[0];

    links.forEach((target) => {
        target.addEventListener("click", (e) => {
            e.preventDefault();
            let targetLink = target.getAttribute("href");
            if (targetLink === "#") {
                targetLink = "body";
            }

            lenis.scrollTo(targetLink, {
                offset: Number(headerHeightNum) * -1,
                lerp: 0.2,
                duration: 1.2,
            });
        });
    });
}

// ============================================
// スクロールアニメーション
// ============================================
function inViewAnm() {
    ScrollTrigger.batch(".js-inview", {
        start: "top 75%",
        end: "bottom 75%",
        once: true,
        onEnter: (batch) => {
            batch.forEach((el) => el.classList.add("is-active"));
        },
    });
}

export { lenisPageScroll, inViewAnm };
