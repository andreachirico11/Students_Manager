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

export enum StatsMessage {
  'stats_correctly_generated' = 'stats_correctly_generated',
}

export enum StatsError {
  'error_during_stats_generation' = 'error_during_stats_generation',
}
