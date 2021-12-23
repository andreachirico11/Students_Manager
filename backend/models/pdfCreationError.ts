import { PdfMessages } from './messageEnums';

export class PdfCreationErrorObj {
  constructor(public type: PdfMessages, public err: any) {}
}
