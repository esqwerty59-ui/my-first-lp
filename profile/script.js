// JS が動いていることを CSS に伝える
document.documentElement.classList.add('js');

// フッターに今の年を入れる
document.getElementById('year').textContent = new Date().getFullYear();

// スクロールして見えた要素をふわっと表示する
const revealItems = document.querySelectorAll('.reveal');

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        // 一度表示したら監視をやめる
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealItems.forEach((item) => observer.observe(item));
} else {
  // 古いブラウザではすぐに表示する
  revealItems.forEach((item) => item.classList.add('is-visible'));
}
