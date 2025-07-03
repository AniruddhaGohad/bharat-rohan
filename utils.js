async function moveDroneInCircle(radius, centerXPercent, centerYPercent, duration) {
    const steps = 100; // Number of steps for the animation (higher = smoother)
    const angleIncrement = (2 * Math.PI) / steps; // Full circle divided by number of steps

    for (let i = 0; i < steps; i++) {
        const angle = angleIncrement * i;
        const left = centerXPercent + radius * Math.cos(angle); // X position on the circle
        const top = centerYPercent + radius * Math.sin(angle); // Y position on the circle
        await moveDrone(left, top, duration / steps); // Move drone step by step
    }
}

// Example usage: Move drone in a circle with a radius of 20% of the container width and center at (50%, 50%)
