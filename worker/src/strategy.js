// Strategy logic exactly as in original HTML

// Returns 'green' (BUY) or 'red' (SELL) or null
export function getPrediction(c1Color, c4Color, strategy) {
    if (strategy === 1) {
        // HYBRID
        if (c1Color === 'red' && c4Color === 'red') return 'red';
        if (c1Color === 'green' && c4Color === 'green') return 'green';
        if (c1Color === 'red' && c4Color === 'green') return 'red';
        if (c1Color === 'green' && c4Color === 'red') return 'green';
    } else {
        // TURBO (opposite)
        if (c1Color === 'red' && c4Color === 'red') return 'green';
        if (c1Color === 'green' && c4Color === 'green') return 'red';
        if (c1Color === 'red' && c4Color === 'green') return 'green';
        if (c1Color === 'green' && c4Color === 'red') return 'red';
    }
    return null;
}

// Convert color to direction string for display
export function colorToDirection(color) {
    return color === 'green' ? 'BUY' : 'SELL';
}

// Determine win/loss based on predicted color and actual color
export function evaluateTrade(predictedColor, actualColor) {
    return predictedColor === actualColor ? 'WIN' : 'LOSS';
}

// Switch strategy
export function switchStrategy(currentStrategy) {
    return currentStrategy === 1 ? 2 : 1;
}
