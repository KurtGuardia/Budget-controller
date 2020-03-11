//NO OLVDAR CAMBIAR LO QUE SEA LINEAS EN COMENTARIOS



//Modulo de tratamiento de datos
var budgetController = (function() {

    //Creador de objetos exp, los cuales son los valores puestos en input field del DOM, se crean asi los necesarios, se asignan id
    var Expense = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };
    //Creador de objetos inc, los cuales son los valores puestos en input field del DOM, se crean asi los necesarios, se asignan id
    var Income = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    //Aqui se guarda todos los datos introducidos, tanto cada uno de los exp e inc como el totoal que va sumandolos a cada uno
    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        }
    }
    
    //Todo lo que esta luego del return va a interactuar al global scope, para interactuar con el modulo controller
    return {

        //El metodo que interactua con el exterior para adicionar exp o inc
        addItem: function(type, des, val){
            var newItem, ID;
            
            //Se fija una ID, se toma del obj data su key allItems, dentro se selecciona inc o exp con el [type] y se agarra la longitud (length) se le resta 1 (porque es zero based) se toma la propiedad id de ese ultimo elemento y se suma 1
            //El If es para cuando sea el primer item, y que no busque un 0 - 1
            if (data.allItems[type].length > 0){
               ID = data.allItems[type][data.allItems[type].length - 1].id + 1; 
            } else {
                ID = 0;
            };
            

            if (type === 'exp') {
                newItem = new Expense(ID, des, val);
            } else if (type === 'inc'){
                newItem = new Income(ID, des, val);
            };
            
            //OJO. se elige la el obj data (lin 18), se selecciona la key allItems, que es un obj que tiene dos tipos de keys inc y exp, por eso luego se pone [type] de esa manera se selecciona la key correcta, la cual es un array, a ese array se le hace un .push para que guarde el valor (newItem) de la inc o exp respectivamete
            data.allItems[type].push(newItem)

            //Se retorna porque el nuevo item debe ser usdo luego
            return newItem;

        },
        
        testing: function() {
        console.log(data);
        }
    };

})();




//Modulo de interfaz de usuario
var UIController = (function() {

    //Los lugares de input del documento.
    var DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn'
    }

    //Todo lo que sale de aqui es visto en el Global Scope
    return {
        getinput: function() {
            return {
                type: document.querySelector(DOMstrings.inputType).value,          //Will be either inc or exp
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: document.querySelector(DOMstrings.inputValue).value
            };
        },

        //Metodo para agregar items a la lista visible de la interfaz
        addListItems: function(obj, type) {
            var html

            //Create HTML string with placerhlder text
            if(type === 'inc') {
                html = '<div class="item clearfix" id="income-0"> <div class="item__description">Salary</div> <div class="right clearfix"> <div class="item__value">+ 2,100.00</div> <div class="item__delete"> <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button> </div> </div> </div>'
            } else if (type === 'exp') {
                html = '<div class="item clearfix" id="expense-0"> <div class="item__description">Apartment rent</div> <div class="right clearfix"> <div class="item__value">- 900.00</div> <div class="item__percentage">21%</div> <div class="item__delete"> <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button> </div> </div> </div>'
            }
            
            //Replace the placeholer text with actual data

            //Insert the HTML into the DOM

        },


        //Metodo colocado aqui para poder acceder a los lugares de input desde afuera
        getDOMstrings: function() {
            return DOMstrings;
        }
        
        
    }

    
})();





//Modulo que interrelaciona los anteiores dos modulos
var controller = (function(budgetCtrl, UICtrl){

    //Se crea una funcion de obtencion primaria de datos, tanto desde el DOM para los input fields, como el apretar Enter o el click en boton add. Como estan en funcion todos, ahora hay que inicializarla, de estar fuera se llaman solos, ahora en linea 84 se la crea y afuera se la llama
    var setupEventListeners = function() {
    
        //Con esto ya dentro de este modulo controller podremos acceder a los valores de los input fields en el DOM
        var DOM = UICtrl.getDOMstrings(); 
        
        //Los eventos principales, click en boton Add o Enter
        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem)
        document.addEventListener('keypress', function(event) {

            //Ese es el keyCode de Enter
            if(event.keyCode === 13) {
                ctrlAddItem();
            }
        })
    }

    
    //Funcion primaria cuando se agrega valores y se hace Enter o click en el boton
    var ctrlAddItem = function() {
        var input, newItem;

        //Get the field input data, en forma de obj con type, description y value del Modulo UI
        input = UICtrl.getinput();
        
        //2. Add the item to the budget contoller, al metodo addItem de la linea 33 del Modulo BudgetControler, pasando las propiedaes del objeto input
        newItem = budgetCtrl.addItem(input.type, input.description, input.value)
        
        //3 add the item to the UI

        //4. Calculate the budget

        //5. Display the budget on the UI

    };

    //Lo que entre en el return aqui sale al Global Scope
    return{
        //La funcion que inicializa tutti
        init: function() {
            console.log('App started');
            setupEventListeners();
        }
    };

})(budgetController, UIController)



//Esta es la unica linea de codigo fuera de modulos, llama a la funcion que inicializa todo, sin esta linea nada empieza ni sirve
controller.init();