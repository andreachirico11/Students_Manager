import { CreateOptions } from 'html-pdf';

export const TEMPORARY_PDF_NAME = 'temp.pdf';

export const fileOptions: CreateOptions = {
  format: 'A4',
  orientation: 'portrait',
  border: {
    top: '50px',
    bottom: '50px',
  },
};
