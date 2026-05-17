const mongoose = require('mongoose');
const Level = require('./models/level.js');

mongoose.connect('mongodb://127.0.0.1:27017/kroma')
    .then(async () => {
        console.log("Connected to MongoDB");

        await Level.deleteMany({}); // Clear existing levels

        const exercises = [
            // ─────────────────────────────────────────────
            // LEVEL 1 – Your First Heading
            // ─────────────────────────────────────────────
            {
                title: "Your First Heading",
                description:
                    "Every webpage starts somewhere. Your job is to create the most important heading on a page. " +
                    "Inside the <body>, add an <h1> element that says exactly: Hello, World!",
                initialCode: `<!DOCTYPE html>
            <html>
            <head>
                <title>My First Page</title>
            </head>
            <body>
                <!-- Write your heading here -->
            </body>
            </html>`,
                solutionCode: `<!DOCTYPE html>
            <html>
            <head>
                <title>My First Page</title>
            </head>
            <body>
                <h1>Hello, World!</h1>
            </body>
            </html>`,
                language: "html",
                validationType: "dom",
                validationTests: [
                    {
                        type: "selectorExists",
                        selector: "h1",
                        expected: "",
                        attributeName: "",
                        message: "You need an <h1> element inside the <body>."
                    },
                    {
                        type: "textContentMatch",
                        selector: "h1",
                        expected: "Hello, World!",
                        attributeName: "",
                        message: "The <h1> text must be exactly: Hello, World!"
                    }
                ],
                difficulty: "easy",
                order: 1
            },

            // ─────────────────────────────────────────────
            // LEVEL 2 – Headings & Paragraphs
            // ─────────────────────────────────────────────
            {
                title: "Headings & Paragraphs",
                description:
                    "Headings organise content, paragraphs carry it. " +
                    "Add an <h1> that says 'About Me', followed by a <p> that says 'I am learning HTML.'",
                initialCode: `<!DOCTYPE html>
            <html>
            <head>
                <title>About Me</title>
            </head>
            <body>
                <!-- Add your heading and paragraph here -->
            </body>
            </html>`,
                solutionCode: `<!DOCTYPE html>
            <html>
            <head>
                <title>About Me</title>
            </head>
            <body>
                <h1>About Me</h1>
                <p>I am learning HTML.</p>
            </body>
            </html>`,
                language: "html",
                validationType: "dom",
                validationTests: [
                    {
                        type: "selectorExists",
                        selector: "h1",
                        expected: "",
                        attributeName: "",
                        message: "Add an <h1> element to the page."
                    },
                    {
                        type: "textContentMatch",
                        selector: "h1",
                        expected: "About Me",
                        attributeName: "",
                        message: "The <h1> must say: About Me"
                    },
                    {
                        type: "selectorExists",
                        selector: "p",
                        expected: "",
                        attributeName: "",
                        message: "Add a <p> element after the heading."
                    },
                    {
                        type: "textContentMatch",
                        selector: "p",
                        expected: "I am learning HTML.",
                        attributeName: "",
                        message: "The <p> must say: I am learning HTML."
                    }
                ],
                difficulty: "easy",
                order: 2
            },

            // ─────────────────────────────────────────────
            // LEVEL 3 – Links
            // ─────────────────────────────────────────────
            {
                title: "Your First Link",
                description:
                    "Links are what make the web a web! " +
                    "Create an <a> element that shows the text 'Visit Google' and points to https://www.google.com. " +
                    "Make sure it opens in a new tab using the correct attribute.",
                initialCode: `<!DOCTYPE html>
            <html>
            <head>
                <title>Links</title>
            </head>
            <body>
                <!-- Add your link here -->
            </body>
            </html>`,
                solutionCode: `<!DOCTYPE html>
            <html>
            <head>
                <title>Links</title>
            </head>
            <body>
                <a href="https://www.google.com" target="_blank">Visit Google</a>
            </body>
            </html>`,
                language: "html",
                validationType: "dom",
                validationTests: [
                    {
                        type: "selectorExists",
                        selector: "a",
                        expected: "",
                        attributeName: "",
                        message: "Add an <a> element to the page."
                    },
                    {
                        type: "textContentMatch",
                        selector: "a",
                        expected: "Visit Google",
                        attributeName: "",
                        message: "The link text must be: Visit Google"
                    },
                    {
                        type: "attributeMatch",
                        selector: "a",
                        expected: "https://www.google.com",
                        attributeName: "href",
                        message: "The href attribute must be: https://www.google.com"
                    },
                    {
                        type: "attributeMatch",
                        selector: "a",
                        expected: "_blank",
                        attributeName: "target",
                        message: "Add target=\"_blank\" so the link opens in a new tab."
                    }
                ],
                difficulty: "easy",
                order: 3
            },

            // ─────────────────────────────────────────────
            // LEVEL 4 – Lists
            // ─────────────────────────────────────────────
            {
                title: "Shopping List",
                description:
                    "Lists are perfect for grouping related items. " +
                    "Create an unordered list (<ul>) with exactly three <li> items: 'Apples', 'Bananas', and 'Cherries'. " +
                    "Put a heading <h2> above the list that reads 'My Shopping List'.",
                initialCode: `<!DOCTYPE html>
            <html>
            <head>
                <title>Shopping List</title>
            </head>
            <body>
                <!-- Add your heading and list here -->
            </body>
            </html>`,
                solutionCode: `<!DOCTYPE html>
            <html>
            <head>
                <title>Shopping List</title>
            </head>
            <body>
                <h2>My Shopping List</h2>
                <ul>
                <li>Apples</li>
                <li>Bananas</li>
                <li>Cherries</li>
                </ul>
            </body>
            </html>`,
                language: "html",
                validationType: "dom",
                validationTests: [
                    {
                        type: "selectorExists",
                        selector: "h2",
                        expected: "",
                        attributeName: "",
                        message: "Add an <h2> heading above the list."
                    },
                    {
                        type: "textContentMatch",
                        selector: "h2",
                        expected: "My Shopping List",
                        attributeName: "",
                        message: "The <h2> must say: My Shopping List"
                    },
                    {
                        type: "selectorExists",
                        selector: "ul",
                        expected: "",
                        attributeName: "",
                        message: "Add an unordered list <ul> element."
                    },
                    {
                        type: "childCount",
                        selector: "ul",
                        expected: "3",
                        attributeName: "",
                        message: "The list must have exactly 3 <li> items."
                    },
                    {
                        type: "textContentMatch",
                        selector: "ul li:nth-child(1)",
                        expected: "Apples",
                        attributeName: "",
                        message: "The first item must be: Apples"
                    },
                    {
                        type: "textContentMatch",
                        selector: "ul li:nth-child(2)",
                        expected: "Bananas",
                        attributeName: "",
                        message: "The second item must be: Bananas"
                    },
                    {
                        type: "textContentMatch",
                        selector: "ul li:nth-child(3)",
                        expected: "Cherries",
                        attributeName: "",
                        message: "The third item must be: Cherries"
                    }
                ],
                difficulty: "medium",
                order: 4
            },

            // ─────────────────────────────────────────────
            // LEVEL 5 – Images
            // ─────────────────────────────────────────────
            {
                title: "Adding an Image",
                description:
                    "Images make pages come alive. " +
                    "Add an <img> element with the src set to 'https://picsum.photos/200' " +
                    "and an alt attribute that says 'A random photo'. " +
                    "Above the image, add an <h2> that reads 'My Favourite Photo'.",
                initialCode: `<!DOCTYPE html>
            <html>
            <head>
                <title>Images</title>
            </head>
            <body>
                <!-- Add your heading and image here -->
            </body>
            </html>`,
                solutionCode: `<!DOCTYPE html>
            <html>
            <head>
                <title>Images</title>
            </head>
            <body>
                <h2>My Favourite Photo</h2>
                <img src="https://picsum.photos/200" alt="A random photo">
            </body>
            </html>`,
                language: "html",
                validationType: "dom",
                validationTests: [
                    {
                        type: "selectorExists",
                        selector: "h2",
                        expected: "",
                        attributeName: "",
                        message: "Add an <h2> heading above the image."
                    },
                    {
                        type: "textContentMatch",
                        selector: "h2",
                        expected: "My Favourite Photo",
                        attributeName: "",
                        message: "The <h2> must say: My Favourite Photo"
                    },
                    {
                        type: "selectorExists",
                        selector: "img",
                        expected: "",
                        attributeName: "",
                        message: "Add an <img> element to the page."
                    },
                    {
                        type: "attributeMatch",
                        selector: "img",
                        expected: "https://picsum.photos/200",
                        attributeName: "src",
                        message: "Set src to: https://picsum.photos/200"
                    },
                    {
                        type: "attributeMatch",
                        selector: "img",
                        expected: "A random photo",
                        attributeName: "alt",
                        message: "Set alt to: A random photo"
                    }
                ],
                difficulty: "medium",
                order: 5
            },

            // ─────────────────────────────────────────────
            // LEVEL 6 – Simple Form
            // ─────────────────────────────────────────────
            {
                title: "Build a Contact Form",
                description:
                    "Forms let users send data. Build a contact form with: " +
                    "an <h1> that reads 'Contact Us', a <form> element containing " +
                    "a text <input> with name='name' and placeholder='Your name', " +
                    "an <input> with type='email', name='email' and placeholder='Your email', " +
                    "and a <button> of type='submit' with the text 'Send'.",
                initialCode: `<!DOCTYPE html>
            <html>
            <head>
                <title>Contact</title>
            </head>
            <body>
                <!-- Build your form here -->
            </body>
            </html>`,
                solutionCode: `<!DOCTYPE html>
            <html>
            <head>
                <title>Contact</title>
            </head>
            <body>
                <h1>Contact Us</h1>
                <form>
                <input type="text" name="name" placeholder="Your name">
                <input type="email" name="email" placeholder="Your email">
                <button type="submit">Send</button>
                </form>
            </body>
            </html>`,
                language: "html",
                validationType: "dom",
                validationTests: [
                    {
                        type: "selectorExists",
                        selector: "h1",
                        expected: "",
                        attributeName: "",
                        message: "Add an <h1> heading."
                    },
                    {
                        type: "textContentMatch",
                        selector: "h1",
                        expected: "Contact Us",
                        attributeName: "",
                        message: "The <h1> must say: Contact Us"
                    },
                    {
                        type: "selectorExists",
                        selector: "form",
                        expected: "",
                        attributeName: "",
                        message: "Wrap your inputs inside a <form> element."
                    },
                    {
                        type: "selectorExists",
                        selector: "form input[name='name']",
                        expected: "",
                        attributeName: "",
                        message: "Add a text input with name='name' inside the form."
                    },
                    {
                        type: "attributeMatch",
                        selector: "form input[name='name']",
                        expected: "Your name",
                        attributeName: "placeholder",
                        message: "The name input placeholder must be: Your name"
                    },
                    {
                        type: "selectorExists",
                        selector: "form input[type='email']",
                        expected: "",
                        attributeName: "",
                        message: "Add an email input (type='email') inside the form."
                    },
                    {
                        type: "attributeMatch",
                        selector: "form input[type='email']",
                        expected: "Your email",
                        attributeName: "placeholder",
                        message: "The email input placeholder must be: Your email"
                    },
                    {
                        type: "selectorExists",
                        selector: "form button[type='submit']",
                        expected: "",
                        attributeName: "",
                        message: "Add a submit button inside the form."
                    },
                    {
                        type: "textContentMatch",
                        selector: "form button[type='submit']",
                        expected: "Send",
                        attributeName: "",
                        message: "The button text must be: Send"
                    }
                ],
                difficulty: "hard",
                order: 6
            },
            
            // ─────────────────────────────────────────────
            // LEVEL 7 – Background Color (CSS)
            // ─────────────────────────────────────────────
            {
                title: "Painting the Canvas",
                description: "CSS stands for Cascading Style Sheets. It's how we make HTML look good! " +
                             "In this level, use CSS to change the background color of the <body> to 'lightblue'.",
                initialCode: "body {\n  /* Add your style here */\n}",
                htmlContext: "<h1>I love colors!</h1>",
                language: "css",
                validationType: "dom",
                validationTests: [
                    {
                        type: "styleMatch",
                        selector: "body",
                        propertyName: "backgroundColor",
                        expected: "rgb(173, 216, 230)",
                        message: "The background color of the body must be lightblue."
                    }
                ],
                difficulty: "easy",
                order: 7
            },

            // ─────────────────────────────────────────────
            // LEVEL 8 – Text Styling (CSS)
            // ─────────────────────────────────────────────
            {
                title: "Text Styling",
                description: "Let's style the text. Target the <h1> element and change its color to 'red' " +
                             "and set its font-size to '40px'.",
                initialCode: "h1 {\n  /* Add your style here */\n}",
                htmlContext: "<h1>This is a big red title</h1>",
                language: "css",
                validationType: "dom",
                validationTests: [
                    {
                        type: "styleMatch",
                        selector: "h1",
                        propertyName: "color",
                        expected: "rgb(255, 0, 0)",
                        message: "The text color must be red."
                    },
                    {
                        type: "styleMatch",
                        selector: "h1",
                        propertyName: "fontSize",
                        expected: "40px",
                        message: "The font size must be 40px."
                    }
                ],
                difficulty: "easy",
                order: 8
            },

            // ─────────────────────────────────────────────
            // LEVEL 9 – Borders (CSS)
            // ─────────────────────────────────────────────
            {
                title: "Frames & Borders",
                description: "Every element is a box. Let's add a border to the <div>. " +
                             "Set the border to '5px solid black'.",
                initialCode: "div {\n  /* Add your style here */\n}",
                htmlContext: "<div class='box'>I'm inside a box!</div>",
                language: "css",
                validationType: "dom",
                validationTests: [
                    {
                        type: "styleMatch",
                        selector: "div",
                        propertyName: "border",
                        expected: "5px solid rgb(0, 0, 0)",
                        message: "The border must be 5px solid black."
                    }
                ],
                difficulty: "medium",
                order: 9
            },

            // ─────────────────────────────────────────────
            // LEVEL 10 – Centering with Margins (CSS)
            // ─────────────────────────────────────────────
            {
                title: "Space & Alignment",
                description: "Margins create space outside elements. Use 'margin: auto' on the <div> " +
                             "to center it horizontally. Also, give it a width of '200px'.",
                initialCode: "div {\n  /* Add your style here */\n}",
                htmlContext: "<div style='background: gold; height: 100px;'>Center me!</div>",
                language: "css",
                validationType: "dom",
                validationTests: [
                    {
                        type: "styleMatch",
                        selector: "div",
                        propertyName: "width",
                        expected: "200px",
                        message: "The width must be 200px."
                    },
                    {
                        type: "styleMatch",
                        selector: "div",
                        propertyName: "marginLeft",
                        expected: "auto",
                        message: "The left margin must be auto."
                    },
                    {
                        type: "styleMatch",
                        selector: "div",
                        propertyName: "marginRight",
                        expected: "auto",
                        message: "The right margin must be auto."
                    }
                ],
                difficulty: "hard",
                order: 10
            },

            // ─────────────────────────────────────────────
            // LEVEL 11 – Hello JS (JavaScript)
            // ─────────────────────────────────────────────
            {
                title: "Hello JavaScript",
                description: "Welcome to JavaScript! JS makes websites interactive. " +
                             "In this level, use the `alert()` function to display the message: 'Hello from Kroma!'",
                initialCode: "// Write your JavaScript here\n",
                htmlContext: "<h1>JavaScript is fun!</h1>",
                cssContext: "h1 { color: #3498db; text-align: center; margin-top: 50px; }",
                language: "javascript",
                validationType: "literal",
                validationTests: [
                    {
                        type: "regex",
                        expected: "alert\\s*\\(\\s*['\"]Hello from Kroma!['\"]\\s*\\)",
                        message: "You must use alert('Hello from Kroma!');"
                    }
                ],
                difficulty: "easy",
                order: 11
            },

            // ─────────────────────────────────────────────
            // LEVEL 12 – Changing Text (JavaScript)
            // ─────────────────────────────────────────────
            {
                title: "Changing Content",
                description: "JavaScript can change what's on the page. " +
                             "Use `document.getElementById('message').textContent = 'Kroma is awesome!';` " +
                             "to change the text of the heading.",
                initialCode: "// Select the element and change its content\n",
                htmlContext: "<h1 id='message'>Old Message</h1>",
                cssContext: "#message { font-family: sans-serif; color: #2ecc71; }",
                language: "javascript",
                validationType: "dom",
                validationTests: [
                    {
                        type: "textContentMatch",
                        selector: "#message",
                        expected: "Kroma is awesome!",
                        message: "The text of the heading must be: Kroma is awesome!"
                    }
                ],
                difficulty: "medium",
                order: 12
            },

            // ─────────────────────────────────────────────
            // LEVEL 13 – Logging to Console (JavaScript)
            // ─────────────────────────────────────────────
            {
                title: "The Console",
                description: "The console is a developer's best friend. " +
                             "Use `console.log('Level 13 Complete');` to log a message. " +
                             "Also, change the background color of the body to 'yellow' using JS: `document.body.style.backgroundColor = 'yellow';`",
                initialCode: "// Log a message and change the background color\n",
                htmlContext: "<h1>Check the console!</h1>",
                cssContext: "body { transition: background 0.5s; }",
                language: "javascript",
                validationType: "dom",
                validationTests: [
                    {
                        type: "styleMatch",
                        selector: "body",
                        propertyName: "backgroundColor",
                        expected: "rgb(255, 255, 0)",
                        message: "The background color must be yellow."
                    },
                    {
                        type: "regex",
                        expected: "console\\.log\\s*\\(\\s*['\"]Level 13 Complete['\"]\\s*\\)",
                        message: "You must log: Level 13 Complete"
                    }
                ],
                difficulty: "hard",
                order: 13
            }
        ];

        const challenges = [
            // ─────────────────────────────────────────────
            // CHALLENGE 1 – Neon Rain (HTML/CSS)
            // ─────────────────────────────────────────────
            {
                title: "Neon Rain",
                description:
                    "Fes que la ciutat digital torni a brillar! Crea un element <div> amb la classe 'neon-card' dins del <body>. " +
                    "Afegeix les següents propietats CSS per donar-li estil: " +
                    "width: 200px; height: 200px; background-color: #111; border-radius: 12px; box-shadow: 0 0 20px #ff007f;",
                initialCode: `<!DOCTYPE html>
<html>
<head>
    <title>Neon Rain</title>
    <style>
        /* Afegeix l'estil per a .neon-card aquí */
        
    </style>
</head>
<body>
    <!-- Crea el teu element div amb la classe neon-card -->
    
</body>
</html>`,
                solutionCode: `<!DOCTYPE html>
<html>
<head>
    <title>Neon Rain</title>
    <style>
        .neon-card {
            width: 200px;
            height: 200px;
            background-color: #111;
            border-radius: 12px;
            box-shadow: 0 0 20px #ff007f;
        }
    </style>
</head>
<body>
    <div class="neon-card"></div>
</body>
</html>`,
                language: "html",
                validationType: "dom",
                validationTests: [
                    {
                        type: "selectorExists",
                        selector: ".neon-card",
                        message: "Falta l'element amb la classe 'neon-card'."
                    },
                    {
                        type: "regex",
                        expected: "box-shadow\\s*:\\s*0\\s+0\\s+20px\\s+#ff007f",
                        message: "L'ombra de neó ha de ser: box-shadow: 0 0 20px #ff007f;"
                    },
                    {
                        type: "regex",
                        expected: "background-color\\s*:\\s*#111",
                        message: "El color de fons del card ha de ser #111."
                    }
                ],
                difficulty: "easy",
                order: 1,
                isChallenge: true
            },

            // ─────────────────────────────────────────────
            // CHALLENGE 2 – Spectrum Spinner (CSS)
            // ─────────────────────────────────────────────
            {
                title: "Spectrum Spinner",
                description:
                    "Un spinner cromàtic en moviment constant! Dissenya un element '.spinner' per fer-lo circular " +
                    "(border-radius: 50%), amb amplada i alçada de 100px. Després, crea una animació CSS anomenada " +
                    "'spin' que el faci girar 360 graus de forma contínua i infinita (transform: rotate(360deg)).",
                initialCode: `/* Dissenya el teu spinner aquí */
.spinner {
    
}
`,
                solutionCode: `.spinner {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    border: 5px solid rgba(255,255,255,0.1);
    border-top: 5px solid #00ffcc;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}
`,
                htmlContext: `<div class="spinner"></div>`,
                language: "css",
                validationType: "dom",
                validationTests: [
                    {
                        type: "selectorExists",
                        selector: ".spinner",
                        message: "Falta el selector .spinner en el teu CSS."
                    },
                    {
                        type: "regex",
                        expected: "border-radius\\s*:\\s*50%",
                        message: "L'spinner ha de ser un cercle perfecte (border-radius: 50%)."
                    },
                    {
                        type: "regex",
                        expected: "@keyframes\\s+spin",
                        message: "Has de crear l'animació @keyframes spin."
                    },
                    {
                        type: "regex",
                        expected: "transform\\s*:\\s*rotate\\(\\s*360deg\\s*\\)",
                        message: "L'animació ha de rotar 360 graus (transform: rotate(360deg))."
                    }
                ],
                difficulty: "medium",
                order: 2,
                isChallenge: true
            },

            // ─────────────────────────────────────────────
            // CHALLENGE 3 – Prismatic Wave (JavaScript)
            // ─────────────────────────────────────────────
            {
                title: "Prismatic Wave",
                description:
                    "Alquímia de colors interactiva! Programa l'element '#color-shifter' per a que, en fer clic, " +
                    "generi un color HSL de manera aleatòria i l'assigni com a color de fons del body (document.body.style.backgroundColor).",
                initialCode: `// Programa l'event click i el canvi de color de fons
const shifter = document.getElementById('color-shifter');

shifter.addEventListener('click', () => {
    // Genera color i canvia el fons del body
    
});
`,
                solutionCode: `const shifter = document.getElementById('color-shifter');

shifter.addEventListener('click', () => {
    const randomHue = Math.floor(Math.random() * 360);
    document.body.style.backgroundColor = 'hsl(' + randomHue + ', 80%, 50%)';
});
`,
                htmlContext: `<button id="color-shifter" style="padding: 15px 30px; font-weight: bold; background: #222; color: #fff; border: 2px solid #00ff00; border-radius: 8px; cursor: pointer;">SHIFT COLOR ⚡</button>`,
                language: "javascript",
                validationType: "dom",
                validationTests: [
                    {
                        type: "selectorExists",
                        selector: "#color-shifter",
                        message: "Falta el botó amb ID color-shifter."
                    },
                    {
                        type: "regex",
                        expected: "addEventListener\\(\\s*['\"]click['\"]",
                        message: "Has d'afegir un gestor d'esdeveniments click al botó."
                    },
                    {
                        type: "regex",
                        expected: "document\\.body\\.style\\.backgroundColor",
                        message: "Has d'actualitzar document.body.style.backgroundColor."
                    }
                ],
                difficulty: "hard",
                order: 3,
                isChallenge: true
            }
        ];

        await Level.insertMany([...exercises, ...challenges]);
        console.log("Levels and Challenges seeded successfully");
        process.exit();
    })
    .catch(err => {
        console.error("Connection error", err);
    });
