window.scrollTo(left)

function createTypingEffect(text, elementOuEcrire, spd) {
    let i = 0;
    const speed = spd;

    function writeText() {
        const element = document.querySelector(elementOuEcrire);
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(writeText, speed);
        }
    }

    function checkScroll() {
        const textContainer = document.querySelector(elementOuEcrire);
        const rect = textContainer.getBoundingClientRect();
        const isTextVisible = rect.top <= window.innerHeight && rect.bottom >= 0;

        if (isTextVisible && i === 0) {
            writeText();
        }
    }

    window.addEventListener('load', function () {
        checkScroll();
    });

    window.addEventListener('scroll', function () {
        checkScroll();
    });
}

createTypingEffect("Expériences", '.experiences-heading', 100);
createTypingEffect("Loris Caruhel", '.mon_nom', 100);
createTypingEffect("Scolarité", '.scolarite-heading', 100);
createTypingEffect("Futur Développeur", '.moi-heading', 100);
createTypingEffect("Compétences", '.competences-heading', 100);