import type { StorageEngine } from 'foca';
import type { CookieParseOptions, CookieSerializeOptions } from 'cookie';
import lzString from 'lz-string';
import cookie from 'cookie';

export interface CookieStorageOptions
  extends Omit<CookieSerializeOptions, 'encode' | 'httpOnly'> {
  /**
   * 数据是否需要压缩，默认：true
   */
  compress?: boolean;
}

const { compressToEncodedURIComponent, decompressFromEncodedURIComponent } =
  lzString;

/**
 * 持久化Cookie引擎，仅适用于浏览器
 * 注意：每个cookie的数据限制在4KB左右，不同浏览器也有差异，所以尽量只存储小量数据，比如登录token
 */
export class CookieStorage implements StorageEngine {
  protected readonly parseOptions: CookieParseOptions;
  protected readonly serializeOptions: CookieStorageOptions;

  constructor(options: CookieStorageOptions = {}) {
    const compress = options.compress !== false;

    this.serializeOptions = Object.assign(
      <CookieStorageOptions>{
        compress: true,
        sameSite: true,
        path: '/',
      },
      options,
      <CookieSerializeOptions>{
        httpOnly: false,
        encode: (state) =>
          compress
            ? compressToEncodedURIComponent(state)
            : encodeURIComponent(state),
      },
    );

    this.parseOptions = {
      decode: (state) =>
        compress
          ? decompressFromEncodedURIComponent(state)!
          : decodeURIComponent(state),
    };
  }

  getItem(key: string): Promise<string | null> {
    return Promise.resolve(this.getParsedCookie()[key] || null);
  }

  setItem(key: string, value: string): Promise<any> {
    return Promise.resolve(this.setCookie(key, value, this.serializeOptions));
  }

  removeItem(key: string): Promise<any> {
    return Promise.resolve(
      this.setCookie(
        key,
        null,
        Object.assign({}, this.serializeOptions, <CookieSerializeOptions>{
          expires: new Date(0),
          maxAge: void 0,
        }),
      ),
    );
  }

  clear(): Promise<any> {
    return Promise.all(
      Object.keys(this.getParsedCookie()).map((key) => this.removeItem(key)),
    );
  }

  protected setCookie(
    key: string,
    value: string | null,
    options: CookieStorageOptions,
  ): any {
    document.cookie = cookie.serialize(
      key,
      value === null ? '' : value,
      options,
    );
  }

  protected getParsedCookie(): Record<string, string> {
    return cookie.parse(document.cookie, this.parseOptions);
  }
}

export const cookieStorage = new CookieStorage();
