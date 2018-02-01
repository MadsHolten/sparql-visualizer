# DataVis

[Demo](https://madsholten.github.io/sparql-visualizer/)

This is a small project for visualising RDF-data in a forced labelled graph (D3 based). The predefined tabs cannot be changed directly by the user, as each of them are supposed to hold predefined data and queries to be communicated to the readers. Each tab consists of the following:

### Description tab

This is where additional information is given with respect to the data and query tab.

### Data tab

In this tab, a small dataset is given in Turtle syntax.

### Query tab

In this tab a SPARQL query to be evaluated against the dataset is specified. This is done by loading the dataset into an in-memory [rdfstore](https://www.npmjs.com/package/rdfstore) and also executing the query using this library. As an alternative, you can also connect to a Stardog triplestore (only tested locally) to load the sample dataset and to run SPARQL queries against (including INSERT/DELETE). Reasoning is supported but only for the Stardog triple store.

### Query result tab

This is where the result is illustrated as a graph (SPARQL CONSTRUCT) or as a table (SPARQL SELECT). If the SPARQL query is an INSERT or DELETE query, no results will be shown here.

## Developing new examples

If you have relevant **use cases** that should be considered for ontology design (BOT, OPM, PROPS, etc.), you can demonstrate your own examples via your own JSON file hosted on Github (raw github) or Dropbox ([direct link](https://zapier.com/learn/how-to/generate-direct-dropbox-link/)): 'https://madsholten.github.io/sparql-visualizer/' + '?file=' + 'direct link to JSON file'

* example with Github: https://madsholten.github.io/sparql-visualizer/?file=https:%2F%2Fraw.githubusercontent.com%2Fw3c-lbd-cg%2Fproduct%2Fdevelop%2Fvis-data.json

If you have any **comments** on proposed data structures by the LBD community group (ontologies such as BOT, OPM, PROPS, etc.) you can create an issue on the respective github repository of that specific ontology, under https://github.com/w3c-lbd-cg/. If you have any examples and/or use cases you want to mention in the issue or discussion, you can mention one hyperlink to the sparql-visualizer app appended with a link to your own example JSON file.

## Local development

I encourage you to do join the effort and contribute to the code base. Simply fork the project and run `npm install` to install the dependencies. Then run `ng serve` to run a local development server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change and save any of the source files.

The tabs (and their title, descriptions, default datasets and queries) are generated, based on `src/assets/data.json`.

## Detailed installation guide
The following instructions assume at least some experience with a terminal (Mac/Linux) or command line interface (Windows).
1) OPTIONAL: Before installing node.js and Angular CLI, it is recommended to install a node version manager, such as [nvm](https://github.com/creationix/nvm) for Mac/Linux or [nvm-windows](https://github.com/coreybutler/nvm-windows) for Windows. Follow the instructions mentioned there. In what follows, we assumed Windows and nvm-windows.
2) Install most recent node.js (other versions might work as well, but this is not tested. Tested on node 6.9.0 and 9.4.0): 
`nvm install latest`
3) OPTIONAL: Install most recent angular/cli globally (tested on v1.6.6): 
`npm install -g @angular/cli`
4) Check if the correct version of angular/cli is installed: 
`ng -v`.
If the computer is complaining that the angular-devkit/core is missing, you should install it: 
`npm install -D @angular-devkit/core@0.0.29`.<br />
Check the version of angular/cli again (should be allright now): 
`ng -v`
5) Make sure [git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git) is installed on your machine. Copy this repository to the folder of your choice: 
`git clone https://github.com/MadsHolten/sparql-visualizer.git`<br />
or make a [fork](https://guides.github.com/activities/forking/) (if you want to contribute), and clone the forked repository: 
`git clone https://github.com/YOUR-USERNAME/sparql-visualizer.git`
6) Install the project's dependencies while still remaining in the folder (includes angular/cli v1.6.6): 
`npm install`
7) Control the local version of angular/cli from the same folder: 
`ng -v`.<br />
If the computer is again complaining that the angular-devkit/core is missing, you should also install it here: 
`npm install -D @angular-devkit/core@0.0.29`. <br />
Check the version of angular/cli again (should be allright now): 
`ng -v`
8) Run the app from the same folder. The app will start automatically in your browser: 
`ng serve --open`.<br />
If the app does not open directly, you can try to navigate manually to localhost:4200 in your browser
9) OPTIONAL: Start Stardog Server
10) OPTIONAL: If changes are made, you can get the most recent version, by using git: 
`git pull origin`<br />
Or if you made a fork of this repository, and want to get the latest updates of this repository:<br />
`git remote add upstream https://github.com/MadsHolten/sparql-visualizer.git`<br />
`git fetch upstream` (this will only update your local master branch)<br />
if necessary, you can merge the local master branch with your local development branch by using `git merge`

## Acknowledgements

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 1.6.6.

The force graph used for visualising the results is built with [D3](https://d3js.org/). The implementation is based on [a project by Rathachai](https://github.com/Rathachai/d3rdf).
