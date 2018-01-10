# DataVis

[Demo](https://madsholten.github.io/room-requirements/)

This is a small project for visualising RDF-data in a D3 force diagram. The predefined tabs can not be changed by the user, as each of them are supposed to hold predefined data and queries to be communicated to the readers. Each tab consists of the following:

### Data tab

In this tab, a small dataset is given in Turtle syntax.

### Query tab

In this tab a CONSTRUCT query to be evaluated against the dataset is specified. This is done by loading the dataset into an in-memory [rdfstore](https://www.npmjs.com/package/rdfstore) and also executing the query using this library. No reasoning is currently supported.

### Query result tab

This is where the result is illustrated

## Local development

I encourage you to do join the effort and contribute to the code base. Simply fork the project and run `npm install` to install the dependencies. Then run `ng serve` to run a local development server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

The data is currently served from the data-service located at `src/app/data.service.ts`.

## Acknowledgements

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 1.5.0.

The force graph used for visualising the results is built with [D3](https://d3js.org/). The implementation is based on [a project by Rathachai](https://github.com/Rathachai/d3rdf).
