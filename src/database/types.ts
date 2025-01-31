/**
 * This file was generated by kysely-codegen.
 * Please do not edit it manually.
 */

import type { ColumnType } from 'kysely';

export type Generated<T> =
  T extends ColumnType<infer S, infer I, infer U>
    ? ColumnType<S, I | undefined, U>
    : ColumnType<T, T | undefined, T>;

export interface Draft {
  id: Generated<number>;
  text: string;
  title: string;
}

export interface Gif {
  apiId: string | null;
  height: number | null;
  id: Generated<number>;
  url: string;
  width: number | null;
}

export interface Message {
  id: Generated<number>;
  sentAt: string;
  sprintId: number;
  templateId: number;
  text: string;
  userId: number;
}

export interface Sprint {
  id: Generated<number>;
  sprintCode: string;
  title: string;
}

export interface Template {
  id: Generated<number>;
  text: string;
  title: string;
}

export interface User {
  id: Generated<number>;
  username: string;
}

export interface DB {
  draft: Draft;
  gif: Gif;
  message: Message;
  sprint: Sprint;
  template: Template;
  user: User;
}
