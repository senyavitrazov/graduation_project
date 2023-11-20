const path = require('path');
const fs = require('fs-extra');

const FILES_PATHS   = {
  DIRECTORY: 'data',
  POFILE_FILE_NAME: '/profiles.json',
  PROJECTS_FILE_NAME: '/projects.json',
}

exports.exportProfiles = async (profilesData) => {
  const storageDirectory = path.join(__dirname, FILES_PATHS.DIRECTORY);
  const profilesFilePath = path.join(storageDirectory, FILES_PATHS.POFILE_FILE_NAME);

  try {
    await fs.ensureDir(storageDirectory);

    const storage = new Storage(profilesFilePath);
    await storage.set('profiles', profilesData);

    console.log('Profiles have been successfully exported');
  } catch (err) {
    console.error('Exporting profiles error:', err);
  }
};


exports.importProfiles = async () => {
  const storageDirectory = path.join(__dirname, FILES_PATHS.DIRECTORY);
  const profilesFilePath = path.join(storageDirectory, FILES_PATHS.POFILE_FILE_NAME);

  try {
    await fs.ensureDir(storageDirectory);
    const storage = new Storage(profilesFilePath);
    const profilesData = await storage.get('profiles');

    if (profilesData) {
      console.log('Profiles have been imported successfully.');
      return profilesData;
    } else {
      if (profilesData !== null) {
        console.log('Profiles have been successfully imported:', profilesData);
        return profilesData;
      } else {
        console.log('The profile file is empty.');
        return null;
      }
    }
  } catch (err) {
    console.error('Importing profiles error:', err);
    return null;
  }
};

