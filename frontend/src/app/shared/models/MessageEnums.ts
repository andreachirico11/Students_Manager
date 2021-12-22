export enum TokenErrors {
  'Invalid_token' = 'Invalid_token',
  'Token_not_found' = 'Token_not_found',
}

export enum UserMessages {
  'user_not_found' = 'user_not_found',
  'user_found' = 'user_found',
  'wrong_credentials' = 'wrong_credentials',
  'user_registered' = 'user_registered',
}

export enum ServerMessages {
  'creation_error' = 'creation_error',
  'fetch_error' = 'fetch_error',
  'update_error' = 'update_error',
  'delete_error' = 'delete_error',
}

export enum StudentMessages {
  'student_deleted' = 'student_deleted',
  'student_updated' = 'student_updated',
  'student_created' = 'student_created',
  'student_found' = 'student_found',
  'student_not_found' = 'student_not_found',
}

export enum ReceiptMessages {
  'receipt_deleted' = 'receipt_deleted',
  'receipt_updated' = 'receipt_updated',
  'receipt_created' = 'receipt_created',
  'receipt_found' = 'receipt_found',
  'receipt_not_found' = 'receipt_not_found',
}

export enum StatsError {
  'error_during_stats_generation' = 'error_during_stats_generation',
}

export enum PdfMessages {
  'err_during_pdf_creation' = 'err_during_pdf_creation',
  'err_pdf_fetching_data' = 'err_pdf_fetching_data',
  'err_pdf_ejs' = 'err_pdf_ejs',
  'err_pdf_sending' = 'err_pdf_sending',
  'err_in_pdf_req_params' = 'err_in_pdf_req_params',
  'blank_page_not_allowed' = 'blank_page_not_allowed',
  'teacher_or_student_not_found' = 'teacher_or_student_not_found',
}

export enum TeacherMessages {
  'teacher_not_found' = 'teacher_not_found',
}
