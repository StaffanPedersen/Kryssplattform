This app have been tested on the following devices: ios ,android(emulator and mobile hone) and web(crome),
it have been developed using react native and expo, the editor used is intellij idea.

App functionalities:
The welcome page is the the first page that shows the posts.
This list is meanth to be seen mostly for he image part at this stage.
The posts are limited with information, and limits the viewer to see some information.

A large login button is shown at the bottom of the page, this button will take the user to the login page for authentication.
 here it is possible to either log inn or register a new user, that is stored in firebase.

 registered users are user1@post.no
 password: 123123

 this authentication takes the user to the encapsulated area for authenticated users.
 AuthSessionProvider is used to keep the user logged in this secure area.

 In this are is the home area. here the bottom tab provides a navigation for the user to
 profile page to see the user information, or logg out.

 home page show the other postdetails that shows all information about the post,
 here the user can see the post, and the comments that are related to the post, add likes.
 New entries from users are stored with a unique id, and is only able to interact with post and comments that are related to the user id,
 this allows multiple comments on posts from all registered users and users are only allowd to delete their own post. same logic goes for deleting posts.

map functionality shows the geo location of the post, and the users can see the location on the map.
