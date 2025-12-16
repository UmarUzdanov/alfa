/* ============================================
   GIULIA / Alfa Romeo - Creative Scroll Gallery
   5 Different Animation Styles
   ============================================ */

// Session data
const sessions = [
    {
        name: "mountain-light",
        title: "Mountain Light",
        images: [
            "IMG_6153", "IMG_6154", "IMG_6155", "IMG_6156", "IMG_6157", "IMG_6158", "IMG_6159",
            "IMG_6160", "IMG_6161", "IMG_6162", "IMG_6163", "IMG_6176", "IMG_6177", "IMG_6178",
            "IMG_6179", "IMG_6180", "IMG_6183", "IMG_6185", "IMG_6186", "IMG_6187", "IMG_6188",
            "IMG_6189", "IMG_6190", "IMG_6191", "IMG_6192", "IMG_6193", "IMG_6194", "IMG_6195",
            "IMG_6196", "IMG_6197", "IMG_6198", "IMG_6199", "IMG_6200", "IMG_6201", "IMG_6202",
            "IMG_6203", "IMG_6204", "IMG_6205", "IMG_6206", "IMG_6207", "IMG_6208", "IMG_6209",
            "IMG_6210", "IMG_6211"
        ]
    },
    {
        name: "first-glances",
        title: "First Glances",
        images: [
            "IMG_8744", "IMG_8745", "IMG_8746", "IMG_8747", "IMG_8748", "IMG_8749", "IMG_8750",
            "IMG_8751", "IMG_8752", "IMG_8753", "IMG_8754", "IMG_8755", "IMG_8756", "IMG_8757",
            "IMG_8758", "IMG_8759", "IMG_8760", "IMG_8761", "IMG_8762", "IMG_8763"
        ]
    },
    {
        name: "golden-hour",
        title: "Golden Hour",
        images: [
            "IMG_8804", "IMG_8805", "IMG_8806", "IMG_8807", "IMG_8808", "IMG_8809", "IMG_8810",
            "IMG_8811", "IMG_8812", "IMG_8813", "IMG_8814", "IMG_8815", "IMG_8816", "IMG_8817",
            "IMG_8818", "IMG_8819", "IMG_8820", "IMG_8844", "IMG_8845", "IMG_8846", "IMG_8847",
            "IMG_8848", "IMG_8849", "IMG_8850"
        ]
    },
    {
        name: "open-roads",
        title: "Open Roads",
        images: [
            "IMG_9269", "IMG_9270", "IMG_9271", "IMG_9272", "IMG_9273", "IMG_9274", "IMG_9275",
            "IMG_9277", "IMG_9278", "IMG_9282", "IMG_9283", "IMG_9284", "IMG_9285", "IMG_9323",
            "IMG_9343", "IMG_9344", "IMG_9345", "IMG_9346", "IMG_9347", "IMG_9348"
        ]
    },
    {
        name: "the-journey",
        title: "The Journey",
        images: [
            "IMG_9700", "IMG_9701", "IMG_9702", "IMG_9703", "IMG_9704", "IMG_9705", "IMG_9709",
            "IMG_9710", "IMG_9721", "IMG_9722", "IMG_9974", "IMG_9975", "IMG_9976", "IMG_9977",
            "IMG_9978", "IMG_9984", "IMG_9985", "IMG_9986", "IMG_9989", "IMG_9990"
        ]
    }
];

// ============================================
// Create Image Element Helper
// ============================================
function createImageElement(imageName, title) {
    const photoContainer = document.createElement('div');
    photoContainer.className = 'photo-container loading';

    const img = document.createElement('img');
    img.src = `public/${imageName}.jpeg`;
    img.alt = `Alfa Romeo Giulia - ${title}`;
    img.loading = 'lazy';

    img.onload = () => photoContainer.classList.remove('loading');
    img.onerror = () => {
        img.classList.add('error');
        photoContainer.classList.remove('loading');
    };

    photoContainer.appendChild(img);
    return photoContainer;
}

// ============================================
// Style 1: Stacking Cards
// ============================================
function initStackStyle(section, session) {
    const container = section.querySelector('.gallery-container');
    const limitedImages = session.images.slice(0, 10); // Limit for performance

    limitedImages.forEach((imageName, i) => {
        const photo = createImageElement(imageName, session.title);
        photo.style.zIndex = limitedImages.length - i;
        container.appendChild(photo);
    });

    const photos = container.querySelectorAll('.photo-container');
    const totalPhotos = photos.length;

    ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: `+=${totalPhotos * 100}vh`,
        pin: true,
        scrub: 1,
        onUpdate: (self) => {
            const progress = self.progress;
            const currentIndex = Math.floor(progress * totalPhotos);

            photos.forEach((photo, i) => {
                const photoProgress = (progress * totalPhotos) - i;

                if (photoProgress < 0) {
                    // Not yet visible
                    gsap.set(photo, {
                        y: 100,
                        scale: 0.8,
                        rotateX: 15,
                        opacity: 0
                    });
                } else if (photoProgress < 1) {
                    // Animating in
                    gsap.set(photo, {
                        y: 100 * (1 - photoProgress),
                        scale: 0.8 + (0.2 * photoProgress),
                        rotateX: 15 * (1 - photoProgress),
                        opacity: photoProgress
                    });
                } else {
                    // Stacked
                    const stackOffset = Math.min(photoProgress - 1, 0.5);
                    gsap.set(photo, {
                        y: -stackOffset * 20,
                        scale: 1 - (stackOffset * 0.05),
                        rotateX: 0,
                        opacity: 1 - (stackOffset * 0.3)
                    });
                }
            });
        }
    });
}

