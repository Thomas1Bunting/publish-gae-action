const fs = require('fs');
const core = require('@actions/core');
const yaml = require('js-yaml');
const deepmerge = require('deepmerge');

/**
 * Add support for updating environment variables with actions secrets
 *
 */
try {
    console.log(core.getInput('gae_config_path'));
    console.log(__dirname);
    const fs = require('fs');

    fs.readdir(__dirname, (err, files) => {
      files.forEach(file => {
        console.log(file);
      });
    });
    
    const gaeConfigPath = core.getInput('gae_config_path') || './app.yaml';
    const fileContents = fs.readFileSync(__dirname + '/' + gaeConfigPath, 'utf8');

    let data = yaml.safeLoad(fileContents);

    // @todo Only run this if the user wants to
    const secrets = core.getInput('gae_variables');
    if (secrets) {
        const secrets_buffer = Buffer.from(secrets, 'base64');
        data = deepmerge(data, JSON.parse(secrets_buffer.toString()));
        let yamlStr = yaml.safeDump(data);
        console.log(yamlStr);
        fs.writeFileSync(gaeConfigPath, yamlStr, 'utf8');
    }

} catch (error) {
    core.setFailed(error.message);
}

try {
    const service_account_key = core.getInput('service_account_key');
    const buf = Buffer.from(service_account_key, 'base64');

    fs.writeFile('./client-secret.json', buf.toString(), function (err) {
        if (err) {
            console.error(err);
        } else {
            console.log('write success.');
        }
    });
} catch (error) {
    core.setFailed(error.message);
}
