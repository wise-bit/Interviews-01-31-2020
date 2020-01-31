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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const moment_1 = __importDefault(require("moment"));
const request = __importStar(require("request-promise"));
const keys_1 = require("./keys");
var url = require('url');
class Images {
    getDatesArray(query) {
        return __awaiter(this, void 0, void 0, function* () {
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
                totalString += '<br /> \n ... \n' + (yield this.getImageForDate(datesArray[i]));
            }
            return {
                timeline: totalString // + other
            };
        });
    }
    getImageForDate(date) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Get the date as a moment object
                const dateAsMoment = moment_1.default(date, 'YYYY-MM-DD');
                // Check that the date string is valid, and that the date is before or equal to today's date
                // moment() creates a moment with today's date
                if (!dateAsMoment.isValid() || dateAsMoment.isAfter(moment_1.default())) {
                    return undefined;
                }
                // Parses the response
                const parsed = yield this.imageGet(date);
                // Creates the return object
                const s = `{"date":"${parsed.date}","explanation":"${parsed.explanation}","media_type":"${parsed.media_type}","title":"${parsed.media_type}","url":"${parsed.url}"}`;
                return s;
            }
            catch (e) {
                return `There was an error retrieving the photo for this date. Make sure you have you api key properly setup`;
                // tslint:disable-next-line: no-console
                console.log(e);
            }
        });
    }
    /**
     * Gets multiple daily Nasa astronomy picture
     * @param date string with YYYY-MM-DD format
     */
    getImageUrls(date) {
        return __awaiter(this, void 0, void 0, function* () {
            // stores the links to all fo the URLs
            var urls = [];
            const dateArray = date.split(';');
            var sum = 0;
            for (var i = 0; i < dateArray.length; i++) {
                try {
                    // Get the date as a moment object
                    const dateAsMoment = moment_1.default(dateArray[i], 'YYYY-MM-DD');
                    // Check that the date string is valid, and that the date is before or equal to today's date
                    // moment() creates a moment with today's date
                    if (dateAsMoment.isValid() || !dateAsMoment.isAfter(moment_1.default())) {
                        // Parses the response
                        const parsed = yield this.imageGet(date);
                        // Creates the return object
                        urls.push(parsed.url);
                    }
                }
                catch (e) {
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
        });
    }
    /**
     * Makes the get request to the nasa api
     * @param date string with YYYY-MM-DD format
     */
    imageGet(date) {
        return __awaiter(this, void 0, void 0, function* () {
            // If there is a key set in the Keys file, use this key,
            // otherwise find it in the environment variables, this is for testing purposes
            const apiKey = keys_1.Keys.apiKey ? keys_1.Keys.apiKey : `${process.env.NASA_API}`;
            const resp = yield request.get(`https://api.nasa.gov/planetary/apod?date=${date}&api_key=${apiKey}`);
            return JSON.parse(resp);
        });
    }
}
exports.Images = Images;
//# sourceMappingURL=images.js.map