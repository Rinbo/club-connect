# Club Connect (remix)

## Work log
-  Consider a deleted flag on all image-urls in db. Then have a worker run once an hour to find all images with a deleted flag and delete them from s3.
## Team members
- On team main page where all team members are listed:
  - Each user has a delete button next to it. Pressing it brings upp modal to confirm. Also allow for mass deletion by clicking on checkboxes (but do that later)
  - Each user has a Role column. Admins can click an edit button that brings upp a dropdown where it can be changed, and saved with a small checkbox icon (as in confluence)
  - Adding a user is done with an Add button in context menu. This brings upp a modal where you can search for all club members and select them.
    - When selected they get added to a list where on can choose their role.
  - There should also be a join button for each team where any club member can join and get default role Observer
  - Parents are also able to add their children to a team, but only as player.
