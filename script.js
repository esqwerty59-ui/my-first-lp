'use strict';

document.addEventListener('DOMContentLoaded', () => {
  const header = document.getElementById('header');
  const nav = document.getElementById('nav');
  const hamburger = document.getElementById('hamburger');
  const toTop = document.getElementById('to-top');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ----------------------------------------
     スムーススクロール
  ---------------------------------------- */
  const easeInOutCubic = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

  const smoothScrollTo = (targetY, duration = 900) => {
    if (prefersReducedMotion) {
      window.scrollTo(0, targetY);
      return;
    }
    const startY = window.scrollY;
    const distance = targetY - startY;
    let startTime = null;

    const step = (now) => {
      if (startTime === null) startTime = now;
      const progress = Math.min((now - startTime) / duration, 1);
      window.scrollTo(0, startY + distance * easeInOutCubic(progress));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const id = link.getAttribute('href');
      const target = id.length > 1 ? document.querySelector(id) : null;
      if (!target) return;

      e.preventDefault();
      closeMenu();

      const headerH = id === '#hero' ? 0 : header.offsetHeight;
      const targetY = target.getBoundingClientRect().top + window.scrollY - headerH;
      smoothScrollTo(Math.max(targetY, 0));
      history.replaceState(null, '', id);
    });
  });

  /* ----------------------------------------
     ハンバーガーメニュー（スマホ）
  ---------------------------------------- */
  function openMenu() {
    nav.classList.add('is-open');
    hamburger.classList.add('is-open');
    hamburger.setAttribute('aria-expanded', 'true');
    hamburger.setAttribute('aria-label', 'メニューを閉じる');
    document.body.classList.add('is-locked');
  }

  function closeMenu() {
    nav.classList.remove('is-open');
    hamburger.classList.remove('is-open');
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.setAttribute('aria-label', 'メニューを開く');
    document.body.classList.remove('is-locked');
  }

  hamburger.addEventListener('click', () => {
    nav.classList.contains('is-open') ? closeMenu() : openMenu();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });

  /* ----------------------------------------
     スクロールでヘッダー / トップへ戻るボタンを切り替え
  ---------------------------------------- */
  const onScroll = () => {
    const y = window.scrollY;
    header.classList.toggle('is-scrolled', y > 60);
    toTop.classList.toggle('is-visible', y > window.innerHeight * 0.8);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ----------------------------------------
     現在のセクションに応じてナビをハイライト
  ---------------------------------------- */
  const navLinks = document.querySelectorAll('.nav__link');
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((link) => {
          link.classList.toggle('is-current', link.getAttribute('href') === `#${entry.target.id}`);
        });
      });
    },
    { rootMargin: '-45% 0px -50% 0px' }
  );
  document.querySelectorAll('main section[id]').forEach((sec) => sectionObserver.observe(sec));

  /* ----------------------------------------
     スクロールで要素をフェードイン
  ---------------------------------------- */
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.15 }
  );
  document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

  /* ----------------------------------------
     メニューのタブ切り替え
  ---------------------------------------- */
  const tabs = document.querySelectorAll('.tab');
  const panels = document.querySelectorAll('.menu__panel');

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const key = tab.dataset.tab;

      tabs.forEach((t) => {
        const active = t === tab;
        t.classList.toggle('is-active', active);
        t.setAttribute('aria-selected', String(active));
      });

      panels.forEach((panel) => {
        const active = panel.id === key;
        panel.hidden = !active;
        panel.classList.remove('is-active');
        if (active) {
          // アニメーションを再生し直すためにリフローを挟む
          void panel.offsetWidth;
          panel.classList.add('is-active');
          panel.querySelectorAll('.reveal').forEach((el) => {
            el.classList.remove('reveal');
            el.classList.add('is-visible');
          });
        }
      });
    });
  });

  /* ----------------------------------------
     営業状況の表示
  ---------------------------------------- */
  const status = document.getElementById('status');
  const statusText = document.getElementById('status-text');

  const updateStatus = () => {
    const now = new Date();
    const day = now.getDay(); // 0:日 〜 6:土
    const minutes = now.getHours() * 60 + now.getMinutes();
    const isWeekend = day === 0 || day === 6;
    const [open, close] = isWeekend ? [9 * 60, 19 * 60] : [8 * 60, 20 * 60];

    let isOpen = false;
    let message;

    if (day === 2) {
      message = '本日は定休日です';
    } else if (minutes >= open && minutes < close) {
      isOpen = true;
      message = `ただいま営業中（${close / 60}:00 まで）`;
    } else {
      message = `営業時間外です（${open / 60}:00 オープン）`;
    }

    status.classList.toggle('is-open', isOpen);
    status.classList.toggle('is-closed', !isOpen);
    statusText.textContent = message;
  };
  updateStatus();
  setInterval(updateStatus, 60 * 1000);

  /* ----------------------------------------
     お問い合わせフォームのバリデーション
  ---------------------------------------- */
  const contactForm = document.getElementById('contact-form');
  const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validators = {
    name: (value) => (value ? '' : 'お名前を入力してください'),
    email: (value) => {
      if (!value) return 'メールアドレスを入力してください';
      if (!EMAIL_PATTERN.test(value)) return 'メールアドレスの形式が正しくありません';
      return '';
    },
    message: (value) => (value ? '' : 'お問い合わせ内容を入力してください'),
  };

  const validateField = (field) => {
    const message = validators[field.name](field.value.trim());
    const error = document.getElementById(field.getAttribute('aria-describedby'));
    field.classList.toggle('is-invalid', Boolean(message));
    field.setAttribute('aria-invalid', String(Boolean(message)));
    error.textContent = message;
    return !message;
  };

  const fields = Object.keys(validators).map((name) => contactForm.elements[name]);

  fields.forEach((field) => {
    field.addEventListener('blur', () => validateField(field));
    // 一度エラーになった欄は、入力しながらエラーを更新する
    field.addEventListener('input', () => {
      if (field.classList.contains('is-invalid')) validateField(field);
    });
  });

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const results = fields.map(validateField);
    const firstInvalid = fields[results.indexOf(false)];
    if (firstInvalid) {
      firstInvalid.focus();
      return;
    }

    alert('送信しました');
    contactForm.reset();
  });

  /* ----------------------------------------
     フッターの年
  ---------------------------------------- */
  document.getElementById('year').textContent = new Date().getFullYear();
});