// ============================================
// Style 2: Masonry Grid with Reveals
// ============================================
function initMasonryStyle(section, session) {
    const container = section.querySelector('.gallery-container');

    session.images.forEach((imageName, i) => {
        const photo = createImageElement(imageName, session.title);
        photo.style.transitionDelay = `${(i % 6) * 0.1}s`;
        container.appendChild(photo);
    });

    const photos = container.querySelectorAll('.photo-container');

    photos.forEach((photo, i) => {
        ScrollTrigger.create({
            trigger: photo,
            start: "top 85%",
            onEnter: () => photo.classList.add('visible'),
            once: true
        });
    });
}

// ============================================
// Style 3: Cinematic Wipe Reveal
// ============================================
function initWipeStyle(section, session) {
    const container = section.querySelector('.gallery-container');
    const counter = container.querySelector('.photo-counter');
    const currentSpan = counter?.querySelector('.current');
    const totalSpan = counter?.querySelector('.total');

    session.images.forEach((imageName, i) => {
        const photo = createImageElement(imageName, session.title);
        photo.style.zIndex = session.images.length - i;
        container.appendChild(photo);
    });

    const photos = container.querySelectorAll('.photo-container');
    const totalPhotos = photos.length;

    if (totalSpan) totalSpan.textContent = totalPhotos;

    ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: `+=${totalPhotos * 80}vh`,
        pin: true,
        scrub: 0.5,
        onUpdate: (self) => {
            const progress = self.progress;
            const currentIndex = Math.min(Math.floor(progress * totalPhotos), totalPhotos - 1);

            if (currentSpan) currentSpan.textContent = currentIndex + 1;

            photos.forEach((photo, i) => {
                const photoProgress = (progress * totalPhotos) - i;
                const clipValue = Math.max(0, Math.min(100, 100 - (photoProgress * 100)));
                photo.style.clipPath = `inset(0 ${clipValue}% 0 0)`;
            });
        }
    });
}

// ============================================
// Style 4: Scattered Editorial
// ============================================
function initScatterStyle(section, session) {
    const container = section.querySelector('.gallery-container');

    session.images.forEach((imageName, i) => {
        const photo = createImageElement(imageName, session.title);
        container.appendChild(photo);
    });

    const photos = container.querySelectorAll('.photo-container');

    photos.forEach((photo, i) => {
        // Parallax effect
        gsap.to(photo, {
            y: -50 - (i % 3) * 30,
            ease: "none",
            scrollTrigger: {
                trigger: photo,
                start: "top bottom",
                end: "bottom top",
                scrub: 1.5
            }
        });

        // Reveal on scroll
        ScrollTrigger.create({
            trigger: photo,
            start: "top 80%",
            onEnter: () => photo.classList.add('visible'),
            once: true
        });
    });
}

