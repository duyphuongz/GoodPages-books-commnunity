import redis from "../configs/redis.config"


const setNewRecord = async (key: string, data: any) => {
    const result = await redis.set(key, data, "EX", "300");
    console.log(">>> [setNewRecord]:", result);
    return result;
}

const extractRecord = async (key: string) => {
    let result = await redis.get(key);
    return result;
}

export {
    setNewRecord,
    extractRecord
}