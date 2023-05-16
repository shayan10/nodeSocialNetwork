const app = require('./src/app');
const {connect} = require('./src/utils');

const PORT = 3000;

connect().then(() => {
    app().listen(PORT, () => {
        console.log(`Server started on port ${PORT}`);
    });
}).catch(error => console.log(error));