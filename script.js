
const categorySelect = document.getElementById("categories");


async function loadCategories(){

    try{
        const response = await fetch("https://opentdb.com/api_category.php");

        if(!response.ok){
            throw `Could not load categories`
        }
        
        const data = await response.json();

        const allOption = document.createElement("option");
        allOption.value = "all";
        allOption.textContent = "All categories";
        categorySelect.appendChild(allOption);
        console.log(allOption)

            data.trivia_categories.forEach(cat => {
            const opt = document.createElement("option");
            opt.value = cat.id;
            opt.textContent = cat.name;
            categorySelect.appendChild(opt);
        });
    }
        catch(err){
            console.error("Category error:", err);
        }
}

loadCategories();


function buildURL(amount, category, difficulty) {
    let url = `https://opentdb.com/api.php?amount=${amount}`;

    if (category !== "all") {
        url += `&category=${category}`;
    }

    if (difficulty !== "any") {
        url += `&difficulty=${difficulty}`;
    }

    return url;
}

async function getTriviaQuestions(amount, category, difficulty) {
    try {
        const url = buildURL(amount, category, difficulty);
        console.log("API URL:", url);

        const response = await fetch(url);

        if (!response.ok) {
            throw "Something went wrong with API request";
        }

        const data = await response.json();

        if (data.response_code !== 0) {
            throw "API could not deliver questions";
        }

        return data.results; 
    }
    catch (error) {
        throw error; 
    }
}

function displayQuestions(questions) {
    const errorEl = document.getElementById("error");
    const output = document.getElementById("output");

    errorEl.innerText = "";
    output.innerHTML = "";

    questions.forEach((q, index) => {
        const div = document.createElement("div");
        div.innerHTML = `
            <h3>Q${index + 1}: ${q.question}</h3>
            <p><b>Correct answer:</b> ${q.correct_answer}</p>
        `;
        output.appendChild(div);
    });
}


// =========================
// 5. Visa fel
// =========================
function displayError(msg) {
    const errorEl = document.getElementById("error");
    errorEl.innerText = msg;
}


// =========================
// 6. Form event listener
// =========================
const form = document.querySelector("form");

form.addEventListener("submit", e => {
    e.preventDefault();

    const amount = document.querySelector("input[name='amount']").value;
    const category = document.getElementById("categories").value;

    const diffInput = document.querySelector("input[name='Difficulty']:checked");
    const difficulty = diffInput ? diffInput.value.toLowerCase() : "any";

    getTriviaQuestions(amount, category, difficulty)
        .then(displayQuestions)
        .catch(displayError);
});


//Nästa steg är att göra så att det blir ett spel med svarsalternativ se Uppgift https://docs.google.com/document/d/1Ow4qKRM0kScr8y1Ab_tvsFG36IFhbK3YBwjiSZ7T49s/edit?tab=t.0