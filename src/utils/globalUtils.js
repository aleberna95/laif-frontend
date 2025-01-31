export function getCurrencySymbol(currency) {
    return new Intl.NumberFormat('en', {
        style: 'currency',
        currency,
    })
        .formatToParts(0)
        .find(part => part.type === 'currency')?.value || currency;
}
