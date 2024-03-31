const hamburger = document.querySelector(".hamburger");
const listmenu = document.querySelector(".list-menu");



hamburger.addEventListener("click", () =>{
    hamburger.classList.toggle("active");
    listmenu.classList.toggle("active");
})

document.querySelectorAll(".nav-link").forEach (n => n.addEventListener("click", () => {
    hamburger.classList.remove("active");
    listmenu.classList.remove("active");
}))

document.addEventListener('scroll', () => {
const header = document.querySelector('header');
const logotitle = document.querySelector('.logo-title');
if(window.scrollY > 0) {
    header.classList.add('scrolled');
    logotitle.classList.add('scrolled');

}else{
    header.classList.remove('scrolled');
    logotitle.classList.remove('scrolled');

}
})

let sections = document.querySelectorAll('section');

window.onscroll = () => {
    sections.forEach(sec => {
        let top = window.scrollY;   
        let offset = sec.offsetTop - 300;
        let height = sec.offsetHeight;

        if(top >= offset && top < offset + height){
            sec.classList.add('show-animate');
        }else{
            sec.classList.remove('show-animate');
        }
    })
}