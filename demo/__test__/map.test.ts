import { generateFieldsMap, generateQueryMap } from '../../src/maps';
import schema from '../server/schema/schema';


describe('generateQueryMap', () => {
  const queryMap = generateQueryMap(schema)
  console.log(queryMap);
  test('takes a GraphQL schema and returns object type', () => {
    expect(typeof queryMap).toBe('object');
  });

  test('returns all strings in values', () => {
    expect(Object.values(queryMap).every((el) => typeof el === 'string')).toBe(true);
  });

  test('takes a GraphQL schema and returns map from query names', () => {
    expect(JSON.stringify(generateQueryMap(schema))).toEqual(`{\"book\":\"Book\",\"books\":\"Book\",\"author\":\"Author\",\"authors\":\"Author\",\"booksByAuthor\":\"Book\",\"genres\":\"Genre\",\"booksByGenre\":\"Book\"}`)
  });
});

describe('generateFieldsMap', () => {
  const fieldMap = generateFieldsMap(schema);
  test('takes a GraphQL schema and returns object type', () => {
    expect(typeof generateFieldsMap(schema)).toBe('object');
  });

  test('each field has correct properties', () => {

    const propArray = ['name', 'description', 'type', 'args', 'resolve', 'subscribe', 'isDeprecated', 'deprecationReason', 'extensions', 'astNode'];

    for (const field in fieldMap) {
      for (const type in fieldMap.field) {
        for (const args in fieldMap.field.type) {
          for (const prop in propArray) {
            expect(args.hasOwnProperty(prop)).toBe(true);
          }
        }
      }
    }
  })
});
