# Slack Emoji Leaderboard


## Run

1. ensure `direnv` and `asdf` are installed
2. clone this repo, cd into it, `direnv allow`
3. `make scrape`
   1. click "step over" (F10) in playwright
   2. log in to your Google account
   3. scroll to the bottom of the slack custom emojis list
4. `make process`
5. check console output or `leaderboard.txt`


## FAQs

#### Wtf?
Right?

#### Why not use the slack API like a normal person?
We require slack apps to be "approved" by an admin and I didn't want to wait

#### The code is shit
Yep.
