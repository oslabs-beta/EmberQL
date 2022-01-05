import redis from 'redis';

export class EmberCache {
  redisCache: redis.RedisClientType;
  evictionStrategy: string;
  ttl: number;
  volatile: boolean;

  constructor(redisCache: redis.RedisClientType, ttl = 36000) {
    this.redisCache = redisCache;
    this.ttl = 36000;
    this.evictionStrategy = this.getEvictionPolicy();
    this.volatile;
  }

  init = async () => {
    if (this.evictionStrategy === undefined) {
      const policy = await this.getEvictionPolicy();
      this.evictionStrategy = policy;
    }
    if (this.volatile === undefined)
      return this.evictionStrategy.slice(0, 8) === 'eviction';
  };

  getEvictionPolicy = (): string => {
    let policy: string;
    this.redisCache.configGet('maxmemory-policy').then((data) => {
      policy = data['maxmemory-policy'];
    });
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

  write = async (key: string) => {};
  //what will be fields in hash?
  readHash = async (key: string, fields: Array<string>) => {
    const output = {};
    const response = await this.redisCache.hmGet(key, fields);
    if (response.length !== 0 && this.volatile) this.increaseTTL(key);
    return response;
  };

  makeObjFromRedisResponse = (array: Array<any>) => {
    const result = {};
    for (let i = 0; i < array.length; i = i + 2) {
      result[array[i]] = array[i + 1];
    }
    return result;
  };

  writeHash = async (responseObj: { [key: string]: any }) => {
    for (const field in responseObj) {
      const obj: { [key: string]: any } = responseObj[field];
      for (const key in obj) {
        if (typeof obj[key] === 'object') {
          obj[`${key}:__ref`] = JSON.stringify(obj[key]['__ref']);
          obj[key] = '__ref';
        }
      }
      this.redisCache.hSet(field, obj);
    }
  };

  getCachedAndNormalize = async (keys: string[], queryFields: any) => {
    const normalizedObj = {};
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      const fieldsToKeep = [...queryFields[key]];
      const response = await this.readHash(key, fieldsToKeep);
      // need to break maybe?
      if (response.length === 0) return;
      const subObj = {};
      const keysWithRefs = [];
      for (let j = 0; j < response.length; j++) {
        subObj[fieldsToKeep[j]] = response[j];
        if (response[j] === '__ref') keysWithRefs.push(response[j]);
      }

      if (keysWithRefs.length > 0) {
        for (const refKey of keysWithRefs) {
          const refs = await this.redisCache.hmGet(key, `${refKey}:__ref`); // genre:__ref
          const refList = JSON.parse(refs[0]);
          if (refList.length === 1) {
            subObj[refKey] = await this.getCachedAndNormalize(
              [refList[0]],
              queryFields[refList[0]]
            );
          } else {
            subObj[refKey] = refList.map(
              async (key) =>
                await this.getCachedAndNormalize(key, queryFields[key])
            );
          }
        }
      }
      normalizedObj[key] = subObj;
    }
    return normalizedObj;
  };
  async increaseTTL(key: string) {
    const currentTTL = await this.redisCache.ttl(key);
    // ttl time is in seconds
    await this.redisCache.EXPIRE(key, currentTTL + this.ttl);
  }
}
