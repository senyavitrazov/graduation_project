const fs = require('fs-extra');

class Storage {
  _fileName;

  // Constructor to initialize the instance with a file name
  constructor(fileName) {
    this._fileName = fileName;
  }

  // Asynchronous method to get the value associated with a key
  async get(key) {
    const pth = this._fileName;

    try {
      // Check if the file exists
      if (await fs.pathExists(pth)) {
        // Read the file asynchronously
        const rawdata = await fs.readFile(pth, 'utf-8');

        // Parse the JSON data if the file is not empty
        if (rawdata !== '') {
          const data = JSON.parse(rawdata);
          return data[key];
        } else {
          return null; // Return null if the file is empty
        }
      } else {
        return null; // Return null if the file doesn't exist
      }
    } catch (error) {
      console.error('Error reading the file', error);
      return null; // Return null in case of an error
    }
  }

  // Asynchronous method to set a key-value pair in the file
  async set(key, value) {
    const pth = this._fileName;

    try {
      let data = {};

      // Check if the file exists
      if (await fs.pathExists(pth)) {
        // Read the file asynchronously and parse its content
        const rawdata = await fs.readFile(pth, 'utf-8');
        if (rawdata !== '') data = JSON.parse(rawdata);
      }

      // Set the new key-value pair
      data[key] = value;

      // Write the updated data to the file asynchronously
      await fs.writeFile(pth, JSON.stringify(data));
      return true; // Return true on successful write
    } catch (error) {
      console.error('Error writing to the file', error);
      return false; // Return false in case of an error
    }
  }
}

module.exports = { Storage };
