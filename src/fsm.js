class FSM {
    
    constructor(config) {
		if (config === undefined) {
			var message = {failure:"Error: config is not passed"};
			throw new Error (message.failure);
		}
		this.i = config.initial; // состояние при инициализации
		this.s = config.states; // ассоциативный массив состояний и событий
		this.curState = config.initial; // текущее состояние, равное при инициализации заданному значению
		this.prevState = null; // предыдущее состояние, равное при инициализации нулю
		this.count = 0; // счетчик переходов
		
		
	}

    getState() { // возращаем текущее состояние
		return this.curState;
	}

    changeState(state) { // переключаем состояния, без вызова события
		var states = this.s;
		this.prevState = this.curState;
		for (var i in states) {
		    if (i == state) {
			    this.curState = state;
		    }
		}
		if (this.curState != state) {
			var message = {failure:"Error: this state does not exist"};
			throw new Error (message.failure);
		}
		this.count++;
	}

    /**
     * Changes state according to event transition rules.
     * @param event
     */
    trigger(event) { // переключаем состояния при наступлении события
		var state = this.s[this.curState]["transitions"][event];
		if (!state) {
			var message = {failure:"Error: this event in current state does not exist"};
			throw new Error (message.failure);
		}
		this.prevState = this.curState;
		this.curState = state;
		this.count++;
		
	}

    /**
     * Resets FSM state to initial.
     */
    reset() { // переходим в состояние при инициализации
		this.curState = this.i;
	}

    /**
     * Returns an array of states for which there are specified event transition rules.
     * Returns all states if argument is undefined.
     * @param event
     * @returns {Array}
     */
    getStates(event) { // создаем массив состояний в зависимости от заданных условий
		if (!event) { // если событие не было передано
			var states = this.s;
			var array = [];
			var j = 0;
			for (var i in states) {
				array[j] = i;
				j++;
			}
			return array;
		}
		var array = [];  // какие из состояний имеют переходы при наступлении полученного события
		var states = this.s;
		var j = 0;
		for (var i in states ) {
			var ev = states[i]["transitions"];
			for (var k in ev) {
				if (k === event) {	
			        array[j] = i;
					j++;
					}
				}
			}
		return array;
		
	}

    /**
     * Goes back to previous state.
     * Returns false if undo is not available.
     * @returns {Boolean}
     */
    undo() { // возвращемся в исходное состояние
		
		if (this.prevState === null) { // если переходов между состояниями еще не было
			return false;
		}
		if (this.count === 0) { // если было возвращение в исходное состояние, а переходов после этого не было
			return false;
		}
		var state = this.curState;
		this.curState = this.prevState;
		this.prevState = state;
		this.count--;
		return true;
		 
	}

    /**
     * Goes redo to state.
     * Returns false if redo is not available.
     * @returns {Boolean}
     */
    redo() { // 
		if (this.prevState === null) {
			return false;
		}
		if (this.count < 0 || this.count === 1) {
			return false;
		}
		var state = this.curState;
		this.curState = this.prevState;
		this.prevState = state;
		this.count++;
	    if (this.count < 0) {
			return false;
		}
		return true;
	}

    /**
     * Clears transition history
     */
    clearHistory() { // удаление информации о предыдущем и текущем состоянии
		this.curState = this.i;
		this.prevState = null;
	}
}

module.exports = FSM;

/** @Created by Uladzimir Halushka **/
