
var budgetController = (function() {

    
})();





var UIController = (function() {

    //Los lugares de input del documento.
    var DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value'
    }
    return {
        getinput: function() {
            return {
                type: document.querySelector(DOMstrings.inputType).value,          //Will be either inc or exp
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: document.querySelector(DOMstrings.inputValue).value
            }

            
        }
    }

})();






var controller = (function(budgetCtrl, UICtrl){


    //Funcion primaria cuando se agrega valores y se hace Enter o click en el boton
    var ctrlAddItem = function() {
        
        //Get the field input data
        var input = UICtrl.getinput();
            console.log(input);
        //2. Add the item to the budget contoller

        //3 add the item to the UI

        //4. Calculate the budget

        //5. Display the budget on the UI

    };

    //Los eventos principales, click en boton Add o Enter
    document.querySelector('.add__btn').addEventListener('click', ctrlAddItem)
    document.addEventListener('keypress', function(event) {

        //Ese es el keyCode de Enter
        if(event.keyCode === 13) {
            ctrlAddItem();
        }
    
    })

})(budgetController, UIController)