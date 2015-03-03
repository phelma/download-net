# download-net
A friendly 'botnet' for distributing and carrying out tasks.

Made up of 3 parts, Server, Client and Tasks

## Tasks
Each 'task' object is composed of

* **Type** - name of the type of task, e.g. 'imagenet-download'
* **Manifest** - a list of instructions for the script to execute,
* **Script** - self contained npm module that takes a task type and manifest and carries out the task. npm looks for modules in a few places, I am using github e.g. `phelma/url-downloader`

## Server

Contains a databse of tasks, tasks look like this
```JSON
{
  "_id": "54f47d1726e5d6ee1a01cafd",
  "priority": 1,
  "status": "accepted",
  "manifest": "public/manifests/test-manifest.txt",
  "script": "phelma/url-download",
  "type": "url-download",
  "__v": 0,
  "startTime": "2015-03-02T16:41:38.652Z",
  "endTime": "2015-03-02T16:28:48.576Z",
  "user": "54f47d836f3cbd562ade7a0e"
}
```


## Client
Communicates with server via REST api.
Gets username, checks tasks for that user, gets a task, gets the task script, executes the task script on the tesk manifest, starts again.
