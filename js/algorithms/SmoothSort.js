define(["../support"], function(support) {
	swap=support.swap;
	addStep=support.addStep;
	return {
		"name":"Smoothsort",
		"complexity":"O(n log n)",
		"wiki":"http://en.wikipedia.org/wiki/Smoothsort",
	    "code":function() {
			var steps=[];
			var comparisons=[];
			var index=[];
			var cmp=0;

			var compare = ascending;

			// Leonardo numbers.
			var LP = [
				1, 1, 3, 5, 9, 15, 25, 41, 67, 109, 177, 287, 465, 753, 
				1219, 1973, 3193, 5167, 8361, 13529, 21891, 35421, 57313, 92735,
				150049, 242785, 392835, 635621, 1028457, 1664079, 2692537, 
				4356617, 7049155, 11405773, 18454929, 29860703, 48315633, 78176337,
				126491971, 204668309, 331160281, 535828591, 866988873
				];

			function sort(m, lo, hi) {

		      if (arguments.length === 1) {
		        lo = 0;
		        hi = m.length - 1;
		      }
		      if (hi > LP[32]) {
		        throw {error: "Maximum length exceeded for smoothsort implementation."};
		      }
		      var head = lo,
		          p = 1,
		          pshift = 1,
		          trail;

		      while (head < hi) {

		      	index.push([p,head,head,-1,-1,-1]);

		        if ((p & 3) === 3) {
		          sift(m, pshift, head,p);
		          p >>>= 2;
		          pshift += 2;
		        } else {
		          if (LP[pshift - 1] >= hi - head) {
		          	trinkle(m, p, pshift, head, false);
		          } else {
		          	sift(m, pshift, head,p);
		          }
		          if (pshift === 1) {
		            p <<= 1;
		            pshift--;
		          } else {
		            p <<= (pshift - 1);
		            pshift = 1;
		          }
		        }
		        p |= 1;
		        head++;
		       
		      }
		      trinkle(m, p, pshift, head, false);

		      while (pshift !== 1 || p !== 1) {
		        
		      	index.push([p,head,head,-1,-1,-1]);

		        if (pshift <= 1) {
		          trail = trailingzeroes(p & ~1);
		          p >>>= trail;
		          pshift += trail;
		        } else {
		          p <<= 2;
		          p ^= 7;
		          pshift -= 2;



		          trinkle(m, p >>> 1, pshift + 1, head - LP[pshift] - 1, true);
		          trinkle(m, p, pshift, head - 1, true);
		        }

		        head--;
		        
		      }
		      
		    }

			function trinkle(m, p, pshift, head, trusty) {
		      var val = m[head],
		          stepson,
		          mstepson,
		          rt,
		          lf,
		          trail;
		      
		      var val_old_pos=head;
		      
		      
		      while (p !== 1) {
		        stepson = head - LP[pshift];

		        if (compare(mstepson = m[stepson], val) <= 0) break;
		        //steps.push([]);
		        if (!trusty && pshift > 1) {
		          rt = head - 1;
		          lf = head - 1 - LP[pshift - 2];
		          if (compare(m[rt], mstepson) >= 0 || compare(m[lf], mstepson) >= 0) {
		            break;
		          }
		        }

		        steps.push([]);

		        index.push([p,head,val_old_pos,stepson,-1,-1]);

		        comparisons.push({
            		cmp:cmp,
            		index:support.cloneArray(index)
            	});
            	index=[];

		        addStep(steps,mstepson,m.indexOf(mstepson),head,comparisons[comparisons.length-1],{
		        	value:val.value,
		        	pos:val_old_pos,
				    id:val.id
		        });
		        m[head] = mstepson;
		        

		        head = stepson;
		        trail = trailingzeroes(p & ~1);
		        p >>>= trail;
		        pshift += trail;
		        trusty = false;
		        
		        cmp++;
		      }
		      if (!trusty) {

		      	steps.push([]);

		      	index.push([p,head,val_old_pos,stepson,-1,-1]);
		      	comparisons.push({
            		cmp:cmp,
            		index:support.cloneArray(index)
            	});
            	index=[];

		        addStep(steps,val,val_old_pos,head,comparisons[comparisons.length-1]);
		        m[head] = val;
		        
		        sift(m, pshift, head,p);
		      }
		      
		    }

			function sift(m, pshift, head, p) { //p just for tracking purposes
		      var rt,
		          lf,
		          mrt,
		          mlf,
		          val = m[head];
		      var val_old_pos=head;
		      
		      while (pshift > 1) {
		      	
		      	

		        rt = head - 1;
		        lf = head - 1 - LP[pshift - 2];
		        mrt = m[rt];
		        mlf = m[lf];

		        //

		        if (compare(val, mlf) >= 0 && compare(val, mrt) >= 0) break;
		        

		        
		        index.push([p,head,val_old_pos,-1,lf,rt]);

		        if (compare(mlf, mrt) >= 0) {
		          	
		          	

		           	comparisons.push({
						cmp:cmp,
						index:support.cloneArray(index)
					});
					index=[];

					steps.push([]);
					addStep(steps,mlf,m.indexOf(mlf),head,comparisons[comparisons.length-1],{
						value:val.value,
						pos:val_old_pos,
				    	id:val.id
					});
					m[head] = mlf;

					head = lf;
					pshift--;
		        } else {
		          	
		        	

		        	comparisons.push({
						cmp:cmp,
						index:support.cloneArray(index)
					});
					index=[];

					steps.push([]);
					addStep(steps,mrt,m.indexOf(mrt),head,comparisons[comparisons.length-1],{
						value:val.value,
						pos:val_old_pos,
						id:val.id
					});

					m[head] = mrt;

					head = rt;
					pshift -= 2;
		        }
		        
		        cmp++;
		      }
		      
		      
		      index.push([p,head,val_old_pos,-1,-1,-1]);
		      comparisons.push({
					cmp:cmp,
					index:support.cloneArray(index)
			  });
			  index=[];

			  steps.push([]);
		      addStep(steps,val,val_old_pos,head,comparisons[comparisons.length-1]);
		      m[head] = val;

		      
		    }

			// Solution for determining number of trailing zeroes of a number's binary representation.
			// Taken from http://www.0xe3.com/text/ntz/ComputingTrailingZerosHOWTO.html
			var MultiplyDeBruijnBitPosition = [
				0,  1, 28,  2, 29, 14, 24, 3,
				30, 22, 20, 15, 25, 17,  4, 8,
				31, 27, 13, 23, 21, 19, 16, 7,
				26, 12, 18,  6, 11,  5, 10, 9];

			function trailingzeroes(v) {
				return MultiplyDeBruijnBitPosition[(((v & -v) * 0x077CB531) >> 27) & 0x1f];
			}

			function ascending(a, b) {
				return a.value < b.value ? -1 : a.value > b.value ? 1 : a.value >= b.value ? 0 : NaN;
			}

			return function(array) {
				steps=[];
				sort(array,0,array.length-1);
				
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