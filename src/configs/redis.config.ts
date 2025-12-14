import Redis from 'ioredis';


const redis = new Redis({
    host: "redis",
    port: 6379,
    password: undefined
})

export default redis;