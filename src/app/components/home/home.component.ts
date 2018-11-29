import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {SearchService} from '../../shared/services/search.service';
import {environment} from '../../../environments/environment';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
    isConnected = false;
    status: string;
    totalHits: number;
    searchTime: number;
    currentPage: number;
    searchResponse = '';
    PER_PAGE = environment.RESULTS_PER_PAGE;
    totalPages: any;

    public esData: any[];

    /**
     * Elasticsearch misbehaves if users enter symbolic characters. User this method to strip out any such characters.
     * @param query - user search query.
     */
    static sanitized(query): string {
        return query.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '');
    }

    constructor(private es: SearchService,
                private cd: ChangeDetectorRef) {
    }

    ngOnInit() {
        this.es.isAvailable().then(() => {
            this.status = 'OK';
            this.isConnected = true;
        }, error => {
            this.status = 'ERROR';
            this.isConnected = false;
            console.error('Server is down', error);
        }).then(() => {
            this.cd.detectChanges();
        });
    }

    /**
     * Search function.
     * @param query - user input.
     * @param index - ES index to search.
     * @param page  - page.
     */
    search(query, index, page) {
        const sanitized = HomeComponent.sanitized(query);
        if (sanitized.length) {
            this.searchResponse = '';
            this.currentPage = page;
            // Search all indexes on ES
            if (index !== 'all') {
                this.es.getPaginatedDocuments(sanitized, page, index).then((body) => {
                    if (body.hits.total > 0) {
                        this.esData = body.hits.hits;
                        this.totalHits = body.hits.total;
                        this.searchTime = body.hits.time;
                        this.totalPages = Array(Math.ceil(body.hits.total / this.PER_PAGE)).fill(4);
                    } else {
                        this.searchResponse = 'No matches found';
                    }
                }, (err) => {
                    this.searchResponse = 'Oops! Something went wrong... ERROR: ' + err.error;
                });
            } else {
                this.es.getPaginatedDocuments(sanitized, page).then((body) => {
                    if (body.hits.total > 0) {
                        this.esData = body.hits.hits;
                        this.totalHits = body.hits.total;
                        this.searchTime = body.took;
                        this.totalPages = Array(Math.ceil(body.hits.total / this.PER_PAGE)).fill(4);
                    } else {
                        this.searchResponse = 'No matches found';
                    }
                }, (err) => {
                    this.searchResponse = 'Oops! Something went wrong... ERROR: ' + err.error;
                });
            }
        } else {
            this.searchResponse = 'Nothing found';
        }

    }

    nextPage(query: string, index: string) {
        const sanitized = HomeComponent.sanitized(query);
        if (sanitized.length) {
            if (this.currentPage < this.totalPages.length) {
                this.search(query, index, this.currentPage + 1);
            }
        } else {
            this.esData = [];
            this.searchResponse = 'Nothing found';
        }
    }

    previousPage(query: string, index: string) {
        const sanitized = HomeComponent.sanitized(query);
        if (sanitized.length) {
            if (this.currentPage - 1 >= 1) {
                this.search(query, index, this.currentPage - 1);
            }
        } else {
            this.esData = [];
            this.searchResponse = 'Nothing found';
        }
    }
}
