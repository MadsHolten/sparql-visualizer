import { Injectable } from '@angular/core';
import * as rdfstore from 'rdfstore';
import * as _ from 'lodash';
import * as N3 from 'n3';

export interface Data {
    title: string;
    triples: string;
    query: string;
}

@Injectable()
export class DataService {

    public data: Data[] = [
        {
          title: "Space requirement 1",
          triples: `
            @prefix bot:  <https://w3id.org/bot#> .
            @prefix inst: <https://example.org/projectXX/> .
            @prefix rdf:  <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .
            @prefix prop: <https://w3id.org/prop#> .
            @prefix opm:  <https://w3id.org/opm#> .
            @prefix prov: <http://www.w3.org/ns/prov#> .
            @prefix cdt:  <http://w3id.org/lindt/custom_datatypes#> .
            
            inst:SpaceA a bot:Space , inst:TypeA ;
                prop:area inst:PropA .
            inst:SpaceB a bot:Space , inst:TypeA ;
                prop:area inst:PropA .
    
            inst:PropA a opm:Property ;
                opm:hasState inst:PropStateA .
            
            inst:PropStateA a opm:Required ;
                opm:minimumValue "12 m2" ;
                prov:generatedAtTime "2012-04-03T13:35:23Z" .
            `,
          query: `
            PREFIX inst:  <https://example.org/projectXX/>
            CONSTRUCT
            WHERE {
              ?sp a inst:TypeA .
            }
          `
        },
        {
          title: "Space requirement 2",
          triples: `
            @prefix bot:  <https://w3id.org/bot#> .
            @prefix inst: <https://example.org/projectXX/> .
            @prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .
            
            inst:spA a bot:Space .`,
          query: `  
            PREFIX bot:  <https://w3id.org/bot#>
            CONSTRUCT
            WHERE {
              ?sp a bot:Space .
            }
          `
        }
      ]
    
    getData(){
        return this.data;
    }

    getTitles(){
        return _.map(this.data, x => x.title);
    }

    getSingle(index){
        return this.data[index];
    }

}