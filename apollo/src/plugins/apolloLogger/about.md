This is a simple logger middleware for local development. It provides information for each incoming network request, much like Morgan for ExpressJS.


The logger fires any time GQL Playground inspects the endpoint. Because of the size of the inspection query, the terminal tends to get filled with unnecessary information. That information has been left out of the info string to keep the information concise.
