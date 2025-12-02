// ============================================
// アコーディオン
// ============================================

function accordionFunc() {
  const summaryAry = document.querySelectorAll('.js-accordion__trigger');
  if (summaryAry) {
    summaryAry.forEach((element) => {
      element.addEventListener('click', (event) => {
        // デフォルトの挙動を無効化
        event.preventDefault();

        const details = element.closest('.js-accordion');
        const content = details.querySelector('.js-accordion__contents');

        if (details.dataset.animStatus === 'running') {
          return;
        }

        if (details.open) {
          const closingAnim = content.animate(closingAnimKeyframes(content), animTiming);
          details.dataset.animStatus = 'running';
          closingAnim.onfinish = () => {
            details.removeAttribute('open');
            details.dataset.animStatus = '';
          };
        } else {
          details.setAttribute('open', 'true');
          details.dataset.animStatus = 'running';
          const openingAnim = content.animate(openingAnimKeyframes(content), animTiming);
          openingAnim.onfinish = () => {
            details.dataset.animStatus = '';
          };
        }
      });
    });
    const animTiming = {
      duration: 400,
      easing: 'ease-out',
    };
    const closingAnimKeyframes = (content) => [
      {
        height: content.offsetHeight + 'px',
        opacity: 1,
      },
      {
        height: 0,
        opacity: 0,
      },
    ];
    const openingAnimKeyframes = (content) => [
      {
        height: 0,
        opacity: 0,
      },
      {
        height: content.offsetHeight + 'px',
        opacity: 1,
      },
    ];
  }
}

export { accordionFunc };
