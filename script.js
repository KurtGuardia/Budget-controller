//NO OLVDAR CAMBIAR LO QUE SEA LINEAS EN COMENTARIOS



//Modulo de tratamiento de datos
var budgetController = (function() {

    //Creador de objetos exp, los cuales son los valores puestos en input field del DOM, se crean asi los necesarios, se asignan id
    var Expense = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1        //cuando no hay valor es mejor ya definir como -1 
    };

    //un metodo que debe tener cada uno de los expenses, para el calculo de su peso en relacion al Income
    Expense.prototype.calcPercentage = function(totalIncome){

        //El if es para que no de errores de division y solo se haga cuando es necesario
        if(totalIncome > 0){
            this.percentage = Math.round((this.value / totalIncome) * 100)
        } else {
            this.percentage = -1;
        }
        
    };

    //Un metodo para orenadamente obtner el porcentage de cada exp que calculamos arriba. Simplemente para tener funciones con laores especificas
    Expense.prototype.getPercentage = function() {
        return this.percentage;
    }

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
        },
        budget: 0,
        percentage: -1
    }

    //En esta funcion loopeamos al allItems correspondiente al type puesto, y lo vamos sumando en acumulcion y al final al totals del data correspondiente le fijamos el valor de dicha suma
    calculateTotal = (type) => {
        var sum = 0;
        data.allItems[type].forEach(function(cur) {
            sum += cur.value;
        });
        data.totals[type] = sum;
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
            
            //Para crear un objeto Expense o Income
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

        //Para borrar el item. Se necesita determinar el id especifico que se desea eliminar, ya que no estan en orden, no se puede agregar al final facilmente
        deleteItem: function(type, id) {
            var ids, index;

            //Primero se necesita un array con todos los verdaderos ids, que no tengan los eliminados como numero. Para ello se hace uso del .map
            ids = data.allItems[type].map(function(current){
                return current.id
            });

            //Ahora para determinar el lugar especifico del id que estamos buscando se usa el .indexOf, al cual le pasamos el id del elemento que queremos agarrar
            index = ids.indexOf(id);

            //Ahora se borra el index encontrado del array, se hace con .splice, que recie dos parametros, primero donde empieza (en index) y cuanto borra (solo 1)
            //Solo debe funcionar si es diferente a -1, por eso el If
            if(index !== -1) {
                data.allItems[type].splice(index, 1)
            }

        },
        
        calculateBudget: function(){

            //calculate total income and expenses
            calculateTotal('inc');
            calculateTotal('exp');

            //calculate budget (inc-exp) y guardar en budget dentro de data
            data.budget = (data.totals.inc - data.totals.exp)

            //calculate the % of income spent y guardar en percentage dentro de data.
            //El If es para que si es solo expenses se dividiria entre 0 y eso es un error, tiene que ser calculado solo si hay incomes
            if(data.totals.inc > 0) {
               data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100); 
            } else {
                data.percentage = -1;
            }
            

        },

        //Calcular el porcentage de cada expense en la lista expenses en base al Income. por medio de su metodo individual
        calculatePercentages: function(){

            data.allItems.exp.forEach(function(cur){
                cur.calcPercentage(data.totals.inc);
            })

        },

        //Usamos aqui map a diferencia de arriba porque queremos que se cree un nuevo array
        getPercentages: function(){

            var AllPerc = data.allItems.exp.map(function (cur){
                return cur.getPercentage();
            });
            return AllPerc;
        },

        //Una funcion solamente para sacar al global scope los datos que deben ser tratados luego en el UI
        getBudget: function() {
            return {
                budget: data.budget,
                percentage: data.percentage,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp
            }
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
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expenseLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container',
        expensesPercLabel: 'item__percentage'
    }

    //Todo lo que sale de aqui es visto en el Global Scope
    return {
        getinput: function() {
            return {
                type: document.querySelector(DOMstrings.inputType).value,          //Will be either inc or exp
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMstrings.inputValue).value)      //parseFloat cambia el string a un numero, porque sino es inutil e calculos
            };
        },

        //Metodo para agregar items a la lista visible de la interfaz
        addListItems: function(obj, type) {
            var html, newHtml, element, fields;

            //Create HTML string with placerhlder text, los placeholders son el %id%, %value% y %description%, que son reemplezados con el obj que metemos en la funcion, en el siguiente paso
            if(type === 'inc') {
                //este elemet se fija en el if, para desde aqui saber a cual de los containers o listas le vamos a agregar en el ultimo paso de insersion al DOM
                element = DOMstrings.incomeContainer;

                html = '<div class="item clearfix" id="inc-%id%"> <div class="item__description">%description%</div> <div class="right clearfix"> <div class="item__value">%value%</div> <div class="item__delete"> <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button> </div> </div> </div>'
            } else if (type === 'exp') {
                element = DOMstrings.expensesContainer;

                html = '<div class="item clearfix" id="exp-%id%"> <div class="item__description">%description%</div> <div class="right clearfix"> <div class="item__value">%value%</div> <div class="item__percentage">21%</div> <div class="item__delete"> <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button> </div> </div> </div>'
            }
            
            //Replace the placeholer text with actual data. el metodo .replace primer argumento es que se busca para ser reemplazado, por eso se le puso doble % (asi se hacia unico) y segundo parametro es porque sera reemplazado, en nuestro caso es cada una de las propiedades del obj que le pasamos.
            //El primero es sobre el html pero el segundo es sobre el primero, porque si de nuevo hacemos sobre el html, no tendra la modificacion hecha por el primero, lo mismo para el tercero, 
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', obj.value);
            
            //Insert the HTML into the DOM. Primero seleccionamos en que lado de la pagina va, lista de incomes o lista de expenses, por eso se le pasa el element, que ya definimos correctamente en el if de dos pasos arriba. Y se usa el newHtml porque es el que ya tiene los tres placeholders
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);

        },

        //Para borrar del IU
        deleteListItem: function(selectorID){

            //En JS no se puede eliminar un elemento asi nomas, se tiene que seleccionar un parent y hacerle removeChild, por eso se encuentra el elemento que queremos quitar con el getElementById le vamos a pasar el id claro, y subimos uno al parent superior y ahi aplicamos el removeChild, 
            //Como seleccionarlo dentro el removeChild es una copia de lo mismo, es que definimos la variable el, para reumir un poco
            var el = document.getElementById(selectorID)
            el.parentNode.removeChild(el)

        },

        //Funcion para borrar los datos ya no necesarios en la interfaz, una vez se hace enter o click en Add
        clearFields: function(){
           var fields, fieldsArr;
           
            //Ya que el querySelectroAll se trabaja como en CSS, se debe agragar una coma como string en medio. Devuelve una Node List, no array
            fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue) 
            
            //Esta es ua manera de 'encañar' al programa, para pasarle una lista y que devuelva un array. El .slice method es propio de Arrays y devuelve arrays, se lo busca con el .prototye al func contructor Array y se lo llama con .call que es donde se pasa la lista. asi nos devolvera un array en base a esta lista
            //Se ha probado que no es necesario, la Node List como el Array pueden tener el forEach method. punto para Kurt
            //fieldsArr = Array.prototype.slice.call(fields);
            
            //Ahora se puede usar el nuevo array para hacerle un buen loop y a cada elemento del array a su .value se lo pone en blanco con ""
            fields.forEach(function(current, index, array){
                current.value = "";
            })

            //Devuelve el typeo a la primera caja de descripcion.
            fields[0].focus();
        },
        
        //metodo para usar la parte de arriba, la que muestra los totales. Igualando el DOMstring respectivo con la propiedad del objeto que se le pasara. Y se le va a pasar el getBudget de la linea 95, por eso esos parametros
        displayBudget: function(obj){
            document.querySelector(DOMstrings.budgetLabel).textContent = obj.budget;
            document.querySelector(DOMstrings.incomeLabel).textContent = obj.totalInc;
            document.querySelector(DOMstrings.expenseLabel).textContent = obj.totalExp;
            
            if(obj.percentage > 0) {
                document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
            } else {
                document.querySelector(DOMstrings.percentageLabel).textContent = '---';
            }
        },

        //Metodo para mostrar el UI al cual se le va a pasar (eventualmente en el modulo control) el getPercentages como parametro...btw
        displayPercentages: function(percentages){

            //Se selecciona todos los elementos del html que tengan class "item__percentage", 
            var fields = document.querySelectorAll(DOMstrings.expensesPercLabel);

            //Se crea una funcion forEach personalizada para mi Node List (los elementos del DOM tree son Nodes)
            //Esta funcion hace que la que vamos a pasar en el siguiente paso sea un forEach, la funcion que pasemos en el siguiente paso sera llamada aqui, para cada elemento con su respectivo index, tal como un forEach normal, pero esta le pasamos un Node List
            var nodeListForEach = function(list, callback){
                for (var i = 0; i < list.length; i++){
                    callback(list[i], i);
                }
            };

            //Le pasamos una funcion que sera aplicada a cada elemento de nuestra Node List en el paso anterior
            nodeListForEach(fields, function(current, index){

                //El if es para que si el % es 0 o menos 1, no salga cualquier burrada sino unos guiones
                if(percentages[index] > 0){
                  
                    //A cada 'current' que es cada lugar de la Node List, el cual es 'fields', que viene de tomar (querySelectorAll) a todos los elementos del DOM que tienen espacio para porcentajes (expensesPercLabel)
                    current.textContent = percentages[index] + '%';
                  
                } else {
                    current.textContent = '---';
                }
                
            });

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

        //EVENT DELEGATION. Aqui se activa el boton de Borrar que tiene cada linea. al seleccionar todo el container de incomes y expenses con el delegation nos ahorramos no tener que hacer una funcion de borrado para cada uno de las lineas, sino una sola funcion, que cuando se haga click ejecute a funcion ctrDeleteItem
        document.querySelector(DOM.container).addEventListener('click', ctrDeleteItem);
    }

    var updateBudget = function() {
       
        //1. Calculate the budget
        budgetCtrl.calculateBudget();

        //2. Return the budget
        var budget = budgetCtrl.getBudget();

        //3. Display the budget on the UI
        UICtrl.displayBudget(budget);
    }

    var UpdatePercentages = function() {

        //1. calculate percentages
        budgetCtrl.calculatePercentages();

        //2. Read percentages form the budget controller 
        var percentages = budgetCtrl.getPercentages();

        //3. Update the UI with the new percentages
        UICtrl.displayPercentages(percentages);
        
    }

    
    //Funcion primaria cuando se agrega valores y se hace Enter o click en el boton
    var ctrlAddItem = function() {
        var input, newItem;

        //Get the field input data, en forma de obj con type, description y value del Modulo UI
        input = UICtrl.getinput();
        
        //Este if se hace para que si la descripcion o el valor estan en blanco no se agregue una linea erronea con vacio.
        // isNaN es un metodo para ver si algo es No un Numero, colcandole el ! es al opusto, en este caso saldra True en el caso de que coloquemos un numero, porque este bajo isNaN saldra false y con el ! se vuelca a True
        if(input.description !== "" && !isNaN(input.value) && input.value > 0) {
            //2. Add the item to the budget contoller, al metodo addItem de la linea 33 del Modulo BudgetControler, pasando las propiedaes del objeto input
            newItem = budgetCtrl.addItem(input.type, input.description, input.value)
            
            //3 add the item to the UI
            UICtrl.addListItems(newItem, input.type);

            //4. Clear the input fields, luego de haber hecho Enter
            UICtrl.clearFields();

            //5. Calculate and update budget
            updateBudget(); 

            //6. Calculate and display the updated percentages
            UpdatePercentages();

        } else {
            alert('Un parametro vacio')
        };
               
    };

    var ctrDeleteItem = (event) => {
        var itemID, spitID, type, ID;

        //TRAVERSING, se tiene el evento (un click en un lugar cualquiera del container de inc y exp, desde el epicentro (target) se sube 4 parents arriba (parenNode) y a dicho elemento (spoiler es un <div>) se le toma la propiedad id que al menos en este proyecto es el unico lugar donde existen
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

        //Ya que el .id que se ha obtenido en el paso anterior es 'inc-1' por ejemplo, hay que separarlo, para eso se usa el metodo .split que dividira en donde hay un -
        //Ya separados los guardmos a cada uno en type y ID respectivamente
        if(itemID) {

            splitID = itemID.split('-');
            type = splitID[0];
            ID = parseInt(splitID[1]);      //El splice corta el array y deja como array asi que hay que volverlo numero, para eso el paseInt

            //1. Delete item form data structure, es para el uso en esta funcion que se obtiene 'type' y 'id' en el paso anterior
            budgetCtrl.deleteItem(type, ID);

            //2. Delete item from UI
            UICtrl.deleteListItem(itemID);

            //3. Update and show the new budget
            updateBudget();

            //4. Calculate and display the updated percentages
            UpdatePercentages();
            

        }
    }

    //Lo que entre en el return aqui sale al Global Scope
    return{
        //La funcion que inicializa tutti
        init: function() {
            console.log('App started');
            //Para que todo en la parte Top este en 0 y no con valores default
            UICtrl.displayBudget({
                budget: 0,
                percentage: 0,
                totalInc: 0,
                totalExp: 0
            })
            setupEventListeners();
        }
    };

})(budgetController, UIController)



//Esta es la unica linea de codigo fuera de modulos, llama a la funcion que inicializa todo, sin esta linea nada empieza ni sirve
controller.init();