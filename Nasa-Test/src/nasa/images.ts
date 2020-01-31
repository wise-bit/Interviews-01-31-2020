import moment from 'moment';
import * as request from 'request-promise';
import { Keys } from './keys';
import { DailyImage } from './daily-image';

var url = require('url');

export interface IImage {
    finalArray?: string;
    datesArray?: string;
    timeline?: string;
}

/**
This class handles multiple date queries
*/
export class Images {

    public async getDatesArray(query: string): Promise<IImage> {

        // string 
        // const urlParams = new URLSearchParams(url);
        // const filteredURL = urlParams.toString();

        var filteredURL = query;

        // Removes quotation marks from query
        filteredURL = filteredURL.split('"').join('');
        console.log(filteredURL);

        var datesArray = filteredURL.split(',');

        var totalString = '';

        for (var i = 0; i < datesArray.length; i++) {
            totalString += '<br /> \n  \n' + await this.getImageForDate(datesArray[i]);
        }

        return {
            timeline: totalString
        };

    }

    public async getImageForDate(date: string): Promise<string> {

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
            const s = `{"date":"${parsed.date}","explanation":"${parsed.explanation}","media_type":"${parsed.media_type}","title":"${parsed.media_type}","url":"${parsed.url}"}`;
            return s;



        } catch (e) {
            return `There was an error retrieving the photo for this date. Make sure you have you api key properly setup`;
            // tslint:disable-next-line: no-console
            console.log(e);
        }

    }


    /**
     * Gets multiple daily Nasa astronomy picture
     * @param date string with YYYY-MM-DD format
     */
    public async getImageUrls(date: string): Promise<IImage> {

        // stores the links to all fo the URLs
        var urls = [];

        const dateArray = date.split(';');

        var sum = 0;
        for (var i = 0; i < dateArray.length; i++) {

            try {
                // Get the date as a moment object
                const dateAsMoment = moment(dateArray[i], 'YYYY-MM-DD');
                // Check that the date string is valid, and that the date is before or equal to today's date
                // moment() creates a moment with today's date
                if (dateAsMoment.isValid() || !dateAsMoment.isAfter(moment())) {
                    // Parses the response
                    const parsed = await this.imageGet(date);
                    // Creates the return object
                    urls.push(parsed.url);
            }
            
            } catch (e) {
                // return {
                //     error: `There was an error retrieving the photo for this date.
                //     Make sure you have you api key properly setup and the input is formatted properly`
                // };
                // tslint:disable-next-line: no-console
                console.log(e);
            }

        } 

        var stringed = urls.toString();

        return {
            finalArray: stringed
        };

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
