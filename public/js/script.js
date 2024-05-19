window.onload = function() {
    const canvas = document.getElementById('gaugeCanvas');
    const ctx = canvas.getContext('2d');
    const gaugeValue = document.getElementById('gaugeValue');
    const popup = document.getElementById('popup');
    const closePopup = document.getElementById('closePopup');
    const warningMessage = document.getElementById('warningMessage');
    const emailNotificationMessage = document.getElementById('emailNotificationMessage');
    let currentValue = 50;
    let emailSent = false; // Flag to track if email has been sent

    closePopup.addEventListener('click', () => {
        popup.style.display = 'none';
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

        if (value > 50 && value <= 70) {
            popup.style.display = 'block';
            warningMessage.textContent = 'Fire might be detected';
            emailNotificationMessage.textContent = ''; // Clear any previous email notification message
        } else if (value > 70) {
            if (!emailSent) {
                sendEmailNotification();
                emailSent = true; // Set the flag to true to prevent further emails
            }
        } else {
            popup.style.display = 'none';
            warningMessage.textContent = '';
            emailNotificationMessage.textContent = ''; // Clear any previous email notification message
            emailSent = false; // Reset the flag if value goes below 70
        }
    }


    // Set initial gauge value
    updateGauge(currentValue);

    // Simulate dynamic update
    setInterval(() => {
        currentValue = (currentValue + 1) % 101;
        updateGauge(currentValue);
    }, 1000);
};