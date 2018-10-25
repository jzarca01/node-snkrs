const axios = require('axios');
const moment = require('moment');

class Snkrs {
    constructor() {
        this.request = axios.create({
            baseURL: 'https://api.nike.com',
            headers: {
                'x-nike-caller-id': 'nike:sneakrs:ios:3.5',
            }
        });
    }

    setAccessToken(accessToken) {
        this.request.defaults.headers.common['Authorization'] = '';
        delete this.request.defaults.headers.common['Authorization'];

        this.request.defaults.headers.common[
            'Authorization'
        ] = `Bearer ${accessToken}`;
    }

    async getSneakers() {
        try {
            const sneakers = await this.request({
                method: 'GET',
                url: '/exp_snkrs/content/v1/',
                params: {
                    country: 'FR',
                    language: 'fr',
                    orderBy: 'published'
                },
                headers: {
                    'Authorization': `Bearer (null)`
                },
                responseType: 'json'
            })
            return sneakers.data
        } catch (err) {
            console.log('error with getSneakers', err)
        }
    }

    async getUpcomingSneakers() {
        try {
            const sneakers = await this.getSneakers()
            return sneakers.threads.filter(sneaker => {
                const fixedSellDate = sneaker.product.startSellDate && moment(sneaker.product.startSellDate).isSameOrAfter(new Date(), 'day')
                const estimatedSellDate = sneaker.product.estimatedSellDate && moment(sneaker.product.estimatedSellDate).isSameOrAfter(new Date(), 'day')
                return fixedSellDate || estimatedSellDate
            })
        }
        catch(err) {
            console.log('error with getUpcomingSneakers', err)
        }
    }

    async getSneakerDetails(productId) {
        try {
            const sneakers = await this.request({
                method: 'GET',
                url: '/launch/launch_views/v2',
                params: {
                    filter: `productId(${productId})`
                },
                headers: {
                    'Authorization': `Bearer (null)`
                },
                responseType: 'json'
            })
            return sneakers.data
        } catch (err) {
            console.log('error with getSneakerDetails', err)
        }
    }

    async getSneakerSKU(productId) {
        try {
            const sneakers = await this.request({
                method: 'GET',
                url: '/deliver/available_skus/v1',
                params: {
                    filter: `productIds(${productId})`
                },
                headers: {
                    'Authorization': `Bearer (null)`
                },
                responseType: 'json'
            })
            return sneakers.data
        } catch (err) {
            console.log('error with getSneakerDetails', err)
        }
    }

    
}

module.exports = Snkrs;