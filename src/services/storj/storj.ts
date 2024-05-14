import axios from 'axios';
import FormData from 'form-data';

const { STORJ_API_USERNAME, STORJ_API_PASSWORD } = process.env;

const STORJ_API_URL = 'https://www.storj-ipfs.com';

const _client = () => axios.create({
  baseURL: `${STORJ_API_URL}/api/v0`,
  auth: { username: STORJ_API_USERNAME, password: STORJ_API_PASSWORD }
});

export const addJSON = async (json) => {
  const formData = new FormData();
  formData.append('path', Buffer.from(json, 'utf-8').toString());

  const headers = { 'Content-Type': 'multipart/form-data', ...formData.getHeaders() };

  const { data } = await _client().post('add', formData.getBuffer(), { headers });

  return data.Hash;
};

export const addFile = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  const headers = { 'Content-Type': `multipart/form-data; boundary= ${formData._boundary}` };

  const { data } = await _client().post(
    'add',
    formData,
    {
      headers,
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
    }
  );

  return data.Hash;
};

export const get = async (hash) => {
  const { data } = await axios.get(`${STORJ_API_URL}/ipfs/${hash}`);
  return data;
};


// only .png files are supported (this is what the seo/spaces endpoint in creator-portal does by default)
export const bucketImageLinkStorj = (id: string, bucket = "seo") => {
  const linkKey = bucket === "referrals" ? "jxjnhzuaz5wrox7k2qjvhcwcb5qq" : "jvxdv5ynbbikx455wrdynvc7tyhq";
  return `https://link.storjshare.io/raw/${linkKey}/${bucket}/${id}${id.endsWith(".png") ? "" : ".png"}`;
};