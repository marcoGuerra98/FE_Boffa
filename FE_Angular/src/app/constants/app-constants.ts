export class AppConstants {
  static readonly API = {
    BASE_URL: 'http://localhost:8080',
    AUTH: {
      LOGIN: '/api/auth/login',
      LEGACY_LOGIN: '/login',
    },
    PLAYER: {
      GET_ALL: '/player/getAll'
    },
    ANAGRAFICA: {
      GET_ALL: '/anagrafica/getAll',
      INSERT: '/anagrafica/insertNewAnag',
    }
  } as const;

  static readonly STORAGE_KEYS = {
    TOKEN: 'token',
  } as const;

  static buildApiUrl(path: string): string {
    return `${this.API.BASE_URL}${path}`;
  }
}