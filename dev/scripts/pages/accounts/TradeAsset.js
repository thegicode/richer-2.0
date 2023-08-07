function tradeAsset(asset) {
    const { balance, locked } = asset;
    const amount = Number(balance) + Number(locked);
    document.querySelector(".tradeState .value").textContent =
        Math.round(amount).toLocaleString();
}
export default tradeAsset;
//# sourceMappingURL=TradeAsset.js.map