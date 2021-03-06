// Дэлгэцтэй ажиллах контроллер
var uiController = (function() {
    var DOMstrings = {
        inputType: ".add__type",
        inputDescription: ".add__description",
        inputValue: ".add__value",
        addBtn: ".add__btn",
        incomeList: ".income__list",
        expenseList: ".expenses__list"
    };

    return {
        getInput: function(){
            return {
                type: document.querySelector(DOMstrings.inputType).value, // exp, inc
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: parseInt(document.querySelector(DOMstrings.inputValue).value)
            };
        },

        getDOMstrings: function(){
            return DOMstrings;
        },

        clearFields: function() {
            var fields = document.querySelectorAll(DOMstrings.inputDescription + ", " + DOMstrings.inputValue);
            
            // Convert List to Array
            var fieldsArr = Array.prototype.slice.call(fields);
        
            fieldsArr.forEach(function(el, index, array) {
                el.value = "";
            });
        
            fieldsArr[0].focus();
        
            // for (var i = 0; i < fieldsArr.length; i++) {
            //   fieldsArr[i].value = "";
            // }
        },

        addListItem: function(item, type){
            // Орлого, зарлагын элементийг агуулсан html-ийг бэлтгэнэ
            var html, list;
            if (type === "inc") {
                list = DOMstrings.incomeList;
                html = `<div class="item clearfix" id="income-%id%">
                        <div class="item__description">$$DESCRIPTION$$</div>
                        <div class="right clearfix">
                            <div class="item__value">$$VALUE$$</div>
                            <div class="item__delete">
                                <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                            </div>
                        </div>
                    </div>`;
            } else {
                list = DOMstrings.expenseList;
                html = `<div class="item clearfix" id="expense-%id%">
                        <div class="item__description">$$DESCRIPTION$$</div>
                        <div class="right clearfix">
                            <div class="item__value">$$VALUE$$</div>
                            <div class="item__percentage">21%</div>
                            <div class="item__delete">
                                <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                            </div>
                        </div>
                    </div>`;
            }
            // Тэр html дотроо орлого зарлагын утгуудыг replace хийнэ.
                html = html.replace("%id%", item.id);
                html = html.replace("$$DESCRIPTION$$", item.description);
                html = html.replace("$$VALUE$$", item.value);

            // Бэлтгэсэн html-ээ DOM руу хийж өгнө.
                document.querySelector(list).insertAdjacentHTML("beforeend", html);
        }
    };
})();

// Санхүүтэй ажиллах контроллер
var financeController = (function() {
    // Private Data
    var Income = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    // Private Data
    var Expense = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    // Private Data
    var data = {
        items: {
            inc: [],
            exp: []
        },

        totals: {
            inc: 0,
            exp: 0
        },

        budget: 0, // tusuv: 0,

        percent: 0 // huvi: 0
    };

    var calculateTotal = function(type){
        var sum = 0;
        data.items[type].forEach(function(el) {
            sum = sum + el.value;
        });

        data.totals[type] = sum;
    };

    return {
        addItem: function(type, desc, val){
            var item, id;

            if(data.items[type].length === 0){
                id = 1;
            } else {
                id = data.items[type][data.items[type].length - 1].id + 1;
            }

            if(type === 'inc'){
                item = new Income(id, desc, val);
            } else {
                item = new Expense(id, desc, val);
            }
            data.items[type].push(item);

            return item;
        },

        seeData: function(){
            return data;
        },

        calculateBudget: function(){
            // Нийт орлогийн нийлбэрийн тооцолно.
            calculateTotal('inc');

            // Нийт зарлагын нийлбэрийг тооцоолно.
            calculateTotal('exp');

            // Төсвийг шинээр тооцоолно.
            data.budget = data.totals.inc - data.totals.exp;

            // Орлого зарлагын хувийг тооцоолно
            data.percent = Math.round((data.totals.exp / data.totals.inc) * 100);
        },

        getBudget: function(){
            return {
                budget: data.budget,
                percent: data.percent,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp
            };
        }
    };

})();

// Програмын холбогч контроллер
var appController = (function(uiController, financeController) {
    var ctrlAddItem = function() {
        // 1. Оруулах өгөгдлийг дэлгэцээс олж авна.
        var input = uiController.getInput();

        if (input.description !== "" && input.value !== "") {
            // 2. Олж авсан өгөгдлүүдээ санхүүгийн контроллерт дамжуулж тэнд хадгална.
            var item = financeController.addItem(input.type, input.description, input.value);

            // 3. Олж авсан өгөгдлүүдээ вэб дээрээ тохирох хэсэгт нь гаргана.
            uiController.addListItem(item, input.type);
            uiController.clearFields();

            // 4. Төсвийг тооцоолно.
            financeController.calculateBudget(); // financeController.tusuvTootsooloh();

            // 5. Эцсийн үлдэгдэл, тооцоо.
            var budget = financeController.getBudget(); // var tusuv = financeController.tusviigAvah();
            
            // 6. Төсвийн тооцоог дэлгэцэнд гаргана.
            console.log(budget);
        };
    };

    var setupEventListeners = function(){
        var DOM = uiController.getDOMstrings();

        document.querySelector(DOM.addBtn).addEventListener("click", function() {
            ctrlAddItem();
        });
    
        document.addEventListener("keypress", function(event) {
            if (event.keyCode === 13 || event.which === 13) {
            ctrlAddItem();
            }
        });
    };

    return {
        init: function(){
            console.log('Application Started.');
            setupEventListeners();
        }
    };

})(uiController, financeController);

appController.init();