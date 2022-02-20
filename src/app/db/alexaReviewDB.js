const fs = require('fs');
const readline = require('readline');
const path = require('path');
class AlexaReviewDB {
    constructor() {
        this.dataStore = [];
        this.rl = readline.createInterface({
            input: fs.createReadStream(path.join(__dirname, 'alexa.json')),
            output: process.stdout,
            terminal: false
        })
        // this.connect();
    }

    connect() {
        return new Promise((resolve, reject) => {
            // it has already data then return it
            if(this.dataStore.length > 0 ) return resolve(this.dataStore);

            this.rl.on('line', (line) => {
                this.dataStore.push(JSON.parse(line));
            })
            
            this.rl.on('pause', () => {
                console.log('Data Migration in progress...')
            })
            
            this.rl.on('close', () => { 
                console.log('jsonData store - Data Sorting inprogress...');
                this.dataStore = this.dataStore.sort((a, b) => {
                    return (a.reviewed_date < b.reviewed_date) ? -1 : ((a.reviewed_date > b.reviewed_date) ? 1 : 0)
                }).map((s, i) => { s.id = i; return s; }) // order by date descending
                resolve(this.dataStore);
            })    
        })
    }

    readRecord(id) {
        if(id) return this.dataStore[id];
        else return this.dataStore;
    }

    saveRecord(rc) {
        this.dataStore.push(rc)
        return rc;
    }

    getNextSeqId(){
        return this.dataStore.length;
    }

    getTotal() {
        return this.dataStore.length;
    }

    async insert(data) {
        try {
            const id = this.getNextSeqId();
            const rc = {id, ...data};
            let result = this.saveRecord(rc);  // For easy mocking
            // this.dataStore.push(rc);
            return result;
        } catch(e) {
            throw(e)
        }
    }

    async select(filter = {}) {
        try {
            let dataObj = this.readRecord(), dateLen=0, itemSlicedDate = '';
            if(filter) {
                if(filter['reviewed_date']) {
                    dateLen = filter['reviewed_date'].length;
                }
                // iterate all items to fetch based on filter condition
                let rs = dataObj.filter((item) => {
                    if(dateLen > 0) {
                        if (typeof item['reviewed_date'] === 'object') { 
                            item['reviewed_date'] = item['reviewed_date'].toISOString(); 
                        }
                        itemSlicedDate = item['reviewed_date'].slice(0, dateLen);  
                    }
                    // execute all filters per item
                    return Object.entries(filter).every(([k,v]) => {
                        if(k === 'reviewed_date' && dateLen > 0) {
                            return itemSlicedDate === v;
                        } else {
                            return item[k] === v;
                        }
                    })
                });
                return rs;
            }
            return dataObj;
        } catch(e) { 
            throw(e)
        }
    }

    selectByIndex(id) {
        const data = this.readRecord(id);
        let item = (data? [data] : [])
        return item;
    }

}

module.exports = new AlexaReviewDB();