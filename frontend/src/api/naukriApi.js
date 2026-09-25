import axiosClient from './axiosClient';

export async function runNaukriScrape(formValues) {
  const { data } = await axiosClient.post('/scrapers/naukri', formValues);
  return data;
}
