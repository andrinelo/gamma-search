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

#### Main View
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


#### Dataset Button View
The different operations a user may do with respects to a dataset button.

![dataset button view](https://i.gyazo.com/0ccf1db0c1d9db5b9ff4e3fba7e7f823.png)

1. Opens the filter view
2. Opens the relations view
3. Opens the property table view
4. Opens the inspect dataset view
5. Opens the aggregate view


#### Filter View
Used to filter out data points/data nodes from a dataset.

![filter view](https://i.gyazo.com/b59dd580cfd6ca91c2ed540b2cf3465f.png)

1. Opens help menu, containing information about the Filter view
2. Close the filter view, discarding all changes. Leads to the main view.
3. Deletes filter
4. Text entry field with autocomplete and a dropdown with options, the value that 6 is checked against
with respects to the selected equality operator in 5
5. A selection of equality operators, =, !=, >, ≥, < and ≤.
6. Text entry field with autocomplente and a dropdown with options, the property of the data
points/data nodes that is checked against 4 with respect to the equality operator in 5
7. A button for adding another filter. When using several filters users have the option of selecting if
they want them to be OR’ed together or AND’ed together. The AND operator has precedence,
meaning that the complex filters can be written in Conjunctive Normal Form.
8. Save changes. Leads to the main view.


#### Relations View
Used for moving through relations of a dataset to define a new dataset. Creates a new dataset in
the main view.

![relations view](https://i.gyazo.com/e0eeaa9bb6d4179837a70339aaf37e0c.png)

1. Help button, clickable, shows info about relations view.
2. Closes relations view, discarding changes. Leads to the main view.
3. Defines whether incoming, outgoing, or incoming and outgoing relations are being selected.
4. Text entry field with autocomplete dropdown menu.
5. Delete button, deletes relation.
6. Adds another relation to move through for defining the next dataset.
7. Applies changes. Leads to the main view.

#### Property Table View
Allows user to define which columns they wish to see in a table-view.

![property table view](https://i.gyazo.com/246bcaa31e894db9699eb0b097f5388a.png)

1. Opens help menu containing information about property table view
2. Closes the property table view. Leads to the main view,
3. Text entry field where several entries can be entered, has autocomplete with dropdown menu options. Defines which properties of the dataset should be shown in the columns in 4.
4. The area where a table view is presented containing a row for each data point showing only the
properties selected as columns in 3.
5. Shows how many results there are
6. Pagination controls, go to previous/next page.


#### Inspect View
Allows the user to inspect the data points contained in a dataset. Relations are also included when
appearing between data points in the dataset for illustrative/informative purposes, but edges are not
part of the dataset.

![property table view](https://i.gyazo.com/e06244885e854abc06a01dcb2e504239.png)

1. Opens help menu containing information about the inspect view.
2. Closes the inspect view. Leads to the main view.
3. Shows information about nodes selected in 10 as a scrollable text field in JSON-format.
4. Shows information about edges selected in 10 as a scrollable text field in JSON-format.
5. Pagination controls for 3 and 4.
6. A data node/data point. Can be selected by clicking or dragging and dropping in 10, info shows
up in 3 when selected, can be moved around.
7. An edge/relation between data points. Can be selected by clicking or dragging and dropping in 10,
info shows up in 4 when selected, can be moved around.
8. Shows gremlin query that returned the data points.
9. A dropdown menu with several graph layouts, allows users to change graph layout automatically
changing position of all nodes.
10. Graph area, contains the data points/data nodes and edges/relations. Supports drag and dropping,
zooming in and out and scrolling around the view.

#### Aggregate View
View for defining aggregate operations on data point properties such as finding a minimum or maximum
value.

![aggregate view](https://i.gyazo.com/7d87d87b1b95390a6c166886274436c4.png)

1. Opens help information about aggregate view.
2. Closes the aggregate view, discarding all changes. Leads to Figure 27.
3. Selects aggregation type: Count, Max, Min, Average, and Sum.
4. Selects which property the aggregate operation defined in 3 should be applied to.
5. Result of aggregation operation shows up here.
6. Shows gremlin query that returned the aggregation result.
