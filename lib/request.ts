export const postRequest = async (props: { url: string, body: Record<string, any>, overwriteUrl?: boolean, options?: {} }) => {
  try {
    const { url, body, options, overwriteUrl } = props;
    const resp = await fetch((overwriteUrl ? '' : process.env.NEXT_PUBLIC_APP_URL) + url, {
      method: 'POST',
      body: JSON.stringify(body),
      ...options
    });
    return await resp.json();
  } catch (error) {
    return error;
  }
}

export const putRequest = async (props: { url: string, body: Record<string, any>, overwriteUrl?: boolean, options?: {} }) => {
  try {
    const { url, body, options, overwriteUrl } = props;
    const resp = await fetch((overwriteUrl ? '' : process.env.NEXT_PUBLIC_APP_URL) + url, {
      method: 'PUT',
      body: JSON.stringify(body),
      ...options
    });
    return await resp.json();
  } catch (error) {
    return error;
  }
}

export const deleteRequest = async (props: { url: string, overwriteUrl?: boolean, options?: {} }) => {
  try {
    const { url, options, overwriteUrl } = props;
    const resp = await fetch((overwriteUrl ? '' : process.env.NEXT_PUBLIC_APP_URL) + url, {
      method: 'DELETE',
      ...options
    });
    return await resp.json();
  } catch (error) {
    return error;
  }
}

export const fetcher = (url: string) => fetch(url).then(r => r.json());
