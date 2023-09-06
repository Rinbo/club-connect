# Club Connect (remix)

## Work log
-  Consider a deleted flag on all image-urls in db. Then have a worker run once an hour to find all images with a deleted flag and delete them from s3.

## User activity log
  - Both for admins (admin stuff) and for users (delightful stuff) 


TeamActivity
    - Want it to be usable for both Competition and Training. With enum?
    - Each activity has a date and time
    - Each activity will need a way of checking who was present, how do I do that? One to many with clubUsers? Or many-to-many (probably)?
    
Teams will have to have training times for the schedule
    - But it might have many training times. How do you change it?
        - You change it by creating a new one or editing existing. 
    - Where do I edit it? As part of the edit team? No. Better to have a separate modal for it.
        - So you do this on team home page? Is that intuitive?
        - I don't like it. Or maybe put it there at first and see if it fits better somewhere else later?
    - Will training time have any relation to activity? (I would say no)

- Add two sections to schedule tab. One for adding training times. And one for adding activities.
  - In the schedule it would be nice if a training event could be synced with an activity. 