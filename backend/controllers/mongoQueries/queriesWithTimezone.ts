export class QueriesWithTimezone {
  private _timezoneOffset: string;

  get timezoneOffset() {
    return this._timezoneOffset;
  }

  constructor(strOffset?: string) {
    if (strOffset && new RegExp(/[+-]\d\d:\d\d/, 'g').test(strOffset)) {
      this._timezoneOffset = strOffset;
    } else {
      this._timezoneOffset = '+00:00';
    }
  }
}
