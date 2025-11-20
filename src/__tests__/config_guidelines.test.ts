import { Config } from '../config';
import * as fs from 'fs';
import * as path from 'path';

jest.mock('fs');
jest.mock('path');
jest.mock('@actions/core', () => ({
  getInput: jest.fn().mockReturnValue(''),
  getMultilineInput: jest.fn().mockReturnValue([]),
  info: jest.fn(),
  warning: jest.fn(),
}));

describe('Config - Review Guidelines', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env = { ...originalEnv };
    process.env.GITHUB_TOKEN = 'test-token';
    process.env.LLM_API_KEY = 'test-api-key';
    process.env.LLM_MODEL = 'test-model';
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  test('loads review guidelines from file when it exists', () => {
    (path.join as jest.Mock).mockReturnValue('/mock/path/review-guideline.md');
    (fs.existsSync as jest.Mock).mockReturnValue(true);
    (fs.readFileSync as jest.Mock).mockReturnValue('Mock Guidelines Content');

    const config = new Config();
    config.loadInputs();

    expect(config.reviewGuidelines).toBe('Mock Guidelines Content');
    expect(fs.existsSync).toHaveBeenCalledWith('/mock/path/review-guideline.md');
  });

  test('does not load review guidelines when file does not exist', () => {
    (path.join as jest.Mock).mockReturnValue('/mock/path/review-guideline.md');
    (fs.existsSync as jest.Mock).mockReturnValue(false);

    const config = new Config();
    config.loadInputs();

    expect(config.reviewGuidelines).toBeUndefined();
  });
});
