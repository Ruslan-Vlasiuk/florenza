/**
 * Whisper local wrapper — voice transcription on VPS.
 * Whisper installed via pip on Ubuntu, called via child_process.
 *
 * In dev (without whisper installed locally) — returns a stub.
 * In prod (VPS) — calls /usr/local/bin/whisper.
 */
import { exec, execFile } from 'child_process';
import { promisify } from 'util';
import fs from 'fs/promises';
import path from 'path';
import os from 'os';

const execAsync = promisify(exec);
const execFileAsync = promisify(execFile);

const VALID_LANG = /^[a-z]{2}$/;
const VALID_MODEL = new Set(['tiny', 'base', 'small', 'medium', 'large', 'large-v2', 'large-v3']);

export interface TranscribeRequest {
  audioBuffer: Buffer;
  mimeType?: string;
  language?: string;
}

export interface TranscribeResponse {
  text: string;
  durationSec?: number;
  isStub: boolean;
}

export async function transcribeVoice(req: TranscribeRequest): Promise<TranscribeResponse> {
  const whisperBin = process.env.WHISPER_BIN || '/usr/local/bin/whisper';
  const rawModel = process.env.WHISPER_MODEL || 'small';
  const rawLang = req.language || process.env.WHISPER_LANG || 'uk';
  // Hard input validation — prevents shell injection via lang/model.
  const model = VALID_MODEL.has(rawModel) ? rawModel : 'small';
  const lang = VALID_LANG.test(rawLang) ? rawLang : 'uk';

  // Check if whisper is available
  let whisperAvailable = false;
  try {
    await execAsync(`test -x ${whisperBin}`);
    whisperAvailable = true;
  } catch {
    whisperAvailable = false;
  }

  if (!whisperAvailable) {
    return {
      text: '[голосове повідомлення не транскрибовано — Whisper не встановлено на цьому хості]',
      isStub: true,
    };
  }

  const tmpDir = os.tmpdir();
  const tmpFile = path.join(tmpDir, `florenza-voice-${Date.now()}.ogg`);
  const tmpOutput = `${tmpFile}.txt`;

  try {
    await fs.writeFile(tmpFile, req.audioBuffer);
    // execFile (no shell) — args passed as array, no metacharacter interpretation.
    await execFileAsync(
      whisperBin,
      [tmpFile, '--model', model, '--language', lang, '--output_format', 'txt', '--output_dir', tmpDir],
      { timeout: 120_000 },
    );
    const text = await fs.readFile(tmpOutput, 'utf-8');
    return { text: text.trim(), isStub: false };
  } finally {
    await fs.unlink(tmpFile).catch(() => {});
    await fs.unlink(tmpOutput).catch(() => {});
  }
}
