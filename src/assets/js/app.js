// ============================================
// モジュール読み込み
// ============================================
import { viewport } from "./libs/switchViewport";
import { inViewAnm, lenisPageScroll } from "./libs/Scroll";
import { drawer, fixedHeader } from "./libs/Header";
// import { addAutoFunc, numKeyFunc } from './libs/Form';
// import { accordionFunc } from './libs/Accordion';
// import { articleTable, ScrollHintFunc } from './libs/ScrollHint';
// import { slider } from './libs/Slider';
// import { tabFunc } from './libs/Tab';

// 実行
// ==========================
window.addEventListener("DOMContentLoaded", () => {
    viewport();
    fixedHeader();
    drawer();
    lenisPageScroll();
    // addAutoFunc();
    // numKeyFunc();
    // accordionFunc();
    // articleTable();
    // ScrollHintFunc();
    // tabFunc();
});

window.addEventListener("load", () => {
    document.body.classList.add("is-loaded");
    inViewAnm();
    // slider();
});
