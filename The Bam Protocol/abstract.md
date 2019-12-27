# B.A.M (Brain Action Map) Protocol

## Abstract

The B.A.M is a Protocol for project management that consists of a set of rules on how
 to orginise your project's actions and resources. The B.A.M protocol utilizes a file structure that can be saved on cloud or locally.

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

