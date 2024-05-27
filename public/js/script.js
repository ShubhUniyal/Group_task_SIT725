const notificationIcon = document.getElementById('notificationIcon');
const sidebar = document.querySelector('.notification-sidebar');
const notificationList = document.querySelector('.notification-list');
const overlay = document.getElementById('overlay');
const notificationCross = document.querySelector('.notification-cross');
let lastScrollTop = 0;
const navbar = document.querySelector('.nav-bar');
const notificationBubble = document.querySelector('.notification-bubble');
let newNotificationCount = 0;

window.onload = async function () {
    const canvas = document.getElementById('gaugeCanvas');
    const ctx = canvas.getContext('2d');
    const gaugeValue = document.getElementById('gaugeValue');
    const popup = document.getElementById('popup');
    const closePopup = document.getElementById('closePopup');
    const warningMessage = document.getElementById('warningMessage');
    const emailNotificationMessage = document.getElementById('emailNotificationMessage');
    const showGaugeStatusButton = document.getElementById('showGaugeStatus');
    const gaugeStatus = document.getElementById('gauge-container');
    let currentValue = 20;
    let emailSent = false; // Flag to track if email has been sent
    let popupShown = false; // Flag to track if popup has been shown
    let thresholdValue = 70; // Default value

    try {
        const response = await fetch('/api/threshold');
        const data = await response.json();
        if (response.ok) {
            thresholdValue = data.value;
        } else {
            console.error('Failed to fetch threshold:', data.message);
        }
    } catch (error) {
        console.error('Error fetching threshold:', error);
    }

    closePopup.addEventListener('click', () => {
        popup.style.display = 'none';
    });

    showGaugeStatusButton.addEventListener('click', () => {
        gaugeStatus.style.display = gaugeStatus.style.display === 'block' ? 'none' : 'block';
    });

    function drawGauge(value) {
        const startAngle = 0.75 * Math.PI;
        const endAngle = 2.25 * Math.PI;
        const angle = startAngle + (endAngle - startAngle) * (value / 100);
        const centerX = canvas.width / 2;
        const centerY = canvas.height * 0.9;
        const radius = canvas.width / 2.5;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw background arc
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, startAngle, endAngle);
        ctx.lineWidth = 20;
        ctx.strokeStyle = '#e0e0e0';
        ctx.stroke();

        // Draw value arc
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, startAngle, angle);
        ctx.lineWidth = 20;
        ctx.strokeStyle = '#3b82f6';
        ctx.stroke();

        // Draw inner circle
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius - 20, 0, 2 * Math.PI);
        ctx.fillStyle = '#fff';
        ctx.fill();
    }

    function updateGauge(value) {
        gaugeValue.textContent = `${value}%`;
        drawGauge(value);

        if (value > 50 && value <= thresholdValue) {
            if (!popupShown) {
                popup.style.display = 'block';
                appendNotification('Fire might be detected');
                emailNotificationMessage.textContent = ''; // Clear any previous email notification message
                popupShown = true; // Set the flag to true to prevent further popups
            }
        } else if (value > thresholdValue) {
            if (!emailSent) {
                sendEmailNotification();
                emailSent = true; // Set the flag to true to prevent further emails
            }
        } else {
            popup.style.display = 'none';
            notificationList.innerHTML = ''; // Clear all notification messages
            emailNotificationMessage.textContent = ''; // Clear any previous email notification message
            emailSent = false; // Reset the flag if value goes below threshold
            popupShown = false; // Reset the popup flag if value goes below 50
        }
    }

    function appendNotification(message) {
        const listItem = document.createElement('li');
        listItem.textContent = message;
        listItem.classList.add('notification-item');
        notificationList.appendChild(listItem);
        newNotificationCount++; // Increment new notification count
        updateNotificationBubble(); // Update notification bubble
    }

    function sendEmailNotification() {
        // Dummy function to simulate sending an email
        alert("FIRE!!!!! Email notification sent!");
        appendNotification('More chances of fire. Email notification sent!');
    }

    // Set initial gauge value
    updateGauge(currentValue);

    // Simulate dynamic update
    setInterval(() => {
        currentValue = (currentValue + 1) % 101;
        updateGauge(currentValue);
    }, 1000);
};

window.addEventListener('scroll', function () {
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (scrollTop > lastScrollTop) {
        // Downscroll
        navbar.classList.add('hidden');
    } else {
        // Upscroll
        navbar.classList.remove('hidden');
    }
    lastScrollTop = scrollTop;
});

function updateNotificationBubble() {
    if (newNotificationCount > 0) {
        notificationBubble.textContent = newNotificationCount;
        notificationBubble.style.display = 'block';
    } else {
        notificationBubble.style.display = 'none';
    }
}


notificationIcon.addEventListener('click', function (event) {
    event.stopPropagation(); // Prevents the click event from bubbling up to the document
    sidebar.classList.toggle('open');
    overlay.style.display = overlay.style.display === 'block' ? 'none' : 'block';
    // Reset new notification count and update bubble when sidebar is opened
    newNotificationCount = 0;
    updateNotificationBubble();
});

notificationCross.addEventListener('click', function (event) {
    event.stopPropagation(); // Prevents the click event from bubbling up to the document
    sidebar.classList.remove('open');
    overlay.style.display = 'none';
});

overlay.addEventListener('click', function () {
    sidebar.classList.remove('open');
    overlay.style.display = 'none';
});

document.addEventListener('click', function (event) {
    const isClickInsideSidebar = sidebar.contains(event.target);
    const isClickInsideNotificationIcon = notificationIcon.contains(event.target);

    if (!isClickInsideSidebar && !isClickInsideNotificationIcon) {
        sidebar.classList.remove('open');
        overlay.style.display = 'none';
    }
});
