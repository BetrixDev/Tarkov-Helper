export const round = (num: number, place: string): number => {
    return Math.round(num * Number(`1${place}`)) / Number(`1${place}`);
};

export const random = (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min) + min);
};

export const clamp = (num: number, min: number, max: number): number => {
    return Math.min(Math.max(num, min), max);
};

// https://github.com/the-hideout/tarkov-dev/blob/main/src/modules/flea-market-fee.js
export const calculateFleaFee = (basePrice: number, sellPrice: number, count = 1): number => {
    const V0 = basePrice;
    const VR = sellPrice;
    const Ti = 0.1;
    const Tr = 0.05;
    let P0 = Math.log10(V0 / VR);
    let PR = Math.log10(VR / V0);
    const Q = count;

    if (VR < V0) {
        P0 = Math.pow(P0, 1.08);
    }

    if (VR >= V0) {
        PR = Math.pow(PR, 1.08);
    }

    return Math.ceil(V0 * Ti * Math.pow(4, P0) * Q + VR * Tr * Math.pow(4, PR) * Q);
};
