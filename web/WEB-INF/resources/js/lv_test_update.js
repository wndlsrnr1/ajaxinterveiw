window.addEventListener('DOMContentLoaded', function(){

    //변수
    //Object 이기 때문에 반복 가능한 형태가 아니지만, 숫자를 값으로 받아 반복분 내에서 반복 가능 설정하여 일괄처리를 위해 만들었음.
    //oject -> array -> entry를 가진 Arrays로 변환하지 않더라도 사용 가능 하기 때문에

    let tdNamePairsEng = {"0":"seq", "1":"subject", "2":"lt_1", "3":"lt_2", "4":"lt_3"};
    let tdNamePairsKor = {"0":"일련번호", "1":"제목", "2":"항목1", "3":"항목2", "4":"항목3"};
    let tdLength = Object.keys(tdNamePairsEng).length;

    //전역 변수는 쓰면 안되지만, 임시적으로 데이터가 보내지지 않은 경우는 고려하고 사용함.
    let submitDataMemory = new Array();


    //기본적 표 틀 만들기
    function mkDOM(){


        //DOM Objects 만들기.
        let editTable = document.createElement("table");
        editTable.classList.add("edit_table")
        let editTbody = document.createElement("tbody");
        let editTrKeyContainer = document.createElement("tr");
        editTbody.append(editTrKeyContainer);
        let editTrValueContainer = document.createElement("tr");
        editTbody.append(editTrValueContainer);


        //붙이기
        document.querySelector("body").append(editTable);
        editTable.append(editTbody);

        //tr 구분
        let trTags = document.querySelectorAll(".edit_table>tbody>tr")

        //tr tag에 btn-open-popup class 넣기.
        trTags.forEach((tr) => {tr.classList.add("btn-open-popup")});

        let tempTr1 = trTags[0];
        let tempTr2 = trTags[1];

        for(let i = 0; i < tdLength; i++){
            let tdKey = document.createElement("td");
            tdKey.innerHTML = tdNamePairsKor[i];

            let tdValue = document.createElement("td");
            tdValue.innerHTML = "예시";

            tempTr1.append(tdKey);
            tempTr2.append(tdValue);
        }

        //전송버튼 만들기
        let submit = document.createElement("input");
        submit.type = "button"
        submit.value = "전송"
        submit.classList.add("ajax_submit")
        document.querySelector("body").lastChild.after(submit);

        //업데이트버튼 만들기
        let updateResultTable = document.createElement("input")
        updateResultTable.type = "button"
        updateResultTable.value = "업데이트"
        updateResultTable.classList.add("result_update")
        document.querySelector("body").lastChild.after(updateResultTable);

        //재전송 버튼 만들기


        let submitResultH3 = document.createElement("h3");
        submitResultH3.classList.add("submit_result");
        submitResultH3.innerHTML = "전송 여부: "
        document.querySelector("body").lastElementChild.after(submitResultH3);

        let nSubmitList = document.createElement("h3");
        nSubmitList.classList.add("not_submit");
        nSubmitList.innerHTML = "전송 되지 않은 데이터 목록: " + ""
        document.querySelector(".submit_result").after(nSubmitList);
    }

    //textarea dom 추가하고 반환하는 함수
    //addTdInput()에서 사용
    function mkTextArea(node){
        node.innerHTML = ""
        //textarea 설정
        let textArea = document.createElement("textarea");
        textArea.style.width = "50px";
        textArea.style.height = "20px";
        textArea.style.border = "none"
        textArea.style.resize = "none"
        textArea.style.overflow = "hidden"
        node.append(textArea);
        return textArea;
    }

    //팝업 내용 적용 및 닫기
    function popupSubmit(windowObj){
        //버튼 생성
        let button = document.createElement("input")
        button.value = "적용";
        button.type = "button"
        windowObj.document.querySelector("body").append(button);

        button.addEventListener("click", function (){
            let newTdList = windowObj.document.querySelectorAll(".btn-open-popup")[1].childNodes;
            let tdList = document.querySelectorAll(".btn-open-popup")[1].childNodes;
            console.log("firstChild: ")
            console.log(newTdList[0].firstChild);
            for(let i = 0; i < newTdList.length; i++){
                let newValue = newTdList[i].firstChild.value;
                if( newValue != undefined){
                    let newValue = newTdList[i].firstChild.value;
                    let td = tdList[i];
                    td.innerHTML = newValue;
                }
            }
            windowObj.close();
        })

    }

    //단순 팝업 닫기 버튼 추가.
    function popupClose(windowObj){
        let button = document.createElement("input")
        button.value = "취소";
        button.type = "button"
        windowObj.document.querySelector("body").append(button);

        button.addEventListener("click", function (){
            windowObj.close();
        })
    }

    //팝업창에서 값 누르면 textarea로 변하면서 수정가능 하게 함.
    function addTdInput(windowObj){
        let tempTrList = windowObj.document.documentElement.querySelectorAll(".btn-open-popup");
        let tdList = tempTrList[1].childNodes;

        tdList.forEach((td)=>{
            td.addEventListener("click", function (){
                mkTextArea(td).focus();
            }, {once:true})
        })
    }

    //팝업에 관련해서 종합 실행 함수
    function popupEvent(){

        let inputWindow = window.open("about:blank", '_blank',
            'location=no,' +
            'height=200,' +
            'width=400,' +
            'scrollbars=no,' +
            'status=no' +
            'titlebar=no' +
            'toolbar=no');
        let tableHTML = document.querySelector(".edit_table").innerHTML
        //이벤트 그대로 넣기기.
        let popupDOM = inputWindow.document;
        popupDOM.documentElement.innerHTML = "<table>"+tableHTML+"</table>"


        addTdInput(inputWindow);
        //hr 태그 추가
        let hr = document.createElement("hr")
        let body = popupDOM.querySelector("body")
        body.lastChild.after(hr);
        popupSubmit(inputWindow);
        popupClose(inputWindow);

        //popupTable style(start)
        let popupTableStyle = popupDOM.documentElement.querySelector("table").style;
        popupTableStyle.marginLeft = "auto"
        popupTableStyle.marginRight = "auto"
        popupTableStyle.width = "80%";
        popupTableStyle.height = "40%"
        popupTableStyle.border = "1px solid black"
        popupTableStyle.borderCollapse = "collapse"
        let popupTrList = popupDOM.documentElement.querySelectorAll("tr")
        let popupTdList = popupDOM.documentElement.querySelectorAll("td")
        let popupTbody = popupDOM.documentElement.querySelector("tbody")
        popupTdList.forEach((td)=>{td.style.border = "1px solid black"; td.style.borderCollapse = "collapse"})
        popupTrList.forEach((td)=>{td.style.border = "1px solid black"; td.style.borderCollapse = "collapse"})
        popupTbody.style.border = "1px solid black"; popupTbody.style.borderCollapse = "collapse"
        //popupTable style(end)

    }

    //제출할 데이터를 뽑음
    function returnSubmitData(){
        //제출할 데이터 object 변수
        let submitData = {};
        let valueTdList = document.querySelectorAll(".btn-open-popup")[1].childNodes;

        //
        valueTdList.forEach((td, index) => {
            Object.defineProperty(submitData, tdNamePairsEng[index], {
                value : td.innerHTML,
                writable: false
            })
        })

        return submitData;
    }

    //update 하기전 임시로 메모리에 저장
    function saveTempMemory(inputObj, dataMemoryArray, namePairsEng, success){
        //dataMemoryArray == submitDataMemory
        let isPresent = dataMemoryArray.some((obj)=>{
            return obj.seq == inputObj.seq;
        })


        let isObjectEqual = function (){
            if(dataMemoryArray.length == 0){
                return false
            }else {
                for(let i = 0; i < dataMemoryArray.length; i++){
                    for(let j = 0; j < namePairsEng.length; i++){
                        if(dataMemoryArray[i].namePairsEng[j] != inputObj.namePairsEng[j]){
                            return false
                        }
                    }
                }
                return true;
            }
        }
        console.log(isPresent)

        if (isPresent === true){
            if(isObjectEqual === true){
                console.log("같은 값을 입력 했습니다. ")
            }else if(isObjectEqual() === false){
                console.log("111")
                dataMemoryArray.push(inputObj);
            }else {
                console.log("같은 값을 입력했습니다.")
            }
        }else {
            console.log("222")
            dataMemoryArray.push(inputObj);
        }
        if(success == 1){
            dataMemoryArray.pop();
        }

    }
    //표에 td안에 있는 value

    //update는 되지 않았으나, 변경사항이 표에 반영 되게 함.
    function editTestTable(submitData){
        let tpTrList = document.querySelectorAll("#test_table tr");

        //여기에 객체 넣기
        let seqIndex = -1;
        tpTrList.forEach((tr, index)=>{
            if((index-1)%2 === 0){
                valueList.push(tr.children[0].innerHTML+"");
                seqIndex = index;
            }
        })

        let trIndex = -1;
        valueList.forEach((value, index)=>{
            if (value === submitData["seq"]){
                trIndex = index*2 + 1;
            }
        })

        //없을 때 추가함.
        if(trIndex == -1){
            let tr = document.createElement("tr")
            document.querySelector("#test_table").lastChild.after(tr)
            for(let i = 0; i < tdLength; i++){
                let td = document.createElement("td")
                td.innerHTML = submitData[tdNamePairsEng[i]];
                tr.append(td)
            }
            console.log(tdNamePairsEng[0])
            valueList.push(submitData[tdNamePairsEng[0]]);
        }else {
            //치환함.
            document.querySelectorAll("#test_table tr").forEach((tr, idx)=>{
                if(idx === trIndex){
                    for(let i = 0; i < tdLength; i++){
                        tr.children[i].innerHTML = submitData[tdNamePairsEng[i]]
                    }
                }
            })
        }

    }

    let valueList = [];

    //ajax POST시에 실행할 종합합수.
    function ajaxSubmit(){
        $.ajax({
            type: "POST",
            datatype: "json",
            url: "http://noriapp.iptime.org/lv_test/ajax/lv_test_update.php",
            data: returnSubmitData(),
            success: function (data){
                //inputObj, dataMemoryArray, namePairsEng
                let result = JSON.parse(data);
                let tdNamePairsEng = {"0":"seq", "1":"subject", "2":"lt_1", "3":"lt_2", "4":"lt_3"};
                let submitData = returnSubmitData();

                if(result.code == 1){
                    //데이터 수정
                    saveTempMemory(submitData, submitDataMemory, tdNamePairsEng, result.code);
                    let text = "데이터 갱신에 성공했습니다."
                    editTestTable(submitData);
                    document.querySelector(".submit_result").innerHTML = "전송 여부: " + text;

                }else if(result.code == 0){
                    //데이터 수정하지 않고 메모리에 저장?
                    saveTempMemory(returnSubmitData(), submitDataMemory, tdNamePairsEng, result.code);
                    let text = "데이터 갱신에 실패했습니다."
                    document.querySelector(".submit_result").innerHTML = "전송 여부: " + text;
                    editTestTable(submitData);
                }else {
                    saveTempMemory(returnSubmitData(), submitDataMemory, tdNamePairsEng, -1);
                    let text = "데이터를 전송하였으나 알 수 없는 오류가 발생하였습니다.";
                    document.querySelector(".submit_result").innerHTML = "전송 여부: " + text;
                    editTestTable(submitData);

                }
                document.querySelector(".not_submit").innerHTML = ""
                document.querySelector(".not_submit").innerHTML = "전송 되지 않은 데이터 목록: "
                submitDataMemory.forEach((object, index)=>{
                    if(object != undefined){
                        document.querySelector(".not_submit").innerHTML += "{"
                            for(let i = 0; i < tdLength; i++){
                                let key = tdNamePairsEng[i]
                                document.querySelector(".not_submit").innerHTML +=  key + " : "+ object[key] + ", ";
                            }
                        document.querySelector(".not_submit").innerHTML +=  "} \n"
                    }
                })



            },
            error: function (error){
                console.log(error)
                let result = "데이터를 전송하지 못하였습니다."
                submitDataMemory.add(returnSubmitData());
                document.querySelector(".submit_result").innerHTML = "전송 여부: " + result;
            },
        })
    }

    //업데이트 한 이후에 적용한 데이터를 서버에서 다시 받아옴.
    function updateResultTable() {
        return new Promise(()=>{
            document.querySelector("#test_table").remove();
            ajaxGet();
        });
    }

    mkDOM();

    //submit button에 클릭이벤트 추가
    document.querySelector(".ajax_submit").addEventListener("click", ajaxSubmit)

    //update button에 클릭이벤트 추가 단순히 서버에서 업데이트만 다시 받아옴.
    document.querySelector(".result_update").addEventListener("click", function (){
        updateResultTable().then(function (){
            // editTestTable(returnSubmitData());
        })
    })

    //btn-open-popup에 click event 추가, 실행
    let bopList = document.querySelectorAll(".btn-open-popup")
    bopList.forEach((bop)=>{bop.addEventListener("click", popupEvent)})


})