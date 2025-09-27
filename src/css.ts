import { css, cx, keyframes, Style } from "hono/css";
export const globalStyles = `
  :root {
    --bg-color: #ffffff;
    --text-color: #1a1a1a;
    --primary-color: #4f46e5;
    --hover-color: #4338ca;
  }

  @media (prefers-color-scheme: dark) {
    :root {
      --bg-color: #1a1a1a;
      --text-color: #ffffff;
      --primary-color: #818cf8;
      --hover-color: #6366f1;
    }
  }

  body {
    margin: 0;
    padding: 0;
    font-family: system-ui, -apple-system, sans-serif;
    background: var(--bg-color);
    color: var(--text-color);
  }
`;

export const container = css`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 1rem;
  text-align: center;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

export const title = css`
  font-size: 2.5rem;
  margin-bottom: 1.5rem;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

export const description = css`
  font-size: 1.2rem;
  line-height: 1.6;
  margin-bottom: 2rem;
  color: var(--text-color);

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

export const button = css`
  display: inline-block;
  background-color: var(--primary-color);
  color: white;
  padding: 0.8rem 1.5rem;
  border-radius: 0.5rem;
  text-decoration: none;
  font-weight: 500;
  transition: background-color 0.2s;

  &:hover {
    background-color: var(--hover-color);
  }
`;

export const tokenContainer = css`
  margin: 2rem auto;
  max-width: 600px;
`;

export const tokenBox = css`
  background: var(--bg-color);
  border: 1px solid var(--text-color);
  border-radius: 0.5rem;
  padding: 1rem;
  margin: 1rem 0;
  position: relative;
  word-break: break-all;
  font-family: monospace;
`;

export const copyButton = css`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: 0.25rem;
  padding: 0.25rem 0.5rem;
  cursor: pointer;
  font-size: 0.875rem;

  &:hover {
    background: var(--hover-color);
  }
`;

export const details = css`
  margin-top: 1rem;
  color: var(--text-color);

  & summary {
    cursor: pointer;
    color: var(--primary-color);
  }

  & p {
    margin: 0.5rem 0;
    font-size: 0.9rem;
  }
`;
