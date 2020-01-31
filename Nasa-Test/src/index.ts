import express from 'express';
import moment from 'moment';
import { DailyImage } from './nasa/daily-image';
import { Images } from './nasa/images';

var url = require('url');

const app = express();
app.use(express.json());
const port = 8002; // default port to listen

// define a route handler for the default home page
app.get( '/', async ( request: any, response: any ) => {
    response.send({});
} );

// Handle get requests to /nasa
app.get( '/daily', async ( request: any, response: any ) => {
    const daily = new DailyImage();
    // Sends in today's date as a formatted string
    const result = await daily.getImageForDate(moment().format('YYYY-MM-DD'));
    // Sends back the result of the image getter
    response.send(result);
} );

// New page that deals with the input, parsing it here before sending it over to the function
app.get( '/timeline', async ( request: any, response: any ) => {
	try {
		const imagesList = new Images();

		var url_parts = url.parse(request.url, true);
		var query = url_parts.query.dates;

		const result = await imagesList.getDatesArray(query);
		console.log(typeof result);
		// const result = await imagesList.getImageForDate(queryFilter);
    	response.send(result);

	} catch (err) {
		response.send('Bad input');
	}
} );

// start the Express server
app.listen( port, () => {
    // tslint:disable-next-line:no-console
    console.log( `server started at http://localhost:${ port }` );
} );
