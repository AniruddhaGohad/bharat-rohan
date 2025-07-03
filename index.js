
const droneImage = document.getElementById('drone');
const reload = document.getElementById('reload');
const flash = document.getElementById('flash');
const flash1 = document.getElementById('flash1');
const { height: droneHeight, width: droneWidth } = droneImage.getBoundingClientRect();

function isSmallScreen() {
    return window.innerWidth <= 600;
}

function scrollToBottom(duration) {
    const totalHeight = document.body.scrollHeight - window.innerHeight;
    const startTime = performance.now();

    function scrollStep(currentTime) {
        const elapsedTime = currentTime - startTime;
        const progress = Math.min(elapsedTime / (duration * 1000), 1);
        const scrollPosition = totalHeight * progress;
        // window.scrollTo(0, scrollPosition);
        document.documentElement.scrollTop = scrollPosition;
        document.body.scrollTop = scrollPosition;


        if (progress < 1) {
            requestAnimationFrame(scrollStep);
        }
    }

    requestAnimationFrame(scrollStep);
}


function scrollToPage(pageNumber, duration) {
    const targetDiv = document.querySelector(`.page:nth-child(${pageNumber})`);
    if (!targetDiv) {
        console.error(`Div with ID #page${pageNumber} not found.`);
        return;
    }

    const targetPosition = targetDiv.offsetTop; // Get the target div's top position
    const startPosition = window.scrollY; // Current scroll position
    const distance = targetPosition - startPosition; // Distance to scroll
    const startTime = performance.now();

    function scrollStep(currentTime) {
        const elapsedTime = currentTime - startTime;
        const progress = Math.min(elapsedTime / (duration * 1000), 1); // Clamp progress to 1
        const scrollPosition = startPosition + distance * progress; // Smoothly interpolate scroll position
        window.scrollTo(0, scrollPosition);

        if (progress < 1) {
            requestAnimationFrame(scrollStep);
        }
    }

    requestAnimationFrame(scrollStep);
}


function moveDrone(targetXPercent, targetYPercent, duration) {
    return new Promise((resolve) => {
        const containerWidth = document.documentElement.clientWidth;
        const containerHeight = document.documentElement.clientHeight;

        const droneWidth = droneImage.offsetWidth;
        const droneHeight = droneImage.offsetHeight;

        const startX = parseFloat(window.getComputedStyle(droneImage).left) || 0;
        const startY = parseFloat(window.getComputedStyle(droneImage).top) || 0;

        const maxTargetX = containerWidth - droneWidth;
        const maxTargetY = containerHeight - droneHeight;

        const targetX = Math.max(0, Math.min((targetXPercent / 100) * maxTargetX, maxTargetX));
        const targetY = Math.max(0, Math.min((targetYPercent / 100) * maxTargetY, maxTargetY));

        const distanceX = targetX - startX;
        const distanceY = targetY - startY;
        const startTime = performance.now();

        function moveStep(currentTime) {
            const elapsedTime = currentTime - startTime;
            const progress = Math.min(elapsedTime / (duration * 1000), 1);
            const currentX = startX + distanceX * progress;
            const currentY = startY + distanceY * progress;

            droneImage.style.left = `${Math.max(0, Math.min(currentX / containerWidth * 100, 100))}%`;
            droneImage.style.top = `${Math.max(0, Math.min(currentY / containerHeight * 100, 100))}%`;

            if (progress < 1) {
                requestAnimationFrame(moveStep);
            } else {
                resolve();
            }
        }

        requestAnimationFrame(moveStep);
    });
}

function enlargeDrone(targetWidth, duration) {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
    const startWidth = parseFloat(window.getComputedStyle(droneImage).width) || 0;
    const startTime = performance.now();

    function moveStep(currentTime) {
        const elapsedTime = currentTime - startTime;
        const progress = Math.min(elapsedTime / (duration * 1000), 1);
        const currentWidth = startWidth + targetWidth * progress;

        droneImage.style.width = `${currentWidth}px`;

        if (progress < 1) {
            requestAnimationFrame(moveStep);
        }
    }

    requestAnimationFrame(moveStep);
}

function slidePage1() {
    const p1 = document.querySelector('.page1-content');
    const startLeft = parseFloat(window.getComputedStyle(p1).marginLeft) || 0;
    const startTime = performance.now();

    function moveStep(currentTime) {
        const elapsedTime = currentTime - startTime;
        const progress = Math.min(elapsedTime / (3 * 1000), 1);
        const currentLeft = startLeft + -1000 * progress;

        p1.style.marginLeft = `${currentLeft}px`;

        if (progress < 1) {
            requestAnimationFrame(moveStep);
        }
    }

    requestAnimationFrame(moveStep);
}

async function moveDroneBySteps(steps) {
    for (let step of steps) {
        await moveDrone(step.left, step.top, step.duration);
    }
}

// scrollToBottom(10);


// moveDroneBySteps([
//     { left: 0, top: 50, duration: 2.5 },
//     { left: 50, top: 100, duration: 2.5 },
//     { left: 100, top: 50, duration: 2.5 },
//     { left: 50, top: 0, duration: 2.5 }
// ]);

// moveDroneInCircle(50, 50, 50, 10);

const sleep = async (duration) => new Promise((resolve) => {
    setTimeout(resolve, duration);
});

const reset = () => {
    window.location.reload();
    return;

}

