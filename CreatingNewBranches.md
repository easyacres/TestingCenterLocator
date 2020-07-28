
## Git commands for creating and pushing new branches

- git checkout -b new_branch_name = create new branch (make sure there are no spaces in the name)

- git branch = shows all current branches

- git branch -v = shows all current branches and commits

- git checkout branch_name = move to branch_name 

- git checkout master = move back to master

- git push -u origin branch_name = push this branch to GitHub

 ## Workflow

- Try not to work on the master branch
- Before working on new features make sure you are on the master branch's latest version (git pull origin master)
- Then create a new branch by using the git checkout command (git checkout -b new_branch_name)
- If you happened to work on the master branch before creating a new branch do not pull! first create a new branch then pull!
- Work on your branch and make sure to commit often

- Once you are ready to merge your contributions to the master do as follows:
    1. Git pull origin master to pull the latest version of the master into your local branch
    2. Fix any merge issues that may pop up
    2. Push your branch to GitHub (git push -u origin branch_name)
   
- From there we can merge the new brach with the master through GitHub!

- When youre ready to work on a new feature just move back to the master (git checkout master)
- Rinse and repeat!



