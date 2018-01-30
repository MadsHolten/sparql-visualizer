# DataVis

[Demo](https://madsholten.github.io/sparql-visualizer/)

This is a small project for visualising RDF-data in a forced labelled graph (D3 based). The predefined tabs cannot be changed by the user, as each of them are supposed to hold predefined data and queries to be communicated to the readers. Each tab consists of the following:

### Description tab

This is where additional information is given with respect to the data and query tab.

### Data tab

In this tab, a small dataset is given in Turtle syntax.

### Query tab

In this tab a SPARQL query to be evaluated against the dataset is specified. This is done by loading the dataset into an in-memory [rdfstore](https://www.npmjs.com/package/rdfstore) and also executing the query using this library. As an alternative, you can also connect to a Stardog triplestore (only tested locally) to load the sample dataset and to run SPARQL queries against (including INSERT/DELETE). Reasoning is supported but only for the Stardog triple store.

### Query result tab

This is where the result is illustrated as a graph (SPARQL CONSTRUCT) or as a table (SPARQL SELECT). If the SPARQL query is an INSERT or DELETE query, no results will be shown here.

## Local development & discussion on data structures via examples

I encourage you to do join the effort and contribute to the code base. Simply fork the project and run `npm install` to install the dependencies. Then run `ng serve` to run a local development server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

The tabs (and their title, descriptions, default datasets and queries) are generated, based on `src/assets/data.json`.

If you have relevant **use cases** that should be considered for ontology design (BOT, OPM, PROPS, etc.), you can remove the dummy data from `data.json`, place your own examples and test it locally. Before doing a pull request to this repository, you should rename your data.json file to something self-explanatory, such as `data_<RELEVANT-ONTOLOGIES>_<USER-NAME>.json`. Please also provide a title and description for each tab in the `data.json` file containing your examples. Use cases will be added to the main development branch, if they support the discussion about data structures. 

If you have any **comments** on proposed data structures by the LBD community group (ontologies such as BOT, OPM, PROPS, etc.) you can create an issue on the respective github repository of that specific ontology, under https://github.com/w3c-lbd-cg/. If you have any examples and/or use cases you want to mention in the issue or discussion, you can make a link to the 

## Detailed installation guide
The following instructions assume at least some experience with a terminal (Mac/Linux) or command line interface (Windows).
1) Before installing node.js and Angular CLI, it is recommended to install a node version manager, such as [nvm](https://github.com/creationix/nvm) for Mac/Linux or [nvm-windows](https://github.com/coreybutler/nvm-windows) for Windows. Follow the instructions mentioned there. In what follows, we assumed Windows and nvm-windows.
2) Install node.js v6.9.0 (other versions my work as well, but this is not tested): 
`nvm install 6.9.0`
3) Install angular/cli v1.5.0 globally:
`npm install -g @angular/cli@1.5.0`
4) Check if the correct version of Angular-cli is installed:
`ng -v`.
If the computer is complaining that the angular-devkit/core is missing, you should install it:
`npm install -D @angular-devkit/core@0.0.28`.
Check the version of angular/cli again (should be allright now):
`ng -v`
5) Make sure [git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git) is installed on your machine. Copy this repository to the folder of your choice:
`git clone https://github.com/MadsHolten/sparql-visualizer.git`
or make a [fork](https://guides.github.com/activities/forking/) (if you want to contribute), and clone the forked repository:
`git clone https://github.com/YOUR-USERNAME/sparql-visualizer.git`
6) Move inside the sparql-visualizer folder and install angular/cli v1.5.0 locally:
`npm install @angular/cli@1.5.0`
7) Install the project's dependencies while still remaining in the folder:
`npm install`
8) Control the local version of angular/cli from the same folder:
`ng -v`.
If the computer is again complaining that the angular-devkit/core is missing, you should also install it here:
`npm install -D @angular-devkit/core@0.0.28`
9) Run the app from the same folder. The app will start automatically in your browser:
`ng serve --open`.
If the app does not open directly, you can try to navigate to localhost:4200 in your browser
10) OPTIONAL: Start Stardog Server
11) OPTIONAL: If changes are made, you can get the most recent version, by using git:
`git pull origin`
Or if you made a fork of this repository, and want to get the latest updates of this repository:
`git remote add upstream https://github.com/MadsHolten/sparql-visualizer.git`
`git fetch upstream` (this will only update your local master branch)
if necessary, you can merge the local master branch with your local development branch by using `git merge`

## Acknowledgements

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 1.5.0.

The force graph used for visualising the results is built with [D3](https://d3js.org/). The implementation is based on [a project by Rathachai](https://github.com/Rathachai/d3rdf).
