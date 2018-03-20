import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash';

@Pipe({name: 'prefixstring', pure: false})
export class PrefixSimplePipe implements PipeTransform {

  prefixes = [
    {prefix: "rdf", uri: "http://www.w3.org/1999/02/22-rdf-syntax-ns#"},
    {prefix: "rdfs", uri: "http://www.w3.org/2000/01/rdf-schema#"},
    {prefix: "xsd", uri: "http://www.w3.org/2001/XMLSchema#"},
    {prefix: "prov", uri: "http://www.w3.org/ns/prov#"},
    {prefix: "opm", uri: "https://w3id.org/opm#"},
    {prefix: "seas", uri: "https://w3id.org/seas/"},
    {prefix: "sd", uri: "http://www.w3.org/ns/sparql-service-description#"},
    {prefix: "bot", uri: "https://w3id.org/bot#"},
    {prefix: "cdt", uri: "http://w3id.org/lindt/custom_datatypes#"},
    {prefix: "props", uri: "https://w3id.org/product/props#"},
    {prefix: "inst", uri: "https://www.niras.dk/proj100/"},
    {prefix: "owl", uri: "http://www.w3.org/2002/07/owl#"},
    {prefix: "nir", uri: "http://niras.com/employees/"}
]

  transform(value: string): any {

    var val = value;

      var abr = this._abbreviate(val,this.prefixes);
      if(abr) val = abr;

    return val;
  }

  private _abbreviate(foi,prefixes){
    var newVal: string;
    // Loop over prefixes
    _.each(prefixes, p => {
      var prefix = p.prefix;
      var uri = p.uri;
      if(foi.indexOf(uri) !== -1){
        newVal = foi.replace(uri, prefix+':');
      }
    })
    return newVal;
  }

}