Questions to ask product or tech lead:

1. Do we want to make the bad requests/400 response code errors return a body detailing what part of the request is incorrect? - the use case that comes to top of mind is lower case characters for the `instructions` field
2. How should the service behave if negative numbers are passed in for the room size or patch position
3. There are quite a few issues with improper patch cleaning counting.  Are there any more important than others?
4. How large of a room/set of directions should we test? There were enough bugs in this first pass that testing seemed extraneous for now