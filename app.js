/* ============================================
   GIULIA / Alfa Romeo - Horizontal Filmstrip Gallery
   GSAP + ScrollTrigger Version
   ============================================ */

// Session data configuration (excluding "(1)" duplicates)
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
// Initialize Gallery - Create Images Dynamically
// ============================================
function initGallery() {
    sessions.forEach(session => {
        const section = document.querySelector(`[data-session="${session.name}"]`);
        if (!section) return;

        const filmstrip = section.querySelector('.filmstrip');
        if (!filmstrip) return;

        // Create image elements
        session.images.forEach(imageName => {
            const photoContainer = document.createElement('div');
            photoContainer.className = 'photo-container loading';

            const img = document.createElement('img');
            img.src = `public/${imageName}.jpeg`;
            img.alt = `Alfa Romeo Giulia - ${session.title}`;
            img.loading = 'lazy';
            img.setAttribute('data-loading', 'true');

            // Handle image load
            img.onload = () => {
                img.setAttribute('data-loading', 'false');
                photoContainer.classList.remove('loading');
            };

            // Handle image error
            img.onerror = () => {
                img.classList.add('error');
                photoContainer.classList.remove('loading');
                img.setAttribute('data-loading', 'false');
            };

            photoContainer.appendChild(img);
            filmstrip.appendChild(photoContainer);
        });
    });
}

// ============================================
// Preloader with Font Loading
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

    // Simulate initial progress
    updateProgress(10);

    return new Promise((resolve) => {
        // Wait for fonts
        if (document.fonts && document.fonts.ready) {
            document.fonts.ready.then(() => {
                updateProgress(50);

                // Wait a bit for first images to start loading
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
            // Fallback for browsers without font loading API
            setTimeout(() => {
                updateProgress(100);
                preloader.classList.add('hidden');
                resolve();
            }, 1500);
        }
    });
}

// ============================================
// Mobile Detection and Swipe Hint
// ============================================
function initMobileHint() {
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    if (isTouchDevice) {
        const hint = document.createElement('div');
        hint.className = 'swipe-hint';
        document.body.appendChild(hint);

        // Show hint when entering first gallery section
        ScrollTrigger.create({
            trigger: ".gallery-section",
            start: "top 90%",
            onEnter: () => {
                hint.classList.add('visible');
                setTimeout(() => {
                    hint.classList.remove('visible');
                }, 3000);
            },
            once: true
        });
    }
}

// ============================================
// Hero Animations
// ============================================
function initHeroAnimations() {
    const heroTl = gsap.timeline({ defaults: { ease: "power3.out" } });

    heroTl
        .to(".hero-glow", {
            opacity: 1,
            scale: 1.1,
            duration: 2,
            ease: "power2.out"
        })
        .to(".title-line:first-child", {
            opacity: 1,
            y: 0,
            duration: 1.2
        }, "-=1.5")
        .to(".title-divider", {
            opacity: 1,
            scaleX: 1,
            duration: 0.8
        }, "-=0.8")
        .to(".title-line.subtitle", {
            opacity: 1,
            y: 0,
            duration: 1
        }, "-=0.5")
        .to(".hero-tagline", {
            opacity: 1,
            y: 0,
            duration: 0.8
        }, "-=0.3")
        .to(".scroll-indicator", {
            opacity: 1,
            duration: 1
        }, "-=0.2");

    // Parallax on hero glow
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
// Progress Bar Animation
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
// Horizontal Scroll Sections
// ============================================
function initHorizontalScroll() {
    const gallerySections = gsap.utils.toArray(".gallery-section");

    gallerySections.forEach((section, index) => {
        const filmstrip = section.querySelector(".filmstrip");
        const photos = section.querySelectorAll(".photo-container");
        const sectionNumber = section.querySelector(".section-number");
        const sectionTitle = section.querySelector(".section-title");

        if (!filmstrip || photos.length === 0) return;

        // Calculate scroll distance based on filmstrip width
        const getScrollWidth = () => {
            return filmstrip.scrollWidth - window.innerWidth + window.innerWidth * 0.3;
        };

        // Create horizontal scroll animation
        const scrollTween = gsap.to(filmstrip, {
            x: () => -getScrollWidth(),
            ease: "none",
            scrollTrigger: {
                trigger: section,
                start: "top top",
                end: () => `+=${getScrollWidth()}`,
                pin: true,
                scrub: 1,
                anticipatePin: 1,
                invalidateOnRefresh: true,
                onEnter: () => animateSectionIn(section),
                onLeaveBack: () => animateSectionOut(section)
            }
        });

        // Parallax effect on individual photos
        photos.forEach((photo, i) => {
            const img = photo.querySelector("img");
            if (!img) return;

            // Alternate parallax direction
            const parallaxAmount = (i % 3 === 0) ? 40 : (i % 3 === 1) ? -30 : 20;

            gsap.to(img, {
                y: parallaxAmount,
                ease: "none",
                scrollTrigger: {
                    trigger: section,
                    start: "top top",
                    end: () => `+=${getScrollWidth()}`,
                    scrub: 1.5,
                    invalidateOnRefresh: true
                }
            });
        });
    });
}

// ============================================
// Section Title Animations
// ============================================
function animateSectionIn(section) {
    const sectionNumber = section.querySelector(".section-number");
    const sectionTitle = section.querySelector(".section-title");

    if (sectionNumber) {
        gsap.to(sectionNumber, {
            opacity: 1,
            x: 0,
            duration: 0.6,
            ease: "power2.out"
        });
    }

    if (sectionTitle) {
        gsap.to(sectionTitle, {
            opacity: 1,
            x: 0,
            duration: 0.8,
            delay: 0.1,
            ease: "power2.out"
        });

        // Animate the pseudo-element line via CSS variable or direct manipulation
        gsap.to(sectionTitle, {
            "--line-width": "100px",
            duration: 0.8,
            delay: 0.2,
            ease: "power2.out"
        });
    }
}

function animateSectionOut(section) {
    const sectionNumber = section.querySelector(".section-number");
    const sectionTitle = section.querySelector(".section-title");

    gsap.to([sectionNumber, sectionTitle], {
        opacity: 0,
        x: -20,
        duration: 0.4,
        ease: "power2.in"
    });
}

// ============================================
// Initialize All Animations
// ============================================
function initAnimations() {
    gsap.registerPlugin(ScrollTrigger);

    // Initialize all animation modules
    initHeroAnimations();
    initProgressBar();
    initHorizontalScroll();

    // Trigger first section animation when scrolled into view
    ScrollTrigger.create({
        trigger: ".gallery-section",
        start: "top 80%",
        onEnter: () => {
            const firstSection = document.querySelector(".gallery-section");
            if (firstSection) {
                animateSectionIn(firstSection);
            }
        },
        once: true
    });

    // Refresh ScrollTrigger on window resize
    let resizeTimeout;
    window.addEventListener("resize", () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            ScrollTrigger.refresh();
        }, 250);
    });
}

// ============================================
// Initialize on DOM Ready
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    initGallery();

    // Wait for preloader, then init animations
    initPreloader().then(() => {
        requestAnimationFrame(() => {
            initAnimations();
            initMobileHint();
        });
    });
});

// ============================================
// Handle page visibility for performance
// ============================================
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        ScrollTrigger.getAll().forEach(st => st.disable());
    } else {
        ScrollTrigger.getAll().forEach(st => st.enable());
    }
});
