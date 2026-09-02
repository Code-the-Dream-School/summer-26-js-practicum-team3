import { loadEnvFile as _loadEnvFile } from 'node:process';

export function loadEnvFile(path) {
  try {
    _loadEnvFile(path);
  } catch {
    // Allow a silent failure
  }
}
