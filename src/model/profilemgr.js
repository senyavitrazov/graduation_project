const path = require('path');
const fs = require('fs-extra');
const { FileStorage } = require('./storage.js');

const FILES_PATHS   = {
  DIRECTORY: 'data',
  POFILE_FILE_NAME: '/profiles.json',
  PROJECTS_FILE_NAME: '/projects.json',
}

//SHOULD I CHANGE IT AFTER BUILDING????

const storageDirectory = path.join(__dirname, FILES_PATHS.DIRECTORY);
const profilesFilePath = path.join(storageDirectory, FILES_PATHS.POFILE_FILE_NAME);

/**
 * Adding array or one profile to end of file
 *
 * @param {Array} profilesData - array of users .
 * @returns {void}
 */

exports.exportProfilesArray = async (profilesData) => {
  try {
    await fs.ensureDir(storageDirectory);

    const storage = new FileStorage(profilesFilePath);
    const existingProfiles = await storage.get('profiles') || [];

    if (typeof profilesData === 'object' && !Array.isArray(profilesData)) {
      profilesData = [profilesData];
    } if (Array.isArray(profilesData)) {
      existingProfiles.push(...profilesData);
    } else {
      console.error('Invalid profilesData format. Expecting an object or an array of objects.');
    }

    await storage.set('profiles', existingProfiles);

    console.log('Profiles have been successfully exported');
  } catch (err) {
    console.error('Exporting profiles error:', err);
  }
};


/**
 * Rewrite all in profile file
 *
 * @param {Array} profilesData - array of users .
 * @returns {void}
 */

exports.exportProfiles = async (profilesData) => {
  try {
    await fs.ensureDir(storageDirectory);

    const storage = new FileStorage(profilesFilePath);
    await storage.set('profiles', profilesData);

    console.log('Profiles have been successfully exported');
  } catch (err) {
    console.error('Exporting profiles error:', err);
  }
};


exports.importProfiles = async () => {
  try {
    await fs.ensureDir(storageDirectory);
    const storage = new FileStorage(profilesFilePath);
    const profilesData = await storage.get('profiles');

    if (profilesData) {
        console.log('Profiles have been imported successfully:', profilesData);
        return profilesData;
    } else {
        console.log('The profile file is empty.');
        return null;
    }
  } catch (error) {
    console.error('Importing profiles error:', error);
    return error;
  }

};

