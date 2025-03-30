import './style.css'

//Bindings:

let bindings: Record<string, string[]> = {
    marketBind: ["ctrl", "d"],
    sellFoodBind: ["ctrl", "a"],
    sellWoodBind: ["ctrl", "s"],
    sellStoneBind: ["ctrl", "d"],
    buyFoodBind: ["ctrl", "x"],
    buyWoodBind: ["ctrl", "c"],
    buyStoneBind: ["ctrl", "v"],
}

//Loading Binds from Local Storage if default:
const loadBindings  = () => {
    const storedBindings = localStorage.getItem("Key Bindings");
    if (storedBindings) {
        bindings = JSON.parse(storedBindings);
        console.log("Bindings Loaded!");
    }
    else {
        console.log("No User Bindings Found. Setting Default Bindings");
    }

    //Show Current bindings in inputs
    Object.keys(bindings).forEach((key) => {

        const trueName : string = key.replace("Bind", "Input");

        const input = document.getElementById(trueName) as HTMLInputElement;

        if (input){
            input.value = bindings[key].join("+");
        }

    })

}

//Saving Binds on Local Storage:

const saveBindings = (bindings : Record<string, string[]>) => {
    localStorage.setItem("Key Bindings", JSON.stringify(bindings));
    console.log("Bindings Saved!", bindings);
}



function recordKeys(button: HTMLButtonElement,  relatedInput: HTMLInputElement){

    //Set of pressed keys
    const pressedKeys = new Set<string>();

    //Input Value to None
    relatedInput.value = "";
   
    //Deleting current binding for this operation
    delete bindings[button.id];

    //Add Save and Cancel buttons
    const relatedDiv = relatedInput.closest(".input-type") as HTMLDivElement;

    const buttonSave = document.createElement("button");
    buttonSave.innerHTML = '<button class="button-save button-bindings font-primary">Save<img src="/save.svg"></button>'
    relatedDiv.appendChild(buttonSave);

    const buttonCancel = document.createElement("button");
    buttonCancel.innerHTML = '<button class="button-cancel button-bindings font-primary">Cancel<img src="/cancel.svg"></button>'
    relatedDiv.appendChild(buttonCancel);

    const buttonRecord = document.createElement("button");
    buttonRecord.innerHTML = '<button class="sell-stone button-bindings record font-primary" id="recordMarket">Record<img src="/record.svg"></button>'


   //Function to add captured keys
    function captureKeys(event: KeyboardEvent){

        pressedKeys.add(event.key.toLowerCase());
        console.log("Teclas Presionadas " + Array.from(pressedKeys).join("+") );

        if (relatedInput){
            relatedInput.value = Array.from(pressedKeys).join("+");
        }
    }

    document.addEventListener("keydown", captureKeys);

    //Save button behaviour
    buttonSave.addEventListener("click", (event) => {
        
        bindings[button.id] = Array.from(pressedKeys);
        saveBindings(bindings);
        loadBindings();

        document.removeEventListener("keydown", captureKeys);
        button.style.display = "flex";

        buttonSave.remove();
        buttonCancel.remove();
        return;

    })

    //Cancel button behaviour
    buttonCancel.addEventListener("click", (event) => {

        loadBindings();
        document.removeEventListener("keydown", captureKeys);
        button.style.display = "flex";

        buttonSave.remove();
        buttonCancel.remove();
        return;
    })

    return;
    
}

loadBindings();

//Add event listener to all record buttons
const recordButtons = document.querySelectorAll<HTMLButtonElement>(".record");

recordButtons.forEach(button => {

    button.addEventListener("click", () => {

        button.style.display = "none";
    
        const relatedInput = button.closest(".input-type")?.querySelector("input") as HTMLInputElement;

        recordKeys(button, relatedInput);

    });

});

//Adding If Market Optional Behaviour
const checkbox = document.getElementById("ifMarket") as HTMLInputElement;
const marketContainer = document.getElementById("marketOptional") as HTMLDivElement;

if (checkbox){
    checkbox.addEventListener("change", () => {

        if (checkbox.checked){
            marketContainer.style.display = "flex";
        }
        else {
            marketContainer.style.display = "none";
        }

    })
}

//Opening Modal
const modal = document.getElementById("modalSettings") as HTMLDivElement;
const openModal = document.getElementById("openModal") as HTMLButtonElement;

openModal.addEventListener("click", ()=> {

    modal.style.display = "flex";

})

//Exiting Modal
const exitModal = document.getElementById("exitModal") as HTMLButtonElement;

exitModal.addEventListener("click", ()=> {

    modal.style.display = "none";

})
