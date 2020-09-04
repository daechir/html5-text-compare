/***************************************************
html5-text-compare.js
Diffing text in 150 lines or less (Comments excluded).

Author: Daechir
Author URL: https://github.com/daechir
Modified Date: 09/04/20
Version: v1a
***************************************************/

$(function(){
    /*****************************************************************************
    CompareEqual

    a1 or array1 = first array
    a2 or array2 = second array
    *****************************************************************************/
	function CompareEqual(a1,a2) {
		for (var i = 0; i < a1.length; i++) {
			if(a1[i] === a2[i]) {
				continue;
			} else {
				a1[i] = "<span class='right'>" + a1[i] + "</span>";
				a2[i] = "<span class='right'>" + a2[i] + "</span>";
			}
		}

		return a1,a2;
	}

    /*****************************************************************************
    CompareInequal

    a1 or array1 = first array
    a2 or array2 = second array
    *****************************************************************************/
    function CompareInequal(a1,a2) {
        var arrD1 = a2.filter(x => !a1.includes(x));
        var arrD2 = a1.filter(x => !a2.includes(x));
        var arrN = [];
        var arrL;

        for (var i = 0; i < a2.length; i++) {
          arrN.push(a2[i]);
        }

        for (var i = 0; i < arrN.length; i++) {
          for (var i2 = 0; i2 < arrD1.length; i2++) {
            arrL = arrD1[i2].length/2;
            if (arrD1[i2].indexOf(arrN[i]) !== -1 && arrN[i].length >= arrL) {
              for (var i3 = 0; i3 < arrD2.length; i3++) {
                if (arrD1[i2].indexOf(arrD2[i3]) !== -1 && arrD2[i3].length >= arrL) {
                  arrN[i] = arrD2[i3];
                }
              }
            }
          }
        }

        for (var i = 0; i < arrN.length; i++) {
          for (var i2 = 0; i2 < arrD2.length; i2++) {
            arrL = arrD2[i2].length/2;
            if (arrD2[i2].indexOf(arrN[i]) !== -1 && arrN[i].length >= arrL) {
              arrN[i] = arrD2[i2];
            }
          }
        }

        for (var i = 0; i < arrN.length; i++) {
          for (var i2 = 0; i2 < arrD1.length; i2++) {
            if (arrD1[i2] === arrN[i]) {
              arrN[i] = "        ";
            }
          }
        }

        return arrN;
    }

    /*****************************************************************************
    CompareOut

    a1 or array1 = first array
    a2 or array2 = second array
    a3 or arg3 = target parent element
    *****************************************************************************/
	function CompareOut(a1,a2,a3) {
		var compareoutleft = "<p>";
		var compareoutright = "<p>";

		for (var i = 0; i < a1.length; i++) {
			compareoutleft = compareoutleft + "<span class='left'>" + i + "</span>" + a1[i] + "\n";
		}

		for (var i = 0; i < a2.length; i++) {
			compareoutright = compareoutright + "<span class='left'>" + i + "</span>" + a2[i] + "\n";
		}

		compareoutleft = compareoutleft + "</p>";
		compareoutright = compareoutright + "</p>";

		a3.find("p").remove();

		a3.find("ul li").eq(0).append(compareoutleft);
		a3.find("ul li").eq(1).append(compareoutright);

		a3.find("span.left").addClass("number");
		a3.find("span.right").addClass("highlight");
		a3.find("p").animate({opacity: "100"}, 2000);
	}

	/* Global Variables */
	var formele = $("form");
	var compareleft,compareright;
	var comparedele = $("div");

	formele.submit(function(e){
		e.preventDefault();

		/* If textareas aren't empty execute */
		if (formele.find("textarea").val().length) {
			/* Next parse the textareas, put them into an array and split them into lines */
			compareleft = formele.find("textarea").eq(0).val().split("\n");
			compareright = formele.find("textarea").eq(1).val().split("\n");

            /* First passthrough, find the differences */
            if (compareleft.length === compareright.length) {
              CompareEqual(compareleft,compareright);
            } else if (compareleft.length < compareright.length) {
              compareleft = CompareInequal(compareleft,compareright);
              CompareEqual(compareleft,compareright);
            } else {
              compareright = CompareInequal(compareright,compareleft);
              CompareEqual(compareleft,compareright);
            }

			/* Second passthrough, output the results to DOM */
			CompareOut(compareleft,compareright,comparedele);
		}
	});
});
