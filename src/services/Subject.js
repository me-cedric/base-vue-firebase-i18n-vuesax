/**
 * Class for a base subject to support observer pattern.
 */
function Subject () {
  /** The list of observers */
  this.observers = []
}

/**
 * Function to subscribe to the subject
 * @param cb, The callback to execute when the subject changes.
 */
Subject.prototype.subscribe = function (cb) {
  // Add the callback to the list:
  this.observers.push(cb)
}

/**
 * Function to unsubscribe all listeners of an event.
 * @param event, The name of the event to unsubscribe the listeners of.
 */
Subject.prototype.unsubscribe = function (event, cb) {
  // Re-assign the list:
  this.observers = []
}

/**
 * Function to notify the observers for this subject
 * @param args, The data to notify the observer with. Defaults to empty object.
 */
Subject.prototype.notify = function (args = {}) {
  // Loop over the list of observers:
  for (var index in this.observers) {
    // Get current callback:
    var currentCb = this.observers[index]
    // Execute callback with the given arguments
    currentCb(args)
  }
}

// Export the Subject
export default Subject
