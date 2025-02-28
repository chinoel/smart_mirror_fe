import axios from 'axios';
import * as cheerio from 'cheerio';

export async function fetchMealData(): Promise<any> {
    try {
        const url = 'https://www.kyungnam.ac.kr';
        const meta = '/dorm/8736/subview.do';

        const response = await axios.get(url + meta);
        const html = response.data;
        const $ = cheerio.load(html);
        const firstPostLink = $('table.board-table.horizon1 tbody tr')
            .filter((i, el) => $(el).find('a').text().includes('주간식단'))
            .first()
            .find('a')
            .attr('href');

        const postResponse = await axios.get(url + firstPostLink);
        console.log(url + firstPostLink);
        const postHtml = postResponse.data;
        const $$ = cheerio.load(postHtml);
        const imageUrl = $$('img').attr('src');

        return { imageUrl };

    } catch (error) {
        console.error('Error fetching meal data:', error);
        throw error;
    }
}