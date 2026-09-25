import axiosClient from './axiosClient';

export async function runLinkedinScrape(formValues) {
  const { data } = await axiosClient.post('/scrapers/linkedin', formValues);
  return data;
}
