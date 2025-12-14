import redis from "../configs/redis.config"


const setNewRecord = async (key: string, data: any) => {
    const result = await redis.set(key, JSON.stringify(data), "EX", "300");
    console.log(">>> [setNewRecord]:", result);
    if ("OK" != result) {
        throw new Error("Redis set failed");
    }
    return result;
}

const extractRecord = async (key: string) => {
    let result = await redis.get(key);
    return result;
}

const deleteRecord = async (key: string) => {
    let result = await redis.del(key);
    console.log(">>> result:", result);
    return result;
};

export {
    setNewRecord,
    extractRecord,
    deleteRecord
}