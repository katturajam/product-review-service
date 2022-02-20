const reviewDb = require('../../db/alexaReviewDB');
class reviewModel {
    constructor() {}

    async createReview({ store: review_source, date: reviewed_date, ...rest } = data) {
        try {
            const review = { review_source, reviewed_date, ...rest};
            let rs = await reviewDb.insert(review);
            return rs;
        } catch(e) {
            throw(e)
        }
    }

    async listReview(queryFilter) {
        try {
            /*** bof :: Query String Filter Internal Key Mapping ***/
            const queryKeyMapping = {
                'store': 'review_source',
                'date': 'reviewed_date'
            }
            
            for(let filter in queryFilter) {
                if(queryKeyMapping[filter]) {
                    const keyAlias = queryKeyMapping[filter];
                    // value stored into internal key alias
                    queryFilter[keyAlias] =  queryFilter[filter];
                    // end user query key deleted
                    delete queryFilter[filter];
                }  
            }
            /*** bof :: Query String Filter Internal Key Mapping ***/
            let rs = await reviewDb.select(queryFilter);
            return rs;
            
        } catch(e) {
            throw(e)
        }
    }

    reviewDetails = (id) => reviewDb.selectByIndex(id)
}

module.exports = new reviewModel();