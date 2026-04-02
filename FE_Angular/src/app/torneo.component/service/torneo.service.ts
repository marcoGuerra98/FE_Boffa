import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Observable, map, tap } from 'rxjs';
import { AppConstants } from '../../constants/app-constants';

@Injectable({
    providedIn: 'root',
})
export class TorneoService {

    private readonly anagraficaGetAllEndpoint = AppConstants.buildApiUrl(AppConstants.API.ANAGRAFICA.GET_ALL);
    private readonly anagraficaInsertEndpoint = AppConstants.buildApiUrl(AppConstants.API.ANAGRAFICA.INSERT);
    private readonly playerGetAllEndpoint = AppConstants.buildApiUrl(AppConstants.API.PLAYER.GET_ALL);

    constructor(private http: HttpClient) {}

    getAllAnagrafica(): Observable<any> {
        console.log('TorneoService: Fetching all anagrafica');
        return this.http.get(this.anagraficaGetAllEndpoint);
    }

    getAllPlayers(): Observable<any> {
        console.log('TorneoService: Fetching all players');
        return this.http.get(this.playerGetAllEndpoint);
    }

}