"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const moment_1 = __importDefault(require("moment"));
const daily_image_1 = require("./nasa/daily-image");
const images_1 = require("./nasa/images");
var url = require('url');
const app = express_1.default();
app.use(express_1.default.json());
const port = 8002; // default port to listen
// define a route handler for the default home page
app.get('/', (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    response.send({});
}));
// Handle get requests to /nasa
app.get('/daily', (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const daily = new daily_image_1.DailyImage();
    // Sends in today's date as a formatted string
    const result = yield daily.getImageForDate(moment_1.default().format('YYYY-MM-DD'));
    // Sends back the result of the image getter
    response.send(result);
}));
// New page that deals with the input, parsing it here before sending it over to the function
app.get('/timeline', (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const imagesList = new images_1.Images();
        var url_parts = url.parse(request.url, true);
        var query = url_parts.query.dates;
        const result = yield imagesList.getDatesArray(query);
        console.log(typeof result);
        // const result = await imagesList.getImageForDate(queryFilter);
        response.send(result);
    }
    catch (err) {
        response.send('Bad input');
    }
}));
// start the Express server
app.listen(port, () => {
    // tslint:disable-next-line:no-console
    console.log(`server started at http://localhost:${port}`);
});
//# sourceMappingURL=index.js.map