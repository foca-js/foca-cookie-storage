import LZString from 'lz-string';
import { CookieStorage, cookieStorage } from '../src';

beforeEach(() => {
  cookieStorage.clear();
});

afterEach(() => {
  cookieStorage.clear();
});

test(`Get and set data`, async () => {
  expect(document.cookie).not.toMatch('test1');

  await expect(cookieStorage.getItem('test1')).resolves.toBeNull();
  await cookieStorage.setItem('test1', 'yes');
  await expect(cookieStorage.getItem('test1')).resolves.toBe('yes');

  expect(document.cookie).toMatch(
    'test1=' + LZString.compressToEncodedURIComponent('yes'),
  );
});

test(`Update data`, async () => {
  await cookieStorage.setItem('test2', 'yes');
  await expect(cookieStorage.getItem('test2')).resolves.toBe('yes');
  await cookieStorage.setItem('test2', 'no');
  await expect(cookieStorage.getItem('test2')).resolves.toBe('no');

  expect(document.cookie).toMatch(
    'test2=' + LZString.compressToEncodedURIComponent('no'),
  );
});

test(`Delete data`, async () => {
  await cookieStorage.setItem('test3', 'yes');
  await expect(cookieStorage.getItem('test3')).resolves.toBe('yes');
  await cookieStorage.removeItem('test3');
  await expect(cookieStorage.getItem('test3')).resolves.toBeNull();

  expect(document.cookie).not.toMatch('test3');
});

test(`Clear all data`, async () => {
  await cookieStorage.setItem('test4', 'yes');
  await cookieStorage.setItem('test5', 'yes');

  await cookieStorage.clear();

  await expect(cookieStorage.getItem('test4')).resolves.toBeNull();
  await expect(cookieStorage.getItem('test5')).resolves.toBeNull();

  expect(document.cookie).not.toMatch('test4');
  expect(document.cookie).not.toMatch('test5');
});

test('Do not compress data', async () => {
  const storage = new CookieStorage({ compress: false });
  await storage.setItem('test4', 'yes');
  await expect(storage.getItem('test4')).resolves.toBe('yes');
  expect(document.cookie).toMatch('test4=yes');
});
