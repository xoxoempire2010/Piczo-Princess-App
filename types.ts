export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export enum AppState {
  DASHBOARD = 'DASHBOARD',
  DIARY = 'DIARY',
  BIO_GENERATOR = 'BIO_GENERATOR',
  SCRAPBOOK = 'SCRAPBOOK',
}

export interface SparkleType {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
}

export interface Friend {
  id: number;
  name: string;
  avatar: string;
}

export interface ScrapbookItem {
  id: number;
  img: string;
  caption: string;
  rotate: string;
  tapeColor: string;
  date: string;
}