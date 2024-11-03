00000000000000000000000000000000000000000000000000000000000000000000000000000000
# Track CPF

## Track Calories, Protein, Fibre
A simplified nutrition tracker. Each user has their own personalised Postgres 
database to avoid the selection of food items from becoming overwhelmed by items
that other users have entered which you may never need to use yourself.

A daily diary is maintained, each day presents Apple Watch style rings as the
user completes their protein and fibre goals for the day -- goals which
are adjusted based on their goals and weight/height as entered on the settings
page.

## Usage
Clicking the user's email address at the top left hand side of a logged in
account will access the settings. This allows you to enter details about
your height, weight, and preferences regarding how your protein/fibre goals
are calculated, as well as preferences on how the app displays.

The diary date is displayed front and centre on the app. From here you can
navigate backwards to previous days, or forward to future days (useful for
entering tomorrow's lunch if you make it the night before). 

Entering a straighforward new food item is as simple as typing it into the
dropdown box. You will be presented with a minimum of two options, to enter
the food per 100g (if you are weighing your food and entering it from a
nutritional chart on a package) or to enter it per serving (if you are entering
an item from a restaurant where you only know the total, for example).

Selecting either of these will open the modal to enter this item, prompting
for the calories, protein, and fibre of the item, either per 100g or per
serving, and will also prompt for either the weight of the item eaten or
the number of servings eaten.

If it is enabled in the settings there will also be a dropdown to assign a
number of Plant Points to the item. 

As you type into the search bar all previous entries will be searched
and presented to you, so as you slowly build your food database you will
have to manually enter information less often over time. 

Items that are entered per 100g can be modified after entry, i.e the
amount you have eaten can be changed. Items that are entered per serving
can not be, to avoid mathematical errors. 

Below the food diary the rings for Protein and Fibre are displayed, 
they automatically complete throughout the day and display the total
goal for the day below them. Note that there may be a rare instance where
the ring reads as complete (i.e. 50g/50g) but is not visually complete. This
is because the target protein is displayed rounded in text format but is
maintained as the full number for the purpose of calculating the ring. In
other words, you may see 50g/50g displayed if your goal is 50.4g of protein
for the day, which will not complete the ring.

## Recipes
Coming Soon (Feature implemented, readme not)

## Food Database
Coming Soon (Feature implemented, readme not)
