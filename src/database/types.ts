/**
 * This file was generated by kysely-codegen.
 * Please do not edit it manually.
 */

import type { ColumnType } from 'kysely';

export type Generated<T> =
  T extends ColumnType<infer S, infer I, infer U>
    ? ColumnType<S, I | undefined, U>
    : ColumnType<T, T | undefined, T>;

export interface Message {
  id: Generated<number>;
  sentAt: string;
  sprintId: number;
  templateId: number;
  userId: number;
}

export interface Sprint {
  id: Generated<number>;
  name: string;
}

export interface Template {
  id: Generated<number>;
  text: string;
  title: string;
}

export interface User {
  discordName: string;
  id: Generated<number>;
}

export interface DB {
  message: Message;
  sprint: Sprint;
  template: Template;
  user: User;
}
