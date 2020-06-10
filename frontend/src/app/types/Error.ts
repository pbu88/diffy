export interface Error {
  type: 'CLIENT_ERROR'|'SERVER_ERROR';
  text: string;
}
