const http = require('http');

function post(path, data) {
    return new Promise((resolve, reject) => {
        const postData = JSON.stringify(data);
        const options = {
            hostname: 'localhost',
            port: 3000,
            path: path,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(postData)
            }
        };

        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('end', () => resolve({ status: res.statusCode, body: body }));
        });

        req.on('error', (e) => reject(e));
        req.write(postData);
        req.end();
    });
}

function get(path, token) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 3000,
            path: path,
            method: 'GET',
            headers: token ? { 'Authorization': `Bearer ${token}` } : {}
        };

        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('end', () => resolve({ status: res.statusCode, body: body }));
        });

        req.on('error', (e) => reject(e));
        req.end();
    });
}

async function runTests() {
    console.log("Running Authentication Tests...");

    // 1. Test Unauthenticated Access
    try {
        const res = await get('/api/reports');
        if (res.status === 401) {
            console.log("✅ PASS: Unauthenticated access blocked (401)");
        } else {
            console.log(`❌ FAIL: Unauthenticated access returned ${res.status}`);
        }
    } catch (e) { console.error("Error:", e.message); }

    // 2. Test Wrong Password
    try {
        const res = await post('/api/login', { password: "wrong" });
        if (res.status === 401) {
            console.log("✅ PASS: Wrong password rejected (401)");
        } else {
            console.log(`❌ FAIL: Wrong password returned ${res.status}`);
        }
    } catch (e) { console.error("Error:", e.message); }

    // 3. Test Correct Password
    let token = null;
    try {
        const res = await post('/api/login', { password: "20034" });
        if (res.status === 200) {
            const data = JSON.parse(res.body);
            if (data.token) {
                token = data.token;
                console.log("✅ PASS: Correct password accepted, Token received");
            } else {
                console.log("❌ FAIL: No token in response");
            }
        } else {
            console.log(`❌ FAIL: Correct password returned ${res.status}`);
        }
    } catch (e) { console.error("Error:", e.message); }

    // 4. Test Authenticated Access
    if (token) {
        try {
            const res = await get('/api/reports', token);
            if (res.status === 200) {
                console.log("✅ PASS: Authenticated access with token succeeded (200)");
            } else {
                console.log(`❌ FAIL: Authenticated access returned ${res.status}`);
            }
        } catch (e) { console.error("Error:", e.message); }
    } else {
        console.log("⏭️ SKIP: Cannot test authenticated access without token");
    }
}

runTests();
