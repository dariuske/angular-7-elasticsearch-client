import {Injectable} from '@angular/core';
import {Client} from 'elasticsearch-browser';
import {environment} from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class SearchService {
    perPage = environment.RESULTS_PER_PAGE;

    queryalldocs = {
        'query': {
            'match_all': {}
        },
        'sort': [
            {'_score': {'order': 'desc'}}
        ]
    };
    private client: Client;

    constructor() {
        if (!this.client) {
            this.connect();
        }
    }

    createIndex(name): any {
        return this.client.indices.create(name);
    }

    isAvailable(): any {
        return this.client.ping({
            requestTimeout: Infinity,
            body: 'Hello JOAC Search!'
        });
    }

    addToIndex(value): any {
        return this.client.create(value);
    }

    getAllDocuments(_query, _index?, _type?): any {
        if (_index !== undefined) {
            if (_type !== undefined) {
                return this.client.search({
                    q: _query,
                    index: _index,
                    type: _type,
                    body: this.queryalldocs
                });
            }
            return this.client.search({
                q: _query,
                index: _index,
                body: this.queryalldocs
            });
        } else {
            if (_type !== undefined) {
                return this.client.search({
                    q: _query,
                    type: _type,
                    body: this.queryalldocs
                });
            }
            return this.client.search({
                q: _query,
                body: this.queryalldocs
            });
        }
    }

    getPaginatedDocuments(_query, _page, _index?, _type?): any {
        if (_index !== undefined) {
            if (_type !== undefined) {
                return this.client.search({
                    q: _query,
                    index: _index,
                    type: _type,
                    from: (_page - 1) * this.perPage,
                    size: this.perPage
                });
            }
            return this.client.search({
                q: _query,
                index: _index,
                from: (_page - 1) * this.perPage,
                size: this.perPage
            });
        } else {
            if (_type !== undefined) {
                return this.client.search({
                    q: _query,
                    type: _type,
                    from: (_page - 1) * this.perPage,
                    size: this.perPage
                });
            }
            return this.client.search({
                q: _query,
                from: (_page - 1) * this.perPage,
                size: this.perPage
            });
        }
    }

    getNextPage(scroll_id): any {
        return this.client.scroll({
            scrollId: scroll_id,
            scroll: '1m'
        });
    }

    getObject(_id, _index, _type): any {
        if (_index !== undefined || _type !== undefined) {
            return this.client.get({
                index: _index,
                type: _type,
                id: _id
            });
        } else {
            throw new Error('Cannot query item with an undefined index or type or both.');
        }
    }

    private connect() {
        this.client = new Client({
            host: environment.ES_HOST
            // log: 'trace'
        });
    }
}
