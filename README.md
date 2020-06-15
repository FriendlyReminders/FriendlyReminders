Stay Social.


## Inspiration
The lack of social interaction during the COVID-19 pandemic.
## What it does
Connects to a user's contacts and sends daily reminders to text a "person of the day".  Provides ideas for subject topics and has shortcuts to calling and texting those contacts.
## How we built it
We built a PWA which uses cached databases and notifications from firebase.
## Challenges we ran into
This was our first hackathon, and while we thought this idea would be fairly easy to implement, it was anything but.  Indexed DB was based on asynchronous functions which was something we had never seen before, leading to many conflicts with ordering.
PWA's did not support two features that were necessary for this project - sharing icons over the contact picker api and sending scheduled notifications.  Both of these features are in development but not accessible for the public.
Finally, the contact picker API, one of the hearts of our project, only worked on mobile AND over HTTPS.  Due to this, we weren't able to easily debug using the console, and every code change we wanted to see had to be pushed to Github, which significantly slowed down progress.
# Accomplishments that we're proud of
Getting an actual functional product.
## What we learned
We learned how to follow and implement apis, debug various problems, and come up with ingenious solutions for technological problems.
## What's next for Friendly Reminder
Once icon support and scheduled notifications are released to the general public, we will implement these features.  We are planning to add more statistics features in the future, and make the UI more intuitive.
