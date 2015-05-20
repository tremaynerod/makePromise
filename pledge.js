/*----------------------------------------------------------------
Promises Workshop: build the pledge.js deferral-style promise library
----------------------------------------------------------------*/
// YOUR CODE HERE:


function $Promise () {
	this.state = 'pending';
	this.value = null;
	this.handlerGroups = [];
};

$Promise.prototype.catch = function(funcArg){
	this.then.call(this, null, funcArg);
}
$Promise.prototype.then = function(func1, func2){
	this.handlerGroups.push({});
	var deferral = new Deferral();
	this.handlerGroups[this.handlerGroups.length-1].forwarder = deferral;
	this.handlerGroups[this.handlerGroups.length-1].successCb = (typeof func1 === 'function') ? func1 : (func1 = null);
	this.handlerGroups[this.handlerGroups.length-1].errorCb = (typeof func2 === 'function') ? func2 : (func2 = null);
	
	if(!func1 && !func2) return deferral.$promise;
	console.log(func1);
	
	this.callHandlers(func1, func2);
	//return deferral.$promise;//this.handlerGroups[this.handlerGroups.length-1].forwarder.$promise;
};

$Promise.prototype.callHandlers = function(func1, func2){
	var len = arguments.length;

	if(func2) {
		if(this.state === 'resolved'){
			func1(this.value)
		}else if(this.state === 'rejected'){
			func2(this.value)
		}
	}else if(func1){
		if(this.state === 'resolved'){
			func1(this.value)
		}else if(this.state === 'rejected'){
			//return this;
		}
	}
}



function Deferral () {
	this.$promise = new $Promise
};
	
Deferral.prototype.resolve = function(objArg) {
	if(this.$promise.state === 'pending'){
		this.$promise.value = objArg;
		this.$promise.state = 'resolved';
				
		var that = this;
		this.$promise.handlerGroups.forEach(function(group){
			that.$promise.callHandlers(group.successCb, group.errorCb)

			group.forwarder.resolve(that.$promise.value);

		})
		this.$promise.handlerGroups.shift();
	}	
};

// Deferral.prototype.$promise = function(){
// 	return new $Promise;
// };

Deferral.prototype.reject = function(arg) {
	if(this.$promise.state === 'pending'){
		this.$promise.value = arg;
		this.$promise.state = 'rejected';

		var that = this;
		this.$promise.handlerGroups.forEach(function(group){
			that.$promise.callHandlers(group.successCb, group.errorCb)

			group.forwarder.reject(that.$promise.value);
		})
		this.$promise.handlerGroups.shift();
	}
};

var defer = function(Arg){	
	return new Deferral;
};






/*-------------------------------------------------------
The spec was designed to work with Test'Em, so we don't
actually use module.exports. But here it is for reference:

module.exports = {
  defer: defer,
};

So in a Node-based project we could write things like this:

var pledge = require('pledge');
…
var myDeferral = pledge.defer();
var myPromise1 = myDeferral.$promise;
--------------------------------------------------------*/