async function init() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
    await sleep(2000);
    // await sleep(4000);
    document.querySelector('.page1-text').style.animation = 'original 3s forwards ease-in';
    // scrollToPage(1, 0.2);
    enlargeDrone(250, 2)
    if (isSmallScreen()) {
        await moveDrone(35, 12, 2);
    } else {
        await moveDrone(60, 10, 2);
    }
    flash.style.display = 'inline';
    await sleep(6000);

    flash.style.display = 'none';
    slidePage1();
    scrollToPage(2, 2)

    await moveDrone(55, 17, 0.25);
    await moveDrone(50, 16, 0.25);
    await moveDrone(45, 15, 0.25);
    await moveDrone(50, 14, 0.25);
    await moveDrone(55, 13, 0.25);
    await moveDrone(65, 10, 0.25);
    await moveDrone(70, 10, 0.25);
    await moveDrone(75, 10, 0.25);
    flash.style.display = 'inline';
    document.querySelectorAll('.characteristic').forEach((element, k) => setTimeout(() => element.style.animation = "bloom 0.5s forwards linear", 500 * (k / 2)));

    await sleep(7000);

    document.querySelectorAll('.characteristic').forEach((element, k) => setTimeout(() => element.style.animation = "fade 0.5s forwards linear", 500 * (k / 4)));
    flash.style.display = 'none';
    //     scrollToPage(3, 2);
    //    await moveDrone(75, 20, 1);
    // droneImage.style.transform = "rotate(-9deg)";
    //     await moveDrone(35, 10, 1);
    //     flash.setAttribute('src', 'https://kapps.co.in/BharatRohan/wp-content/uploads/2025/06/flash3.png');
    //     flash.style.transform = 'translate(2.3%, 116%) scale(3)';
    //     flash.style.display = 'inline';
    //     document.querySelectorAll('.statistic').forEach((element, k) => setTimeout(() => element.style.animation = "bloom 0.5s forwards linear", 500 * (k/2)));
    //     await sleep(5000);
    //     document.querySelectorAll('.statistic').forEach((element, k) => setTimeout(() => element.style.animation = "fade 0.5s forwards linear", 500 * (k/4)));
    //     flash.style.display = 'none';
    // flash.style.transform = 'translate(-158.5%, 117%) scale(3)';
    scrollToPage(3, 2);
    await moveDrone(40, 16, 0.25);
    await moveDrone(45, 15, 0.25);
    await moveDrone(50, 14, 0.25);
    await moveDrone(45, 14, 0.25);
    await moveDrone(40, 13, 0.25);
    await moveDrone(35, 12, 0.25);
    if (!isSmallScreen()) {
        droneImage.style.transform = "rotate(-55deg)";
    } else {
        droneImage.style.transform = "rotate(-20deg)";
    }
    await moveDrone(30, 10, 0.25);
    // droneImage.style.transform = "rotate(-16deg)";
    flash.style.display = 'inline';
    if (isSmallScreen()) {
        document.querySelectorAll('.s2.b2').forEach(ele => ele.style.display = 'none');
    }
    document.querySelectorAll('.s2.b1').forEach((element, k) => setTimeout(() => element.style.animation = "bloom 0.5s forwards linear", 500 * (k / 2)));
    await sleep(7000);
    document.querySelectorAll('.s2.b1').forEach((element, k) => setTimeout(() => element.style.animation = "fade 0.5s forwards linear", 500 * (k / 2)));
    await sleep(500);

    if (isSmallScreen()) {
        document.querySelectorAll('.s2.b2').forEach(ele => ele.style.display = 'flex');
        document.querySelectorAll('.s2.b1').forEach(ele => ele.style.display = 'none');
    }
    droneImage.style.transform = "rotate(-20deg)";
    document.querySelectorAll('.s2.b2').forEach((element, k) => setTimeout(() => element.style.animation = "bloom 0.5s forwards linear", 500 * (k / 2)));
    await sleep(5000);
    document.querySelectorAll('.s2.b2').forEach((element, k) => setTimeout(() => element.style.animation = "fade 0.5s forwards linear", 500 * (k / 2)));
    flash.style.display = 'none';
    if (!isSmallScreen()) {
        droneImage.style.transform = "rotate(0deg)";
    }

    scrollToPage(4, 2.5);
    let currentX = 35;
    let currentY = 10;
    for (let i = 0; i < 6; i++) {
        await moveDrone(currentX, currentY, 1 / 5);
        currentX += 5;
        currentY += 2;
    }
    for (let i = 0; i < 6; i++) {
        await moveDrone(currentX, currentY, 1 / 5);
        currentX -= 8;
        currentY -= 2;
    }

    // if (!isSmallScreen()) {
    //     // flash.setAttribute('src', 'https://kapps.co.in/BharatRohan/wp-content/uploads/2025/06/flash4.png');
    //     // flash.style.transform = 'translate(-12.2%, 19%) scale(1)';
    // }


    flash.style.display = 'inline';

    if (!isSmallScreen()) {
        flash.style.display = 'none';
        flash1.style.display = 'inline';
    }

    document.querySelector('.page4-content').style.animation = "bloom 0.5s forwards linear"
    reload.style.display = 'block';
}

document.body.scrollTop = 0;
document.documentElement.scrollTop = 0;
init();

reload.addEventListener('click', reset);