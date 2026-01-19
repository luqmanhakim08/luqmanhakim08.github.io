/* -------------------------------------------

Name: 		Courtney
Version:    1.0
Developer:	Nazar Miller (millerDigitalDesign)
Portfolio:  https://themeforest.net/user/millerdigitaldesign/portfolio?ref=MillerDigitalDesign

p.s. I am available for Freelance hire (UI design, web development). email: miller.themes@gmail.com

------------------------------------------- */

$(function () {

    "use strict";

    /***************************

    swup

    ***************************/
    const options = {
        containers: ['#swupMain', '#swupPerson', '#swupBg', '#swupSkills', '#swupMenu'],
        animateHistoryBrowsing: true,
        linkSelector: 'a:not([data-no-swup])',
        plugins: [new SwupBodyClassPlugin()]
    };
    const swup = new Swup(options);

    const bodyClassPlugin = new SwupBodyClassPlugin({
        prefix: '.mil-fw-page'
    });

    // Make navigation links trigger full page reload with preloader animation
    $(document).on('click', 'a:not([data-no-swup])', function(e) {
        var href = $(this).attr('href');
        
        // Check if it's an internal link (not hash, not external)
        if (href && !href.startsWith('#') && !href.startsWith('http') && !href.startsWith('mailto') && !href.startsWith('tel')) {
            e.preventDefault();
            
            // Convert relative paths to absolute paths from root
            if (!href.startsWith('/')) {
                // Remove ../ from the beginning if present
                href = href.replace(/^\.\.\//, '/');
                // If it still doesn't start with /, add it
                if (!href.startsWith('/')) {
                    href = '/' + href;
                }
            }
            
            // Show preloader
            $('html').addClass('is-animating');
            $('.mil-preloader-frame').css('height', '100%');
            $('.mil-preloader-content').css({
                'transform': 'scale(1) translateY(0)',
                'opacity': 1
            });
            
            // Delay and navigate
            setTimeout(function() {
                window.location.href = href;
            }, 400);
        }
    });

    /***************************

    register gsap plugins

    ***************************/
    gsap.registerPlugin(ScrollTrigger);

    // Function to reinitialize animations after Swup loads new content
    function reinitializeAnimations() {
        // Kill all existing scroll triggers
        ScrollTrigger.getAll().forEach(trigger => trigger.kill());

        // Reinitialize scroll animations
        const appearance = document.querySelectorAll(".mil-up");
        appearance.forEach((section) => {
            gsap.fromTo(section, {
                opacity: 0,
                y: 50,
                ease: 'sine',
            }, {
                y: 0,
                opacity: 1,
                scrollTrigger: {
                    trigger: section,
                    toggleActions: 'play none none reverse',
                }
            });
        });

        const rotate = document.querySelectorAll(".mil-rotate");
        rotate.forEach((section) => {
            var value = $(section).data("value");
            gsap.fromTo(section, {
                ease: 'sine',
                rotate: 0,
            }, {
                rotate: value,
                scrollTrigger: {
                    trigger: section,
                    scrub: true,
                    toggleActions: 'play none none reverse',
                }
            });
        });

        // Reinitialize progress bars
        const progGo = document.querySelectorAll(".mil-circular-progress");
        progGo.forEach((section) => {
            var value = $(section).data("value");
            gsap.fromTo(section, {
                "--p": '0',
                ease: 'sine',
            }, {
                "--p": value,
                duration: 1,
                scrollTrigger: {
                    trigger: section,
                    toggleActions: 'play none none reverse',
                }
            });
        });

        // Reinitialize counters
        const number = $(".mil-counter");
        number.each(function (index, element) {
            var count = $(this),
                zero = {
                    num: 0
                },
                countTo = parseInt(count.attr("data-number"), 10),
                speed = parseInt(count.attr("data-speed"), 10);

            gsap.to(zero, speed / 1000, {
                num: countTo,
                onUpdate: function () {
                    count.text(Math.ceil(zero.num));
                },
                scrollTrigger: {
                    trigger: element,
                    toggleActions: 'play none none none'
                }
            });
        });

        // Reinitialize back to top button
        const btt = document.querySelector(".mil-back-to-top .mil-link");
        if (btt) {
            gsap.set(btt, {
                opacity: .5,
            });

            gsap.to(btt, {
                opacity: 1,
                ease: 'sine',
                scrollTrigger: {
                    trigger: "body",
                    start: "top -20%",
                    end: "top -20%",
                    toggleActions: "play none reverse none"
                }
            });
        }

        // Reinitialize swipers
        var reviewsSwiper = document.querySelector('.mil-reviews-slider');
        if (reviewsSwiper && !reviewsSwiper.swiper) {
            new Swiper('.mil-reviews-slider', {
                spaceBetween: 30,
                speed: 800,
                parallax: true,
                navigation: {
                    nextEl: '.mil-reviews-next',
                    prevEl: '.mil-reviews-prev',
                },
                pagination: {
                    el: '.swiper-reviews-pagination',
                    clickable: true,
                },
            });
        }

        var portfolioSwiper = document.querySelector('.mil-portfolio-carousel');
        if (portfolioSwiper && !portfolioSwiper.swiper) {
            new Swiper('.mil-portfolio-carousel', {
                spaceBetween: 90,
                speed: 800,
                parallax: true,
                mousewheel: {
                    enable: true
                },
                navigation: {
                    nextEl: '.mil-portfolio-next',
                    prevEl: '.mil-portfolio-prev',
                },
                pagination: {
                    el: '.mil-portfolio-pagination',
                    type: 'fraction',
                },
            });
        }

        // Reinitialize accordions
        let groups = gsap.utils.toArray(".mil-accordion-group");
        let menus = gsap.utils.toArray(".mil-accordion-menu");
        let menuToggles = groups.map(createAnimation);

        menus.forEach((menu) => {
            menu.removeEventListener("click", toggleMenuListener);
            menu.addEventListener("click", () => toggleMenu(menu));
        });

        function toggleMenu(clickedMenu) {
            menuToggles.forEach((toggleFn) => toggleFn(clickedMenu));
        }

        function createAnimation(element) {
            let menu = element.querySelector(".mil-accordion-menu");
            let title = element.querySelector(".mil-accordion-menu h6");
            let box = element.querySelector(".mil-accordion-content");
            let minusElement = element.querySelector(".mil-minus");
            let plusElement = element.querySelector(".mil-plus");

            gsap.set(box, {
                height: "auto",
            });

            let animation = gsap
                .timeline()
                .from(box, {
                    height: 0,
                    duration: 0.5,
                    ease: "sine"
                })
                .from(minusElement, {
                    duration: 0.2,
                    autoAlpha: 0,
                    ease: "none",
                }, 0)
                .to(plusElement, {
                    duration: 0.2,
                    autoAlpha: 0,
                    ease: "none",
                }, 0)
                .from(title, {
                    duration: 0.2,
                    ease: "sine",
                }, 0)
                .to(title, {
                    duration: 0.2,
                    ease: "sine",
                }, 0)
                .reverse();

            return function (clickedMenu) {
                if (clickedMenu === menu) {
                    animation.reversed(!animation.reversed());
                } else {
                    animation.reverse();
                }
            };
        }
    }

    // Refresh ScrollTrigger after all animations are set up
    ScrollTrigger.refresh();

    // Listen for Swup content replacement
    swup.on('contentReplaced', function() {
        // Close navigation menu if open
        $(".mil-navigation, .mil-menu-btn").removeClass('mil-active');
        
        // Scroll to top
        window.scrollTo(0, 0);
        
        // Refresh ScrollTrigger before reinitializing
        ScrollTrigger.refresh();
        
        // Reinitialize animations
        reinitializeAnimations();
    });
    /***************************

    preloader

    ***************************/
    var timeline = gsap.timeline();

    timeline.to(".mil-preloader-content", {
        ease: "sine",
        y: 0,
        duration: 0.4,
        scale: 1,
        opacity: 1,
        delay: '.2',
    });

    timeline.to(".mil-preloader-content", {
        ease: "sine",
        y: '-200',
        duration: 0.4,
        scale: .6,
        opacity: 0,
        delay: '1.2',
    });

    timeline.to(".mil-preloader-frame", {
        ease: "sine",
        duration: 0.4,
        height: 0,
        onComplete: function () {
            $('html').removeClass('is-animating');
        }
    });
    /***************************

    scroll progress

    ***************************/
    gsap.to('.mil-progress', {
        height: '100%',
        ease: 'linear',
        scrollTrigger: {
            scrub: 1
        }
    });
    /***************************

    parallax

    ***************************/
    var scene = document.getElementById('scene');
    var parallaxInstance = new Parallax(scene, {
        limitY: 15,
    });
    /***************************

    anchor scroll

    ***************************/
    $(document).on('click', 'a[href^="#"]', function (event) {
        event.preventDefault();

        var target = $($.attr(this, 'href'));
        var offset = 90;

        $('html, body').animate({
            scrollTop: target.offset().top - offset
        }, 400);
    });
    /***************************

    back to top

    ***************************/
    // Moved to reinitializeAnimations() function

    // Initialize animations on first page load
    reinitializeAnimations();

    /***************************

    navigation

    ***************************/
    $(".mil-menu-btn").on("click", function () {
        $(this).toggleClass('mil-active');
        $('.mil-navigation').toggleClass('mil-active');
    });

    /***************************

    reviews slider & portfolio carousel & accordion

    ***************************/
    // Moved to reinitializeAnimations() function that runs on initial load and after Swup page transitions

    /***************************

    DONE - All animations initialized

    ***************************/

});




