Foragers! 

DESCRIPTION: 

- The Foragers application allows you to record the mushrooms you find when "à la cueillette"!

- Designed "mobile first" with a high priority given to accesabilty to meet the needs of our users. 

- You can add a new mushroom, view your mushrooms, edit your mushrooms, delete your mushrooms and filter your mushrooms by name, species and date. 

TECHNICAL DETAILS: 

- The project includes 5 html files each with their respective js files. There are 5 "default" mushrooms stored in the mushrooms.json file. 

- The "default" mushrooms are accessed using fetch in a try catch block and then stored in localStorage (the fetch is only called again if the local storage is empty).

- The newentry page allows you to add a new mushroom using form validation.

- The foragers page displays your mushrooms and there are filter inputs so that you can sort your mushrooms by name, species and those mushrooms found between a start and end date. 

- Each mushroom displayed on the foragers page has an edit and a delete button. Clicking on these buttons takes you to the editDelete page where, making use of URL parameters, the information asociated with each mushroom can be modified or the mushroom can be deleted. 

- The homepage and map pages are not yet functional but it is possible to navigate to and away from these pages.  