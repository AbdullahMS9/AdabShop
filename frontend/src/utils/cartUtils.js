export const addDecimals = (num) => {
    return (Math.round(num * 100)/ 100).toFixed(2);
}

export const updateCart = (state) => {
    //Price calculations
    state.itemsPrice = addDecimals(state.cartItems.reduce((acc, item) => acc + (item.price * item.mL)/3 * item.qty, 0));

    state.shippingPrice = addDecimals(state.itemsPrice < 100 ? 10: 0);

    state.taxPrice = addDecimals(Number((0 * state.itemsPrice).toFixed(2))); //disabled until needed

    state.totalPrice = (
        Number(state.itemsPrice) +
        Number(state.shippingPrice) +
        Number(state.taxPrice)
    ).toFixed(2);

    localStorage.setItem('cart', JSON.stringify(state));
    
    return state;
}