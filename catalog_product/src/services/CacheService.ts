class CacheService {
    static cache:any = {};
    static cacheExpiry = 5 * 60 * 1000;
    static updateCache(key:any, value:any) {
        this.cache[key] = {
            data: value,
            timestamp: Date.now(),
        };
    }

    static getFromCache(key:any) {
        const cachedData = this.cache[key];
        return cachedData && (Date.now() - cachedData.timestamp) < this.cacheExpiry
            ? cachedData.data
            : null;
    }
}

export default CacheService;
