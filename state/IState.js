const required = () => { throw new Error("Implement"); }

const IState = {
  // Read only getter for state.
  getState: required,
  // Converts state to string.
  export: required,
  // A function that, given the old state and a new value, makes a change to the underlying state.
  setState: required,
}

module.exports = IState;
