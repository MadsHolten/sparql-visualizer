import { Component } from '@angular/core';

import { QueryService } from './query.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [QueryService]
})
export class AppComponent {

  private queryResult;
  private tabIndex: number = 0;
  private data;

  constructor(
    private qs: QueryService
  ) {}

  private tabs = [
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

  doQuery(query,data){
    this.qs.doQuery(query,data)
      .then(res => {
        this.queryResult = res;
      }, err => console.log(err));
  }

  changeTab(i){
    if(i == 'new'){
      console.log('Add new dataset');
    }else{
      this.data = this.tabs[i];
      this.doQuery(this.data.query,this.data.triples);
    }
  }

  update(ev){
    console.log(ev);
  }

}
