var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
function fetchData(url, marketName) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let finalURL = url;
            if (marketName) {
                const params = new URLSearchParams({
                    market: marketName,
                }).toString();
                finalURL = `${url}?${params}`;
            }
            const response = yield fetch(finalURL, { method: "GET" });
            return yield response.json();
        }
        catch (error) {
            console.warn(error instanceof Error ? error.message : error);
        }
    });
}
export default fetchData;
//# sourceMappingURL=fetchData.js.map