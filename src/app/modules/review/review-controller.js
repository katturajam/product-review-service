
const reviewModel = require('./review-model');
class reviewController {
    constructor() {
        
    }

    async listReview(request, reply) {
        try {
            let listSchema = {
                // "schemas": ["urn:scim:schemas:core:1.0"],
                "totalResults": 0,
                "itemsPerPage": 25,
                "startIndex": 1,
                "Resources": []
            }; 
            
            let rs = await reviewModel.listReview(request.query);
            listSchema.totalResults = rs.length; //Updating Total Result Count
            let [startPosition, endPosition] = [(listSchema.totalResults - listSchema.itemsPerPage ), rs.length];
            let list = rs.slice(startPosition, endPosition).reverse(); // Descending order by date  
            const locationUrl = request.server.info.uri + request.path;
            listSchema.Resources = prepareReviewList(list, locationUrl);
            return reply(listSchema).type('application/json');
        } catch(e) {
            console.error(e);
            return reply("Internal Server Error").code(500);        
        }
    }

    async createReview(request, reply) {
        try {
            let data = request.payload;
            if(!data.date) data.date = new Date().toISOString();
            let rs = reviewModel.createReview(data);
            return reply(rs)
                        .code(200)
                        .type('application/json');
        } catch(e) {
            console.e('createReview:', e);
            return reply("Internal Server Error").code(500);
        }
    }

    async getReviewDetail(request, reply) {
        try {
            let data = reviewModel.reviewDetails(request.params.review_id);
            let resPayload = data.length > 0 ? data[0] : { statusCode: 404, message: 'Resource not found!' };
            return reply( resPayload)
                    .code(data.length > 0 ? 200 : 404)
                    .type('application/json');
        } catch(e) {
            console.log('getReviewDetail:', e);
            return reply("Internal Server Error").code(500);
        }
    }

    async getRatingStats(request, reply) {
        try {
            /*** bof :: Fetch All rating based on all rating categories ***/
            let minRating=0, maxRating=5, promisesOfReviewList=[]; //Ascending Order of Rating
            let filter = {...request.query};
            while(minRating < maxRating && ++minRating) {
                filter.rating = minRating ; //adding range of rating
                const promiseReviewList = reviewModel.listReview(filter);
                promisesOfReviewList.push(promiseReviewList);
            }
            let listOfReviewCategory = await Promise.allSettled(promisesOfReviewList);
            /*** eof :: Fetch All rating based on all rating categories ***/

            /*** bof :: Calculate Review Category Wise Stats ***/
            let promisesOfRatingStat = [], countOfCategory = listOfReviewCategory.length; //Desecending Order - Resolving Highest Rating Firts
            while(countOfCategory-- && countOfCategory >= 0 && listOfReviewCategory[countOfCategory].status === 'fulfilled') {
                    if(listOfReviewCategory[countOfCategory].value.length > 0) {
                        const rating = listOfReviewCategory[countOfCategory].value[0]['rating'];
                        let stats = sumOfReview(rating, listOfReviewCategory[countOfCategory].value);
                        promisesOfRatingStat.push(stats);
                    }
            }
            let categoryStats = await Promise.all(promisesOfRatingStat);
            /*** eof :: Calculate Review Category Wise Stats ***/

            /*** bof :: Calculate Average Rating ***/
            let data = avgRating(categoryStats);
            /*** eof :: Calculate Average Rating ***/
            return reply(data)
                    .code(200)
                    .type('application/json');
            } catch(e) {
                console.error('getRatingStats', e);
                return reply("Internal Server Error").code(500);
            }
    }
}
exports.reviewController = reviewController;

function prepareReviewList(reviews, originUrl) {
    let Resources = [];
    for(let item of reviews) {
        //const recordIndex  = item.id === 1 ? 0 : item.id - 1;
        let meta = {
            id: item.id,
            rating: item.rating,
            store: item.review_source,
            date: item.reviewed_date, 
            location: `${originUrl}/${item.id}`
            // resourceType: 'AlexaReview'
        }
        Resources.push(meta);
    }
    return Resources;
}

async function sumOfReview(rating, listOfReview) {
    try {
        let totalReview = listOfReview.length, totalRating = 0;
        totalRating = (rating * totalReview);
        return { rating, totalReview,  totalRating };
    } catch(e) {
        console.error('sumOfReview:', e);
        throw(e)
    }
}

function avgRating(categories = []) {
    let netReview=0, netRating=0, averageRating=0;
    for(c of categories) {
        netReview += c.totalReview;
        netRating += c.totalRating;
    }
    let avg = (netRating/netReview).toPrecision(2);
    averageRating = isNaN(avg) ?  0 : parseFloat(avg);
    return { netReview, netRating, averageRating, category: categories };
}
