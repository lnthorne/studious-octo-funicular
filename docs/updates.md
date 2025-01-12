# Progress Updates

### Aug 21, 2024

- Very rough draft of what needs to be done for the homeowner
- Current user flow: welcome -> login/signup -> (tabs) home, create post, logout
- **What needs to be done next:** Need to create a seperate user for companies, they need their own login after the welcome page, their own homescreen and be able to view the posts from the homeowner.

### Aug 22, 2024

- Created two sets of users, homeowner and companyowner
- Note: When logging out of either homeowner or companyowner, you are brought directly back to the wolcome page. The user is null and thus the user type is null. Figure out a way when logging out you stay in the right path
- The companyowner can now view posts and bid on the posts. The companyowner can also view their current open bids
- The homeowner can now get an overview of the bids on their current jobs
- I like the idea of the **Glassmorphism** for the look and feel of the app. Try to find some libraries. (https://youtu.be/ao2i_sOD-z0?si=p2vrcDAdnbq_v8oP)
- **What needs to be done next:** The homeowner should be able to look at their open job postings and see the bids that have been made. The homeowner can then decline or accpet the bids. The companyowner can view past bids and current open bids. There needs to be a full screen for viewing bids from the homeowner. Also, need some database rules (deletion, waterfall)

### Aug 23, 2024

- Updated and corrected the file structure and routing
- Homeowner can now accept bids. When a bid is accepted the post is set to in progress and all other competeing bids are set to rejected.
- The companyowner can now click on his bids and view the details of both the job and the bid. Also, new modal for bidding on a job. When you bid on a project, you can no longer view it in the "View Posts" page. It gets moved to the home screen
- **What needs to be done next:** Need some database rules (deletion, waterfall), abilty to upload multiple photos per job posting, completing the schema for our data, I want the homeowner to be able to send a DM to the company when they are checking out the bids (NOTE: only the homeowner can start the conversation)

### Aug 24, 2024

- Build is not working for some reason
- [LandScapeConnect24] Compiling JS failed: 90900:3:export declaration must be at top level of module Buffer size 7817910 starts with: 766172205f5f42554e444c455f535441
- What I have done to try to fix:
  - Removed .expo, ios, android dir's and re-built. Removed caches and re installed NPM packages.
  - Maybe something to do with expo router? Maybe something to do with Metro bundling. Here is a link that was brought up in a post that helped debug an issue where there was no index in the root(http://localhost:8081/index.bundle?platform=ios&dev=true&minify=false&modulesOnly=false&runModule=true). NOTE: I did change in the app.json the entry point.

### Aug 29, 2024

- For whatever reason I made a completely fresh build, copied the files over and both android and ios work? WTF.
- The android sim cannot connect to the wifi, still need to work that out
- I chose RNUILib (https://wix.github.io/react-native-ui-lib/docs/components/media/AnimatedScanner) as the UI library. I might actually scrap it and just use style sheets due to AI
- Created student figma account, also looked into AI UI designers. I liked galileo (https://www.usegalileo.ai/create/2a4cc4ae-5409-47c3-8a53-3cb119ed00b8) but will look into more

### Sep 5, 2024

- Have been building the styling of the app offline. I installed RNUILib but I find that its just too much. Currently just using stylesheets as I found that was easiest to implement with figma designs. I have the user onboarding set up in the style and homeowner login/signup set in the current design. Not entirely sold on it but gonna have to do. I will be implementing a design system and breaking out the indiviual components.
- Gonna take a pause on the UI stuff and discuss with others. In the meantime, I want to work on the functionality. Current choices are: App wide user context, DB schema, in-app messaging, uploading and displaying mutliple photos at time, filtering by postal code.
  - Setting up app wide user context.
  - Created global user context. Data is set in the userContextWrapper

### Sep 6, 2024

- Now support mutiple photos for a job posting
- I believe I will home roll a messaging server for direct messaging. Seems quite straight forward. Throw it in a container or run directly on GCP
- Looking into services for chat as well
  - Cometchat
  - Stream (looks super robust, expensive as fuck)
  - Firebase realtime data
  - Going to be using RTDB from firebase
- Ended up going with firebase RTDB

### Sep 7, 2024

- I have a very rough draft of direct messaging working!! Two users can now message each other (Just homeowners). We are using RTDB to store the messaging. The code is very dirty so need to clean that up. Check for effeciency, look into caching old messages on device and effecient queries

### Sep 9, 2024

- Fixed the IMessage interface and added the ability to have messages marked as read.

### Sep 10, 2024

- For future we need to add notifications for:
  - Messaging
  - New Bids (Homeowner)
  - New Jobs (Companyowner)
  - Bid status (Companyowner)
- Want to get reviews done, project completion, jobs in progress, then we can cement in the schemas for the DB and set the rules
- Requirments for reviews:
  - As a homeowner, before accpeting a bid, I would like to see a rating of the company from past jobs. This rating will be out of 5 stars and can be view when selecting the bid. As a homeowner, I would also like to see comments from other users from the companies previous jobs. In these comments, I would like to see photos. These comments can be viewed when select the bid.
  - As a homeowner, when the job is completed, I would like be asked to leave a rating and comment on the job. I would like to be asked of this when I say that the job is done (Some button on the job screen)
- Note: When the homeowner is viewing bids, they can then send a message to the company owner.
- Look into making bid details a modal instead of an entire page. We can then send the bid object as a prop to it and save on requests

### Sep 11, 2024

- When the homeowner sends the first messsage, I would like the UI to look like when you're sharing something throught text on iOS. So you just have keyboard and mini modal from top of screen to send message.
- When the user creates a new conversation, we should check if they already have one open. If so we just bring them to that convo. Done

### Sep 14, 2024

- Fixed issue where the keyboard would be in the way of text inputs and messaging bubbles
- Homeowner can now view different stages of their jobs (open, in progress, closed)
- We have basically alot of repeated useEffect hooks fetching the same data, we should look into breaking those out into reuasble functions
- Need to add the new home page in the companyowner section, as well as set the job completion for them. I then want to go through each page and get the back buttons and routing correct.

### Sep 15, 2024

- Create a profile page for both homeowner/companyoowner
- Create review system and link with the companyowner profile
- Companyowner filter job postings by distance
- How do I build a release build instead of a debug

### Sep 18, 2024

- Updated xcode 16 which adds a flag for BoringSSL-GRPC. Update podfile with fix show here(https://stackoverflow.com/questions/78608693/boringssl-grpc-unsupported-option-g-for-target-arm64-apple-ios15-0)

### Sep 24, 2024

- Created figma designs with the help of galileo AI. Now importing all the fonts, styles and colours into our design system.
- Cannot get the colors to come through on components (CustomeButton and CustomText). I remember the only time I had it working was when I defined it in the app/ . I figured it would work here, because it is getting imported

### Oct 13, 2024

- Added in the flat list for viewing jobs
- Remove all the copied code, maybe we put everything into one screen then do a 'filter'
- WE HAVE TO CACHE THE DATA INCLUDING IMAGES
- Job Data fields to add: Budget, Start date
- Need to use API to convert Postal code to relative location

### Nov 2, 2024

- (We had to do this again) Updated xcode 16 which adds a flag for BoringSSL-GRPC. Update podfile with fix show here(https://stackoverflow.com/questions/78608693/boringssl-grpc-unsupported-option-g-for-target-arm64-apple-ios15-0)
- Images are huge, and we need to compress them, should be below 1mb. Having issues importing expo package

### Nov, 20, 2024

- The fonts are popping in on load. We need to wait for the font to load before we render the page, otherwise we get this weird pop in

### Nov, 22, 2024

- RNULIB has a bunch of pre made shit tha you made and its better. Go back and clean that up. Then proceed with Firebase Geostore for lat/long queries

### Dec 21, 2024

- With the new sign up profile picture, there is an issue where if I create the new profile, the profile gets created. But the auth service doesnt navigate us to the homepage. If I comment out the profile image it works, so something to do with the new service. Actually, we dont even get signed into the new account.

### January 6, 2025

- Set a time limit for bids, after 30 days of sitting in pending it gets sent to rejected.
