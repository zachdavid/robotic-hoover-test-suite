## Bugs
1. Patch cleaned count increments sporadically 
   
   Description: Dirt patch count is incorrect for many scenarios.  This is a tricky bug to track down exactly what's happening without being able to see the source code.  I believe the issue is that a patch of dirt is added to the cleaned count any time the sum of the vacuum position's coordinates modulo 0 the sum of the patch coordinates.  

    ```Scenario("can end on a patch of dirt")```
    ```Scenario("returns no patches when none were cleaned")```
    
    Steps to reproduce:
    ```
    curl --location --request POST 'http://localhost:8080/v1/cleaning-sessions' --header 'Content-Type: application/json' --data-raw '{ "roomSize": [4, 4], "coords": [2, 2], "patches": [[3, 3]], "instructions": "W" }'
    ```
    Expected: `{"coords": [1, 2],"patches": 0}`
    Actual: `{"coords": [1, 2],"patches": 1}`
   ## Interesting to note that directions "N" will also reproduce an extra patch to the count, but directions "E" or "S" properly return 0 patches cleaned
&nbsp;

1. Title:Cleaned patch of dirt is counted more than once.
   
   Description: If the vacuum drives over a patch of dirt that has previously been cleaned, the service should not count that as an additional patch in the returned response.  This test case is always needed, but could be a result of bug 1

   ```Scenario("does not count cleaned patch twice")```


   Steps to reproduce: Drive the robot vacuum over a patch of dirt that has previously been cleaned 
   ```
   curl -H 'Content-Type: application/json' -X POST -d '{ "roomSize" : [5, 5], "coords" : [1, 2], "patches" : [ [1, 0], [2, 2], [2, 3] ], "instructions" : "NNESEESWNWW" }' http://localhost:8080/v1/cleaning-sessions     
   ```
   Expected: `{"coords":[1,3],"patches":1}`

   Actual: `{"coords":[1,3],"patches":3}`
&nbsp;

3. Starting in origin adds an extra patch to the cleaned count
   
    Description: Starting at 0,0 adds an extra clean count. This may be related to bug number 1, but definitely worth retesting after the fix is implemented

    ```Scenario("can start in origin")```

    Steps to reproduce: Start the robot vacuum in the origin (0, 0)
    ```
    curl -X POST 'http://localhost:8080/v1/cleaning-sessions' --header 'Content-Type: application/json' --data-raw '{ "roomSize": [2, 2], "coords": [0, 0], "patches": [[1, 1]], "instructions": "N" }'
    ```
   Expected: `{"coords":[0,1],"patches":0}`

   Actual: `{"coords":[0,1],"patches":1}`
&nbsp;


4. Skidding in place will add an extra count to the cleaned patches return value

    Description: Boucing vacuum off wall will result in incorrect clean count. Again, this may be related to bug number 1, but definitely worth retesting after the fix is implemented 

    ```Scenario("skids in place when instructed to go outside room boundary")```

   Steps to reproduce: Bounce the vacuum off of a wall
   ```
    curl -X POST 'http://localhost:8080/v1/cleaning-sessions' --header 'Content-Type: application/json' --data-raw '{ "roomSize": [4, 4], "coords": [1, 1], "patches": [[2, 2]], "instructions": "NNNNN" }'
    ```
   Expected: `{"coords":[1,3],"patches":0}`

   Actual: `{"coords":[1,3],"patches":2}`

&nbsp;

5. Starting in top right corner will result in incorrect patch count

    Description: Similar to origin bug, starting in the maximum value of both coordinates will result in incorrect clean count. Again, this may be related to bug number 1, but definitely worth retesting after the fix is implemented 

    ```Scenario("can start in top right corner")```

   Steps to reproduce: Start at top right corner
   ```
    curl -X POST 'http://localhost:8080/v1/cleaning-sessions' --header 'Content-Type: application/json' --data-raw '{ "roomSize": [2, 3], "coords": [1, 2], "patches": [[1, 0]], "instructions": "WSE" }'
    ```
   Expected: `{"coords":[1,1],"patches":0}`

   Actual: `{"coords":[1,1],"patches":3}`

&nbsp;

6. Invalid patch position and room size are not properly treated as bad requests

    Description: Entering a negative value for the room size or patch position coordinate does not make sense.  Likely the service should return a 400, but left this on the product_questions.md file as well

   ```Scenario("does not allow starting point outside of bounds")```

   Steps to reproduce: set room size or patches as a negative number
      ```
       curl -X POST 'http://localhost:8080/v1/cleaning-sessions' --header 'Content-Type: application/json' --data-raw '{ "roomSize": [-2, 3], "coords": [1, 2], "patches": [[-1, 0]], "instructions": "WSE" }'
       ```
      Expected: `Status Code: 400`

      Actual: `{"coords":[0,1],"patches":2}`