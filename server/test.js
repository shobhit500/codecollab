const axios = require('axios');
axios.post('http://localhost:5000/compile', {
    code: 'print("Hello World!")', 
    language: 'python3'
}).then(r => console.log('PYTHON OUTPUT:', r.data)).catch(e => console.error('ERROR:', e.response?.data || e.message));
