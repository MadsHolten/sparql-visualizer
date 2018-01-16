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
            title: "1: Simple",
            description: "\
This is a simple way of describing requirements of a set of abstract spaces. Each space is assigned a space type as a string value, for querying for a specific type, or for updating/deleting/adding properties on a type level.\n\
The simple approach has the disadvantage of not being able to manage provenance or history of the properties, and it is nowhere stated that the `prop:area` is a requirement rather than an actual value.\n\
#### Triples\n\
The dataset includes three spaces. Two of them have the datatypeproperty prop:type specified as `\"Type A\"` and the last one is specified as `\"Type B\"`. They all have datatype property `prop:area` assigned.\n\
Assigning a property to all spaces of a certain type can be achieved with the following query:\n\n\
```sparql\n\
INSERT { ?s prop:area \"12 m2\" }\n\
WHERE { ?s a bot:Space ; prop:type \"Type A\" }```\n\
Updating a property can be achieved with:\n\n\
```sparql\n\
DELETE { ?s prop:area ?val }\n\
INSERT { ?s prop:area \"14 m2\" }\n\
WHERE { ?s a bot:Space ; prop:type \"Type A\" ; prop:area ?val }```\n\
#### Query\n\
The specified query retrieves all spaces of `prop:type` `\"Type A\"` and their properties.\
",
            triples: `
@prefix rdf:  <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .
@prefix bot:  <https://w3id.org/bot#> .
@prefix inst: <https://example.org/projectXX/> .
@prefix prop: <https://w3id.org/prop#> .

# THREE SPACE INSTANCES - TWO TYPES
inst:SpaceA a bot:Space ;
\tprop:type "Type A" ;
\tprop:area "12 m2" .
inst:SpaceB a bot:Space ;
\tprop:type "Type A" ;
\tprop:area "12 m2" .
inst:SpaceC a bot:Space ;
\tprop:type "Type B" ;
\tprop:area "16 m2" .
`,
            query: `
PREFIX inst: <https://example.org/projectXX/>
PREFIX bot:  <https://w3id.org/bot#>
PREFIX prop: <https://w3id.org/prop#>

CONSTRUCT
WHERE {
\t?s a bot:Space ;
\t\tprop:type "Type A" ;
\t\t?key ?value .
}
`
        },
        {
          title: "2: OPM requirement",
          description: "\
In this example [OPM](https://github.com/w3c-lbd-cg/opm) is used to model property states, thereby allowing to track the history of a property. Further, since the property is objectified, it can be classified as \n\n\
The states are classified as `opm:Requirements` meaning that they hold a required value of the property.\n\n\
The latest state is classified as an `opm:CurrentState`. The query only returns properties valid for spaces of type `inst:TypeA`.\n\
#### Triples\n\
The dataset includes three spaces. Two of them are of type `inst:TypeA` and the last one is of type `inst:TypeB`. They all have object property `prop:area` assigned as an `opm:Requirement`. Each property requirement has at least one state, and the most recent one is classified as an `opm:CurrentState`. The states holds value restrictions and provenance data.\n\
Assigning a property to all spaces of a certain type can be achieved with the following query:\n\n\
```sparql\n\
INSERT {\n\
\t?s prop:area inst:PropA .\n\
\tinst:PropA a opm:Requirement ;\n\
\t\topm:hasState inst:StateA .\n\
\tinst:StateA a opm:CurrentState ;\n\
\t\topm:minimumValue \"12 m2\" ;\n\
\t\tprov:generatedAtTime ?now .\n\
}\n\
WHERE { ?s a inst:TypeA . BIND(now() AS ?now) }```\n\
Updating a property can be achieved with:\n\n\
```sparql\n\
DELETE { ?stateURI a opm:CurrentState }\n\
INSERT {\n\
\t?propURI opm:hasState inst:StateB .\n\
\tinst:StateB a opm:CurrentState ;\n\
\t\topm:minimumValue \"14 m2\" ;\n\
\t\tprov:generatedAtTime ?now .\n\
}\n\
WHERE {\n\
\t?s a bot:Space , inst:TypeA ;\n\
\t\tprop:area ?propURI .\n\
\t?propURI opm:hasState ?stateURI .\n\
\tBIND(now() AS ?now)\n\
}```\n\
### Query\n\
The specified query retrieves all spaces of type `inst:TypeA` and the latest state of their properties.\
",
          triples: `
@prefix bot:  <https://w3id.org/bot#> .
@prefix inst: <https://example.org/projectXX/> .
@prefix rdf:  <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .
@prefix prop: <https://w3id.org/prop#> .
@prefix opm:  <https://w3id.org/opm#> .
@prefix prov: <http://www.w3.org/ns/prov#> .
@prefix cdt:  <http://w3id.org/lindt/custom_datatypes#> .

# THREE SPACE INSTANCES - TWO TYPES
inst:SpaceA a bot:Space , inst:TypeA ;
\tprop:area inst:PropA .
inst:SpaceB a bot:Space , inst:TypeA ;
\tprop:area inst:PropA .
inst:SpaceC a bot:Space , inst:TypeB ;
\tprop:area inst:PropB .

# PROPERTY A
inst:PropA a opm:Requirement ;
\t# STATE 1
\topm:hasState [ opm:minimumValue "12 m2" ;
\t\tprov:generatedAtTime "2018-01-01T13:35:23Z" ] ;
\t# STATE 2 (CURRENT STATE)
\topm:hasState[ a opm:CurrentState ;
\t\topm:minimumValue "14 m2" ;
\t\tprov:generatedAtTime "2018-01-03T13:35:23Z" ] .

# PROPERTY B
inst:PropB a opm:Requirement ;
\t# STATE 1
\topm:hasState[ a opm:CurrentState ;
\t\topm:minimumValue "16 m2" ;
\t\tprov:generatedAtTime "2018-01-01T14:35:23Z" ] .
            `,
          query: `
PREFIX inst: <https://example.org/projectXX/>
PREFIX opm:  <https://w3id.org/opm#>

CONSTRUCT
WHERE {
\t?s a inst:TypeA .
\t?s ?property ?propURI .
\t?propURI a opm:Requirement ;
\t\topm:hasState ?stateURI .
\t?stateURI a opm:CurrentState ;
\t\t?key ?val .
}`
        },
        {
            title: "3: OPM realised",
            description: "As the architect designs `inst:SpaceA`, an actual geometrically defined area exists. In the following it is illustrated how this can be attached to the graph. The query is to check if the requirement is fulfilled.",
            triples: `
@prefix bot:  <https://w3id.org/bot#> .
@prefix inst: <https://example.org/projectXX/> .
@prefix rdf:  <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .
@prefix prop: <https://w3id.org/prop#> .
@prefix opm:  <https://w3id.org/opm#> .
@prefix prov: <http://www.w3.org/ns/prov#> .
@prefix cdt:  <http://w3id.org/lindt/custom_datatypes#> .

### BUILDING OWNER
# THREE SPACE INSTANCES - TWO TYPES
inst:SpaceA a bot:Space , inst:TypeA ;
\tprop:area inst:PropA .
inst:SpaceB a bot:Space , inst:TypeA ;
\tprop:area inst:PropA .
inst:SpaceC a bot:Space , inst:TypeB ;
\tprop:area inst:PropB .

# PROPERTY A
inst:PropA a opm:Requirement ;
\t# STATE 1
\topm:hasState [ opm:minimumValue "12 m2" ;
\t\tprov:generatedAtTime "2018-01-01T13:35:23Z" ] ;
\t# STATE 2 (CURRENT STATE)
\topm:hasState[ a opm:CurrentState ;
\t\topm:minimumValue "14 m2" ;
\t\tprov:generatedAtTime "2018-01-03T13:35:23Z" ] .

# PROPERTY B
inst:PropB a opm:Requirement ;
\t# STATE 1
\topm:hasState[ a opm:CurrentState ;
\t\topm:minimumValue "16 m2" ;
\t\tprov:generatedAtTime "2018-01-01T14:35:23Z" ] .

### ARCHITECT
# SPACE INSTANCES
inst:SpaceA prop:area inst:PropC .

# PROPERTY C
inst:PropC a opm:Property ;
\t# STATE 1
\topm:hasState[ a opm:CurrentState ;
\t\topm:value "15 m2" ;
\t\tprov:generatedAtTime "2018-02-05T11:35:23Z" ] .
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
}`
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