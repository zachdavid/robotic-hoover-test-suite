Hi there - thanks for reviewing my submission for the challenge to test the robotic vacuum cleaner service.  

Prereq: Service is running locally on port 8080
To run:
1. Clone this repository and `cd` in to it
2. `npm i` to install dependencies
3. `npm test`

Bug report is located at `bugs.md`

Questions for product located at `product_questions.md`

All test cases located in `room_cleaning_test.js`.  These may be broken down differently depending on answers to a few questions, and which bugs were technically related.  I put all failing tests towards the bottom of the file for now.

I went with the standard XML mocha reporter, results can be found in `output` directory after running 

`npm run test:report` 


Depending on use case we might want to add html reporting or leverage a different tool as well.  Most standard CI configurations will work best with the Junit style reporting, so felt appropriate to include as a starting point.

Lastly this could likely be split up across test files and organized a bit better, perhaps with a data driven approach after understanding which bugs are related, and/or in the same repo as the source code.  For now I opted for simplicity with one file/folder.  Looking forward to talking through this together! 