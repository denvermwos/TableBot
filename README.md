# TableBot

Table Bot Interview Assessment

![TableBot screenshot](/images/screenshot.png?raw=true "Optional Title")

Bot Commands:
  * PLACE X,Y,F
        * This will put the toy robot on the table in position X,Y and facing NORTH, SOUTH, EAST or WEST.
        * The origin (0,0) can be considered to be the SOUTH WEST most corner.
        * The first valid command to the robot is a PLACE command, after that, sequence of commands may be issued, in any order, including another PLACE command. The application should discard all commands in the sequence until a valid PLACE command has been executed.any
  * MOVE
        * This will move the toy robot one unit forward in the direction it is currently facing.
  * LEFT
        * this will rotate the robot 90 degrees in the specified direction without changing the position of the robot.
  * RIGHT
        * this will rotate the robot 90 degrees in the specified direction without changing the position of the robot.
  * REPORT
        * this will announce the X,Y and F of the robot.
 
Installation:
  * Download repository as zip.
  * Unzip contents into a folder, preferably c:\inetpub
  * Open IIS Manager
  * Right click on "Sites" and then click on "Add website..."
  * Enter any site name eg. TableBot
  * Enter a unused port.
  * Select Physical path (this is the repository folder wherever you saved it on your hard drive).
  * Select ok and then start website.
  
