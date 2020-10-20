let s = $("#data").html();
let s_animate = $("#animateAll").html();
$(document).ready(function () {

    let arrival = [];
    let burst = [];
    let Completion = [];
    let tat = [];
    let wt = [];
    let arrival_sort=[];
    //when add buttton clicked then animation and data in the row are deleted.
    function deleteOther() {
        $("#data").html(s);
        $("#animateAll").html(s_animate);
        makeHide();
    }

    //makevisible other column
    function makeVisible() {
        $(".ans").css("visibility", "visible");
        $(".avg").css("visibility", "visible");
    }

    //Add process;
    let lst=1;
    $("#add").click(function () {
        let n = $("#process").val();
        deleteOther();
        for (let i = 1; i < n; i++) {
            $("#data").append(s);
            $("#data .cen").eq(i * 3).text(i);
            lst=i+1;
        }
    });
    
    $("#add_row").click(function(){
        let n=$("#process").val();
        $("#process").val(parseInt(n)+1);
        $("#data").append(s);
        $("#data .cen").eq(lst * 3).text(lst);
        lst++;
    });

    $("#delete_row").click(function(){
        lst--;
        if(lst<0)
        {
            lst=0;
            return;
        }
        let n=$("#process").val();
        $("#process").val(parseInt(n)-1);
        console.log(lst);
        $("#data").children(".cen").eq(lst*3+2).remove();
        $("#data").children(".cen").eq(lst*3+1).remove();
        $("#data").children(".cen").eq(lst*3).remove();
        $("#data").children(".ans").eq(lst*3+2).remove();
        $("#data").children(".ans").eq(lst*3+1).remove();
        $("#data").children(".ans").eq(lst*3).remove();
    }); 

    //Animation function
    function fun_animation() 
    {
        let n = $("#process").val();
        let last = 0;
        let i = -1;
        for (let j = 0; j < n; j++) {
            if (last < arrival_sort[j][0]) {
                i++;
                $("#animateAll").append(s_animate);
                $(".animation").eq(i).css("visibility", "visible");
                $(".animation").eq(i).text("Waste");
                $(".animation").eq(i).css("background-color", "black");
                $(".animation").eq(i).css("color", "white");
                $(".start").eq(i).text(last);
                let cur = 50 * (arrival_sort[j][0] - last);
                $(".animation").eq(i).animate({
                    width: cur
                }, 500);
                last = arrival_sort[j][0];
                j--;
                continue;
            }
            let cur = 50 * burst[arrival_sort[j][1]];
            i++;
            $("#animateAll").append(s_animate);
            $(".animation").eq(i).css("visibility", "visible");
            $(".animation").eq(i).text("P" + arrival_sort[j][1]);
            $(".start").eq(i).text(last);

            if (j % 2)
                $(".animation").eq(i).css("background-color", "lightblue");
            else
                $(".animation").eq(i).css("background-color", "red");

            $(".animation").eq(i).animate({
                width: cur
            }, 1000);
            last = Completion[arrival_sort[j][1]];
        }
        i++;
        $("#animateAll").append(s_animate);
        $(".start").eq(i).text(last);
    }

    //algorithm
    $("#compute").click(function () {
        
        makeAnimationHide();

        let n = $("#process").val();
        let texts = $(".cen").map(function () {
            return $(this).val();
        }).get();
        console.log(texts);

        arrival.length = 0;
        burst.length = 0;
        arrival_sort.length=0;

        for (let i = 0; i < texts.length; i++) {
            if (i % 3 == 0)
                continue;
            else if (i % 3 == 1) {
                if (texts[i] == "") {
                    alert("Enter number");
                    makeHide();
                    return;
                }
                arrival.push(parseInt(texts[i]));
                arrival_sort.push([parseInt(texts[i]),arrival_sort.length]);
            }
            else {
                if (texts[i] == "") {
                    alert("Enter number");
                    makeHide();
                    return;
                }
                burst.push(parseInt(texts[i]));
            }
        }
        // console.log(process);
        console.log(arrival);
        console.log(burst);
        Completion.length = n;
        wt.length = n;
        tat.length = n;
        let count = 0, last = 0;

        arrival_sort.sort();
        console.log(arrival_sort);
        //compute Completion time
        while (count < n) {
            if (last >= arrival_sort[count][0])
                Completion[arrival_sort[count][1]] = last + burst[arrival_sort[count][1]];
            else {
                last = arrival_sort[count][0];
                Completion[arrival_sort[count][1]] = last + burst[arrival_sort[count][1]];
            }
            last = Completion[arrival_sort[count][1]];
            count++;
        }
        count = 0;
        //compute Turn Around Time and Waiting Time
        while (count < n) {
            tat[count] = Completion[count] - arrival[count];
            wt[count] = tat[count] - burst[count];
            count++;
        }

        console.log(Completion);
        console.log(tat);
        console.log(wt);
        
        //give value to our html table
        var avg_tat=0,avg_wat=0;
        for (let i = 0, j = 0; i < 3 * n; i += 3, j++) {
            $("#data .ans").eq(i).text(Completion[j]);
            $("#data .ans").eq(i + 1).text(tat[j]);
            $("#data .ans").eq(i + 2).text(wt[j]);
            avg_tat+=tat[j];
            avg_wat+=wt[j];
        }

        $("#avg_tat").text(Math.round(avg_tat/n*100)/100);
        $("#avg_wat").text(Math.round(avg_wat/n*100)/100);

        makeVisible();

        fun_animation();

    });

    function makeAnimationHide()
    {
        $(".animation").css("width", 0);
        $(".animation").css("color", "black");
        $(".animation").text("");
        $(".start").text("");
    }
    //this function make hide and give the text to null
    function makeHide() {
        $(".cen").val("");
        $(".ans").css("visibility", "hidden");
        $(".avg").css("visibility", "hidden");
        makeAnimationHide();
        // $(".animation").css("visibility","hidden");
    }

    //reset the button
    $("#reset").click(makeHide);
    
});