const fs = require('fs');
const path = require('path');

const seedPath = path.join(__dirname, '../seed.js');
let content = fs.readFileSync(seedPath, 'utf8');

const searchStr = `                    {
                        type: "regex",
                        expected: "console\\\\.log\\\\s*\\\\(\\\\s*['\\"]Level 13 Complete['\\"]\\\\s*\\\\)",
                        message: "You must log: Level 13 Complete"
                order: 13
            }
        ];`;

const replaceStr = `                    {
                        type: "regex",
                        expected: "console\\\\.log\\\\s*\\\\(\\\\s*['\\"]Level 13 Complete['\\"]\\\\s*\\\\)",
                        message: "You must log: Level 13 Complete"
                    }
                ],
                difficulty: "hard",
                order: 13
            }
        ];`;

if (content.includes(searchStr)) {
    content = content.replace(searchStr, replaceStr);
    fs.writeFileSync(seedPath, content, 'utf8');
    console.log("SUCCESS: seed.js has been successfully fixed!");
} else {
    console.log("ERROR: Target search string was not found in seed.js.");
    
    // Let's do a more robust regex-based fix
    const regex = /validationTests:\s*\[\s*\{\s*type:\s*"styleMatch"[\s\S]*?message:\s*"You must log: Level 13 Complete"\s*order:\s*13\s*\}/;
    if (regex.test(content)) {
        console.log("Found pattern using robust regex. Fixing...");
        const matched = content.match(regex)[0];
        const fixed = matched.replace(
            `message: "You must log: Level 13 Complete"\r\n                order: 13`,
            `message: "You must log: Level 13 Complete"\r\n                    }\r\n                ],\r\n                difficulty: "hard",\r\n                order: 13`
        ).replace(
            `message: "You must log: Level 13 Complete"\n                order: 13`,
            `message: "You must log: Level 13 Complete"\n                    }\n                ],\n                difficulty: "hard",\n                order: 13`
        );
        content = content.replace(matched, fixed);
        fs.writeFileSync(seedPath, content, 'utf8');
        console.log("SUCCESS: seed.js has been fixed via robust regex!");
    } else {
        console.log("FAIL: Even regex could not find the pattern.");
    }
}
