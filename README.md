# DataVis

[Demo](https://madsholten.github.io/sparql-visualizer/)

This is a simple app to visualize and communicate the content of a knowledge base in the RDF format. The project is open source and we welcome all who is interested to participate.

## Collaborators
[Mathias Bonduel](researchgate.net/profile/Mathias_Bonduel)

## 0. Run in DOCKER
1. Install DOCKER
2. `docker-compose build`
3. `docker-compose up`
4. Open [http://localhost:3030](http://localhost:3030) to confirm that Fuseki is running *(user: admin, pw: admin)* and that two dataset are available (*/Reasoning* and */ds*). The first one is a persistent store with reasoning and the latter is an in-mem store. Both expose a SHACL-endpoint
5. Open [http://localhost:4200](http://localhost:4200) to confirm that the app is running
6. Click the double arrows *(switch to datasets)* and use Fuseki as triplestore option and *http://localhost:3030/Reasoning/sparql*, *http://localhost:3030/Reasoning/update* and *http://localhost:3030/Reasoning/data* as *endpoint*, *update endpoint* and *data endpoint* respectively

## 1. Quickstart

* You can run the app and make your own samples without having to install anything. Just use the **online version** of the app: https://madsholten.github.io/sparql-visualizer/. Read section "3. Developing new examples" for more information about adding your own samples.
* Two tutorial videos are made:
  - SPARQL-visualizer - 1: The basics: https://www.youtube.com/watch?v=ixrhgKHKXDY 
  - SPARQL-visualizer - 2: Running locally: https://www.youtube.com/watch?v=KgtAgyzwEpk 
* The second tutorial video shows how you can run the application in **offline mode**, by using a compiled version of the app:
  - download the [ZIP version](https://github.com/MadsHolten/sparql-visualizer/blob/master/sparql-viz.zip?raw=true) of the app and unzip it
  - if you are on Mac/Linux: python 2.7 is already installed. If on Windows, [install Python 2.7 or Python 3.6](https://www.python.org/downloads/)
  - Open Terminal (Mac/Linux) or CMD (Windows) and navigate to the the unzipped folder
  - Start a local http server on port 8000:
    - Python 2.7: `python -m SimpleHTTPServer 8000`
    - Python 3.6: `python -m http.server 8000`
    - (alternatively, you can also install and use node http-server: `http-server -p 8000`
* During the LDAC 2018 workshop, the following [presentation](http://linkedbuildingdata.net/ldac2018/files/Presentations/20180619_sparql-visualizer_MathiasBonduel.pdf) was given, to introduce the functionality of and the ideas behind the SPARQL visualizer


## 2. Functionality of sparql-visualizer

When starting the application, a series of predefined tabs will be generated based on a JSON file located in `src/assets/data.json`. These tabs and their content can be modified by the user directly in the application. 

The tabs hold four components that can be modified:

### 2.1. Title component

This includes a number and a clear title for the specific tab.

### 2.2 Description component

This is where additional information is given with respect to the data and query component. [Markdown](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet) can be used to make the text more readable.

### 2.3. Triples component

In this component, a small RDF dataset is given in Turtle syntax. The sample data should be as clear and consice as possible and includes prefixes.

### 2.4. Query component

In this component a SPARQL query is specified to be evaluated against a RDF dataset. This is done by loading the dataset from the "Triples" component into an in-memory triple store based on [rdfstore](https://www.npmjs.com/package/rdfstore) and also executing the query using this library. Please note that the in-memory triple store cannot handle complete SPARQL 1.1, does not support reasoning and SPARQL INSERT/DELETE queries.

As an alternative, you can also connect to a local Stardog triplestore to load the sample dataset and to run SPARQL queries against it (including full SPARQL 1.1, INSERT/DELETE, federated queries and reasoning (after adding the respective ontology)). You can make a connection to a local Stardog database using the [online version of sparql-visualizer](https://madsholten.github.io/sparql-visualizer/), or by installing a local version of this app (see section 1. Quickstart). Execute the following steps, to make the connection:
1) Download and install Stardog. The [Community Edition (CE)](https://www.stardog.com/versions) can be downloaded for free if it is not used for commercial activities. Follow the instructions given [here](https://www.stardog.com/docs/#_quick_start_guide).
2) Make sure you have a Stardog running (defaults to port 5820) with an empty database (let's call it 'test'), so that you don't delete anything important. 
3) Then click the \"Switch to triplestore\" button (upper right hand corner of the \"Select dataset\" component) and type in "http://localhost:5820" as endpoint and "test" as database. If you haven't changed the username and password they both default to "admin".
4) Click "Load dataset" to send the sample triples from the "Triples" component to the Stardog database.
5) Execute the query and see the results.

### 2.5. Query result component

This is where the result of the SPARQL query is visualized as a graph (SPARQL CONSTRUCT) or as a table (SPARQL SELECT). If the SPARQL query is an INSERT or DELETE query, no results will be shown here.

## 3. Developing new examples

If you have relevant **use cases** that should be considered for ontology design (BOT, OPM, PROPS, etc.), you can demonstrate your own examples by sharing your own JSON file hosted on Github (raw github) or Dropbox ([direct link](https://zapier.com/learn/how-to/generate-direct-dropbox-link/)): 'https://madsholten.github.io/sparql-visualizer/' + '?file=' + 'direct link to JSON file'

* example with Github: https://madsholten.github.io/sparql-visualizer/?file=https:%2F%2Fraw.githubusercontent.com%2Fw3c-lbd-cg%2Fproduct%2Fdevelop%2Fvis-data.json

If you have any **comments or proposals** concerning data structures developed by the LBD community group (ontologies such as BOT, OPM, PROPS, etc.) you can create an issue on the respective github repository of that specific ontology, under https://github.com/w3c-lbd-cg/. If you have any examples and/or use cases you want to mention in the issue or discussion, you can share one hyperlink to the sparql-visualizer app appended with a link to your own example JSON file, as demonstrated above.

The easiest way to make new samples, is by using the online version of the app, and modify the different components (one tab at a time). Don't forget to **copy the JSON string** ("Select dataset" component, lower right bottom) into a seperate JSON file on your computer **before** you leave the modified tab (otherwise your changes will be lost). Then copy the JSON string in a **code editor** (recommended for finding typos and forgotten commas) and save it as a JSON file.

## 4. Local development

All participants are invited to improve this app. Simply fork the project and run `npm install` to install the dependencies. Then run `ng serve` to run a local development server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change and save any of the source files. See section 5, for a more detailed installation guide.

The tabs (and their title, descriptions, triples and queries components) are generated based on `src/assets/data.json`.

## 5. Detailed installation guide for local development
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

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 1.6.6. The frontend of the app is based on [Angular](https://angular.io/), [material design](https://material.angular.io/) and [D3](https://d3js.org/). The default local triplestore is based on [rdfstore](https://github.com/antoniogarrote/rdfstore-js).

The force graph used for visualising the results is built with [D3](https://d3js.org/). The implementation is based on [a project by Rathachai](https://github.com/Rathachai/d3rdf).

## SPARQL-visualizer in literature
### Software demo report
*Mathias Bonduel, Mads Holten Rasmussen, Pieter Pauwels, Maarten Vergausen, Ralf Klein (2018) SPARQL-visualizer: A Communication Tool
for Collaborative Ontology Engineering Processes, 6th Linked Data in Architecture and Construction Workshop (LDAC2018), June 19-21, 2018, London, United Kingdom, https://doi.org/10.13140/RG.2.2.13687.93603*
