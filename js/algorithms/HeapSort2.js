define(["../support"], function(support) {
	swap=support.swap;
	addStep=support.addStep;
	return {
		"name":"Heapsort",
		"complexity":"O(n log n)",
	    "code":function() {
			var steps=[];
			var comparisons=[];
			var index=[];
			var cmp=0;
			var first=true;

			function heapsort(list) {
			    for (var i = Math.floor((list.length - 1) / 2); i >= 0; i--) {
			        Adjust(list, i, list.length - 1);
			    }

			    for (var i = list.length - 1; i >= 1; i--) {

			    	steps.push([]);

			    	index.push([-1,-1,-1,0,i]);

			    	comparisons.push({
	            		cmp:cmp,
	            		index:support.cloneArray(index)
	            	});
	            	index=[];


			    	

			    	/*
			        var temp = list[0],
			        	temp1= list[i];

			        addStep(steps,temp1,i,0,comparisons[comparisons.length-1]);
			    	addStep(steps,temp,0,i,comparisons[comparisons.length-1]);

			        list[0] = list[i];
			        list[i] = temp;
			        */
			        swap(steps,list,i,0,comparisons[comparisons.length-1]);
			        Adjust(list, 0, i - 1);
			                
			    }

			    return list;
			}

			function Adjust(list, i, m) {

				

			    var temp = list[i],
			    	temp_i=i;//list.indexOf(temp);

			    var j = i * 2 + 1;
			    while (j <= m) {
			    	index.push([i,temp_i,j,-1,-1]);

			        if (j < m) {
			        	if(list[j].value < list[j + 1].value) {
			        		j = j + 1;
			        	}
			        }
			        if(temp.value < list[j].value) {

			        	comparisons.push({
		            		cmp:cmp,
		            		index:support.cloneArray(index)
		            	});
		            	index=[];

			        	//var temp_j=list[j];
			        	steps.push([]);
			        	addStep(steps,list[j],j,i,comparisons[comparisons.length-1],{
			        		value:temp.value,
			        		pos:temp_i,
			        		id:temp.id
			        	});
			            list[i] = list[j];
			            i = j;
			            j = 2 * i + 1;
			        } else {
			            j = m + 1;
			        }
			        cmp++;
			    }

			    steps.push([]);

			    index.push([i,temp_i,j,-1,-1]);


			    comparisons.push({
            		cmp:cmp,
            		index:support.cloneArray(index)
            	});
            	index=[];


			    addStep(steps,temp,temp_i,i,comparisons[comparisons.length-1]);
			    list[i] = temp;

			}

			return function(array) {
				steps=[];
				heapsort(array,0,array.length-1);
				
				steps=steps.filter(function(d){
					return d.length>0;
				});

				//console.log("STEP vs COMPLEXITY",steps.map(function(d){
					//return d[0].cmp.cmp;
				//}))
				//console.log("COMPARISONS",(comparisons))
				//console.log("COMPLEXITY",comparisons[comparisons.length-1],steps[steps.length-1][0].cmp)

				return steps;
			}
		}
	}
});