// ============================================
// Style 5: Zoom Parallax
// ============================================
function initZoomStyle(section, session) {
    const container = section.querySelector('.gallery-container');
    const limitedImages = session.images.slice(0, 12);

    // Create grid positions for zoom effect
    const positions = [
        { x: '0%', y: '0%', w: '45vw', h: '60vh' },
        { x: '50%', y: '10%', w: '35vw', h: '45vh' },
        { x: '10%', y: '55%', w: '30vw', h: '40vh' },
        { x: '55%', y: '50%', w: '40vw', h: '50vh' },
        { x: '5%', y: '5%', w: '50vw', h: '70vh' },
        { x: '45%', y: '25%', w: '45vw', h: '55vh' },
        { x: '15%', y: '40%', w: '35vw', h: '45vh' },
        { x: '60%', y: '5%', w: '30vw', h: '40vh' },
        { x: '0%', y: '20%', w: '55vw', h: '65vh' },
        { x: '40%', y: '40%', w: '50vw', h: '55vh' },
        { x: '20%', y: '0%', w: '40vw', h: '50vh' },
        { x: '50%', y: '35%', w: '45vw', h: '60vh' }
    ];

    limitedImages.forEach((imageName, i) => {
        const photo = createImageElement(imageName, session.title);
        const pos = positions[i % positions.length];

        photo.style.left = pos.x;
        photo.style.top = pos.y;
        photo.style.width = pos.w;
        photo.style.height = pos.h;

        container.appendChild(photo);
    });

    const photos = container.querySelectorAll('.photo-container');
    const totalPhotos = photos.length;

    ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: `+=${totalPhotos * 120}vh`,
        pin: true,
        scrub: 1,
        onUpdate: (self) => {
            const progress = self.progress;

            photos.forEach((photo, i) => {
                const photoProgress = (progress * totalPhotos) - i;
                const img = photo.querySelector('img');

                if (photoProgress < 0) {
                    photo.classList.remove('active');
                    gsap.set(photo, { scale: 0.5, opacity: 0 });
                } else if (photoProgress < 1) {
                    photo.classList.add('active');
                    const scale = 0.5 + (photoProgress * 0.5);
                    gsap.set(photo, { scale, opacity: photoProgress });
                    if (img) gsap.set(img, { scale: 1.2 - (photoProgress * 0.2) });
                } else if (photoProgress < 2) {
                    photo.classList.add('active');
                    gsap.set(photo, { scale: 1, opacity: 1 });
                    if (img) gsap.set(img, { scale: 1 });
                } else {
                    const fadeOut = Math.min((photoProgress - 2) * 0.5, 1);
                    gsap.set(photo, { scale: 1 + fadeOut * 0.5, opacity: 1 - fadeOut });
                }
            });
        }
    });
}

// ============================================
// Initialize All Galleries
// ============================================
function initGalleries() {
    sessions.forEach(session => {
        const section = document.querySelector(`[data-session="${session.name}"]`);
        if (!section) return;

        const style = section.dataset.style;

        switch (style) {
            case 'stack':
                initStackStyle(section, session);
                break;
            case 'masonry':
                initMasonryStyle(section, session);
                break;
            case 'wipe':
                initWipeStyle(section, session);
                break;
            case 'scatter':
                initScatterStyle(section, session);
                break;
            case 'zoom':
                initZoomStyle(section, session);
                break;
        }

        // Animate section headers
        ScrollTrigger.create({
            trigger: section,
            start: "top 60%",
            onEnter: () => {
                section.querySelector('.section-header')?.classList.add('visible');
            },
            once: true
        });
    });
}

// ============================================
// Preloader
// ============================================
function initPreloader() {
    const preloader = document.querySelector('.preloader');
    const progressBar = document.querySelector('.preloader-progress');

    if (!preloader) return Promise.resolve();

    let progress = 0;
    const updateProgress = (value) => {
        progress = Math.min(value, 100);
        if (progressBar) progressBar.style.width = progress + '%';
    };

    updateProgress(10);

    return new Promise((resolve) => {
        if (document.fonts && document.fonts.ready) {
            document.fonts.ready.then(() => {
                updateProgress(50);
                setTimeout(() => {
                    updateProgress(80);
                    setTimeout(() => {
                        updateProgress(100);
                        setTimeout(() => {
                            preloader.classList.add('hidden');
                            resolve();
                        }, 300);
                    }, 200);
                }, 500);
            });
        } else {
            setTimeout(() => {
                updateProgress(100);
                preloader.classList.add('hidden');
                resolve();
            }, 1500);
        }
    });
}

// ============================================
// Hero Animations
// ============================================
function initHeroAnimations() {
    const heroTl = gsap.timeline({ defaults: { ease: "power3.out" } });

    heroTl
        .to(".hero-glow", { opacity: 1, scale: 1.1, duration: 2, ease: "power2.out" })
        .to(".title-line:first-child", { opacity: 1, y: 0, duration: 1.2 }, "-=1.5")
        .to(".title-divider", { opacity: 1, scaleX: 1, duration: 0.8 }, "-=0.8")
        .to(".title-line.subtitle", { opacity: 1, y: 0, duration: 1 }, "-=0.5")
        .to(".hero-tagline", { opacity: 1, y: 0, duration: 0.8 }, "-=0.3")
        .to(".scroll-indicator", { opacity: 1, duration: 1 }, "-=0.2");

    gsap.to(".hero-glow", {
        y: -100,
        ease: "none",
        scrollTrigger: {
            trigger: ".hero",
            start: "top top",
            end: "bottom top",
            scrub: 1
        }
    });
}

// ============================================
// Progress Bar
// ============================================
function initProgressBar() {
    gsap.to(".progress-bar", {
        width: "100%",
        ease: "none",
        scrollTrigger: {
            trigger: document.body,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.3
        }
    });
}

// ============================================
// Initialize Everything
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    gsap.registerPlugin(ScrollTrigger);

    initPreloader().then(() => {
        initHeroAnimations();
        initProgressBar();
        initGalleries();
    });
});

// Handle page visibility
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        ScrollTrigger.getAll().forEach(st => st.disable());
    } else {
        ScrollTrigger.getAll().forEach(st => st.enable());
    }
});
