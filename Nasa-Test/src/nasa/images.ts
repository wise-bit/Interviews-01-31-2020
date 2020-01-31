import moment from 'moment';
import * as request from 'request-promise';
import { Keys } from './keys';

export interface IImage {
    date?: string;
    explanation?: string;
    media_type?: string;
    title?: string;
    url?: string;
    error?: string;
}

export class Images {

    /**
     * Gets multiple daily Nasa astronomy picture
     * @param date string with YYYY-MM-DD format
     */
    public string[] imageUrl(date: string[]): Promise<IDailyImage> {

        try {
            // Get the date as a moment object
            const dateAsMoment = moment(date, 'YYYY-MM-DD');
            // Check that the date string is valid, and that the date is before or equal to today's date
            // moment() creates a moment with today's date
            if (!dateAsMoment.isValid() || dateAsMoment.isAfter(moment())) {
                return undefined;
            }
            // Parses the response
            const parsed = await this.imageGet(date);
            // Creates the return object
            return {
                parsed.url
            };
        } catch (e) {
            return {
                error: `There was an error retrieving the photo for this date.
                Make sure you have you api key properly setup`
            };
            // tslint:disable-next-line: no-console
            console.log(e);
        }
    }

    /**
     * Makes the get request to the nasa api
     * @param date string with YYYY-MM-DD format
     */
    public async imageGet(date: string) {
        // If there is a key set in the Keys file, use this key,
        // otherwise find it in the environment variables, this is for testing purposes
        const apiKey = Keys.apiKey ? Keys.apiKey : `${process.env.NASA_API}`;
        const resp = await request.get(`https://api.nasa.gov/planetary/apod?date=${date}&api_key=${apiKey}`);
        return JSON.parse(resp);
    }

}
