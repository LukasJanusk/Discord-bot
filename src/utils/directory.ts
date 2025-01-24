import * as path from 'path';

export const getCurrentDir = (importMetaUrl: string) => {
  const url = new URL(importMetaUrl);
  return path.dirname(url.pathname);
};
