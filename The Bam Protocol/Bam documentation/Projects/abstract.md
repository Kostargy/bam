In the B.A.M protocol a project is a collection of files and links, the abstract containing the breaf of the project and actions

### Project file structure
 ```
 project
│   abstract.md
│   actions.txt
│
└───attachments
│   │   links.txt
│

└──sub project
|    │   abstract.md
|    │   actions.txt
|    |___attachments
└──Brainstorming
    │   abstract.md
    │   actions.txt
    |___attachments
        |
        |
 ```
#### Project Directory
The name of each project and subprojects directory is the title of the Project.
### Abstract.md
The **abstract.md** is a markdown text file containing the contents of the abstract.
### actions.txt
The **actions.txt** file is a log file containing all the next actions of a project. Only next action must remain open a specific point of time.
If there are more actions for a project that must be completed they must be split into sub projects. The next action sould not last more than 1.30 hours to complete.

The systax of the actions.txt
```
[x] A completed action //27-12-2019
[] The next action //27-12-2019
```
### Attachments directory
The attachment directory has all the files that are connected and referenced in a given project.
### Sub Projects
The sub projects have exaclty the same file structure as the parent Project. A project can be broken up into smaller sub projects with their own actions.
