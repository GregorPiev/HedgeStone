import io from 'socket.io-client';

/**
 * @Description: Service that holds the socket to spotoption streamer feed for the ticker assets.
 */
export class TickerSocketsData {
    /**
     * @constructor
     * construct function, define variables and run initial function.
     * @purpose - define variables and initial class.
     */
    constructor($rootScope, $http, $timeout) {
        'ngInject';
        this.$rootScope = $rootScope;
        this.$http = $http;
        this.$timeout = $timeout;
        this.SendData = [];
        this.SendDataCurrencies = [];
        this.assetsData = {};
        this.currenctAsset = {};
        this.assetsOpenRateData = {};
        this.sortedAssets = [];
        this.openValueRequest = ``;
        this.assetsCache = [];
        this.assetsCurrenciesCache = [];
    }

    /**
     * @init(async)
     * Initial function on startup the service.
     */

    init (binaryAssets, currencyAssets) {
        let self = this;
        this.i = 0;
        this.assetsCache = _.cloneDeep(binaryAssets);
        this.assetsCurrenciesCache = _.cloneDeep(currencyAssets);
        this.buildRequest(binaryAssets, currencyAssets);
        this.assets = _.orderBy(_.concat(binaryAssets, currencyAssets), 'id');
        this.getOpenValue().then(() => {
            this.sockets = io('https://sst-n2-c-nl.spotoption.com/', {query: {token: "f46eec97-65d8-4bb2-87fb-ca8a02d3e17b"}});
            this.currenciesSockets = io('https://sst-n2-c-nl.spotoption.com/', {query: {token: "f46eec97-65d8-4bb2-87fb-ca8a02d3e17b"}});
            this.initTickerAssets();
            this.connect();
            this.disconnect();
        });
    }

    getOpenValue(time = -1440) {
        let self = this;
        return this.$http.get(`https://spotplatform.hedgestonegroup.com/PlatformAjax/getJsonFile/platformGraph/regular/Candle/${time}minutes/now/d/${this.openValueRequest}ohlcData.spotcandle`, {
            async: true,
            withCredentials: false
        }).then((response) => {
            if (!_.isUndefined(response.data.data.graph)) {
                let i = 0;
                this.successfulAssets = 0;
                let assetsKeys = Object.keys(this.assets);
                let savingOpenRate = (value, key) => {
                    if(_.isUndefined(value.series[0].data[1])) {
                        _.find(self.assets, {id: Number(key)}).disabled = true;
                    } else {
                        self.successfulAssets++;
                        self.assets[assetsKeys[i]].openValue = value.series[0].data[1][1];
                        self.assets[assetsKeys[i]].disabled = false;
                    }
                    i++;
                };
                angular.forEach(response.data.data.graph, savingOpenRate);

                if(this.successfulAssets >= 10) {
                    return true;
                } else if(time > (-1440*3)) {
                    this.getOpenValue((time*2))
                }

            }
        });
    }

    initTickerAssets() {
        let self = this;
        let tickerReady = (data) => {
            angular.forEach(data, (value, key) => {
                self.assetsData[key] = value;
            });

            if (Object.keys(self.assetsData).length == self.assets.length && self.successfulAssets > 10) {
                self.sortedAssets = _.sortBy(Object.keys(self.assetsData), (o) => {
                    let name = _.split(o, `_`);
                    if(!_.isNaN(Number(name[1]))) {
                        return Number(name[1]);
                    } else if(!_.isNaN(Number(name[2]))) {
                        return Number(name[2]);
                    }
                });

                self.$rootScope.$broadcast('tickerReady');
                self.ready = true;
                self.sockets.removeListener('update', tickerReady);
                self.currenciesSockets.removeListener('update', tickerReady);
                self.update();
            }
        };
        this.sockets.on("update", tickerReady);
        this.currenciesSockets.on("update", tickerReady);
    }

    update(cancel = false) {
        // TODO: Implement Rxjs subscribe and debounce.
        let debounceUpadte = _.debounce(() => {
            for (let i of packet) {
                angular.forEach(i, (value, key) => {
                    this.assetsData[key] = value;
                });
            }
            packet = [];
        }, 2000, {maxWait: 2000});
        let update = (data) => {
            debounceUpadte();
            packet.push(data);
        };
        let packet = new Array();

        if(cancel) {
            this.sockets.removeListener('update', update);
            this.currenciesSockets.removeListener('update', update);
            return false;
        }

        this.sockets.on('update', update);
        this.currenciesSockets.on('update', update);
    }

    connect() {
        this.sockets.on('connect', () => {
            this.sockets.emit("add", this.SendData);
        });
        this.currenciesSockets.on('connect', () => {
            this.currenciesSockets.emit("add", this.SendDataCurrencies);
        });
    }

    buildRequest(binaryAssets, currencyAssets) {
        angular.forEach(binaryAssets, (value, key) => {
            this.SendData.push(`asset_${value.id}`);
            this.openValueRequest += `${value.id}/`;
        });

        angular.forEach(currencyAssets, (value, key) => {
            this.SendDataCurrencies.push(`feed_asset_${value.id}`);
            this.openValueRequest += `${value.id}/`;
        });
    }

    disconnect() {
        this.sockets.on('disconnect', () => {
            this.sockets.io.engine.query.nonereverse = 'NEWKEY';
            
        });
    }

    next() {
        if (this.sortedAssets.length === this.i)
            this.i = 0;
        this.currenctAssetData = this.assetsData[this.sortedAssets[this.i]];
        this.currenctAsset = this.assets[this.i];
        this.i++;
        if(this.currenctAsset.disabled)
            this.next();
        let asset = [this.currenctAssetData, this.currenctAsset];
        if(Number(this.currenctAssetData.rate) > (this.currenctAsset.openValue + (this.currenctAsset.openValue / 5)))
            this.reset();
        return asset;
    }

    reset() {
        this.$rootScope.$broadcast('tickerClose');
        this.ready = false;
        this.currenciesSockets.disconnect();
        this.sockets.disconnect();
        this.update(true);
        this.$timeout(() => {
            for (var temp in this.assetsData) delete this.assetsData[temp];
            for (var temp in this.currenctAsset) delete this.currenctAsset[temp];
            for (var temp in this.assetsOpenRateData) delete this.assetsOpenRateData[temp];
            for (var temp in this.sockets) delete this.sockets[temp];
            for (var temp in this.currenciesSockets) delete this.currenciesSockets[temp];
            this.i = 0;
            this.SendData.splice(0, this.SendData.length);
            this.SendDataCurrencies.splice(0, this.SendDataCurrencies.length);
            this.sortedAssets.splice(0, this.sortedAssets.length);
            this.assets.splice(0, this.assets.length);

            this.sockets = io('https://sst-fiber-c-nl.spotoption.com/', {query: {token: "f46eec97-65d8-4bb2-87fb-ca8a02d3e17b"}});
            this.currenciesSockets = io('https://sst-n2-c-nl.spotoption.com/', {query: {token: "f46eec97-65d8-4bb2-87fb-ca8a02d3e17b"}});
            this.openValueRequest = ``;
            this.init(this.assetsCache, this.assetsCurrenciesCache);
        }, 25000);
    }
}
