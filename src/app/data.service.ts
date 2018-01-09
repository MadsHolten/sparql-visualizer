import { Injectable } from '@angular/core';
import * as rdfstore from 'rdfstore';
import * as _ from 'lodash';
import * as N3 from 'n3';

export interface Data {
    title: string;
    description: string;
    triples: string;
    query: string;
}

@Injectable()
export class DataService {

    public data: Data[] = [
        {
          title: "Latest value of a certain property valid for all spaces of a certain type",
          description: `
OPM is used to model property states.
The states are classified as opm:Requirements meaning that they hold a required value of the property.
The latest state is classified as an opm:CurrentState. The query only returns properties valid for spaces of type inst:TypeA.
`,
          triples: `
@prefix bot:  <https://w3id.org/bot#> .
@prefix inst: <https://example.org/projectXX/> .
@prefix rdf:  <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .
@prefix prop: <https://w3id.org/prop#> .
@prefix opm:  <https://w3id.org/opm#> .
@prefix prov: <http://www.w3.org/ns/prov#> .
@prefix cdt:  <http://w3id.org/lindt/custom_datatypes#> .
            
inst:SpaceA a bot:Space , inst:TypeA ;
\tprop:area inst:PropA .
inst:SpaceB a bot:Space , inst:TypeA ;
\tprop:area inst:PropA .
inst:SpaceC a bot:Space , inst:TypeB ;
\tprop:area inst:PropB .
    
inst:PropA a opm:Property ;
\topm:hasState[ a opm:Required ;
\t\topm:minimumValue "12 m2" ;
\t\tprov:generatedAtTime "2018-01-01T13:35:23Z" ] ;
\topm:hasState[ a opm:Required , opm:CurrentState ;
\t\topm:minimumValue "12 m2" ;
\t\tprov:generatedAtTime "2018-01-03T13:35:23Z" ] .

inst:PropB a opm:Property ;
\topm:hasState[ a opm:Required , opm:CurrentState ;
\t\topm:minimumValue "16 m2" ;
\t\tprov:generatedAtTime "2012-04-05T13:35:23Z" ] .
            `,
          query: `
PREFIX inst: <https://example.org/projectXX/>
PREFIX opm:  <https://w3id.org/opm#>

CONSTRUCT
WHERE {
\t?s a inst:TypeA .
\t?s ?property ?propURI .
\t?propURI opm:hasState ?stateURI .
\t?stateURI a opm:CurrentState ;
\t\t?key ?val .
}
GROUP BY ?roomType
          `
        },
        {
          title: "Space requirement 2",
          description: "Some description",
          triples: `
@prefix bot:  <https://w3id.org/bot#> .
@prefix inst: <https://example.org/projectXX/> .
@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .
            
inst:spA a bot:Space .`,
          query: `  
PREFIX bot:  <https://w3id.org/bot#>
CONSTRUCT
WHERE {
\t?sp a bot:Space .
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