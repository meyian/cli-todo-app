/*

Improvements:
* Store on the harddrive
* Fix package.json
* Add tests
* The todo item ids should follow sequentially, no matter how much you delete
* Delete and insert at an index
* v2: the server running across the network

*/

const EventEmitter = require('events');

class Server extends EventEmitter{
  constructor(client){
    super();
    
    process.nextTick(() => {
      this.emit("response", "Type a command (help to list commands)");
    })

    this.tasks = {};
    this.taskId = 1;
    this.client = client;

    this.client.on('command', (command, args) => {
      switch (command){
        case "ls":
        case "help":
        case "add":
        case "delete":
          this[command](args);
          break;
        default:
          this.emit("response", "type 'help' for the list of commands");
      }
    });
  }

  toString(){
    return Object.entries(this.tasks).map(([key, value]) => `${key}. ${value}`).join("\n");
  }

  ls(){
    this.emit("response", `Tasks:\n${this.toString()}`);
  }

  help(){
    this.emit("response", `Available commands:
add task
ls
delete :id`);
  }

  add(args){
    this.tasks[this.taskId++] = args.join(' ');
    this.emit("response", `Added task ${this.taskId - 1}`);
  }

  delete(args){
    delete(this.tasks[args[0]]);
    this.emit("response", `Deleted task ${args[0]}`);
  }
}

module.exports = (client) => new Server(client);
