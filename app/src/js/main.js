console.info('hello');

//-------------------
//* Animations
//-------------------

let animationsController = new ScrollMagic.Controller({globalSceneOptions: {duration: "80%"}});

const sampleScene = new ScrollMagic.Scene({
    triggerElement: '#services',
})
    .setClassToggle('.sample', 'sample_show')
    .addTo(animationsController);

const profileScene = new ScrollMagic.Scene({
    triggerElement: '#profileIntro',
})
    .setClassToggle('#profileLink', 'menu__link_active')
    .addTo(animationsController);

const servicesScene = new ScrollMagic.Scene({
triggerElement: '#services',
})
    .setClassToggle('#servicesLink', 'menu__link_active')
    .addTo(animationsController);
    
const resumeScene = new ScrollMagic.Scene({
triggerElement: '#resume',
})
    .setClassToggle('#resumeLink', 'menu__link_active')
    .addTo(animationsController);

const portfolioScene = new ScrollMagic.Scene({
    triggerElement: '#portfolio',
})
    .setClassToggle('#portfolioLink', 'menu__link_active')
    .addTo(animationsController);

const portfolioItemScene = new ScrollMagic.Scene({
    triggerElement: '#projects',
})
    .on("enter", function (event) {
        $('.project').addClass('fadeInLeft');
    })
    .addTo(animationsController);

const contactsScene = new ScrollMagic.Scene({
    triggerElement: '#contacts',
})
    .setClassToggle('#contactsLink', 'menu__link_active')
    .addTo(animationsController);

//-------------------
//* Nav
//-------------------

const nav = document.getElementById('nav');
const navOffset = offset(nav).top;


function offset(el) {
    let rect = el.getBoundingClientRect(),
        scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
        scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    return { top: rect.top + scrollTop, left: rect.left + scrollLeft }
}


window.onscroll = () => {

    if (window.pageYOffset >= navOffset) {
        nav.classList.add('nav_fixed');
    }
    else {
        nav.classList.remove('nav_fixed');
    }
};

//-------------------
//* ScrollToId
//-------------------

$(function(){
    $("a[href^='#']").click(function(){
        const _href = $(this).attr("href");
        $("html, body").animate({scrollTop: $(_href).offset().top - 50});
        return false;
    });
});

//-------------------
//* Particles
//-------------------

particlesJS("particles", {"particles":{"number":{"value":80,"density":{"enable":true,"value_area":800}},"color":{"value":"#ffffff"},"shape":{"type":"circle","stroke":{"width":0,"color":"#000000"},"polygon":{"nb_sides":5},"image":{"src":"img/github.svg","width":100,"height":100}},"opacity":{"value":0.5,"random":false,"anim":{"enable":false,"speed":1,"opacity_min":0.1,"sync":false}},"size":{"value":3,"random":true,"anim":{"enable":false,"speed":40,"size_min":0.1,"sync":false}},"line_linked":{"enable":true,"distance":150,"color":"#ffffff","opacity":0.4,"width":1},"move":{"enable":true,"speed":3,"direction":"none","random":false,"straight":false,"out_mode":"out","bounce":false,"attract":{"enable":false,"rotateX":600,"rotateY":1200}}},"interactivity":{"detect_on":"canvas","events":{"onhover":{"enable":true,"mode":"repulse"},"onclick":{"enable":true,"mode":"push"},"resize":true},"modes":{"grab":{"distance":400,"line_linked":{"opacity":1}},"bubble":{"distance":400,"size":40,"duration":2,"opacity":8,"speed":3},"repulse":{"distance":200,"duration":0.4},"push":{"particles_nb":4},"remove":{"particles_nb":2}}},"retina_detect":true});