export function capitalizeWords(string: string): string {
    return string
        .split(" ")
        .map((word) => {
            return word[0].toUpperCase() + word.substring(1);
        })
        .join(" ");
}

export function formatNumber(num: number): string {
    return String(num)
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function formatPrice(price: number | string, source?: string): string {
    if (source === "peacekeeper" || source === "Peacekeeper") {
        return new Intl.NumberFormat("en-EN", {
            style: "currency",
            currency: "USD",
            maximumSignificantDigits: 6
        }).format(Number(price));
    } else {
        return new Intl.NumberFormat("en-EN", {
            style: "currency",
            currency: "RUB",
            maximumSignificantDigits: 6
        })
            .format(Number(price))
            .replace("RUB", "₽")
            .replace(" ", "");
    }
}
