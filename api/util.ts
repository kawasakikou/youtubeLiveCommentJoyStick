import fetch, { RequestInit, Response } from 'node-fetch';


export const fetchWrap = async <T>(input: URL, init?: RequestInit): Promise<T> => {
  const res = await fetch(input.toString(), init);
  if(!res.ok) {
    console.log(res);
    throw new Error('error');
  }

  return res.json().catch(() => ({}))
};
