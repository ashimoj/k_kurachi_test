import Splide from "@splidejs/splide";
import "@splidejs/splide/css";
// ============================================
// top MV news
// ============================================

function slider() {
    const slide = document.querySelector(".splide");
    if (slide) {
        const option = {
            type: "loop",
            speed: 1000,
            autoplay: true,
            arrows: false,
            perMove: 1,
            perPage: 1,
            gap: 48,
            pauseOnHover: false,
            breakpoints: {
                768: {
                    gap: 16,
                },
            },
        };

        const splide = new Splide(slide, option);
        splide.mount();
    }
}

export { slider };
