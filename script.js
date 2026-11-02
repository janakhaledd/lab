
let names = [];

let input = document.getElementById("name");
let button = document.getElementById("greet");
let title = document.getElementById("title");
let list = document.getElementById("list");

button.onclick = function() {
    let name = input.value.trim();

    if (name === "") {
        return;
    }

    title.textContent = "Hello, " + name + "!";

    names.push(name);

    input.value = "";
    showNames();
};

function showNames() {
    list.innerHTML = "";

    for (let i = 0; i < names.length; i++) {
        let li = document.createElement("li");

        li.textContent = names[i];

        li.onclick = function() {
            title.textContent = "Goodbye, " + names[i] + "!";
            names.splice(i, 1);
            showNames();
        };

        list.appendChild(li);
    }
}
