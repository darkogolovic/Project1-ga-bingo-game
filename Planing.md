* **My choice is Bingo game**

* **Pseudocode:**

Start the game

Display a grid of numbers from 1 to 48

Allow the player to click and select exactly 6 numbers
Once the player has selected 6 numbers:
Enable the Start button

When the player clicks Start:
Create an empty list of drawn numbers
Create an empty list of the player's hit numbers

While the number of drawn numbers reach 35:
Randomly draw a number from the drum
Add it to the list of drawn numbers
Show an animation for the drawn number on the screen

If the number is among the player's 6 numbers:
  *  Add it to the list of hit numbers
  *  Record the draw order (position)

If the player has all 6 numbers hit:
    Stop the drawing
Calculate the multiplier:
* Maximum multiplier if all 6 numbers were drawn in the first  6 draws
* Minimum multiplier if the last of the player's numbers is drawn at the end
* Multiplier decreases the longer the drawing takes
Declare the player as winner
Display the won multiplier
End the game

If 35 draws are completed and the player does not have all 6 hits:
    * Player loses
    * Show result and option to start a new game
