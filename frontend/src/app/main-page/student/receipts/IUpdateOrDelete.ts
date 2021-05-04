export interface IupdateOrDeleteEvent {
  type: updateOrDelete;
  id: string;
}

export type updateOrDelete = 'update' | 'delete';
