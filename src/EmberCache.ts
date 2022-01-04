import redis from 'redis';

export class EmberCache {
  redisCache: redis.RedisClientType;
  evictionStrategy: string;
  ttl: number;
  volatile: boolean;

  constructor(redisCache: redis.RedisClientType, ttl = 36000) {
    this.redisCache = redisCache;
    this.ttl = 36000;
    this.evictionStrategy;
    this.volatile;
  }

  init = async () => {
    if (this.evictionStrategy === undefined) {
      const policy = this.getEvictionPolicy;
      this.evictionStrategy = policy;
    }
    if (this.volatile === undefined)
      return this.evictionStrategy.slice(0, 8) === 'eviction';
  };

  getEvictionPolicy = async (): Promise<string> => {
    const policy: string = await this.redisCache.configGet('maxmemory-policy')[
      'maxmemory-policy'
    ];
    return policy;
  };

  databaseDown = async (): Promise<void> => {
    await this.redisCache.configSet('maxmemory-policy', 'noeviction');
  };

  databaseRestored = async (): Promise<void> => {
    await this.redisCache.configSet('maxmemory-policy', this.evictionStrategy);
  };

  read = async (key: string) => {
    const response = await this.redisCache.get(key);
    if (response !== 'null' && this.volatile) this.increaseTTL(key);
    return response;
  };

  //what will be fields in hash?
  readHash = async (key: string) => {
    const response = await this.redisCache.hGet(key);
    if (response !== 'null' && this.volatile) this.increaseTTL(key);
    return response;
  };

  async increaseTTL(key: string) {
    const currentTTL = await this.redisCache.ttl(key);
    // ttl time is in seconds
    await this.redisCache.EXPIRE(key, currentTTL + this.ttl);
  }
}
