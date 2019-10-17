const express = require("express")
const os = require("os")
const cluster = require("cluster") 

const PORT = process.env.PORT || 5000

// Then we create a variable called clusterWorkerSize to represent the number of CPUs the system has
const clusterWorkerSize = os.cpus().length

// Using the clusterWorkerSize value, we create an if...else statement that checks whether or not the system has 
// more than one CPU core
if (clusterWorkerSize > 1) {

    // Assuming our machine has more than one CPU, the first thing we do is create another if...else statement 
    // that checks whether or not this is the first process in the cluster that has run
    if (cluster.isMaster) {
      for (let i=0; i < clusterWorkerSize; i++) {
        // If that is the first process that has run, we use cluster.fork() to spawn a new worker process 
        // for each of the CPU's that exist on the machine
        cluster.fork()
      }

    // And we also add an event listener that will log a message when a worker exits so we know when something goes
    // wrong or unexpected.
      cluster.on("exit", function(worker) {
        console.log("Worker", worker.id, " has exitted.")
      })
    } else {
      const app = express()
   
      app.listen(PORT, function () {
        console.log(`Express server listening on port ${PORT} and worker ${process.pid}`)
      })
    } 

}

