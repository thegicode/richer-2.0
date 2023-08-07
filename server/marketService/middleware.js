// 공통 요청 및 오류 처리 로직을 담당하는 미들웨어

const handleRequest = (fn) => {
    return async (req, res, next) => {
        try {
            const data = await fn();
            res.send(data);
        } catch (error) {
            next(error);
        }
    };
};

const handleError = (error, req, res, next) => {
    console.warn(error.message);
    res.status(500).send({ error: error.message });
};

module.exports = {
    handleRequest,
    handleError,
};
