# Gamma Search
Tool for graph based search.

Developed for Ardoq AS as a part of the course

TDT4290 - Customer Driven Project

at the Norwegian University of Science and Technology.



**This service is available at https://query-builder-tdt4290.herokuapp.com/**


### USER GUIDE

In this section the GUI is explained, detailing how the application can be used. Includes images with
numbered annotations in red, these red numbers are not part of the regular view but added in to more
accurately refer to specific parts of the views.

##### Main View
The view the user is shown at the start when they use the application is the main view. Main view may
change slightly, such as when relations are defined which causes a new dataset to show up in the graph
area.

![main view](https://i.gyazo.com/700e3880108392e4a0c9eaaecc9d9a34.png)

1. Scroll down to see a tutorial describing the core concepts of graph databases.
2. This accordion is clickable and contains other accordions containing output information, the accordions containing output information also contain preview data. Clicking leads to the Output View shown below.
3. The current Gremlin Query is shown here.
4. This area contains the interactive nodes that define the search.
5. An interactive/clickable dataset node, along with information about the amount of underlying data
points/data nodes the dataset node contains. Clicking leads to the Dataset Button View shown below.


#### Output View
Shows the output of the Gremlin query.

![output view](https://i.gyazo.com/700e3880108392e4a0c9eaaecc9d9a34.png)


1. Defines which dataset is being viewed, as well as how many nodes the dataset contains.
2. An expandable accordion. Expanding shows all information about data point. Not expanding
shows preview.
3. Pagination controls for moving between pages in the output view.
4. Click button to minimize accordion.


