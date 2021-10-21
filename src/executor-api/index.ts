const api = {
    log(...args: any[]) {
        console.log.apply(this, args);
    }
};

export default api;