{
    const accountsModule = require("./accounts");
    // const marketsModule = require("./markets");
    // const candlesMinutesModule = require("./candlesMinutes");
    // const candlesDaysModule = require("./candlesDays");
    // const tickersModule = require("./tickers");

    // const markets = () => {
    //     try {
    //         return marketsModule();
    //     } catch (err) {
    //         console.error(err);
    //     }
    // };

    // const candlesMinutes = (query) => {
    //     try {
    //         return candlesMinutesModule(query);
    //     } catch (err) {
    //         console.error(err);
    //     }
    // };

    // const candlesDays = (query) => {
    //     try {
    //         return candlesDaysModule(query);
    //     } catch (err) {
    //         console.error(err);
    //     }
    // };

    const accounts = async () => {
        try {
            return await accountsModule();
        } catch (err) {
            console.error(err);
        }
    };

    // const tickers = () => {
    //     try {
    //         return tickersModule();
    //     } catch (err) {
    //         console.error(err);
    //     }
    // };

    module.exports = {
        // markets,
        // candlesMinutes,
        // candlesDays,
        accounts,
        // tickers,
    };
}
