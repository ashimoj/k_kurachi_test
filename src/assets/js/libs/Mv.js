import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);
// ============================================
// MV
// ============================================
function mvAnim(){
  const mv = document.querySelector('.js-mv');
  if (!mv) return;

  const imgs = document.querySelectorAll('.js-mv__img');

  window.addEventListener("load", () => {
    setTimeout(() => {
      imgs.forEach((img) => {
        // console.log(img)
        img.classList.add("show");
      });
    }, 800);
  });
}

// ============================================
// フッター上の画像たち
// ============================================
function mvEndAnim(){
  const endMv = document.querySelector('.js-mv-end');
  if (!endMv) return;

  if(endMv){
    const endImgs = document.querySelectorAll('.js-mv-end__img');
    gsap.utils.toArray(endImgs).forEach((img) => {
      gsap.timeline({
        scrollTrigger: {
          trigger: endImgs,
          start: "center center",
          end: "bottom center",
          scrub: true,
          // markers: true,
          onEnter: () => {
            endImgs.forEach(img => img.classList.add("is-active"));
          },
          onLeaveBack: () => {
            endImgs.forEach(img => img.classList.remove("is-active"));
          }
        }
      })
      .to(".js-mv-end__img", {
        opacity: 0,
        duration: 3,
        delay: 3,
        ease: "back.in(1.7)",
      });
    });
  }
}

export { mvAnim, mvEndAnim };
