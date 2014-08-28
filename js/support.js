/* SUPPORT FUNCTIONS */
define(
	function() {

		var swapItems = function(array, a, b){
		    array[a] = array.splice(b, 1, array[a])[0];
		    return array;
		}

		function addStep(steps,index,from,to, cmp,tmp) {
			//console.log(index,from,"->",to)
			if(from==to)
				return;

			steps[steps.length-1].push({
	        	index:index.value,
	        	id:index.id,
	        	from:from,
	        	to:to,
	        	cmp:cmp,
	        	tmp:tmp
	        });
		}
		
		function swap(steps,list, a, b, cmp) {
			if(steps){//} && list[a].value!=list[b].value) {
				steps.push([]);
				addStep(steps,list[a],a,b,cmp);
				addStep(steps,list[b],b,a,cmp);
			}

			swapItems(list,a,b);
			/*
			var tmp=list[a];
			list[a]=list[b];
			list[b]=tmp;
			*/

		}

		function cloneArray(A) {
			var B=[];
			for(var i=0;i<A.length;i++) {
				B.push(A[i]);
			}
			return B;
		}

		//var pos=items[current_step].map(function(e) { return e.id; }).indexOf(d.id);
		function arrayObjectIndexOf(A, searchTerm, property) {
			//console.log("searching for",property,searchTerm,"in",A)
		    for(var i = 0, len = A.length; i < len; i++) {
		        if (A[i] && (A[i][property] === searchTerm) && !A[i].moved) return i;
		    }
		    return -1;
		}

		function findPos(obj) {
			var curleft = curtop = 0;
			if (obj.offsetParent) {
				do {
					curleft += obj.offsetLeft;
					curtop += obj.offsetTop;
				} while (obj = obj.offsetParent);
			}
			return [curleft,curtop];
		}

		function isTouchDevice() {

		    return (('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch);

		};

		return {
			addStep:addStep,
			swap:swap,
			swapItems:swapItems,
			cloneArray:cloneArray,
			findPos:findPos,
			indexOf:arrayObjectIndexOf,
			colors:{
				"gold":"53,100%,50%",
				"blue":"199,86%,53%",
				//"blue2":"202,100%,41%",
				"red":"333,100%,50%",
				"orange":"24,87%,50%",
				"limegreen":"87,100%,50%",
				//"tan":"41,32%,62%",
				"crimson":"346,100%,42%"
			},
			items:[5,10,20,50,75,100],
			sizes:[1.5,2,3],
			initial_conditions:{
				"rnd": "randomly ordered",
				"nrl": "nearly sorted",
				"rvr": "reverse sorted",
				"few": "few unique"
			},
			isTouchDevice:isTouchDevice
		}
	}
);